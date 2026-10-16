import Link from "next/link";
import { getAdminCohort } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { setAcceptSubmissions } from "../../actions";

export const instant = false;

const kindLabel = { assignment: "Assignment", quiz: "Quiz", project: "Project", hackathon: "Hackathon" };

export default async function AssignmentsAdmin({ params }: PageProps<"/admin/[cohort]/assignments">) {
  const { cohort: slug } = await params;
  const data = await getAdminCohort(slug);
  const { cohort } = data;
  const active = data.roster.filter((r) => r.status === "active");
  const { data: subs } = await createAdminClient().from("submissions").select("assessment_id").eq("cohort_id", cohort.id);
  const counts = new Map<string, number>();
  for (const s of subs ?? []) counts.set(s.assessment_id, (counts.get(s.assessment_id) ?? 0) + 1);
  const settings = new Map(data.cohortAssessments.map((c) => [c.assessment_id, c]));

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Assignments</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Turn on <b>Accept on site</b> and the assignment appears under “To do” on each student&apos;s My progress page, where they
          upload files or paste a link (Tableau Public, Drive, Colab). Open an assignment to see who has submitted, download their
          work, and grade it.
        </p>
      </div>
      {data.outline.modules.map((m) => {
        const items = m.assessments.filter((a) => a.kind !== "quiz");
        if (items.length === 0) return null;
        return (
          <section key={m.id}>
            <h2 className="font-display text-xl font-semibold">{m.title}</h2>
            <ul className="mt-3 grid gap-2">
              {items.map((a) => {
                const s = settings.get(a.id);
                const n = counts.get(a.id) ?? 0;
                return (
                  <li key={a.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-card px-4 py-3 text-sm">
                    <Link href={`/admin/${slug}/assignments/${a.id}`} className="min-w-0 flex-1 hover:underline">
                      <span className="text-xs uppercase tracking-widest text-muted">{kindLabel[a.kind]}</span>
                      <span className="block font-bold">{a.title}</span>
                    </Link>
                    <span className="text-muted">{s?.due_date ? `Due ${formatDate(s.due_date + "T12:00:00Z", cohort.timezone)}` : "No due date"}</span>
                    <span className="font-bold">
                      {n}/{active.length} submitted
                    </span>
                    <form action={setAcceptSubmissions.bind(null, cohort.id, a.id, !s?.accept_submissions)}>
                      <button
                        className={`rounded-full px-3 py-1 font-bold ${s?.accept_submissions ? "bg-ok text-white dark:text-[#0d1a1d]" : "border border-teal text-teal"}`}
                        title={s?.accept_submissions ? "Students can submit now. Click to stop." : "Click to let students submit on the site."}
                      >
                        {s?.accept_submissions ? "Accepting on site" : "Accept on site"}
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
