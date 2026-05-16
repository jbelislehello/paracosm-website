## Plan: Publish seeded book content

Flip `status` from `draft` to `published` on the two seeded tables so the content becomes visible in the UI (chapter pages, `/book/compasses`, reflection node carousels).

### SQL to run

```sql
UPDATE public.book_compasses
SET status = 'published', updated_at = now()
WHERE status = 'draft';

UPDATE public.book_reflection_nodes
SET status = 'published', updated_at = now()
WHERE status = 'draft';
```

### Expected effect
- ~22 compasses appear at `/book/compasses` and as "Compasses for this phase" strips at the bottom of each chapter (matched via `phase_affinity`).
- ~27 reflection nodes appear at the bottom of their mapped chapter pages, including the "Pull a card" randomizer.

### Notes
- No schema change, no code change.
- Reversible: re-run with `status = 'draft'` if you want to unpublish.
- Future seeded rows will continue to land as `draft` so you can curate before publishing.
