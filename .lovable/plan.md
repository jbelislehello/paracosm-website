## What we're building

One coherent **Rehearsal Arc** program mapped through the Calm Magic ontology, with:

- The **5 cognitive states** (LOVE · MAGIC · CALM · OPEN · FREE) as the shape of every session
- The **3 simultaneous journeys** (Narrative · Cognitive · Identity) as parallel tracks inside each state
- Applied at three tiers: **Foreplay (Trainings)** · **Foresight (Retreats)** · **Forecast (Residencies)**

Depth: **3 signature exercises per state**, per offering. Editorial voice on the site, facilitator voice in the deck & workbook.

---

## 1. Structured content (site-facing, editorial voice)

New file: `src/data/rehearsalArcProgram.ts`

Shape (one entry per offering — 3 trainings, 3 retreats, 3 residencies):

```text
Offering {
  id, tier ("foreplay"|"foresight"|"forecast"), slug, title, tagline,
  narrativePremise,       // the story people remember
  cognitiveModel,         // the framework they learn
  identityShift,          // who they become
  states: {
    LOVE   { intent, promptQuestion, exercises[3], journeys{N,C,I}, artifact },
    MAGIC  { … },
    CALM   { … },
    OPEN   { … },
    FREE   { … },
  },
  roadmap: RoadmapStep[]  // week/day-level arc
  commitmentContract      // FREE-state next-step template
}
```

Content is drafted for all 9 offerings using existing Paracosm brand cues (Wuxia, Prototypes Garden, PRD seasons). Each exercise has: name, intent, prompt, timing, materials, debrief.

New helper: `src/data/rehearsalArcMeta.ts` exports the ontology dictionaries (state descriptions, journey descriptions) used by both site and generators.

## 2. Public pages (editorial voice, existing design system)

New route + page: `src/pages/RehearsalArc.tsx` at `/programs/rehearsal-arc`

- Uses `EditorialSection`, `EditorialChapterHeader`, `EditorialPullQuote`, tone rotation `warm → paper → night → clay`
- Structure: masthead → 5-state ontology overview → 3-journeys explainer → tier chapters (Foreplay/Foresight/Forecast) → per-offering chapter cards linking to detail
- Registered in `src/lib/routeRegistry.ts` and included in sitemap

New route + page: `src/pages/RehearsalArcOffering.tsx` at `/programs/rehearsal-arc/:slug`

- Renders one offering: hero → 3-journeys tri-column → 5-state walkthrough (each state is its own chapter with exercises as cards) → roadmap timeline → commitment contract → CTA
- Reuses `usePageSeo`, JSON-LD via `courseSchema`
- Links from existing `/trainings/:slug`, `/events-and-retreats`, and residency pages via a small "See the full arc" callout

Nav: add "Program" entry to `EditorialSiteHeader` pointing at `/programs/rehearsal-arc`.

## 3. Mermaid diagrams (persistent artifacts)

Written to `/mnt/documents/`, surfaced as `<lov-artifact>` tags:

1. **5-state cycle** — LOVE→MAGIC→CALM→OPEN→FREE as a closed loop with the intent of each transition
2. **3 journeys × 5 states matrix** — flowchart showing how Narrative, Cognitive, Identity thread through each state
3. **Rehearsal Arc roadmap** — Foreplay → Foresight → Forecast with feedback loops
4. **Per-tier arc detail** — one diagram per tier (Trainings 65h/60h/60h, Retreats, Residencies) showing week-by-week states

These same diagrams are embedded as static SVG placeholders on the RehearsalArc page (rendered via `mermaid` client-side, already commonly used pattern; if `mermaid` isn't installed we'll `bun add mermaid` and lazy-load).

## 4. PPTX facilitator deck (pptx skill, facilitator voice)

`/mnt/documents/rehearsal-arc-facilitator-deck.pptx`

Generated with `pptxgenjs`, 1920×1080-equivalent, editorial palette (warm cream + charcoal + one accent per state):

- Cover · What is the Rehearsal Arc · 3 journeys · The 5 states (1 slide each with intent + prompt + signature exercise) · Foreplay chapter (3 training overviews) · Foresight chapter (3 retreat overviews) · Forecast chapter (3 residency overviews) · Facilitation cues · Commitment contract template · Close

~25 slides. Font pair: Georgia headers + Calibri body. Runs through mandatory QA: convert to PDF → images → inspect each → fix → re-render.

## 5. DOCX facilitator workbook (docx skill, facilitator voice)

`/mnt/documents/rehearsal-arc-workbook.docx`

Generated with `docx-js`, US Letter, Arial 12pt:

- TOC · How to use this workbook · The ontology (5 states + 3 journeys) · For each of the 9 offerings: 1 chapter with the 5-state arc, all 15 exercises (name/intent/prompt/timing/materials/debrief), roadmap table, commitment contract worksheet · Appendix: printable prompt cards

Runs through validation (`validate_document.py`).

---

## Technical section

**Files created**
- `src/data/rehearsalArcProgram.ts` — 9 offerings × 5 states × 3 exercises
- `src/data/rehearsalArcMeta.ts` — ontology dictionaries
- `src/pages/RehearsalArc.tsx` — index page
- `src/pages/RehearsalArcOffering.tsx` — per-offering page
- `src/components/rehearsal/StateChapter.tsx` — reusable 5-state chapter renderer
- `src/components/rehearsal/JourneysTriColumn.tsx` — Narrative/Cognitive/Identity tri-column
- `src/components/rehearsal/ExerciseCard.tsx`
- `src/components/rehearsal/RoadmapTimeline.tsx`
- `scripts/build-rehearsal-deck.mjs` — pptxgenjs generator
- `scripts/build-rehearsal-workbook.mjs` — docx-js generator
- `/mnt/documents/rehearsal-arc-5states.mmd`, `-journeys.mmd`, `-roadmap.mmd`, `-foreplay.mmd`, `-foresight.mmd`, `-forecast.mmd`
- `/mnt/documents/rehearsal-arc-facilitator-deck.pptx`
- `/mnt/documents/rehearsal-arc-workbook.docx`

**Files edited**
- `src/App.tsx` — register 2 new routes
- `src/lib/routeRegistry.ts` — add routes for sitemap
- `src/lib/sitemap.ts` — expand `/programs/rehearsal-arc/:slug` from `rehearsalArcProgram`
- `src/components/editorial/EditorialSiteHeader.tsx` — add "Program" nav
- Small "See the full arc" callout inserted in `TrainingDetail.tsx`, `EventsAndRetreats.tsx`, `ResidencyDetail.tsx`

**Constraints respected**
- Existing editorial tone tokens only — no new palette; per-state accents come from existing `--slide-*` tokens where they exist, otherwise from editorial tokens
- No black-background logos; Paracosm logo lockup rules preserved
- Semantic node integrity: each state/journey/exercise is a distinct field, no concatenation
- Contact CTAs route to `jbelisle@helloarchitekt.com`

**QA**
- PPTX: LibreOffice → PDF → `pdftoppm` → inspect every slide → fix → re-render until clean
- DOCX: `validate_document.py`
- Site: verify build passes, spot-check `/programs/rehearsal-arc` and one offering page

**Out of scope for this pass**
- Live booking / payment integration
- French (i18n) translation of the new pages — can follow
- Video assets

---

## Deliverables you'll see

1. Two new site pages you can click through
2. Six Mermaid diagram artifacts
3. One `.pptx` facilitator deck
4. One `.docx` facilitator workbook
