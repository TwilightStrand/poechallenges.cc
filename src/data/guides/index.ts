import type { LeagueGuide } from "@/schemas";
import { keepersGuide } from "./keepers";
import { mirageGuide } from "./mirage";

// Allflame lives in content/guides/allflame.md; these two are still TypeScript.
// Adding a markdown file for a league overrides whatever is listed here.
export const guides: Record<string, LeagueGuide> = {
	[keepersGuide.leagueId]: keepersGuide,
	[mirageGuide.leagueId]: mirageGuide,
};
