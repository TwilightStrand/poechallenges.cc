# PoE Challenge Tracker

See [README.md](README.md) for project overview and [CONTRIBUTING.md](CONTRIBUTING.md) for guide format, trade links, and adding new leagues.

## Quick Start
```bash
docker compose up -d db          # Postgres on :5433
pnpm dev                         # Next.js on :3000
pnpm db:push                     # Create/update tables
```

## Package manager
Uses **pnpm**. `pnpm-workspace.yaml` sets `minimumReleaseAge: 2880` (2 days)
so newly-published versions aren't installed until they've had time to be
scrutinized — a mitigation against supply-chain compromise. Existing
`pnpm-lock.yaml` pins are always honored regardless of the setting.

## Stack
- Next.js 16 (Turbopack), React 19.2, TypeScript strict
- Tailwind CSS v4 with @theme (PoE dark/gold colors in globals.css)
- Valibot schemas, Drizzle ORM (Postgres 17), Arctic + Oslo (auth)

## Architecture
3-layer schema: `src/schemas/challenge.ts` (game data) / `guide.ts` (author content) / `progress.ts` (per-user state)

League data: `src/data/leagues/{league}.ts` — scraped from poedb.tw
Guide data: `src/data/guides/{league}.ts` (TypeScript) or `content/guides/{league}.md` (markdown). Markdown overrides TypeScript for the same league.

## Key Files
- `src/components/ChallengeTracker.tsx` — main orchestrator (client component)
- `src/lib/auth.ts` — Arctic OAuth clients + Oslo session helpers
- `src/lib/price-lookup.ts` — poe.ninja prices + manual overrides
- `src/lib/trade-links.ts` — PoE trade URLs (uses "securable" for instant buyout)
- `src/db/schema.ts` — Drizzle tables (users, oauth_accounts, sessions, user_progress, progress_snapshots, reported_prices)

## Trade Links
Always use `status: { option: "securable" }` — instant buyout only. "online" has price fixers.

## Progress History
`progress_snapshots` table captures full state on every save (debounced 300ms).
Source: `"manual"` (app toggle) or `"import"` (bookmarklet sync). No UI yet.
Resolution for graphs = user's sync frequency.

## Auth
GitHub OAuth works now. PoE OAuth wired up, needs GGG approval.
Env: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI`.
Dev mode: `/api/auth/dev-login?account=Name` creates a fake session.

## Writing Guides
Do not rely on LLMs for PoE game knowledge when writing guide content. LLMs have outdated information about game mechanics, items, and challenge specifics. Use them for simple lookups (wiki queries, formatting) but the actual guide tips must come from current player knowledge, poedb.tw, or the wiki. Wrong tips are worse than no tips.
