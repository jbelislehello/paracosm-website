# Fix: Presentation generator 502 error

## Root cause

`supabase/functions/compose-deck/index.ts` returned **HTTP 502** after ~13.5s. That status is only emitted on the `OutlineSchema.safeParse` validation branch, meaning Gemini returned JSON that didn't conform to the strict shape (most likely missing `id`, `subtitle`, `bullets`, `body`, `speakerNotes`, or `sourceUrls` on some slides — the prompt only *requests* them but the schema treats them as required-with-defaults, and `.default()` on Zod doesn't rescue missing keys when the AI omits them at the wrong level).

The frontend (`AgenticEcosystemDeck.tsx` line 247) just rethrows and shows a generic toast, so the user sees "There was an error during presentation generator" with no actionable info.

## Changes

### 1. `supabase/functions/compose-deck/index.ts` — make schema resilient
- Change `SlideSchema` so every optional field uses `.optional()` without forcing presence: keep `id`, `type`, `title` as the only required fields. Coerce missing arrays/strings via a normalization step after parse.
- Auto-generate `id` if AI omits it (`slide-${i+1}`).
- Coerce unknown `type` values to `"bullets"` instead of failing.
- After AI response, run a light "repair" pass: ensure first slide is `title`, last slide is `closing-cta` (rewrite type if AI got it wrong instead of rejecting).
- On validation failure, log the raw AI output to console (visible in edge logs) and return a 200 response with a `warnings` field plus the partially-repaired outline, so the UI can still render.
- Add a 60s `AbortController` timeout on the AI fetch to fail fast instead of hanging.
- Reduce slide count requested for `standard` from 12 → 10 (Gemini is more reliable under ~12 slides in one shot).

### 2. `src/pages/AgenticEcosystemDeck.tsx` — surface real error
- When `compose-deck` returns a non-2xx, read `data.error` / `data.issues` and show it in the toast (truncated to 200 chars) instead of the generic message.
- If `data.warnings` is present alongside an outline, render the deck and show a non-blocking warning toast.
- Add a "Retry" action button on the error toast that re-invokes the same stage without restarting from scrape.

### 3. `supabase/functions/compose-deck/index.ts` — model fallback
- If the first call to `google/gemini-2.5-flash` returns a malformed/empty response, retry once with `google/gemini-2.5-pro` (slower but stricter at structured JSON). One retry max, only on parse/validation failure — not on 402/429.

## Files touched

- `supabase/functions/compose-deck/index.ts` (schema + repair + retry + timeout)
- `src/pages/AgenticEcosystemDeck.tsx` (error surfacing + retry UX)

## Out of scope

- The earlier-proposed Resonance UX polish (debounce, skeletons, stale-state) — still pending separate approval and unrelated to this 502.
