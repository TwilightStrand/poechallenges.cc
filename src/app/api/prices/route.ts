import { type NextRequest, NextResponse } from "next/server";

// poe.ninja restructured its economy API around June 2026; the old
// /api/data/currencyoverview endpoints now 404 for every league. The keys here
// stay as the app's own vocabulary so callers did not have to change.
const NINJA_BASE = "https://poe.ninja/poe1/api/economy/stash/current";
const ENDPOINT_PATHS: Record<string, string> = {
	currencyoverview: "currency/overview",
	itemoverview: "item/overview",
};
const ALLOWED_TYPES = [
	"Currency",
	"Fragment",
	"Essence",
	"Incubator",
	"Scarab",
	"UniqueMap",
	"DivinationCard",
	"Oil",
	"Fossil",
	"Resonator",
	"UniqueAccessory",
	"UniqueArmour",
	"UniqueWeapon",
	"UniqueFlask",
	"UniqueJewel",
];

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const league = searchParams.get("league");
	const endpoint = searchParams.get("endpoint");
	const type = searchParams.get("type");

	if (!league || !endpoint || !type) {
		return NextResponse.json(
			{ error: "Missing league, endpoint, or type parameter" },
			{ status: 400 },
		);
	}

	const endpointPath = ENDPOINT_PATHS[endpoint];

	if (!endpointPath) {
		return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(type)) {
		return NextResponse.json({ error: "Invalid type" }, { status: 400 });
	}

	// The league here is poe.ninja's short name ("Allflame"), not the in-game
	// name and not our internal id; it is case-sensitive, and a wrong case
	// returns 200 with an empty body rather than an error.
	const url = `${NINJA_BASE}/${endpointPath}?league=${encodeURIComponent(league)}&type=${encodeURIComponent(type)}`;

	const res = await fetch(url, {
		next: { revalidate: 300 }, // cache for 5 minutes
	});

	if (!res.ok) {
		return NextResponse.json(
			{ error: "Failed to fetch from poe.ninja" },
			{ status: res.status },
		);
	}

	const data = await res.json();
	return NextResponse.json(data);
}
