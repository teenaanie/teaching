import Link from "next/link";
import { getAdminCohort } from "@/lib/admin-data";
import { formatDate, formatTime, nowMs } from "@/lib/format";

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
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-widest text-muted">
          <tr>
            <th className="py-2 pr-3">#</th>
            <th className="py-2 pr-3">Date</th>
            <th className="py-2 pr-3">Lesson</th>
            <th className="py-2 pr-3">Module</th>
            <th className="py-2 text-right">Attendance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {sessions.map((s, i) => {
            const info = s.lesson_id ? lessons.get(s.lesson_id) : undefined;
            const past = new Date(s.starts_at).getTime() < now;
            const taken = takenBySession.has(s.id);
            return (
              <tr key={s.id} className={s.status === "cancelled" ? "text-muted line-through" : ""}>
                <td className="py-2 pr-3 text-muted">{i + 1}</td>
                <td className="whitespace-nowrap py-2 pr-3">{formatDate(s.starts_at, tz)}</td>
                <td className="py-2 pr-3">
                  <Link href={`/admin/${slug}/sessions/${s.id}`} className="font-bold hover:underline">
                    {s.title ?? info?.l.title}
                    {info && info.l.slots > 1 ? ` (${s.part}/${info.l.slots})` : ""}
                  </Link>
                </td>
                <td className="py-2 pr-3 text-muted">{info?.m.title}</td>
                <td className="py-2 text-right">
                  {taken ? (
                    <span className="font-bold">
                      {presentBySession.get(s.id) ?? 0}/{active}
                    </span>
                  ) : past && s.status === "scheduled" ? (
                    <span className="font-bold text-warn">Not taken</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {sessions.length === 0 && <p className="text-muted">No sessions yet. Generate the schedule from Settings.</p>}
    </div>
  );
}
