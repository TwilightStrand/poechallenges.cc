import { storage } from "wxt/utils/storage";

export interface SubtaskData {
	id: string;
	completed: boolean;
	counter?: number;
}

export interface ChallengeEntry {
	challengeId: number;
	completed: number;
	isComplete: boolean;
	subtasks: SubtaskData[];
}

export interface ChallengeData {
	leagueId: string;
	accountName: string;
	challenges: ChallengeEntry[];
}

export type SyncStatus =
	| "ok"
	| "cloudflare"
	| "not-authenticated"
	| "private-profile"
	| "no-changes"
	| "error";

export const accountName = storage.defineItem<string>("local:accountName", {
	fallback: "",
});

export const trackerUrl = storage.defineItem<string>("local:trackerUrl", {
	fallback: "https://poechallenges.com",
});

export const syncIntervalMinutes = storage.defineItem<number>(
	"local:syncIntervalMinutes",
	{ fallback: 15 },
);

export const lastSync = storage.defineItem<string | null>("local:lastSync", {
	fallback: null,
});

export const lastSyncStatus = storage.defineItem<SyncStatus>(
	"local:lastSyncStatus",
	{ fallback: "ok" },
);

export const lastChallengeData = storage.defineItem<ChallengeData | null>(
	"local:lastChallengeData",
	{ fallback: null },
);
