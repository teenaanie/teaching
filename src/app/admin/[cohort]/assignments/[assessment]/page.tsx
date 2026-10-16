import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCohort } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";
import { zonedToUtc } from "@/lib/schedule";
import { formatBytes, SUBMISSION_BUCKET, type SubmittedFile } from "@/lib/submissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { saveScoreWithFeedback, setAcceptSubmissions } from "../../../actions";

export const instant = false;

type Submission = { student_id: string; link_url: string | null; comment: string | null; files: SubmittedFile[]; updated_at: string };

const field = "rounded-lg border border-line bg-paper px-2 py-1.5";

export default async function AssignmentSubmissions({ params }: PageProps<"/admin/[cohort]/assignments/[assessment]">) {
  const { cohort: slug, assessment: assessmentId } = await params;
  const data = await getAdminCohort(slug);
  const { cohort } = data;
  const mod = data.outline.modules.find((m) => m.assessments.some((a) => a.id === assessmentId));
  const assessment = mod?.assessments.find((a) => a.id === assessmentId);
  if (!assessment) notFound();
  const setting = data.cohortAssessments.find((c) => c.assessment_id === assessmentId);

  const db = createAdminClient();
  const { data: rows } = await db.from("submissions").select("student_id, link_url, comment, files, updated_at").eq("cohort_id", cohort.id).eq("assessment_id", assessmentId);
  const subs = new Map(((rows ?? []) as Submission[]).map((s) => [s.student_id, s]));

  // Download links valid for an hour, named after the original file.
  const paths = [...subs.values()].flatMap((s) => s.files.map((f) => f.path));
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data: urls } = await db.storage.from(SUBMISSION_BUCKET).createSignedUrls(paths, 3600);
    for (const u of urls ?? []) if (u.path && u.signedUrl) signed.set(u.path, u.signedUrl);
  }

  const scores = new Map(data.scores.filter((s) => s.assessment_id === assessmentId).map((s) => [s.student_id, s]));
  const students = data.roster.filter((r) => r.status === "active");
  // Late = after the end of the due day, in the class's timezone.
  const dueEnd = setting?.due_date ? new Date(zonedToUtc(setting.due_date, "23:59:59", cohort.timezone)).getTime() : null;

  return (
    <div className="grid gap-6">
      <Link href={`/admin/${slug}/assignments`} className="text-sm text-muted hover:underline">
        ← Assignments
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">{mod!.title}</p>
          <h1 className="font-display text-3xl font-semibold">{assessment.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {subs.size} of {students.length} submitted · out of {Number(assessment.max_score)} marks
            {setting?.due_date ? ` · due ${formatDate(setting.due_date + "T12:00:00Z", cohort.timezone)}` : ""}
          </p>
        </div>
        <form action={setAcceptSubmissions.bind(null, cohort.id, assessmentId, !setting?.accept_submissions)}>
          <button className={`rounded-full px-4 py-1.5 text-sm font-bold ${setting?.accept_submissions ? "bg-ok text-white dark:text-[#0d1a1d]" : "border border-teal text-teal"}`}>
            {setting?.accept_submissions ? "Accepting on site · stop" : "Accept on site"}
          </button>
        </form>
      </div>

      <ul className="grid gap-3">
        {students.map((st) => {
          const s = subs.get(st.id);
          const sc = scores.get(st.id);
          const late = s && dueEnd !== null && new Date(s.updated_at).getTime() > dueEnd;
          return (
            <li key={st.id} className="grid gap-3 rounded-xl border border-line bg-card p-4 lg:grid-cols-[1fr_1.4fr]">
              <div className="grid content-start gap-2 text-sm">
                <p>
                  <span className="mr-2 font-mono text-xs text-muted">{st.roll_no}</span>
                  <Link href={`/admin/${slug}/students/${st.id}`} className="font-bold hover:underline">{st.full_name}</Link>
                </p>
                {s ? (
                  <>
                    <p className={late ? "font-bold text-warn" : "text-ok"}>
                      Submitted {formatDate(s.updated_at, cohort.timezone, { hour: "numeric", minute: "2-digit" })}
                      {late ? " · late" : ""}
                    </p>
                    {s.link_url && (
                      <a href={s.link_url} target="_blank" rel="noreferrer" className="break-all text-teal underline">
                        {s.link_url}
                      </a>
                    )}
                    {s.files.map((f) =>
                      signed.get(f.path) ? (
                        <a key={f.path} href={signed.get(f.path)} target="_blank" rel="noreferrer" className="break-all text-teal underline">
                          {f.name} <span className="text-muted no-underline">· {formatBytes(f.size)}</span>
                        </a>
                      ) : (
                        <span key={f.path} className="text-muted">{f.name} (file missing)</span>
                      ),
                    )}
                    {s.comment && <p className="rounded-lg bg-paper px-3 py-2 italic">“{s.comment}”</p>}
                  </>
                ) : (
                  <p className="text-muted">Not submitted</p>
                )}
              </div>
              <form action={saveScoreWithFeedback.bind(null, cohort.id, assessmentId, st.id)} className="grid content-start gap-2 text-sm sm:grid-cols-[auto_1fr_auto]">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <input name="score" inputMode="decimal" defaultValue={sc ? String(Number(sc.score)) : ""} aria-label={`Score for ${st.full_name}`} className={`${field} w-20 text-center`} />
                  <span className="text-muted">/ {Number(assessment.max_score)}</span>
                </span>
                <input name="feedback" defaultValue={sc?.feedback ?? ""} placeholder="Feedback the student will see" aria-label={`Feedback for ${st.full_name}`} className={field} />
                <button className="rounded-full border border-teal px-3 py-1 font-bold text-teal">Save</button>
              </form>
            </li>
          );
        })}
      </ul>
      {students.length === 0 && <p className="text-muted">Add students first.</p>}
      <p className="text-xs text-muted">Download links work for one hour. Reload the page for fresh ones.</p>
    </div>
  );
}
