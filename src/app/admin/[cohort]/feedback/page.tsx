import Link from "next/link";
import { getAdminCohort } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { createFeedbackForm } from "../../actions";

export const instant = false;

export default async function FeedbackAdmin({ params }: PageProps<"/admin/[cohort]/feedback">) {
  const { cohort: slug } = await params;
  const { cohort, roster } = await getAdminCohort(slug);
  const db = createAdminClient();
  const { data: forms } = await db
    .from("feedback_forms")
    .select("id, title, is_open, anonymous, created_at, feedback_responses(count)")
    .eq("cohort_id", cohort.id)
    .order("created_at", { ascending: false });
  const active = roster.filter((r) => r.status === "active").length;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Feedback forms</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Open a form and it appears under “To do” on each student&apos;s My progress page. Each student can answer once.
            Anonymous forms never show names next to answers.
          </p>
        </div>
        <form action={createFeedbackForm.bind(null, cohort.id, undefined)}>
          <button className="rounded-full bg-teal px-5 py-2 text-sm font-bold text-white dark:text-[#0d1a1d]">New feedback form</button>
        </form>
      </div>

      <ul className="grid gap-2">
        {(forms ?? []).map((f) => {
          const n = (f.feedback_responses as unknown as { count: number }[])[0]?.count ?? 0;
          return (
            <li key={f.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-card px-4 py-3 text-sm">
              <Link href={`/admin/${slug}/feedback/${f.id}`} className="min-w-0 flex-1 hover:underline">
                <span className="block font-bold">{f.title}</span>
                <span className="text-xs text-muted">
                  Created {formatDate(f.created_at, cohort.timezone)} · {f.anonymous ? "anonymous" : "named"}
                </span>
              </Link>
              <span className="font-bold">
                {n}/{active} answered
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${f.is_open ? "bg-ok text-white dark:text-[#0d1a1d]" : "border border-line text-muted"}`}>
                {f.is_open ? "Open" : "Closed"}
              </span>
              <form action={createFeedbackForm.bind(null, cohort.id, f.id)}>
                <button className="text-teal hover:underline">Copy as new form</button>
              </form>
            </li>
          );
        })}
      </ul>
      {(forms ?? []).length === 0 && (
        <p className="rounded-xl border border-line bg-card p-5 text-muted">
          No forms yet. “New feedback form” starts you with four questions about clarity, pace, what was useful and what was
          confusing. You can change all of them.
        </p>
      )}
    </div>
  );
}
