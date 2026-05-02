## Goal

Create a new public page that positions **Calm Magic** against the closest existing frameworks, so visitors (and skeptical practitioners) can quickly see what's familiar, what's different, and why it matters in the agentic era. Include a thoughtful section on Jason Hobbs' **Information Architecture Design (IAD)** as a parallel "second-culture" framework worth engaging with.

## What gets built

### 1. New page: `/lineage` ("Lineage & Comparables")

Route registered in `src/lib/routeRegistry.ts` and `src/App.tsx`. Linked from:
- The BookLaunch page (a small "See how it compares" CTA near the existing "Why this matters" / compare section)
- The footer's resources column

### 2. Page sections (top to bottom)

**Hero**
- Eyebrow: "Lineage & Comparables"
- Title: "Where Calm Magic sits — and where it doesn't"
- Subtitle: One paragraph framing Calm Magic as a post-design-thinking, agentic-era framework that shares DNA with several traditions but recombines them for a new bottleneck (intention, not execution).

**Section A — The comparison matrix** (the main artifact)

Responsive table / card-grid that compares Calm Magic against five reference frameworks across consistent rows. On mobile (390px), it collapses into stacked cards per framework with the same row labels.

Columns:
1. Calm Magic
2. Design Thinking (IDEO / d.school)
3. Theory U (Otto Scharmer)
4. Cynefin (Dave Snowden)
5. Speculative Design (Dunne & Raby)
6. "Vibe coding" / generic AI-first stacks

Rows:
- **Core unit of work** (e.g. empathy → prototype vs. presencing vs. sense-making vs. provocation vs. prompt-to-artifact vs. GL!TCH → DRIFT → TUNE breath cycle)
- **Primary bottleneck addressed** (user empathy / inner shift / complexity literacy / cultural imagination / execution speed / intention + relational capacity)
- **Stance toward agents & AI** (mostly silent / silent / agnostic / critical-speculative / maximalist / agents-as-given, humans-as-framers)
- **Output** (prototype / personal+systemic shift / decision frame / artifact-provocation / shipped feature / preferable future + maturity-matched system)
- **Where it shines**
- **Where Calm Magic extends it**

**Section B — Three short essays** (collapsible cards using existing `CollapsibleSection`)

1. *"Post–Design-Thinking"* — why empathy + prototyping isn't enough when execution is cheap.
2. *"Beyond Theory U"* — operationalizing presencing into playbooks and a maturity model.
3. *"Against Vibe Coding"* — reusing the existing book.json `compare_*` content as the spine.

**Section C — Adjacent traditions worth knowing** (compact list, not a matrix)
- Three Horizons, Causal Layered Analysis, Wardley Mapping, Reinventing Organizations / Teal, Sociocracy, Cybernetics (Stafford Beer).
- Each: one sentence on the cousin relationship.

**Section D — A note on Information Architecture Design (Jason Hobbs)**

A dedicated, respectful section (not in the matrix — it operates at a different altitude). Covers:

- **What IAD is**: a design-theoretic framework treating Information Architecture as the structural composition of meaning across artifacts, systems, and social formations — not navigation or interface.
- **Its conceptual engine**: Structural Logic (SL), Semantic Formation (SF), Contrived Ontology (CO), enacted via Semantic Mechanics (SM) and Socio-Semantic Mechanics (SSM).
- **Why it resonates with Calm Magic**:
  - Both reject artifact-bound, surface-level readings of their domain (IAD rejects "IA = navigation"; Calm Magic rejects "AI = vibe coding").
  - Both treat **meaning as something that must be composed, stabilised, and made operative** — Calm Magic's "the conversation IS the ontology" maps cleanly onto IAD's Contrived Ontology.
  - Both operate in what Hobbs calls a "second intellectual culture" — moving past inherited descriptive models toward compositional, design-theoretic practice.
- **Where they differ**:
  - IAD is a *theoretical canon* under formalisation (modules, glossary, auxiliary notes); Calm Magic is a *practiced framework + product system* (playbooks, board, orchestrator).
  - IAD's altitude is meta-structural (how meaning holds at all); Calm Magic's altitude is operational (how teams in the agentic era author preferable futures).
  - Calm Magic could be read as an *applied instance* of IAD's logic in the agentic-era context — a contrived ontology for organizations facing collapsed execution costs.
- **Useful link**: external link to https://jh-01.com/information-architecture-design/ with `rel="noopener noreferrer"`.

Closing line: "If Calm Magic is the practice, IAD is part of the deeper grammar that makes practices like it legible."

**Section E — CTA**
- Two buttons: "Read the manifesto" → `/book`, "Talk to us" → opens existing `GetDemoDialog`.

### 3. Bilingual content
Add `src/i18n/en/lineage.json` and `src/i18n/fr/lineage.json` with all strings, registered in the i18n loader (matching the pattern used by `book.json` / `retreat.json`).

### 4. SEO
- Use existing `usePageSeo` hook with title "Lineage & Comparables — Calm Magic vs. Design Thinking, Theory U, Cynefin, Speculative Design".
- Add the route to `src/lib/sitemap.ts` via the route registry (automatic if registered).

## Technical notes

- New file: `src/pages/Lineage.tsx`
- New component: `src/components/lineage/ComparisonMatrix.tsx` (table on ≥md, stacked cards on <md)
- Reuses: `CollapsibleSection`, `GradientDivider`, `GetDemoDialog`, existing card / typography tokens from `src/index.css` and `tailwind.config.ts`.
- No new dependencies, no DB changes, no edge functions.
- Respects design memory: feminine design principles, scannable landing pattern, bilingual i18n.

## Out of scope (for now)

- Adding endorsements from any of the cited authors.
- Embedding IAD PDFs/videos directly (we link out only).
- Editing the existing BookLaunch comparison table — we leave it and link from it.

## Open question (optional, will default if no answer)

Should the BookLaunch page's existing "Vibing Tools vs. Calm Magic" table be **replaced by a link** to this richer matrix, or **kept as-is** with the new page as an extension? Default: keep as-is, add a link.
