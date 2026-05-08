
## What we're building

The current `Topologies → Ancestry` view is a flat 2-column grid. We'll replace it with a real **temporal arc 2013→2018**, give every origin compass a click-to-jump path into its live manifestation, and overlay a second class of compasses — the 20 **Wild Cookie thematic compasses** from the uploaded PDF — as a "framing layer" that helps the user route a raw idea into the closest executable board surface (a topology view mode, a board tab, or an adjacent tool).

Two compass families, one ontology:

```text
Origin compasses (2013–2018)         Wild Cookie compasses (thematic)
─ #Small Thinking ────────────────┐  ─ The UX Consciousness
─ Applied Poetry                  │  ─ Body Maps · IoT · Cognitive Maps
─ SMPL · Interaction Patterns     │  ─ Ubiquitous · Prediction Engines
─ UX Process · Flux Noétical      │  ─ Worldbuilding · Dialogic Imagination
─ Relational Intelligence         │  ─ Futurogram · Purpose & Meaning
─ DT→SD→SA · Concentric Methods   │  ─ Noetic Functions · Human Animal
─ Zen·Flow·Encounters·Retreats ───┘  ─ Ecological Truth · Reinventing Edu
                                     ─ Calmness · Meaningfulness
                                     ─ Playfulness · Calm Computing
                                     ─ Usefulness · Serendipity
```

Both families resolve into the **same set of executable targets** (topology view modes, board tabs, adjacent pages), so picking either kind of compass moves the canvas in place.

---

## Visual structure of the new Ancestry view

```text
┌─────────────────────────────────────────────────────────────────┐
│  [Filter]  Origin compasses · Wild Cookie compasses · All       │
│  [Stage]   Explore · Frame · Ideate · Vision · Design · Ship    │
├─────────────────────────────────────────────────────────────────┤
│  2013 ─────── 2016 ─────── 2017 ─────── 2018 ─────── Today     │
│   ●            ●            ● ●          ● ● ● ● ●    ● ● ●    │
│   │            │            │ │          │ │ │ │ │    │ │ │    │
│  Small      Applied        SMPL Patt    UX Flux Rel DT Conc Zen│
│  Thinking   Poetry                                              │
├─────────────────────────────────────────────────────────────────┤
│  Hovered/selected node expands inline:                          │
│    • Sketch thumbnail · year · language                         │
│    • Vocabulary chips                                           │
│    • "Frames" — Wild Cookie compasses that share its grammar    │
│    • "Became →" buttons that switch the canvas in place         │
└─────────────────────────────────────────────────────────────────┘
```

Below the arc, a **second band** ("Frame your idea") presents the 20 Wild Cookie compasses grouped by the PDF's stage taxonomy (Initial Exploration · Problem Identification · Ideation · Vision · Understanding Users · Tech · Ethics · Learning · UX · Practicality · Wellness · Critical Thinking). Each Wild Cookie compass card shows: name, one-line description, quote, timing, and a single primary "Route to →" button that jumps to its closest executable surface.

---

## Files

**Edit**
- `src/components/calm-magic/topologies/OriginsAncestryView.tsx` — replace the grid with the arc + framing band layout described above; keep the same `onSwitchTopologyMode` / `onSwitchBoardTab` props so no plumbing change is needed in `TopologiesTab` or `CalmMagicBoard`.

**Create**
- `src/data/wildCookieCompasses.ts` — typed array of all 20 thematic compasses from the PDF (name, description, quote, timing, tools, practices, stage tag). Each entry also declares `routesTo: { kind: 'topology'|'board'|'external', target: ... }` and `relatesToOriginSlugs: string[]` so the UI can draw the cross-family connection.
- `src/components/calm-magic/topologies/AncestryArc.tsx` — the SVG/CSS temporal arc (responsive: horizontal on desktop, vertical timeline on mobile per current 390px viewport).
- `src/components/calm-magic/topologies/WildCookieFramingBand.tsx` — the stage-grouped grid of Wild Cookie compass cards with the single "Route to →" CTA.

