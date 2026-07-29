import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import {
	createSession,
	findOrCreateUser,
	linkOAuthAccount,
	poe,
	SESSION_COOKIE_NAME,
	sessionCookieOptions,
	validateSession,
} from "@/lib/auth";
import { poeUserAgent } from "@/lib/poe-api";
import { redirectTo } from "@/lib/redirect";

export async function GET(request: NextRequest) {
	if (!poe) {
		return NextResponse.json(
			{ error: "PoE OAuth not configured" },
			{ status: 503 },
		);
	}

	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const cookieStore = await cookies();
	const storedState = cookieStore.get("poe_oauth_state")?.value;
	const codeVerifier = cookieStore.get("poe_code_verifier")?.value;

	if (!code || !state || state !== storedState || !codeVerifier) {
		return redirectTo("/?error=auth_failed");
	}

	try {
		const tokens = await poe.validateAuthorizationCode(
			"https://www.pathofexile.com/oauth/token",
			code,
			codeVerifier,
		);
		const accessToken = tokens.accessToken();

		// Fetch PoE profile
		const profile = await fetch("https://api.pathofexile.com/profile", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"User-Agent": poeUserAgent(),
			},
		}).then((r) => r.json());

		const poeAccountName = profile.name ?? "Unknown";

		// Check if user is already logged in (linking account)
		const existingToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
		if (existingToken) {
			const existingSession = await validateSession(existingToken);
			if (existingSession) {
				// Link PoE account to existing user
				await linkOAuthAccount(
					existingSession.user.id,
					"pathofexile",
					poeAccountName,
				);
				cookieStore.delete("poe_oauth_state");
				cookieStore.delete("poe_code_verifier");
				return redirectTo("/?linked=poe");
			}
		}

		// New login with PoE
		const user = await findOrCreateUser(
			"pathofexile",
			poeAccountName,
			poeAccountName,
		);
		const session = await createSession(user.id);

		cookieStore.delete("poe_oauth_state");
		cookieStore.delete("poe_code_verifier");
		cookieStore.set(
			SESSION_COOKIE_NAME,
			session.token,
			sessionCookieOptions(session.expiresAt),
		);

		return redirectTo("/");
	} catch {
		return redirectTo("/?error=auth_failed");
	}
}
