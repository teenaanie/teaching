"use client";

import { useState, useTransition } from "react";
import { rebuildSchedule } from "../../actions";

export function RebuildButton({ cohortId }: { cohortId: string }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <div className="mt-3 flex items-center gap-3">
      <button
        disabled={pending}
        onClick={() => {
          if (!confirm("Re-plan all upcoming classes?")) return;
          start(async () => {
            const r = await rebuildSchedule(cohortId);
            setMessage(`Kept ${r.kept} past classes, planned ${r.planned} upcoming.`);
          });
        }}
        className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-[#1b1208] disabled:opacity-60"
      >
        {pending ? "Rebuilding…" : "Rebuild schedule"}
      </button>
      {message && <span className="text-sm text-ok">{message}</span>}
    </div>
  );
}
