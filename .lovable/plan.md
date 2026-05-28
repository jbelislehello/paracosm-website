## Goal
Add a prominent "Generate Operator's Cut for all chapters" one-click action in the Manuscript Console's Batch tab, with live per-chapter progress and error reporting.

## Where
`src/pages/BookManuscriptAdmin.tsx` — `BatchTab` component (existing grid stays untouched).

## UI
At the top of the Batch tab, a new card "Operator's Cut — one click":
- Headline + 1-sentence explainer (pragmatic edition across all chapters).
- Primary button: **Generate Operator's Cut for all chapters** (disabled while running).
- Optional concurrency selector (default 3) and an optional shared guidance textarea.
- Live progress strip: `X / N complete · Y failed`.
- Per-chapter list (ordered by `order_index`), each row shows:
  - Chapter number + title
  - Status badge: queued / running / done / error
  - Draft link (opens `/book/<slug>?edition=pragmatic`) when done
  - Inline error message + Retry button when failed

## Behavior
- On click: load all chapters from `book_chapters` ordered by `order_index`, seed local state `Record<chapterId, {status, draft_id?, error?}>` to `queued`.
- Invoke `book-synthesize-batch` with `chapter_ids = all`, `audiences = ["pragmatic"]`, chosen `concurrency`, `guidance`.
- Since the edge function returns only the final batched result, we flip all rows to `running` on submit and reconcile to `done`/`error` from `results` on response.
- Retry: re-invoke `book-synthesize-batch` for just the failed `chapter_id` with `audiences=["pragmatic"]`.
- Toast summary at the end (`X succeeded, Y failed`).

## Notes
- No backend/schema changes — reuses existing `book-synthesize-batch` edge function which already supports `pragmatic` and concurrency.
- Existing batch grid below remains for power use.
- Pure UI work in one file.