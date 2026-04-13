# PoE Challenge Tracker

## Quick Start
```bash
docker compose up -d db          # Postgres on :5433
npm run dev                      # Next.js on :3000
npm run db:push                  # Create/update tables
```

## Stack
- Next.js 16 (Turbopack), React 19.2, TypeScript strict
- Tailwind CSS v4 with @theme (PoE dark/gold colors in globals.css)
- Valibot schemas, Drizzle ORM (Postgres 17), Arctic + Oslo (auth)

## Architecture
3-layer schema: `src/schemas/challenge.ts` (game data) / `guide.ts` (author content) / `progress.ts` (per-user state)

League data: `src/data/leagues/{league}.ts` — scraped from poedb.tw
Guide data: `src/data/guides/{league}.ts` — tips, difficulty, category, calculator

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

## Adding a New League
1. Scrape from poedb.tw: `https://poedb.tw/us/{League}_challenges`
2. Create `src/data/leagues/{league}.ts` (follow mirage.ts format)
3. Create `src/data/guides/{league}.ts` (follow mirage.ts format)
4. Add to both index files

## CSS TODO
Planned refactor: move component-specific CSS from `globals.css` into
co-located `.module.css` files. Keep only theme tokens + body base +
scrollbar in globals.
