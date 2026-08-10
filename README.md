# PoE Challenge Tracker

Track and plan your Path of Exile challenge completion. Shows challenge subtasks, progress counters, guide tips, and trade links for buyable items.

Live at [poechallenges.com](https://poechallenges.com).

## Quick start

```bash
docker compose up -d db          # Postgres on :5433
pnpm install
pnpm dev                         # Next.js on :3000
pnpm db:push                     # Create/update tables
```

## Stack

- Next.js 16 (Turbopack), React 19.2, TypeScript strict
- Tailwind CSS v4 with @theme (PoE dark/gold palette)
- Valibot schemas, Drizzle ORM (Postgres 17), Arctic + Oslo (auth)

## Project structure

```
src/data/leagues/{league}.ts     Challenge definitions, scraped from poedb.tw
src/data/guides/{league}.ts      Guide data as TypeScript (legacy format)
content/guides/{league}.md       Guide data as markdown (preferred format)
src/lib/trade-links.ts           PoE trade URL builder + item mappings
src/lib/price-lookup.ts          poe.ninja price fetcher + manual overrides
src/components/                  React components (ChallengeTracker is the main one)
src/db/schema.ts                 Drizzle tables (users, sessions, progress, snapshots)
```

Markdown guides override TypeScript guides for the same league, so a league can be migrated by adding the `.md` file and deleting the `.ts` file.

## Auth

GitHub OAuth is live. PoE OAuth is wired up but awaiting GGG approval.

Dev mode: `/api/auth/dev-login?account=Name` creates a fake session.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add leagues, write guides, and set up trade links.
