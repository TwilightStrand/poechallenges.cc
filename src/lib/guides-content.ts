import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import * as v from "valibot";
import {
	type ChallengeGuide,
	type League,
	type LeagueGuide,
	LeagueGuideSchema,
} from "@/schemas";

// Guide prose lives in content/guides/{leagueId}.md so it can be edited as
// markdown instead of as escaped strings inside TypeScript. Sections are keyed
// by challenge *name*, since that is what the in-game panel shows; the name is
// resolved to an id against the league data at build time, and anything that
// does not line up throws rather than silently dropping a tip.
const CONTENT_DIR = path.join(process.cwd(), "content", "guides");

interface ParsedSection {
	heading: string;
	meta: Record<string, string>;
	body: string;
}

function splitFrontmatter(raw: string) {
	const lines = raw.split("\n");

	if (lines[0]?.trim() !== "---") {
		return { meta: {} as Record<string, string>, rest: raw };
	}

	const end = lines.indexOf("---", 1);
	if (end === -1) throw new Error("unterminated frontmatter");

	const meta: Record<string, string> = {};
	for (const line of lines.slice(1, end)) {
		const at = line.indexOf(":");
		if (at === -1) continue;
		meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
	}

	return { meta, rest: lines.slice(end + 1).join("\n") };
}

// Leading `key: value` lines directly under a heading are metadata; everything
// after the first blank line is prose. Prose can therefore contain colons.
function splitSection(block: string): {
	meta: Record<string, string>;
	body: string;
} {
	const lines = block.split("\n");
	const meta: Record<string, string> = {};
	let i = 0;

	for (; i < lines.length; i++) {
		const line = lines[i]?.trim() ?? "";
		if (line === "") break;
		const match = /^([a-zA-Z]+):\s*(.+)$/.exec(line);
		if (!match?.[1] || !match[2]) break;
		meta[match[1]] = match[2].trim();
	}

	return { meta, body: lines.slice(i).join("\n").trim() };
}

function parseSections(body: string) {
	const parts = body.split(/^## /m);
	const overview = parts[0]?.trim() ?? "";
	const sections: ParsedSection[] = [];

	for (const part of parts.slice(1)) {
		const newline = part.indexOf("\n");
		const heading = (newline === -1 ? part : part.slice(0, newline)).trim();
		const { meta, body: text } = splitSection(
			newline === -1 ? "" : part.slice(newline + 1),
		);
		sections.push({ heading, meta, body: text });
	}

	return { overview, sections };
}

function parseCalculator(value: string) {
	return value.split(",").map((entry) => {
		const at = entry.lastIndexOf("=");
		if (at === -1)
			throw new Error(`calculator entry needs label=divisor: ${entry}`);
		const divisor = Number(entry.slice(at + 1).trim());
		if (!Number.isFinite(divisor)) {
			throw new Error(`calculator divisor is not a number: ${entry}`);
		}
		return { label: entry.slice(0, at).trim(), divisor };
	});
}

export function parseLeagueGuide(
	leagueId: string,
	league: League,
	raw: string,
) {
	const { meta, rest } = splitFrontmatter(raw);
	const { overview, sections } = parseSections(rest);

	const idByName = new Map(league.challenges.map((c) => [c.name, c.id]));
	const seen = new Set<number>();

	const challenges: ChallengeGuide[] = sections.map((section) => {
		const challengeId = idByName.get(section.heading);
		if (challengeId === undefined) {
			throw new Error(
				`${leagueId}.md: "## ${section.heading}" matches no challenge in ${league.name}`,
			);
		}
		if (seen.has(challengeId)) {
			throw new Error(`${leagueId}.md: "${section.heading}" appears twice`);
		}
		seen.add(challengeId);

		const { difficulty, category, calculator, videoUrl } = section.meta;
		if (!difficulty || !category) {
			throw new Error(
				`${leagueId}.md: "${section.heading}" needs difficulty and category`,
			);
		}

		return {
			challengeId,
			difficulty,
			category,
			tips: section.body,
			...(calculator ? { calculator: parseCalculator(calculator) } : {}),
			...(videoUrl ? { videoUrl } : {}),
		} as ChallengeGuide;
	});

	const missing = league.challenges
		.filter((c) => !seen.has(c.id))
		.map((c) => c.name);
	if (missing.length) {
		throw new Error(`${leagueId}.md: no section for ${missing.join(", ")}`);
	}

	const guide: LeagueGuide = {
		leagueId,
		author: meta.author ?? "PoEChallenges Community",
		lastUpdated: meta.lastUpdated ?? "",
		overview,
		challenges,
	};

	// The same schema the TypeScript guides are checked against, so a bad
	// difficulty or category in markdown fails the build too.
	return v.parse(LeagueGuideSchema, guide);
}

// Markdown guides win over any TypeScript guide for the same league, so a
// league can be migrated by adding its .md file and deleting its .ts file.
export function loadGuides(
	leagues: Record<string, League>,
	staticGuides: Record<string, LeagueGuide>,
): Record<string, LeagueGuide> {
	if (!existsSync(CONTENT_DIR)) return staticGuides;

	const fromMarkdown: Record<string, LeagueGuide> = {};

	for (const file of readdirSync(CONTENT_DIR)) {
		if (!file.endsWith(".md")) continue;

		const leagueId = file.replace(/\.md$/, "");
		const league = leagues[leagueId];
		if (!league) {
			throw new Error(`content/guides/${file} has no matching league`);
		}

		fromMarkdown[leagueId] = parseLeagueGuide(
			leagueId,
			league,
			readFileSync(path.join(CONTENT_DIR, file), "utf8"),
		);
	}

	return { ...staticGuides, ...fromMarkdown };
}
