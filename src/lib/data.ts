import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { createClient } from "./supabase/server";
import type { Assessment, Cohort, CohortAssessment, Course, Lesson, Module, Session } from "./types";

export type CourseOutline = {
  course: Course;
  modules: (Module & { lessons: Lesson[]; assessments: Assessment[] })[];
};

export type CohortView = CourseOutline & {
  cohort: Cohort;
  sessions: Session[];
  cohortAssessments: CohortAssessment[];
};

function must<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

export const getPublicCohorts = cache(async () => {
  await connection();
  const supabase = await createClient();
  return must(
    await supabase.from("cohorts").select("*, course:courses(title)").eq("is_public", true).order("start_date", { ascending: false }),
  ) as (Cohort & { course: { title: string } })[];
});

export async function getCourseOutline(courseId: string): Promise<CourseOutline> {
  const supabase = await createClient();
  const [course, modules] = await Promise.all([
    supabase.from("courses").select("*").eq("id", courseId).single(),
    supabase
      .from("modules")
      .select("*, lessons(*), assessments(*)")
      .eq("course_id", courseId)
      .order("position")
      .order("position", { referencedTable: "lessons" })
      .order("position", { referencedTable: "assessments" }),
  ]);
  return { course: must(course) as Course, modules: must(modules) as CourseOutline["modules"] };
}

/** Everything a cohort's public pages need, in one cached call per request. */
export const getCohortView = cache(async (slug: string): Promise<CohortView | null> => {
  await connection();
  const supabase = await createClient();
  const { data: cohort, error } = await supabase.from("cohorts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!cohort) return null;
  const [outline, sessions, cohortAssessments] = await Promise.all([
    getCourseOutline(cohort.course_id),
    supabase.from("sessions").select("*").eq("cohort_id", cohort.id).order("position"),
    supabase.from("cohort_assessments").select("*").eq("cohort_id", cohort.id),
  ]);
  return {
    ...outline,
    cohort: cohort as Cohort,
    sessions: must(sessions) as Session[],
    cohortAssessments: must(cohortAssessments) as CohortAssessment[],
  };
});

export function findLesson(view: CourseOutline, moduleSlug: string, lessonSlug: string) {
  const mod = view.modules.find((m) => m.slug === moduleSlug);
  const lesson = mod?.lessons.find((l) => l.slug === lessonSlug);
  return mod && lesson ? { module: mod, lesson } : null;
}

/** Lesson id -> module, for quick lookups. */
export function lessonIndex(view: CourseOutline) {
  const map = new Map<string, { module: CourseOutline["modules"][number]; lesson: Lesson }>();
  for (const m of view.modules) for (const l of m.lessons) map.set(l.id, { module: m, lesson: l });
  return map;
}
