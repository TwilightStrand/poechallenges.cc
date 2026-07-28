import {
	index,
	integer,
	jsonb,
	numeric,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	displayName: text("display_name").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	lastLoginAt: timestamp("last_login_at"),
});

export const oauthAccounts = pgTable(
	"oauth_accounts",
	{
		provider: text("provider").notNull(), // "github" | "pathofexile"
		providerAccountId: text("provider_account_id").notNull(),
		userId: integer("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.provider, table.providerAccountId] }),
	],
);

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(), // SHA-256 hash of session token
	userId: integer("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	expiresAt: timestamp("expires_at").notNull(),
});

export const userProgress = pgTable(
	"user_progress",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		leagueId: text("league_id").notNull(),
		challengeData: jsonb("challenge_data").notNull(),
		lastSynced: timestamp("last_synced"),
	},
	(table) => [
		uniqueIndex("user_progress_user_league_idx").on(
			table.userId,
			table.leagueId,
		),
	],
);

// Historical snapshots — append-only log of all progress states.
// Enables future features: progress graphs, "completed on X" timestamps,
// counter-over-time charts (e.g. Tyrannical Tiers), stats/streaks, etc.
// Not queried by the UI yet — data capture only.
export const progressSnapshots = pgTable(
	"progress_snapshots",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		leagueId: text("league_id").notNull(),
		challengeData: jsonb("challenge_data").notNull(),
		completedCount: integer("completed_count").notNull(),
		source: text("source").notNull(), // "import" | "manual" | "reset"
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("progress_snapshots_timeline_idx").on(
			table.userId,
			table.leagueId,
			table.createdAt,
		),
	],
);

export const reportedPrices = pgTable(
	"reported_prices",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		leagueId: text("league_id").notNull(),
		itemName: text("item_name").notNull(),
		priceChaos: numeric("price_chaos").notNull(),
		quantity: integer("quantity").notNull().default(1),
		reportedAt: timestamp("reported_at").defaultNow().notNull(),
	},
	(table) => [
		index("reported_prices_lookup_idx").on(
			table.leagueId,
			table.itemName,
			table.reportedAt,
		),
	],
);
