// Maps challenge subtask names to poe.ninja API lookups
// Each entry: { type: poe.ninja API type, search: name to match }

export interface PriceInfo {
	name: string;
	chaosValue: number;
	icon?: string;
	totalCost: number; // chaosValue * quantity needed
	quantity: number;
}

interface NinjaLine {
	currencyTypeName?: string;
	name?: string;
	chaosEquivalent?: number;
	chaosValue?: number;
	icon?: string;
	receive?: { value: number };
}

interface NinjaResponse {
	lines: NinjaLine[];
}

async function fetchNinja(
	league: string,
	endpoint: string,
	type: string,
): Promise<NinjaLine[]> {
	try {
		const url = `/api/prices?league=${encodeURIComponent(league)}&endpoint=${encodeURIComponent(endpoint)}&type=${encodeURIComponent(type)}`;
		const res = await fetch(url);
		if (!res.ok) return [];
		const data: NinjaResponse = await res.json();
		return data.lines ?? [];
	} catch {
		return [];
	}
}

function findPrice(
	lines: NinjaLine[],
	search: string,
): { chaos: number; icon?: string; name?: string } | null {
	const lower = search.toLowerCase();

	// "*" means the cheapest entry of this type. Several challenges accept any
	// member of a large family — any Tattoo, any Oil, any Enshrouding Crystal —
	// and naming all 53 tattoos here would be unreadable and go stale.
	if (search === "*") {
		let best: NinjaLine | undefined;
		let bestChaos = Number.POSITIVE_INFINITY;

		for (const line of lines) {
			const chaos = line.chaosEquivalent ?? line.chaosValue ?? 0;
			if (chaos > 0 && chaos < bestChaos) {
				bestChaos = chaos;
				best = line;
			}
		}

		if (!best) return null;
		return {
			chaos: bestChaos,
			icon: best.icon,
			name: best.currencyTypeName ?? best.name,
		};
	}

	// Try exact match first
	const exact = lines.find(
		(l) => (l.currencyTypeName ?? l.name ?? "").toLowerCase() === lower,
	);
	if (exact) {
		return {
			chaos: exact.chaosEquivalent ?? exact.chaosValue ?? 0,
			icon: exact.icon,
		};
	}

	// Try partial match
	const partial = lines.find((l) =>
		(l.currencyTypeName ?? l.name ?? "").toLowerCase().includes(lower),
	);
	if (partial) {
		return {
			chaos: partial.chaosEquivalent ?? partial.chaosValue ?? 0,
			icon: partial.icon,
		};
	}

	return null;
}

export interface SubtaskPriceMapping {
	subtaskId: string;
	searches: { endpoint: string; type: string; name: string }[];
	quantity: number; // how many you need to use/buy
}

// Price mappings for Mirage league "Coveted Currency" challenge (id: 22)
export const covetedCurrencyPrices: SubtaskPriceMapping[] = [
	{
		subtaskId: "22-1",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Coin of Knowledge",
			},
		],
		quantity: 5,
	},
	{
		subtaskId: "22-2",
		searches: [
			{ endpoint: "currencyoverview", type: "Currency", name: "Coin of Power" },
		],
		quantity: 5,
	},
	{
		subtaskId: "22-3",
		searches: [
			{ endpoint: "currencyoverview", type: "Currency", name: "Coin of Skill" },
		],
		quantity: 5,
	},
	{
		subtaskId: "22-4",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Coin of Restoration",
			},
		],
		quantity: 5,
	},
	{
		subtaskId: "22-5",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Coin of Desecration",
			},
		],
		quantity: 5,
	},
	{
		subtaskId: "22-6",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Volatile Vaal Orb",
			},
		],
		quantity: 5,
	},
	{
		subtaskId: "22-7",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Sinistral Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Dextral Catalyst",
			},
		],
		quantity: 20,
	},
	{
		subtaskId: "22-8",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Crystallised Rancour",
			},
		],
		quantity: 3,
	},
	{
		subtaskId: "22-9",
		searches: [
			{
				endpoint: "itemoverview",
				type: "Essence",
				name: "Essence of Desolation",
			},
		],
		quantity: 3,
	},
	{
		subtaskId: "22-10",
		searches: [
			{
				endpoint: "itemoverview",
				type: "Incubator",
				name: "Honoured Incubator",
			},
			{ endpoint: "itemoverview", type: "Incubator", name: "Sacred Incubator" },
			{
				endpoint: "itemoverview",
				type: "Incubator",
				name: "Miraged Incubator",
			},
		],
		quantity: 10,
	},
	{
		subtaskId: "22-11",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Refracting Fog",
			},
		],
		quantity: 5,
	},
];

