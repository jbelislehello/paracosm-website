# Export "Calm Magic System" PRD for Crewdle

You want a PRD that captures **calm-magic.com itself** — read through the Calm Magic framework — and packaged so Crewdle can use it as a build/orchestration brief. Since the site is already a complete 3-garden / 5-axis / 5-season system, the export must mirror that ontology faithfully (per the *Ontological Data Integrity* core rule — strict 1:1 mapping, no concatenation).

This is a **one-shot artifact generation task**, not a UI feature. I'll run scripts that produce downloadable files and skip building any new app surface.

---

## What gets produced (in `/mnt/documents/`)

1. **`calm-magic-system-prd.md`** — the human-readable PRD, structured by the 5 seasons (POLLENS → NOEMS → POEMS → TOTEMS → ANTHEMS), with the 3 Gardens, 5 MAGIC compasses, and 5 axes (LOVE/MAGIC/CALM/OPEN/FREE) cross-mapped on every section. This is the "lecture" turned into a buildable spec.
2. **`calm-magic-system-prd.yaml`** — the same content as a structured YAML, matching the field shape Crewdle's Dream & Learn module expects (mirrors `prdExport.ts` schema: `pollens_*`, `noems_*`, `poems_*`, `totems_*`, `anthems_*`).
3. **`crewdle-manifest.json`** — a Crewdle-oriented manifest: agent crews, divergent/convergent roles, edge-AI placement notes, consent & provenance hooks, and feature-by-maturity gating (the "preparedness audit" framing already used in `book.json`).
4. **`calm-magic-system-prd.pdf`** — printable PDF rendering of the markdown for sharing.

All four are versioned (`_v1`); future revisions become `_v2`, etc.

---

## Content shape (per file)

### Markdown PRD sections

```
1. Executive Lecture            (the recursive read: site = framework running on itself)
2. System Ontology              (3 Gardens × 5 Compasses × 5 Axes matrix)
3. POLLENS — raw inputs         (glitch logs, dreams, voice, check-ins, tile data)
4. NOEMS — knowledge objects    (constellation, resonance, OECD, semantic clusters)
5. POEMS — narrative artifacts  (PRDs, Tarot, Wuxia, Drift, Retreat)
6. TOTEMS — tech architecture   (Supabase schema, RLS, edge functions, agentic compiler)
7. ANTHEMS — go-to-market       (3-tier observatory, Spring 2026 offer, Crewdle bridge)
8. Crewdle Operationalization   (crews, maturity gates, edge placement)
9. Constraints & Non-Goals      (no dashboard, no forced roadmap, no ml5, fabric v7 rules)
10. Success Criteria & Hooks    (what "done" looks like for each season)
```

### YAML — uses the exact field names from `src/utils/prdExport.ts` and `src/utils/formatFoundationalPrompt.ts` so it round-trips cleanly with the in-app PRD editor if ever imported.

### Crewdle manifest (JSON)

```
{
  "project": "calm-magic-system",
  "orchestrator": "crewdle.ai",
  "crews": [
    { "name": "Pollen Harvester",  "role": "divergent",  "season": "POLLENS",  "edge": "client" },
    { "name": "Noem Distiller",    "role": "convergent", "season": "NOEMS",    "edge": "edge"   },
    { "name": "Poem Composer",     "role": "divergent",  "season": "POEMS",    "edge": "edge"   },
    { "name": "Totem Architect",   "role": "convergent", "season": "TOTEMS",   "edge": "cloud"  },
    { "name": "Anthem Broadcaster","role": "convergent", "season": "ANTHEMS",  "edge": "cloud"  }
  ],
  "maturity_gates": [...],
  "consent_provenance": {...},
  "feature_flags_by_readiness": {...}
}
```

---

## How it gets built

A single Python script (`/tmp/build_crewdle_prd.py`) that:

1. Imports the canonical ontology directly from the source files (`src/data/gardens.ts`, `src/data/seasonDefinitions.ts`, `src/data/prdDimensions.ts`, `src/data/femininePrinciples.ts`, `docs/calm-magic-expansion-journal.md`) by parsing them — no hardcoded duplication, so the artifact stays in sync with the codebase.
2. Calls the Lovable AI Gateway (`/tmp/lovable_ai.py` skill, model `google/gemini-3-flash-preview`) once per season to draft the section text using the parsed ontology + the recursive-lecture framing already established in this conversation. Each call writes into the exact field name expected by the PRD schema (1:1 mapping — no concatenation of distinct ontological entities).
3. Writes the four output files to `/mnt/documents/`.
4. Renders the PDF via a lightweight markdown→PDF step.
5. **QA pass**: I'll re-open each file, grep for placeholder leakage (`xxxx`, `lorem`, missing field warnings), verify all 30 PRD fields are populated, and confirm the JSON manifest validates. Fixes happen before delivery.

---

## What I will NOT do

- Won't create a new in-app PRD record or DB row — this is an external export.
- Won't build any UI page or component for this task (no new routes, no React work).
- Won't invent a Crewdle API surface I haven't verified — the manifest follows the public framing already in `book.json` and `DreamAndLearn.tsx` (preparedness audit, divergent/convergent crews, edge-AI placement, consent & provenance). If Crewdle has a stricter spec you want matched, share it and I'll regenerate `_v2`.
- Won't re-add a dashboard or force-roadmap framing (per core memory: emergence > force).

---

## Open question (optional — I can proceed without it)

Do you want the PRD's recursive-lecture sections written in **English only** or **bilingual (EN + FR)**? The site is bilingual (`src/i18n/`), and Crewdle materials in `book.json` exist in both. Default if you don't answer: **English only** for v1, with a FR companion file generated as `_v2` if you ask.

---

## Deliverable preview (after approval, you'll see in chat):

```
<presentation-artifact path="calm-magic-system-prd.md" mime_type="text/markdown"></presentation-artifact>
<presentation-artifact path="calm-magic-system-prd.yaml" mime_type="application/yaml"></presentation-artifact>
<presentation-artifact path="crewdle-manifest.json" mime_type="application/json"></presentation-artifact>
<presentation-artifact path="calm-magic-system-prd.pdf" mime_type="application/pdf"></presentation-artifact>
```

Approve and I'll generate all four.
