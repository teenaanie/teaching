import { getAdminCohort } from "@/lib/admin-data";
import { PrintButton } from "./PrintButton";

export const instant = false;

export default async function CodeSlips({ params }: PageProps<"/admin/[cohort]/students/codes">) {
  const { cohort: slug } = await params;
  const { cohort, roster } = await getAdminCohort(slug);
  const students = roster.filter((r) => r.status === "active" && r.access_code);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-semibold">Sign-in code slips</h1>
          <p className="text-sm text-muted">Print, cut along the lines and hand each student their own slip.</p>
        </div>
        <PrintButton />
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-0 print:mt-0 md:grid-cols-3">
        {students.map((s) => (
          <li key={s.id} className="break-inside-avoid border border-dashed border-line p-4">
            <p className="text-xs text-muted">{cohort.title}</p>
            <p className="mt-1 font-bold">{s.full_name}</p>
            <p className="mt-2 text-sm">
              Roll number: <b className="font-mono">{s.roll_no}</b>
            </p>
            <p className="text-sm">
              Your code: <b className="font-mono text-lg tracking-widest">{s.access_code}</b>
            </p>
            <p className="mt-2 text-xs text-muted">Open the class page → &ldquo;My progress&rdquo;. Keep this code private.</p>
          </li>
        ))}
      </ul>
      {students.length === 0 && <p className="mt-6 text-muted">No codes yet. Go back to Students and press &ldquo;Create codes&rdquo;.</p>}
    </div>
  );
}
