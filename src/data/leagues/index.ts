import type { League } from "@/schemas";
import { afflictionLeague } from "./affliction";
import { keepersLeague } from "./keepers";
import { mirageLeague } from "./mirage";
import { necropolisLeague } from "./necropolis";
import { settlersLeague } from "./settlers";

export const leagues: Record<string, League> = {
  [afflictionLeague.id]: afflictionLeague,
  [keepersLeague.id]: keepersLeague,
  [mirageLeague.id]: mirageLeague,
  [necropolisLeague.id]: necropolisLeague,
  [settlersLeague.id]: settlersLeague,
};

export const defaultLeagueId = mirageLeague.id;
