import type { LeagueGuide } from "@/schemas";
import { keepersGuide } from "./keepers";
import { mirageGuide } from "./mirage";

export const guides: Record<string, LeagueGuide> = {
  [keepersGuide.leagueId]: keepersGuide,
  [mirageGuide.leagueId]: mirageGuide,
};
