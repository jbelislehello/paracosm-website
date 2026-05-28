## Goal
Fix references to "7 chapters" on the book landing — the book is actually 8 chapters. Also correct the i18n mismatch where `chapter_7` is currently labelled "Operating in Flow" (FREE) but chapter 7 in the database is "Living the Ontology" (OPEN); the FREE chapter is actually chapter 8.

## What's wrong today
- `src/i18n/en/book.json` line 39: `"chapters_title": "Seven chapters, one breath cycle"` → should be "Eight".
- `src/i18n/fr/book.json` line 39: `"Sept chapitres, un cycle de respiration"` → should be "Huit".
- `chapter_7_*` keys (EN + FR) currently hold the FREE / "Operating in Flow" content but chapter 7 in the DB is OPEN / "Living the Ontology". The OPEN chapter has no i18n entry, and chapter 8 (FREE) is also missing.
- `src/pages/BookLaunch.tsx` line 66: `const chapters = [1, 2, 3, 4, 5, 6, 7]` → should be `[1, 2, 3, 4, 5, 6, 7, 8]`.

## Fix
1. **`src/i18n/en/book.json`**
   - Update `chapters_title` to `"Eight chapters, one breath cycle"`.
   - Replace `chapter_7_*` with OPEN / "Living the Ontology" using the DB summary:
     - phase: `OPEN`
     - title: `Living the Ontology`
     - desc: short excerpt of "Where the designed system meets real workflow — ontology, graph, and the adjustment plan that keeps the org tunable."
   - Add `chapter_8_phase` / `chapter_8_title` / `chapter_8_desc` for FREE / "Operating in Flow" (move the current chapter_7 content here, keep wording).

2. **`src/i18n/fr/book.json`** — same shape, French translations:
   - `chapters_title` → `"Huit chapitres, un cycle de respiration"`.
   - `chapter_7_*` → OPEN / "Vivre l'ontologie" with a French description of the DB summary.
   - Add `chapter_8_*` for FREE / "Opérer en flow" (use current `chapter_7_*` French copy).

3. **`src/pages/BookLaunch.tsx`** line 66 — extend the chapters array to include `8`.

## Verification
- Reload `/book` (EN and FR) → title reads "Eight chapters…" / "Huit chapitres…", and the chapter list renders 8 cards with the correct phase + title for chapters 7 (OPEN) and 8 (FREE).

## Notes
- No DB changes — the 8 chapters already exist in `book_chapters`.
- No other component references `chapter_7_*` keys beyond `BookLaunch.tsx`; the change is contained.