import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import {
	createSession,
	findOrCreateUser,
	github,
	SESSION_COOKIE_NAME,
	sessionCookieOptions,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
	if (!github) {
		return NextResponse.json(
			{ error: "GitHub OAuth not configured" },
			{ status: 503 },
		);
	}

	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const cookieStore = await cookies();
	const storedState = cookieStore.get("github_oauth_state")?.value;

	if (!code || !state || state !== storedState) {
		return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const accessToken = tokens.accessToken();

		// Fetch GitHub user profile
		const githubUser = await fetch("https://api.github.com/user", {
			headers: { Authorization: `Bearer ${accessToken}` },
		}).then((r) => r.json());

		const user = await findOrCreateUser(
			"github",
			String(githubUser.id),
			githubUser.login ?? githubUser.name ?? "Unknown",
		);

		const session = await createSession(user.id);

		cookieStore.delete("github_oauth_state");
		cookieStore.set(
			SESSION_COOKIE_NAME,
			session.token,
			sessionCookieOptions(session.expiresAt),
		);

		return NextResponse.redirect(new URL("/", request.url));
	} catch {
		return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
	}
}
