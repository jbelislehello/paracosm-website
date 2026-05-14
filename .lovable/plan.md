## Goal

Populate the existing `book_chapters` (GLITCH, DRIFT, TUNE, LOVE, MAGIC, CALM, FREE) with real source material drawn from the uploaded PDF *CALM MAGIC — Official Book Structure*, so chapter synthesis (`book-synthesize-chapter`) has substance to work with. This becomes the historical / methodological backbone; you'll layer the updated acronyms on top after.

## What's in the PDF (summary of the source)

- **Préface** — 2007 origin, 25 years of practice, "I think about thinking", reflexive writing journey
- **Part 1 — The Compasses**: Poiesis at the Office, identity & path, current questionings, Futurogram, Web → IIoT, Programmable World, Spatial Computing, Ethics & Engagement at Work (Self-Determination Theory, Deci & Ryan)
- **Part 2 — The Transformers**: The Relational Artist, The Organizational Poet, The Idea & Experience Architect
- **Part 3 — The Methodological Framework**:
  - The original **SMALL** framework (Seeds / Maps / Agendas / Lens / Love) — ancestor of CALM MAGIC
  - **CALM** = CREEDS · LENS · AGENDAS · MAPS · LOVE (with chapter sub-lists each)
  - **MAGIC** = Mindsets · Agility · Goals/Governance/Gardens · Intuition · Cycles/Capabilities/Compasses/Circles
  - Flow States Tarot as the "secret ingredient" gelling the 4 elements (Major Arcanas)
  - Organizational Poetics, Creative Leadership in the Learning Organization, Reinventing Meetings, Creative/Transition Design Expeditions, Story-Driven Enterprise Transformation
- **Activity Maps** appendix

## Mapping to the 7 current chapters

| Current phase chapter | PDF material assigned |
|---|---|
| **GLITCH** | Préface, "Mes questionnements actuels", censoring system / mental filter, Ethics & Engagement at Work |
| **DRIFT** | Part 1 Compasses: Poiesis, Futurogram, Web → IIoT, Programmable World, Spatial Computing |
| **TUNE** | SMALL → CALM transition, AGENDAS (Analysis → Secrets), Reinventing Meetings |
| **LOVE** | LOVE chapter (Longevity, Oscillations, Velocity, Empathy), Self-Determination Theory, relational artist |
| **MAGIC** | MAGIC acronym, Flow States Tarot, Organizational Poet, Story-Driven Enterprise Transformation |
| **CALM** | CREEDS, LENS, MAPS, methodological framework overview, Why Organizational Poetry Works |
| **FREE** | Creative/Transition Design Expeditions, Activity Maps, Idea & Experience Architect, "preferable futures" closing |

## Implementation steps (after you approve)

1. **Parse & chunk the PDF** server-side once into ~30–50 logical sections (heading + body + page refs).
2. **Insert into `book_sources`** with:
   - `kind = 'manuscript'`
   - `ref = 'pdf:calm-magic-official-structure#p<page>-<slug>'`
   - `title` = section heading, `excerpt` = section body (≤1500 chars), `weight = 5` (higher than scraped web sources)
   - `chapter_id` = mapped per the table above
   - `included = true`
3. **Update `book_chapters.summary`** for each of the 7 chapters with a 2–3 sentence outline derived from the assigned PDF material (preserves the bilingual FR/EN voice from the source).
4. **Add a manuscript record to `book_uploads`** pointing at the PDF (store under the existing `book-manuscript` storage bucket) so it's traceable as the seed document.
5. Leave `book_chapter_drafts` empty — synthesis is the next step, not part of this plan.

## Technical notes

- Done as a one-shot admin script via a small new edge function `book-seed-from-manuscript` (or extend `book-seed-from-corpus` with a `manuscript` mode). Function reads the parsed sections from a JSON payload posted by the admin page, so we don't need to ship the PDF binary into the function.
- No schema changes. No new tables. RLS already restricts `book_sources` / `book_uploads` / `book_chapters` writes to admins.
- After this lands, you send the updated acronyms and we either (a) revise chapter titles/summaries in place, or (b) add a second pass of `book_sources` tagged `kind = 'method-update'`.

## Out of scope

- Running `book-synthesize-chapter` (next step, separate request)
- Translating FR passages to EN
- Restructuring the 7-phase ontology — we keep GLITCH…FREE as-is

## Open question (won't block — defaulting unless you say otherwise)

Default = create a small new edge function `book-seed-from-manuscript` invoked from `/admin/book-manuscript` with a "Seed from PDF" button. Alternative = inline the parsed sections into the existing `book-seed-from-corpus` payload. I'll go with the new function for clarity unless you prefer the inline route.
