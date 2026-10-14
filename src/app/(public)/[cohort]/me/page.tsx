import Link from "next/link";
import { notFound } from "next/navigation";
import { computeGrades } from "@/lib/admin-data";
import { getCohortView } from "@/lib/data";
import { formatDate, nowMs } from "@/lib/format";
import { getStudentSession } from "@/lib/student-session";
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
  const [{ data: student }, { data: scores }, { data: attendance }] = await Promise.all([
    db.from("enrolments").select("roll_no, status, students(full_name)").eq("cohort_id", cohort.id).eq("student_id", studentId).maybeSingle(),
    db.from("scores").select("assessment_id, student_id, score, feedback").eq("cohort_id", cohort.id).eq("student_id", studentId),
    sessionIds.length
      ? db.from("attendance").select("session_id, student_id, present").eq("student_id", studentId).in("session_id", sessionIds)
      : Promise.resolve({ data: [] as { session_id: string; student_id: string; present: boolean }[] }),
  ]);
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
  }).get(studentId)!;
  const scoreMap = new Map((scores ?? []).map((s) => [s.assessment_id, s]));
  const marks = new Map((attendance ?? []).map((a) => [a.session_id, a.present]));
  const due = new Map(view.cohortAssessments.map((c) => [c.assessment_id, c.due_date]));
  const now = nowMs();
  const past = view.sessions.filter((s) => s.status === "scheduled" && new Date(s.starts_at).getTime() <= now);
  const name = (student.students as unknown as { full_name: string }).full_name;

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
