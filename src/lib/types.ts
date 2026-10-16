export type ResourceType = "slides" | "video" | "notebook" | "dataset" | "doc" | "link";

export type Resource = { type: ResourceType; title: string; url: string };

export type AssessmentKind = "assignment" | "quiz" | "project" | "hackathon";

/** Weight per grading component; keys are "attendance" or an assessment kind. */
export type Grading = Partial<Record<"attendance" | AssessmentKind, number>>;

export type Course = { id: string; slug: string; title: string; description: string | null };

export type Module = {
  id: string;
  course_id: string;
  slug: string;
  position: number;
  code: string | null;
  title: string;
  summary: string | null;
  grading: Grading;
};

export type Lesson = {
  id: string;
  module_id: string;
  slug: string;
  position: number;
  title: string;
  summary: string | null;
  body_md: string | null;
  before_next_md: string | null;
  resources: Resource[];
  slots: number;
};

export type Assessment = {
  id: string;
  module_id: string;
  lesson_id: string | null;
  slug: string;
  position: number;
  kind: AssessmentKind;
  title: string;
  brief_md: string | null;
  brief_url: string | null;
  max_score: number;
};

export type CohortAssessment = {
  cohort_id: string;
  assessment_id: string;
  classroom_url: string | null;
  due_date: string | null;
  is_open: boolean;
  accept_submissions: boolean;
};

export type Cohort = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  institution: string | null;
  weekdays: number[];
  start_time: string;
  end_time: string;
  timezone: string;
  start_date: string;
  holidays: string[];
  classroom_url: string | null;
  classroom_code: string | null;
  announcement: string | null;
  is_public: boolean;
};

export type Session = {
  id: string;
  cohort_id: string;
  lesson_id: string | null;
  part: number;
  position: number;
  starts_at: string;
  ends_at: string;
  title: string | null;
  note: string | null;
  status: "scheduled" | "cancelled";
};

export type QuizQuestion = {
  id: string;
  assessment_id: string;
  position: number;
  prompt: string;
  options: string[];
  answer_index: number;
  explanation: string | null;
};
