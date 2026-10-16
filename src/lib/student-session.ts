import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Students sign in with roll number + a private code. The session is a signed cookie
 * scoped to one class; no Supabase account is needed. Signed with a key derived from
 * the service-role key, so no extra secret has to be configured.
 */
const COOKIE = "student_session";
const MAX_AGE = 60 * 60 * 24 * 120; // one term

function key() {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update("student-session-v1").digest();
}

function sign(payload: string) {
  return createHmac("sha256", key()).update(payload).digest("base64url");
}

// No look-alike characters (0/O, 1/I/L), so codes are easy to read off a slip.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function newAccessCode() {
  return Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
}

export function normaliseCode(code: string) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function setStudentSession(cohortId: string, studentId: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${cohortId}.${studentId}.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearStudentSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in student's id for this class, or null. */
export async function getStudentSession(cohortId: string): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 4) return null;
  const [cid, sid, exp, sig] = parts;
  const expected = Buffer.from(sign(`${cid}.${sid}.${exp}`));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (Number(exp) < Date.now() / 1000 || cid !== cohortId) return null;
  return sid;
}

/** Stable per-form key for a student, so they can answer once without the answer naming them. */
export function respondentKey(formId: string, studentId: string) {
  return createHmac("sha256", key()).update(`feedback:${formId}:${studentId}`).digest("base64url");
}
