/**
 * Cohort operations shared by admin actions and the seed script.
 * Takes a service-role client; callers are responsible for authorisation.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { localDate } from "./format";
import { addDays, lessonParts, planParts } from "./schedule";
import type { Cohort } from "./types";

export async function orderedLessons(db: SupabaseClient, courseId: string) {
  const { data, error } = await db
    .from("modules")
    .select("position, lessons(id, slots, position)")
    .eq("course_id", courseId)
    .order("position")
    .order("position", { referencedTable: "lessons" });
  if (error) throw new Error(error.message);
  return (data ?? []).flatMap((m) => (m.lessons as { id: string; slots: number }[]).map((l) => ({ lessonId: l.id, slots: l.slots })));
}

/**
 * Re-plans the cohort's upcoming sessions. Sessions already held (in the past) or with
 * attendance taken are kept; every later session is rebuilt from the remaining lesson
 * parts, honouring the cohort's weekdays and holidays.
 */
export async function regenerateSchedule(db: SupabaseClient, cohortId: string, now = new Date()) {
  const { data: cohort, error } = await db.from("cohorts").select("*").eq("id", cohortId).single<Cohort>();
  if (error) throw new Error(error.message);

  const [{ data: sessions }, lessons] = await Promise.all([
    db.from("sessions").select("id, lesson_id, part, starts_at, attendance(session_id)").eq("cohort_id", cohortId).order("starts_at"),
    orderedLessons(db, cohort.course_id),
  ]);
  const all = (sessions ?? []) as { id: string; lesson_id: string | null; part: number; starts_at: string; attendance: unknown[] }[];
  const kept = all.filter((s) => new Date(s.starts_at) <= now || s.attendance.length > 0);
  const replace = all.filter((s) => !kept.includes(s));

  const covered = new Set(kept.map((s) => `${s.lesson_id}:${s.part}`));
  const remaining = lessonParts(lessons).filter((p) => !covered.has(`${p.lessonId}:${p.part}`));

  const today = localDate(now, cohort.timezone);
  const lastKept = kept.at(-1);
  const after = lastKept ? addDays(localDate(lastKept.starts_at, cohort.timezone), 1) : cohort.start_date;
  let startDate = after > cohort.start_date ? after : cohort.start_date;
  // Once classes have begun, never plan into days that have already gone by.
  if (kept.length > 0 && startDate < today) startDate = today;

  const planned = planParts(
    {
      weekdays: cohort.weekdays,
      startDate,
      startTime: cohort.start_time,
      endTime: cohort.end_time,
      timezone: cohort.timezone,
      holidays: cohort.holidays,
    },
    remaining,
    kept.length + 1,
  );

  if (replace.length > 0) {
    const { error: delError } = await db.from("sessions").delete().in("id", replace.map((s) => s.id));
    if (delError) throw new Error(delError.message);
  }
  if (planned.length > 0) {
    const { error: insError } = await db.from("sessions").insert(
      planned.map((p) => ({
        cohort_id: cohortId,
        lesson_id: p.lessonId,
        part: p.part,
        position: p.position,
        starts_at: p.startsAt,
        ends_at: p.endsAt,
      })),
    );
    if (insError) throw new Error(insError.message);
  }
  return { kept: kept.length, planned: planned.length };
}
