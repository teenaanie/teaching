import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { getCohortView } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getSignedInStudent } from "@/lib/student-data";
import type { SubmittedFile } from "@/lib/submissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { SubmitForm } from "./SubmitForm";

export const instant = false;
export const metadata = { title: "Submit assignment", robots: { index: false } };

export default async function SubmitAssignment({ params }: PageProps<"/[cohort]/me/assignments/[assessment]">) {
  const { cohort: slug, assessment: assessmentId } = await params;
  const view = await getCohortView(slug);
  if (!view) notFound();
  const me = await getSignedInStudent(view.cohort.id);
  if (!me) redirect(`/${slug}/me`);

  const mod = view.modules.find((m) => m.assessments.some((a) => a.id === assessmentId));
  const assessment = mod?.assessments.find((a) => a.id === assessmentId);
  if (!assessment || assessment.kind === "quiz") notFound();
  const setting = view.cohortAssessments.find((c) => c.assessment_id === assessmentId);

  const { data: existing } = await createAdminClient()
    .from("submissions")
    .select("link_url, comment, files, updated_at")
    .eq("cohort_id", view.cohort.id)
    .eq("assessment_id", assessmentId)
    .eq("student_id", me.id)
    .maybeSingle();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href={`/${slug}/me`} className="text-sm text-muted hover:underline">
        ← My progress
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted">{mod!.title}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold">{assessment.title}</h1>
      <p className="mt-1 text-sm text-muted">
        {me.name} · {me.rollNo}
        {setting?.due_date ? ` · due ${formatDate(setting.due_date + "T12:00:00Z", view.cohort.timezone)}` : ""}
      </p>

      {assessment.brief_md && (
        <details className="mt-6 rounded-2xl border border-line bg-card p-5">
          <summary className="cursor-pointer font-bold">What to submit</summary>
          <Markdown className="mt-3">{assessment.brief_md}</Markdown>
          {assessment.brief_url && (
            <a href={assessment.brief_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-teal underline">
              Full brief ↗
            </a>
          )}
        </details>
      )}

      <div className="mt-6">
        {setting?.accept_submissions ? (
          <SubmitForm
            cohortId={view.cohort.id}
            slug={slug}
            assessmentId={assessmentId}
            initial={{
              link: existing?.link_url ?? "",
              comment: existing?.comment ?? "",
              files: (existing?.files ?? []) as SubmittedFile[],
              submittedAt: existing?.updated_at ? formatDate(existing.updated_at, view.cohort.timezone, { hour: "numeric", minute: "2-digit" }) : null,
            }}
          />
        ) : (
          <p className="rounded-xl border border-line bg-card p-5">
            This assignment isn&apos;t taking submissions here right now. Check with your teacher.
          </p>
        )}
      </div>
    </main>
  );
}
