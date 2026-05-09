## Goal

Extend the Calm Magic PRD checklist so it explicitly covers the 6 stages of the Ontology Pipeline (Controlled Vocabulary → Metadata Standards → Taxonomy → Thesaurus → Ontology → Knowledge Graph) from the uploaded reference, mapped onto the existing 5 PRD layers.

Note on "8 layer": the PRD currently has 5 ontological layers (POLLENS, NOEMS, POEMS, TOTEMS, ANTHEMS). I'll treat this as adding 6 ontology-pipeline checklist items distributed across those layers — no schema change, no new DB columns (preserves the strict 1:1 ontological-mapping rule).

## Mapping

| Pipeline Stage | PRD Layer | Field(s) checked |
|---|---|---|
| Controlled Vocabulary | POLLENS | `pollens_aspirations`, `pollens_cultural_elements` (terms, naming, glossary) |
| Metadata Standards | NOEMS | `noems_concepts`, `noems_mental_models` (descriptive/structural metadata) |
| Taxonomy | NOEMS | `noems_concepts`, `noems_intuitions` (parent-child hierarchy) |
| Thesaurus | POEMS | `poems_objects`, `poems_systems` (synonyms, related terms across surfaces) |
| Ontology | TOTEMS | `totems_data_architecture` (classes, relations, properties) |
| Knowledge Graph | TOTEMS | `totems_data_architecture`, `totems_access_controls` (graph + governance) |

Each new checklist item uses a case-insensitive regex on the concatenated field values, matching the pattern of the recently-added discipline items.

## Files to edit (keep both in sync)

1. `src/components/prd-generator/PrdGeneratorWizard.tsx` — `LAYER_CHECKLIST` (lines 145–172)
2. `src/components/calm-magic/PrdAssemblyPanel.tsx` — `LAYER_CHECKLIST` (lines 180–207)

## New checklist items

```text
POLLENS:
+ "Ontology — controlled vocabulary established"
  regex: /(vocabulary|glossary|terminology|naming|term)/i

NOEMS:
+ "Ontology — metadata standards defined"
  regex: /(metadata|schema|descriptor|attribute|tag)/i
+ "Ontology — taxonomy & hierarchy structured"
  regex: /(taxonomy|hierarchy|parent.?child|categor|classif)/i

POEMS:
+ "Ontology — thesaurus & synonym relations mapped"
  regex: /(thesaurus|synonym|alias|related term|equivalent)/i

TOTEMS:
+ "Ontology — classes, relations & properties defined"
  regex: /(ontolog|class|relation|property|properties|entit)/i
+ "Ontology — knowledge graph representation planned"
  regex: /(knowledge graph|graph|node|edge|triple|rdf|sparql)/i
```

## Out of scope

- No DB migration, no new PRD fields, no UI restructure
- ANTHEMS untouched (pipeline ends at Knowledge Graph, before market/narrative)
- No bilingual copy (matches existing checklist conventions)
