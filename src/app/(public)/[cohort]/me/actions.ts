"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { clearStudentSession, normaliseCode, setStudentSession } from "@/lib/student-session";

export async function studentSignIn(cohortId: string, slug: string, _prev: string | null, form: FormData): Promise<string | null> {
  const roll = String(form.get("rollNo") ?? "").trim();
  const code = normaliseCode(String(form.get("code") ?? ""));
  if (!roll || !code) return "Enter your roll number and your code.";
  const { data } = await createAdminClient()
    .from("enrolments")
    .select("student_id, access_code")
    .eq("cohort_id", cohortId)
    .eq("status", "active")
    .ilike("roll_no", roll.replace(/[%_\\]/g, "\\$&"))
    .maybeSingle();
  if (!data?.access_code || data.access_code !== code) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return "That roll number and code don't match. Check your slip or ask your teacher.";
  }
  await setStudentSession(cohortId, data.student_id);
  redirect(`/${slug}/me`);
}

export async function studentSignOut(slug: string) {
  await clearStudentSession();
  redirect(`/${slug}/me`);
}
