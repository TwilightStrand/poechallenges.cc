import type { ChallengeData } from "./storage";

export interface SyncResult {
	success: boolean;
	message: string;
	imported?: number;
}

export async function syncToServer(
	trackerUrl: string,
	data: ChallengeData,
): Promise<SyncResult> {
	try {
		const response = await fetch(`${trackerUrl}/api/import`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				leagueId: data.leagueId,
				accountName: data.accountName,
				challenges: data.challenges,
			}),
		});

		if (response.ok) {
			const json = (await response.json()) as {
				ok?: boolean;
				imported?: number;
			};
			if (json.ok) {
				return {
					success: true,
					message: `Synced ${json.imported} challenges`,
					imported: json.imported,
				};
			}
		}

		if (response.status === 401) {
			return { success: false, message: "Not logged in to tracker" };
		}

		if (response.status === 429) {
			const retryAfter = response.headers.get("Retry-After");
			return {
				success: false,
				message: `Rate limited${retryAfter ? `, retry after ${retryAfter}s` : ""}`,
			};
		}

		return {
			success: false,
			message: `Server error (${response.status})`,
		};
	} catch (err) {
		return {
			success: false,
			message: err instanceof Error ? err.message : "Network error",
		};
	}
}
