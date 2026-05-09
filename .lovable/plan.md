## Goal

Render a live D3 force-directed knowledge-graph preview from the user's PRD ontology fields, alongside the existing Ontology Pipeline panel. Nodes and edges are extracted from the same checklist inputs that drive pipeline progress.

## Approach

Two new files; one wiring change. d3 v7 is already a dependency.

### 1. Extraction utility

`src/utils/extractOntologyGraph.ts`

Pure function `extractOntologyGraph(content)` returns `{ nodes, links }`.

Per pipeline stage, parse the relevant PRD fields with lightweight heuristics — no LLM call:

| Source | Extraction rule | Node kind |
|---|---|---|
| `pollens_aspirations`, `pollens_cultural_elements` | Capitalized terms / quoted strings → `term` nodes | `vocabulary` |
| `noems_concepts`, `noems_mental_models` | Title-case phrases or bullet items → `concept` nodes | `concept` |
| `noems_concepts`, `noems_intuitions` | Patterns like `A > B`, `A: B`, `parent → child` → `parent_of` links | hierarchy edges |
| `poems_objects`, `poems_systems` | `A = B`, `A / B`, `A (alias B)` → `synonym_of` links | thesaurus edges |
| `totems_data_architecture` | `A has B`, `A relates to B`, `A.property` → `class` nodes + `relation` links | ontology edges |
| `totems_data_architecture`, `totems_access_controls` | Tokens after "graph:", "node:", "edge:" or `A -> B` → explicit graph nodes/edges | knowledge-graph edges |

Node shape: `{ id, label, kind: 'vocabulary'|'concept'|'class'|'graph', layer: PrdLayer, stageId }`.
Link shape: `{ source, target, kind: 'hierarchy'|'synonym'|'relation'|'graph' }`.

Cap to ~60 nodes / 120 links; dedupe by lowercased label. If nothing extractable, return empty.

### 2. D3 component

`src/components/prd-generator/OntologyGraphPreview.tsx`

- Props: `content: OntologyContent`, optional `height` (default 320)
- Wraps `Card` with header "Knowledge Graph Preview" + node/edge counts + a "Re-layout" button
- ResizeObserver-driven width, fixed height
- d3 force simulation: `forceLink`, `forceManyBody(-180)`, `forceCenter`, `forceCollide`
- Nodes colored by `kind` using semantic chart tokens (`hsl(var(--chart-1..4))`) — no raw colors
- Links styled by `kind`: hierarchy = solid, synonym = dashed, relation = solid thick, graph = double-stroke
- Hover: highlight node + neighbors, dim others; tooltip with kind/layer/source stage
- Empty state: friendly message pointing to which fields to fill, with a chip per missing stage
- Stops simulation on unmount; reuses ref pattern from `KnowledgeConstellation.tsx`
- Respects `prefers-reduced-motion` (skip animation, place via static layout fallback)

### 3. Wiring

`src/components/prd-generator/OntologyPipelinePanel.tsx`

Render the graph preview directly under the stage list when `compact !== true`. Hidden in compact mode.

Both existing consumers (`PrdAssemblyPanel.tsx`, `PrdGeneratorWizard.tsx`) automatically pick it up — no extra changes.

## Out of scope

- No DB persistence of the extracted graph
- No LLM-based extraction (heuristic only; can be upgraded later)
- No drag-to-edit, no node creation UI
- No bilingual copy

## Files

- create: `src/utils/extractOntologyGraph.ts`
- create: `src/components/prd-generator/OntologyGraphPreview.tsx`
- edit: `src/components/prd-generator/OntologyPipelinePanel.tsx` (render preview when not compact)
