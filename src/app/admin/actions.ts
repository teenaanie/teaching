"use server";

import Papa from "papaparse";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/auth";
import { regenerateSchedule } from "@/lib/cohort-ops";
import { zonedToUtc } from "@/lib/schedule";
import { parseQuestions, STARTER_QUESTIONS } from "@/lib/feedback";
import { localDate } from "@/lib/format";
import { newAccessCode } from "@/lib/student-session";
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
/** Saves attendance for a class; it applies to every lesson held on the same day. */
export async function saveAttendance(sessionId: string, presentIds: string[], studentIds: string[]) {
  const { db } = await requireTeacher();
  const { data: session } = await db.from("sessions").select("cohort_id, starts_at, cohorts(timezone)").eq("id", sessionId).single();
  if (!session) fail("Session not found");
  const tz = (session.cohorts as unknown as { timezone: string }).timezone;
  const ids = await sessionsOnDay(db, session.cohort_id, localDate(session.starts_at, tz));
  const present = new Set(presentIds);
  const { error } = await db
    .from("attendance")
    .upsert((ids.length ? ids : [sessionId]).flatMap((sid) => studentIds.map((id) => ({ session_id: sid, student_id: id, present: present.has(id) }))));
  if (error) fail(error.message);
  refresh(await cohortSlug(db, session.cohort_id));
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
    accept_submissions: form.get("accept_submissions") === "on",
  });
  if (error) fail(error.message);
  refresh(await cohortSlug(db, cohortId));
}

/** Turns on-site submission on or off for one assessment (used from the Assignments page). */
export async function setAcceptSubmissions(cohortId: string, assessmentId: string, accept: boolean) {
  const { db } = await requireTeacher();
  const { error } = await db
    .from("cohort_assessments")
    .upsert({ cohort_id: cohortId, assessment_id: assessmentId, accept_submissions: accept }, { onConflict: "cohort_id,assessment_id" });
  if (error) fail(error.message);
  refresh(await cohortSlug(db, cohortId));
}

export async function saveLessonNotes(lessonId: string, cohortSlugValue: string, form: FormData) {
  const { db } = await requireTeacher();
  const { error } = await db.from("lesson_notes").upsert({ lesson_id: lessonId, notes_md: String(form.get("notes_md") ?? "") });
  if (error) fail(error.message);
  revalidatePath(`/admin/${cohortSlugValue}`, "layout");
}

// ---------------------------------------------------------------------------
// Teachers
// ---------------------------------------------------------------------------
export type ActionResult = { ok: boolean; message: string };

/**
 * Gives someone teacher access. Creates their login with the temporary password if they
 * don't have one yet; an existing login just gets teacher access added.
 */
export async function addTeacher(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const { db } = await requireTeacher();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!name || !email) return { ok: false, message: "Enter a name and email." };

  let userId: string | undefined;
  for (let page = 1; !userId && page < 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return { ok: false, message: error.message };
    userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id;
    if (data.users.length < 200) break;
  }
  let created = false;
  if (!userId) {
    if (password.length < 8) return { ok: false, message: "This email has no login yet. Set a temporary password of at least 8 characters." };
    const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) return { ok: false, message: error.message };
    userId = data.user.id;
    created = true;
  }
  const { error } = await db.from("teachers").upsert({ user_id: userId, name });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/teachers");
  return {
    ok: true,
    message: created
      ? `${name} can now sign in at /admin with ${email} and the temporary password. Share it with them privately.`
      : `${name} already had a login and now has teacher access.`,
  };
}

export async function removeTeacher(userId: string) {
  const { db, teacher } = await requireTeacher();
  if (userId === teacher.user_id) fail("You can't remove yourself.");
  const { error } = await db.from("teachers").delete().eq("user_id", userId);
  if (error) fail(error.message);
  revalidatePath("/admin/teachers");
}

// ---------------------------------------------------------------------------
// Single students
// ---------------------------------------------------------------------------
function studentFields(form: FormData) {
  return {
    name: String(form.get("full_name") ?? "").trim(),
    roll: String(form.get("roll_no") ?? "").trim(),
    email: String(form.get("email") ?? "").trim() || null,
  };
}

export async function addStudent(cohortId: string, _prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const { db } = await requireTeacher();
  const { name, roll, email } = studentFields(form);
  if (!name || !roll) return { ok: false, message: "Name and roll number are required." };
  const { data: clash } = await db.from("enrolments").select("student_id").eq("cohort_id", cohortId).ilike("roll_no", roll).maybeSingle();
  if (clash) return { ok: false, message: `Roll number ${roll} is already used in this class.` };
  const { data: student, error } = await db.from("students").insert({ full_name: name, email }).select("id").single();
  if (error) return { ok: false, message: error.message };
  const { error: enrolError } = await db.from("enrolments").insert({ cohort_id: cohortId, student_id: student.id, roll_no: roll });
  if (enrolError) return { ok: false, message: enrolError.message };
  refresh(await cohortSlug(db, cohortId));
  return { ok: true, message: `Added ${name}.` };
}

