import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";

/**
 * Verifies the caller is a signed-in teacher and returns a service-role client.
 * Every admin page and admin server action must call this first.
 */
export async function requireTeacher() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/admin/login");
  const db = createAdminClient();
  const { data: teacher } = await db.from("teachers").select("user_id, name").eq("user_id", userId).maybeSingle();
  if (!teacher) redirect("/admin/login?error=not-a-teacher");
  return { db, teacher };
}
