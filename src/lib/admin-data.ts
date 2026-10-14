import "server-only";
import { notFound } from "next/navigation";
import { requireTeacher } from "./auth";
import { attendancePercent, studentGrades, type GradeInput } from "./grades";
import type { Assessment, Cohort, CohortAssessment, Course, Lesson, Module, Session } from "./types";

export type AdminModule = Module & { lessons: (Lesson & { notes_md: string })[]; assessments: Assessment[] };

export type Roster = { id: string; full_name: string; email: string | null; roll_no: string; status: "active" | "dropped"; access_code: string | null }[];

/** Full teacher view of a cohort: content, schedule, roster, attendance and scores. */
export async function getAdminCohort(slug: string) {
  const { db, teacher } = await requireTeacher();
  const { data: cohort } = await db.from("cohorts").select("*").eq("slug", slug).maybeSingle<Cohort>();
  if (!cohort) notFound();

  const [course, modules, sessions, enrolments, cohortAssessments, secret] = await Promise.all([
    db.from("courses").select("*").eq("id", cohort.course_id).single(),
    db
      .from("modules")
      .select("*, lessons(*, lesson_notes(notes_md)), assessments(*)")
      .eq("course_id", cohort.course_id)
      .order("position")
      .order("position", { referencedTable: "lessons" })
      .order("position", { referencedTable: "assessments" }),
    db.from("sessions").select("*").eq("cohort_id", cohort.id).order("starts_at").order("position"),
    db.from("enrolments").select("roll_no, status, access_code, student:students(id, full_name, email)").eq("cohort_id", cohort.id),
    db.from("cohort_assessments").select("*").eq("cohort_id", cohort.id),
    db.from("cohort_secrets").select("quiz_pin").eq("cohort_id", cohort.id).maybeSingle(),
  ]);

  const sessionList = (sessions.data ?? []) as Session[];
  const sessionIds = sessionList.map((s) => s.id);
  const [attendance, scores] = await Promise.all([
    sessionIds.length
      ? db.from("attendance").select("session_id, student_id, present").in("session_id", sessionIds)
      : Promise.resolve({ data: [] as { session_id: string; student_id: string; present: boolean }[] }),
    db.from("scores").select("assessment_id, student_id, score, source, feedback").eq("cohort_id", cohort.id),
  ]);

  const roster: Roster = (enrolments.data ?? [])
    .map((e) => {
      const s = e.student as unknown as { id: string; full_name: string; email: string | null };
      return { id: s.id, full_name: s.full_name, email: s.email, roll_no: e.roll_no, status: e.status as "active" | "dropped", access_code: (e.access_code as string | null) ?? null };
    })
    .sort((a, b) => a.roll_no.localeCompare(b.roll_no, undefined, { numeric: true }));

  const outline: { course: Course; modules: AdminModule[] } = {
    course: course.data as Course,
    modules: (modules.data ?? []).map((m) => ({
      ...m,
      lessons: (m.lessons as (Lesson & { lesson_notes: { notes_md: string } | null })[]).map(({ lesson_notes, ...l }) => ({
        ...l,
        notes_md: lesson_notes?.notes_md ?? "",
      })),
    })),
  };

  return {
    teacher,
    cohort,
    outline,
    sessions: sessionList,
    roster,
    attendance: attendance.data ?? [],
    scores: (scores.data ?? []) as { assessment_id: string; student_id: string; score: number; source: string; feedback: string | null }[],
    cohortAssessments: (cohortAssessments.data ?? []) as CohortAssessment[],
    quizPin: (secret.data?.quiz_pin as string | undefined) ?? "",
  };
}

export type AdminCohort = Awaited<ReturnType<typeof getAdminCohort>>;

/** The parts of a cohort that grading needs; satisfied by the admin view and the student view. */
export type GradeSource = {
  outline: { modules: { id: string; grading: Module["grading"]; lessons: { id: string }[]; assessments: Assessment[] }[] };
  sessions: Session[];
  roster: { id: string }[];
  attendance: { session_id: string; student_id: string; present: boolean }[];
  scores: { assessment_id: string; student_id: string; score: number }[];
  cohortAssessments: CohortAssessment[];
};

/** Builds grade inputs and computes per-student module grades + attendance. */
export function computeGrades(data: GradeSource, now = new Date()) {
  const lessonModule = new Map(data.outline.modules.flatMap((m) => m.lessons.map((l) => [l.id, m.id] as const)));
  const attendedSessions = new Set(data.attendance.map((a) => a.session_id));
  const settings = new Map(data.cohortAssessments.map((c) => [c.assessment_id, c]));
  const today = now.toISOString().slice(0, 10);

  const input: GradeInput = {
    modules: data.outline.modules.map((m) => ({ id: m.id, grading: m.grading })),
    assessments: data.outline.modules.flatMap((m) =>
      m.assessments.map((a) => {
        const s = settings.get(a.id);
        const counts = !!(s?.due_date && s.due_date <= today);
        return { id: a.id, moduleId: m.id, kind: a.kind, maxScore: Number(a.max_score), counts };
      }),
    ),
    sessions: data.sessions.map((s) => ({
      id: s.id,
      moduleId: s.lesson_id ? lessonModule.get(s.lesson_id) ?? null : null,
      counts: s.status === "scheduled" && new Date(s.starts_at) <= now && attendedSessions.has(s.id),
    })),
    scores: {},
    attendance: {},
  };
  for (const s of data.scores) (input.scores[s.student_id] ??= {})[s.assessment_id] = Number(s.score);
  for (const a of data.attendance) (input.attendance[a.student_id] ??= {})[a.session_id] = a.present;

  return new Map(
    data.roster.map((st) => [st.id, { modules: studentGrades(st.id, input), attendance: attendancePercent(st.id, input) }]),
  );
}
