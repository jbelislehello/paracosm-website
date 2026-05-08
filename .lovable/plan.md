# Wire the Origins compasses into the Calm Magic Board

You're right — building `/origins` as a standalone gallery told the story but didn't *operationalize* it. Each of the 10 compasses is a **topology of meaning** that the board already runs structurally. The board's `Topologies` tab is literally a gallery of nine view modes (isometric, diamond, spiral, charts, coordinates, cycles, flow, projection, observatory). The origins belong inside that gallery as **the ancestral layer** — the sketches the live geometries descended from.

## Where the connections actually live

Mapping each origin compass to a current board surface (not a marketing link, the actual rendered geometry):

| Origin compass | Current board surface |
|---|---|
| **#Small Thinking** — concentric ontology | `Topologies → spiral` (SpiralLayout) and the 5-season PRD ring stack |
| **Concentric Methods (2018)** | `Topologies → constellation` (ConstellationLayout) |
| **Noetical / Perma / Bio-Psy-Geo Flux** | `Topologies → flow` (InformationFluxDiagram) and `Cosmological3DManifold` (4 Time Lenses) |
| **Proxémie · Praxis · Poiesis** | `Window of Tolerance` + `Relational Intelligence` overlays — the felt-sense engine |
| **SMPL — Divergence/Exploration/Convergence** | `Topologies → diamond` (DoubleDiamondLayout) + GL!TCH→DRIFT→TUNE descent |
| **Applied Poetry** | `Expressivity` tab (multisensory tools surface) |
| **DT → SD → SA workflow** | `PRD Assembly` tab (Foundational Prompt Compiler) |
| **12 interaction patterns** | Pattern Encyclopedia + Tonalli Spatial sensors |
| **UX activities & deliverables** | Service Blueprint (AI Observatory tiers) |
| **Zen · Flow · Encounters · Retreats** | Paracosm container around the board (retreat cadence) |

The first five are *internal* to the board; the rest are *adjacent* surfaces.

## What to build

### 1. New Topologies view mode: `ancestry`

Add `'ancestry'` to `TopologyViewMode` in `ViewModeSelector.tsx` with icon (Sparkles or Compass) and label "Ancestry". Renders a new component `OriginsAncestryView` inside `TopologiesTab`'s render switch.

`OriginsAncestryView` shows the 10 origin compasses arranged as a **temporal arc** (2013 → 2018) with each card visually tethered to the live view mode it became:

```text
   2013        2016         2017              2018
    ●———————————●—————————————●———————————————●●●●●●
    │           │             │ │             │
   Small       Applied       SMPL Interaction  Flux · Relational ·
  Thinking     Poetry         FR  Patterns     Concentric · DT-SD-SA ·
    │           │             │ │             │ UX · Zen-Retreats
    ▼           ▼             ▼ ▼             ▼
  spiral    expressivity   diamond ┐       flow / constellation /
                                   │       window-of-tolerance /
                              pattern-      prd-assembly
                              encyclopedia
```

Clicking a "Became →" target switches `viewMode` (or `activeView` for cross-tab targets) **in place** — no navigation away. Each card also exposes its vocabulary chips (Praxis, Poiesis, Noétique, etc.) which are the same primitives used in tile metadata, so we get a real semantic match rather than just a link.

### 2. Topology cards → ancestor pill

Inside the existing topology views (spiral, diamond, flow, constellation), add a small pill in the top-right corner of the canvas reading e.g. **"Lineage: #Small Thinking, 2013"** with hover/click opening a popover that shows the original sketch + the 2-line origin blurb. This is the *ontological annotation* — the user can always see which historical compass the live geometry descends from.

Component: `<TopologyAncestryPill mode={viewMode} />` driven by a new `src/data/originsToTopology.ts` map (single source of truth used by both the ancestry view and the pill).

### 3. PRD-assembly cross-link

On the `PRD Assembly` tab header, surface a single line: *"Workflow ancestry: Design Thinking → Service Design → System Architecture (2018)"* with a hover-popover showing the dt-sd-sa sketch. Same pattern, no new tab.

### 4. Window-of-tolerance cross-link

Same treatment on `Window of Tolerance`: *"Relational ancestry: Proxémie · Noétique · Praxis · Poiesis (2018)"*.

### 5. Keep `/origins` as the public-facing gallery

The standalone `/origins` page stays as the marketing/SEO surface. The board integration is for *practitioners inside the system* — different audience, different need.

## Files

- New: `src/components/calm-magic/topologies/OriginsAncestryView.tsx`, `src/components/calm-magic/topologies/TopologyAncestryPill.tsx`, `src/data/originsToTopology.ts`.
- Edit: `src/components/calm-magic/topologies/ViewModeSelector.tsx` (add `'ancestry'`), `src/components/calm-magic/topologies/TopologiesTab.tsx` (render switch + pill in canvas overlay), `src/pages/CalmMagicBoard.tsx` (small ancestry callouts on `prd-assembly` and `window-of-tolerance` headers — additive only).

## Out of scope this round

- Re-styling existing topology views.
- Editing the 10 sketches.
- Moving the public `/origins` gallery into the board (kept as separate surface).
- Adding ancestry pills to the *adjacent* surfaces beyond `prd-assembly` and `window-of-tolerance` (Tonalli, Pattern Encyclopedia, Retreats can come in a follow-up).

## One choice for you before I build

The ancestry pill on each live topology view — should it be:

**A. Always-on, subtle** — small caption badge bottom-left of every topology canvas, never dismissible. Constant felt-sense of lineage.

**B. Optional toggle** — a "Show lineage" switch in the Topologies header. Off by default, on for the curious.

**C. Hover-only** — pill appears only when hovering the canvas. Cleanest, almost invisible until invoked.

My recommendation: **A**. It matches the Ontological Data Integrity principle — the ancestry isn't decoration, it's the schema itself. But say the word if you'd rather B or C.
