import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { reportedPrices } from "@/db/schema";
import { SESSION_COOKIE_NAME, validateSession } from "@/lib/auth";
import { checkRateLimit, LIMITS, tooManyRequests } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	if (!token) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const session = await validateSession(token);
	if (!session) {
		return NextResponse.json({ error: "Invalid session" }, { status: 401 });
	}

	const rate = checkRateLimit(`write:${session.session.id}`, LIMITS.write);
	if (!rate.allowed) return tooManyRequests(rate);

	const body = await request.json();
	const { leagueId, itemName, priceChaos, quantity } = body;

	if (!leagueId || !itemName || priceChaos == null) {
		return NextResponse.json(
			{ error: "Missing leagueId, itemName, or priceChaos" },
			{ status: 400 },
		);
	}

	if (typeof priceChaos !== "number" || priceChaos < 0) {
		return NextResponse.json({ error: "Invalid price" }, { status: 400 });
	}

	await getDb()
		.insert(reportedPrices)
		.values({
			userId: session.user.id,
			leagueId,
			itemName,
			priceChaos: String(priceChaos),
			quantity: quantity ?? 1,
		});

	return NextResponse.json({ ok: true });
}
