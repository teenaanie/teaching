/** Feedback form shapes and helpers, shared by the admin builder and the student form. */

export type FeedbackQuestion =
  | { id: string; type: "rating"; prompt: string; required: boolean }
  | { id: string; type: "choice"; prompt: string; options: string[]; required: boolean }
  | { id: string; type: "text"; prompt: string; required: boolean };

export type FeedbackAnswers = Record<string, number | string>;

export const RATING_LABELS = ["1 · Poor", "2", "3 · OK", "4", "5 · Great"];

/** The questions a new form starts with; the teacher can change all of them. */
export const STARTER_QUESTIONS: FeedbackQuestion[] = [
  { id: "q1", type: "rating", prompt: "How clear was today's class?", required: true },
  { id: "q2", type: "choice", prompt: "The pace was…", options: ["Too slow", "Just right", "Too fast"], required: true },
  { id: "q3", type: "text", prompt: "What was the most useful thing you learned?", required: false },
  { id: "q4", type: "text", prompt: "What was confusing, or what should we go over again?", required: false },
];

/** Cleans questions coming from the admin form; throws with a readable message if invalid. */
export function parseQuestions(json: string): FeedbackQuestion[] {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("The questions couldn't be read. Reload the page and try again.");
  }
  if (!Array.isArray(raw) || raw.length === 0) throw new Error("Add at least one question.");
  const seen = new Set<string>();
  return raw.map((q, i) => {
    const item = q as Record<string, unknown>;
    const id = String(item.id ?? "");
    const prompt = String(item.prompt ?? "").trim();
    const required = Boolean(item.required);
    if (!/^[\w-]{1,32}$/.test(id) || seen.has(id)) throw new Error(`Question ${i + 1} has a problem. Reload the page and try again.`);
    seen.add(id);
    if (!prompt) throw new Error(`Question ${i + 1} needs some text.`);
    if (item.type === "rating") return { id, type: "rating", prompt, required };
    if (item.type === "text") return { id, type: "text", prompt, required };
    if (item.type === "choice") {
      const options = (Array.isArray(item.options) ? item.options : []).map((o) => String(o).trim()).filter(Boolean);
      if (options.length < 2) throw new Error(`Question ${i + 1} needs at least two choices.`);
      return { id, type: "choice", prompt, options, required };
    }
    throw new Error(`Question ${i + 1} has an unknown type.`);
  });
}

/** Validates a student's answers against the form. Returns answers or an error message. */
export function checkAnswers(
  questions: FeedbackQuestion[],
  get: (name: string) => string | null,
): { ok: true; answers: FeedbackAnswers } | { ok: false; error: string } {
  const answers: FeedbackAnswers = {};
  for (const [i, q] of questions.entries()) {
    const raw = (get(`a-${q.id}`) ?? "").trim();
    if (!raw) {
      if (q.required) return { ok: false, error: `Please answer question ${i + 1}.` };
      continue;
    }
    if (q.type === "rating") {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > 5) return { ok: false, error: `Question ${i + 1}: pick a rating from 1 to 5.` };
      answers[q.id] = n;
    } else if (q.type === "choice") {
      if (!q.options.includes(raw)) return { ok: false, error: `Question ${i + 1}: pick one of the choices.` };
      answers[q.id] = raw;
    } else {
      answers[q.id] = raw.slice(0, 2000);
    }
  }
  return { ok: true, answers };
}
