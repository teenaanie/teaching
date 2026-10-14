"use client";

import { useState, useTransition } from "react";
import { submitQuiz, type QuizResult } from "./actions";

type Question = { id: string; prompt: string; options: string[] };

export function QuizForm({ cohortId, assessmentId, questions }: { cohortId: string; assessmentId: string; questions: Question[] }) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, start] = useTransition();

  // Submit manually (not via the form `action` prop) so a wrong PIN doesn't reset the student's answers.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    start(async () => setResult(await submitQuiz(null, data)));
  }

  if (result?.ok) {
    return (
      <div className="grid gap-6">
        <div className="rounded-2xl bg-ink p-6 text-paper">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Your score</p>
          <p className="mt-1 font-display text-5xl font-semibold">
            {result.score} / {result.max}
          </p>
        </div>
        <ol className="grid gap-4">
          {result.review.map((q, i) => (
            <li key={i} className="rounded-xl border border-line bg-card p-4">
              <p className="font-bold">
                {i + 1}. {q.prompt}
              </p>
              <ul className="mt-2 grid gap-1 text-sm">
                {q.options.map((o, j) => (
                  <li
                    key={j}
                    className={j === q.answer ? "font-bold text-ok" : j === q.chosen ? "text-warn line-through" : "text-muted"}
                  >
                    {j === q.answer ? "✓ " : j === q.chosen ? "✗ " : "· "}
                    {o}
                  </li>
                ))}
              </ul>
              {q.explanation && <p className="mt-2 text-sm">{q.explanation}</p>}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <input type="hidden" name="cohortId" value={cohortId} />
      <input type="hidden" name="assessmentId" value={assessmentId} />
      <div className="grid gap-3 rounded-2xl border border-line bg-card p-5 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-bold">
          Roll number
          <input name="rollNo" required autoComplete="off" className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Class PIN (on the board)
          <input name="pin" required autoComplete="off" inputMode="numeric" className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
        </label>
      </div>
      <ol className="grid gap-4">
        {questions.map((q, i) => (
          <li key={q.id} className="rounded-xl border border-line bg-card p-4">
            <fieldset>
              <legend className="font-bold">
                {i + 1}. {q.prompt}
              </legend>
              <div className="mt-3 grid gap-2">
                {q.options.map((o, j) => (
                  <label key={j} className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-teal-soft">
                    <input type="radio" name={`q-${q.id}`} value={j} required className="mt-1 accent-[var(--teal)]" />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      {result && !result.ok && <p className="rounded-lg bg-accent-soft px-4 py-3 font-bold text-warn">{result.error}</p>}
      <button disabled={pending} className="justify-self-start rounded-full bg-accent px-6 py-2.5 font-bold text-[#1b1208] disabled:opacity-60">
        {pending ? "Submitting…" : "Submit answers"}
      </button>
    </form>
  );
}
