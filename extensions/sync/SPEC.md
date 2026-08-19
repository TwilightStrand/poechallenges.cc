# Spec: PoE Challenge Sync Extension

## Objective

Replace the bookmarklet with a proper browser extension that syncs challenge progress automatically. The user installs it, logs into pathofexile.com, and their challenge state flows to the tracker server without any manual action. The extension should work passively; just having the browser open is enough.

Target users: anyone using the PoE Challenge Tracker who wants automatic sync.

Success: challenge progress appears on the tracker within minutes of completing a challenge in-game, without the user clicking anything.

## Assumptions

1. The PoE challenges page at `/account/view-profile/{name}/challenges` is the source of truth for completion state
2. The page requires an authenticated PoE session (cookies) to show challenge data
3. Cloudflare may gate the page; the extension must detect this and not send garbage data
4. The existing `/api/import` endpoint is the sync target (already has CORS for pathofexile.com)
5. The user is authenticated on the tracker (has a session cookie) before the extension can sync
6. This is a standalone project for now; will move into a pnpm monorepo later
7. WXT is the framework (validated: MIT, 550k weekly downloads, active maintenance)

## Tech Stack

- **WXT** 0.21.x (cross-browser extension framework, Vite-based)
- **TypeScript** strict
- **Target browsers**: Firefox (MV3, primary), Chrome (MV3), Edge (MV3 via Chrome build)
- No UI framework for popup (vanilla HTML/CSS, it's a settings panel)

## Architecture

### Extension components

```
entrypoints/
  background.ts        Service worker: alarm scheduling, orchestrates fetches
  content.ts           Content script: parses challenge DOM on pathofexile.com
  popup/               Extension popup: config, status, manual sync button
    index.html
    main.ts
```

### Data flow

```
1. Background service worker fires an alarm (configurable interval, default 15min)
2. Background opens pathofexile.com/account/view-profile/{name}/challenges
   in a hidden offscreen document or uses chrome.tabs to inject content script
3. Content script parses the DOM (reuses bookmarklet logic)
4. Content script sends parsed data back to background via messaging
5. Background diffs against last known state in browser.storage.local
6. If changed: POST to tracker's /api/import with credentials
7. Store new state + timestamp in browser.storage.local
```

### Alternative flow: content script on natural navigation

When the user naturally visits their challenges page, the content script fires immediately (no alarm needed). Both paths converge at step 4.

### Background worker strategy

The service worker uses `browser.alarms` to wake periodically. On each alarm:

1. Check if we have a configured PoE account name
2. Create a hidden tab (`browser.tabs.create({ active: false, url: challengesUrl })`) pointing at the challenges URL
3. The content script auto-fires on the matching URL, parses, and messages back
4. Close the hidden tab
5. Diff against stored state, sync if changed

Hidden tabs work on both Firefox and Chrome; no platform-specific APIs needed.

If the browser is closed, no alarms fire. This is fine; sync happens when the browser is open, which is when the user is playing.

### Cloudflare / auth detection

The content script checks for these states before parsing:

- **Cloudflare challenge**: look for `#challenge-running`, `#challenge-form`, `.cf-turnstile`, or `cf-chl-widget` in the DOM. If found, report `{ status: "cloudflare" }` back to background.
- **Not logged in**: the page redirects to login, or the challenge list is empty / shows a "log in" prompt. Report `{ status: "not-authenticated" }`.
- **Private profile**: the page shows a privacy message instead of challenges. Report `{ status: "private-profile" }`.
- **Success**: challenges found. Report `{ status: "ok", data: ParsedProgress }`.

The background worker handles each status:
- `cloudflare`: retry after a backoff (2min, then 5min, then stop until next alarm cycle)
- `not-authenticated`: show a badge on the extension icon, stop retrying
- `private-profile`: show a badge, stop retrying
- `ok`: proceed with diff + sync

### DOM parsing

Port the existing bookmarklet logic (`src/lib/bookmarklet.ts` lines 6-43) into a typed function:

```typescript
interface ParseResult {
  status: "ok" | "cloudflare" | "not-authenticated" | "private-profile";
  data?: {
    leagueId: string;
    accountName: string;
    challenges: ChallengeProgress[];
  };
}
```

Selectors (from the working bookmarklet):
- Challenge elements: `.achievement.clearfix`
- Incomplete: `.incomplete` class on the element
- Completion count: `.completion-detail span`
- Subtasks: `.items li` (`.finished` class = done)
- Counter: regex `(\d[\d,]*)/(\d[\d,]*)` at end of subtask text
- League: `select[name="season"]` value
- Account name: URL path `/view-profile/{name}/challenges`

### Sync to server

POST to `{trackerUrl}/api/import` with the same payload shape the bookmarklet uses:

```typescript
{
  leagueId: string;
  accountName: string;
  challenges: Array<{
    challengeId: number;
    completed: number;
    isComplete: boolean;
    subtasks: Array<{
      id: string;
      completed: boolean;
      counter?: number;
    }>;
  }>;
}
```

The tracker URL is configurable in the popup (defaults to `https://poechallenges.com` or whatever the prod domain is).

Auth: the extension needs the tracker's session cookie. Since the API uses `credentials: 'include'`, this works if the user is logged into the tracker in the same browser. The extension makes the fetch from the background service worker with `credentials: include`.

### localStorage bridge

The tracker stores anonymous progress in localStorage under `poe-progress-{leagueId}` as `PlayerProgress` JSON (see `src/lib/progress-store.ts`).

The extension syncs this bidirectionally:

**Extension -> Tracker page:**
When the extension parses new challenge data from pathofexile.com, it uses a content script on the tracker domain to write the data into localStorage. If the tracker tab is open, it picks up changes via a `storage` event listener (or the next `loadProgress()` call on navigation).

**Tracker page -> Extension:**
When the user manually toggles challenges on the tracker, a content script on the tracker domain reads localStorage on change and sends it to the extension's background worker. This keeps the extension's "last known state" current, so the next PoE page parse diffs against the latest manual edits too.

This requires two content script registrations:
- `*://pathofexile.com/account/view-profile/*/challenges` (parse PoE challenges)
- `*://localhost:3000/*` + `*://{trackerDomain}/*` (localStorage bridge)

The bridge content script is lightweight: it listens to `window.addEventListener("storage", ...)` and on load reads the current `poe-progress-*` keys, forwarding them to the background via `browser.runtime.sendMessage`.

### Diffing

Before sending, compare the new parse against `browser.storage.local` state. Only POST if:
- Any `isComplete` flag changed
- Any `completed` counter changed
- Any subtask `completed` or `counter` changed

This avoids hammering the server on every alarm when nothing changed.

### Extension storage

```typescript
interface StoredState {
  accountName: string;          // configured PoE account name
  trackerUrl: string;           // default: production URL
  syncIntervalMinutes: number;  // default: 15
  lastSync: string | null;      // ISO timestamp
  lastSyncStatus: "ok" | "cloudflare" | "not-authenticated" | "private-profile" | "no-changes" | "error";
  lastChallengeData: object | null;  // last successfully parsed state (for diffing)
}
```

### Popup UI

Minimal settings panel:
- PoE account name input (required to know which profile to fetch)
- Tracker URL (advanced, collapsed by default)
- Sync interval slider (5min / 15min / 30min / 60min)
- Last sync status + timestamp
- Manual "Sync Now" button
- Link to open challenges page

Style: match the PoE dark/gold theme from the tracker.

## Project Structure

```
extensions/sync/
  wxt.config.ts
  package.json
  tsconfig.json
  SPEC.md
  entrypoints/
    background.ts              Service worker: alarms, orchestration, sync
    content/poe-challenges.ts  Content script on pathofexile.com: DOM parsing
    content/tracker-bridge.ts  Content script on tracker domain: localStorage bridge
    popup/
      index.html
      main.ts
      style.css
  lib/
    parse-challenges.ts        DOM parsing (ported from bookmarklet)
    diff.ts                    State comparison
    sync.ts                    POST to tracker API
    storage.ts                 Typed wxt/storage wrapper
    messages.ts                Typed message definitions (background <-> content)
  assets/
    icon-16.png
    icon-48.png
    icon-128.png
```

## Commands

```bash
cd extensions/sync
pnpm install
pnpm dev                    # dev mode with hot reload (Firefox, default)
pnpm dev -b chrome          # dev mode (Chrome)
pnpm build                  # production build (Firefox)
pnpm build -b chrome        # production build (Chrome)
pnpm zip                    # package for Firefox Add-ons
pnpm zip -b chrome          # package for Chrome Web Store
```

## Code Style

TypeScript strict. No `any`. Named exports. Functions over classes.

```typescript
export function parseChallenges(document: Document): ParseResult {
  const els = document.querySelectorAll(".achievement.clearfix");
  if (!els.length) {
    return detectBlocker(document);
  }
  // ...
}
```

## Testing Strategy

- **Unit tests** (vitest): `parse-challenges.ts` and `diff.ts` with fixture HTML
- **Integration**: manual testing against the real PoE challenges page
- **Cross-browser**: test Chrome + Firefox builds before release

## Boundaries

- **Always**: diff before syncing, detect Cloudflare/auth states, respect alarm intervals
- **Ask first**: changing the `/api/import` endpoint contract, adding new permissions
- **Never**: store PoE credentials, scrape pages other than the challenges page, send data to anything other than the configured tracker URL

## Success Criteria

1. Extension installs on Chrome and Firefox from a single codebase
2. After configuring account name, challenges sync automatically every N minutes while browser is open
3. Visiting the challenges page manually triggers an immediate sync (no waiting for alarm)
4. Cloudflare gates and auth failures are detected and surfaced in the popup, not sent as bad data
5. Only changed data is sent to the server (diffing works)
6. Server receives data in the same format as the existing bookmarklet import

## Decisions

1. **Hidden tabs for both browsers.** Firefox doesn't support offscreen documents, and we're targeting Firefox first. Hidden tabs work everywhere; no platform branching needed.
2. **Cookie auth required + localStorage sync.** The user must be logged into the tracker for server sync. But the extension also syncs localStorage bidirectionally with the tracker page, so anonymous users still benefit from automatic progress import. See "localStorage bridge" below.
3. **Current league only.** Sync whichever league the challenges page defaults to (the current one). Supporting a league selector can come later.
4. **Store submission.** Build for Chrome Web Store and Firefox Add-ons from the start. The maintainer handles publishing.
