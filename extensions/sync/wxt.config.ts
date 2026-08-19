import { defineConfig } from "wxt";

export default defineConfig({
	manifestVersion: 3,
	suppressWarnings: { firefoxDataCollection: true },
	manifest: {
		version: "0.1.0",
		name: "PoE Challenge Sync",
		description:
			"Automatically sync Path of Exile challenge progress to the tracker",
		permissions: ["storage", "alarms", "tabs"],
		host_permissions: [
			"*://*.pathofexile.com/*",
			"https://poechallenges.com/*",
			"http://localhost:3000/*",
		],
		browser_specific_settings: {
			gecko: {
				id: "poe-challenge-sync@poechallenges.com",
			},
		},
	},
});
