# Make the book updates visible on the site

## Why nothing seems to have changed

The previous migration updated `book_chapters.summary` and inserted 30 manuscript-mapped `book_sources` rows, but on `/book` every chapter is still `status: outline` → rendered as "Coming soon" cards. From the home page (`/`) you only see the announcement banner, which never reflects chapter content. So the work landed in the database but never crossed into the UI.

The new PRD you just uploaded (Calm Magic Board v1.0, April 2026) is the up-to-date acronym/ontology source we'll anchor the book to.

## What I'll do

### 1. Ingest the PRD as a canonical book source
- Upload `calm-magic-board-prd.pdf` into the `book-manuscript` storage bucket.
- Create a `book_uploads` row with the parsed full text (already extracted) so `book-synthesize-chapter` can use it.
- Insert one `book_sources` row per chapter pointing to the relevant PRD section, `weight: 8` (canonical), `kind: 'upload'`:
  - GLITCH ← §1 Ontological Framework + §3 Polyvagal (friction → state)
  - DRIFT ← §2 Many-Worlds Quantum Layer + §10 Manifold/Shift Vectors
  - TUNE ← §5 Ontic State Finder + §8 Decision Log → Proverbial Abilities
  - LOVE ← §3 Polyvagal + §6 Autopoiesis/Nahual
  - MAGIC ← §4 53 Senses + §7 Pragmatic Imagination Metaphors
  - CALM ← §1 Seasons/Quadrants/64 Tiles/260-cycle + §9 Oneiric Alignment
  - FREE ← §2 QuantumBranchExplorer (re-observation) + §10 Attractors

### 2. Refresh chapter summaries with current acronyms
Rewrite each `book_chapters.summary` to reflect the v1.0 vocabulary explicitly:
- POLLENS · NOEMS · POEMS · TOTEMS · ANTHEMS (5 Seasons)
- SN · IN · IM · SM (4 Quadrants)
- 64 tiles / 260-cycle / window of tolerance
- Ventral · Sympathetic · Dorsal (Polyvagal)
- 53 Senses, Nahual, Oneiric Alignment, QuantumBranch, DistortedTorus

### 3. Synthesize readable draft chapters
Invoke the existing `book-synthesize-chapter` edge function for each of the 7 chapters. This writes a markdown draft into `book_chapter_drafts` (current=true) using the mapped `book_sources` + the new PRD upload. Move chapter `status` from `outline` → `drafting` so the chapter cards show the new summaries with a "Drafting" badge and a non-coming-soon state.

I'll leave `status: published` off until you've reviewed the drafts (chapters become readable on `/book/chapter/:slug` only when published — that's a separate "approve" action you trigger).

### 4. Make the work visible on /book
Add a compact "Manuscript progress" panel to `BookChapterIndex` showing per-chapter source counts (GLITCH 5 · DRIFT 5 · TUNE 5 · LOVE 5 · MAGIC 5 · CALM 7 · FREE 5 after the PRD is mapped) and a "Last synthesized" timestamp. Update `LivingManuscriptBand` stats to reflect the new totals automatically (already wired to live counts).

### 5. Optional — surface a "What's new" line on home
Add one line under the existing `BookAnnouncementBanner` content (only on `/book`, not home) saying "Drafts in motion: 7 chapters · last refresh {timestamp}" so future updates are obvious without you having to refresh manually.

## Out of scope (ask separately if you want them)
- Publishing chapters (making them readable to visitors)
- Paywall / preorder changes
- Translating drafts to French
- A new admin UI for approving drafts (the existing flow stays)

## Technical notes
- Migration tool used only for the canonical-source insert + chapter summary updates (data changes via insert tool, schema unchanged).
- Storage upload + edge-function invocation happen via a one-off admin script run from your authenticated session, OR I can script it server-side from a temporary admin-only edge function — tell me which you prefer.
- `book-synthesize-chapter` already exists and uses Lovable AI Gateway; no new secrets required.
- Acronym source-of-truth becomes the uploaded PDF + this plan; future chapter regenerations will reference it.

## Confirm before I build
1. Use the uploaded PRD as the canonical acronym source (yes/no).
2. Synthesize all 7 chapters now, or only GLITCH first as a quality check.
3. Add the "Manuscript progress" panel to `/book` (yes/no).
