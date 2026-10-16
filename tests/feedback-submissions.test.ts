import { test } from "node:test";
import assert from "node:assert/strict";
import { checkAnswers, parseQuestions, STARTER_QUESTIONS } from "../src/lib/feedback";
import { cleanLink, fileProblem, safeFileName } from "../src/lib/submissions";

test("starter questions pass validation", () => {
  assert.equal(parseQuestions(JSON.stringify(STARTER_QUESTIONS)).length, 4);
});

test("rejects empty prompts, single-option choices and duplicate ids", () => {
  assert.throws(() => parseQuestions(JSON.stringify([{ id: "q1", type: "text", prompt: " ", required: false }])), /needs some text/);
  assert.throws(() => parseQuestions(JSON.stringify([{ id: "q1", type: "choice", prompt: "Pace?", options: ["Fast", ""], required: true }])), /two choices/);
  assert.throws(() => parseQuestions(JSON.stringify([{ id: "q1", type: "text", prompt: "A", required: false }, { id: "q1", type: "text", prompt: "B", required: false }])), /problem/);
});

test("checks required answers and value ranges", () => {
  const qs = parseQuestions(JSON.stringify(STARTER_QUESTIONS));
  const answers = (m: Record<string, string>) => (name: string) => m[name] ?? null;
  assert.deepEqual(checkAnswers(qs, answers({ "a-q1": "4" })), { ok: false, error: "Please answer question 2." });
  assert.equal(checkAnswers(qs, answers({ "a-q1": "9", "a-q2": "Just right" })).ok, false);
  assert.equal(checkAnswers(qs, answers({ "a-q1": "4", "a-q2": "Very fast" })).ok, false);
  assert.deepEqual(checkAnswers(qs, answers({ "a-q1": "4", "a-q2": "Just right", "a-q3": "  Calculated fields  " })), {
    ok: true,
    answers: { q1: 4, q2: "Just right", q3: "Calculated fields" },
  });
});

test("upload rules: types, size, names and links", () => {
  assert.equal(fileProblem({ name: "A4.twbx", size: 1000 }), null);
  assert.match(fileProblem({ name: "virus.exe", size: 1000 }) ?? "", /isn't accepted/);
  assert.match(fileProblem({ name: "video.pdf", size: 30 * 1024 * 1024 }) ?? "", /larger than 25 MB/);
  assert.equal(safeFileName("My Report (final) v2.PDF"), "My-Report-final-v2.pdf");
  assert.equal(cleanLink("https://public.tableau.com/app/profile/x/viz/y"), "https://public.tableau.com/app/profile/x/viz/y");
  assert.equal(cleanLink("javascript:alert(1)"), null);
  assert.equal(cleanLink("not a link"), null);
});
