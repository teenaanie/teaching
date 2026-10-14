import Link from "next/link";
import { getCohortView, lessonIndex } from "@/lib/data";
import { formatClock, formatDate, formatTime, nowMs } from "@/lib/format";
import type { Session } from "@/lib/types";

export const instant = false;

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function generateMetadata({ params }: PageProps<"/[cohort]">) {
  const view = await getCohortView((await params).cohort);
  return { title: view?.cohort.title };
}

export default async function CohortHub({ params }: PageProps<"/[cohort]">) {
  const view = (await getCohortView((await params).cohort))!;
  const { cohort, sessions } = view;
  const tz = cohort.timezone;
  const lessons = lessonIndex(view);
  const now = nowMs();
  const active = sessions.filter((s) => s.status === "scheduled");
  const next = active.find((s) => new Date(s.ends_at).getTime() > now);
  const nextInfo = next?.lesson_id ? lessons.get(next.lesson_id) : undefined;
  const openQuizzes = view.cohortAssessments.filter((ca) => ca.is_open);
  const assessmentsById = new Map(view.modules.flatMap((m) => m.assessments.map((a) => [a.id, { a, m }] as const)));
  const timeRange = `${formatClock(cohort.start_time)} – ${formatClock(cohort.end_time)}`;

  const lessonHref = (s: Session) => {
    const info = s.lesson_id ? lessons.get(s.lesson_id) : undefined;
    return info ? `/${cohort.slug}/${info.module.slug}/${info.lesson.slug}` : null;
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-ink p-6 text-paper">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{next ? "Next class" : "Course complete"}</p>
          {next ? (
            <>
              <h1 className="mt-2 font-display text-3xl font-semibold leading-tight">
                {next.title ?? nextInfo?.lesson.title ?? "Class"}
              </h1>
              <p className="mt-2 opacity-80">
                {formatDate(next.starts_at, tz, { weekday: "long", month: "long" })} · {formatTime(next.starts_at, tz)}–
                {formatTime(next.ends_at, tz)}
              </p>
              {nextInfo?.lesson.summary && <p className="mt-3 max-w-prose opacity-90">{nextInfo.lesson.summary}</p>}
              {lessonHref(next) && (
                <Link
                  href={lessonHref(next)!}
                  className="mt-5 inline-block rounded-full bg-accent px-5 py-2 font-bold text-[#1b1208]"
                >
                  Open lesson →
                </Link>
              )}
            </>
          ) : (
            <h1 className="mt-2 font-display text-3xl font-semibold">Well done, everyone.</h1>
          )}
        </div>
        <div className="grid gap-4">
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Class times</p>
            <p className="mt-1 text-lg font-bold">
              {cohort.weekdays.map((d) => dayNames[d]).join(" & ")} · {timeRange}
            </p>
            {cohort.classroom_code && (
              <p className="mt-2 text-sm text-muted">
                Classroom code: <span className="font-mono font-bold text-ink">{cohort.classroom_code}</span>
              </p>
            )}
          </div>
          {openQuizzes.length > 0 && (
            <div className="rounded-2xl border-2 border-accent bg-accent-soft p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Open quizzes</p>
              <ul className="mt-2 grid gap-1">
                {openQuizzes.map((ca) => {
                  const item = assessmentsById.get(ca.assessment_id);
                  if (!item || item.a.kind !== "quiz") return null;
                  return (
                    <li key={ca.assessment_id}>
                      <Link href={`/${cohort.slug}/quiz/${ca.assessment_id}`} className="font-bold text-ink underline">
                        {item.a.title} →
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Schedule</h2>
        <div className="mt-4 grid gap-8">
          {view.modules.map((mod) => {
            const modSessions = sessions.filter((s) => s.lesson_id && lessons.get(s.lesson_id)?.module.id === mod.id);
            if (modSessions.length === 0) return null;
            return (
              <div key={mod.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
                  <h3 className="font-display text-xl font-semibold">{mod.title}</h3>
                  <span className="text-sm text-muted">
                    {formatDate(modSessions[0].starts_at, tz)} – {formatDate(modSessions.at(-1)!.starts_at, tz)}
                  </span>
                </div>
                <ol className="divide-y divide-line">
                  {modSessions.map((s) => {
                    const info = lessons.get(s.lesson_id!)!;
                    const past = new Date(s.ends_at).getTime() < now;
                    const isNext = s.id === next?.id;
                    const cancelled = s.status === "cancelled";
                    return (
                      <li key={s.id} className={`flex items-center gap-4 py-3 ${past || cancelled ? "opacity-60" : ""}`}>
                        <span className={`w-24 shrink-0 text-sm ${isNext ? "font-bold text-accent" : "text-muted"}`}>
                          {formatDate(s.starts_at, tz)}
                        </span>
                        <Link href={lessonHref(s)!} className={`min-w-0 flex-1 hover:underline ${cancelled ? "line-through" : ""}`}>
                          <span className="font-bold">{s.title ?? info.lesson.title}</span>
                          {info.lesson.slots > 1 && (
                            <span className="text-muted"> · part {s.part} of {info.lesson.slots}</span>
                          )}
                        </Link>
                        {isNext && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent">Next</span>}
                        {cancelled && <span className="text-xs text-warn">Cancelled</span>}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
          {sessions.length === 0 && <p className="text-muted">The schedule will appear here soon.</p>}
        </div>
      </section>
    </main>
  );
}
