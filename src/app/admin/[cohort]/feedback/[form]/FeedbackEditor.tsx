"use client";

import { useState } from "react";
import { ActionForm } from "@/components/ActionForm";
import type { FeedbackQuestion } from "@/lib/feedback";
import { updateFeedbackForm } from "../../../actions";

type Initial = { title: string; description: string; anonymous: boolean; sessionId: string; questions: FeedbackQuestion[] };

const field = "rounded-lg border border-line bg-paper px-3 py-2 font-normal";

function newId(existing: FeedbackQuestion[]) {
  let n = existing.length + 1;
  while (existing.some((q) => q.id === `q${n}`)) n++;
  return `q${n}`;
}

export function FeedbackEditor({ formId, initial, sessions }: { formId: string; initial: Initial; sessions: { id: string; label: string }[] }) {
  const [questions, setQuestions] = useState<FeedbackQuestion[]>(initial.questions);

  const update = (i: number, patch: Partial<FeedbackQuestion>) =>
    setQuestions(questions.map((q, j) => (j === i ? ({ ...q, ...patch } as FeedbackQuestion) : q)));
  const move = (i: number, by: number) => {
    const next = [...questions];
    const [q] = next.splice(i, 1);
    next.splice(i + by, 0, q);
    setQuestions(next);
  };
  const changeType = (i: number, type: FeedbackQuestion["type"]) => {
    const q = questions[i];
    update(i, type === "choice" ? { type, options: "options" in q && q.options.length ? q.options : ["", ""] } : { type });
  };

  return (
    <ActionForm action={updateFeedbackForm.bind(null, formId)} submit="Save form" className="grid gap-4">
      <input type="hidden" name="questions" value={JSON.stringify(questions)} />
      <div className="grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-bold">
          Title
          <input id="fb-title" name="title" defaultValue={initial.title} required className={field} />
        </label>
        <label className="grid gap-1 text-sm font-bold">
          For which class? (optional)
          <select id="fb-session" name="session_id" defaultValue={initial.sessionId} className={field}>
            <option value="">Not linked to a class</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold sm:col-span-2">
          Note for students (optional)
          <input id="fb-description" name="description" defaultValue={initial.description} placeholder="e.g. Two minutes. Be honest, it helps me teach better." className={field} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input id="fb-anonymous" type="checkbox" name="anonymous" defaultChecked={initial.anonymous} /> Anonymous (names are never shown with answers)
        </label>
      </div>

      <ol className="grid gap-3">
        {questions.map((q, i) => (
          <li key={q.id} className="grid gap-3 rounded-xl border border-line bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-muted">{i + 1}.</span>
              <select aria-label="Question type" value={q.type} onChange={(e) => changeType(i, e.target.value as FeedbackQuestion["type"])} className={`${field} py-1 text-sm`}>
                <option value="rating">Rating 1–5</option>
                <option value="choice">Pick one</option>
                <option value="text">Written answer</option>
              </select>
              <label className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={q.required} onChange={(e) => update(i, { required: e.target.checked })} /> Required
              </label>
              <span className="ml-auto flex gap-3 text-sm">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="text-teal disabled:opacity-40">Up</button>
                <button type="button" disabled={i === questions.length - 1} onClick={() => move(i, 1)} className="text-teal disabled:opacity-40">Down</button>
                <button type="button" disabled={questions.length === 1} onClick={() => setQuestions(questions.filter((_, j) => j !== i))} className="text-warn disabled:opacity-40">
                  Remove
                </button>
              </span>
            </div>
            <input aria-label={`Question ${i + 1}`} value={q.prompt} onChange={(e) => update(i, { prompt: e.target.value })} placeholder="Type the question" className={field} />
            {q.type === "choice" && (
              <div className="grid gap-2 pl-4">
                {q.options.map((o, k) => (
                  <div key={k} className="flex gap-2">
                    <input
                      aria-label={`Choice ${k + 1}`}
                      value={o}
                      onChange={(e) => update(i, { options: q.options.map((x, m) => (m === k ? e.target.value : x)) })}
                      placeholder={`Choice ${k + 1}`}
                      className={`${field} flex-1 py-1.5 text-sm`}
                    />
                    <button type="button" disabled={q.options.length <= 2} onClick={() => update(i, { options: q.options.filter((_, m) => m !== k) })} className="text-sm text-warn disabled:opacity-40">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => update(i, { options: [...q.options, ""] })} className="justify-self-start text-sm text-teal hover:underline">
                  + Add a choice
                </button>
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-3 text-sm">
        {(["rating", "choice", "text"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() =>
              setQuestions([
                ...questions,
                type === "choice"
                  ? { id: newId(questions), type, prompt: "", options: ["", ""], required: false }
                  : { id: newId(questions), type, prompt: "", required: false },
              ])
            }
            className="rounded-full border border-teal px-3 py-1 font-bold text-teal"
          >
            + {type === "rating" ? "Rating question" : type === "choice" ? "Pick-one question" : "Written question"}
          </button>
        ))}
      </div>
    </ActionForm>
  );
}
