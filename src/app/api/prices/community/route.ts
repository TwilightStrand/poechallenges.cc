import { and, eq, gte, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reportedPrices } from "@/db/schema";

export async function GET(request: NextRequest) {
	const league = request.nextUrl.searchParams.get("league");
	const item = request.nextUrl.searchParams.get("item");

	if (!league || !item) {
		return NextResponse.json(
			{ error: "Missing league or item param" },
			{ status: 400 },
		);
	}

	const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

	// Get all reports from last 7 days for this item
	const reports = await db
		.select({
			priceChaos: reportedPrices.priceChaos,
			quantity: reportedPrices.quantity,
			reportedAt: reportedPrices.reportedAt,
		})
		.from(reportedPrices)
		.where(
			and(
				eq(reportedPrices.leagueId, league),
				eq(reportedPrices.itemName, item),
				gte(reportedPrices.reportedAt, sevenDaysAgo),
			),
		)
		.orderBy(reportedPrices.reportedAt);

	if (reports.length < 5) {
		return NextResponse.json({
			price: null,
			reportCount: reports.length,
			message: "Not enough reports (need 5+)",
		});
	}

	// Calculate median price per unit
	const prices = reports
		.map((r) => Number(r.priceChaos) / (r.quantity || 1))
		.sort((a, b) => a - b);

	const mid = Math.floor(prices.length / 2);
	const median =
		prices.length % 2 !== 0
			? prices[mid]!
			: (prices[mid - 1]! + prices[mid]!) / 2;

	return NextResponse.json({
		price: Math.round(median * 100) / 100,
		reportCount: reports.length,
		oldest: reports[0]?.reportedAt,
		newest: reports[reports.length - 1]?.reportedAt,
	});
}
