import { describe, expect, it } from "vitest";
import { hasChanges } from "../diff";
import type { ChallengeData } from "../storage";

function makeData(overrides?: Partial<ChallengeData>): ChallengeData {
	return {
		leagueId: "mirage",
		accountName: "test",
		challenges: [
			{
				challengeId: 1,
				completed: 2,
				isComplete: false,
				subtasks: [
					{ id: "1-1", completed: true },
					{ id: "1-2", completed: true },
					{ id: "1-3", completed: false },
				],
			},
			{
				challengeId: 2,
				completed: 0,
				isComplete: false,
				subtasks: [{ id: "2-1", completed: false, counter: 50 }],
			},
		],
		...overrides,
	};
}

describe("hasChanges", () => {
	it("returns true when previous is null", () => {
		expect(hasChanges(null, makeData())).toBe(true);
	});

	it("returns false for identical data", () => {
		const data = makeData();
		expect(hasChanges(data, makeData())).toBe(false);
	});

	it("detects isComplete flip", () => {
		const prev = makeData();
		const curr = makeData();
		curr.challenges[0]!.isComplete = true;
		expect(hasChanges(prev, curr)).toBe(true);
	});

	it("detects completed counter change", () => {
		const prev = makeData();
		const curr = makeData();
		curr.challenges[0]!.completed = 3;
		expect(hasChanges(prev, curr)).toBe(true);
	});

	it("detects subtask completion change", () => {
		const prev = makeData();
		const curr = makeData();
		curr.challenges[0]!.subtasks[2]!.completed = true;
		expect(hasChanges(prev, curr)).toBe(true);
	});

	it("detects subtask counter change", () => {
		const prev = makeData();
		const curr = makeData();
		curr.challenges[1]!.subtasks[0]!.counter = 75;
		expect(hasChanges(prev, curr)).toBe(true);
	});

	it("detects different challenge count", () => {
		const prev = makeData();
		const curr = makeData();
		curr.challenges.push({
			challengeId: 3,
			completed: 0,
			isComplete: false,
			subtasks: [],
		});
		expect(hasChanges(prev, curr)).toBe(true);
	});
});
