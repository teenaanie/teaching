"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { markDayPresent, setDayAttendance } from "../../actions";

export type RegisterDay = { date: string; label: string; lessons: string[]; marks: Record<string, boolean | null> };
type Student = { id: string; name: string; roll: string };

const pct = (n: number, d: number) => (d === 0 ? "—" : `${Math.round((n / d) * 100)}%`);

export function AttendanceRegister({
  cohortId,
  cohortSlug,
  students,
  days: initial,
}: {
  cohortId: string;
  cohortSlug: string;
  students: Student[];
  days: RegisterDay[];
}) {
  const [days, setDays] = useState(initial);
  const [error, setError] = useState("");
  const [, start] = useTransition();

  function setMark(date: string, studentId: string, value: boolean | null) {
    const before = days;
    setDays(days.map((d) => (d.date === date ? { ...d, marks: { ...d.marks, [studentId]: value } } : d)));
    setError("");
    start(async () => {
      try {
        await setDayAttendance(cohortId, date, studentId, value);
      } catch {
        setDays(before);
        setError("Couldn't save that mark. Check your connection and try again.");
      }
    });
  }

  function allPresent(date: string) {
    const before = days;
    setDays(days.map((d) => (d.date === date ? { ...d, marks: Object.fromEntries(students.map((s) => [s.id, d.marks[s.id] ?? true])) } : d)));
    start(async () => {
      try {
        await markDayPresent(cohortId, date);
      } catch {
        setDays(before);
        setError("Couldn't save. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="grid gap-3">
      {error && <p className="rounded-lg bg-accent-soft px-4 py-2 text-sm font-bold text-warn">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="sticky left-0 z-10 bg-card px-3 py-2">Student</th>
              {days.map((d) => {
                const present = students.filter((s) => d.marks[s.id] === true).length;
                const missing = students.some((s) => d.marks[s.id] == null);
                return (
                  <th key={d.date} className="border-l border-line px-2 py-2 text-center align-top font-normal" title={d.lessons.join("\n")}>
                    <span className="block whitespace-nowrap font-bold">{d.label}</span>
                    <span className="block text-xs text-muted">
                      {present}/{students.length} · {d.lessons.length} {d.lessons.length === 1 ? "lesson" : "lessons"}
                    </span>
                    {missing && (
                      <button type="button" onClick={() => allPresent(d.date)} className="mt-1 text-xs text-teal hover:underline">
                        Rest present
                      </button>
                    )}
                  </th>
                );
              })}
              <th className="border-l border-line px-3 py-2 text-center">Attend.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {students.map((st) => {
              const taken = days.filter((d) => d.marks[st.id] != null);
              const present = taken.filter((d) => d.marks[st.id]).length;
              const low = taken.length > 0 && present / taken.length < 0.75;
              return (
                <tr key={st.id} className={low ? "bg-accent-soft" : ""}>
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-inherit px-3 py-1.5">
                    <span className="mr-2 font-mono text-xs text-muted">{st.roll}</span>
                    <Link href={`/admin/${cohortSlug}/students/${st.id}#details`} className="hover:underline" title="Open student details">
                      {st.name}
                    </Link>
                  </td>
                  {days.map((d) => {
                    const v = d.marks[st.id];
                    return (
                      <td key={d.date} className="border-l border-line px-1 py-1 text-center">
                        <button
                          type="button"
                          aria-label={`${st.name}, ${d.label}: ${v === true ? "present" : v === false ? "absent" : "not marked"}`}
                          onClick={() => setMark(d.date, st.id, v === true ? false : true)}
                          className={`h-8 w-10 rounded-md text-xs font-bold ${
                            v === true ? "bg-ok text-white dark:text-[#0d1a1d]" : v === false ? "border-2 border-warn text-warn" : "border border-dashed border-line text-muted"
                          }`}
                        >
                          {v === true ? "P" : v === false ? "A" : "–"}
                        </button>
                      </td>
                    );
                  })}
                  <td className="border-l border-line px-3 py-1.5 text-center font-bold">{pct(present, taken.length)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">Rows in orange are under 75% attendance. Hover a date to see which lessons it covered.</p>
    </div>
  );
}
