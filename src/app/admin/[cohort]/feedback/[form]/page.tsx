import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCohort } from "@/lib/admin-data";
import { RATING_LABELS, type FeedbackAnswers, type FeedbackQuestion } from "@/lib/feedback";
import { formatDate } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteFeedbackForm, setFeedbackOpen } from "../../../actions";
import { FeedbackEditor } from "./FeedbackEditor";

export const instant = false;

export default async function FeedbackFormAdmin({ params }: PageProps<"/admin/[cohort]/feedback/[form]">) {
  const { cohort: slug, form: formId } = await params;
  const data = await getAdminCohort(slug);
  const db = createAdminClient();
  const { data: form } = await db.from("feedback_forms").select("*").eq("id", formId).maybeSingle();
  if (!form || form.cohort_id !== data.cohort.id) notFound();
  const { data: responses } = await db
    .from("feedback_responses")
    .select("answers, student_id, submitted_at")
    .eq("form_id", formId)
    .order("submitted_at");
  const rows = (responses ?? []) as { answers: FeedbackAnswers; student_id: string | null; submitted_at: string }[];
  const names = new Map(data.roster.map((r) => [r.id, r.full_name]));
  const questions = form.questions as FeedbackQuestion[];
  const tz = data.cohort.timezone;
  const lessons = new Map(data.outline.modules.flatMap((m) => m.lessons.map((l) => [l.id, l.title] as const)));
  const sessions = data.sessions.map((s) => ({
    id: s.id,
    label: `${formatDate(s.starts_at, tz)} · ${s.title ?? lessons.get(s.lesson_id ?? "") ?? "Class"}`,
  }));
  const active = data.roster.filter((r) => r.status === "active").length;

  return (
    <div className="grid gap-8">
      <Link href={`/admin/${slug}/feedback`} className="text-sm text-muted hover:underline">
        ← Feedback forms
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">{form.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} of {active} students answered · {form.anonymous ? "anonymous" : "names shown"}
          </p>
        </div>
        <form action={setFeedbackOpen.bind(null, formId, !form.is_open)}>
          <button className={`rounded-full px-5 py-2 text-sm font-bold ${form.is_open ? "border border-warn text-warn" : "bg-accent text-[#1b1208]"}`}>
            {form.is_open ? "Close form" : "Open form to students"}
          </button>
        </form>
      </div>

      <section className="grid gap-4">
        <h2 className="font-display text-xl font-semibold">Results</h2>
        {rows.length === 0 && <p className="text-muted">No answers yet.</p>}
        {rows.length > 0 &&
          questions.map((q, i) => {
            const answers = rows.map((r) => ({ value: r.answers[q.id], who: r.student_id ? names.get(r.student_id) : null })).filter((a) => a.value !== undefined && a.value !== "");
            return (
              <div key={q.id} className="grid gap-3 rounded-xl border border-line bg-card p-4">
                <p className="font-bold">
                  {i + 1}. {q.prompt} <span className="font-normal text-muted">· {answers.length} {answers.length === 1 ? "answer" : "answers"}</span>
                </p>
                {q.type === "rating" && <RatingSummary values={answers.map((a) => Number(a.value))} />}
                {q.type === "choice" && <ChoiceSummary options={q.options} values={answers.map((a) => String(a.value))} />}
                {q.type === "text" && (
                  <ul className="grid gap-2 text-sm">
                    {answers.map((a, j) => (
                      <li key={j} className="rounded-lg bg-paper px-3 py-2">
                        {String(a.value)}
                        {a.who && <span className="mt-1 block text-xs text-muted">{a.who}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </section>

      <section className="grid gap-4">
        <h2 className="font-display text-xl font-semibold">Edit the form</h2>
        {rows.length > 0 && (
          <p className="text-sm text-muted">
            Students have already answered. You can still edit; answers to a question you remove are kept but no longer shown. To
            ask something new next week, use “Copy as new form” on the Feedback page instead.
          </p>
        )}
        <FeedbackEditor
          formId={formId}
          initial={{
            title: form.title,
            description: form.description ?? "",
            anonymous: form.anonymous,
            sessionId: form.session_id ?? "",
            questions,
          }}
          sessions={sessions}
        />
      </section>

      {rows.length === 0 && (
        <form action={deleteFeedbackForm.bind(null, formId)}>
          <button className="text-sm text-warn hover:underline">Delete this form (it has no answers yet)</button>
        </form>
      )}
    </div>
  );
}

function RatingSummary({ values }: { values: number[] }) {
  const avg = values.reduce((s, v) => s + v, 0) / (values.length || 1);
  const max = Math.max(1, ...[1, 2, 3, 4, 5].map((n) => values.filter((v) => v === n).length));
  return (
    <div className="grid gap-2 text-sm">
      <p>
        Average <b className="text-lg">{avg.toFixed(1)}</b> out of 5
      </p>
      {[5, 4, 3, 2, 1].map((n) => {
        const c = values.filter((v) => v === n).length;
        return (
          <div key={n} className="grid grid-cols-[72px_1fr_32px] items-center gap-2">
            <span className="text-muted">{RATING_LABELS[n - 1]}</span>
            <span className="h-4 rounded bg-paper">
              <span className="block h-4 rounded bg-teal" style={{ width: `${(c / max) * 100}%` }} />
            </span>
            <span className="text-right font-mono">{c}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChoiceSummary({ options, values }: { options: string[]; values: string[] }) {
  const max = Math.max(1, ...options.map((o) => values.filter((v) => v === o).length));
  return (
    <div className="grid gap-2 text-sm">
      {options.map((o) => {
        const c = values.filter((v) => v === o).length;
        return (
          <div key={o} className="grid grid-cols-[minmax(0,160px)_1fr_32px] items-center gap-2">
            <span className="truncate text-muted">{o}</span>
            <span className="h-4 rounded bg-paper">
              <span className="block h-4 rounded bg-teal" style={{ width: `${(c / max) * 100}%` }} />
            </span>
            <span className="text-right font-mono">{c}</span>
          </div>
        );
      })}
    </div>
  );
}
