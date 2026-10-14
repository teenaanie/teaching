"use server";

import Papa from "papaparse";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/auth";
import { regenerateSchedule } from "@/lib/cohort-ops";
import { zonedToUtc } from "@/lib/schedule";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function fail(message: string): never {
  throw new Error(message);
}

async function cohortSlug(db: Awaited<ReturnType<typeof requireTeacher>>["db"], cohortId: string) {
  const { data } = await db.from("cohorts").select("slug").eq("id", cohortId).single();
  return data?.slug as string;
}

function refresh(slug: string) {
  revalidatePath(`/admin/${slug}`, "layout");
  revalidatePath(`/${slug}`, "layout");
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------
export async function saveAttendance(sessionId: string, presentIds: string[], studentIds: string[]) {
  const { db } = await requireTeacher();
  const present = new Set(presentIds);
  const { error } = await db
    .from("attendance")
    .upsert(studentIds.map((id) => ({ session_id: sessionId, student_id: id, present: present.has(id) })));
  if (error) fail(error.message);
  const { data } = await db.from("sessions").select("cohort_id").eq("id", sessionId).single();
  if (data) refresh(await cohortSlug(db, data.cohort_id));
}

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------
export type ImportStudentsResult = { added: number; updated: number; errors: string[] };

/** CSV with headers: name, roll_no, email (email optional). Matches existing students by roll number. */
export async function importStudents(cohortId: string, csv: string): Promise<ImportStudentsResult> {
  const { db } = await requireTeacher();
  const parsed = Papa.parse<Record<string, string>>(csv.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/[\s-]+/g, "_"),
  });
  const result: ImportStudentsResult = { added: 0, updated: 0, errors: [] };
  const { data: existing } = await db.from("enrolments").select("student_id, roll_no").eq("cohort_id", cohortId);
  const byRoll = new Map((existing ?? []).map((e) => [e.roll_no.toLowerCase(), e.student_id as string]));

  for (const [i, row] of parsed.data.entries()) {
    const name = (row.name ?? row.full_name ?? "").trim();
    const roll = (row.roll_no ?? row.roll ?? row.roll_number ?? "").trim();
    const email = (row.email ?? "").trim() || null;
    if (!name || !roll) {
      result.errors.push(`Row ${i + 2}: needs a name and roll_no`);
      continue;
    }
    const studentId = byRoll.get(roll.toLowerCase());
    if (studentId) {
      await db.from("students").update({ full_name: name, email }).eq("id", studentId);
      result.updated++;
    } else {
      const { data: student, error } = await db.from("students").insert({ full_name: name, email }).select("id").single();
      if (error) {
        result.errors.push(`Row ${i + 2}: ${error.message}`);
        continue;
      }
      const { error: enrolError } = await db.from("enrolments").insert({ cohort_id: cohortId, student_id: student.id, roll_no: roll });
      if (enrolError) result.errors.push(`Row ${i + 2}: ${enrolError.message}`);
      else result.added++;
    }
  }
  refresh(await cohortSlug(db, cohortId));
  return result;
}

export async function setEnrolmentStatus(cohortId: string, studentId: string, status: "active" | "dropped") {
  const { db } = await requireTeacher();
  await db.from("enrolments").update({ status }).eq("cohort_id", cohortId).eq("student_id", studentId);
  refresh(await cohortSlug(db, cohortId));
}

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------
export async function saveScore(cohortId: string, assessmentId: string, studentId: string, value: string) {
  const { db } = await requireTeacher();
  const trimmed = value.trim();
  const key = { cohort_id: cohortId, assessment_id: assessmentId, student_id: studentId };
  if (trimmed === "") {
    await db.from("scores").delete().match(key);
  } else {
    const score = Number(trimmed);
    if (!Number.isFinite(score) || score < 0) fail("Score must be a positive number");
    const { error } = await db.from("scores").upsert({ ...key, score, source: "manual", updated_at: new Date().toISOString() });
    if (error) fail(error.message);
  }
  refresh(await cohortSlug(db, cohortId));
}

export type ScoreImportRow = { studentId: string; assessmentId: string; score: number };

export async function importScores(cohortId: string, rows: ScoreImportRow[]) {
  const { db } = await requireTeacher();
  const clean = rows.filter((r) => Number.isFinite(r.score) && r.score >= 0);
  if (clean.length === 0) return { saved: 0 };
  const now = new Date().toISOString();
  const { error } = await db.from("scores").upsert(
    clean.map((r) => ({
      cohort_id: cohortId,
      assessment_id: r.assessmentId,
      student_id: r.studentId,
      score: r.score,
      source: "classroom",
      updated_at: now,
    })),
  );
  if (error) fail(error.message);
  refresh(await cohortSlug(db, cohortId));
  return { saved: clean.length };
}

