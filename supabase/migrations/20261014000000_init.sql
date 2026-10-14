-- Teaching platform: courses (reusable templates) -> cohorts (one run of a course) -> sessions/students/grades.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Teachers (admin access)
-- ---------------------------------------------------------------------------
create table public.teachers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.teachers where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Course templates
-- ---------------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

-- grading: weights per component, e.g. {"attendance":20,"quiz":10,"assignment":70}.
-- Component keys are "attendance" or an assessment kind.
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  slug text not null,
  position int not null,
  code text,
  title text not null,
  summary text,
  grading jsonb not null default '{}'::jsonb,
  unique (course_id, slug)
);

-- One lesson = one class session by default (slots > 1 spreads it across several).
-- resources: [{ "type": "slides|video|notebook|dataset|doc|link", "title": "...", "url": "..." }]
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  slug text not null,
  position int not null,
  title text not null,
  summary text,
  body_md text,
  before_next_md text,
  resources jsonb not null default '[]'::jsonb,
  slots int not null default 1 check (slots >= 1),
  unique (module_id, slug)
);

-- Private teacher notes, kept apart so lessons can be publicly readable.
create table public.lesson_notes (
  lesson_id uuid primary key references public.lessons (id) on delete cascade,
  notes_md text not null default ''
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete set null,
  slug text not null,
  position int not null default 0,
  kind text not null check (kind in ('assignment', 'quiz', 'project', 'hackathon')),
  title text not null,
  brief_md text,
  brief_url text,
  max_score numeric not null default 100 check (max_score > 0),
  unique (module_id, slug)
);

-- Quiz questions hold answers, so they are teacher-only; the app strips answers server-side.
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  position int not null,
  prompt text not null,
  options jsonb not null,
  answer_index int not null,
  explanation text,
  unique (assessment_id, position)
);

-- ---------------------------------------------------------------------------
-- Cohorts (a run of a course at an institution)
-- ---------------------------------------------------------------------------
create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete restrict,
  slug text not null unique,
  title text not null,
  institution text,
  -- 0 = Sunday ... 6 = Saturday
  weekdays int[] not null,
  start_time time not null,
  end_time time not null,
  timezone text not null default 'Asia/Kolkata',
  start_date date not null,
  holidays date[] not null default '{}',
  classroom_url text,
  classroom_code text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.cohort_secrets (
  cohort_id uuid primary key references public.cohorts (id) on delete cascade,
  quiz_pin text not null
);

-- Per-cohort settings for an assessment: Classroom link, due date, quiz open/closed.
create table public.cohort_assessments (
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  classroom_url text,
  due_date date,
  is_open boolean not null default false,
  primary key (cohort_id, assessment_id)
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete set null,
  part int not null default 1,
  position int not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  title text,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled'))
);
create index sessions_cohort_starts_idx on public.sessions (cohort_id, starts_at);

-- ---------------------------------------------------------------------------
-- People and results
-- ---------------------------------------------------------------------------
create table public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  created_at timestamptz not null default now()
);

create table public.enrolments (
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  roll_no text not null,
  status text not null default 'active' check (status in ('active', 'dropped')),
  primary key (cohort_id, student_id),
  unique (cohort_id, roll_no)
);

create table public.attendance (
  session_id uuid not null references public.sessions (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  present boolean not null,
  primary key (session_id, student_id)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  answers jsonb not null,
  score numeric not null,
  max_score numeric not null,
  submitted_at timestamptz not null default now(),
  unique (cohort_id, assessment_id, student_id)
);

create table public.scores (
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  score numeric not null check (score >= 0),
  feedback text,
  source text not null default 'manual' check (source in ('manual', 'classroom', 'quiz')),
  updated_at timestamptz not null default now(),
  primary key (cohort_id, assessment_id, student_id)
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.teachers enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_notes enable row level security;
alter table public.assessments enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_secrets enable row level security;
alter table public.cohort_assessments enable row level security;
alter table public.sessions enable row level security;
alter table public.students enable row level security;
alter table public.enrolments enable row level security;
alter table public.attendance enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.scores enable row level security;

-- Teachers can do everything.
do $$
declare t text;
begin
  foreach t in array array[
    'teachers', 'courses', 'modules', 'lessons', 'lesson_notes', 'assessments', 'quiz_questions',
    'cohorts', 'cohort_secrets', 'cohort_assessments', 'sessions', 'students', 'enrolments',
    'attendance', 'quiz_attempts', 'scores'
  ] loop
    execute format(
      'create policy "teachers manage %1$s" on public.%1$I for all to authenticated using (public.is_teacher()) with check (public.is_teacher())',
      t
    );
  end loop;
end $$;

-- Public course content and public cohorts are readable by anyone.
create policy "public read courses" on public.courses for select to anon, authenticated using (true);
create policy "public read modules" on public.modules for select to anon, authenticated using (true);
create policy "public read lessons" on public.lessons for select to anon, authenticated using (true);
create policy "public read assessments" on public.assessments for select to anon, authenticated using (true);
create policy "public read cohorts" on public.cohorts for select to anon, authenticated using (is_public);
create policy "public read cohort assessments" on public.cohort_assessments for select to anon, authenticated
  using (exists (select 1 from public.cohorts c where c.id = cohort_id and c.is_public));
create policy "public read sessions" on public.sessions for select to anon, authenticated
  using (exists (select 1 from public.cohorts c where c.id = cohort_id and c.is_public));
