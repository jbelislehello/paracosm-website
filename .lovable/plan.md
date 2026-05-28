## Goal
Populate `book_chapter_drafts` for all 8 chapters with both the `visionary` long-form bodies and the `pragmatic` (Operator's Cut) versions, so every chapter has a complete Field Guide AND Operator's Cut edition.

## Approach
Invoke the existing `book-synthesize-batch` edge function twice (once per audience) across all 8 chapter IDs, then re-query the DB to confirm 8/8 visionary + 8/8 pragmatic drafts exist and are marked `is_current`.

No code changes, no schema changes — this is purely an operational run of the already-deployed pipeline.

## Steps
1. Fetch the 8 chapter IDs ordered by `order_index`.
2. Call `book-synthesize-batch` with `audiences: ["visionary"]` for all 8 chapters.
3. Call `book-synthesize-batch` with `audiences: ["pragmatic"]` for all 8 chapters.
4. Query `book_chapter_drafts` and report per-chapter status (visionary len, pragmatic len, any failures).
5. If any chapter failed, retry it individually via `book-synthesize-chapter` and show errors from edge logs.

## Verification
- DB check: `SELECT count(*) per audience` should return 8 + 8.
- Spot-check `/book/chapter/naming-the-friction?edition=pragmatic` renders the Operator's Cut body.
- Confirm `/book/operators-index` lists all 8 chapters as available.

## Notes
- Generation will consume Lovable AI credits (16 chapter syntheses total). If credits run out the function returns 402 — I will surface that immediately rather than retrying silently.
- This does not republish or change `book_chapters.status`; excerpts already published remain untouched.
