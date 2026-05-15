## Verdict: Yes — both PDFs are highly repurposable

The `.docx` (CREATING THE FUTURE) failed to parse — I'll need it re-uploaded as PDF or pasted to include it. The two PDFs alone already give us a full Compasses corpus and a rich pool of reflective fragments that map cleanly onto the existing 8-chapter spine (GLITCH · DRIFT · TUNE · LOVE · MAGIC · CALM · OPEN · FREE).

---

### What's in the uploads

**1. Wild Cookie Compasses PDF** — a structured table of ~20 compasses, each with: description, quote, timing, tools/prototypes, practices. Examples: UX Consciousness, Body Maps, IoT/IoB, Cognitive Maps, Ubiquitous Computing, Prediction Engines, Worldbuilding Narratives, Usability, Post-broadcast Engagement, Future-envisioning, Dialogic Imagination, Futurogram, Purpose & Meaning at Work, Noetic Functions, The Human Animal, Ecological Truth & Eco-anxiety, Reinventing Education, The Calmness, Meaningfulness, Playfulness, Calm/Attention, Usefulness, Serendipity. Includes a phase-of-project usage matrix.

**2. Official Book Structure PDF** — the original CALM/MAGIC acronym scaffolding (CREEDS, LENS, AGENDAS, MAPS, LOVE + MAGIC areas), the Préface, "Poiesis at the Office", "Qui suis-je", Futurogram intro, the three Transformer archetypes (Relational Artist, Organizational Poet, Idea & Experience Architect), the 5 Methods, Organizational Poetics, Learning Organization, "Reinventing Meetings", Creative/Transition Design Expeditions, Story-Driven Enterprise Transformation, Activity Maps. Lots of short prose fragments and bilingual (FR/EN) reflective passages.

---

### Repurposing plan

#### A. New "Compasses" section in the book
- Add a top-level `/book/compasses` index plus per-compass routes `/book/compasses/:slug`.
- New table `book_compasses` (id, slug, name, description, quote, quote_attribution, timing, tools[], practices[], phase_affinity[]) seeded from the Wild Cookie PDF (~20 rows).
- Card grid on the index, with filter chips for the 8 phases (GLITCH→FREE) using `phase_affinity` so each compass surfaces under the relevant chapter contexts.
- Link the section into the existing reading-journey bar as an optional sidebar (not a 9th phase) so the spine stays at 8 chapters.

#### B. Reflection nodes attached to chapters
- New table `book_reflection_nodes` (id, chapter_slug NULL, compass_slug NULL, kind enum: 'conversation_starter' | 'reflection' | 'fragment' | 'bilingual_passage', body_md, source_ref, language).
- Seed from the Book Structure PDF: each Préface paragraph, each "questionnement", each Transformer archetype intro, "Reinventing Meetings", "Story-Driven Transformation", "Why Organizational Poetry Works", etc.
- Mapping (initial, revisable):
  - GLITCH ← Préface, "Mes questionnements actuels", Friction-related fragments
  - DRIFT ← Futurogram, Programmable World, Spatial Computing, Worldbuilding Narratives
  - TUNE ← Reinventing Meetings, StoryTime rituals
  - LOVE ← Purpose & Meaning at Work, Empathy/EI, Ethics & Engagement
  - MAGIC ← Poiesis, Playfulness, Serendipity, Dialogic Imagination
  - CALM ← The Calmness, Calm Computing, Attention, Wellness
  - OPEN ← Organizational Poetics, Learning Organization, Story-Driven Transformation
  - FREE ← Creative/Transition Design Expeditions, Activity Maps, Operating in Flow
- Render at the bottom of each chapter as a "Reflection Nodes" carousel + a "Random reflection" button that pulls one matching node (chapter or compass-affinity).

#### C. Cross-linking
- Each chapter page gets a "Compasses for this phase" strip pulled via `phase_affinity`.
- Each compass page gets "Appears in chapters: …" + its own reflection nodes.

#### D. What I will NOT do without your call
- I won't auto-publish the seeded content. Compasses + reflection nodes will land as `status='draft'` so you can curate before publish.
- I won't merge the bilingual FR passages into EN chapter bodies — they live as standalone reflection nodes tagged `language='fr'`.

---

### Open questions before building

1. The `.docx` (CREATING THE FUTURE) didn't parse. Re-upload as PDF or paste the text? Or proceed with just the two PDFs for v1?
2. Should compasses be a sibling section under `/book/compasses` (my recommendation) or folded into each chapter as inline cards only?
3. For reflection nodes: surface them inline at end of chapter, as a floating "pull a card" button, or both?

---

### Technical notes

- New tables + RLS (public read on published rows; admin write).
- Two seed migrations: `seed_book_compasses` and `seed_book_reflection_nodes`.
- New routes + components: `BookCompassesIndex.tsx`, `BookCompass.tsx`, `ReflectionNodesStrip.tsx`, `RandomReflectionButton.tsx`.
- No changes to the 8-chapter spine or the reading-journey bar segmentation.
