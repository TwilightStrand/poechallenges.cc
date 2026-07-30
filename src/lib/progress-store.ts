import * as v from "valibot";
import {
	type ChallengeProgress,
	type League,
	type PlayerProgress,
	PlayerProgressSchema,
} from "@/schemas";

const STORAGE_KEY_PREFIX = "poe-progress-";

function storageKey(leagueId: string): string {
	return `${STORAGE_KEY_PREFIX}${leagueId}`;
}

export function createDefaultProgress(
	league: League,
	accountName = "",
): PlayerProgress {
	return {
		leagueId: league.id,
		accountName,
		challenges: league.challenges.map((c) => ({
			challengeId: c.id,
			completed: 0,
			isComplete: false,
			subtasks: c.subtasks.map((s) => ({
				id: s.id,
				completed: false,
			})),
		})),
	};
}

export function loadProgress(league: League): PlayerProgress {
	if (typeof window === "undefined") {
		return createDefaultProgress(league);
	}

	const raw = localStorage.getItem(storageKey(league.id));
	if (!raw) {
		return createDefaultProgress(league);
	}

	try {
		const parsed = JSON.parse(raw);
		const result = v.safeParse(PlayerProgressSchema, parsed);
		if (result.success) {
			return result.output;
		}
	} catch {
		// Corrupted data — fall through to default
	}

	return createDefaultProgress(league);
}

export function saveProgress(progress: PlayerProgress): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(storageKey(progress.leagueId), JSON.stringify(progress));
}

export function resetProgress(league: League): PlayerProgress {
	const fresh = createDefaultProgress(league);
	saveProgress(fresh);
	return fresh;
}

export function recalculateChallenge(
	challengeProgress: ChallengeProgress,
	league: League,
): ChallengeProgress {
	const challengeDef = league.challenges.find(
		(c) => c.id === challengeProgress.challengeId,
	);
	if (!challengeDef) return challengeProgress;

	let completedCount: number;

	if (challengeDef.type === "counter") {
		// Counters are edited directly, so the bounds are enforced here rather
		// than at every call site.
		completedCount = Math.min(
			challengeDef.required,
			Math.max(0, Math.trunc(challengeProgress.completed)),
		);
	} else {
		completedCount = challengeProgress.subtasks.filter(
			(s) => s.completed,
		).length;
	}

	return {
		...challengeProgress,
		completed: completedCount,
		isComplete: completedCount >= challengeDef.required,
	};
}
