"use client";

import { useState, useTransition } from "react";
import { saveAttendance } from "../../../actions";

type Student = { id: string; name: string; roll: string };

export function AttendanceForm({ sessionId, students, initial }: { sessionId: string; students: Student[]; initial: Record<string, boolean | null> }) {
  const taken = Object.values(initial).some((v) => v !== null);
  const [present, setPresent] = useState<Set<string>>(
    () => new Set(students.filter((s) => (taken ? initial[s.id] : true)).map((s) => s.id)),
  );
  const [saved, setSaved] = useState(taken);
  const [pending, start] = useTransition();

  function toggle(id: string) {
    setSaved(false);
    setPresent((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (students.length === 0) return <p className="mt-3 text-muted">Add students first.</p>;

  return (
    <div className="mt-2 rounded-2xl border border-line bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 text-sm">
        <span>
          <b>{present.size}</b> of {students.length} present
        </span>
        <span className="flex gap-3">
          <button type="button" onClick={() => { setSaved(false); setPresent(new Set(students.map((s) => s.id))); }} className="text-teal hover:underline">
            All present
          </button>
          <button type="button" onClick={() => { setSaved(false); setPresent(new Set()); }} className="text-teal hover:underline">
            Clear
          </button>
        </span>
      </div>
      <ul className="divide-y divide-line">
        {students.map((s) => {
          const on = present.has(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => toggle(s.id)}
                aria-pressed={on}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${on ? "" : "bg-accent-soft"}`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 text-xs font-bold ${on ? "border-ok bg-ok text-white" : "border-warn text-warn"}`}>
                  {on ? "✓" : "A"}
                </span>
                <span className="w-16 shrink-0 font-mono text-xs text-muted">{s.roll}</span>
                <span className={on ? "" : "font-bold"}>{s.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-3 border-t border-line px-4 py-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => { await saveAttendance(sessionId, [...present], students.map((s) => s.id)); setSaved(true); })}
          className="rounded-full bg-teal px-5 py-2 text-sm font-bold text-white disabled:opacity-60 dark:text-[#0d1a1d]"
        >
          {pending ? "Saving…" : "Save attendance"}
        </button>
        {saved && !pending && <span className="text-sm text-ok">Saved</span>}
      </div>
    </div>
  );
}
