# Contributing

## Adding a new league

1. **Scrape challenge data** from `https://poedb.tw/us/{League}_challenges`
2. **Create league file** at `src/data/leagues/{league}.ts` (follow `mirage.ts` format)
3. **Create guide file** at `content/guides/{league}.md` (follow `allflame.md` format). The older TypeScript format (`src/data/guides/{league}.ts`) also works but markdown is preferred for new leagues.
4. **Register the league** in `src/data/leagues/index.ts`. TypeScript guides also need an entry in `src/data/guides/index.ts`; markdown guides are picked up automatically from the `content/guides/` directory.

## Guide format (markdown)

Guides live in `content/guides/{league}.md`. The file has YAML frontmatter, an overview paragraph, then one `## Section` per challenge keyed by the challenge's exact in-game name.

```markdown
---
contributors: YourName
lastUpdated: 2026-08-10
---

Overview paragraph describing the league mechanic and general strategy.

## Challenge Name
difficulty: easy
category: early-game

Guide prose goes here. Use **bold** for item and mechanic names.
Refer to challenges by name, not number.

## Another Challenge
difficulty: normal
category: mapping
calculator: Scarabs=1,Maps=2

Guide prose. The calculator field is optional and creates an interactive
counter in the UI (label=divisor pairs, comma-separated).
```

### Metadata fields

Each section needs two required fields directly under the heading:

| Field | Required | Values |
|---|---|---|
| `difficulty` | yes | `very-easy`, `easy`, `normal`, `hard`, `very-hard` |
| `category` | yes | `early-game`, `mapping`, `endgame`, `bossing`, `crafting`, `league-mechanics`, `grind` |
| `timeInvestment` | no | `minimal`, `short`, `moderate`, `long`, `extreme` |
| `calculator` | no | `Label=divisor,Label=divisor` |
| `videoUrl` | no | YouTube or similar link |

`difficulty` is how hard the content is for your build. `timeInvestment` is how long it takes even if it's easy. Only add `timeInvestment` when it diverges from difficulty (e.g. Modified Maps is easy but extreme time).

### Writing tips

- Reference challenges and items by their **in-game name**, not by number.
- Section headings must match the challenge name in the league data exactly; a mismatch fails the build.
- Every challenge in the league needs a section; missing ones also fail the build.
- Stay vague rather than invent detail you're unsure about. Wrong tips are worse than no tips.

## Trade links

Trade link mappings live in `src/lib/trade-links.ts`. Three mapping types:

- **`BULK_EXCHANGE_IDS`** - maps item names to PoE trade static IDs for bulk exchange (currency, fragments, scarabs)
- **`BOSS_ENTRY_ITEMS`** - maps subtask names to the bulk exchange ID of their entry item (e.g. "Izaro" maps to "offer-dedication", "Abyssal Depths" maps to "scarab-of-abyssal-depths")
- **`ITEM_SEARCH_NAMES`** - set of item names that use the regular item search (unique maps, incubators)

All trade queries use `status: { option: "securable" }` (instant buyout only). Do not use `"online"` as it shows price fixers.

## CSS

Component-specific styles use co-located `.module.css` files. `globals.css` is for `@theme` tokens, body styling, and scrollbar rules only. Prefer Tailwind utilities; use CSS modules for gradients, pseudo-elements, and things utilities can't express.
