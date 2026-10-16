-- Assignment submissions (files and/or a link) and feedback forms.
-- Students never touch these tables directly: the app checks their sign-in and writes
-- with the service role, so every table here is teacher-only under RLS.

-- ---------------------------------------------------------------------------
-- Submissions
-- ---------------------------------------------------------------------------
alter table public.cohort_assessments
  add column if not exists accept_submissions boolean not null default false;

-- One submission per student per assessment; resubmitting replaces it.
-- files: [{ "path": "<storage path>", "name": "report.pdf", "size": 12345, "type": "application/pdf" }]
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  link_url text,
  comment text,
  files jsonb not null default '[]'::jsonb,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, assessment_id, student_id)
);

alter table public.submissions enable row level security;
drop policy if exists "teachers manage submissions" on public.submissions;
create policy "teachers manage submissions" on public.submissions
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

-- Private bucket for uploaded files (25 MB each). Downloads use short-lived signed links.
insert into storage.buckets (id, name, public, file_size_limit)
values ('submissions', 'submissions', false, 26214400)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Feedback forms
-- ---------------------------------------------------------------------------
-- questions: [{ "id": "q1", "type": "rating" | "choice" | "text", "prompt": "...", "options": ["..."], "required": true }]
create table if not exists public.feedback_forms (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  session_id uuid references public.sessions (id) on delete set null,
  title text not null,
  description text,
  questions jsonb not null default '[]'::jsonb,
  anonymous boolean not null default true,
  is_open boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- respondent_key is a keyed hash of form + student, so each student answers once.
-- For anonymous forms student_id stays empty and answers aren't linked to a name.
create table if not exists public.feedback_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.feedback_forms (id) on delete cascade,
  respondent_key text not null,
  student_id uuid references public.students (id) on delete set null,
  answers jsonb not null,
  submitted_at timestamptz not null default now(),
  unique (form_id, respondent_key)
);

alter table public.feedback_forms enable row level security;
alter table public.feedback_responses enable row level security;
drop policy if exists "teachers manage feedback forms" on public.feedback_forms;
create policy "teachers manage feedback forms" on public.feedback_forms
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
drop policy if exists "teachers manage feedback responses" on public.feedback_responses;
create policy "teachers manage feedback responses" on public.feedback_responses
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());
