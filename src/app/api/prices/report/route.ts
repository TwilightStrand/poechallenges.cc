import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/db";
import { reportedPrices } from "@/db/schema";

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

  await db.insert(reportedPrices).values({
    userId: session.user.id,
    leagueId,
    itemName,
    priceChaos: String(priceChaos),
    quantity: quantity ?? 1,
  });

  return NextResponse.json({ ok: true });
}
