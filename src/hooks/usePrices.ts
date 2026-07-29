"use client";

import { useEffect, useMemo, useState } from "react";
import {
	covetedCurrencyPrices,
	fetchSubtaskPrices,
	findCheapestCombination,
	type PriceInfo,
	potentPossibilitiesPrices,
	type SubtaskPriceMapping,
} from "@/lib/price-lookup";

// Keyed by league id as well as challenge id: challenge numbers repeat across
// leagues with completely different contents, so keying on the number alone
// priced Mirage's Coveted Currency items for Allflame's Ethereal Enhancements.
const PRICE_MAPPINGS: Record<string, SubtaskPriceMapping[]> = {
	"mirage:22": covetedCurrencyPrices,
	"allflame:34": potentPossibilitiesPrices,
};

export function usePrices(
	leagueName: string,
	leagueId: string,
	challengeId: number,
	subtaskIds: string[],
	completedIds: Set<string>,
	required: number,
) {
	const [prices, setPrices] = useState<Map<string, PriceInfo>>(new Map());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mappings = PRICE_MAPPINGS[`${leagueId}:${challengeId}`];
	const hasPrices = mappings !== undefined;

	useEffect(() => {
		if (!mappings) return;

		let cancelled = false;
		setLoading(true);
		setError(null);

		fetchSubtaskPrices(leagueName, mappings)
			.then((result) => {
				if (!cancelled) {
					setPrices(result);
					setLoading(false);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setError("Failed to fetch prices");
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [leagueName, mappings]);

	const cheapest = useMemo(() => {
		if (!mappings || prices.size === 0) return new Set<string>();
		const best = findCheapestCombination(
			prices,
			subtaskIds,
			completedIds,
			required,
		);
		return new Set(best.map((b) => b.subtaskId));
	}, [prices, mappings, subtaskIds, completedIds, required]);

	const totalCostForCheapest = useMemo(() => {
		if (cheapest.size === 0) return 0;
		let total = 0;
		for (const id of cheapest) {
			const price = prices.get(id);
			if (price) total += price.totalCost;
		}
		return total;
	}, [cheapest, prices]);

	return {
		prices,
		loading,
		error,
		hasPrices,
		cheapest,
		totalCostForCheapest,
	};
}
