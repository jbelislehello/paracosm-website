## Goal
Use parallel "subagent" edge function workers to draft Calm Magic chapters in multiple audience voices simultaneously, controlled from the manuscript admin.

## Architecture

```text
Admin UI (BookManuscriptAdmin)
   │  select chapters + audiences
   ▼
book-synthesize-batch (orchestrator)
   │  fan-out: Promise.all over chapter × audience
   ▼
book-synthesize-chapter (worker, now audience-aware)
   ├─ general        → draft_md saved with audience='general'
   ├─ practitioner   → draft_md saved with audience='practitioner'
   └─ executive      → draft_md saved with audience='executive'
```

Each audience runs as an independent invocation of the worker function, so chapters draft in parallel (subagent-style) without blocking each other.

## Database
Add `audience` to `book_chapter_drafts`:
- column `audience text not null default 'general'`
- check in `('general','practitioner','executive')`
- replace existing `is_current` semantics: current = latest per `(chapter_id, audience)` (handled in app, no schema change beyond the column).
- backfill existing rows to `'general'`.

## Edge functions

**`book-synthesize-chapter` (modify)**
- Accept `audience` ('general' | 'practitioner' | 'executive', default 'general') and `guidance`.
- Switch SYSTEM_PROMPT voice per audience:
  - general: plain-language, accessible, literary but jargon-free
  - practitioner: current Calm Magic ghostwriter voice (operators, facilitators)
  - executive: strategic, decision-oriented, business framing
- Save draft with audience; `is_current=false` only on prior drafts of the same `(chapter_id, audience)`.

**`book-synthesize-batch` (new)**
- Admin-only.
- Body: `{ chapter_ids: uuid[], audiences: string[], model?: string, guidance?: string }`.
- Verifies admin via `has_role`.
- Concurrency-limited `Promise.allSettled` (pool of 4) that invokes the worker function over HTTP for each chapter × audience pair, forwarding the user's Authorization header.
- Returns per-pair `{ chapter_id, audience, ok, draft_id?, error? }`.

## UI (BookManuscriptAdmin)
Add a "Batch drafting" panel:
- Multi-select chapters (checkbox list of `book_chapters`).
- Audience checkboxes (general / practitioner / executive).
- "Draft all variants" button → calls `book-synthesize-batch`.
- Live status table: chapter × audience cell shows pending / running / done / error with the resulting `draft_id` link.
- Existing single-chapter editor extended with an audience tab to view the current draft per audience.

## Out of scope
- No public reader UI changes; published excerpts stay as-is.
- No new Stripe / cohort changes.

## Files
- migration: add `audience` column + backfill
- edit: `supabase/functions/book-synthesize-chapter/index.ts`
- new: `supabase/functions/book-synthesize-batch/index.ts`
- edit: `src/pages/BookManuscriptAdmin.tsx` (add batch panel + audience tabs)
