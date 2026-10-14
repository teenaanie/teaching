/**
 * Lays a course's lessons onto real class dates for a cohort.
 * Pure functions so they can be tested without a database.
 */

export type ScheduleInput = {
  weekdays: number[]; // 0 = Sunday
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM[:SS]
  endTime: string;
  timezone: string;
  holidays: string[];
};

export type LessonSlot = { lessonId: string; slots: number; title?: string };

export type PlannedSession = {
  lessonId: string;
  part: number;
  position: number;
  date: string;
  startsAt: string; // ISO UTC
  endsAt: string;
};

/** Offset (ms) of `timeZone` from UTC at the given instant. */
function tzOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - instant.getTime();
}

/** Converts a wall-clock date + time in `timeZone` to a UTC ISO string. */
export function zonedToUtc(date: string, time: string, timeZone: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm, ss = 0] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm, ss);
  const offset = tzOffsetMs(new Date(guess), timeZone);
  const result = guess - offset;
  // Re-check once in case the offset differs at the corrected instant (DST edges).
  const offset2 = tzOffsetMs(new Date(result), timeZone);
  return new Date(guess - offset2).toISOString();
}

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function weekday(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Yields class dates from startDate on the cohort's weekdays, skipping holidays. */
export function* classDates(input: ScheduleInput): Generator<string> {
  if (input.weekdays.length === 0) return;
  const holidays = new Set(input.holidays);
  let date = input.startDate;
  // Guard against runaway loops: at most ~5 years of days.
  for (let i = 0; i < 365 * 5; i++) {
    if (input.weekdays.includes(weekday(date)) && !holidays.has(date)) yield date;
    date = addDays(date, 1);
  }
}

export type LessonPart = { lessonId: string; part: number };

/** Expands lessons into one entry per class slot, in order. */
export function lessonParts(lessons: LessonSlot[]): LessonPart[] {
  return lessons.flatMap((l) => Array.from({ length: l.slots }, (_, i) => ({ lessonId: l.lessonId, part: i + 1 })));
}

/** Assigns lesson parts, in order, to consecutive class dates. Stops if dates run out. */
export function planParts(input: ScheduleInput, parts: LessonPart[], firstPosition = 1): PlannedSession[] {
  const dates = classDates(input);
  const planned: PlannedSession[] = [];
  for (const { lessonId, part } of parts) {
    const next = dates.next();
    if (next.done) break;
    const date = next.value;
    planned.push({
      lessonId,
      part,
      position: firstPosition + planned.length,
      date,
      startsAt: zonedToUtc(date, input.startTime, input.timezone),
      endsAt: zonedToUtc(date, input.endTime, input.timezone),
    });
  }
  return planned;
}

/** Assigns each lesson (in order) to as many consecutive class dates as it has slots. */
export function planSessions(input: ScheduleInput, lessons: LessonSlot[]): PlannedSession[] {
  return planParts(input, lessonParts(lessons));
}

export { addDays };
