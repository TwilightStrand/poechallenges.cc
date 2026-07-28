import { type NextRequest, NextResponse } from "next/server";

const NINJA_BASE = "https://poe.ninja/api/data";
const ALLOWED_ENDPOINTS = ["currencyoverview", "itemoverview"];
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

	if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
		return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(type)) {
		return NextResponse.json({ error: "Invalid type" }, { status: 400 });
	}

	const url = `${NINJA_BASE}/${endpoint}?league=${encodeURIComponent(league)}&type=${encodeURIComponent(type)}`;

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
