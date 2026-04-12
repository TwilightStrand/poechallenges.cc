import * as v from "valibot";

// ─── Layer 3: Player Progress ────────────────────────────
// Per-user state. Imported via bookmarklet, scraped, or manually toggled.
// Stored in localStorage (anonymous) or server-side (authenticated).

const SubtaskProgressSchema = v.object({
  id: v.string(),
  completed: v.boolean(),
  counter: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
});

const ChallengeProgressSchema = v.object({
  challengeId: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(40)),
  completed: v.pipe(v.number(), v.integer(), v.minValue(0)),
  isComplete: v.boolean(),
  subtasks: v.array(SubtaskProgressSchema),
});

const PlayerProgressSchema = v.object({
  leagueId: v.string(),
  accountName: v.string(),
  challenges: v.array(ChallengeProgressSchema),
  lastSynced: v.optional(v.string()),
});

export type SubtaskProgress = v.InferOutput<typeof SubtaskProgressSchema>;
export type ChallengeProgress = v.InferOutput<typeof ChallengeProgressSchema>;
export type PlayerProgress = v.InferOutput<typeof PlayerProgressSchema>;

export {
  SubtaskProgressSchema,
  ChallengeProgressSchema,
  PlayerProgressSchema,
};
