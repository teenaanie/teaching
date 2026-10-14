"use client";

import Papa from "papaparse";
import { useMemo, useState, useTransition } from "react";
import { guessAssessment, parseClassroomRows, scoresFromRows } from "@/lib/classroom-csv";
import { importScores } from "../../actions";

type Student = { id: string; name: string; email: string | null; roll: string };
type Assessment = { id: string; title: string; kind: string; maxScore: number };

/**
 * Imports a Google Classroom grade export ("Download grades" → CSV).
 * Students are matched by email, then by "First Last" name; columns are matched to
 * assessments by title and can be corrected before saving.
 */
export function ClassroomImport({ cohortId, students, assessments }: { cohortId: string; students: Student[]; assessments: Assessment[] }) {
  const [rows, setRows] = useState<string[][] | null>(null);
  const [mapping, setMapping] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();

  const parsed = useMemo(() => (rows && rows.length > 0 ? parseClassroomRows(rows, students) : null), [rows, students]);

  function onFile(file: File) {
    Papa.parse<string[]>(file, {
      skipEmptyLines: true,
      complete: (res) => {
        const data = res.data;
        setRows(data);
        setMessage("");
        const guesses: Record<number, string> = {};
        data[0]?.forEach((h, i) => {
          const g = guessAssessment(h, assessments);
          if (g) guesses[i] = g.id;
        });
        setMapping(guesses);
      },
    });
  }

  function save() {
    if (!parsed) return;
    const payload = scoresFromRows(parsed.matched, mapping);
    start(async () => {
      const { saved } = await importScores(cohortId, payload);
      setMessage(`Saved ${saved} scores.`);
      setRows(null);
    });
  }

  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="font-display text-xl font-semibold">Import from Google Classroom</h2>
      <p className="mt-1 text-sm text-muted">In Classroom open Grades → ⚙ → Download grades → CSV, then choose the file here.</p>
      <input type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="mt-3 text-sm" />
      {message && <p className="mt-3 font-bold text-ok">{message}</p>}
      {parsed && (
        <div className="mt-4 grid gap-4">
          <div>
            <h3 className="text-sm font-bold">Match columns to assessments</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {parsed.scoreCols.map(({ h, i }) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1/2 truncate" title={h}>{h || <em>(blank)</em>}</span>
                  <select
                    value={mapping[i] ?? ""}
                    onChange={(e) => setMapping({ ...mapping, [i]: e.target.value })}
                    className="w-1/2 rounded border border-line bg-paper px-2 py-1"
                  >
                    <option value="">Skip</option>
                    {assessments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title} (/{a.maxScore})
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm">
            Matched <b>{parsed.matched.length}</b> of {students.length} students.
            {parsed.unmatched.length > 0 && <span className="text-warn"> Not matched: {parsed.unmatched.join(", ")}.</span>}
          </p>
          <button disabled={pending} onClick={save} className="justify-self-start rounded-full bg-teal px-5 py-2 text-sm font-bold text-white disabled:opacity-60 dark:text-[#0d1a1d]">
            {pending ? "Importing…" : "Import scores"}
          </button>
        </div>
      )}
    </section>
  );
}
