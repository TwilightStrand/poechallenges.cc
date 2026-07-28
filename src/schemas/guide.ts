import * as v from "valibot";

// ─── Layer 2: Guide Data ─────────────────────────────────
// Content layer maintained by guide authors.
// Extends challenge data with tips, difficulty, and categorization.
// Lives as markdown files with frontmatter, keyed by challenge ID.

const DifficultySchema = v.picklist([
	"very-easy",
	"easy",
	"normal",
	"hard",
	"very-hard",
]);

const CategorySchema = v.picklist([
	"early-game",
	"league-mechanics",
	"mapping",
	"crafting",
	"bossing",
	"endgame",
	"grind",
]);

const CalculatorBreakdownSchema = v.object({
	label: v.string(),
	divisor: v.pipe(v.number(), v.minValue(1)),
});

const ChallengeGuideSchema = v.object({
	challengeId: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(40)),
	difficulty: DifficultySchema,
	category: CategorySchema,
	estimatedHours: v.optional(v.pipe(v.number(), v.minValue(0))),
	tips: v.string(), // markdown content
	videoUrl: v.optional(v.pipe(v.string(), v.url())),
	calculator: v.optional(v.array(CalculatorBreakdownSchema)),
});

const LeagueGuideSchema = v.object({
	leagueId: v.string(),
	author: v.string(),
	lastUpdated: v.string(),
	overview: v.string(), // markdown: general league guide intro
	challenges: v.array(ChallengeGuideSchema),
});

export type CalculatorBreakdown = v.InferOutput<
	typeof CalculatorBreakdownSchema
>;
export type Difficulty = v.InferOutput<typeof DifficultySchema>;
export type Category = v.InferOutput<typeof CategorySchema>;
export type ChallengeGuide = v.InferOutput<typeof ChallengeGuideSchema>;
export type LeagueGuide = v.InferOutput<typeof LeagueGuideSchema>;

export {
	CalculatorBreakdownSchema,
	CategorySchema,
	ChallengeGuideSchema,
	DifficultySchema,
	LeagueGuideSchema,
};
