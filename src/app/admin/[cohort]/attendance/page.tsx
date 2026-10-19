import { getAdminCohort } from "@/lib/admin-data";
import { formatDate, localDate, nowMs } from "@/lib/format";
import { AttendanceRegister, type RegisterDay } from "./AttendanceRegister";

export const instant = false;

export default async function AttendanceAdmin({ params }: PageProps<"/admin/[cohort]/attendance">) {
  const { cohort: slug } = await params;
  const data = await getAdminCohort(slug);
  const tz = data.cohort.timezone;
  const today = localDate(new Date(nowMs()), tz);

  // One column per class day up to today; a day may cover several lessons.
  const lessons = new Map(data.outline.modules.flatMap((m) => m.lessons.map((l) => [l.id, l.title] as const)));
  const byDay = new Map<string, { ids: string[]; titles: string[]; startsAt: string }>();
  for (const s of data.sessions) {
    if (s.status !== "scheduled") continue;
    const day = localDate(s.starts_at, tz);
    if (day > today) continue;
    const entry = byDay.get(day) ?? { ids: [], titles: [], startsAt: s.starts_at };
    entry.ids.push(s.id);
    entry.titles.push(s.title ?? lessons.get(s.lesson_id ?? "") ?? "Class");
    byDay.set(day, entry);
  }

  // A student's mark for a day: present if present at any lesson that day, absent if marked
  // absent, empty if not taken.
  const marks = new Map<string, boolean>();
  for (const a of data.attendance) marks.set(`${a.session_id}:${a.student_id}`, a.present);
  const students = data.roster.filter((r) => r.status === "active");
  const days: RegisterDay[] = [...byDay.entries()].map(([date, d]) => ({
    date,
    label: formatDate(d.startsAt, tz),
    lessons: d.titles,
    marks: Object.fromEntries(
      students.map((st) => {
        const values = d.ids.map((id) => marks.get(`${id}:${st.id}`)).filter((v) => v !== undefined);
        return [st.id, values.length === 0 ? null : values.some(Boolean)];
      }),
    ),
  }));

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Attendance register</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          One column per class day, up to today. Tap a cell to switch between <b>P</b> (present) and <b>A</b> (absent). It saves
          straight away and covers every lesson that day. Attendance % counts class days.
        </p>
      </div>
      {students.length === 0 ? (
        <p className="rounded-xl border border-line bg-card p-5 text-muted">Add students first, on the Students page.</p>
      ) : days.length === 0 ? (
        <p className="rounded-xl border border-line bg-card p-5 text-muted">No classes have happened yet.</p>
      ) : (
        <AttendanceRegister
          cohortId={data.cohort.id}
          students={students.map((s) => ({ id: s.id, name: s.full_name, roll: s.roll_no }))}
          days={days}
        />
      )}
    </div>
  );
}
