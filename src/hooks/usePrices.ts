"use client";

import { useEffect, useMemo, useState } from "react";
import { CHEAPEST_PATH_CHALLENGES } from "@/lib/item-catalog";
import {
	fetchSubtaskPrices,
	findCheapestCombination,
	type PriceInfo,
	priceMappingsFor,
} from "@/lib/price-lookup";
import type { Subtask } from "@/schemas";

export function usePrices(
	ninjaLeague: string,
	leagueId: string,
	challengeId: number,
	subtasks: Subtask[],
	completedIds: Set<string>,
	required: number,
) {
	const [prices, setPrices] = useState<Map<string, PriceInfo>>(new Map());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mappings = useMemo(() => priceMappingsFor(subtasks), [subtasks]);
	const subtaskIds = useMemo(() => subtasks.map((s) => s.id), [subtasks]);
	const hasPrices = mappings.length > 0;
	// Keyed by league as well as challenge: challenge numbers repeat across
	// leagues with completely different contents.
	const showCheapest = CHEAPEST_PATH_CHALLENGES.has(
		`${leagueId}:${challengeId}`,
	);

	useEffect(() => {
		// Cards are reused across leagues for the same challenge number, so the
		// previous challenge's prices must not survive into this one.
		setPrices(new Map());
		setError(null);
		if (mappings.length === 0) {
			setLoading(false);
			return;
		}

		let cancelled = false;
		setLoading(true);

		fetchSubtaskPrices(ninjaLeague, leagueId, mappings)
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
	}, [ninjaLeague, leagueId, mappings]);

	const cheapest = useMemo(() => {
		if (!showCheapest || prices.size === 0) return new Set<string>();
		const best = findCheapestCombination(
			prices,
			subtaskIds,
			completedIds,
			required,
		);
		return new Set(best.map((b) => b.subtaskId));
	}, [prices, showCheapest, subtaskIds, completedIds, required]);

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
