# Classroom

A small teaching site for running courses with in-person cohorts. It is built as a framework: courses, classes (cohorts) and students are all data, so a new course or a new batch at another college needs no code changes.

- **Students** get one link per class: a dated schedule, the next class, lesson pages (Drive slides and videos embedded, Colab notebooks, datasets, assignment briefs with a "Submit on Google Classroom" button), and quizzes.
- **Teachers** (`/admin`) get teacher notes for every lesson, one-tap attendance, a gradebook with Google Classroom CSV import and per-module weighted grades, student CSV import, and schedule tools.

Google Classroom stays the place where assignments are submitted and graded. This site links to it.

## How it's organised

| Concept | What it is | Where it lives |
|---|---|---|
| Course | Reusable template: modules → lessons → assessments → quiz questions. Each module has its own grading weights, e.g. `{attendance: 20, quiz: 10, assignment: 70}` | `content/courses/*.ts` → database |
| Cohort | One run of a course: institution, weekdays, class times, holidays, Classroom link, quiz PIN | `content/cohorts/*.ts` or Admin → Settings |
| Session | A dated class. Generated from the cohort's weekdays and holidays, one lesson per slot | Generated; edit in Admin |
| Students | Imported per cohort from CSV (`name, roll_no, email`) | Admin → Students |

Stack: Next.js 16 (App Router) on Vercel, Supabase (Postgres + Auth), Tailwind.

## First-time setup

1. **Database.** Apply the migrations in `supabase/migrations/` (in filename order) to the Supabase project. Either:
   - `npx supabase link --project-ref jtzjhgilmquijtzgwgej` then `npx supabase db push` (asks for the DB password), or
   - paste the SQL file into Supabase → SQL editor → Run.
2. **Keys.** Copy `.env.example` to `.env.local` and fill in the URL, anon key and service-role key (Supabase → Project Settings → API). Add the same three to Vercel → Project → Settings → Environment Variables.
3. **Content.** Load the course and the Azam class. Either paste `supabase/seed-quest-azam.sql` into the SQL editor (no keys needed), or run:
   ```bash
   npm install
   npm run seed -- content/courses/quest-data-analytics.ts content/cohorts/azam-2026.ts
   ```
4. **Teacher login.** In Supabase → Authentication → Users, add a user with your email and a password. Then run `supabase/add-teacher.sql` (with your email filled in) in the SQL editor.
5. **Run.** Start it with `npm run dev`, open <http://localhost:3000/azam-2026> for the student view and `/admin` for the teacher view.

## Everyday use

- **Before class:** open Admin → Sessions → the next class for your teacher notes.
- **In class:** tap absentees on the attendance list and save.
- **Quiz day:** Admin → Settings → tick "Quiz open" for the quiz, write the PIN on the board. Students enter their roll number and the PIN. Close the quiz afterwards.
- **Grades:** Classroom → Grades → ⚙ → Download grades (CSV) → Admin → Gradebook → import. Map columns once and save. You can also type scores directly into the grid.
- **Moving a class / two lessons on one day:** Admin → Sessions → change the date on the row and click away; it saves itself. Add a note on the row to tell students what's happening; it shows on their schedule and lesson page.
- **Announcement:** Settings → Announcement shows a banner at the top of the class page.
- **Holiday or cancelled class:** add the date under Settings → Holidays, then **Rebuild schedule**. Past classes and classes with attendance are kept; everything later shifts.

## Adding a new course or class

1. Copy `content/courses/quest-data-analytics.ts` (or the tiny `content/examples/demo-course.ts`) and edit it.
2. Copy `content/cohorts/azam-2026.ts` for the new batch: change the slug, title, weekdays, times, start date and course slug.
3. Run `npm run seed -- <course file> <cohort file>`.

To regenerate `supabase/seed-quest-azam.sql` after editing content, seed a local database and dump it (see the git history for the command). Seeding is idempotent and matched by slug, so you can re-run it after editing content. Teacher notes edited in the admin are not overwritten unless you pass `--overwrite-notes`. The schedule is generated only the first time; use Rebuild in Settings afterwards.

## Development

```bash
npm test          # schedule, grading and Classroom CSV unit tests
npm run typecheck
npm run lint
```

## Notes

- **Drive files** are embedded with their existing sharing. Quest Center's files are shared with the class's Google Group, so students must be signed into Google with the account in that group to see slides and videos.
- **Privacy:** public pages never show student names. Students, attendance, scores, quiz answers and the PIN are readable only by teachers (Postgres row-level security). Quiz grading runs on the server.
