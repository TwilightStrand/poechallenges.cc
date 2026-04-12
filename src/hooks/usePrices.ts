"use client";

import { useState, useEffect, useMemo } from "react";
import {
  fetchSubtaskPrices,
  findCheapestCombination,
  covetedCurrencyPrices,
  type PriceInfo,
  type SubtaskPriceMapping,
} from "@/lib/price-lookup";

// Registry of challenges that have price mappings
const PRICE_MAPPINGS: Record<string, SubtaskPriceMapping[]> = {
  "22": covetedCurrencyPrices, // Coveted Currency (Mirage)
};

export function usePrices(
  leagueName: string,
  challengeId: number,
  subtaskIds: string[],
  completedIds: Set<string>,
  required: number,
) {
  const [prices, setPrices] = useState<Map<string, PriceInfo>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mappings = PRICE_MAPPINGS[String(challengeId)];
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
