import Link from "next/link";
import { computeGrades, getAdminCohort, type AdminModule } from "@/lib/admin-data";
import { ClassroomImport } from "./ClassroomImport";
import { ScoreCell } from "./ScoreCell";

export const instant = false;

const pct = (v: number | null | undefined) => (v === null || v === undefined ? "—" : `${Math.round(v)}%`);

export default async function Gradebook({ params }: PageProps<"/admin/[cohort]/gradebook">) {
  const { cohort: slug } = await params;
  const data = await getAdminCohort(slug);
  const grades = computeGrades(data);
  const students = data.roster.filter((r) => r.status === "active");
  const scoreMap = new Map(data.scores.map((s) => [`${s.student_id}:${s.assessment_id}`, s]));
  const modules = data.outline.modules.filter((m) => m.assessments.length > 0 || Object.keys(m.grading).length > 0);
  const allAssessments = modules.flatMap((m) => m.assessments);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Gradebook</h1>
        <Link href={`/admin/${slug}/gradebook/export`} className="rounded-full border border-teal px-4 py-1.5 text-sm font-bold text-teal">
          Download CSV
        </Link>
      </div>
      <p className="text-sm text-muted">
        Type a score and press Tab to save. Module grades follow each module&apos;s weights and only count work that is due or
        already scored. Rows in orange need attention (attendance under 75% or a module under 40%).
      </p>
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="sticky left-0 z-10 bg-card px-3 py-2" rowSpan={2}>
                Student
              </th>
              <th className="px-3 py-2 text-center" rowSpan={2}>
                Attend.
              </th>
              {modules.map((m) => (
                <th key={m.id} colSpan={m.assessments.length + 1} className="border-l border-line px-3 py-2 text-center font-display">
                  {m.title}
                </th>
              ))}
            </tr>
            <tr className="border-b border-line text-xs text-muted">
              {modules.map((m) => (
                <Headers key={m.id} module={m} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {students.map((st) => {
              const g = grades.get(st.id)!;
              const flag = (g.attendance !== null && g.attendance < 75) || g.modules.some((mg) => mg.percent !== null && mg.percent < 40);
              return (
                <tr key={st.id} className={flag ? "bg-accent-soft" : ""}>
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-inherit px-3 py-1.5">
                    <span className="mr-2 font-mono text-xs text-muted">{st.roll_no}</span>
                    {st.full_name}
                  </td>
                  <td className="px-3 py-1.5 text-center font-bold">{pct(g.attendance)}</td>
                  {modules.map((m) => {
                    const mg = g.modules.find((x) => x.moduleId === m.id);
                    return [
                      ...m.assessments.map((a) => {
                        const s = scoreMap.get(`${st.id}:${a.id}`);
                        return (
                          <td key={a.id} className="border-l border-line px-1 py-1 text-center first-of-type:border-l">
                            <ScoreCell cohortId={data.cohort.id} assessmentId={a.id} studentId={st.id} value={s ? String(Number(s.score)) : ""} source={s?.source} />
                          </td>
                        );
                      }),
                      <td key={`${m.id}-grade`} className="border-l border-line bg-teal-soft px-3 py-1.5 text-center font-bold" title={mg?.components.map((c) => `${c.key} ${c.weight}%: ${pct(c.percent)}`).join("\n")}>
                        {pct(mg?.percent)}
                      </td>,
                    ];
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {students.length === 0 && <p className="p-5 text-muted">Add students to see the gradebook.</p>}
      </div>
      <ClassroomImport
        cohortId={data.cohort.id}
        students={students.map((s) => ({ id: s.id, name: s.full_name, email: s.email, roll: s.roll_no }))}
        assessments={allAssessments.map((a) => ({ id: a.id, title: a.title, kind: a.kind, maxScore: Number(a.max_score) }))}
      />
    </div>
  );
}

function Headers({ module: m }: { module: AdminModule }) {
  return (
    <>
      {m.assessments.map((a) => (
        <th key={a.id} className="border-l border-line px-2 py-2 text-center font-normal" title={a.title}>
          <span className="block max-w-24 truncate">{a.title}</span>
          <span className="block">/ {Number(a.max_score)}</span>
        </th>
      ))}
      <th className="border-l border-line bg-teal-soft px-3 py-2 text-center" title={JSON.stringify(m.grading)}>
        Grade
      </th>
    </>
  );
}
