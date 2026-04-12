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
- `src/db/schema.ts` — Drizzle tables (users, oauth_accounts, sessions, progress, prices)

## Trade Links
Always use `status: { option: "securable" }` — instant buyout only. "online" has price fixers.

## Adding a New League
1. Scrape from poedb.tw: `https://poedb.tw/us/{League}_challenges`
2. Create `src/data/leagues/{league}.ts` (follow mirage.ts format)
3. Create `src/data/guides/{league}.ts` (follow mirage.ts format)
4. Add to both index files
