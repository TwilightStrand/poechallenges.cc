import type { PlayerProgress } from "@/schemas";

export function mergeProgress(
	existing: PlayerProgress,
	incoming: PlayerProgress,
): PlayerProgress {
	// Incoming (from bookmarklet/scrape) is the source of truth
	// for completion status. We merge by taking the incoming state.
	return {
		leagueId: incoming.leagueId,
		accountName: incoming.accountName || existing.accountName,
		lastSynced: incoming.lastSynced,
		challenges: incoming.challenges.map((incomingChallenge) => {
			const existingChallenge = existing.challenges.find(
				(c) => c.challengeId === incomingChallenge.challengeId,
			);

			if (!existingChallenge) {
				return incomingChallenge;
			}

			return {
				...incomingChallenge,
				subtasks: incomingChallenge.subtasks.map((incomingSub) => {
					const existingSub = existingChallenge.subtasks.find(
						(s) => s.id === incomingSub.id,
					);
					// Take the more "complete" state
					if (existingSub && existingSub.completed && !incomingSub.completed) {
						return existingSub;
					}
					return incomingSub;
				}),
			};
		}),
	};
}
