import { count, countDistinct, gte, sql } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { leagues } from "@/data/leagues";
import { getDb } from "@/db";
import {
	progressSnapshots,
	reportedPrices,
	userProgress,
	users,
} from "@/db/schema";

export const metadata: Metadata = {
	title: "Stats · PoE Challenge Tracker",
	description: "How many people track their challenges on poechallenges.cc",
};

// The build has no database, so this can't be prerendered.
export const dynamic = "force-dynamic";

interface Stats {
	accounts: number;
	newLast30Days: number;
	activeLast30Days: number;
	imports: number;
	manualSaves: number;
	priceReports: number;
	perLeague: { leagueId: string; trackers: number }[];
}

// The page is public, so every visit would otherwise run seven counts against
// Postgres. Ten minutes stale is fine for numbers like these.
const CACHE_MS = 10 * 60 * 1000;
let cached: { at: number; stats: Promise<Stats> } | undefined;

function getStats(): Promise<Stats> {
	if (cached && Date.now() - cached.at < CACHE_MS) return cached.stats;
	const stats = queryStats();
	cached = { at: Date.now(), stats };
	// Don't pin a failed query for ten minutes.
	stats.catch(() => {
		cached = undefined;
	});
	return stats;
}

async function queryStats(): Promise<Stats> {
	const db = getDb();
	const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

	const [accounts, newAccounts, active, sources, prices, perLeague] =
		await Promise.all([
			db.select({ n: count() }).from(users),
			db.select({ n: count() }).from(users).where(gte(users.createdAt, since)),
			db
				.select({ n: countDistinct(progressSnapshots.userId) })
				.from(progressSnapshots)
				.where(gte(progressSnapshots.createdAt, since)),
			db
				.select({ source: progressSnapshots.source, n: count() })
				.from(progressSnapshots)
				.groupBy(progressSnapshots.source),
			db.select({ n: count() }).from(reportedPrices),
			db
				.select({ leagueId: userProgress.leagueId, n: count() })
				.from(userProgress)
				.groupBy(userProgress.leagueId)
				.orderBy(sql`count(*) desc`),
		]);

	const bySource = (name: string) =>
		sources.find((s) => s.source === name)?.n ?? 0;

	return {
		accounts: accounts[0]?.n ?? 0,
		newLast30Days: newAccounts[0]?.n ?? 0,
		activeLast30Days: active[0]?.n ?? 0,
		imports: bySource("import"),
		manualSaves: bySource("manual"),
		priceReports: prices[0]?.n ?? 0,
		perLeague: perLeague.map((row) => ({
			leagueId: row.leagueId,
			trackers: row.n,
		})),
	};
}

function Stat({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded border border-poe-border bg-poe-bg-card px-4 py-3">
			<div className="font-heading text-2xl text-poe-gold-bright">
				{value.toLocaleString("en-US")}
			</div>
			<div className="text-poe-text-dim text-sm">{label}</div>
		</div>
	);
}

export default async function StatsPage() {
	let stats: Stats | null = null;
	try {
		stats = await getStats();
	} catch {
		stats = null;
	}

	return (
		<main className="mx-auto max-w-4xl px-4 py-8 text-poe-text">
			<Link
				href="/"
				className="text-poe-gold text-sm transition-colors hover:text-poe-gold-bright"
			>
				&larr; Back to the tracker
			</Link>
			<h1 className="mt-4 font-heading text-3xl text-poe-gold-light">Stats</h1>
			<p className="mt-2 text-poe-text-dim text-sm">
				Counts of signed-in accounts only. Progress kept in your browser never
				reaches the server, and the site has no analytics, so anyone who
				doesn&apos;t log in isn&apos;t counted here. Updated every 10 minutes.
			</p>

			{stats ? (
				<>
					<div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
						<Stat label="Accounts" value={stats.accounts} />
						<Stat label="New in the last 30 days" value={stats.newLast30Days} />
						<Stat
							label="Saved progress in the last 30 days"
							value={stats.activeLast30Days}
						/>
						<Stat label="Bookmarklet imports" value={stats.imports} />
						<Stat label="Progress changes saved" value={stats.manualSaves} />
						<Stat label="Price reports" value={stats.priceReports} />
					</div>

					<h2 className="mt-8 font-heading text-poe-gold-light text-xl">
						Accounts tracking each league
					</h2>
					{stats.perLeague.length === 0 ? (
						<p className="mt-2 text-poe-text-dim text-sm">None yet.</p>
					) : (
						<ul className="mt-3 divide-y divide-poe-border-subtle rounded border border-poe-border bg-poe-bg-card">
							{stats.perLeague.map((row) => (
								<li
									key={row.leagueId}
									className="flex justify-between px-4 py-2 text-sm"
								>
									<span>{leagues[row.leagueId]?.name ?? row.leagueId}</span>
									<span className="text-poe-gold-bright">
										{row.trackers.toLocaleString("en-US")}
									</span>
								</li>
							))}
						</ul>
					)}
				</>
			) : (
				<p className="mt-6 text-poe-text-dim">
					Stats are unavailable right now.
				</p>
			)}
		</main>
	);
}