export async function updateStudent(cohortId: string, studentId: string, _prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const { db } = await requireTeacher();
  const { name, roll, email } = studentFields(form);
  if (!name || !roll) return { ok: false, message: "Name and roll number are required." };
  const { data: clash } = await db
    .from("enrolments")
    .select("student_id")
    .eq("cohort_id", cohortId)
    .ilike("roll_no", roll)
    .neq("student_id", studentId)
    .maybeSingle();
  if (clash) return { ok: false, message: `Roll number ${roll} is already used in this class.` };
  const { error } = await db.from("students").update({ full_name: name, email }).eq("id", studentId);
  if (error) return { ok: false, message: error.message };
  const { error: enrolError } = await db.from("enrolments").update({ roll_no: roll }).eq("cohort_id", cohortId).eq("student_id", studentId);
  if (enrolError) return { ok: false, message: enrolError.message };
  refresh(await cohortSlug(db, cohortId));
  return { ok: true, message: "Saved." };
}

/** Score plus written feedback for one student on one assessment. Empty score clears it. */
export async function saveScoreWithFeedback(cohortId: string, assessmentId: string, studentId: string, form: FormData) {
  const { db } = await requireTeacher();
  const raw = String(form.get("score") ?? "").trim();
  const feedback = String(form.get("feedback") ?? "").trim() || null;
  const key = { cohort_id: cohortId, assessment_id: assessmentId, student_id: studentId };
  if (raw === "") {
    await db.from("scores").delete().match(key);
  } else {
    const score = Number(raw);
    if (!Number.isFinite(score) || score < 0) fail("Score must be a positive number");
    const { error } = await db.from("scores").upsert({ ...key, score, feedback, source: "manual", updated_at: new Date().toISOString() });
    if (error) fail(error.message);
  }
  refresh(await cohortSlug(db, cohortId));
}

/** Opens or closes a quiz for a cohort (used from the session page). */
export async function setQuizOpen(cohortId: string, assessmentId: string, open: boolean) {
  const { db } = await requireTeacher();
  const { error } = await db.from("cohort_assessments").upsert({ cohort_id: cohortId, assessment_id: assessmentId, is_open: open }, { onConflict: "cohort_id,assessment_id" });
  if (error) fail(error.message);
  refresh(await cohortSlug(db, cohortId));
}

// ---------------------------------------------------------------------------
// Student sign-in codes
// ---------------------------------------------------------------------------
/** Gives every active student without a code a new one. Existing codes are kept. */
export async function createMissingCodes(cohortId: string) {
  const { db } = await requireTeacher();
  const { data } = await db.from("enrolments").select("student_id, access_code").eq("cohort_id", cohortId).eq("status", "active");
  const used = new Set((data ?? []).map((e) => e.access_code).filter(Boolean));
  for (const e of (data ?? []).filter((x) => !x.access_code)) {
    let code = newAccessCode();
    while (used.has(code)) code = newAccessCode();
    used.add(code);
    await db.from("enrolments").update({ access_code: code }).eq("cohort_id", cohortId).eq("student_id", e.student_id);
  }
  refresh(await cohortSlug(db, cohortId));
}

/** Replaces one student's code (e.g. a lost slip). Their old code stops working. */
export async function resetCode(cohortId: string, studentId: string) {
  const { db } = await requireTeacher();
  const { error } = await db.from("enrolments").update({ access_code: newAccessCode() }).eq("cohort_id", cohortId).eq("student_id", studentId);
  if (error) fail(error.message);
  refresh(await cohortSlug(db, cohortId));
}

// ---------------------------------------------------------------------------
// Feedback forms
// ---------------------------------------------------------------------------
/** New form with the starter questions (or a copy of another form), then open the editor. */
export async function createFeedbackForm(cohortId: string, copyFromId?: string) {
  const { db } = await requireTeacher();
  let base = { title: "Class feedback", description: null as string | null, questions: STARTER_QUESTIONS as unknown, anonymous: true };
  if (copyFromId) {
    const { data } = await db.from("feedback_forms").select("title, description, questions, anonymous").eq("id", copyFromId).single();
    if (data) base = { ...data, title: `${data.title} (copy)` };
  }
  const { data: created, error } = await db
    .from("feedback_forms")
    .insert({ cohort_id: cohortId, ...base, is_open: false })
    .select("id")
    .single();
  if (error) fail(error.message);
  const slug = await cohortSlug(db, cohortId);
  refresh(slug);
  redirect(`/admin/${slug}/feedback/${created.id}`);
}

