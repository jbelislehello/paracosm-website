# Guided Test Mode for Calm Magic Board

An in-app checklist overlay that walks you through each Board step, auto-detects success/failure from live app state (DOM, network, DB), and shows pass/fail per step. Runs against your real session — no Playwright, no separate test harness.

## How you'll use it

1. Sign in, go to `/calm-magic-board?test=1` (or click a new "Run guided test" button in the board header, visible only to admins).
2. A floating panel appears on the right with an ordered checklist. Each step highlights the target UI element and shows what to do.
3. As you interact, the panel auto-marks steps ✅ pass / ❌ fail / ⏭ skipped, with a short reason and a "Retry" button.
4. At the end: summary with pass count, failing step details, and a "Copy report" button (Markdown) you can paste back to me.

## Steps covered

Personal mode
1. Board mounts — 8×8 matrix renders (64 tile buttons present).
2. Entry gate — opens from `/calm-magic-assistant`, routes to `/calm-magic-board` in personal mode.
3. Tile open — click any tile, detail/agent panel opens.
4. Tile write — type an answer, save triggers a Supabase write (watch `tiles` insert/update).
5. Persistence — reload, reopen same tile, content matches.
6. Tile agent — send one message, `tile-agent` edge function returns 200.
7. Weaving — with ≥2 tiles filled, weaving visualization renders without error.

Organizational / PRD mode
8. Navigate `/calm-magic-board/prds`, list loads.
9. Open one PRD → board enters org mode (PRD id in URL/context).
10. Quick-fill — `prd-quick-fill` returns 200 (if surfaced).
11. Edit a PRD-linked tile → write lands on the `prds` row, not `tiles`.

Cross-cutting
12. View-mode nav (Journey / Spiral / Tests / Learning / Overview / Tools / Dream) — each mounts, no red console errors.
13. Mobile viewport check — board usable at 390px.
14. Console clean — no red errors captured during the run.

## How each step is auto-verified

- **DOM assertions**: MutationObserver + `document.querySelector` on stable selectors (data-testid added where missing).
- **Network assertions**: monkey-patch `window.fetch` inside the panel to record calls to Supabase REST and edge functions, then match by URL + status.
- **DB assertions**: read-back via the existing supabase client (`from('tiles').select(...).eq('user_id', auth.uid())`) to confirm persistence.
- **Console assertions**: wrap `console.error` / `window.onerror` while the run is active.

Each step has: `label`, `instruction`, `autoCheck()` returning `{ status, detail }`, timeout (default 30s), and a manual "Mark pass/fail" fallback.

## Files to add / change

New:
- `src/components/board/GuidedTestPanel.tsx` — floating panel, step list, progress, report export.
- `src/components/board/guidedTestSteps.ts` — the ordered step definitions and their `autoCheck` functions.
- `src/hooks/useGuidedTestRunner.ts` — runner state machine (current step, results, fetch/console interceptors, cleanup).

Modified:
- `src/pages/CalmMagicBoard.tsx` (and PRD board page) — mount `<GuidedTestPanel />` when `?test=1` is present and user is admin (`useAdminStatus`).
- A handful of board components — add `data-testid` on the tile grid, tile detail save button, agent send button, weaving canvas, view-mode tabs. Non-visual changes only.

No DB migrations, no edge-function changes, no route changes.

## Access & safety

- Gated behind `useAdminStatus` **and** `?test=1` query param — invisible to normal users.
- Interceptors (`fetch`, `console.error`) install on mount and are removed on unmount, so they never leak into normal sessions.
- All writes done during the test are your real writes; the panel offers a "Cleanup test tile" button that deletes the tile row it created.

## Deliverable

After you approve, I'll implement the panel + steps + testids, then you open `/calm-magic-board?test=1` and click **Start**. The panel walks you through, and at the end you paste the Markdown report back so we prioritize any failures.
