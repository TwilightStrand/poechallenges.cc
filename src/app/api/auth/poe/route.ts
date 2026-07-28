import { CodeChallengeMethod } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateCodeVerifier, generateState, poe } from "@/lib/auth";

export async function GET() {
	if (!poe) {
		return NextResponse.json(
			{ error: "PoE OAuth not configured. Waiting for GGG approval." },
			{ status: 503 },
		);
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = poe.createAuthorizationURLWithPKCE(
		"https://www.pathofexile.com/oauth/authorize",
		state,
		CodeChallengeMethod.S256,
		codeVerifier,
		["account:profile"],
	);

	const cookieStore = await cookies();
	cookieStore.set("poe_oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 10,
	});
	cookieStore.set("poe_code_verifier", codeVerifier, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 10,
	});

	return NextResponse.redirect(url.toString());
}
