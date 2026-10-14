-- Private sign-in code per student, so students can see their own marks and feedback.
-- Kept on the enrolment (teacher-only under RLS) so a code is per class.
alter table public.enrolments add column if not exists access_code text;
create unique index if not exists enrolments_access_code_idx on public.enrolments (cohort_id, access_code) where access_code is not null;
