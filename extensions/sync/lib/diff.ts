import type { ChallengeData } from "./storage";

export function hasChanges(
	previous: ChallengeData | null,
	current: ChallengeData,
): boolean {
	if (!previous) return true;

	if (previous.challenges.length !== current.challenges.length) return true;

	for (let i = 0; i < current.challenges.length; i++) {
		const prev = previous.challenges[i];
		const curr = current.challenges[i];
		if (!prev || !curr) return true;

		if (prev.isComplete !== curr.isComplete) return true;
		if (prev.completed !== curr.completed) return true;

		if (prev.subtasks.length !== curr.subtasks.length) return true;

		for (let j = 0; j < curr.subtasks.length; j++) {
			const ps = prev.subtasks[j];
			const cs = curr.subtasks[j];
			if (!ps || !cs) return true;

			if (ps.completed !== cs.completed) return true;
			if (ps.counter !== cs.counter) return true;
		}
	}

	return false;
}
