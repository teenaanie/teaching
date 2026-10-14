/**
 * Content file formats. A course file default-exports a CourseSeed; a cohort file
 * default-exports a CohortSeed. Run `npm run seed -- <file> [<file>...]` to load them.
 * Everything is matched by slug, so re-running a seed updates in place.
 */
import type { AssessmentKind, Grading, Resource } from "../src/lib/types";

export type QuestionSeed = { prompt: string; options: string[]; answer: number; explanation?: string };

export type AssessmentSeed = {
  slug: string;
  kind: AssessmentKind;
  title: string;
  maxScore: number;
  briefMd?: string;
  briefUrl?: string;
  /** Lesson (slug, within any module of this course) where the assessment is introduced. */
  lesson?: string;
  questions?: QuestionSeed[];
};

export type LessonSeed = {
  slug: string;
  title: string;
  summary?: string;
  bodyMd?: string;
  beforeNextMd?: string;
  resources?: Resource[];
  /** Private teacher notes. Only written if the lesson has none yet, unless --overwrite-notes. */
  notesMd?: string;
  slots?: number;
};

export type ModuleSeed = {
  slug: string;
  code?: string;
  title: string;
  summary?: string;
  grading: Grading;
  lessons: LessonSeed[];
  assessments?: AssessmentSeed[];
};

export type CourseSeed = {
  type: "course";
  slug: string;
  title: string;
  description?: string;
  modules: ModuleSeed[];
};

export type CohortSeed = {
  type: "cohort";
  course: string; // course slug
  slug: string;
  title: string;
  institution?: string;
  weekdays: number[]; // 0 = Sunday
  startTime: string; // "13:30"
  endTime: string;
  timezone: string;
  startDate: string; // YYYY-MM-DD
  holidays?: string[];
  classroomUrl?: string;
  classroomCode?: string;
  quizPin: string;
  isPublic?: boolean;
  /** Optional roster; matched by roll number. */
  students?: { name: string; rollNo: string; email?: string }[];
};

export type SeedFile = CourseSeed | CohortSeed;

// Helpers for Drive / Colab links.
export const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;
export const gdoc = (id: string) => `https://docs.google.com/document/d/${id}/edit`;
export const gsheet = (id: string) => `https://docs.google.com/spreadsheets/d/${id}/edit`;
export const gslides = (id: string) => `https://docs.google.com/presentation/d/${id}/edit`;
export const colab = (id: string) => `https://colab.research.google.com/drive/${id}`;
