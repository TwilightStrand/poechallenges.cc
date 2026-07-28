import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateState, github } from "@/lib/auth";

export async function GET() {
	if (!github) {
		return NextResponse.json(
			{ error: "GitHub OAuth not configured" },
			{ status: 503 },
		);
	}

	const state = generateState();
	const url = github.createAuthorizationURL(state, ["user:email"]);

	const cookieStore = await cookies();
	cookieStore.set("github_oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 10, // 10 minutes
	});

	return NextResponse.redirect(url.toString());
}
