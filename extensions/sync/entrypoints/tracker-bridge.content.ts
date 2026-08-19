import { sendMessage } from "@/lib/messages";

const STORAGE_PREFIX = "poe-progress-";

function readAndSendProgress() {
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (!key?.startsWith(STORAGE_PREFIX)) continue;

		const value = localStorage.getItem(key);
		if (!value) continue;

		sendMessage("trackerProgressChanged", {
			leagueId: key.slice(STORAGE_PREFIX.length),
			progress: value,
		});
	}
}

export default defineContentScript({
	matches: ["http://localhost:3000/*", "https://poechallenges.com/*"],
	runAt: "document_idle",
	main() {
		readAndSendProgress();

		window.addEventListener("storage", (event) => {
			if (event.key?.startsWith(STORAGE_PREFIX) && event.newValue) {
				sendMessage("trackerProgressChanged", {
					leagueId: event.key.slice(STORAGE_PREFIX.length),
					progress: event.newValue,
				});
			}
		});

		browser.runtime.onMessage.addListener(
			(message: { type?: string; data?: { leagueId: string; json: string } }) => {
				if (message.type === "writeTrackerProgress" && message.data) {
					const key = `${STORAGE_PREFIX}${message.data.leagueId}`;
					localStorage.setItem(key, message.data.json);

					window.dispatchEvent(
						new StorageEvent("storage", {
							key,
							newValue: message.data.json,
						}),
					);
				}
			},
		);
	},
});