// ---------------------------------------------------------------------------
// Cohort settings and schedule
// ---------------------------------------------------------------------------
export async function updateCohort(cohortId: string, form: FormData) {
  const { db } = await requireTeacher();
  const holidays = String(form.get("holidays") ?? "")
    .split(/[\s,]+/)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();
  const { error } = await db
    .from("cohorts")
    .update({
      title: String(form.get("title")),
      institution: String(form.get("institution") ?? "") || null,
      classroom_url: String(form.get("classroom_url") ?? "") || null,
      classroom_code: String(form.get("classroom_code") ?? "") || null,
      announcement: String(form.get("announcement") ?? "").trim() || null,
      holidays,
    })
    .eq("id", cohortId);
  if (error) fail(error.message);
  const pin = String(form.get("quiz_pin") ?? "").trim();
  if (pin) await db.from("cohort_secrets").upsert({ cohort_id: cohortId, quiz_pin: pin });
  refresh(await cohortSlug(db, cohortId));
}

export async function rebuildSchedule(cohortId: string) {
  const { db } = await requireTeacher();
  const result = await regenerateSchedule(db, cohortId);
  refresh(await cohortSlug(db, cohortId));
  return result;
}

export async function updateSession(sessionId: string, form: FormData) {
  const { db } = await requireTeacher();
  const { data: session } = await db.from("sessions").select("cohort_id, starts_at, ends_at").eq("id", sessionId).single();
  if (!session) fail("Session not found");
  const update: Record<string, unknown> = {
    status: form.get("cancelled") ? "cancelled" : "scheduled",
    title: String(form.get("title") ?? "").trim() || null,
    note: String(form.get("note") ?? "").trim() || null,
  };
  const date = String(form.get("date") ?? "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const { data: cohort } = await db.from("cohorts").select("start_time, end_time, timezone").eq("id", session.cohort_id).single();
    update.starts_at = zonedToUtc(date, cohort!.start_time, cohort!.timezone);
    update.ends_at = zonedToUtc(date, cohort!.end_time, cohort!.timezone);
  }
  const { error } = await db.from("sessions").update(update).eq("id", sessionId);
  if (error) fail(error.message);
  refresh(await cohortSlug(db, session.cohort_id));
}

/** Moves one session to another day, keeping the cohort's class times. */
export async function setSessionDate(sessionId: string, date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail("Pick a valid date");
  const { db } = await requireTeacher();
  const { data: session } = await db.from("sessions").select("cohort_id, cohorts(start_time, end_time, timezone)").eq("id", sessionId).single();
  if (!session) fail("Session not found");
  const cohort = session.cohorts as unknown as { start_time: string; end_time: string; timezone: string };
  const { error } = await db
    .from("sessions")
    .update({ starts_at: zonedToUtc(date, cohort.start_time, cohort.timezone), ends_at: zonedToUtc(date, cohort.end_time, cohort.timezone) })
    .eq("id", sessionId);
  if (error) fail(error.message);
  refresh(await cohortSlug(db, session.cohort_id));
}

/** Student-facing note on a session; empty clears it. */
export async function setSessionNote(sessionId: string, note: string) {
  const { db } = await requireTeacher();
  const { data: session, error } = await db
    .from("sessions")
    .update({ note: note.trim() || null })
    .eq("id", sessionId)
    .select("cohort_id")
    .single();
  if (error) fail(error.message);
  refresh(await cohortSlug(db, session.cohort_id));
}

export async function updateCohortAssessment(cohortId: string, assessmentId: string, form: FormData) {
  const { db } = await requireTeacher();
  const { error } = await db.from("cohort_assessments").upsert({
    cohort_id: cohortId,
    assessment_id: assessmentId,
    classroom_url: String(form.get("classroom_url") ?? "") || null,
    due_date: String(form.get("due_date") ?? "") || null,
    is_open: form.get("is_open") === "on",
  });
  if (error) fail(error.message);
  refresh(await cohortSlug(db, cohortId));
}

export async function saveLessonNotes(lessonId: string, cohortSlugValue: string, form: FormData) {
  const { db } = await requireTeacher();
  const { error } = await db.from("lesson_notes").upsert({ lesson_id: lessonId, notes_md: String(form.get("notes_md") ?? "") });
  if (error) fail(error.message);
  revalidatePath(`/admin/${cohortSlugValue}`, "layout");
}
