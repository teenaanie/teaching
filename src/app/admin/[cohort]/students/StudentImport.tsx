"use client";

import { useState, useTransition } from "react";
import { importStudents, type ImportStudentsResult } from "../../actions";

const sample = "name,roll_no,email\nAisha Khan,BCA301,\nMohammed Arif,BCA302,";

export function StudentImport({ cohortId }: { cohortId: string }) {
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState<ImportStudentsResult | null>(null);
  const [pending, start] = useTransition();
  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="font-display text-xl font-semibold">Add or update students</h2>
      <p className="mt-1 text-sm text-muted">
        Paste CSV with columns <code>name, roll_no, email</code> (email is optional, but it helps match Classroom grades).
        Existing roll numbers are updated.
      </p>
      <textarea value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={sample} rows={10} className="mt-3 w-full rounded-lg border border-line bg-paper p-3 font-mono text-sm" />
      <input
        type="file"
        accept=".csv,text/csv"
        className="mt-2 text-sm"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setCsv(await f.text());
        }}
      />
      <button
        disabled={pending || !csv.trim()}
        onClick={() => start(async () => setResult(await importStudents(cohortId, csv)))}
        className="mt-3 block rounded-full bg-teal px-5 py-2 text-sm font-bold text-white disabled:opacity-60 dark:text-[#0d1a1d]"
      >
        {pending ? "Importing…" : "Import"}
      </button>
      {result && (
        <p className="mt-3 text-sm">
          Added <b>{result.added}</b>, updated <b>{result.updated}</b>.
          {result.errors.length > 0 && <span className="block text-warn">{result.errors.join("; ")}</span>}
        </p>
      )}
    </section>
  );
}
