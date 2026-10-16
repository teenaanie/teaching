"use client";

import { useState, useTransition } from "react";
import { RATING_LABELS, type FeedbackQuestion } from "@/lib/feedback";
import { submitFeedback } from "../../actions";
import { useHydrated } from "@/lib/use-hydrated";

export function FeedbackForm({ cohortId, slug, formId, questions }: { cohortId: string; slug: string; formId: string; questions: FeedbackQuestion[] }) {
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const [pending, start] = useTransition();
  const hydrated = useHydrated();

  // Submit manually so answers survive an error (form actions reset the form).
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    start(async () => setResult(await submitFeedback(cohortId, slug, formId, null, data)));
  }

  if (result?.ok) return <p className="rounded-xl border border-line bg-card p-5 font-bold text-ok">Thank you! Your answers are in.</p>;

  return (
    <form method="post" onSubmit={onSubmit} className="grid gap-4">
      {questions.map((q, i) => (
        <fieldset key={q.id} className="grid gap-3 rounded-xl border border-line bg-card p-4">
          <legend className="px-1 font-bold">
            {i + 1}. {q.prompt}
            {!q.required && <span className="font-normal text-muted"> (optional)</span>}
          </legend>
          {q.type === "rating" && (
            <div className="flex flex-wrap gap-2">
              {RATING_LABELS.map((label, n) => (
                <label key={n} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm has-[:checked]:border-teal has-[:checked]:bg-teal-soft">
                  <input type="radio" name={`a-${q.id}`} value={n + 1} required={q.required} className="accent-[var(--teal)]" />
                  {label}
                </label>
              ))}
            </div>
          )}
          {q.type === "choice" && (
            <div className="grid gap-2">
              {q.options.map((o) => (
                <label key={o} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-teal-soft">
                  <input type="radio" name={`a-${q.id}`} value={o} required={q.required} className="accent-[var(--teal)]" />
                  {o}
                </label>
              ))}
            </div>
          )}
          {q.type === "text" && (
            <textarea name={`a-${q.id}`} required={q.required} rows={3} maxLength={2000} className="rounded-lg border border-line bg-paper px-3 py-2" />
          )}
        </fieldset>
      ))}
      {result?.error && <p className="rounded-lg bg-accent-soft px-4 py-3 font-bold text-warn">{result.error}</p>}
      <button disabled={pending || !hydrated} className="justify-self-start rounded-full bg-teal px-6 py-2.5 font-bold text-white disabled:opacity-60 dark:text-[#0d1a1d]">
        {pending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
