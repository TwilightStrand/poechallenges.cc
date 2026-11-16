import { ITEM_CATALOG } from "./item-catalog";

// All trade links use "securable" (instant buyout): "online" listings are full
// of price fixers.

export interface TradeLink {
	url: string;
	type: "exchange" | "search";
}

export function buildExchangeUrl(
	league: string,
	staticId: string | string[],
): string {
	const query = JSON.stringify({
		exchange: {
			have: ["chaos"],
			want: Array.isArray(staticId) ? staticId : [staticId],
			status: { option: "securable" },
		},
	});
	return `https://www.pathofexile.com/trade/exchange/${encodeURIComponent(league)}?q=${encodeURIComponent(query)}`;
}

export function buildSearchUrl(
	league: string,
	text: string,
	by: "term" | "type" = "term",
): string {
	// term finds nothing for "Maelström of Chaos" but 400+ listings for
	// "Maelstrom of Chaos", so accents are stripped.
	const match =
		by === "type"
			? { type: text }
			: { term: text.normalize("NFD").replace(/\p{M}/gu, "") };
	const query = JSON.stringify({
		query: {
			...match,
			status: { option: "securable" },
			stats: [{ type: "and", filters: [] }],
		},
		sort: { price: "asc" },
	});
	return `https://www.pathofexile.com/trade/search/${encodeURIComponent(league)}?q=${encodeURIComponent(query)}`;
}

// `league` is the trade site's league id ("Covens"), not the display name.
export function getTradeLink(
	subtaskName: string,
	league: string,
): TradeLink | null {
	const trade = ITEM_CATALOG[subtaskName]?.trade;
	if (!trade) return null;

	if ("exchange" in trade) {
		return { url: buildExchangeUrl(league, trade.exchange), type: "exchange" };
	}
	return {
		url: buildSearchUrl(league, trade.search, trade.by),
		type: "search",
	};
}
