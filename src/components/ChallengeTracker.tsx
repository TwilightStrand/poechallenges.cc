"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import * as v from "valibot";
import type { League, LeagueGuide, ChallengeGuide } from "@/schemas";
import { PlayerProgressSchema } from "@/schemas";
import { useProgress } from "@/hooks/useProgress";
import { useFilters, type FilteredChallenge } from "@/hooks/useFilters";
import { useLeague } from "@/hooks/useLeague";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "./Header";
import { OverallProgress } from "./OverallProgress";
import { FilterBar } from "./FilterBar";
import { ChallengeList } from "./ChallengeList";
import { BookmarkletInfo } from "./BookmarkletInfo";
import { ImportModal } from "./ImportModal";
import { Footer } from "./Footer";

interface ChallengeTrackerProps {
  leagues: Record<string, League>;
  guides: Record<string, LeagueGuide>;
  defaultLeagueId: string;
}

export function ChallengeTracker({
  leagues,
  guides,
  defaultLeagueId,
}: ChallengeTrackerProps) {
  const {
    currentLeagueId,
    currentLeague,
    currentGuide,
    setLeague,
    availableLeagues,
  } = useLeague(leagues, guides, defaultLeagueId);

  const { user, isLoggedIn, loginGithub, loginPoe, loginDev, logout } = useAuth();

  const {
    progress,
    isLoaded,
    toggleSubtask,
    importProgress,
    resetAll,
    completedCount,
    getProgress,
  } = useProgress(currentLeague, isLoggedIn);

  const {
    searchQuery,
    setSearchQuery,
    showCompleted,
    toggleCompleted,
    sortBy,
    setSortBy,
    filterAndSort,
  } = useFilters();

  const [importData, setImportData] = useState<string | null>(null);

  // Build guide lookup map
  const guideMap = useMemo(() => {
    const map = new Map<number, ChallengeGuide>();
    if (currentGuide) {
      for (const g of currentGuide.challenges) {
        map.set(g.challengeId, g);
      }
    }
    return map;
  }, [currentGuide]);

  // Build filtered challenge list
  const filteredChallenges = useMemo(() => {
    const items: FilteredChallenge[] = currentLeague.challenges.map((c) => ({
      challenge: c,
      guide: guideMap.get(c.id),
      progress: getProgress(c.id),
    }));
    return filterAndSort(items);
  }, [currentLeague, guideMap, getProgress, filterAndSort]);

  // Check for bookmarklet import via URL hash
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (hash.startsWith("#import=")) {
      const encoded = hash.slice("#import=".length);
      try {
        const decoded = decodeURIComponent(encoded);
        setImportData(decoded);
        // Clean up hash
        history.replaceState(null, "", window.location.pathname);
      } catch {
        // Invalid import data
      }
    }
  }, []);

  const handleConfirmImport = useCallback(() => {
    if (!importData) return;
    try {
      const parsed = JSON.parse(importData);
      const result = v.safeParse(PlayerProgressSchema, parsed);
      if (result.success) {
        importProgress(result.output);
      }
    } catch {
      // Invalid JSON
    }
    setImportData(null);
  }, [importData, importProgress]);

  const handleCancelImport = useCallback(() => {
    setImportData(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="font-heading text-poe-gold-light text-xl">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="poe-panel rounded-lg overflow-hidden">
        <Header
          currentLeagueId={currentLeagueId}
          leagues={availableLeagues}
          onLeagueChange={setLeague}
          user={user}
          onLoginGithub={loginGithub}
          onLoginDev={loginDev}
          onLinkPoe={loginPoe}
          onLogout={logout}
        />

        <OverallProgress
          completedCount={completedCount}
          totalCount={currentLeague.challenges.length}
          rewards={currentLeague.rewards}
        />

        <div className="poe-separator" />

        <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showCompleted={showCompleted}
            onToggleCompleted={toggleCompleted}
            sortBy={sortBy}
            onSortChange={(s) => setSortBy(s as "default" | "difficulty" | "completion")}
          />
          <BookmarkletInfo />
        </div>

        <div className="poe-separator" />

        <div className="p-2 space-y-0.5">
          <ChallengeList
            items={filteredChallenges}
            onToggleSubtask={toggleSubtask}
            leagueName={currentLeague.name}
            leagueId={currentLeague.id}
            isLoggedIn={isLoggedIn}
          />
        </div>

        <div className="poe-separator" />

        <Footer />
      </div>

      {filteredChallenges.length === 0 && (
        <div className="mt-12 text-center text-poe-text-dim">
          <p className="text-lg">No challenges match your filters.</p>
          {!showCompleted && (
            <button
              onClick={toggleCompleted}
              className="mt-2 text-poe-gold underline hover:text-poe-gold-bright"
            >
              Show completed challenges
            </button>
          )}
        </div>
      )}

      {importData && (
        <ImportModal
          data={importData}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
        />
      )}
    </div>
  );
}
