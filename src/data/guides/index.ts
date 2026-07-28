import type { LeagueGuide } from "@/schemas";
import { allflameGuide } from "./allflame";
import { keepersGuide } from "./keepers";
import { mirageGuide } from "./mirage";

export const guides: Record<string, LeagueGuide> = {
  [allflameGuide.leagueId]: allflameGuide,
  [keepersGuide.leagueId]: keepersGuide,
  [mirageGuide.leagueId]: mirageGuide,
};
