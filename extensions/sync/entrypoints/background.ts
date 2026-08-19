import { hasChanges } from "@/lib/diff";
import { onMessage } from "@/lib/messages";
import type { ParseResult } from "@/lib/messages";
import {
	accountName,
	lastChallengeData,
	lastSync,
	lastSyncStatus,
	syncIntervalMinutes,
	trackerUrl,
} from "@/lib/storage";
import { syncToServer } from "@/lib/sync";

const ALARM_NAME = "poe-sync";
const TAB_TIMEOUT_MS = 30_000;

let pendingTabId: number | null = null;
let tabTimeoutId: ReturnType<typeof setTimeout> | null = null;

async function createSyncAlarm() {
	const minutes = await syncIntervalMinutes.getValue();
	await browser.alarms.clear(ALARM_NAME);
	await browser.alarms.create(ALARM_NAME, { periodInMinutes: minutes });
}

async function closePendingTab() {
	if (tabTimeoutId !== null) {
		clearTimeout(tabTimeoutId);
		tabTimeoutId = null;
	}
	if (pendingTabId !== null) {
		try {
			await browser.tabs.remove(pendingTabId);
		} catch {
			// tab already closed
		}
		pendingTabId = null;
	}
}

function setBadge(text: string, color: string) {
	browser.action.setBadgeText({ text });
	browser.action.setBadgeBackgroundColor({ color });
}

function clearBadge() {
	browser.action.setBadgeText({ text: "" });
}

async function performSync(): Promise<{ success: boolean; message: string }> {
	const name = await accountName.getValue();
	if (!name) {
		setBadge("?", "#d48a2c");
		return { success: false, message: "No account name configured" };
	}

	const url = `https://www.pathofexile.com/account/view-profile/${encodeURIComponent(name)}/challenges`;

	await closePendingTab();

	try {
		const tab = await browser.tabs.create({ active: false, url });
		pendingTabId = tab.id ?? null;

		tabTimeoutId = setTimeout(async () => {
			await closePendingTab();
			await lastSyncStatus.setValue("error");
			setBadge("!", "#c03030");
		}, TAB_TIMEOUT_MS);

		return { success: true, message: "Sync started" };
	} catch (err) {
		await lastSyncStatus.setValue("error");
		setBadge("!", "#c03030");
		return {
			success: false,
			message: err instanceof Error ? err.message : "Failed to open tab",
		};
	}
}

async function handleParseResult(result: ParseResult) {
	await closePendingTab();

	if (result.status === "cloudflare") {
		await lastSyncStatus.setValue("cloudflare");
		setBadge("CF", "#d48a2c");
		return;
	}

	if (result.status === "not-authenticated") {
		await lastSyncStatus.setValue("not-authenticated");
		setBadge("!", "#d48a2c");
		return;
	}

	if (result.status === "private-profile") {
		await lastSyncStatus.setValue("private-profile");
		setBadge("!", "#d48a2c");
		return;
	}

	if (!result.data) return;

	// Auto-detect account name from parsed data
	if (result.data.accountName) {
		await accountName.setValue(result.data.accountName);
	}

	const previous = await lastChallengeData.getValue();
	const changed = hasChanges(previous, result.data);

	if (!changed) {
		await lastSync.setValue(new Date().toISOString());
		await lastSyncStatus.setValue("no-changes");
		clearBadge();
		return;
	}

	const url = await trackerUrl.getValue();
	const syncResult = await syncToServer(url, result.data);

	if (syncResult.success) {
		await lastChallengeData.setValue(result.data);
		await lastSync.setValue(new Date().toISOString());
		await lastSyncStatus.setValue("ok");
		clearBadge();
		await writeToTrackerTabs(result.data);
	} else {
		await lastSyncStatus.setValue("error");
		setBadge("!", "#c03030");
	}
}

async function writeToTrackerTabs(data: import("@/lib/storage").ChallengeData) {
	const url = await trackerUrl.getValue();
	const patterns = ["http://localhost:3000/*"];
	try {
		const parsed = new URL(url);
		patterns.push(`${parsed.origin}/*`);
	} catch {
		// invalid URL, skip
	}

	const tabs = await browser.tabs.query({ url: patterns });
	const json = JSON.stringify({
		leagueId: data.leagueId,
		accountName: data.accountName,
		challenges: data.challenges,
		lastSynced: new Date().toISOString(),
	});

	for (const tab of tabs) {
		if (tab.id) {
			browser.tabs
				.sendMessage(tab.id, {
					type: "writeTrackerProgress",
					data: { leagueId: data.leagueId, json },
				})
				.catch(() => {
					// tab may not have the content script loaded
				});
		}
	}
}

export default defineBackground({
	main() {
		createSyncAlarm();

		syncIntervalMinutes.watch(() => {
			createSyncAlarm();
		});

		onMessage("challengesParsed", ({ data }) => {
			handleParseResult(data);
		});

		onMessage("trackerProgressChanged", async ({ data }) => {
			try {
				const parsed = JSON.parse(data.progress) as import("@/lib/storage").ChallengeData;
				await lastChallengeData.setValue(parsed);
			} catch {
				// invalid JSON, ignore
			}
		});

		onMessage("triggerSync", async () => {
			return performSync();
		});

		browser.alarms.onAlarm.addListener((alarm) => {
			if (alarm.name === ALARM_NAME) {
				performSync();
			}
		});

		browser.runtime.onInstalled.addListener(() => {
			performSync();
		});
	},
});
