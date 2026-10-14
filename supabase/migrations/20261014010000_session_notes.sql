-- Student-facing notes: one per class session, plus a class-wide announcement.
alter table public.sessions add column if not exists note text;
alter table public.cohorts add column if not exists announcement text;
