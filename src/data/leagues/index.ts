import type { League } from "@/schemas";
import { afflictionLeague } from "./affliction";
import { allflameLeague } from "./allflame";
import { keepersLeague } from "./keepers";
import { mirageLeague } from "./mirage";
import { necropolisLeague } from "./necropolis";
import { settlersLeague } from "./settlers";

export const leagues: Record<string, League> = {
	[afflictionLeague.id]: afflictionLeague,
	[allflameLeague.id]: allflameLeague,
	[keepersLeague.id]: keepersLeague,
	[mirageLeague.id]: mirageLeague,
	[necropolisLeague.id]: necropolisLeague,
	[settlersLeague.id]: settlersLeague,
};

export const defaultLeagueId = allflameLeague.id;
