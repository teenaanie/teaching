import Link from "next/link";
import { ActionForm } from "@/components/ActionForm";
import { computeGrades, getAdminCohort } from "@/lib/admin-data";
import { addStudent, createMissingCodes, setEnrolmentStatus } from "../../actions";
import { StudentImport } from "./StudentImport";

export const instant = false;

const field = "rounded-lg border border-line bg-paper px-3 py-2 font-normal";
const pct = (v: number | null | undefined) => (v === null || v === undefined ? "—" : `${Math.round(v)}%`);

export default async function StudentsAdmin({ params }: PageProps<"/admin/[cohort]/students">) {
  const { cohort: slug } = await params;
  const data = await getAdminCohort(slug);
  const { cohort, roster } = data;
  const grades = computeGrades(data, undefined, data.cohort.timezone);
  const missingCodes = roster.filter((r) => r.status === "active" && !r.access_code).length;
  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <section>
        <h1 className="font-display text-3xl font-semibold">Students ({roster.filter((r) => r.status === "active").length})</h1>
        <p className="mt-1 text-sm text-muted">Click a name to edit details, see attendance, and grade with feedback.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm">
          <span className="flex-1">
            <b>Student sign-in:</b> each student signs in to &ldquo;My progress&rdquo; with their roll number and a private code.{" "}
            {missingCodes > 0 ? `${missingCodes} student${missingCodes === 1 ? "" : "s"} still need a code.` : "Everyone has a code."}
          </span>
          {missingCodes > 0 && (
            <form action={createMissingCodes.bind(null, cohort.id)}>
              <button className="rounded-full bg-teal px-4 py-1.5 font-bold text-white dark:text-[#0d1a1d]">Create codes</button>
            </form>
          )}
          <Link href={`/admin/${slug}/students/codes`} className="rounded-full border border-teal px-4 py-1.5 font-bold text-teal">
            Print code slips
          </Link>
        </div>
        <table className="mt-4 w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="py-2 pr-3">Roll</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3 text-right">Attend.</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {roster.map((r) => (
              <tr key={r.id} className={r.status === "dropped" ? "text-muted line-through" : ""}>
                <td className="py-2 pr-3 font-mono">{r.roll_no}</td>
                <td className="py-2 pr-3">
                  <Link href={`/admin/${slug}/students/${r.id}`} className="font-bold hover:underline">
                    {r.full_name}
                  </Link>
                  {r.email && <span className="block text-xs text-muted">{r.email}</span>}
                </td>
                <td className="py-2 pr-3 text-right">{pct(grades.get(r.id)?.attendance)}</td>
                <td className="py-2 text-right">
                  <form action={setEnrolmentStatus.bind(null, cohort.id, r.id, r.status === "active" ? "dropped" : "active")}>
                    <button className="text-xs text-teal hover:underline">{r.status === "active" ? "Mark dropped" : "Re-enrol"}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {roster.length === 0 && <p className="mt-4 text-muted">No students yet. Add one or import a list.</p>}
      </section>
      <div className="grid content-start gap-6">
        <section className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-xl font-semibold">Add one student</h2>
          <ActionForm action={addStudent.bind(null, cohort.id)} submit="Add student" clearOnSuccess className="mt-3 grid gap-3">
            <label className="grid gap-1 text-sm font-bold">
              Full name
              <input name="full_name" required className={field} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-bold">
                Roll number
                <input name="roll_no" required className={`${field} font-mono`} />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Email (optional)
                <input name="email" type="email" className={field} />
              </label>
            </div>
          </ActionForm>
        </section>
        <StudentImport cohortId={cohort.id} />
      </div>
    </div>
  );
}
