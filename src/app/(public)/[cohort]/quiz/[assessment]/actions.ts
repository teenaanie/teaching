"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { QuizQuestion } from "@/lib/types";

export type QuizResult =
  | { ok: false; error: string }
  | {
      ok: true;
      score: number;
      max: number;
      review: { prompt: string; options: string[]; chosen: number | null; answer: number; explanation: string | null }[];
    };

/**
 * Grades a quiz. Students have no accounts: the roll number must be enrolled in the
 * cohort and the PIN must match the cohort's current quiz PIN. One attempt per student.
 */
export async function submitQuiz(_prev: QuizResult | null, form: FormData): Promise<QuizResult> {
  const cohortId = String(form.get("cohortId") ?? "");
  const assessmentId = String(form.get("assessmentId") ?? "");
  const rollNo = String(form.get("rollNo") ?? "").trim();
  const pin = String(form.get("pin") ?? "").trim();
  if (!rollNo || !pin) return { ok: false, error: "Enter your roll number and the class PIN." };

  const db = createAdminClient();
  const [{ data: secret }, { data: setting }, { data: enrolment }] = await Promise.all([
    db.from("cohort_secrets").select("quiz_pin").eq("cohort_id", cohortId).maybeSingle(),
    db.from("cohort_assessments").select("is_open").eq("cohort_id", cohortId).eq("assessment_id", assessmentId).maybeSingle(),
    db.from("enrolments").select("student_id").eq("cohort_id", cohortId).ilike("roll_no", rollNo.replace(/[%_\\]/g, "\\$&")).eq("status", "active").maybeSingle(),
  ]);
  if (!setting?.is_open) return { ok: false, error: "This quiz is closed." };
  if (!secret || secret.quiz_pin !== pin) return { ok: false, error: "That PIN isn't right. Check the board." };
  if (!enrolment) return { ok: false, error: "We couldn't find that roll number in this class." };

  const { data: questions, error } = await db
    .from("quiz_questions")
    .select("*")
    .eq("assessment_id", assessmentId)
    .order("position");
  if (error || !questions?.length) return { ok: false, error: "This quiz has no questions yet." };

  const answers: Record<string, number | null> = {};
  let score = 0;
  for (const q of questions as QuizQuestion[]) {
    const raw = form.get(`q-${q.id}`);
    const chosen = raw === null ? null : Number(raw);
    answers[q.id] = chosen;
    if (chosen === q.answer_index) score++;
  }
  const max = questions.length;

  const { error: insertError } = await db.from("quiz_attempts").insert({
    cohort_id: cohortId,
    assessment_id: assessmentId,
    student_id: enrolment.student_id,
    answers,
    score,
    max_score: max,
  });
  if (insertError) {
    if (insertError.code === "23505") return { ok: false, error: "You've already submitted this quiz." };
    return { ok: false, error: "Couldn't save your answers. Please tell the teacher." };
  }

  // Scale to the assessment's max score for the gradebook.
  const { data: assessment } = await db.from("assessments").select("max_score").eq("id", assessmentId).single();
  await db.from("scores").upsert({
    cohort_id: cohortId,
    assessment_id: assessmentId,
    student_id: enrolment.student_id,
    score: (score / max) * Number(assessment?.max_score ?? max),
    source: "quiz",
    updated_at: new Date().toISOString(),
  });

  return {
    ok: true,
    score,
    max,
    review: (questions as QuizQuestion[]).map((q) => ({
      prompt: q.prompt,
      options: q.options,
      chosen: answers[q.id],
      answer: q.answer_index,
      explanation: q.explanation,
    })),
  };
}
