import Link from "next/link";
import { notFound } from "next/navigation";
import { computeGrades } from "@/lib/admin-data";
import { getCohortView } from "@/lib/data";
import { formatDate, nowMs } from "@/lib/format";
import { respondentKey, getStudentSession } from "@/lib/student-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { studentSignOut } from "./actions";
import { SignInForm } from "./SignInForm";

export const instant = false;
export const metadata = { title: "My progress", robots: { index: false } };

const pct = (v: number | null | undefined) => (v === null || v === undefined ? "—" : `${Math.round(v)}%`);
const kindLabel = { assignment: "Assignment", quiz: "Quiz", project: "Project", hackathon: "Hackathon" };

export default async function MyProgress({ params }: PageProps<"/[cohort]/me">) {
  const { cohort: slug } = await params;
  const view = await getCohortView(slug);
  if (!view) notFound();
  const { cohort } = view;
  const studentId = await getStudentSession(cohort.id);

  if (!studentId) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">My progress</h1>
        <p className="mt-2 text-muted">See your marks, your teacher&apos;s feedback and your attendance. Only you can see this.</p>
        <div className="mt-6">
          <SignInForm cohortId={cohort.id} slug={slug} />
        </div>
      </main>
    );
  }

  // Read only this student's rows, server-side.
  const db = createAdminClient();
  const sessionIds = view.sessions.map((s) => s.id);
  const [{ data: student }, { data: scores }, { data: attendance }, { data: submissions }, { data: forms }] = await Promise.all([
    db.from("enrolments").select("roll_no, status, students(full_name)").eq("cohort_id", cohort.id).eq("student_id", studentId).maybeSingle(),
    db.from("scores").select("assessment_id, student_id, score, feedback").eq("cohort_id", cohort.id).eq("student_id", studentId),
    sessionIds.length
      ? db.from("attendance").select("session_id, student_id, present").eq("student_id", studentId).in("session_id", sessionIds)
      : Promise.resolve({ data: [] as { session_id: string; student_id: string; present: boolean }[] }),
    db.from("submissions").select("assessment_id, updated_at").eq("cohort_id", cohort.id).eq("student_id", studentId),
    db.from("feedback_forms").select("id, title").eq("cohort_id", cohort.id).eq("is_open", true).order("created_at", { ascending: false }),
  ]);
  const openForms = (forms ?? []) as { id: string; title: string }[];
  const { data: answered } = openForms.length
    ? await db
        .from("feedback_responses")
        .select("form_id")
        .in("respondent_key", openForms.map((f) => respondentKey(f.id, studentId)))
    : { data: [] as { form_id: string }[] };
  const answeredForms = new Set((answered ?? []).map((r) => r.form_id));
  if (!student || student.status !== "active") {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
        <p>Your account isn&apos;t active in this class. Please ask your teacher.</p>
        <form action={studentSignOut.bind(null, slug)} className="mt-4">
          <button className="text-teal underline">Sign out</button>
        </form>
      </main>
    );
  }

  const grades = computeGrades({
    outline: view,
    sessions: view.sessions,
    roster: [{ id: studentId }],
    attendance: attendance ?? [],
    scores: (scores ?? []).map((s) => ({ ...s, score: Number(s.score) })),
    cohortAssessments: view.cohortAssessments,
  }, undefined, cohort.timezone).get(studentId)!;
  const scoreMap = new Map((scores ?? []).map((s) => [s.assessment_id, s]));
  const marks = new Map((attendance ?? []).map((a) => [a.session_id, a.present]));
  const due = new Map(view.cohortAssessments.map((c) => [c.assessment_id, c.due_date]));
  const now = nowMs();
  const past = view.sessions.filter((s) => s.status === "scheduled" && new Date(s.starts_at).getTime() <= now);
  const name = (student.students as unknown as { full_name: string }).full_name;
  const submitted = new Map((submissions ?? []).map((s) => [s.assessment_id, s.updated_at as string]));
  const allAssessments = view.modules.flatMap((m) => m.assessments);
  const settings = new Map(view.cohortAssessments.map((c) => [c.assessment_id, c]));
  const openQuizzes = allAssessments.filter((a) => a.kind === "quiz" && settings.get(a.id)?.is_open && !scoreMap.has(a.id));
  const toSubmit = allAssessments.filter((a) => a.kind !== "quiz" && settings.get(a.id)?.accept_submissions);
  const hasTodo = openQuizzes.length + toSubmit.length + openForms.length > 0;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-muted">{student.roll_no}</p>
          <h1 className="font-display text-3xl font-semibold">{name}</h1>
        </div>
        <form action={studentSignOut.bind(null, slug)}>
          <button className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-teal">Sign out</button>
        </form>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-card p-4">
          <dt className="text-xs uppercase tracking-widest text-muted">Attendance</dt>
          <dd className="mt-1 text-2xl font-bold">{pct(grades.attendance)}</dd>
        </div>
        {view.modules.map((m) => {
          const g = grades.modules.find((x) => x.moduleId === m.id);
          return g?.percent === null || g?.percent === undefined ? null : (
            <div key={m.id} className="rounded-xl border border-line bg-card p-4">
              <dt className="text-xs uppercase tracking-widest text-muted">{m.title}</dt>
              <dd className="mt-1 text-2xl font-bold">{pct(g.percent)}</dd>
            </div>
          );
        })}
      </dl>

      {hasTodo && (
        <section className="mt-8 rounded-2xl border-2 border-accent bg-accent-soft p-5">
          <h2 className="font-display text-xl font-semibold">To do</h2>
          <ul className="mt-3 grid gap-2">
            {openQuizzes.map((a) => (
              <li key={a.id}>
                <Link href={`/${slug}/quiz/${a.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-card px-4 py-3 hover:underline">
                  <span><span className="text-xs uppercase tracking-widest text-muted">Quiz open now</span><span className="block font-bold">{a.title}</span></span>
                  <span className="text-sm font-bold text-accent">Take it →</span>
                </Link>
              </li>
            ))}
            {toSubmit.map((a) => {
              const when = submitted.get(a.id);
              const d = settings.get(a.id)?.due_date;
              return (
                <li key={a.id}>
                  <Link href={`/${slug}/me/assignments/${a.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-card px-4 py-3 hover:underline">
                    <span>
                      <span className="text-xs uppercase tracking-widest text-muted">{kindLabel[a.kind]}{d ? ` · due ${formatDate(d + "T12:00:00Z", cohort.timezone)}` : ""}</span>
                      <span className="block font-bold">{a.title}</span>
                    </span>
                    <span className={`text-sm font-bold ${when ? "text-ok" : "text-accent"}`}>{when ? "Submitted · change it" : "Submit →"}</span>
                  </Link>
                </li>
              );
            })}
            {openForms.map((f) => (
              <li key={f.id}>
                <Link href={`/${slug}/me/feedback/${f.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-card px-4 py-3 hover:underline">
                  <span><span className="text-xs uppercase tracking-widest text-muted">Feedback</span><span className="block font-bold">{f.title}</span></span>
                  <span className={`text-sm font-bold ${answeredForms.has(f.id) ? "text-ok" : "text-accent"}`}>{answeredForms.has(f.id) ? "Done, thank you" : "Answer →"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 grid gap-8">
        {view.modules.map((m) => {
          const items = m.assessments.filter((a) => scoreMap.has(a.id) || a.kind !== "quiz");
          if (items.length === 0) return null;
          return (
            <div key={m.id}>
              <h2 className="font-display text-xl font-semibold">{m.title}</h2>
              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
                {items.map((a) => {
                  const s = scoreMap.get(a.id);
                  const d = due.get(a.id);
                  return (
                    <li key={a.id} className="px-4 py-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span>
                          <span className="text-xs uppercase tracking-widest text-muted">{kindLabel[a.kind]}</span>
                          <span className="block font-bold">{a.title}</span>
                        </span>
                        <span className="text-right">
                          {s ? (
                            <b className="text-lg">
                              {Number(s.score)} <span className="text-sm font-normal text-muted">/ {Number(a.max_score)}</span>
                            </b>
                          ) : (
                            <span className="text-sm text-muted">{d ? `Due ${formatDate(d + "T12:00:00Z", cohort.timezone)}` : "Not graded yet"}</span>
                          )}
                        </span>
                      </div>
                      {s?.feedback && <p className="mt-2 rounded-lg bg-teal-soft px-3 py-2 text-sm">{s.feedback}</p>}
                      {submitted.has(a.id) && (
                        <p className="mt-1 text-xs text-muted">
                          Submitted {formatDate(submitted.get(a.id)!, cohort.timezone)}
                          {settings.get(a.id)?.accept_submissions && (
                            <>
                              {" · "}
                              <Link href={`/${slug}/me/assignments/${a.id}`} className="text-teal underline">View or change</Link>
                            </>
                          )}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <div>
          <h2 className="font-display text-xl font-semibold">Attendance</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {past.map((s) => {
              const m = marks.get(s.id);
              return (
                <li
                  key={s.id}
                  className={`rounded-full px-3 py-1 ${m === true ? "bg-teal-soft" : m === false ? "bg-accent-soft font-bold text-warn" : "border border-line text-muted"}`}
                >
                  {formatDate(s.starts_at, cohort.timezone)} · {m === true ? "Present" : m === false ? "Absent" : "Not marked"}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <p className="mt-10 text-sm text-muted">
        Questions about a mark? Talk to your teacher after class. <Link href={`/${slug}`} className="text-teal underline">Back to the schedule</Link>
      </p>
    </main>
  );
}
