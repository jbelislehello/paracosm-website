## Goal
Fix the "Live Transmission" stats band on the homepage so it reflects the real numbers from the database:
- Chapters: 8 (already correct)
- Drafts in motion: should be **16** (8 visionary + 8 pragmatic Operator's Cut), currently shows 8
- Sources mapped: should be **346**, currently shows 0

## Root Cause
`LivingManuscriptBand.tsx` queries `book_chapters` (for "drafts" using `status != 'outline'`) and `book_sources` directly from the browser. Two problems:

1. **Wrong table for drafts** — it counts chapters not in outline status, not actual rows in `book_chapter_drafts`. Real draft count lives in `book_chapter_drafts` (16 current rows).
2. **RLS blocks public reads** — `book_sources` is admin-only, so anon visitors get `count = 0`. Same restriction applies to non-pragmatic drafts in `book_chapter_drafts`.

## Approach
Create a small `SECURITY DEFINER` SQL function `public.get_book_stats()` that returns the three counts as a single row. It bypasses RLS safely (returns only aggregate counts, no row data) and is callable by `anon` + `authenticated`. Then update `LivingManuscriptBand.tsx` to call it via `supabase.rpc('get_book_stats')` instead of three separate table queries.

## Steps
1. **Migration** — create `public.get_book_stats()` returning `(chapters int, drafts int, sources int)`:
   - `chapters` = `count(*) from book_chapters`
   - `drafts` = `count(*) from book_chapter_drafts where is_current = true`
   - `sources` = `count(*) from book_sources`
   - `SECURITY DEFINER`, `STABLE`, `search_path = public`
   - `GRANT EXECUTE ... TO anon, authenticated`
2. **`src/components/book/LivingManuscriptBand.tsx`** — replace the three `supabase.from(...).select(..., { count })` calls with one `supabase.rpc('get_book_stats')` call. Keep the same `stats` shape and fallback defaults.

## Verification
- Reload `/` → band shows **8 / 16 / 346**.
- Spot-check as anon (logged out) to confirm RLS bypass works via the RPC.

## Notes
- No UI/visual changes — only the data source.
- Function returns only counts, so no data leak risk despite `SECURITY DEFINER`.