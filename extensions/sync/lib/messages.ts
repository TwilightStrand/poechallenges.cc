import { defineExtensionMessaging } from "@webext-core/messaging";
import type { ChallengeData } from "./storage";

export type ParseStatus =
	| "ok"
	| "cloudflare"
	| "not-authenticated"
	| "private-profile";

export interface ParseResult {
	status: ParseStatus;
	data?: ChallengeData;
}

export interface TrackerProgressMessage {
	leagueId: string;
	progress: string;
}

interface ProtocolMap {
	challengesParsed(data: ParseResult): void;
	trackerProgressChanged(data: TrackerProgressMessage): void;
	writeTrackerProgress(data: { leagueId: string; json: string }): void;
	triggerSync(): { success: boolean; message: string };
}

export const { sendMessage, onMessage } =
	defineExtensionMessaging<ProtocolMap>();
