import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { parseChallenges } from "../parse-challenges";

function loadFixture(name: string): Document {
	const html = readFileSync(
		resolve(__dirname, `fixtures/${name}.html`),
		"utf-8",
	);
	return new JSDOM(html).window.document;
}

const PROFILE_URL =
	"https://www.pathofexile.com/account/view-profile/All4n-5316/challenges";

describe("parseChallenges", () => {
	it("parses challenges from a valid page", () => {
		const doc = loadFixture("challenges-ok");
		const result = parseChallenges(doc, PROFILE_URL);

		expect(result.status).toBe("ok");
		expect(result.data).toBeDefined();
		expect(result.data!.leagueId).toBe("mirage");
		expect(result.data!.accountName).toBe("All4n-5316");
		expect(result.data!.challenges).toHaveLength(3);
	});

	it("parses challenge completion state", () => {
		const doc = loadFixture("challenges-ok");
		const result = parseChallenges(doc, PROFILE_URL);
		const challenges = result.data!.challenges;

		expect(challenges[0]!.challengeId).toBe(1);
		expect(challenges[0]!.isComplete).toBe(true);
		expect(challenges[0]!.completed).toBe(3);

		expect(challenges[1]!.challengeId).toBe(2);
		expect(challenges[1]!.isComplete).toBe(false);
		expect(challenges[1]!.completed).toBe(0);
	});

	it("parses subtasks with finished state", () => {
		const doc = loadFixture("challenges-ok");
		const result = parseChallenges(doc, PROFILE_URL);
		const subtasks = result.data!.challenges[0]!.subtasks;

		expect(subtasks).toHaveLength(4);
		expect(subtasks[0]).toEqual({ id: "1-1", completed: true, counter: undefined });
		expect(subtasks[3]).toEqual({ id: "1-4", completed: false, counter: undefined });
	});

	it("parses counter values from subtask text", () => {
		const doc = loadFixture("challenges-ok");
		const result = parseChallenges(doc, PROFILE_URL);
		const subtasks = result.data!.challenges[2]!.subtasks;

		expect(subtasks[0]!.counter).toBe(1234);
		expect(subtasks[1]!.counter).toBe(50);
	});

	it("extracts account name from URL", () => {
		const doc = loadFixture("challenges-ok");
		const result = parseChallenges(
			doc,
			"https://www.pathofexile.com/account/view-profile/Test%20User/challenges",
		);
		expect(result.data!.accountName).toBe("Test User");
	});

	it("detects Cloudflare challenge gate", () => {
		const doc = loadFixture("challenges-cloudflare");
		const result = parseChallenges(doc, PROFILE_URL);
		expect(result.status).toBe("cloudflare");
		expect(result.data).toBeUndefined();
	});

	it("detects private profile", () => {
		const doc = loadFixture("challenges-private");
		const result = parseChallenges(doc, PROFILE_URL);
		expect(result.status).toBe("private-profile");
	});

	it("detects not authenticated", () => {
		const doc = loadFixture("challenges-not-auth");
		const result = parseChallenges(doc, PROFILE_URL);
		expect(result.status).toBe("not-authenticated");
	});
});
