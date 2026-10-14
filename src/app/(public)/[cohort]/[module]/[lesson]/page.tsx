import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ResourceEmbeds, ResourceList } from "@/components/ResourceList";
import { findLesson, getCohortView } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const instant = false;

type Props = PageProps<"/[cohort]/[module]/[lesson]">;

export async function generateMetadata({ params }: Props) {
  const p = await params;
  const view = await getCohortView(p.cohort);
  return { title: view && findLesson(view, p.module, p.lesson)?.lesson.title };
}

const kindLabel = { assignment: "Assignment", quiz: "Quiz", project: "Project", hackathon: "Hackathon" };

export default async function LessonPage({ params }: Props) {
  const p = await params;
  const view = await getCohortView(p.cohort);
  if (!view) notFound();
  const found = findLesson(view, p.module, p.lesson);
  if (!found) notFound();
  const { module: mod, lesson } = found;
  const { cohort } = view;

  const dates = view.sessions.filter((s) => s.lesson_id === lesson.id && s.status === "scheduled");
  const assessments = mod.assessments.filter((a) => a.lesson_id === lesson.id);
  const settings = new Map(view.cohortAssessments.map((ca) => [ca.assessment_id, ca]));

  const flat = view.modules.flatMap((m) => m.lessons.map((l) => ({ m, l })));
  const idx = flat.findIndex((x) => x.l.id === lesson.id);
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const href = (x: (typeof flat)[number]) => `/${cohort.slug}/${x.m.slug}/${x.l.slug}`;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <nav className="text-sm text-muted">
        <Link href={`/${cohort.slug}`} className="hover:underline">
          Schedule
        </Link>{" "}
        / {mod.title}
      </nav>
      <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">{lesson.title}</h1>
      {dates.length > 0 && (
        <p className="mt-2 text-sm font-bold text-accent">
          {dates.map((d) => formatDate(d.starts_at, cohort.timezone)).join(" · ")}
        </p>
      )}
      {lesson.summary && <p className="mt-4 text-lg text-muted">{lesson.summary}</p>}

      <div className="mt-8 grid gap-8">
        <ResourceEmbeds resources={lesson.resources} />
        <Markdown>{lesson.body_md}</Markdown>

        {lesson.resources.length > 0 && (
          <section>
            <h2 className="mb-3 font-display text-xl font-semibold">Materials</h2>
            <ResourceList resources={lesson.resources} />
          </section>
        )}

        {assessments.map((a) => {
          const s = settings.get(a.id);
          return (
            <section key={a.id} className="rounded-2xl border-2 border-teal/40 bg-teal-soft p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-teal">{kindLabel[a.kind]}</p>
              <h2 className="mt-1 font-display text-2xl font-semibold">{a.title}</h2>
              {s?.due_date && <p className="mt-1 text-sm font-bold">Due {formatDate(s.due_date + "T12:00:00Z", cohort.timezone)}</p>}
              <Markdown className="mt-3">{a.brief_md}</Markdown>
              <div className="mt-4 flex flex-wrap gap-2">
                {a.kind === "quiz" && s?.is_open && (
                  <Link href={`/${cohort.slug}/quiz/${a.id}`} className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-[#1b1208]">
                    Take the quiz →
                  </Link>
                )}
                {a.brief_url && (
                  <a href={a.brief_url} target="_blank" rel="noreferrer" className="rounded-full border border-teal px-4 py-2 text-sm font-bold text-teal">
                    Full brief ↗
                  </a>
                )}
                {a.kind !== "quiz" && (s?.classroom_url ?? cohort.classroom_url) && (
                  <a
                    href={(s?.classroom_url ?? cohort.classroom_url)!}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-teal px-4 py-2 text-sm font-bold text-white dark:text-[#0d1a1d]"
                  >
                    Submit on Google Classroom ↗
                  </a>
                )}
              </div>
            </section>
          );
        })}

        {lesson.before_next_md && (
          <section className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-display text-xl font-semibold">Before next class</h2>
            <Markdown className="mt-2">{lesson.before_next_md}</Markdown>
          </section>
        )}
      </div>

      <nav className="mt-12 grid grid-cols-2 gap-3 border-t border-line pt-6 text-sm">
        <div>
          {prev && (
            <Link href={href(prev)} className="block hover:underline">
              <span className="text-muted">← Previous</span>
              <span className="block font-bold">{prev.l.title}</span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next && (
            <Link href={href(next)} className="block hover:underline">
              <span className="text-muted">Next →</span>
              <span className="block font-bold">{next.l.title}</span>
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
