"use client";

import { useState, useTransition } from "react";
import { saveScore } from "../../actions";

export function ScoreCell({ cohortId, assessmentId, studentId, value, source }: { cohortId: string; assessmentId: string; studentId: string; value: string; source?: string }) {
  const [current, setCurrent] = useState(value);
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  const [pending, start] = useTransition();

  return (
    <input
      value={current}
      inputMode="decimal"
      aria-label="Score"
      title={source ? `From ${source}` : undefined}
      onChange={(e) => setCurrent(e.target.value)}
      onBlur={() => {
        if (current === value) return;
        start(async () => {
          try {
            await saveScore(cohortId, assessmentId, studentId, current);
            setState("saved");
          } catch {
            setState("error");
          }
        });
      }}
      className={`w-14 rounded border px-1 py-1 text-center ${
        state === "error" ? "border-warn" : state === "saved" ? "border-ok" : "border-transparent hover:border-line"
      } ${pending ? "opacity-50" : ""} ${source === "quiz" ? "text-teal" : ""} bg-transparent`}
    />
  );
}
