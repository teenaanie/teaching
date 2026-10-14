import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/ActionForm";
import { computeGrades, getAdminCohort } from "@/lib/admin-data";
import { formatDate, nowMs } from "@/lib/format";
import { resetCode, saveScoreWithFeedback, updateStudent } from "../../../actions";

export const instant = false;

const field = "rounded-lg border border-line bg-paper px-3 py-2 font-normal";
const pct = (v: number | null | undefined) => (v === null || v === undefined ? "—" : `${Math.round(v)}%`);

export default async function StudentPage({ params }: PageProps<"/admin/[cohort]/students/[student]">) {
  const { cohort: slug, student: studentId } = await params;
  const data = await getAdminCohort(slug);
  const student = data.roster.find((r) => r.id === studentId);
  if (!student) notFound();
  const { cohort } = data;
  const grades = computeGrades(data).get(student.id)!;
  const scores = new Map(
    data.scores.filter((s) => s.student_id === student.id).map((s) => [s.assessment_id, s] as const),
  );
  const marks = new Map(data.attendance.filter((a) => a.student_id === student.id).map((a) => [a.session_id, a.present]));
  const lessonTitles = new Map(data.outline.modules.flatMap((m) => m.lessons.map((l) => [l.id, l.title] as const)));
  const now = nowMs();
  const pastSessions = data.sessions.filter((s) => s.status === "scheduled" && new Date(s.starts_at).getTime() <= now);

  return (
    <div className="grid gap-8">
      <Link href={`/admin/${slug}/students`} className="text-sm text-muted hover:underline">
        ← Students
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-muted">{student.roll_no}</p>
          <h1 className="font-display text-3xl font-semibold">{student.full_name}</h1>
        </div>
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-widest text-muted">Attendance</dt>
            <dd className="text-xl font-bold">{pct(grades.attendance)}</dd>
          </div>
          {data.outline.modules.map((m) => {
            const g = grades.modules.find((x) => x.moduleId === m.id);
            return g?.percent === null || g?.percent === undefined ? null : (
              <div key={m.id}>
                <dt className="text-xs uppercase tracking-widest text-muted">{m.title}</dt>
                <dd className="text-xl font-bold">{pct(g.percent)}</dd>
              </div>
            );
          })}
        </dl>
      </div>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-xl font-semibold">Details</h2>
        <ActionForm action={updateStudent.bind(null, cohort.id, student.id)} submit="Save details" className="mt-3 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm font-bold">
              Full name
              <input name="full_name" defaultValue={student.full_name} required className={field} />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Roll number
              <input name="roll_no" defaultValue={student.roll_no} required className={`${field} font-mono`} />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Email
              <input name="email" type="email" defaultValue={student.email ?? ""} className={field} />
            </label>
          </div>
        </ActionForm>
      </section>

      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-card p-5">
        <div className="flex-1">
          <h2 className="font-display text-xl font-semibold">Sign-in code</h2>
          <p className="text-sm text-muted">The student uses this with their roll number to see their own marks and feedback.</p>
        </div>
        <span className="font-mono text-2xl font-bold tracking-widest">{student.access_code ?? "—"}</span>
        <form action={resetCode.bind(null, cohort.id, student.id)}>
          <button className="rounded-full border border-teal px-4 py-1.5 text-sm font-bold text-teal">
            {student.access_code ? "Reset code" : "Create code"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">Grades and feedback</h2>
        <p className="mt-1 text-sm text-muted">Quiz scores fill in automatically. Leave the score empty to clear it.</p>
        <div className="mt-4 grid gap-6">
          {data.outline.modules.map((m) =>
            m.assessments.length === 0 ? null : (
              <div key={m.id}>
                <h3 className="font-bold">{m.title}</h3>
                <ul className="mt-2 grid gap-2">
                  {m.assessments.map((a) => {
                    const s = scores.get(a.id);
                    return (
                      <li key={a.id}>
                        <form
                          action={saveScoreWithFeedback.bind(null, cohort.id, a.id, student.id)}
                          className="grid items-center gap-2 rounded-xl border border-line bg-card px-4 py-3 text-sm md:grid-cols-[1.5fr_auto_2fr_auto]"
                        >
                          <span>
                            <span className="text-xs uppercase tracking-widest text-muted">{a.kind}</span>
                            <span className="block font-bold">{a.title}</span>
                          </span>
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <input
                              name="score"
                              inputMode="decimal"
                              defaultValue={s ? String(Number(s.score)) : ""}
                              aria-label={`Score for ${a.title}`}
                              className={`${field} w-20 text-center`}
                            />
                            <span className="text-muted">/ {Number(a.max_score)}</span>
                          </span>
                          <input
                            name="feedback"
                            defaultValue={s?.feedback ?? ""}
                            placeholder="Feedback (optional)"
                            aria-label={`Feedback for ${a.title}`}
                            className={field}
                          />
                          <button className="rounded-full border border-teal px-3 py-1 font-bold text-teal">Save</button>
                        </form>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ),
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">Attendance</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {pastSessions.map((s) => {
            const m = marks.get(s.id);
            return (
              <li
                key={s.id}
                title={s.title ?? lessonTitles.get(s.lesson_id ?? "") ?? ""}
                className={`rounded-full px-3 py-1 ${m === true ? "bg-teal-soft" : m === false ? "bg-accent-soft font-bold text-warn" : "border border-line text-muted"}`}
              >
                {formatDate(s.starts_at, cohort.timezone)} · {m === true ? "Present" : m === false ? "Absent" : "Not taken"}
              </li>
            );
          })}
          {pastSessions.length === 0 && <li className="text-muted">No classes yet.</li>}
        </ul>
      </section>
    </div>
  );
}
