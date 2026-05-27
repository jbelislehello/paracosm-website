# Two changes

## 1. Rebalance Calm Magic Board tile routing

**Problem:** the keyword classifier sent ~260 tiles into GLITCH/DRIFT/TUNE because tile metadata keeps repeating those phase names, starving CALM/MAGIC/OPEN/FREE.

**Fix:** for `kind = "tile"`, route directly by the tile's own `calm_magic_phase` column (the ontological source of truth) instead of keyword classification. Web pages, tarot, drift items keep using the classifier.

**Steps**
1. In `book-seed-from-corpus`, pass an optional `forcePhase` into `enqueue()`.
2. When iterating tiles, map `t.calm_magic_phase` (uppercased) to a chapter via `phaseToChapter`; fall back to classifier only if the value is null or not in the map.
3. Re-run via `book-kick-seed`. Expected distribution: ~32 tiles per primary phase across the 8 chapters with the proper Senge/Wu-Wei spread.
4. Verify per-chapter counts with a read query.

Optional: re-balance the existing 260 mis-routed tile rows by updating `chapter_id` in place rather than re-inserting (keeps the source set clean).

## 2. Pragmatic Reader edition

A second audience-tuned cut of the same manuscript, generated from the same `book_sources`, optimized for **operators who need to apply Calm Magic this quarter** — not the visionary/contemplative read.

**Use case (one sentence):**
> A founder, COO, or transformation lead who has 90 minutes on a flight and needs to walk off the plane with: a vocabulary for the friction they're feeling, a 5-step move for this week, and one diagnostic to run with their team Monday.

**What changes vs. the visionary edition**

| Dimension | Visionary edition | Pragmatic Reader |
|---|---|---|
| Voice | Essayistic, mythic | Operator, second person |
| Avg chapter length | 4–6k words | 1.5–2k words |
| Each chapter ends with | Reflection prompt | **Do this Monday** (1 action) + **Diagnostic** (3 questions) + **Anti-pattern** (1 trap) |
| Tile references | Woven into prose | Sidebar: "If you're stuck at tile X, try Y" |
| Tarot/Drift refs | Inline allusions | Footnotes only |
| Reading order | Linear (GLITCH→FREE) | Index by symptom ("my team can't decide", "we keep relaunching the same product") |

**Implementation**

1. **DB:** add `audience` to `book_chapter_drafts` is already there (`'general'` default). Add a new audience value `'pragmatic'`. No schema change needed.
2. **Synthesis prompt:** extend `book-synthesize-chapter` to accept `audience: 'visionary' | 'pragmatic'` and switch the system prompt + length budget accordingly. Pragmatic prompt enforces: ≤1800 words, 2nd person, ends with the three required blocks, cites tile IDs as sidebar refs.
3. **Admin UI:** in `BookManuscriptAdmin`, add an audience toggle next to "Synthesize" so each chapter can produce both drafts. Drafts are stored side-by-side; `is_current` per audience.
4. **Reader UI:** `BookChapter.tsx` already reads the current draft; add `?edition=pragmatic` query (and a toggle in the chapter header). Default = visionary.
5. **Landing:** on `/book` add a "Choose your edition" card — **The Field Guide** (visionary) vs **The Operator's Cut** (pragmatic) — with the one-sentence use case above.
6. **Symptom index** (pragmatic-only): a static page at `/book/operators-index` listing 12 common symptoms → recommended chapter + tile. Source from a small `data/operatorSymptoms.ts` file (no DB needed v1).
7. **Pre-order tier:** existing `tier` values are `reader | practitioner | org`. No new tier needed; pragmatic edition ships to all tiers as a second PDF/EPUB.

**Out of scope for v1**
- Translating pragmatic edition to FR (do after EN is validated).
- Per-reader symptom quiz (manual index is enough).
- Print version differences.

## Order of work
1. Tile routing fix + re-run seed (5 min).
2. Pragmatic synthesis prompt + audience flag (20 min).
3. Admin toggle + reader edition switch (20 min).
4. `/book` edition picker + operators-index page (30 min).
