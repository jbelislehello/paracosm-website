
UPDATE public.book_chapters SET status='drafting', summary=$$Friction precedes framework. The GL!TCH is the cultural/interface/inner script collision that arrives before the future does. Polyvagal mapping (Ventral · Sympathetic · Dorsal) turns the friction into legible nervous-system data instead of noise.$$ WHERE phase='GLITCH';
UPDATE public.book_chapters SET status='drafting', summary=$$Many-worlds drift. The QuantumBranchExplorer treats every tile interaction as a parallel possibility weighted by coherence with the user's prophecy. The DistortedTorus manifold + shift vectors visualize position, attractors, and trajectory across the 5 Seasons (POLLENS · NOEMS · POEMS · TOTEMS · ANTHEMS).$$ WHERE phase='DRIFT';
UPDATE public.book_chapters SET status='drafting', summary=$$Tuning intention. The Ontic State Finder uses the 4 Quadrants (SN · IN · IM · SM) to identify irreducible Entities, Relations, and Properties. The Decision Log condenses each commitment into a proverb developing one of four Proverbial Abilities — new ways of Thinking, Doing, Seeing, Feeling.$$ WHERE phase='TUNE';
UPDATE public.book_chapters SET status='drafting', summary=$$Relational infrastructure. Polyvagal co-regulation (Ventral safety, Sympathetic mobilization, Dorsal shutdown) meets Autopoiesis and the Nahual — the attractive aliveness that draws attention to what is most alive. Trust, conflict, repair as nervous-system work, not personality work.$$ WHERE phase='LOVE';
UPDATE public.book_chapters SET status='drafting', summary=$$Pragmatic imagination. The 53 Senses (Cohen) and the eight Think-Like metaphors (Forest · River · Mountain · Lake · Volcano · Ocean · Storm · Sun) pull worldbuilding into multi-sensory, embodied reflection mapped to the MAGIC axes.$$ WHERE phase='MAGIC';
UPDATE public.book_chapters SET status='drafting', summary=$$Designing the system. The full Calm Magic Board: 5 Seasons × 4 Quadrants × 64 Tiles (hexagram · Tzolkin kin · Senge discipline · wu-wei intensity), expanded across the 260-tile window-of-tolerance cycle. The Oneiric Alignment model scores Coherence, Naturalness, and Touch/Concept balance.$$ WHERE phase='CALM';
UPDATE public.book_chapters SET status='drafting', summary=$$Operating in flow. Continuous reconfiguration through re-observation: previously collapsed QuantumBranches can be revisited and re-weighted. Attractor regions on the manifold reveal where coherence concentrates. The framework dissolves into practice — a Creative/Transition Design Expedition.$$ WHERE phase='FREE';

INSERT INTO public.book_uploads (chapter_id, file_path, mime, original_name, extracted_text, notes)
SELECT id, 'canonical/calm-magic-board-prd-v1.pdf', 'application/pdf', 'calm-magic-board-prd.pdf',
$$Calm Magic Board — PRD & Ontological Framework (v1.0, April 2026)

1. ONTOLOGICAL FRAMEWORK — The conversation IS the living ontology. 5 Seasons: POLLENS (signals/stakes), NOEMS (concepts/intuitions), POEMS (narratives/prototypes), TOTEMS (architecture/security), ANTHEMS (go-to-market/brand). 4 Quadrants: SN (Sovereignty+Novelty), IN (Intimacy+Novelty), IM (Intimacy+Memory), SM (Sovereignty+Memory). 64 Tiles on an 8×8 board, each mapped to hexagram, Tzolkin kin, Senge discipline, wu-wei intensity. 260-Tile Cycle expands the window of tolerance across 4 board traversals.

2. MANY-WORLDS QUANTUM LAYER — Each tile interaction creates a QuantumBranch weighted by coherence with the user's prophecy. The QuantumBranchExplorer visualizes the decision tree as superposition. Decisions don't eliminate possibilities — they weight them. Branches can be re-observed.

3. POLYVAGAL — Ventral Vagal: Story of Presence (safety, social engagement). Sympathetic: Story of Protection (mobilization). Dorsal Vagal: Story of Dissociation (shutdown). Inferred from EmotionalAxes: high calm+open=ventral, high magic+low calm=sympathetic, low across all=dorsal. FeltState: stuck→dorsal, flowing→ventral, breakthrough→sympathetic→ventral.

