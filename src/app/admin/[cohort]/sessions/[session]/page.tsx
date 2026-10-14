import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ResourceList } from "@/components/ResourceList";
import { getAdminCohort } from "@/lib/admin-data";
import { formatDate, formatTime, localDate } from "@/lib/format";
import { saveLessonNotes, updateSession } from "../../../actions";
import { AttendanceForm } from "./AttendanceForm";

export const instant = false;

export default async function SessionAdmin({ params }: PageProps<"/admin/[cohort]/sessions/[session]">) {
  const { cohort: slug, session: sessionId } = await params;
  const data = await getAdminCohort(slug);
  const session = data.sessions.find((s) => s.id === sessionId);
  if (!session) notFound();
  const tz = data.cohort.timezone;
  const mod = data.outline.modules.find((m) => m.lessons.some((l) => l.id === session.lesson_id));
  const lesson = mod?.lessons.find((l) => l.id === session.lesson_id);
  const marks = new Map(data.attendance.filter((a) => a.session_id === session.id).map((a) => [a.student_id, a.present]));
  const students = data.roster.filter((r) => r.status === "active");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <section className="min-w-0">
        <p className="text-sm font-bold text-accent">
          {formatDate(session.starts_at, tz, { weekday: "long", month: "long" })} · {formatTime(session.starts_at, tz)}–
          {formatTime(session.ends_at, tz)}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold">{session.title ?? lesson?.title}</h1>
        {mod && <p className="text-muted">{mod.title}{lesson && lesson.slots > 1 ? ` · part ${session.part} of ${lesson.slots}` : ""}</p>}

        {lesson && (
          <>
            <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted">Teacher notes</h2>
            <div className="mt-2 rounded-2xl border border-line bg-card p-5">
              {lesson.notes_md ? <Markdown>{lesson.notes_md}</Markdown> : <p className="text-muted">No notes yet.</p>}
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-teal">Edit notes</summary>
              <form action={saveLessonNotes.bind(null, lesson.id, slug)} className="mt-2 grid gap-2">
                <textarea name="notes_md" defaultValue={lesson.notes_md} rows={16} className="rounded-lg border border-line bg-card p-3 font-mono text-sm" />
                <button className="justify-self-start rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-white dark:text-[#0d1a1d]">Save notes</button>
              </form>
            </details>
            <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-muted">Materials</h2>
            <div className="mt-2">
              <ResourceList resources={lesson.resources} />
            </div>
          </>
        )}

        <details className="mt-8">
          <summary className="cursor-pointer text-sm text-teal">Move, rename, add a note or cancel this session</summary>
          <form action={updateSession.bind(null, session.id)} className="mt-3 grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold">
              Date
              <input type="date" name="date" defaultValue={localDate(session.starts_at, tz)} className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Title override
              <input name="title" defaultValue={session.title ?? ""} placeholder={lesson?.title} className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-bold sm:col-span-2">
              Note for students
              <input name="note" defaultValue={session.note ?? ""} placeholder="e.g. We'll cover both chart lessons today" className="rounded-lg border border-line bg-paper px-3 py-2 font-normal" />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="cancelled" defaultChecked={session.status === "cancelled"} /> Cancelled
            </label>
            <button className="justify-self-start rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-white dark:text-[#0d1a1d]">Save</button>
            <p className="text-xs text-muted sm:col-span-2">
              To push every later lesson back by a class, add the date as a holiday in Settings and rebuild the schedule.
            </p>
          </form>
        </details>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Attendance</h2>
        <AttendanceForm
          sessionId={session.id}
          students={students.map((s) => ({ id: s.id, name: s.full_name, roll: s.roll_no }))}
          initial={Object.fromEntries(students.map((s) => [s.id, marks.get(s.id) ?? null]))}
        />
      </section>
    </div>
  );
}
