/**
 * Parsing for Google Classroom's "Download grades" CSV. Pure, so it can be tested.
 * Layout: a header row (Last Name, First Name, Email Address, <assignment titles>…),
 * optional rows for due dates and max points, then one row per student.
 */

export type CsvStudent = { id: string; name: string; email: string | null };
export type CsvAssessment = { id: string; title: string };

export const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Best-guess assessment for a column header, by exact then partial title match. */
export function guessAssessment<A extends CsvAssessment>(header: string, assessments: A[]): A | null {
  const h = normalise(header);
  if (!h) return null;
  return (
    assessments.find((a) => normalise(a.title) === h) ??
    assessments.find((a) => h.includes(normalise(a.title)) || normalise(a.title).includes(h)) ??
    null
  );
}

export function parseClassroomRows<S extends CsvStudent>(rows: string[][], students: S[]) {
  const header = rows[0] ?? [];
  const col = (name: string) => header.findIndex((h) => normalise(h) === name);
  const iFirst = col("first name");
  const iLast = col("last name");
  const iEmail = col("email address") >= 0 ? col("email address") : col("email");
  const iName = col("name");
  const fixed = new Set([iFirst, iLast, iEmail, iName].filter((i) => i >= 0));
  const scoreCols = header.map((h, i) => ({ h, i })).filter(({ i }) => !fixed.has(i));

  const matched: { student: S; cells: string[] }[] = [];
  const unmatched: string[] = [];
  for (const r of rows.slice(1)) {
    const email = iEmail >= 0 ? (r[iEmail] ?? "").trim().toLowerCase() : "";
    const name = (iName >= 0 ? r[iName] : [r[iFirst], r[iLast]].filter(Boolean).join(" ")) ?? "";
    // Classroom adds due-date and max-points rows with no student in them.
    if (!email && !/[a-z]/i.test(name)) continue;
    const student =
      (email && students.find((s) => s.email?.toLowerCase() === email)) ||
      students.find((s) => normalise(s.name) === normalise(name)) ||
      null;
    if (student) matched.push({ student, cells: r });
    else unmatched.push(name.trim() || email);
  }
  return { scoreCols, matched, unmatched };
}

/** Turns matched rows + a column→assessment mapping into score records, skipping blanks. */
export function scoresFromRows(
  matched: { student: CsvStudent; cells: string[] }[],
  mapping: Record<number, string>,
) {
  return matched.flatMap(({ student, cells }) =>
    Object.entries(mapping)
      .filter(([, id]) => id)
      .map(([i, assessmentId]) => ({ studentId: student.id, assessmentId, raw: (cells[Number(i)] ?? "").trim() }))
      .filter((x) => x.raw !== "" && !Number.isNaN(Number(x.raw)))
      .map(({ studentId, assessmentId, raw }) => ({ studentId, assessmentId, score: Number(raw) })),
  );
}
