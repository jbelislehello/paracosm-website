## Goal

A focused tool — **Quick Fill Board** — that takes a PRD plus a user-supplied list of questions and produces an answer for **each of the 64 Calm Magic tiles**. It's a "first chapter of analysis": fast, structured, saved on the PRD record, viewable later. Not a dream sequence, not narration — just rapid, scannable answers per tile.

---

## UX

A new tab inside `PrdEditor` called **Quick Fill** sitting alongside the existing layered accordion view.

```
[ PRD Editor ]
  ├─ Edit (current view)
  └─ Quick Fill        ← new
       ├─ Questions input (textarea: one per line, paste-friendly)
       ├─ "Run Quick Fill" button → streams answers per tile
       ├─ 8×8 board grid: each cell shows tile name + a generated answer
       └─ Re-run / clear / save state
```

Behavior:
- User pastes any number of questions (1, 5, 50 — no constraint).
- Click **Run Quick Fill**. The PRD text + questions + the 64 tile definitions go to the edge function.
- Edge function returns one answer per tile (using all questions + PRD as context, framed by the tile's own `glitchQuestion`/`name`).
- Tiles fill in progressively (streamed). Each cell ~1–3 sentences.
- A "Save" button persists the latest fill on the PRD; subsequent visits show the last result.

---

## Data

A new column on `prds`:

```sql
alter table public.prds
  add column quick_fill jsonb;  -- { questions: string[], answers: { [tile_id: number]: string }, generated_at: timestamptz, model: text }
```

One column, one shape, one source of truth. No new tables.

---

## Edge function — `prd-quick-fill`

- Inputs: `{ prd_id, questions: string[] }`
- Loads the PRD by id (RLS via caller's JWT).
- Builds context: PRD title + non-empty PRD fields concatenated as labeled text + the user's question list.
- For each of the 64 tiles, sends a structured prompt to Lovable AI Gateway (`google/gemini-3-flash-preview`) using **tool calling** to return one object: `{ tile_id, answer }`.
- Batches tiles in groups of 8 (one row at a time) to keep latency low and reduce per-call tokens; emits SSE events `tile` `{tile_id, answer}` as each batch returns, then a final `done` event.
- Persists the full `quick_fill` payload back to `prds` after `done` (server-side, using user's JWT — RLS already restricts updates to the owner).

Why batch by row: each row of the board is a coherent register (Mindsets, Agilities, Goals…). Asking the model to fill all 8 cells of a row in one structured-output call gives more coherent, less repetitive answers.

---

## Client component

- `src/components/calm-magic/quick-fill/QuickFillTab.tsx` — the tab body.
- Reuses the existing tile data from `src/data/tileContents.ts` for layout + names.
- Streams via the same SSE pattern as `DreamSequence.tsx` (proven, already in repo).
- 8×8 grid: each cell = tile name (bold), a small phase-color bar, and the generated answer (or skeleton while loading).
- Save button writes the local state to `prds.quick_fill` if the user wants to override the auto-save.
- "Clear" wipes local state (does not touch DB until saved).
- "Export as Markdown" button: renders all 64 tiles as `## {name}\n{answer}` for copy/paste into other tools.

---

## PRD Editor integration

Wrap the existing PRD Editor body in shadcn `<Tabs>`:
- **Edit** — the current accordion form.
- **Quick Fill** — the new component.

No changes to the existing edit flow.

---

## Files

- New migration: add `quick_fill jsonb` column to `prds`.
- New: `supabase/functions/prd-quick-fill/index.ts`
- New: `src/components/calm-magic/quick-fill/QuickFillTab.tsx`
- New: `src/components/calm-magic/quick-fill/QuickFillBoard.tsx` (presentational 8×8 grid)
- Edit: `src/pages/PrdEditor.tsx` (wrap content in tabs, mount the new tab)

---

## Out of scope (intentionally)

- No maturity scoring, no provocations, no tile picking, no replay, no sharing.
- No new persistence beyond the single jsonb column.
- No changes to Dream Mode.
- No image/PDF/voice rendering.

This is the minimal "first chapter" tool: PRD + questions in → 64 answers on the board out → saved to the PRD.
