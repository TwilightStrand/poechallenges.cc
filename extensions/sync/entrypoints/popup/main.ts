import { sendMessage } from "@/lib/messages";
import {
	accountName,
	lastSync,
	lastSyncStatus,
	syncIntervalMinutes,
	trackerUrl,
	type SyncStatus,
} from "@/lib/storage";

const setupPrompt = document.getElementById("setup-prompt") as HTMLDivElement;
const mainPanel = document.getElementById("main-panel") as HTMLDivElement;
const accountDisplay = document.getElementById("account-display") as HTMLSpanElement;
const intervalSelect = document.getElementById("sync-interval") as HTMLSelectElement;
const trackerInput = document.getElementById("tracker-url") as HTMLInputElement;
const syncBtn = document.getElementById("sync-btn") as HTMLButtonElement;
const statusDot = document.getElementById("status-dot") as HTMLDivElement;
const statusText = document.getElementById("status-text") as HTMLSpanElement;
const advancedToggle = document.getElementById("advanced-toggle") as HTMLButtonElement;
const advancedSection = document.getElementById("advanced-section") as HTMLDivElement;
const challengesLink = document.getElementById("challenges-link") as HTMLAnchorElement;

function formatRelativeTime(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime();
	const minutes = Math.floor(diff / 60_000);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}

function statusLabel(status: SyncStatus): string {
	const labels: Record<SyncStatus, string> = {
		ok: "Synced",
		"no-changes": "No changes",
		cloudflare: "Blocked by Cloudflare",
		"not-authenticated": "Not logged in to PoE",
		"private-profile": "Profile is private",
		error: "Sync failed",
	};
	return labels[status];
}

function statusDotClass(status: SyncStatus): string {
	if (status === "ok" || status === "no-changes") return "ok";
	if (status === "cloudflare" || status === "not-authenticated" || status === "private-profile") return "warning";
	return "error";
}

async function updateStatus() {
	const status = await lastSyncStatus.getValue();
	const syncTime = await lastSync.getValue();

	statusDot.className = `status-dot ${statusDotClass(status)}`;

	if (syncTime) {
		statusText.textContent = `${statusLabel(status)} · ${formatRelativeTime(syncTime)}`;
	} else {
		statusText.textContent = statusLabel(status);
	}
}

async function showCorrectPanel() {
	const name = await accountName.getValue();
	if (name) {
		setupPrompt.hidden = true;
		mainPanel.hidden = false;
		accountDisplay.textContent = name;
		challengesLink.href = `https://www.pathofexile.com/account/view-profile/${encodeURIComponent(name)}/challenges`;
	} else {
		setupPrompt.hidden = false;
		mainPanel.hidden = true;
	}
}

async function init() {
	await showCorrectPanel();
	intervalSelect.value = String(await syncIntervalMinutes.getValue());
	trackerInput.value = await trackerUrl.getValue();
	await updateStatus();
}

intervalSelect.addEventListener("change", async () => {
	await syncIntervalMinutes.setValue(Number(intervalSelect.value));
});

trackerInput.addEventListener("blur", async () => {
	await trackerUrl.setValue(trackerInput.value.trim());
});

syncBtn.addEventListener("click", async () => {
	syncBtn.disabled = true;
	syncBtn.textContent = "Syncing...";
	try {
		const result = await sendMessage("triggerSync", undefined);
		statusText.textContent = result.message;
		setTimeout(updateStatus, 3000);
	} catch {
		statusText.textContent = "Failed to trigger sync";
	} finally {
		syncBtn.disabled = false;
		syncBtn.textContent = "Sync Now";
	}
});

advancedToggle.addEventListener("click", () => {
	const isOpen = advancedSection.classList.toggle("open");
	advancedToggle.innerHTML = isOpen ? "&#9660; Advanced" : "&#9654; Advanced";
});

// Reactively switch panels when account name is detected
accountName.watch(() => showCorrectPanel());
lastSyncStatus.watch(() => updateStatus());
lastSync.watch(() => updateStatus());

init();