export async function updateFeedbackForm(formId: string, _prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const { db } = await requireTeacher();
  const title = String(form.get("title") ?? "").trim();
  if (!title) return { ok: false, message: "Give the form a title." };
  let questions;
  try {
    questions = parseQuestions(String(form.get("questions") ?? "[]"));
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
  const sessionId = String(form.get("session_id") ?? "") || null;
  const { data, error } = await db
    .from("feedback_forms")
    .update({
      title,
      description: String(form.get("description") ?? "").trim() || null,
      anonymous: form.get("anonymous") === "on",
      session_id: sessionId,
      questions,
      updated_at: new Date().toISOString(),
    })
    .eq("id", formId)
    .select("cohort_id")
    .single();
  if (error) return { ok: false, message: error.message };
  refresh(await cohortSlug(db, data.cohort_id));
  return { ok: true, message: "Saved." };
}

export async function setFeedbackOpen(formId: string, open: boolean) {
  const { db } = await requireTeacher();
  const { data, error } = await db.from("feedback_forms").update({ is_open: open }).eq("id", formId).select("cohort_id").single();
  if (error) fail(error.message);
  refresh(await cohortSlug(db, data.cohort_id));
}

/** Deletes a form only while nobody has answered it, so collected feedback is never lost by accident. */
export async function deleteFeedbackForm(formId: string) {
  const { db } = await requireTeacher();
  const { count } = await db.from("feedback_responses").select("id", { count: "exact", head: true }).eq("form_id", formId);
  if (count) fail("This form already has answers, so it can't be deleted. Close it instead.");
  const { data, error } = await db.from("feedback_forms").delete().eq("id", formId).select("cohort_id").single();
  if (error) fail(error.message);
  const slug = await cohortSlug(db, data.cohort_id);
  refresh(slug);
  redirect(`/admin/${slug}/feedback`);
}

// ---------------------------------------------------------------------------
// Attendance register (by class day)
// ---------------------------------------------------------------------------
/** Ids of the cohort's scheduled sessions on one local date. */
async function sessionsOnDay(db: Awaited<ReturnType<typeof requireTeacher>>["db"], cohortId: string, date: string) {
  const { data: cohort } = await db.from("cohorts").select("timezone").eq("id", cohortId).single();
  const { data } = await db.from("sessions").select("id, starts_at").eq("cohort_id", cohortId).eq("status", "scheduled");
  return (data ?? []).filter((s) => localDate(s.starts_at, cohort!.timezone) === date).map((s) => s.id as string);
}

/**
 * Marks one student present or absent for a whole class day (every lesson that day).
 * `present: null` clears the mark.
 */
export async function setDayAttendance(cohortId: string, date: string, studentId: string, present: boolean | null) {
  const { db } = await requireTeacher();
  const ids = await sessionsOnDay(db, cohortId, date);
  if (ids.length === 0) fail("No class on that day.");
  if (present === null) {
    await db.from("attendance").delete().eq("student_id", studentId).in("session_id", ids);
  } else {
    const { error } = await db.from("attendance").upsert(ids.map((id) => ({ session_id: id, student_id: studentId, present })));
    if (error) fail(error.message);
  }
  refresh(await cohortSlug(db, cohortId));
}

/** Marks every active student present for a class day, keeping anyone already marked absent. */
export async function markDayPresent(cohortId: string, date: string) {
  const { db } = await requireTeacher();
  const ids = await sessionsOnDay(db, cohortId, date);
  if (ids.length === 0) fail("No class on that day.");
  const [{ data: roster }, { data: existing }] = await Promise.all([
    db.from("enrolments").select("student_id").eq("cohort_id", cohortId).eq("status", "active"),
    db.from("attendance").select("session_id, student_id").in("session_id", ids),
  ]);
  const marked = new Set((existing ?? []).map((a) => `${a.session_id}:${a.student_id}`));
  const rows = (roster ?? []).flatMap((r) =>
    ids.filter((id) => !marked.has(`${id}:${r.student_id}`)).map((id) => ({ session_id: id, student_id: r.student_id, present: true })),
  );
  if (rows.length) {
    const { error } = await db.from("attendance").insert(rows);
    if (error) fail(error.message);
  }
  refresh(await cohortSlug(db, cohortId));
}
