/**
 * Weighted grade calculation per module, driven by each module's `grading` weights.
 * Pure functions so they can be tested without a database.
 */
import type { AssessmentKind, Grading } from "./types";

export type GradeAssessment = { id: string; moduleId: string; kind: AssessmentKind; maxScore: number; counts: boolean };
export type GradeSession = { id: string; moduleId: string | null; counts: boolean };

export type GradeInput = {
  modules: { id: string; grading: Grading }[];
  assessments: GradeAssessment[];
  sessions: GradeSession[];
  /** scores[studentId][assessmentId] = raw score */
  scores: Record<string, Record<string, number>>;
  /** attendance[studentId][sessionId] = present */
  attendance: Record<string, Record<string, boolean>>;
};

export type ComponentResult = { key: string; weight: number; percent: number | null };
export type ModuleGrade = { moduleId: string; percent: number | null; components: ComponentResult[] };

/**
 * Percent for one component. An assessment counts for a student once it is due (missing
 * work is then 0) or as soon as that student has a score for it. Sessions that "count" are past sessions with
 * attendance taken; missing records are treated as absent.
 */
function componentPercent(
  key: string,
  moduleId: string,
  studentId: string,
  input: GradeInput,
): number | null {
  if (key === "attendance") {
    const sessions = input.sessions.filter((s) => s.moduleId === moduleId && s.counts);
    if (sessions.length === 0) return null;
    const marks = input.attendance[studentId] ?? {};
    const present = sessions.filter((s) => marks[s.id]).length;
    return (present / sessions.length) * 100;
  }
  const scores = input.scores[studentId] ?? {};
  const items = input.assessments.filter(
    (a) => a.moduleId === moduleId && a.kind === key && (a.counts || scores[a.id] !== undefined),
  );
  if (items.length === 0) return null;
  const total = items.reduce((sum, a) => sum + Math.min((scores[a.id] ?? 0) / a.maxScore, 1), 0);
  return (total / items.length) * 100;
}

/** Module grade = weighted average of components that have data, re-normalised over their weights. */
export function moduleGrade(moduleId: string, grading: Grading, studentId: string, input: GradeInput): ModuleGrade {
  const components: ComponentResult[] = Object.entries(grading).map(([key, weight]) => ({
    key,
    weight: weight ?? 0,
    percent: componentPercent(key, moduleId, studentId, input),
  }));
  const withData = components.filter((c) => c.percent !== null && c.weight > 0);
  const weightSum = withData.reduce((s, c) => s + c.weight, 0);
  const percent = weightSum === 0 ? null : withData.reduce((s, c) => s + (c.percent as number) * c.weight, 0) / weightSum;
  return { moduleId, percent, components };
}

export function studentGrades(studentId: string, input: GradeInput): ModuleGrade[] {
  return input.modules.map((m) => moduleGrade(m.id, m.grading, studentId, input));
}

export function attendancePercent(studentId: string, input: GradeInput): number | null {
  const sessions = input.sessions.filter((s) => s.counts);
  if (sessions.length === 0) return null;
  const marks = input.attendance[studentId] ?? {};
  return (sessions.filter((s) => marks[s.id]).length / sessions.length) * 100;
}
