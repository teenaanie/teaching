/**
 * Loads course and cohort content files into Supabase.
 *
 *   npm run seed -- content/courses/quest-data-analytics.ts content/cohorts/azam-2026.ts
 *   npm run seed -- --overwrite-notes content/courses/quest-data-analytics.ts
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (read from .env.local).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { regenerateSchedule } from "../src/lib/cohort-ops";
import type { CohortSeed, CourseSeed, SeedFile } from "../content/types";

process.loadEnvFile?.(".env.local");

function check<T>(res: { data: T; error: { message: string } | null }, what: string): NonNullable<T> {
  if (res.error) throw new Error(`${what}: ${res.error.message}`);
  return res.data as NonNullable<T>;
}

async function seedCourse(db: SupabaseClient, c: CourseSeed, overwriteNotes: boolean) {
  const course = check(
    await db.from("courses").upsert({ slug: c.slug, title: c.title, description: c.description ?? null }, { onConflict: "slug" }).select("id").single(),
    "course",
  );
  const lessonIds = new Map<string, string>();
  let lessonCount = 0;
  let questionCount = 0;

  for (const [mi, m] of c.modules.entries()) {
    const mod = check(
      await db
        .from("modules")
        .upsert(
          { course_id: course.id, slug: m.slug, position: mi + 1, code: m.code ?? null, title: m.title, summary: m.summary ?? null, grading: m.grading },
          { onConflict: "course_id,slug" },
        )
        .select("id")
        .single(),
      `module ${m.slug}`,
    );

    for (const [li, l] of m.lessons.entries()) {
      const lesson = check(
        await db
          .from("lessons")
          .upsert(
            {
              module_id: mod.id,
              slug: l.slug,
              position: li + 1,
              title: l.title,
              summary: l.summary ?? null,
              body_md: l.bodyMd ?? null,
              before_next_md: l.beforeNextMd ?? null,
              resources: l.resources ?? [],
              slots: l.slots ?? 1,
            },
            { onConflict: "module_id,slug" },
          )
          .select("id")
          .single(),
        `lesson ${l.slug}`,
      );
      lessonIds.set(l.slug, lesson.id);
      lessonCount++;
      if (l.notesMd) {
        check(
          await db
            .from("lesson_notes")
            .upsert({ lesson_id: lesson.id, notes_md: l.notesMd }, { onConflict: "lesson_id", ignoreDuplicates: !overwriteNotes }),
          `notes ${l.slug}`,
        );
      }
    }
  }

  // Assessments after all lessons exist, since they may point at a lesson in another module.
  for (const m of c.modules) {
    const { data: mod } = await db.from("modules").select("id").eq("course_id", course.id).eq("slug", m.slug).single();
    for (const [ai, a] of (m.assessments ?? []).entries()) {
      if (a.lesson && !lessonIds.has(a.lesson)) throw new Error(`assessment ${a.slug}: unknown lesson ${a.lesson}`);
      const row = check(
        await db
          .from("assessments")
          .upsert(
            {
              module_id: mod!.id,
              slug: a.slug,
              position: ai + 1,
              kind: a.kind,
              title: a.title,
              brief_md: a.briefMd ?? null,
              brief_url: a.briefUrl ?? null,
              max_score: a.maxScore,
              lesson_id: a.lesson ? lessonIds.get(a.lesson) : null,
            },
            { onConflict: "module_id,slug" },
          )
          .select("id")
          .single(),
        `assessment ${a.slug}`,
      );
      if (a.questions) {
        for (const q of a.questions) {
          if (q.answer < 0 || q.answer >= q.options.length) throw new Error(`${a.slug}: answer out of range for "${q.prompt}"`);
        }
        check(
          await db.from("quiz_questions").upsert(
            a.questions.map((q, qi) => ({
              assessment_id: row.id,
              position: qi + 1,
              prompt: q.prompt,
              options: q.options,
              answer_index: q.answer,
              explanation: q.explanation ?? null,
            })),
            { onConflict: "assessment_id,position" },
          ),
          `questions ${a.slug}`,
        );
        // Drop questions beyond the current list (if the quiz got shorter).
        await db.from("quiz_questions").delete().eq("assessment_id", row.id).gt("position", a.questions.length);
        questionCount += a.questions.length;
      }
    }
  }
  console.log(`✓ course ${c.slug}: ${c.modules.length} modules, ${lessonCount} lessons, ${questionCount} quiz questions`);
}

async function seedCohort(db: SupabaseClient, c: CohortSeed) {
  const course = check(await db.from("courses").select("id").eq("slug", c.course).single(), `course ${c.course} (seed it first)`);
  const cohort = check(
    await db
      .from("cohorts")
      .upsert(
        {
          course_id: course.id,
          slug: c.slug,
          title: c.title,
          institution: c.institution ?? null,
          weekdays: c.weekdays,
          start_time: c.startTime,
          end_time: c.endTime,
          timezone: c.timezone,
          start_date: c.startDate,
          holidays: c.holidays ?? [],
          classroom_url: c.classroomUrl ?? null,
          classroom_code: c.classroomCode ?? null,
          is_public: c.isPublic ?? true,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single(),
    "cohort",
  );
  // Keep a PIN the teacher has rotated in the admin.
  check(await db.from("cohort_secrets").upsert({ cohort_id: cohort.id, quiz_pin: c.quizPin }, { onConflict: "cohort_id", ignoreDuplicates: true }), "pin");

  // Make sure every assessment has a per-cohort settings row (without overwriting admin edits).
  const { data: assessments } = await db.from("assessments").select("id, modules!inner(course_id)").eq("modules.course_id", course.id);
  if (assessments?.length) {
    check(
      await db
        .from("cohort_assessments")
        .upsert(assessments.map((a) => ({ cohort_id: cohort.id, assessment_id: a.id })), { onConflict: "cohort_id,assessment_id", ignoreDuplicates: true }),
      "cohort assessments",
    );
  }

  for (const s of c.students ?? []) {
    const { data: existing } = await db.from("enrolments").select("student_id").eq("cohort_id", cohort.id).eq("roll_no", s.rollNo).maybeSingle();
    if (existing) {
      await db.from("students").update({ full_name: s.name, email: s.email ?? null }).eq("id", existing.student_id);
    } else {
      const st = check(await db.from("students").insert({ full_name: s.name, email: s.email ?? null }).select("id").single(), "student");
      check(await db.from("enrolments").insert({ cohort_id: cohort.id, student_id: st.id, roll_no: s.rollNo }), "enrolment");
    }
  }

  const { count } = await db.from("sessions").select("id", { count: "exact", head: true }).eq("cohort_id", cohort.id);
  let schedule = "kept existing schedule";
  if (!count) {
    // First run: plan the whole course from the start date.
    const r = await regenerateSchedule(db, cohort.id, new Date(`${c.startDate}T00:00:00Z`));
    schedule = `planned ${r.planned} sessions`;
  }
  console.log(`✓ cohort ${c.slug}: ${c.students?.length ?? 0} students in seed, ${schedule}`);
}

async function main() {
  const args = process.argv.slice(2);
  const overwriteNotes = args.includes("--overwrite-notes");
  const files = args.filter((a) => !a.startsWith("--"));
  if (files.length === 0) throw new Error("Usage: npm run seed -- [--overwrite-notes] <content file>...");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  const db = createClient(url, key, { auth: { persistSession: false } });

  for (const file of files) {
    const mod = (await import(pathToFileURL(path.resolve(file)).href)) as { default: SeedFile };
    const seed = mod.default;
    if (seed.type === "course") await seedCourse(db, seed, overwriteNotes);
    else await seedCohort(db, seed);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
