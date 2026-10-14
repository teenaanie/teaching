import Papa from "papaparse";
import { computeGrades, getAdminCohort } from "@/lib/admin-data";

export async function GET(_req: Request, ctx: RouteContext<"/admin/[cohort]/gradebook/export">) {
  const { cohort: slug } = await ctx.params;
  const data = await getAdminCohort(slug);
  const grades = computeGrades(data);
  const scores = new Map(data.scores.map((s) => [`${s.student_id}:${s.assessment_id}`, Number(s.score)]));
  const round = (v: number | null) => (v === null ? "" : Math.round(v * 10) / 10);

  const rows = data.roster
    .filter((r) => r.status === "active")
    .map((st) => {
      const g = grades.get(st.id)!;
      const row: Record<string, string | number> = { roll_no: st.roll_no, name: st.full_name, attendance_pct: round(g.attendance) };
      for (const m of data.outline.modules) {
        for (const a of m.assessments) row[`${a.title} (/${Number(a.max_score)})`] = scores.get(`${st.id}:${a.id}`) ?? "";
        row[`${m.title} grade %`] = round(g.modules.find((x) => x.moduleId === m.id)?.percent ?? null);
      }
      return row;
    });

  return new Response(Papa.unparse(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-grades.csv"`,
    },
  });
}