// Manual price overrides — verified in-game prices that differ from poe.ninja.
// These take priority until the crowdsourced DB is running.
// Keyed leagueId:subtaskId, because challenge numbers repeat across leagues with
// entirely different items behind them.
const PRICE_OVERRIDES: Record<string, number> = {
	"mirage:22-1": 79, // Coin of Knowledge — not on poe.ninja
	"mirage:22-2": 185, // Coin of Power — not on poe.ninja
	"mirage:22-9": 34, // Essence of Desolation
	"mirage:22-10": 79, // Miraged Incubator (cheapest of Honoured/Sacred/Miraged)
	"mirage:22-11": 175, // Refracting Fog
};

// Override for multi-search subtasks where we pick the cheapest
// For Sinistral/Dextral Catalyst (22-7), Sinistral is 30c, Dextral is 106c
// The system picks the cheapest, so Sinistral at 30c wins
const MULTI_SEARCH_OVERRIDES: Record<string, { name: string; chaos: number }> =
	{
		"mirage:22-7": { name: "Sinistral Catalyst", chaos: 30 },
	};

export async function fetchSubtaskPrices(
	league: string,
	leagueId: string,
	mappings: SubtaskPriceMapping[],
): Promise<Map<string, PriceInfo>> {
	// Collect unique API calls needed
	const apiCalls = new Map<string, Promise<NinjaLine[]>>();

	for (const mapping of mappings) {
		for (const search of mapping.searches) {
			const key = `${search.endpoint}:${search.type}`;
			if (!apiCalls.has(key)) {
				apiCalls.set(key, fetchNinja(league, search.endpoint, search.type));
			}
		}
	}

	// Await all in parallel
	const results = new Map<string, NinjaLine[]>();
	const entries = [...apiCalls.entries()];
	const resolved = await Promise.all(entries.map(([, p]) => p));
	entries.forEach(([key], i) => {
		const lines = resolved[i];
		if (lines) results.set(key, lines);
	});

	// Look up prices for each subtask
	const prices = new Map<string, PriceInfo>();

	for (const mapping of mappings) {
		let bestPrice = Infinity;
		let bestName = "";
		let bestIcon: string | undefined;

		for (const search of mapping.searches) {
			const key = `${search.endpoint}:${search.type}`;
			const lines = results.get(key) ?? [];
			const found = findPrice(lines, search.name);
			if (found && found.chaos < bestPrice) {
				bestPrice = found.chaos;
				bestName = found.name ?? search.name;
				bestIcon = found.icon;
			}
		}

		if (bestPrice < Infinity) {
			// Apply manual overrides if they exist
			const overrideKey = `${leagueId}:${mapping.subtaskId}`;
			const override = PRICE_OVERRIDES[overrideKey];
			const multiOverride = MULTI_SEARCH_OVERRIDES[overrideKey];
			if (multiOverride) {
				bestName = multiOverride.name;
				bestPrice = multiOverride.chaos;
			}
			const finalPrice = override ?? bestPrice;

			prices.set(mapping.subtaskId, {
				name: bestName,
				chaosValue: finalPrice,
				icon: bestIcon,
				totalCost: finalPrice * mapping.quantity,
				quantity: mapping.quantity,
			});
		}
	}

	return prices;
}

// Given a pick-N challenge, find the cheapest N subtasks to complete
export function findCheapestCombination(
	prices: Map<string, PriceInfo>,
	subtaskIds: string[],
	completedIds: Set<string>,
	required: number,
): { subtaskId: string; price: PriceInfo }[] {
	const alreadyDone = subtaskIds.filter((id) => completedIds.has(id));
	const remaining = required - alreadyDone.length;

	if (remaining <= 0) return [];

	// Sort uncompleted subtasks by total cost
	const uncompleted = subtaskIds
		.filter((id) => !completedIds.has(id))
		.map((id) => ({ subtaskId: id, price: prices.get(id) }))
		.filter(
			(x): x is { subtaskId: string; price: PriceInfo } =>
				x.price !== undefined,
		)
		.sort((a, b) => a.price.totalCost - b.price.totalCost);

	return uncompleted.slice(0, remaining);
}

