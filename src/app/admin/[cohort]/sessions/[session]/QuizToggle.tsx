"use client";

import { useState, useTransition } from "react";
import { setQuizOpen } from "../../../actions";

export function QuizToggle({ cohortId, assessmentId, title, open, questions }: { cohortId: string; assessmentId: string; title: string; open: boolean; questions: number }) {
  const [isOpen, setIsOpen] = useState(open);
  const [pending, start] = useTransition();
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${isOpen ? "border-accent bg-accent-soft" : "border-line bg-card"}`}>
      <span>
        <span className="block font-bold">{title}</span>
        <span className="text-xs text-muted">
          {questions} questions · {isOpen ? "open: students can take it now" : "closed"}
        </span>
      </span>
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            await setQuizOpen(cohortId, assessmentId, !isOpen);
            setIsOpen(!isOpen);
          })
        }
        className={`rounded-full px-4 py-1.5 text-sm font-bold disabled:opacity-60 ${isOpen ? "border border-warn text-warn" : "bg-accent text-[#1b1208]"}`}
      >
        {pending ? "…" : isOpen ? "Close quiz" : "Open quiz"}
      </button>
    </div>
  );
}
