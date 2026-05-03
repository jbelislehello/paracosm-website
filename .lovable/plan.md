Do it for real. This site is live.

## Dream Mode — The board answers itself through your PRD

A new tab in the Calm Magic Assistant where the user chooses one of several rotating prompts, uploads an existing PRD (PDF/DOCX/Markdown), and then watches the 5-axis board (LOVE / MAGIC / CALM / OPEN / FREE) light up tile-by-tile while AI narration streams a poetic interpretation drawn from their own document.

### User flow

```
[ Dream tab ]
   ↓
1. Choose a prompt           (3 curated cards rotating from a pool)
   ↓
2. Upload your PRD           (drop zone — PDF / DOCX / MD)
   ↓
3. Parse + analyze           (edge function extracts text, sends to AI)
   ↓
4. Dream sequence begins
     • Board fades in dim
     • Each axis (LOVE→MAGIC→CALM→OPEN→FREE) wakes in sequence
     • Tiles within an axis pulse on as AI streams that axis's narration
     • Insight panel updates per axis
   ↓
5. Final state               (full board lit, summary + "Save as PRD seed")
```

### New files

- `src/components/calm-magic/dream/DreamMode.tsx` — main container, state machine (`idle → prompt → upload → analyzing → dreaming → complete`)
- `src/components/calm-magic/dream/PromptPicker.tsx` — 3 curated cards from a rotating pool
- `src/components/calm-magic/dream/PrdUploader.tsx` — drop zone, file validation (PDF/DOCX/MD, ≤10MB)
- `src/components/calm-magic/dream/DreamSequence.tsx` — orchestrates the self-answering animation
- `src/components/calm-magic/dream/NarrationStream.tsx` — markdown-rendered streaming text with caret
- `src/data/dreamPrompts.ts` — curated prompts pool (~12), each tagged to which axes it most activates
- `supabase/functions/dream-prd-analysis/index.ts` — parses uploaded file, calls Lovable AI Gateway with streaming, returns SSE with per-axis insights + tile activations

### Edge function: `dream-prd-analysis`

- Accepts `multipart/form-data` (file + question + optional projectId)
- Parses:
  - **PDF** via `pdf-parse` equivalent (use `unpdf` — Deno-friendly)
  - **DOCX** via `mammoth` (Deno via esm.sh)
  - **MD/TXT** read directly
- Truncates to ~30k chars
- Calls `google/gemini-3-flash-preview` with `stream: true` and a tool-call schema requesting per-axis output:
  ```json
  {
    "axes": [
      { "key": "love",  "narration": "...", "tile_keys": ["aliveness","resonance"] },
      { "key": "magic", "narration": "...", "tile_keys": [...] },
      { "key": "calm",  "narration": "...", "tile_keys": [...] },
      { "key": "open",  "narration": "...", "tile_keys": [...] },
      { "key": "free",  "narration": "...", "tile_keys": [...] }
    ],
    "summary": "..."
  }
  ```
- Streams SSE so the client can reveal axes/tiles progressively
- Validates input with zod, enforces 10MB cap, surfaces 429/402

### Self-answering animation

Reuse existing `ExperienceDotsVisualization` with a new prop `dreamMode?: { activeAxis, litTiles[], dimmed }`:

- When `dimmed`, all regions render at 20% opacity
- `activeAxis` triggers that region's pulse animation
- `litTiles` glow brighter than baseline; once lit, stay lit
- Driven by parent `DreamSequence` consuming the SSE stream

Narration streams beside the board (right column on desktop, below on mobile <768px), token-by-token, markdown-rendered via `react-markdown`.

### Hook into existing tab system

Update:

- `CalmMagicAssistant.tsx` — add `'dream'` to the `viewMode` union
- `ViewRenderer.tsx` — new case `'dream'` returning `<DreamMode />`
- `ViewModeNavigation.tsx` — append `{ key: 'dream', label: '✨ Dream', desc: 'Board answers itself' }`

### Curated prompts (initial pool, in `dreamPrompts.ts`)

Each rotation surfaces 3 random prompts. Examples:

- "What is your product secretly afraid of?"
- "Where does your roadmap stop listening?"
- "Which user pain are you avoiding naming?"
- "What would your PRD say if it could dream?"
- "Where is aliveness leaking out of this product?"
- "Which feature is actually a coping mechanism?"

(Full list of ~12 in the data file.)

### Persistence (optional, behind feature)

If a `projectId` is passed, store the dream session in a new `dream_sessions` table:

- `id, user_id, project_id, question, prd_filename, ai_summary, axis_insights jsonb, created_at`
- RLS: owner-only via existing `is_project_owner` pattern

This lets users revisit past dreams. **I'll only add the table if you confirm — otherwise keep it ephemeral for v1.**

### Technical notes

- File parsing happens server-side (edge function) — never trust client-extracted text
- AI call uses Lovable AI Gateway, `LOVABLE_API_KEY` already configured
- Streaming uses SSE, parsed line-by-line on the client (per ai-gateway best practices)
- Animation uses `framer-motion` (already in project) for axis sequencing
- Reduced-motion respected via existing `usePrefersReducedMotion` hook — falls back to instant reveal

### Open question

Persist dream sessions to DB now, or keep ephemeral for v1? (Default: **ephemeral**.)