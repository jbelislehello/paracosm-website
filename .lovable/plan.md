## Goal

Build a "Resonance" feature: the user types a question, an AI maps it onto the five Calm Magic axes (MAGIC · LOVE · CALM · OPEN · FREE) with a 0–100 score per axis and the most relevant real tile prompts, and the UI visualizes that mapping as a board.

## Architecture

```
Question
   │
   ▼
[edge: map-question-to-board]
   ├── Lovable AI (gemini-3-flash-preview) with tool_call → {axis, score, rationale, tile_hints[]}
   └── Token-overlap match of tile_hints against public.tiles.short_prompt
   │
   ▼
{ axes: [{ axis, score, rationale, tile_hints, tiles:[{id, prompt}] }, …×5] }
   │
   ▼
<ResonanceMap /> visualizer
```

## Changes

### 1. New edge function `supabase/functions/map-question-to-board/index.ts`

- POST `{ question: string }` (3+ chars, validated).
- Calls Lovable AI Gateway with **tool calling** to enforce structured output:
  ```ts
  { axes: [{ axis: "MAGIC"|"LOVE"|"CALM"|"OPEN"|"FREE",
             score: 0..100, rationale: string,
             tile_hints: string[] /* 1-3 short prompts */ }] }
  ```
- System prompt explicitly defines what each axis means (MAGIC=imagination/futures, LOVE=care/relationships, CALM=rigor/governance, OPEN=ontology/workflow, FREE=outcomes/sovereignty) and instructs the model to discriminate (not flat 50/50/50/50/50).
- Normalizes to all 5 axes in canonical order (fills missing with score 0).
- **Enrichment**: pulls `id, board, short_prompt` from `public.tiles` via service-role, then for each `tile_hint` finds the highest token-overlap tile within that axis's board (`MAGIC`/`LOVE`/`CALM`/`OPEN`/`FREE`). Returns the matched real tile `{id, prompt}` so the UI can link to actual board positions.
- Surfaces 429/402 with friendly messages per Lovable AI rules.
- CORS open. No JWT required (read-only mapping, no PII written).

### 2. New shared type `src/lib/resonance.ts`

```ts
export type CalmMagicAxis = "MAGIC" | "LOVE" | "CALM" | "OPEN" | "FREE";
export interface AxisResonance {
  axis: CalmMagicAxis;
  score: number;          // 0–100
  rationale: string;
  tile_hints: string[];
  tiles: { id: number; prompt: string }[];
}
export interface ResonanceMap {
  question: string;
  axes: AxisResonance[];
}
export const AXIS_ORDER: CalmMagicAxis[] = ["MAGIC","LOVE","CALM","OPEN","FREE"];
export const AXIS_TOKEN: Record<CalmMagicAxis, string> = {
  MAGIC: "primary",
  LOVE:  "accent",
  CALM:  "muted-foreground",
  OPEN:  "foreground",
  FREE:  "primary",
};
```

(Colors stay as design-token references — no hex.)

### 3. New component `src/components/resonance/ResonanceMap.tsx`

A self-contained visualization, usable anywhere:

- Header: the user's question in quotes.
- Five horizontal rows (one per axis) with:
  - Axis label + small chip showing rank (#1 dominant, etc.).
  - Animated bar (`framer-motion`) widthening from 0 → score%.
  - Score number on the right.
  - Underneath: the matched tile prompts as small `<Badge>`s; clicking a badge calls an optional `onTileClick(id)` prop.
- Below the bars: short "Why this resonates" expandable section listing each axis's `rationale`.
- Empty/loading skeletons handled inline.
- All colors via tokens (`bg-primary/15`, `text-accent`, etc.).

### 4. New component `src/components/resonance/QuestionResonancePanel.tsx`

A drop-in panel containing:
- A `<Textarea>` ("Ask the question your team is sitting with…") with a submit button.
- Three example chips ("How do we onboard an enterprise client?", "What governance fits an autonomous design team?", "Where does Calm Magic meet OECD AI?") that prefill the textarea.
- Calls `supabase.functions.invoke("map-question-to-board", { body: { question } })`.
- Shows a `<Loader2>` spinner during the call and an inline error toast for 429/402.
- Renders `<ResonanceMap />` when the result lands.
- Fires `analytics.trackEvent("resonance_question_submitted", { length })` and `"resonance_returned" { topAxis, topScore, latencyMs }`.

### 5. Wire into the deck wizard

`src/pages/AgenticEcosystemDeck.tsx`:
- Insert `<QuestionResonancePanel />` at the top of Step 1, above the source picker.
- The returned `ResonanceMap` is stashed in the existing `Draft` (no schema change needed — rides inside localStorage). When present, the wizard's `intent` textarea is auto-prefilled with the question text and the wizard passes `{ resonance }` into the eventual `compose-deck` body so future improvements can use it. (For this task we render only — no compose-deck change required.)

### 6. Standalone demo route

Add `/resonance` route mounting a tiny page that just shows `<QuestionResonancePanel />` so the feature is shareable on its own (linked from the Crewdle "Dream & Learn" page in a follow-up).

### 7. No DB migration

The `tiles` table is already public-readable and contains exactly what we need. The `analytics_events` table created earlier captures the new events. Nothing else to add.

## Notes

- Strict token-overlap match keeps the function deterministic and prevents the AI from hallucinating tile IDs.
- All AI calls go through Lovable AI Gateway via the edge function — no client-side AI calls, no model name in the frontend.
- `map-question-to-board` is read-only (it does not write any rows), so RLS isn't a concern.
- Future: a follow-up can use this `ResonanceMap` to (a) bias `compose-deck`, (b) jump the user to the matching tiles on the actual Calm Magic board page, (c) feed the Crewdle "Learn" critic pass.
