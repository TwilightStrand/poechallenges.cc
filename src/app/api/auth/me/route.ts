import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { oauthAccounts } from "@/db/schema";
import { SESSION_COOKIE_NAME, validateSession } from "@/lib/auth";

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
	const linked = await getDb()
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
