## Goal

Add a new "Ontology Pipeline" progress panel that visualizes which of the 6 pipeline stages (Controlled Vocabulary → Metadata Standards → Taxonomy → Thesaurus → Ontology → Knowledge Graph) are satisfied for the current PRD, mapped to their owning Calm Magic layer.

## Approach

Extract the 6 ontology checks (already added to `LAYER_CHECKLIST` in both `PrdGeneratorWizard.tsx` and `PrdAssemblyPanel.tsx`) into a single shared module so the new panel and the existing checklists share one source of truth.

### New file

`src/utils/ontologyPipeline.ts`
- Exports `ONTOLOGY_PIPELINE_STAGES`: array of 6 stages with `{ id, label, description, layer, icon, check(content) }`
- Each `check` is the same regex used in the layer checklist
- Each entry knows its parent PRD layer (POLLENS/NOEMS/POEMS/TOTEMS)
- Exports `getPipelineProgress(content)` returning `{ stage, satisfied }[]` and an aggregate `completedCount`

### New component

`src/components/prd-generator/OntologyPipelinePanel.tsx`
- Props: `content: GeneratedContent`
- Renders a vertical stepper (mirrors the uploaded infographic): 6 stages stacked top-to-bottom, each row shows:
  - Stage number + name
  - Layer chip (color from existing `SEASON_COLORS`)
  - Status icon (`CheckCircle2` satisfied / `Circle` pending) using semantic tokens
  - Short description from the reference image
- Header shows `X / 6 stages covered` with a `Progress` bar
- Connector arrows between stages (CSS, no extra deps)
- Fully theme-token based — no raw colors

### Wiring

1. `src/components/calm-magic/PrdAssemblyPanel.tsx` — add panel to the existing PRD overview area. Place it inside the layer/checklist sidebar region (above or below the existing checklist), gated behind the same visibility as other PRD QA panels. One import + one JSX block.
2. `src/components/prd-generator/PrdGeneratorWizard.tsx` — render the same panel in the wizard's review step so users see pipeline coverage as they fill layers.
3. Refactor both `LAYER_CHECKLIST` blocks to reuse the regex/check from `ontologyPipeline.ts` (avoid duplication; keep label text local).

## Out of scope

- No new DB columns, no schema changes (uses existing PRD content fields)
- No bilingual copy in this pass (matches existing checklist convention)
- No analytics events
- ANTHEMS layer untouched (pipeline ends at Knowledge Graph)

## Files

- create: `src/utils/ontologyPipeline.ts`
- create: `src/components/prd-generator/OntologyPipelinePanel.tsx`
- edit: `src/components/calm-magic/PrdAssemblyPanel.tsx` (import + render + checklist refactor)
- edit: `src/components/prd-generator/PrdGeneratorWizard.tsx` (import + render + checklist refactor)
