## Goal

Populate `book_sources` for all 7 chapters of the Calm Magic book with raw material drawn from:

1. The live paracosm/calm-magic site (Firecrawl map + scrape)
2. The 64-tile Calm Magic board (`tiles` table + `seasonDefinitions`/`tileContents`)
3. The 64-card entrepreneurial tarot deck (`src/data/entrepreneurialTarot.ts`)
4. The Drift resource library (`src/data/driftTools.ts` + `src/data/driftMonthlyDiscoveries.ts`)

Each source is auto-mapped to one of the 7 chapters by phase keyword (GLITCH, DRIFT, TUNE, LOVE, MAGIC, CALM, FREE). Unmatched items go to chapter 1 (GLITCH / Naming the Friction) as default seed material.

No synthesis is run automatically — once sources are loaded you can fire `book-synthesize-chapter` per chapter from the existing admin.

## Deliverables

### 1. New edge function: `book-seed-from-corpus`

Admin-only endpoint (verifies `has_role(auth.uid(),'admin')` via service-role client). On invocation it:

- **Site pass**: calls Firecrawl `/v2/map` for `calm-magic.com` (reuses `ALLOWED_HOST`/`BLOCKED_HOSTS` guard), then `/v2/scrape` (markdown, onlyMainContent) for each URL, capped at ~80 pages with concurrency 4 and a per-page timeout. Each page becomes a `book_sources` row with `kind='web'`, `ref=url`, `title=metadata.title`, `excerpt=first ~1200 chars of markdown`.
- **Board pass**: reads all 64 `tiles` rows; one `book_sources` row per tile with `kind='tile'`, `ref='tile:<id>'`, `title='<calm_magic_phase> · tile #<id>'`, `excerpt=short_prompt`.
- **Tarot pass**: receives the 64-card deck inline in the request body (function is stateless re: bundled TS data); one row per card with `kind='tarot'`.
- **Drift pass**: receives drift tools + monthly discoveries inline; one row per item with `kind='drift'`.
- **Phase mapping**: scans title+excerpt for the 7 phase keywords (case-insensitive, also matches synonyms: `glitch|friction|rupture` → GLITCH, `drift|pattern|explore` → DRIFT, `tune|commit|intention` → TUNE, `love|relation|trust` → LOVE, `magic|imagination|story` → MAGIC, `calm|system|design` → CALM, `free|flow|operate` → FREE). First match wins; no match → GLITCH default. Sets `chapter_id` accordingly and `weight=3`, `included=true`.
- Idempotent on `(chapter_id, ref)` — skips inserts when the same `ref` already exists for that chapter.
- Returns `{ scraped, tiles, tarot, drift, byChapter: {...counts} }`.

### 2. Tiny admin trigger UI

Add a "Seed from corpus" button to the existing book admin page (whichever page already wraps `book-synthesize-chapter` — locate via `rg book-synthesize-chapter src`). Button calls `supabase.functions.invoke('book-seed-from-corpus', { body: { tarot, drift } })`, shows a progress toast, then a summary toast with per-chapter counts. No new route, no schema changes.

### 3. No DB migration

`book_sources` schema already supports everything needed. RLS is admin-only, which the edge function honors.

## Technical details

```text
Firecrawl: managed connector, FIRECRAWL_API_KEY already present
Concurrency: simple Promise pool, size 4, 25s per-scrape timeout
Phase regex order: GLITCH → DRIFT → TUNE → LOVE → MAGIC → CALM → FREE
Dedupe key: (chapter_id, ref) — pre-fetch existing refs once, filter in-memory
Insert: batched 50 rows at a time via service-role client
```

## Out of scope

- Auto-running `book-synthesize-chapter` (you'll trigger per chapter manually).
- LinkedIn newsletter import (still blocked; revisit once you paste/upload the articles).
- Any frontend changes outside the admin trigger button.
