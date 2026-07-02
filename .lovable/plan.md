# Verify the Calm Magic Board

Two-pass check: static code audit + live Playwright walkthrough, covering both entry paths.

## 1. Static audit (read-only)

Trace and report issues, no code changes:

- `BoardEntryGate` → what it routes to (personal vs organizational / PRD)
- `CalmMagicBoard.tsx` page: data loading, RPC/edge-function calls, error handling
- Tile persistence via `useTileMatrixPersistence` + related hooks (`useTileEmotionalCheckins`, `useAgentTileConversation`, `useWeavingConnections`)
- `tile-agent` and `map-question-to-board` edge functions (recent errors in logs)
- RLS on tile / board-related tables — confirm authenticated users can read/write their own rows
- `ProtectedRoute` behavior on `/calm-magic-board/*`

Deliverable: a short table of findings — file:line, severity (blocker / bug / polish), and suggested fix.

## 2. Live browser run (Playwright, admin session injected)

Executed from the sandbox against `http://localhost:8080`, screenshots saved under `/tmp/browser/board-check/`.

**Personal path**
1. Open `/relational-healing` → click "Launch Calm Magic Board" → verify `BoardEntryGate` modal opens and routes to `/calm-magic-board` in personal mode.
2. On the board: confirm the 8×8 tile matrix renders, tiles are clickable, tile detail/agent panel opens.
3. Write a short answer on 1–2 tiles → reload → confirm persistence.
4. Capture console errors + failed network requests.

**Organizational / PRD path**
1. Go to `/calm-magic-board/prds` → open or create a PRD → enter the board in org mode.
2. Verify PRD-linked tiles load, quick-fill (if surfaced) runs, `prd-quick-fill` edge function returns 200.
3. Edit a tile in org mode → confirm it writes to the PRD row (not personal).
4. Check weaving visualization renders when ≥2 tiles have content.

**Cross-cutting checks**
- View-mode nav (Journey / Spiral / Tests / Learning / Overview / Tools / Dream) — each mounts without runtime error.
- Mobile viewport (390×592, current preview): board is usable or gracefully degrades.
- Console has no red errors after full walkthrough.

## 3. Report back

Single message with: findings table, screenshots inline, and a prioritized list of fixes to run once you approve moving to build mode. No code edits happen in this plan.

## Technical notes

- Uses `LOVABLE_BROWSER_SUPABASE_*` env to restore the admin session before hitting protected routes.
- No DB migrations, no edge-function redeploys, no file edits during the audit.
- If a blocker is found (e.g., tiles fail to persist), I'll stop the walkthrough early and surface it before continuing.
