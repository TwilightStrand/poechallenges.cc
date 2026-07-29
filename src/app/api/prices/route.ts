import { type NextRequest, NextResponse } from "next/server";

// poe.ninja restructured its economy API around June 2026; the old
// /api/data/currencyoverview endpoints now 404 for every league. The keys here
// stay as the app's own vocabulary so callers did not have to change.
const NINJA_BASE = "https://poe.ninja/poe1/api/economy";
const ENDPOINT_PATHS: Record<string, string> = {
	currencyoverview: "stash/current/currency/overview",
	itemoverview: "stash/current/item/overview",
	// Chase currency (Awakener's Orb, Hinekora's Lock, Orb of Dominance,
	// Exceptional Eldritch Ichor/Ember, Crystallised Rancour) only appears here,
	// not in the stash overviews.
	exchange: "exchange/current/overview",
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

	if (endpoint === "exchange") {
		return NextResponse.json(normalizeExchange(data));
	}

	return NextResponse.json(data);
}

interface ExchangeItem {
	id: string;
	name: string;
	image?: string;
}

interface ExchangeLine {
	id: string;
	primaryValue?: number;
}

interface ExchangePayload {
	lines?: ExchangeLine[];
	items?: ExchangeItem[];
}

// The exchange endpoint keys its rows by id and holds names in a separate
// items array, and prices them in primaryValue rather than chaosEquivalent.
// Reshaping it here means callers only ever deal with one response format.
// primaryValue is chaos-denominated: Chaos Orb is 1, Divine ~135.
function normalizeExchange(data: ExchangePayload) {
	const names = new Map(
		(data.items ?? []).map((item) => [item.id, item] as const),
	);

	const lines = (data.lines ?? []).flatMap((line) => {
		const item = names.get(line.id);
		if (!item || line.primaryValue === undefined) return [];

		return [
			{
				currencyTypeName: item.name,
				chaosEquivalent: line.primaryValue,
				icon: item.image ? `https://poe.ninja${item.image}` : undefined,
			},
		];
	});

	return { lines };
}
