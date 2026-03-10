

# Service Blueprint + AI Observatory Integration for PRD Generator

## What This Solves

The PRD generator currently compiles POLEN fragments into 5 season layers (POLLENS→ANTHEMS) without visibility into how each PRD field maps to AI de-risking, design decisions, and infrastructure readiness. The AI Observatory exists as a standalone visualization. This plan bridges them via a **Service Blueprint** layer that makes the 3-tier observatory (MAGIC/CALM/FREE) actionable within the PRD generation flow.

## Architecture

The Service Blueprint maps each PRD season to the 3 observatory tiers, creating a cross-reference that answers: *What strategic risk does this address? What human experience does it shape? What infrastructure does it require?*

```text
PRD Season        MAGIC (Strategy)         CALM (Experience)        FREE (Infrastructure)
─────────────────────────────────────────────────────────────────────────────────────────
POLLENS           Vision alignment         Trust baseline           Data pipeline readiness
NOEMS             AI literacy gaps         Mental model fit         Model evaluation needs
POEMS             Capability readiness     UX/IXD patterns          Deployment architecture
TOTEMS            Governance principles    Explainability needs     Monitoring & drift
ANTHEMS           Org alignment score      Adoption metrics         Release & uptime
```

## New Files

### 1. `src/components/calm-magic/tools/ServiceBlueprintObservatory.tsx`

A new component that renders a **Service Blueprint table/visualization** with:

- **Rows**: The 5 PRD seasons (POLLENS through ANTHEMS)
- **Columns**: The 3 Observatory tiers (MAGIC / CALM / FREE)
- **Each cell** contains:
  - A readiness indicator (progress bar) based on PRD field completion for that season
  - A risk signal badge (High/Medium/Low) derived from which fields are empty
  - A de-risking action label (e.g., "Validate AI literacy before prototyping")
  - Clickable to expand and see which specific PRD fields feed into that tier

- **Cross-layer telemetry flows** shown as colored connector lines between cells where dependencies exist (e.g., TOTEMS/FREE readiness affects POEMS/CALM trust score)

- **Blueprint Lanes** (horizontal swimlanes inspired by service design):
  - **Frontstage** (User-visible): Maps to CALM tier — what humans experience
  - **Backstage** (Org-visible): Maps to MAGIC tier — strategic decisions
  - **Support** (Infrastructure): Maps to FREE tier — technical sustain

- Accepts `prdData` prop (same interface as `FullPrdDisplay`) to compute readiness from actual PRD content

### 2. `src/utils/serviceBlueprintMapping.ts`

Utility that maps PRD fields to observatory tiers:

- `getPrdObservatoryMapping(prdData)` — returns a matrix of season × tier with readiness scores, risk levels, and recommended actions
- `getDeRiskingActions(season, tier, fieldCompletion)` — returns contextual de-risking recommendations
- `getCrossLayerDependencies()` — returns the dependency graph between cells

## Modified Files

### 3. `src/components/calm-magic/tools/InteractiveToolsPanel.tsx`

- Import `ServiceBlueprintObservatory`
- Expand grid to `grid-cols-12`
- Add tab trigger `📐 Blueprint`
- Add `TabsContent` for `"blueprint"` rendering the new component
- Add `'ServiceBlueprintObservatory': 'blueprint'` to `toolTabMap`

### 4. `src/components/calm-magic/tools/AIObservatoryModel.tsx`

- Add a "View Service Blueprint" link/button at the bottom of the PRD Integration section that switches to the Blueprint tab
- Import the mapping utility to show per-PRD-module readiness scores inline (enriching the existing PRD-Alpha/Beta/Gamma cards with actual tier readiness)

### 5. `src/components/calm-magic/garden/FullPrdDisplay.tsx`

- Add a small observatory readiness badge per season section header showing a 3-dot indicator (purple/teal/slate) reflecting MAGIC/CALM/FREE readiness for that season
- Uses the mapping utility to compute scores from actual field content

## How It Works End-to-End

1. User captures POLEN fragments across seasons on the Board
2. Auto-compilation triggers PRD generation via `generate-prd-stage` edge function
3. `FullPrdDisplay` renders the PRD with observatory readiness dots per season
4. The **Blueprint tab** shows the full service blueprint matrix — revealing which strategic, experiential, and infrastructural gaps remain
5. The **Observatory tab** links to the Blueprint for actionable next steps
6. De-risking actions guide users: "Before prototyping (POEMS), ensure AI Literacy (MAGIC) and Model Evaluation (FREE) are addressed"

## No Backend Changes

All mapping logic is client-side computation from existing PRD data. No new database tables or edge functions required.

