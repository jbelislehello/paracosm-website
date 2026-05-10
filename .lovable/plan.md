# Improve extractOntologyGraph heuristics

Scope: edits to `src/utils/extractOntologyGraph.ts` only. No UI, no DB, no LLM. Pure-function heuristics so the D3 preview reflects PRD content more faithfully.

## Goals
1. Catch more synonyms, relations, and hierarchy patterns from free-form PRD text.
2. Reduce noise: better stopword/length filtering, dedupe near-duplicates.
3. Stay deterministic and fast (regex + small loops, capped at 60 nodes / 120 links).

## Parsing upgrades

### Hierarchy (NOEMS, taxonomy)
Currently: only `A > B | A → B | A: B` at line start, single child split on `,/`.
Add:
- Indentation-based nesting on `noems_concepts` / `noems_intuitions`: track parent stack from leading spaces / `-`/`*` bullets (2-space or tab steps).
- Patterns: `A includes B, C`, `A consists of B and C`, `A is a kind of B`, `A subclass of B`, `B is part of A` (inverse).
- Split children on `,`, `;`, `/`, ` and `, ` & `.
- Multi-level chains: `A > B > C` produces both `A→B` and `B→C`.

### Synonyms / equivalence (POEMS, thesaurus)
Currently: `=`, `≡`, `aka`, `alias`, `(alias: …)`, `A / B`.
Add:
- `A also known as B`, `A a.k.a. B`, `A — also B`, `A (also called B)`, `A or B` (when both look like noun phrases of similar shape).
- `A := B`, `A == B`.
- `synonyms: A, B, C` (head term inferred from the bullet's parent line; if none, link A↔B, A↔C).
- Bidirectional link rendering (still one link, but mark `kind: 'synonym'`; dedupe ordered pair regardless of direction).

### Relations / class-property (TOTEMS, ontology)
Currently: `A.property`, and verbs `has|owns|contains|relates to|is-a|isa|extends|references`.
Add verb set: `uses`, `depends on`, `consumes`, `produces`, `belongs to`, `manages`, `governs`, `triggers`, `requires`, `provides`, `maps to`, `derived from`, `composed of`, `linked to`, `associated with`.
Add patterns:
- Triples `A — verb → B` and `A -[verb]-> B` (capture verb, store on link via new optional `label`).
- `A: type` (treat right side as class kind, not child).
- Multi-property: `Class { propA, propB, propC }` → class node + concept nodes + relation links.

### Knowledge graph (TOTEMS, knowledge-graph)
Currently: `A -> B`, `A → B`, `node: X`.
Add:
- `edge: A -> B [label]` capturing optional bracketed label.
- `(A)-[rel]->(B)` Cypher-ish.
- `A <-> B` (bidirectional graph link).
- Allow `_` and `.` in node tokens.

### Vocabulary (POLLENS)
- Also pull bullet items (not just quoted/Capitalized) when the bullet is short (≤4 words) and not a sentence (no trailing period or verb).
- Drop pure numerics, URLs, and items >60 chars.

## Quality controls
- Normalize labels: collapse internal whitespace, strip trailing punctuation, title-case only when input is ALL CAPS.
- Near-duplicate dedupe: also slug singular form (strip trailing `s` when length >4) so `Customer` and `Customers` collapse.
- Expand stopwords slightly (`also`, `etc`, `eg`, `ie`).
- Per-stage caps preserved; verb-link parsing runs after class/property to avoid double-creating nodes.
- Keep node-kind upgrade rule (vocabulary < concept < class < graph).

## Optional link metadata
- Extend `GraphLink` with optional `label?: string` to carry verb / edge label. Non-breaking; `OntologyGraphPreview` ignores it unless updated later (out of scope).

## Validation
- Add a small `__test__` block? No — keep file pure. Manually verify by pasting representative PRD snippets into the wizard and checking the preview shows expected nodes/edges.

## Files
- Edit: `src/utils/extractOntologyGraph.ts`

## Out of scope
- LLM extraction, persistence, UI changes to `OntologyGraphPreview`, link-label rendering, bilingual term handling.