4. 53 SENSES (Cohen) — across 10 categories: Radiation, Feeling, Chemical, Mental, Kinesthetic, Temporal, Spatial, Relational, Electromagnetic, Atmospheric. Each maps to a season/quadrant with a reflective prompt. #1 Light (POLLENS/SN), #15 Smell (POLLENS/IM), #53 Aliveness/Nahual (ANTHEMS/SN).

5. ONTIC STATE FINDER — 4 Quadrants as lenses to identify Entities, Relations, Properties.

6. AUTOPOIESIS & NAHUAL — focuses attention on the attractive quality that draws attention to what is most alive; uses the 53 senses, mapped to MAGIC axes.

7. PRAGMATIC IMAGINATION METAPHORS — Forest (POLLENS), River (NOEMS), Mountain (POEMS), Lake (TOTEMS), Volcano (ANTHEMS), Ocean (Sovereignty), Storm (Sympathetic), Sun (Ventral Vagal).

8. DESIGN DECISION LOG → PROVERBIAL ABILITIES — Thinking (SN), Doing (SN), Seeing (SM), Feeling (IN). Each decision yields a condensed proverb.

9. ONEIRIC ALIGNMENT — Coherence, Naturalness, Touch/Concept balance. AI integration is high-touch, high-concept, dream-like.

10. MANIFOLD & SHIFT VECTORS — DistortedTorus visualizes position and trajectory; shift vectors point from shadow to Higher Self prophecy; surface warps reveal attractors. Encodes 5 Seasons as UV-mapped color bands with curvature density.$$,
'Canonical PRD v1.0 — anchors all chapter syntheses.'
FROM public.book_chapters;

INSERT INTO public.book_sources (chapter_id, kind, ref, title, excerpt, weight, included)
SELECT id, 'upload', 'pdf:cm-prd-v1#§1+§3', 'PRD v1.0 — Ontological Framework + Polyvagal',
'5 Seasons, 4 Quadrants, 64 Tiles, 260-cycle; Polyvagal Ventral/Sympathetic/Dorsal mapping.', 5, true
FROM public.book_chapters WHERE phase='GLITCH';

INSERT INTO public.book_sources (chapter_id, kind, ref, title, excerpt, weight, included)
SELECT id, 'upload', 'pdf:cm-prd-v1#§2+§10', 'PRD v1.0 — Many-Worlds + Manifold/Shift Vectors',
'QuantumBranchExplorer superposition; DistortedTorus manifold, shift vectors, attractors.', 5, true
FROM public.book_chapters WHERE phase='DRIFT';

INSERT INTO public.book_sources (chapter_id, kind, ref, title, excerpt, weight, included)
SELECT id, 'upload', 'pdf:cm-prd-v1#§5+§8', 'PRD v1.0 — Ontic State Finder + Proverbial Abilities',
'4 Quadrants surface Entities/Relations/Properties; Decision Log condenses commitments into proverbs.', 5, true
FROM public.book_chapters WHERE phase='TUNE';

INSERT INTO public.book_sources (chapter_id, kind, ref, title, excerpt, weight, included)
SELECT id, 'upload', 'pdf:cm-prd-v1#§3+§6', 'PRD v1.0 — Polyvagal + Autopoiesis/Nahual',
'Co-regulation across Ventral/Sympathetic/Dorsal; Nahual as attractor of aliveness.', 5, true
FROM public.book_chapters WHERE phase='LOVE';

INSERT INTO public.book_sources (chapter_id, kind, ref, title, excerpt, weight, included)
SELECT id, 'upload', 'pdf:cm-prd-v1#§4+§7', 'PRD v1.0 — 53 Senses + Pragmatic Imagination',
'53 senses (Cohen); 8 Think-Like metaphors (Forest, River, Mountain, Lake, Volcano, Ocean, Storm, Sun).', 5, true
FROM public.book_chapters WHERE phase='MAGIC';

INSERT INTO public.book_sources (chapter_id, kind, ref, title, excerpt, weight, included)
SELECT id, 'upload', 'pdf:cm-prd-v1#§1+§9', 'PRD v1.0 — Full Board + Oneiric Alignment',
'5 Seasons × 4 Quadrants × 64 Tiles + 260-cycle; Oneiric Alignment scoring.', 5, true
FROM public.book_chapters WHERE phase='CALM';

INSERT INTO public.book_sources (chapter_id, kind, ref, title, excerpt, weight, included)
SELECT id, 'upload', 'pdf:cm-prd-v1#§2+§10', 'PRD v1.0 — Re-observation + Attractors',
'Re-observable QuantumBranches; attractor regions reveal coherence on the manifold.', 5, true
FROM public.book_chapters WHERE phase='FREE';
