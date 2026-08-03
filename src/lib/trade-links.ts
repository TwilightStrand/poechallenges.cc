// Maps item names to PoE trade static IDs for bulk exchange
// IDs sourced from https://www.pathofexile.com/api/trade/data/static

const BULK_EXCHANGE_IDS: Record<string, string> = {
	// Mirage Djinn Coins
	"Coin of Knowledge": "coin-of-knowledge",
	"Coin of Power": "coin-of-power",
	"Coin of Skill": "coin-of-skill",
	"Coin of Restoration": "coin-of-restoration",
	"Coin of Desecration": "coin-of-desecration",

	// Mirage currency
	"Volatile Vaal Orb": "volatile-vaal-orb",
	"Sinistral Catalyst": "sinistral-catalyst",
	"Dextral Catalyst": "dextral-catalyst",
	"Crystallised Rancour": "crystallised-rancour",
	"Refracting Fog": "refracting-fog",

	// Common currency
	"Orb of Transmutation": "transmute",
	"Orb of Alteration": "alt",
	"Orb of Augmentation": "aug",
	"Orb of Alchemy": "alch",
	"Orb of Chance": "chance",
	"Chaos Orb": "chaos",
	"Exalted Orb": "exalted",
	"Divine Orb": "divine",
	"Orb of Scouring": "scour",
	"Orb of Fusing": "fusing",
	"Jeweller's Orb": "jewellers",
	"Chromatic Orb": "chrome",
	"Orb of Annulment": "annul",
	"Regal Orb": "regal",
	"Blessed Orb": "blessed",
	"Sacred Orb": "sacred-orb",
	"Orb of Regret": "regret",
	"Orb of Unmaking": "unmaking",
	"Gemcutter's Prism": "gcp",
	"Vaal Orb": "vaal",
	"Mirror of Kalandra": "mirror",

	// Essences
	"Essence of Desolation": "essence-of-desolation",
	"Essence of Hysteria": "essence-of-hysteria",
	"Essence of Insanity": "essence-of-insanity",
	"Essence of Delirium": "essence-of-delirium",

	// Fragments
	Simulacrum: "simulacrum",
	"Offering to the Goddess": "offer",
	"Dedication to the Goddess": "offer-dedication",
	"Tribute to the Goddess": "offer-tribute",
	"Gift to the Goddess": "offer-gift",
};

// Boss subtask names that map to a buyable entry item
const BOSS_ENTRY_ITEMS: Record<string, string> = {
	Izaro: "offer-dedication",
	"Uber Atziri": "hope",
};

// Items that should use the item search (not bulk exchange)
// Includes unique maps, incubators, and other non-currency tradables
const ITEM_SEARCH_NAMES: Set<string> = new Set([
	// Unique maps
	"Vaults of Atziri",
	"Maelström of Chaos",
	"The Coward's Trial",
	"Acton's Nightmare",
	"Poorjoy's Asylum",
	"Mao Kun",
	"Oba's Cursed Trove",
	"Olmec's Sanctum",
	"Death and Taxes",
	"Whakawairua Tuahu",
	"The Vinktar Square",
	"Caer Blaidd, Wolfpack's Den",
	"The Putrid Cloister",
	"Hallowed Ground",
	"The Twilight Temple",
	"Pillars of Arun",
	"Doryani's Machinarium",
	"Cortex",
	// Heist contracts
	"Contract: The Twins",
	// Incubators (traded as items, not currency)
	"Honoured Incubator",
	"Sacred Incubator",
	"Miraged Incubator",
]);

export interface TradeLink {
	url: string;
	type: "exchange" | "search";
}

export function buildExchangeUrl(league: string, staticId: string): string {
	const query = JSON.stringify({
		exchange: {
			have: ["chaos"],
			want: [staticId],
			status: { option: "securable" },
		},
	});
	return `https://www.pathofexile.com/trade/exchange/${encodeURIComponent(league)}?q=${encodeURIComponent(query)}`;
}

export function buildSearchUrl(league: string, itemName: string): string {
	const query = JSON.stringify({
		query: {
			type: itemName,
			status: { option: "securable" },
			stats: [{ type: "and", filters: [] }],
		},
		sort: { price: "asc" },
	});
	return `https://www.pathofexile.com/trade/search/${encodeURIComponent(league)}?q=${encodeURIComponent(query)}`;
}

export function getTradeLink(
	itemName: string,
	league: string,
): TradeLink | null {
	// Boss names that map to an entry fragment
	const entryId = BOSS_ENTRY_ITEMS[itemName];
	if (entryId) {
		return { url: buildExchangeUrl(league, entryId), type: "exchange" };
	}

	// Check bulk exchange mapping first (exact match)
	const staticId = BULK_EXCHANGE_IDS[itemName];
	if (staticId) {
		return { url: buildExchangeUrl(league, staticId), type: "exchange" };
	}

	// Check partial matches for compound names like "Sinistral or Dextral Catalyst"
	for (const [name, id] of Object.entries(BULK_EXCHANGE_IDS)) {
		if (itemName.includes(name)) {
			return { url: buildExchangeUrl(league, id), type: "exchange" };
		}
	}

	// Check item search names (unique maps, incubators, etc.)
	if (ITEM_SEARCH_NAMES.has(itemName)) {
		return { url: buildSearchUrl(league, itemName), type: "search" };
	}

	// Check partial matches for compound names like "Honoured, Sacred or Miraged Incubator"
	for (const name of ITEM_SEARCH_NAMES) {
		if (itemName.includes(name)) {
			return { url: buildSearchUrl(league, name), type: "search" };
		}
	}

	// Non-tradeable (boss kills, quest completions, generic tasks)
	return null;
}

// Get trade links for all subtasks in a challenge
export function getSubtaskTradeLinks(
	subtaskNames: string[],
	league: string,
): Map<string, TradeLink> {
	const links = new Map<string, TradeLink>();
	for (const name of subtaskNames) {
		const link = getTradeLink(name, league);
		if (link) {
			links.set(name, link);
		}
	}
	return links;
}
