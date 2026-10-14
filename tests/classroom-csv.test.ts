import { test } from "node:test";
import assert from "node:assert/strict";
import { guessAssessment, parseClassroomRows, scoresFromRows } from "../src/lib/classroom-csv";

const students = [
  { id: "s1", name: "Test Student 01", email: "t01@local.test" },
  { id: "s2", name: "Test Student 02", email: null },
];
const assessments = [
  { id: "a1", title: "Assignment 1: Different graph types" },
  { id: "a2", title: "Assignment 2: Mean, median, mode and SD" },
];

const rows = [
  ["Last Name", "First Name", "Email Address", "Assignment 1: Different graph types", "Assignment 2: Mean, median, mode and SD", "Extra"],
  ["", "", "", "Oct 20, 2026", "Oct 27, 2026", ""],
  ["", "", "", "45", "50", "10"],
  ["01", "Test Student", "T01@local.test", "45", "40", "1"],
  ["02", "Test Student", "", "30", "", ""],
  ["Unknown", "Nobody", "x@y.z", "10", "10", ""],
];

test("matches columns by title", () => {
  assert.equal(guessAssessment("Assignment 1: Different graph types", assessments)?.id, "a1");
  assert.equal(guessAssessment("Extra", assessments), null);
});

test("skips date/points rows, matches by email then name, reports unknowns", () => {
  const p = parseClassroomRows(rows, students);
  assert.deepEqual(p.matched.map((m) => m.student.id), ["s1", "s2"]);
  assert.deepEqual(p.unmatched, ["Nobody Unknown"]);
  assert.deepEqual(p.scoreCols.map((c) => c.i), [3, 4, 5]);
});

test("builds score records, ignoring blanks and unmapped columns", () => {
  const p = parseClassroomRows(rows, students);
  const scores = scoresFromRows(p.matched, { 3: "a1", 4: "a2", 5: "" });
  assert.deepEqual(scores, [
    { studentId: "s1", assessmentId: "a1", score: 45 },
    { studentId: "s1", assessmentId: "a2", score: 40 },
    { studentId: "s2", assessmentId: "a1", score: 30 },
  ]);
});
