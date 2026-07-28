"use client";

import { useCallback, useEffect, useState } from "react";
import type { League, LeagueGuide } from "@/schemas";

const STORAGE_KEY = "poe-selected-league";

export function useLeague(
	leagues: Record<string, League>,
	guides: Record<string, LeagueGuide>,
	defaultLeagueId: string,
) {
	const [currentLeagueId, setCurrentLeagueId] = useState(defaultLeagueId);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && leagues[stored]) {
			setCurrentLeagueId(stored);
		}
	}, [leagues]);

	const setLeague = useCallback(
		(id: string) => {
			if (!leagues[id]) return;
			setCurrentLeagueId(id);
			if (typeof window !== "undefined") {
				localStorage.setItem(STORAGE_KEY, id);
			}
		},
		[leagues],
	);

	const currentLeague = leagues[currentLeagueId] ?? leagues[defaultLeagueId]!;
	const currentGuide = guides[currentLeagueId];

	const availableLeagues = Object.values(leagues).map((l) => ({
		id: l.id,
		name: l.name,
	}));

	return {
		currentLeagueId,
		currentLeague,
		currentGuide,
		setLeague,
		availableLeagues,
	};
}
