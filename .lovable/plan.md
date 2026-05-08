# Origins — methodological lineage of Calm Magic

The 10 uploads are not generic stock images — they're 10 **original methods** Jonathan crafted between 2013 and 2018 that explicitly seeded Calm Magic. The job is to anchor each one to the live Calm Magic construct it became, so visitors can see the work as a 13-year continuum rather than a recent invention.

The existing `/lineage` page compares Calm Magic to **external** frameworks (Theory U, Cynefin, Wardley…). These uploads are the **internal** lineage — separate surface, cross-linked.

## What each upload is, and where it connects

| # | Upload | Year | Calm Magic construct it seeded |
|---|---|---|---|
| 1 | **#Small Thinking Framework** — concentric layers (Practices · Ecologies · Technologies · Behaviors · Economies · Markets · Culture · Tekhne · Intelligences · Tools · Dialogues · Imagination · Reason · Knowledge Bases) | 2013 | The 5 PRD seasons (POLLENS → ANTHEMS) and the *Ontological Data Integrity* principle — nested layers as 1:1 columns. |
| 2 | **Applied Poetry** — "promoting a calmer future without helmets and less screens" + Calm Computing, Tangible Computing, Multisensory, Not Ocularcentric | 2016 | The **name** "Calm Magic" itself; relational intelligence as a felt-sense practice; the Tonalli Voice/Spatial branches. |
| 3 | **SMPL (FR)** — JOUER · RACONTER · CRÉER DU SENS · MODÉLISER · INSPIRER · IDÉATION · INVESTIGATION · EXÉCUTER · ARCHITECTURE & DESIGN · VISION & LOGISTIQUE on a Divergence ↔ Exploration ↔ Convergence axis | ~2017 | The Calm Magic Board verbs and the GL!TCH → DRIFT → TUNE descent. |
| 4 | **Architecture d'expériences — 12 interaction patterns** (proximity, camera vision, gyroscope, weather, gesture recognition, sonography…) | ~2017 | The "programmable environments" thesis behind Tonalli Spatial and the AI Observatory's sensing tier. |
| 5 | **Activités et livrables du processus UX** | 2018 | The Service Blueprint integration that translates the 5-season PRD into AI Observatory tiers. |
| 6 | **Noetical Flux · Perma Flux · Bio/Psy/Geo Flux** — courants de fond, design narratif, design de démarche, intelligences artificielles, immersion, capteurs, espaces réels | 2018 | The **Consciousness Manifold** (Event Field + 4 Time Lenses) and Drift's 5 axes (MAGIC · LOVE · CALM · OPEN · FREE). |
| 7 | **Proxémie · Noétique · Voix Intérieure · Praxis · Poiesis · Neuroleadership · Sérendipité** with vectors *Guiding, Dialogue, Listening, Playing, Touching, Empathy, Intuition, Non-verbal, Relational intelligence* | 2018 | The most direct ancestor — the **Relational Intelligence** core of Calm Magic. Almost a 1:1 with today's facilitation methodology. |
| 8 | **Design Thinking → Service Design → System Architecture** workflow | 2018 | Operational ancestor of the **Foundational Prompt Compiler** (PRD → tech stack JSON → agentic prompts). |
| 9 | **Concentric methods diagram** — Pensée systémique, Sensemaking, Story Making, Poésie appliquée, Praxis, Poiesis, Computational Design… | 2018 | Companion to #1; ancestor of the 6 Constellation visualization modes. |
| 10 | **IMAG1221** — Zen · Flow · Results · Encounters · Retreats | 2018 | Ancestor of the Paracosm Retreat structure (Azores 2026 lineage). |

## Where this lives on the site

**New page: `/origins`** — "Origins — The methods that became Calm Magic."

Structure:
1. **Hero** — one paragraph: "Calm Magic didn't appear in 2024. These ten methods, sketched between 2013 and 2018, are its bones."
2. **Vertical timeline** (2013 → 2018), one card per method:
   - Image (the original sketch, full-bleed inside the card).
   - Title, year, original language tag (EN / FR).
   - 2-line description of what the method *did* at the time.
   - **"Became →"** chip(s) linking to the live Calm Magic construct (board, season, retreat, lineage page, drift axis).
3. **Closing block**: "See where this goes →" with two CTAs — `/lineage` (external comparables) and `/calm-magic-board` (the live system).

**Footer link**: add `Origins` next to `Credits` in the secondary footer row.

**Cross-link from `/lineage`**: small "Internal lineage — see Origins" callout above the external comparables grid.

## Asset handling

- Copy all 10 sketches from `parsed-documents://…` into `src/assets/origins/` with stable, descriptive filenames (`small-thinking-2013.jpg`, `applied-poetry-2016.jpg`, `smpl-fr-2017.jpg`, `interaction-patterns-2017.jpg`, `ux-process-2018.jpg`, `flux-noetical-2018.jpg`, `relational-intelligence-2018.jpg`, `dt-sd-sa-2018.jpg`, `concentric-methods-2018.jpg`, `zen-flow-retreats-2018.jpg`).
- Author the metadata (year, language, "became" links) in `src/data/origins.ts` so it's the single source of truth.
- Add each image to the existing `/credits` registry (photographer = "Jonathan Bélisle", year = the sketch year) so attribution stays consistent with the system already in place. Editing them inline already works thanks to the previous turn.

## Bilingual

Three of the methods are originally in French (SMPL_FR2, the two 2018 captures, and the flux diagram). The page keeps the original-language title verbatim and adds an English gloss in parentheses — no translation of the sketches themselves. This honors the lineage and avoids re-rendering hand-drawn artifacts.

## Out of scope

- Editing the sketches or recreating them as vector diagrams.
- Adding these methods as filterable taxonomies inside `/calm-magic-board` (could be a follow-up if the page lands well).
- Generating new translations of the FR cards.
- Adding analytics on which lineage card drives most clicks (can layer on later).

## Files touched

- New: `src/pages/Origins.tsx`, `src/data/origins.ts`, `src/assets/origins/*` (10 jpgs + `index.ts`).
- Edited: `src/App.tsx` + `src/lib/routeRegistry.ts` (register `/origins`), `src/components/Footer.tsx` (footer link), `src/pages/Lineage.tsx` (callout to Origins), `src/assets/retreats/index.ts` *(extend the credits registry to include the 10 new sketches — same shape as today, so the existing `/credits` editor immediately edits these too)*.

## One question before I build

The "Became →" mapping above is my read of how each sketch became a current Calm Magic construct. **Is that mapping correct?** If any of the 10 should point somewhere else (e.g. you'd rather connect *Applied Poetry* to the Drift `MAGIC` axis instead of to Tonalli), tell me which to swap and I'll adjust the data file before generating the page.
