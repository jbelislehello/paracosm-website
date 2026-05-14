Import the corpus into `book_sources` and surface progress.

## Why nothing imported

The previous "Go" landed in plan mode, so `book-seed-from-corpus` was never invoked. DB still shows: 0 sources, 0 drafts, 0 uploads, 7 chapter outlines.

## How to import — pick one

### Option A — Click the existing button (fastest, 30 s)

1. Go to `/admin/book-manuscript` while logged in as admin.
2. Click **"Seed corpus"** (top card).
3. The page builds the tarot + drift payload from in-app data files and invokes `book-seed-from-corpus`. Toast shows per-kind counts.

This is the path the function was designed for. Nothing to build.

### Option B — I trigger it for you from chat (no clicking)

If you're currently logged into the preview as admin, I can call `book-seed-from-corpus` directly via `curl_edge_functions`. Two sub-options:

- **Web + tiles only** (~60 site pages + 64 tiles): one curl with empty `tarot`/`drift` arrays. Tarot and drift can be added later. Fast and simple.
- **Full corpus**: I'd need to inline the tarot deck (64 cards) + drift items in the request body. Doable but a heavier call.

I default to **Option B / web + tiles only** unless you tell me otherwise — it gets ~120 sources in within a minute and unblocks chapter synthesis. You can run the in-app button later for the rest.

## After import

I'll verify with:

```sql
SELECT c.phase, c.title, count(s.id) AS sources
FROM book_chapters c LEFT JOIN book_sources s ON s.chapter_id = c.id
GROUP BY c.id ORDER BY c.order_index;
```

…and post the per-chapter counts back. Then the next step is `book-synthesize-chapter` to turn sources into draft prose in `book_chapter_drafts`.

## Out of scope

No schema changes, no new functions, no UI changes. Just running what's already built.
