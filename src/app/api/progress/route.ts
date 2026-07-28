import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { progressSnapshots, userProgress } from "@/db/schema";
import { SESSION_COOKIE_NAME, validateSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	if (!token) {
		return NextResponse.json({ progress: null });
	}

	const session = await validateSession(token);
	if (!session) {
		return NextResponse.json({ progress: null });
	}

	const league = request.nextUrl.searchParams.get("league");
	if (!league) {
		return NextResponse.json(
			{ error: "Missing league param" },
			{ status: 400 },
		);
	}

	const result = await getDb()
		.select()
		.from(userProgress)
		.where(
			and(
				eq(userProgress.userId, session.user.id),
				eq(userProgress.leagueId, league),
			),
		)
		.limit(1);

	return NextResponse.json({
		progress: result[0]?.challengeData ?? null,
	});
}

export async function PUT(request: NextRequest) {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	if (!token) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const session = await validateSession(token);
	if (!session) {
		return NextResponse.json({ error: "Invalid session" }, { status: 401 });
	}

	const body = await request.json();
	const { leagueId, challengeData } = body;

	if (!leagueId || !challengeData) {
		return NextResponse.json(
			{ error: "Missing leagueId or challengeData" },
			{ status: 400 },
		);
	}

	await getDb()
		.insert(userProgress)
		.values({
			userId: session.user.id,
			leagueId,
			challengeData,
			lastSynced: new Date(),
		})
		.onConflictDoUpdate({
			target: [userProgress.userId, userProgress.leagueId],
			set: {
				challengeData,
				lastSynced: new Date(),
			},
		});

	// Append-only snapshot for future history/graph features
	const challenges = Array.isArray(challengeData?.challenges)
		? challengeData.challenges
		: [];
	const completedCount = challenges.filter(
		(c: { isComplete?: boolean }) => c.isComplete,
	).length;

	await getDb().insert(progressSnapshots).values({
		userId: session.user.id,
		leagueId,
		challengeData,
		completedCount,
		source: "manual",
	});

	return NextResponse.json({ ok: true });
}
