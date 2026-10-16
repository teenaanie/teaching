import { getAdminCohort } from "@/lib/admin-data";
import { updateCohort, updateCohortAssessment } from "../../actions";
import { RebuildButton } from "./RebuildButton";

export const instant = false;

const field = "rounded-lg border border-line bg-paper px-3 py-2 font-normal";

export default async function SettingsAdmin({ params }: PageProps<"/admin/[cohort]/settings">) {
  const { cohort: slug } = await params;
  const { cohort, outline, cohortAssessments, quizPin } = await getAdminCohort(slug);
  const settings = new Map(cohortAssessments.map((c) => [c.assessment_id, c]));

  return (
    <div className="grid gap-10">
      <section>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <form action={updateCohort.bind(null, cohort.id)} className="mt-4 grid gap-4 rounded-2xl border border-line bg-card p-5 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-bold">
            Class name
            <input name="title" defaultValue={cohort.title} required className={field} />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            Institution
            <input name="institution" defaultValue={cohort.institution ?? ""} className={field} />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            Google Classroom link
            <input name="classroom_url" type="url" defaultValue={cohort.classroom_url ?? ""} className={field} />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            Classroom class code
            <input name="classroom_code" defaultValue={cohort.classroom_code ?? ""} className={field} />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            Quiz PIN (write it on the board on quiz day)
            <input name="quiz_pin" defaultValue={quizPin} className={`${field} font-mono`} />
          </label>
          <label className="grid gap-1 text-sm font-bold sm:col-span-2">
            Announcement for students (shown at the top of the class page; leave empty to hide)
            <textarea name="announcement" defaultValue={cohort.announcement ?? ""} rows={3} className={field} />
          </label>
          <label className="grid gap-1 text-sm font-bold sm:col-span-2">
            Holidays (YYYY-MM-DD, separated by commas or new lines)
            <textarea name="holidays" defaultValue={cohort.holidays.join("\n")} rows={4} className={`${field} font-mono`} />
          </label>
          <button className="justify-self-start rounded-full bg-teal px-5 py-2 text-sm font-bold text-white dark:text-[#0d1a1d]">Save settings</button>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-xl font-semibold">Schedule</h2>
        <p className="mt-1 text-sm text-muted">
          Rebuilding keeps every class that has already happened (or has attendance) and re-plans the rest on your class days,
          skipping holidays. Use it after adding a holiday or a cancelled day.
        </p>
        <RebuildButton cohortId={cohort.id} />
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">Assignments and quizzes</h2>
        <p className="mt-1 text-sm text-muted">
          Open a quiz when you want students to take it. “Accept on site” lets students upload work from My progress. Due dates decide when missing work starts counting as zero and when a submission is marked late.
        </p>
        <div className="mt-4 grid gap-6">
          {outline.modules.map((m) =>
            m.assessments.length === 0 ? null : (
              <div key={m.id}>
                <h3 className="font-bold">{m.title}</h3>
                <ul className="mt-2 grid gap-2">
                  {m.assessments.map((a) => {
                    const s = settings.get(a.id);
                    return (
                      <li key={a.id}>
                        <form
                          action={updateCohortAssessment.bind(null, cohort.id, a.id)}
                          className="grid items-center gap-2 rounded-xl border border-line bg-card px-4 py-3 text-sm md:grid-cols-[1.4fr_1.4fr_auto_auto_auto]"
                        >
                          <span>
                            <span className="text-xs uppercase tracking-widest text-muted">{a.kind}</span>
                            <span className="block font-bold">{a.title}</span>
                          </span>
                          <input name="classroom_url" type="url" placeholder="Classroom assignment link" defaultValue={s?.classroom_url ?? ""} className={field} />
                          <input name="due_date" type="date" defaultValue={s?.due_date ?? ""} className={field} aria-label="Due date" />
                          {a.kind === "quiz" ? (
                            <label className="flex items-center gap-2">
                              <input type="checkbox" name="is_open" defaultChecked={s?.is_open ?? false} /> Quiz open
                            </label>
                          ) : (
                            <label className="flex items-center gap-2">
                              <input type="checkbox" name="accept_submissions" defaultChecked={s?.accept_submissions ?? false} /> Accept on site
                            </label>
                          )}
                          <button className="rounded-full border border-teal px-3 py-1 font-bold text-teal">Save</button>
                        </form>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
