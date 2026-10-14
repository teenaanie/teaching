import { getAdminCohort } from "@/lib/admin-data";
import { setEnrolmentStatus } from "../../actions";
import { StudentImport } from "./StudentImport";

export const instant = false;

export default async function StudentsAdmin({ params }: PageProps<"/admin/[cohort]/students">) {
  const { cohort: slug } = await params;
  const { cohort, roster } = await getAdminCohort(slug);
  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <section>
        <h1 className="font-display text-3xl font-semibold">Students ({roster.filter((r) => r.status === "active").length})</h1>
        <table className="mt-4 w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="py-2 pr-3">Roll</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Email</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {roster.map((r) => (
              <tr key={r.id} className={r.status === "dropped" ? "text-muted line-through" : ""}>
                <td className="py-2 pr-3 font-mono">{r.roll_no}</td>
                <td className="py-2 pr-3">{r.full_name}</td>
                <td className="py-2 pr-3 text-muted">{r.email}</td>
                <td className="py-2 text-right">
                  <form action={setEnrolmentStatus.bind(null, cohort.id, r.id, r.status === "active" ? "dropped" : "active")}>
                    <button className="text-xs text-teal hover:underline">{r.status === "active" ? "Mark dropped" : "Re-enrol"}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {roster.length === 0 && <p className="mt-4 text-muted">No students yet. Import a list on the right.</p>}
      </section>
      <StudentImport cohortId={cohort.id} />
    </div>
  );
}
