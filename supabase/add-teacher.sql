-- Run in the Supabase SQL editor after creating the teacher's login under
-- Authentication → Users → Add user (email + password). Replace the email below.
insert into public.teachers (user_id, name)
select id, 'Teena' from auth.users where email = 'REPLACE-WITH-TEACHER-EMAIL'
on conflict (user_id) do nothing;
