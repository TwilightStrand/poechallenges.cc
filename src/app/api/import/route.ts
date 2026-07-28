import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { progressSnapshots, userProgress } from "@/db/schema";
import { SESSION_COOKIE_NAME, validateSession } from "@/lib/auth";

function corsHeaders(origin: string | null) {
	// Allow requests from PoE website + our own domain
	const allowed =
		origin &&
		(origin.includes("pathofexile.com") || origin.includes("localhost:3000"));

	return {
		"Access-Control-Allow-Origin": allowed ? origin : "",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Allow-Credentials": "true",
	};
}

export async function OPTIONS(request: NextRequest) {
	const origin = request.headers.get("origin");
	return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
	const origin = request.headers.get("origin");
	const headers = corsHeaders(origin);

	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (!token) {
		return NextResponse.json(
			{ error: "Not logged in. Sign in at the tracker first." },
			{ status: 401, headers },
		);
	}

	const session = await validateSession(token);
	if (!session) {
		return NextResponse.json(
			{ error: "Session expired. Sign in again." },
			{ status: 401, headers },
		);
	}

	const body = await request.json();
	const { leagueId, challenges, accountName } = body;

	if (!leagueId || !challenges) {
		return NextResponse.json(
			{ error: "Invalid data" },
			{ status: 400, headers },
		);
	}

	const progressData = {
		leagueId,
		accountName: accountName ?? session.user.displayName,
		challenges,
		lastSynced: new Date().toISOString(),
	};

	await db
		.insert(userProgress)
		.values({
			userId: session.user.id,
			leagueId,
			challengeData: progressData,
			lastSynced: new Date(),
		})
		.onConflictDoUpdate({
			target: [userProgress.userId, userProgress.leagueId],
			set: {
				challengeData: progressData,
				lastSynced: new Date(),
			},
		});

	// Append-only snapshot for future history/graph features
	const completedCount = challenges.filter(
		(c: { isComplete?: boolean }) => c.isComplete,
	).length;

	await db.insert(progressSnapshots).values({
		userId: session.user.id,
		leagueId,
		challengeData: progressData,
		completedCount,
		source: "import",
	});

	return NextResponse.json(
		{ ok: true, imported: challenges.length, user: session.user.displayName },
		{ headers },
	);
}
