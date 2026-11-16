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
- A section you haven't written yet can be just `status: todo` under the heading, with no other fields or prose. It shows no guide on the site. Replace that line with the metadata fields when you fill it in.
- Stay vague rather than invent detail you're unsure about. Wrong tips are worse than no tips.

## Trade links and prices

Both come from `src/lib/item-catalog.ts`. It has one entry per subtask name, shared by every league, and the name must match the subtask exactly:

```ts
"Sacred Blossom": {
	trade: { exchange: ["sacred-blossom"] },
	price: [{ endpoint: "exchange", type: "Fragment", name: "Sacred Blossom" }],
},
```

- **`trade`** is either `{ exchange: [ids] }` for bulk exchange, with ids from https://www.pathofexile.com/api/trade/data/static, or `{ search, by }` for an item search. Use `by: "term"` for uniques and `by: "type"` for real base types.
- **`price`** lists poe.ninja lookups. With several, the subtask accepts any of them and the cheapest wins; add `needsAll: true` when it needs one of each. A `"*"` name means the cheapest item of that type.
- Quantities come from the subtask's `counterTarget`, so they aren't stored here.
- The "cheapest path" total only shows for challenges listed in `CHEAPEST_PATH_CHALLENGES`. Add a challenge there only when its subtasks are interchangeable purchases.

All trade queries use `status: { option: "securable" }` (instant buyout only). Do not use `"online"` as it shows price fixers.

## CSS

Component-specific styles use co-located `.module.css` files. `globals.css` is for `@theme` tokens, body styling, and scrollbar rules only. Prefer Tailwind utilities; use CSS modules for gradients, pseudo-elements, and things utilities can't express.