No DB, no edge functions, no business-logic changes — pure frontend/presentation.

---

## Mapping (Wild Cookie → executable surface)

A condensed sample of the routing table that will live in `wildCookieCompasses.ts` (all 20 will be filled in):

| Wild Cookie compass | Stage | Routes to | Relates to origin |
|---|---|---|---|
| The UX Consciousness | Problem ID · UX | Board tab `prd-assembly` | dt-sd-sa-2018, ux-process-2018 |
| Body Maps | Understanding Users | Board tab `window-of-tolerance` | relational-intelligence-2018 |
| IoT / Internet of Bodies | Tech | Topology `coordinates` | interaction-patterns-2017 |
| Cognitive Maps | Learning | Topology `projection` | small-thinking-2013 |
| Ubiquitous Computing | Tech | `/tonalli` | applied-poetry-2016, interaction-patterns-2017 |
| Prediction Engines | Tech · Practicality | Topology `flow` | flux-noetical-2018 |
| Worldbuilding Narratives | Vision | Board tab `expressivity` | applied-poetry-2016 |
| Dialogic Imagination | Ideation · Critical Thinking | Topology `ancestry` (self) + `/glitch-methodology` | smpl-fr-2017 |
| Futurogram | Tech · Practicality | Topology `cycles` | flux-noetical-2018 |
| Purpose & Meaning at Work | Vision | Board tab `constellation` | concentric-methods-2018 |
| The Noetic Functions | Learning | Topology `flow` | flux-noetical-2018, relational-intelligence-2018 |
| The Human Animal | Understanding Users | Topology `coordinates` | relational-intelligence-2018 |
| Ecological Truth & Eco Anxiety | Ethics · Wellness | `/drift` | flux-noetical-2018 |
| Reinventing Education | Learning | `/pattern-encyclopedia` | concentric-methods-2018 |
| The Calmness | Wellness | Board tab `window-of-tolerance` | applied-poetry-2016 |
| Meaningfulness | Vision | Board tab `prd-assembly` | dt-sd-sa-2018 |
| Playfulness | Ideation | Board tab `expressivity` | applied-poetry-2016 |
| Calm Computing | UX | `/tonalli` | applied-poetry-2016 |
| Usefulness | Practicality | Board tab `prd-assembly` | dt-sd-sa-2018 |
| Serendipity | Initial Exploration | Topology `ancestry` (browse mode) | concentric-methods-2018 |

---

## Interaction details

- **Arc nodes**: hover reveals sketch + vocabulary; click selects the node and scrolls a detail panel into view with its `Became →` buttons (existing routing from `originsToTopology.ts`).
- **Cross-family link**: when a Wild Cookie card is hovered, the arc highlights its `relatesToOriginSlugs` nodes (subtle glow). When an origin node is selected, matching Wild Cookie cards in the band below get a primary border.
- **Stage filter** (`Explore · Frame · Ideate · Vision · Design · Ship`): filters both bands so the user can ask "what do I have available for the Vision stage?" and see both ancestral and thematic compasses at once.
- **Routing**: every CTA uses the existing `onSwitchTopologyMode` / `onSwitchBoardTab` props or `react-router` `Link` for external pages. No new state is added to the board.
- **Mobile (390px)**: arc collapses into a vertical timeline; framing band becomes a single-column stack with sticky stage headers.

---

## Out of scope

- No changes to other topology view modes, no edits to existing pill / banner components.
- No DB persistence for compass selection — purely a navigational aid.
- No new images: Wild Cookie compasses render as text+icon cards (Lucide icons by stage). The PDF itself stays as source-of-truth, not as imported assets.
- No i18n duplication this pass — Wild Cookie text ships in English (matching the PDF); origins keep their existing FR/EN mix.
