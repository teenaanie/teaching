import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCohortView } from "@/lib/data";
import type { FeedbackQuestion } from "@/lib/feedback";
import { getSignedInStudent } from "@/lib/student-data";
import { respondentKey } from "@/lib/student-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { FeedbackForm } from "./FeedbackForm";

export const instant = false;
export const metadata = { title: "Feedback", robots: { index: false } };

export default async function FeedbackPage({ params }: PageProps<"/[cohort]/me/feedback/[form]">) {
  const { cohort: slug, form: formId } = await params;
  const view = await getCohortView(slug);
  if (!view) notFound();
  const me = await getSignedInStudent(view.cohort.id);
  if (!me) redirect(`/${slug}/me`);

  const db = createAdminClient();
  const { data: form } = await db
    .from("feedback_forms")
    .select("id, cohort_id, title, description, questions, anonymous, is_open")
    .eq("id", formId)
    .maybeSingle();
  if (!form || form.cohort_id !== view.cohort.id) notFound();
  const { data: done } = await db
    .from("feedback_responses")
    .select("id")
    .eq("form_id", formId)
    .eq("respondent_key", respondentKey(formId, me.id))
    .maybeSingle();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href={`/${slug}/me`} className="text-sm text-muted hover:underline">
        ← My progress
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold">{form.title}</h1>
      {form.description && <p className="mt-2 text-muted">{form.description}</p>}
      <p className="mt-2 text-sm font-bold">
        {form.anonymous ? "Anonymous: your teacher won't see your name with your answers." : "Your name will be shown with your answers."}
      </p>
      <div className="mt-6">
        {done ? (
          <p className="rounded-xl border border-line bg-card p-5 font-bold text-ok">You&apos;ve answered this form. Thank you!</p>
        ) : !form.is_open ? (
          <p className="rounded-xl border border-line bg-card p-5">This form is closed.</p>
        ) : (
          <FeedbackForm cohortId={view.cohort.id} slug={slug} formId={formId} questions={form.questions as FeedbackQuestion[]} />
        )}
      </div>
    </main>
  );
}
