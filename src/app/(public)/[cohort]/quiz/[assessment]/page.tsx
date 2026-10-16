import Link from "next/link";
import { notFound } from "next/navigation";
import { getCohortView } from "@/lib/data";
import { getSignedInStudent } from "@/lib/student-data";
import { createAdminClient } from "@/lib/supabase/admin";
import { QuizForm } from "./QuizForm";

export const instant = false;

type Props = PageProps<"/[cohort]/quiz/[assessment]">;

export async function generateMetadata({ params }: Props) {
  const p = await params;
  const view = await getCohortView(p.cohort);
  return { title: view?.modules.flatMap((m) => m.assessments).find((a) => a.id === p.assessment)?.title };
}

export default async function QuizPage({ params }: Props) {
  const p = await params;
  const view = await getCohortView(p.cohort);
  if (!view) notFound();
  const assessment = view.modules.flatMap((m) => m.assessments).find((a) => a.id === p.assessment && a.kind === "quiz");
  if (!assessment) notFound();
  const setting = view.cohortAssessments.find((ca) => ca.assessment_id === assessment.id);

  // Questions are teacher-only in the database; read them server-side and drop the answers.
  const { data } = await createAdminClient()
    .from("quiz_questions")
    .select("id, prompt, options")
    .eq("assessment_id", assessment.id)
    .order("position");
  const questions = (data ?? []) as { id: string; prompt: string; options: string[] }[];
  const me = await getSignedInStudent(view.cohort.id);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href={`/${view.cohort.slug}`} className="text-sm text-muted hover:underline">
        ← Schedule
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold">{assessment.title}</h1>
      <p className="mt-1 text-muted">{questions.length} questions · one attempt</p>
      <div className="mt-6">
        {setting?.is_open ? (
          <QuizForm cohortId={view.cohort.id} assessmentId={assessment.id} questions={questions} signedInAs={me ? `${me.name} (${me.rollNo})` : undefined} />
        ) : (
          <p className="rounded-xl border border-line bg-card p-5">This quiz isn&apos;t open right now.</p>
        )}
      </div>
    </main>
  );
}
