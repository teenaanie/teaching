"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAnswers, type FeedbackQuestion } from "@/lib/feedback";
import { clearStudentSession, getStudentSession, normaliseCode, respondentKey, setStudentSession } from "@/lib/student-session";
import {
  cleanLink,
  fileProblem,
  MAX_FILES,
  safeFileName,
  SUBMISSION_BUCKET,
  submissionFolder,
  type SubmittedFile,
} from "@/lib/submissions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function studentSignIn(cohortId: string, slug: string, _prev: string | null, form: FormData): Promise<string | null> {
  const roll = String(form.get("rollNo") ?? "").trim();
  const code = normaliseCode(String(form.get("code") ?? ""));
  if (!roll || !code) return "Enter your roll number and your code.";
  const { data } = await createAdminClient()
    .from("enrolments")
    .select("student_id, access_code")
    .eq("cohort_id", cohortId)
    .eq("status", "active")
    .ilike("roll_no", roll.replace(/[%_\\]/g, "\\$&"))
    .maybeSingle();
  if (!data?.access_code || data.access_code !== code) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return "That roll number and code don't match. Check your slip or ask your teacher.";
  }
  await setStudentSession(cohortId, data.student_id);
  redirect(`/${slug}/me`);
}

export async function studentSignOut(slug: string) {
  await clearStudentSession();
  redirect(`/${slug}/me`);
}

// ---------------------------------------------------------------------------
// Assignment submissions
// ---------------------------------------------------------------------------


export type UploadTicket = { path: string; token: string };
export type ActionError = { ok: false; error: string };

/** Checks the student is signed in and the assignment is taking submissions. */
async function submissionContext(cohortId: string, assessmentId: string) {
  const studentId = await getStudentSession(cohortId);
  if (!studentId) return { error: "Your sign-in has expired. Sign in again on My progress." } as const;
  const db = createAdminClient();
  const [{ data: setting }, { data: enrolment }] = await Promise.all([
    db.from("cohort_assessments").select("accept_submissions").eq("cohort_id", cohortId).eq("assessment_id", assessmentId).maybeSingle(),
    db.from("enrolments").select("status").eq("cohort_id", cohortId).eq("student_id", studentId).maybeSingle(),
  ]);
  if (enrolment?.status !== "active") return { error: "Your account isn't active in this class." } as const;
  if (!setting?.accept_submissions) return { error: "This assignment isn't taking submissions right now." } as const;
  return { db, studentId } as const;
}

/** One-time upload links for the files the student picked. The browser uploads directly. */
export async function requestUploads(
  cohortId: string,
  assessmentId: string,
  files: { name: string; size: number }[],
): Promise<{ ok: true; tickets: UploadTicket[] } | ActionError> {
  const ctx = await submissionContext(cohortId, assessmentId);
  if ("error" in ctx) return { ok: false, error: ctx.error! };
  if (files.length > MAX_FILES) return { ok: false, error: `You can attach up to ${MAX_FILES} files.` };
  for (const f of files) {
    const problem = fileProblem(f);
    if (problem) return { ok: false, error: problem };
  }
  const folder = submissionFolder(cohortId, assessmentId, ctx.studentId);
  const tickets: UploadTicket[] = [];
  for (const [i, f] of files.entries()) {
    const path = `${folder}${Date.now()}-${i}-${safeFileName(f.name)}`;
    const { data, error } = await ctx.db.storage.from(SUBMISSION_BUCKET).createSignedUploadUrl(path);
    if (error || !data) return { ok: false, error: "Couldn't start the upload. Please try again." };
    tickets.push({ path, token: data.token });
  }
  return { ok: true, tickets };
}

/**
 * Saves (or replaces) the student's submission. `files` are the files to keep: earlier
 * uploads the student didn't remove plus the ones just uploaded. Files dropped from the
 * list are deleted from storage.
 */
export async function saveSubmission(
  cohortId: string,
  slug: string,
  assessmentId: string,
  input: { link: string; comment: string; files: SubmittedFile[] },
): Promise<{ ok: true } | ActionError> {
  const ctx = await submissionContext(cohortId, assessmentId);
  if ("error" in ctx) return { ok: false, error: ctx.error! };
  const folder = submissionFolder(cohortId, assessmentId, ctx.studentId);

  const link = input.link.trim() ? cleanLink(input.link) : null;
  if (input.link.trim() && !link) return { ok: false, error: "That link doesn't look right. Copy the full address starting with https://" };
  if (input.files.length > MAX_FILES) return { ok: false, error: `You can attach up to ${MAX_FILES} files.` };
  // Only accept files inside this student's own folder.
  const files = input.files.filter((f) => typeof f.path === "string" && f.path.startsWith(folder) && !f.path.includes(".."));
  if (!link && files.length === 0) return { ok: false, error: "Attach a file or paste a link before submitting." };

  const { data: previous } = await ctx.db
    .from("submissions")
    .select("files")
    .eq("cohort_id", cohortId)
    .eq("assessment_id", assessmentId)
    .eq("student_id", ctx.studentId)
    .maybeSingle();

  const now = new Date().toISOString();
  const { error } = await ctx.db.from("submissions").upsert(
    {
      cohort_id: cohortId,
      assessment_id: assessmentId,
      student_id: ctx.studentId,
      link_url: link,
      comment: input.comment.trim().slice(0, 2000) || null,
      files: files.map((f) => ({ path: f.path, name: String(f.name).slice(0, 200), size: Number(f.size) || 0, type: String(f.type ?? "") })),
      updated_at: now,
    },
    { onConflict: "cohort_id,assessment_id,student_id" },
  );
  if (error) return { ok: false, error: "Couldn't save your submission. Please try again." };

  const kept = new Set(files.map((f) => f.path));
  const removed = ((previous?.files ?? []) as SubmittedFile[]).map((f) => f.path).filter((p) => p.startsWith(folder) && !kept.has(p));
  if (removed.length) await ctx.db.storage.from(SUBMISSION_BUCKET).remove(removed);

  revalidatePath(`/${slug}/me`, "layout");
  revalidatePath(`/admin/${slug}`, "layout");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------
export async function submitFeedback(
  cohortId: string,
  slug: string,
  formId: string,
  _prev: { ok: boolean; error?: string } | null,
  form: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const studentId = await getStudentSession(cohortId);
  if (!studentId) return { ok: false, error: "Your sign-in has expired. Sign in again on My progress." };
  const db = createAdminClient();
  const { data: fb } = await db.from("feedback_forms").select("questions, anonymous, is_open, cohort_id").eq("id", formId).maybeSingle();
  if (!fb || fb.cohort_id !== cohortId || !fb.is_open) return { ok: false, error: "This feedback form is closed." };

  const checked = checkAnswers(fb.questions as FeedbackQuestion[], (name) => {
    const v = form.get(name);
    return v === null ? null : String(v);
  });
  if (!checked.ok) return { ok: false, error: checked.error };

  const { error } = await db.from("feedback_responses").insert({
    form_id: formId,
    respondent_key: respondentKey(formId, studentId),
    student_id: fb.anonymous ? null : studentId,
    answers: checked.answers,
  });
  if (error) {
    if (error.code === "23505") return { ok: false, error: "You've already answered this form. Thank you!" };
    return { ok: false, error: "Couldn't save your answers. Please try again." };
  }
  revalidatePath(`/${slug}/me`, "layout");
  revalidatePath(`/admin/${slug}`, "layout");
  return { ok: true };
}