// Price mappings for Curse of the Allflame "Potent Possibilities".
// Ten of twenty currency types, so the cheapest-combination view is the point.
// Every row except Mirror of Kalandra is priced. The wide families use "*",
// meaning the cheapest of that type, since the challenge accepts any member.
export const potentPossibilitiesPrices: SubtaskPriceMapping[] = [
	{
		subtaskId: "34-2",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Veiled Chaos Orb",
			},
		],
		quantity: 1,
	},
	{
		subtaskId: "34-4",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Eldritch Chaos Orb",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Eldritch Orb of Annulment",
			},
		],
		quantity: 1,
	},
	{
		subtaskId: "34-5",
		searches: [
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Exceptional Eldritch Ichor",
			},
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Exceptional Eldritch Ember",
			},
		],
		quantity: 1,
	},
	{
		subtaskId: "34-6",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Tainted Catalyst",
			},
		],
		quantity: 10,
	},
	{
		subtaskId: "34-7",
		searches: [
			{ endpoint: "exchange", type: "Currency", name: "Awakener's Orb" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-8",
		searches: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Dominance" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-9",
		searches: [
			{ endpoint: "exchange", type: "Currency", name: "Mirror of Kalandra" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-10",
		searches: [
			{ endpoint: "currencyoverview", type: "Currency", name: "Sacred Orb" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-11",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Fracturing Orb",
			},
		],
		quantity: 1,
	},
	{
		subtaskId: "34-12",
		searches: [
			{ endpoint: "exchange", type: "Currency", name: "Hinekora's Lock" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-13",
		searches: [
			{ endpoint: "currencyoverview", type: "Currency", name: "Tempering Orb" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-14",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Reflecting Mist",
			},
		],
		quantity: 1,
	},
	{
		// Any catalyst counts, so the cheapest of the ten listed wins.
		subtaskId: "34-17",
		searches: [
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Abrasive Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Accelerating Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Fertile Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Imbued Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Intrinsic Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Noxious Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Prismatic Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Tempering Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Turbulent Catalyst",
			},
			{
				endpoint: "currencyoverview",
				type: "Currency",
				name: "Unstable Catalyst",
			},
		],
		quantity: 40,
	},
	{
		subtaskId: "34-20",
		searches: [
			{ endpoint: "exchange", type: "Currency", name: "Crystallised Rancour" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-1",
		searches: [
			{ endpoint: "exchange", type: "Currency", name: "Hunter's Exalted Orb" },
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Crusader's Exalted Orb",
			},
			{
				endpoint: "exchange",
				type: "Currency",
				name: "Redeemer's Exalted Orb",
			},
			{ endpoint: "exchange", type: "Currency", name: "Warlord's Exalted Orb" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-3",
		searches: [
			{ endpoint: "exchange", type: "Currency", name: "Orb of Remembrance" },
			{ endpoint: "exchange", type: "Currency", name: "Orb of Unravelling" },
			{ endpoint: "exchange", type: "Currency", name: "Orb of Intention" },
		],
		quantity: 1,
	},
	{
		subtaskId: "34-15",
		searches: [
			{ endpoint: "exchange", type: "Runegraft", name: "*" },
			{ endpoint: "exchange", type: "Tattoo", name: "*" },
		],
		quantity: 5,
	},
	{
		subtaskId: "34-16",
		searches: [{ endpoint: "exchange", type: "EnshroudingCrystal", name: "*" }],
		quantity: 5,
	},
	{
		subtaskId: "34-18",
		searches: [
			{ endpoint: "exchange", type: "Essence", name: "Essence of Delirium" },
			{ endpoint: "exchange", type: "Essence", name: "Essence of Horror" },
			{ endpoint: "exchange", type: "Essence", name: "Essence of Hysteria" },
			{ endpoint: "exchange", type: "Essence", name: "Essence of Insanity" },
		],
		quantity: 4,
	},
	{
		subtaskId: "34-19",
		searches: [{ endpoint: "exchange", type: "Oil", name: "*" }],
		quantity: 10,
	},
];

// Price mappings for Curse of the Allflame "Ethereal Enhancements".
// Five of nine Cursed Ducats. They live on poe.ninja's exchange endpoint under
// type=Ducat, which is not visible from the stash overviews.
export const etherealEnhancementsPrices: SubtaskPriceMapping[] = [
	["22-1", "Merrick's Ducat"],
	["22-2", "Cyaxan's Ducat"],
	["22-3", "The Genteel's Ducat"],
	["22-4", "Kishara's Ducat"],
	["22-5", "Telesia's Ducat"],
	["22-6", "Rotmother's Ducat"],
	["22-7", "Brinehook's Ducat"],
	["22-8", "Katakohi's Ducat"],
	["22-9", "Tzamoto's Ducat"],
].map(([subtaskId, name]) => ({
	subtaskId: subtaskId as string,
	searches: [{ endpoint: "exchange", type: "Ducat", name: name as string }],
	quantity: 1,
}));
