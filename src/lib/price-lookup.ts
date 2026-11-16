import type { Subtask } from "@/schemas";
import { ITEM_CATALOG, type PriceSource } from "./item-catalog";

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

	// Try exact match first. Items such as Viscera get one row per rolled
	// modifier under the same name, and any roll satisfies the challenge, so
	// the cheapest row is the price.
	let exact: { chaos: number; icon?: string } | null = null;
	for (const line of lines) {
		if ((line.currencyTypeName ?? line.name ?? "").toLowerCase() !== lower) {
			continue;
		}
		const chaos = line.chaosEquivalent ?? line.chaosValue ?? 0;
		if (!exact || (chaos > 0 && (exact.chaos <= 0 || chaos < exact.chaos))) {
			exact = { chaos, icon: line.icon };
		}
	}
	if (exact) return exact;

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
	searches: PriceSource[];
	needsAll: boolean;
	quantity: number;
}

// Every subtask whose name has price sources in the catalog. A subtask with a
// counter ("Use Vaal Orbs x20") needs that many of the item.
export function priceMappingsFor(subtasks: Subtask[]): SubtaskPriceMapping[] {
	return subtasks.flatMap((subtask) => {
		const entry = ITEM_CATALOG[subtask.name];
		if (!entry?.price) return [];
		return [
			{
				subtaskId: subtask.id,
				searches: entry.price,
				needsAll: entry.needsAll === true,
				quantity: subtask.counterTarget ?? 1,
			},
		];
	});
}

// Manual price overrides: verified in-game prices that differ from poe.ninja.
// These take priority until the crowdsourced DB is running.
// Keyed leagueId:subtaskId, because challenge numbers repeat across leagues with
// entirely different items behind them.
const PRICE_OVERRIDES: Record<string, number> = {
	"mirage:22-1": 79, // Coin of Knowledge, not on poe.ninja
	"mirage:22-2": 185, // Coin of Power, not on poe.ninja
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

		const found = mapping.searches.map((search) =>
			findPrice(
				results.get(`${search.endpoint}:${search.type}`) ?? [],
				search.name,
			),
		);

		if (mapping.needsAll) {
			// Only a full set is a usable price; a partial sum would understate it.
			const all = found.filter((f) => f !== null);
			if (all.length === found.length && all.length > 0) {
				bestPrice = all.reduce((sum, f) => sum + f.chaos, 0);
				bestName = `${all.length} items`;
				bestIcon = all[0]?.icon;
			}
		} else {
			found.forEach((f, i) => {
				if (f && f.chaos < bestPrice) {
					bestPrice = f.chaos;
					bestName = f.name ?? mapping.searches[i]?.name ?? "";
					bestIcon = f.icon;
				}
			});
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
