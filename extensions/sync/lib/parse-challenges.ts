import type { ChallengeData, ChallengeEntry, SubtaskData } from "./storage";
import type { ParseResult } from "./messages";

function detectCloudflare(doc: Document): boolean {
	return !!(
		doc.getElementById("challenge-running") ||
		doc.getElementById("challenge-form") ||
		doc.querySelector(".cf-turnstile") ||
		doc.querySelector("[id^='cf-chl-widget']")
	);
}

function detectBlocker(doc: Document): ParseResult {
	const bodyText = doc.body?.textContent ?? "";

	if (
		bodyText.includes("This profile tab has been set to private") ||
		bodyText.includes("private profile")
	) {
		return { status: "private-profile" };
	}

	return { status: "not-authenticated" };
}

function parseSubtasks(
	el: Element,
	challengeIndex: number,
): SubtaskData[] {
	const subtasks: SubtaskData[] = [];
	el.querySelectorAll(".items li").forEach((li, si) => {
		const isFinished = li.classList.contains("finished");
		const text = li.textContent?.trim() ?? "";
		const counterMatch = text.match(/\((\d[\d,]*)\/(\d[\d,]*)\)\s*$/);
		subtasks.push({
			id: `${challengeIndex + 1}-${si + 1}`,
			completed: isFinished,
			counter: counterMatch
				? Number.parseInt(counterMatch[1]!.replace(/,/g, ""), 10)
				: undefined,
		});
	});
	return subtasks;
}

function parseChallengeElements(els: NodeListOf<Element>): ChallengeEntry[] {
	return Array.from(els).map((el, index) => {
		const isIncomplete = el.classList.contains("incomplete");
		const detailEl = el.querySelector(".completion-detail");
		const detailSpan = detailEl?.querySelector("span");
		const completed = detailSpan
			? Number.parseInt(detailSpan.textContent?.trim() ?? "0", 10) || 0
			: 0;

		return {
			challengeId: index + 1,
			completed,
			isComplete: !isIncomplete,
			subtasks: parseSubtasks(el, index),
		};
	});
}

export function parseChallenges(doc: Document, url: string): ParseResult {
	if (detectCloudflare(doc)) {
		return { status: "cloudflare" };
	}

	const els = doc.querySelectorAll(".achievement.clearfix");
	if (!els.length) {
		return detectBlocker(doc);
	}

	const seasonSel = doc.querySelector<HTMLSelectElement>(
		'select[name="season"]',
	);
	const leagueId = seasonSel?.value.toLowerCase() ?? "unknown";

	const urlMatch = url.match(/\/view-profile\/([^/]+)/);
	const accountName = urlMatch ? decodeURIComponent(urlMatch[1]!) : "";

	const challenges = parseChallengeElements(els);

	return {
		status: "ok",
		data: { leagueId, accountName, challenges },
	};
}
