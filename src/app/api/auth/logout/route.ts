import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  validateSession,
  invalidateSession,
  hashSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const sessionId = hashSessionToken(token);
    await invalidateSession(sessionId);
    cookieStore.delete(SESSION_COOKIE_NAME);
  }

  return NextResponse.json({ ok: true });
}
