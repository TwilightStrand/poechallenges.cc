"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  Challenge,
  ChallengeGuide,
  ChallengeProgress,
} from "@/schemas";

export type SortBy = "default" | "difficulty" | "completion";

const DIFFICULTY_ORDER: Record<string, number> = {
  "very-easy": 0,
  easy: 1,
  normal: 2,
  hard: 3,
  "very-hard": 4,
};

export interface FilteredChallenge {
  challenge: Challenge;
  guide?: ChallengeGuide;
  progress: ChallengeProgress;
}

export function useFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("default");

  const toggleCompleted = useCallback(() => {
    setShowCompleted((prev) => !prev);
  }, []);

  const filterAndSort = useCallback(
    (items: FilteredChallenge[]): FilteredChallenge[] => {
      let result = items;

      // Filter by search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(
          (item) =>
            item.challenge.name.toLowerCase().includes(q) ||
            item.challenge.description.toLowerCase().includes(q),
        );
      }

      // Filter by completion
      if (!showCompleted) {
        result = result.filter((item) => !item.progress.isComplete);
      }

      // Sort
      if (sortBy === "difficulty") {
        result = [...result].sort((a, b) => {
          const da = DIFFICULTY_ORDER[a.guide?.difficulty ?? "normal"] ?? 2;
          const db = DIFFICULTY_ORDER[b.guide?.difficulty ?? "normal"] ?? 2;
          return da - db;
        });
      } else if (sortBy === "completion") {
        result = [...result].sort((a, b) => {
          if (a.progress.isComplete !== b.progress.isComplete) {
            return a.progress.isComplete ? 1 : -1;
          }
          const pctA =
            a.challenge.required > 0
              ? a.progress.completed / a.challenge.required
              : 0;
          const pctB =
            b.challenge.required > 0
              ? b.progress.completed / b.challenge.required
              : 0;
          return pctB - pctA;
        });
      }

      return result;
    },
    [searchQuery, showCompleted, sortBy],
  );

  return {
    searchQuery,
    setSearchQuery,
    showCompleted,
    toggleCompleted,
    sortBy,
    setSortBy,
    filterAndSort,
  };
}
