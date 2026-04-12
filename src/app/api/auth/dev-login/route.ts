import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  findOrCreateUser,
  createSession,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const url = new URL(request.url);
  const account = url.searchParams.get("account") ?? "DevUser#1234";

  const user = await findOrCreateUser("dev", account, account);
  const session = await createSession(user.id);

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    session.token,
    sessionCookieOptions(session.expiresAt),
  );

  return NextResponse.redirect(new URL("/", request.url));
}
