"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { setSessionDate, setSessionNote } from "../actions";

export type SessionRow = {
  id: string;
  date: string; // YYYY-MM-DD in the cohort's timezone
  weekday: string;
  title: string;
  module: string;
  note: string;
  cancelled: boolean;
  attendance: { taken: boolean; present: number; past: boolean };
};

type Status = "idle" | "saving" | "saved" | "error";

function Saved({ status }: { status: Status }) {
  if (status === "saving") return <span className="text-xs text-muted">Saving…</span>;
  if (status === "saved") return <span className="text-xs text-ok">Saved</span>;
  if (status === "error") return <span className="text-xs text-warn">Not saved</span>;
  return null;
}

function Row({ slug, row, index, activeCount, sameDay }: { slug: string; row: SessionRow; index: number; activeCount: number; sameDay: boolean }) {
  const [date, setDate] = useState(row.date);
  const [savedDate, setSavedDate] = useState(row.date);
  const [note, setNote] = useState(row.note);
  const [status, setStatus] = useState<Status>("idle");
  const [, start] = useTransition();

  function save(fn: () => Promise<void>) {
    setStatus("saving");
    start(async () => {
      try {
        await fn();
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <tr className={`align-top ${row.cancelled ? "text-muted line-through" : ""} ${sameDay ? "bg-teal-soft/50" : ""}`}>
      <td className="py-2 pr-3 pt-4 text-muted">{index + 1}</td>
      <td className="py-2 pr-3">
        <input
          type="date"
          value={date}
          aria-label={`Date for ${row.title}`}
          onChange={(e) => setDate(e.target.value)}
          // Save when leaving the field, so typing a date digit by digit doesn't save half-typed dates.
          onBlur={() => {
            if (date && date !== savedDate) {
              const value = date;
              save(async () => {
                await setSessionDate(row.id, value);
                setSavedDate(value);
              });
            }
          }}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className="rounded-lg border border-line bg-paper px-2 py-1.5"
        />
        <span className="mt-1 block text-xs text-muted">{row.weekday}</span>
      </td>
      <td className="py-2 pr-3">
        <Link href={`/admin/${slug}/sessions/${row.id}`} className="block pt-2 font-bold hover:underline">
          {row.title}
        </Link>
        <span className="text-xs text-muted">{row.module}</span>
        <input
          value={note}
          placeholder="Note for students (optional)"
          aria-label={`Note for ${row.title}`}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== row.note && save(() => setSessionNote(row.id, note))}
          className="mt-1.5 block w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm hover:border-line focus:border-line focus:bg-paper"
        />
      </td>
      <td className="whitespace-nowrap py-2 pt-4 text-right">
        <span className="block">
          {row.attendance.taken ? (
            <b>
              {row.attendance.present}/{activeCount}
            </b>
          ) : row.attendance.past && !row.cancelled ? (
            <span className="font-bold text-warn">Not taken</span>
          ) : (
            <span className="text-muted">—</span>
          )}
        </span>
        <Saved status={status} />
      </td>
    </tr>
  );
}

export function SessionTable({ slug, rows, activeCount }: { slug: string; rows: SessionRow[]; activeCount: number }) {
  const perDay = new Map<string, number>();
  for (const r of rows) if (!r.cancelled) perDay.set(r.date, (perDay.get(r.date) ?? 0) + 1);
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs uppercase tracking-widest text-muted">
        <tr>
          <th className="py-2 pr-3">#</th>
          <th className="py-2 pr-3">Date</th>
          <th className="py-2 pr-3">Lesson and note for students</th>
          <th className="py-2 text-right">Attendance</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {rows.map((r, i) => (
          <Row key={r.id} slug={slug} row={r} index={i} activeCount={activeCount} sameDay={(perDay.get(r.date) ?? 0) > 1} />
        ))}
      </tbody>
    </table>
  );
}
