import * as v from "valibot";

// ─── Layer 1: Challenge Data ─────────────────────────────
// Pure game data. Could be auto-scraped from poedb or PoE website.
// Describes WHAT the challenges are, not how to complete them.

const SubtaskSchema = v.object({
	id: v.string(),
	name: v.string(),
	counterTarget: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
});

const ChallengeTypeSchema = v.picklist(["all", "pick", "counter"]);

const ChallengeSchema = v.object({
	id: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(40)),
	name: v.pipe(v.string(), v.minLength(1)),
	description: v.string(),
	type: ChallengeTypeSchema,
	required: v.pipe(v.number(), v.integer(), v.minValue(1)),
	subtasks: v.array(SubtaskSchema),
});

const RewardSchema = v.object({
	at: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(40)),
	reward: v.string(),
	type: v.picklist(["armor", "trophy"]),
});

const LeagueSchema = v.object({
	id: v.string(),
	name: v.string(),
	// poe.ninja's league name, which is often the short form ("Allflame" for
	// "Curse of the Allflame") and is case-sensitive. Only needed when it
	// differs from name; trade links always use name, since GGG wants the full
	// one. Omit and callers fall back to name.
	ninjaLeague: v.optional(v.string()),
	version: v.string(),
	startDate: v.string(),
	rewards: v.array(RewardSchema),
	challenges: v.pipe(v.array(ChallengeSchema), v.length(40)),
});

export type Subtask = v.InferOutput<typeof SubtaskSchema>;
export type ChallengeType = v.InferOutput<typeof ChallengeTypeSchema>;
export type Challenge = v.InferOutput<typeof ChallengeSchema>;
export type Reward = v.InferOutput<typeof RewardSchema>;
export type League = v.InferOutput<typeof LeagueSchema>;

export {
	ChallengeSchema,
	ChallengeTypeSchema,
	LeagueSchema,
	RewardSchema,
	SubtaskSchema,
};
