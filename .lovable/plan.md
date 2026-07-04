
## Goal

Turn the Rehearsal Arc into one coherent, DB-backed program where every offering — Trainings, Retreats and Residencies — is a first-class "training" with its roadmap steps exposed as clickable modules (like `/trainings/glitch/modules/1`), and every offering ships its own trio of downloadable artifacts (Roadmap PDF, Facilitator Playbook, Program Doc).

## Deliverables

- 9 offerings live in `public.trainings` (3 already there, 6 new)
- 6–8 modules per offering in `public.training_modules`, sourced from each offering's `roadmap[]`
- Unified module route works for all tiers (`/trainings/{slug}/modules/{n}`), with a tier-aware theme (warm/night/clay)
- Cross-links from Rehearsal Arc pages → module pages, and from `/events-and-retreats` / residencies → the same
- 27 regenerated PDFs (9 × Roadmap · Facilitator Playbook · Program Doc), replacing the 2 combined PDFs
- Header dropdown deep-links updated to the new module URLs
- `MyRehearsalArc` dashboard reads module completion instead of state toggles

## Plan

### 1. Schema — extend `trainings` and `training_modules`

Single migration:

- `trainings` — add `tier text` (`foreplay|foresight|forecast`), `tone text` (`warm|night|clay`), `narrative_premise text`, `cognitive_model text`, `identity_shift text`, `commitment_prompt text`, `commitment_template text`, `commitment_witness text`, `roadmap_pdf_url text`, `playbook_pdf_url text`, `program_doc_pdf_url text`. Backfill existing 3 rows.
- `training_modules` — add `focus_state text` (`LOVE|MAGIC|CALM|OPEN|FREE`), `when_label text`, `outcome text`, `exercises_json jsonb` (the 3 exercises for that state), `journeys_json jsonb` (narrative/cognitive/identity lines).
- Grants on new columns are inherited; RLS already public-read for `status='published'`.

### 2. Seed the 6 new offerings

Data-insert migration (via insert tool) writing all 9 offerings + all roadmap steps from `src/data/rehearsalArcProgram.ts` into `trainings`/`training_modules`. Existing GL!TCH/Drift/Tune rows get their tier/tone/premise fields backfilled and their `training_modules` are replaced with roadmap-derived rows so the mapping is uniform across all 9.

### 3. Module page — tier-aware refactor

`src/pages/TrainingModule.tsx`:

- Fetch tier + tone from parent training; swap the hard-coded dark shell for the editorial tone tokens (`editorialTone[tone]`) so retreats read "clay/night", not dark-slate.
- Render new fields: `focus_state` badge (colored dot using `STATE_META[focus].accent`), `when_label`, `outcome`, the 3 exercises (name / intent / prompt / timing / materials / debrief), the 3-journey block, artifact line.
- Keep the video placeholder and quiz block (quizzes remain optional per module — none seeded for the 6 new offerings).

### 4. Detail page — unify

`RehearsalArcOffering.tsx`: replace the roadmap `<ol>` with real `<Link>`s to `/trainings/{slug}/modules/{n}`. `TrainingDetail.tsx`: already generic; add tier/tone lookup from DB so retreat/residency detail pages inherit the right editorial tone.

Add a new route alias `/programs/rehearsal-arc/:slug/modules/:order` that renders `TrainingModule` so the arc URL space stays coherent (both routes resolve to the same page).

### 5. Cross-links

- `RehearsalArc.tsx`, `EventsAndRetreats.tsx`, `AgenticResidency.tsx`: each offering card links to its detail + a "Start with module 01" secondary link.
- `EditorialSiteHeader.tsx`: repoint the Retreats/Residencies dropdown entries fixed last turn to `/trainings/{slug}` (unified) instead of anchor hashes.

### 6. Artifact regeneration (27 PDFs)

Rework the build scripts under `scripts/`:

- `build-rehearsal-roadmap.mjs` (new) — one A4 landscape PDF per offering, showing the 6–8 roadmap steps as a horizontal ribbon with state colors and outcomes.
- `build-rehearsal-playbook.mjs` (refactor of `build-rehearsal-deck.mjs`) — one PPTX per offering: cover · 3 journeys · 5 state chapters (intent + prompt + 3 exercises) · roadmap · commitment. Loop over the 9 offerings, write to `public/downloads/{slug}-facilitator-playbook.pptx` and convert to PDF.
- `build-rehearsal-program-doc.mjs` (refactor of `build-rehearsal-workbook.mjs`) — one DOCX per offering: narrative premise, cognitive model, identity shift, module-by-module curriculum, exercises table, commitment contract. Convert to PDF.
- `build-rehearsal-pdfs.mjs` — loop the 9 slugs and convert every generated PPTX/DOCX. Writes 27 files into `public/downloads/`.
- After generation, run visual QA on each PDF (pdftoppm → read each page image, fix layout issues, re-render) as required by the pptx/docx skills.
- Update `GatedDownloadButton` usages on `RehearsalArc.tsx` and `RehearsalArcOffering.tsx` to point at the per-offering filenames (populated from the new DB columns `roadmap_pdf_url` / `playbook_pdf_url` / `program_doc_pdf_url`).

### 7. Dashboard

`MyRehearsalArc.tsx`: replace the 5-state toggles with a module-completion checklist per offering, keyed on `playbook_id = "rehearsal-arc:{slug}"` and `nodes_completed = ["module-1", ...]`. Progress is computed as completed/total modules.

### 8. SEO / structured data

Extend `courseSchema` calls on the detail pages to use the module list as `hasPart` (each module = `LearningResource`). Rehearsal Arc index already emits `ItemList` — leave as-is.

## Out of scope

- No changes to quiz content or `training_questions` for the 6 new offerings (can be added later).
- No changes to Calm Magic Board tier semantics.
- No new videos — existing video placeholder pattern is reused.
- No pricing/enrollment flow changes.
- No i18n — content stays English-first, matching current Rehearsal Arc.

## Technical details

- Route addition in `src/App.tsx`: `/programs/rehearsal-arc/:slug/modules/:order` → `<TrainingModule />`.
- Reuse `STATE_META` accent colors in module headers to keep the ontology visible.
- `rehearsalArcProgram.ts` stays as the seed source of truth; a one-shot seeding script is fine — no runtime dependency on the file after seeding.
- PDF outputs use the existing `soffice --headless --convert-to pdf` pipeline in `scripts/build-rehearsal-pdfs.mjs`; keep filenames stable so `GatedDownloadButton` links don't break.
- Playbook filenames: `{slug}-roadmap.pdf`, `{slug}-facilitator-playbook.pdf`, `{slug}-program-doc.pdf`.

## Verification

- `bun run build` clean.
- Visit `/trainings/think-like-a-forest/modules/1` and confirm tone renders clay/warm (not dark slate), state badge shows LOVE with correct accent.
- Confirm all 9 detail pages list a linkable module ordered list.
- Confirm each of 27 PDFs downloads with correct content (page-1 image inspection).
- Confirm signed-out user hitting a download opens `SignupPromptModal`.
