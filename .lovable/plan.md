# Add the missing OPEN chapter

The Calm Magic axes are **MAGIC · LOVE · CALM · OPEN · FREE**, but the book currently jumps from CALM straight to FREE. OPEN is missing in three places: the database, the chapter index, and the reading-journey progress bar.

## Where it goes

OPEN sits between CALM (designing the system / ontology + requirements) and FREE (operating in flow). It covers what the PRD already encodes in its `open_*` fields: **ontology and graph, real workflow, adjustment plan** — the live operationalization that turns a designed system into something the org actually inhabits and tunes.

Final order:

```text
1 GLITCH  · Naming the Friction
2 DRIFT   · Pattern Exploration
3 TUNE    · Intentional Commitment
4 LOVE    · Relational Infrastructure
5 MAGIC   · Pragmatic Imagination
6 CALM    · Designing the System
7 OPEN    · Living the Ontology    ← NEW
8 FREE    · Operating in Flow      ← reindexed from 7
```

Working title and summary for the new chapter:

- **Title:** Living the Ontology
- **Summary:** Where the designed system meets real workflow — ontology, graph, and the adjustment plan that keeps the org tunable.

## Steps

1. **Database migration**
   - Bump `book_chapters.order_index` of the FREE chapter (`operating-in-flow`) from 7 → 8.
   - Insert new OPEN chapter row: `slug='living-the-ontology'`, `phase='OPEN'`, `order_index=7`, `status='outline'`, `is_free_sample=false`, with the summary above.
   - Attach `book_sources` rows mapping the canonical PRD's `open_ontology_and_graph`, `open_real_workflow`, and `open_adjustment_plan` sections to the new chapter (mirrors the pattern used for the other six chapters).

2. **Frontend phase list (3 files, additive only)**
   - `src/components/book/ReaderProgressBar.tsx` — add `{ key: "OPEN", label: "Open" }` between CALM and FREE in the `PHASES` array.
   - `src/components/book/BookChapterIndex.tsx` — add `OPEN: "Open"` to `PHASE_LABEL` and insert the OPEN seed row between CALM and FREE in the fallback `SEED` list, with the FREE seed row's `order_index` bumped to 8.
   - `src/pages/BookChapter.tsx` — add `OPEN: "Open"` to `PHASE_LABEL`.
   - No styling changes; the progress bar's grid already uses `grid-cols-N` derived from `PHASES.length`, so it auto-expands to 8 segments.

3. **Synthesize and publish the OPEN draft**
   - Run the same `node synth.mjs` flow used for the other chapters, scoped to the new OPEN chapter, with `google/gemini-2.5-pro` and the canonical PRD's OPEN-season material as grounding.
   - Reuse the `_tmp_chapter_publish` staging table + the publish path (update `book_chapters.published_excerpt`, `status='published'`, `published_at=now()`; flip prior `book_chapter_drafts.is_current` to false; insert new draft with `is_current=true`).

4. **Verification**
   - `/book` reading journey shows 8 segments: GL!TCH · Drift · Tune · Love · Magic · Calm · **Open** · Free.
   - `/book/chapter/living-the-ontology` renders the published draft with prev=Calm and next=Free in the chapter nav.
   - `/book/chapter/operating-in-flow` shows "Chapter 8" badge and prev=Open.

## Out of scope

- No visual redesign of the progress bar or chapter index.
- No changes to the other six published drafts.
- No new edge functions; reuse existing synth + publish flow.
