import Link from "next/link";
import { getAdminCohort } from "@/lib/admin-data";
import { formatDate, formatTime, localDate, nowMs } from "@/lib/format";
import { SessionTable } from "./SessionTable";

export const instant = false;

export default async function SessionsAdmin({ params }: PageProps<"/admin/[cohort]">) {
  const { cohort: slug } = await params;
  const data = await getAdminCohort(slug);
  const { cohort, sessions, roster, attendance } = data;
  const tz = cohort.timezone;
  const lessons = new Map(data.outline.modules.flatMap((m) => m.lessons.map((l) => [l.id, { l, m }] as const)));
  const active = roster.filter((r) => r.status === "active").length;
  const presentBySession = new Map<string, number>();
  const takenBySession = new Set<string>();
  for (const a of attendance) {
    takenBySession.add(a.session_id);
    if (a.present) presentBySession.set(a.session_id, (presentBySession.get(a.session_id) ?? 0) + 1);
  }
  const now = nowMs();
  const next = sessions.find((s) => s.status === "scheduled" && new Date(s.ends_at).getTime() > now);

  return (
    <div className="grid gap-8">
      {next && (
        <Link href={`/admin/${slug}/sessions/${next.id}`} className="block rounded-2xl bg-ink p-6 text-paper">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Next class</p>
          <p className="mt-1 font-display text-2xl font-semibold">{next.title ?? lessons.get(next.lesson_id!)?.l.title}</p>
          <p className="mt-1 opacity-80">
            {formatDate(next.starts_at, tz, { weekday: "long", month: "long" })} · {formatTime(next.starts_at, tz)} · teacher notes and
            attendance →
          </p>
        </Link>
      )}
      <p className="text-sm text-muted">
        Change a date to move a class; two lessons on the same day are shaded. Notes appear for students on the schedule and
        lesson page. Rebuilding the schedule in Settings resets upcoming dates but keeps notes.
      </p>
      <SessionTable
        slug={slug}
        activeCount={active}
        rows={sessions.map((s) => {
          const info = s.lesson_id ? lessons.get(s.lesson_id) : undefined;
          return {
            id: s.id,
            date: localDate(s.starts_at, tz),
            weekday: formatDate(s.starts_at, tz, { day: undefined, month: undefined, weekday: "long" }),
            title: (s.title ?? info?.l.title ?? "Class") + (info && info.l.slots > 1 ? ` (${s.part}/${info.l.slots})` : ""),
            module: info?.m.title ?? "",
            note: s.note ?? "",
            cancelled: s.status === "cancelled",
            attendance: { taken: takenBySession.has(s.id), present: presentBySession.get(s.id) ?? 0, past: new Date(s.starts_at).getTime() < now },
          };
        })}
      />
      {sessions.length === 0 && <p className="text-muted">No sessions yet. Generate the schedule from Settings.</p>}
    </div>
  );
}
