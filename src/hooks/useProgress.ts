"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mergeProgress } from "@/lib/merge-progress";
import {
	createDefaultProgress,
	loadProgress,
	recalculateChallenge,
	saveProgress,
} from "@/lib/progress-store";
import type { ChallengeProgress, League, PlayerProgress } from "@/schemas";

function findSubtaskTarget(
	league: League,
	challengeId: number,
	subtaskId: string,
): number | undefined {
	return league.challenges
		.find((c) => c.id === challengeId)
		?.subtasks.find((s) => s.id === subtaskId)?.counterTarget;
}

export function useProgress(league: League, isLoggedIn: boolean) {
	const [progress, setProgress] = useState<PlayerProgress>(() =>
		createDefaultProgress(league),
	);
	const [isLoaded, setIsLoaded] = useState(false);
	const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	// Load progress: from API if logged in, localStorage otherwise
	useEffect(() => {
		if (isLoggedIn) {
			fetch(`/api/progress?league=${encodeURIComponent(league.id)}`)
				.then((r) => r.json())
				.then((data) => {
					if (data.progress) {
						setProgress(data.progress as PlayerProgress);
						// Also cache in localStorage as offline fallback
						saveProgress(data.progress as PlayerProgress);
					} else {
						// No server data, try localStorage
						setProgress(loadProgress(league));
					}
					setIsLoaded(true);
				})
				.catch(() => {
					// API failed, fall back to localStorage
					setProgress(loadProgress(league));
					setIsLoaded(true);
				});
		} else {
			setProgress(loadProgress(league));
			setIsLoaded(true);
		}
	}, [league, isLoggedIn]);

	// Debounced save — writes to localStorage always, API if logged in
	const debouncedSave = useCallback(
		(newProgress: PlayerProgress) => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
			saveTimeoutRef.current = setTimeout(() => {
				// Always save to localStorage (offline fallback)
				saveProgress(newProgress);

				// Also save to API if logged in
				if (isLoggedIn) {
					fetch("/api/progress", {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							leagueId: newProgress.leagueId,
							challengeData: newProgress,
						}),
					}).catch(() => {
						// Silent fail — localStorage has the data
					});
				}
			}, 300);
		},
		[isLoggedIn],
	);

	const updateProgress = useCallback(
		(updater: (prev: PlayerProgress) => PlayerProgress) => {
			setProgress((prev) => {
				const next = updater(prev);
				debouncedSave(next);
				return next;
			});
		},
		[debouncedSave],
	);

	const toggleSubtask = useCallback(
		(challengeId: number, subtaskId: string) => {
			updateProgress((prev) => {
				const challenges = prev.challenges.map((cp) => {
					if (cp.challengeId !== challengeId) return cp;

					const updatedSubtasks = cp.subtasks.map((s) => {
						if (s.id !== subtaskId) return s;

						const completed = !s.completed;
						const target = findSubtaskTarget(league, challengeId, subtaskId);
						if (target === undefined) return { ...s, completed };

						// Ticking a counted subtask means its counter is full; unticking
						// resets it, or the row would read "30/30" beside an empty box.
						return { ...s, completed, counter: completed ? target : 0 };
					});

					const updated = { ...cp, subtasks: updatedSubtasks };
					return recalculateChallenge(updated, league);
				});

				return { ...prev, challenges };
			});
		},
		[league, updateProgress],
	);

	const updateCounter = useCallback(
		(challengeId: number, value: number) => {
			updateProgress((prev) => {
				const challenges = prev.challenges.map((cp) => {
					if (cp.challengeId !== challengeId) return cp;
					const updated = { ...cp, completed: value };
					return recalculateChallenge(updated, league);
				});
				return { ...prev, challenges };
			});
		},
		[league, updateProgress],
	);

	const updateSubtaskCounter = useCallback(
		(challengeId: number, subtaskId: string, value: number) => {
			const target = findSubtaskTarget(league, challengeId, subtaskId);
			if (target === undefined) return;

			const next = Math.min(target, Math.max(0, Math.trunc(value)));

			updateProgress((prev) => {
				const challenges = prev.challenges.map((cp) => {
					if (cp.challengeId !== challengeId) return cp;

					const subtasks = cp.subtasks.map((s) =>
						s.id === subtaskId
							? { ...s, counter: next, completed: next >= target }
							: s,
					);
					return recalculateChallenge({ ...cp, subtasks }, league);
				});
				return { ...prev, challenges };
			});
		},
		[league, updateProgress],
	);

	const importProgress = useCallback(
		(incoming: PlayerProgress) => {
			updateProgress((prev) => mergeProgress(prev, incoming));
		},
		[updateProgress],
	);

	const resetAll = useCallback(() => {
		const fresh = createDefaultProgress(league);
		setProgress(fresh);
		saveProgress(fresh);
		if (isLoggedIn) {
			fetch("/api/progress", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					leagueId: league.id,
					challengeData: fresh,
				}),
			}).catch(() => {});
		}
	}, [league, isLoggedIn]);

	const completedCount = progress.challenges.filter((c) => c.isComplete).length;

	const getProgress = useCallback(
		(challengeId: number): ChallengeProgress => {
			return (
				progress.challenges.find((c) => c.challengeId === challengeId) ?? {
					challengeId,
					completed: 0,
					isComplete: false,
					subtasks: [],
				}
			);
		},
		[progress],
	);

	return {
		progress,
		isLoaded,
		toggleSubtask,
		updateCounter,
		updateSubtaskCounter,
		importProgress,
		resetAll,
		completedCount,
		getProgress,
	};
}
