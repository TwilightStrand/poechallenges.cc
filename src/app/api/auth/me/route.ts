import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { validateSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/db";
import { oauthAccounts } from "@/db/schema";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const result = await validateSession(token);
  if (!result) {
    return NextResponse.json({ user: null });
  }

  // Fetch linked providers
  const linked = await db
    .select({ provider: oauthAccounts.provider })
    .from(oauthAccounts)
    .where(eq(oauthAccounts.userId, result.user.id));

  return NextResponse.json({
    user: {
      id: result.user.id,
      displayName: result.user.displayName,
      providers: linked.map((l) => l.provider),
    },
  });
}
