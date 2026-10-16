import "server-only";
import { getStudentSession } from "./student-session";
import { createAdminClient } from "./supabase/admin";

/** The signed-in, active student for this class, or null. */
export async function getSignedInStudent(cohortId: string) {
  const studentId = await getStudentSession(cohortId);
  if (!studentId) return null;
  const { data } = await createAdminClient()
    .from("enrolments")
    .select("roll_no, status, students(full_name)")
    .eq("cohort_id", cohortId)
    .eq("student_id", studentId)
    .maybeSingle();
  if (!data || data.status !== "active") return null;
  return { id: studentId, rollNo: data.roll_no as string, name: (data.students as unknown as { full_name: string }).full_name };
}
