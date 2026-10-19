import { test } from "node:test";
import assert from "node:assert/strict";
import { moduleGrade, type GradeInput } from "../src/lib/grades";

const input: GradeInput = {
  modules: [
    { id: "basic", grading: { attendance: 20, quiz: 10, assignment: 70 } },
    { id: "py", grading: { attendance: 20, assignment: 50, hackathon: 30 } },
  ],
  assessments: [
    { id: "a1", moduleId: "basic", kind: "assignment", maxScore: 45, counts: true },
    { id: "a2", moduleId: "basic", kind: "assignment", maxScore: 50, counts: true },
    { id: "q1", moduleId: "basic", kind: "quiz", maxScore: 10, counts: true },
    { id: "a9", moduleId: "basic", kind: "assignment", maxScore: 10, counts: false },
    { id: "p1", moduleId: "py", kind: "assignment", maxScore: 10, counts: true },
  ],
  sessions: [
    { id: "s1", moduleId: "basic", counts: true },
    { id: "s2", moduleId: "basic", counts: true },
    { id: "s3", moduleId: "basic", counts: false },
    { id: "s4", moduleId: "py", counts: true },
  ],
  scores: { stu: { a1: 45, a2: 25, q1: 8, p1: 10 } },
  attendance: { stu: { s1: true, s2: false, s4: true } },
};

test("basic module: 20/10/70 weighting", () => {
  const g = moduleGrade("basic", input.modules[0].grading, "stu", input);
  // attendance 50%, quiz 80%, assignments (100% + 50%)/2 = 75%
  const expected = (50 * 20 + 80 * 10 + 75 * 70) / 100;
  assert.ok(Math.abs((g.percent ?? 0) - expected) < 1e-9);
});

test("python module: components without data are excluded and weights re-normalised", () => {
  const g = moduleGrade("py", input.modules[1].grading, "stu", input);
  // attendance 100 (w20), assignment 100 (w50), hackathon no data
  assert.equal(g.percent, 100);
  assert.equal(g.components.find((c) => c.key === "hackathon")?.percent, null);
});

test("missing scores on counted assessments are zero", () => {
  const g = moduleGrade("basic", input.modules[0].grading, "nobody", input);
  assert.equal(g.percent, 0);
});

test("an assessment that isn't due yet only counts for students who have a score", () => {
  const withEarly: GradeInput = { ...input, scores: { stu: { ...input.scores.stu, a9: 10 } } };
  const g = moduleGrade("basic", input.modules[0].grading, "stu", withEarly);
  // assignments now (100% + 50% + 100%)/3
  const expected = (50 * 20 + 80 * 10 + (250 / 3) * 70) / 100;
  assert.ok(Math.abs((g.percent ?? 0) - expected) < 1e-9);
  const other = moduleGrade("basic", input.modules[0].grading, "nobody", withEarly);
  assert.equal(other.percent, 0);
});

test("attendance counts class days, not lessons", () => {
  const days: GradeInput = {
    ...input,
    sessions: [
      { id: "m1", moduleId: "basic", counts: true, day: "2026-10-13" },
      { id: "m2", moduleId: "basic", counts: true, day: "2026-10-13" },
      { id: "m3", moduleId: "basic", counts: true, day: "2026-10-13" },
      { id: "t1", moduleId: "basic", counts: true, day: "2026-10-15" },
    ],
    attendance: { stu: { m1: true, m2: true, m3: true, t1: false } },
  };
  const g = moduleGrade("basic", { attendance: 100 }, "stu", days);
  assert.equal(g.percent, 50); // present 1 of 2 days, not 3 of 4 lessons
});
