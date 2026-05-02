## Goal

A guided in-app flow at **`/agentic-ecosystem-deck`** that generates a slide presentation for the **Agentic Ecosystem** service by scraping content from **paracosm.helloarchitekt.com** (and only that domain — `paracosm.life` is explicitly blocked in code).

The user steps through the wizard, reviews what the AI proposes, and lands in a slide editor / presenter that can also export to `.pptx`.

## The guided flow (5 steps)

```text
[1] Source     → [2] Audience   → [3] Outline    → [4] Slides     → [5] Present / Export
 pick pages       set frame        AI proposes      AI fills in       view, edit, export
```

**Step 1 — Source selection**
- Calls a `discover-paracosm-pages` edge function that uses **Firecrawl `map`** on `paracosm.helloarchitekt.com` (allow-listed; any other host returns 400).
- Shows discovered URLs grouped by section (about, services, drift, calm-magic, etc.).
- Pre-selects pages most relevant to "agentic ecosystem" (filter by keyword: agentic, ecosystem, orchestrator, crewdle, calm magic).
- User can add/remove URLs. Hard cap: 12 pages.

**Step 2 — Audience & framing**
- Audience preset (Founder / Enterprise / Investor / Partner / Practitioner cohort).
- Deck length (Short 8 · Standard 12 · Deep 18).
- Tone (Executive · Visionary · Practitioner).
- Optional one-line "what this deck must do" prompt.

**Step 3 — Outline**
- `compose-deck-outline` edge function:
  - Calls `scrape-paracosm-pages` first (Firecrawl `scrape`, markdown only, host-locked).
  - Sends summarised markdown + audience/tone to Lovable AI Gateway (`google/gemini-2.5-flash` by default).
  - Returns JSON: `{ title, subtitle, slides: [{ id, type, title, bullets[], speakerNotes, sourceUrls[] }] }`.
- User can drag-reorder, rename, delete, or add empty slides. Each slide shows the source URLs used.

**Step 4 — Slide generation & editor**
- `compose-deck-slides` edge function fills body/notes per slide using the outline + scraped sources.
- Editor uses the **slides-app pattern** from the skill knowledge:
  - 1920×1080 fixed canvas, `transform: scale()` to fit.
  - Sidebar thumbnails, main canvas, collapsible notes panel.
  - Slide types: `title`, `bullets`, `two-column`, `quote`, `stat`, `closing-cta`.
  - Calm Magic palette tokens (existing `--primary`, `--accent`, plus a deck-scoped `--slide-*` set added to `index.css`).
- Inline edit: click a title/bullet to rewrite. "Regenerate slide" button re-prompts the AI for that one slide only.

**Step 5 — Present & export**
- Present mode: Fullscreen API, arrow-key navigation, presenter notes, timer.
- Export to `.pptx`: client-side via `pptxgenjs` (already familiar from the skill); maps each slide type to a layout. Filename: `agentic-ecosystem-deck-YYYYMMDD.pptx`.
- Export to PDF: print stylesheet for `Cmd+P → Save as PDF` (no extra deps).
- "Send a copy to jbelisle@helloarchitekt.com" toggle (per Core memory) — calls existing send-demo-request style transactional pattern.

## Persistence

New table `agentic_decks` (RLS, owner-scoped) so users can come back to a draft.

| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid | nullable; anonymous drafts kept in localStorage instead |
| `title` | text | |
| `audience` | text | |
| `tone` | text | |
| `length_preset` | text | |
| `source_urls` | text[] | host-validated server-side |
| `outline` | jsonb | step 3 output |
| `slides` | jsonb | step 4 output |
| `created_at` / `updated_at` | timestamptz | |

RLS: `user_id = auth.uid()` for select/insert/update/delete. Anonymous flow stores draft in localStorage; "Save" prompts auth.

## Source-domain guardrail (hard requirement)

In **every** edge function that touches a URL:

```ts
const ALLOWED_HOST = "paracosm.helloarchitekt.com";
const BLOCKED_HOSTS = new Set(["paracosm.life", "www.paracosm.life"]);

function assertAllowedUrl(raw: string) {
  const u = new URL(raw);
  if (BLOCKED_HOSTS.has(u.host)) throw new Error("paracosm.life is not allowed as a source.");
  if (u.host !== ALLOWED_HOST) throw new Error(`Only ${ALLOWED_HOST} URLs are allowed.`);
}
```

Frontend mirrors the same check before submit so the UI fails fast.

## Edge functions (3 new)

1. `discover-paracosm-pages` — POST `{ search?: string }` → Firecrawl map → returns `{ urls: string[] }`.
2. `scrape-paracosm-pages` — POST `{ urls: string[] }` → Firecrawl scrape (markdown, onlyMainContent) → returns `{ pages: [{ url, markdown, title }] }`.
3. `compose-deck` — POST `{ stage: "outline" | "slides", audience, tone, length, sources, outline? }` → Lovable AI Gateway → returns structured JSON. Single function, two stages, to share schema and prompts.

All three: Zod-validated input, host-locked, 60s timeout, return CORS headers, no secrets exposed.

## Secrets required

- `FIRECRAWL_API_KEY` — for map + scrape.
- `LOVABLE_API_KEY` — already present (used elsewhere).

## New / changed files

**New**
- `src/pages/AgenticEcosystemDeck.tsx` — wizard shell + step routing
- `src/components/deck/StepSource.tsx`
- `src/components/deck/StepAudience.tsx`
- `src/components/deck/StepOutline.tsx`
- `src/components/deck/SlideEditor.tsx` (sidebar + canvas + notes)
- `src/components/deck/PresentMode.tsx` (fullscreen)
- `src/components/deck/slides/` — `TitleSlide.tsx`, `BulletsSlide.tsx`, `TwoColumnSlide.tsx`, `QuoteSlide.tsx`, `StatSlide.tsx`, `ClosingCtaSlide.tsx`, plus shared `SlideLayout.tsx` and `ScaledSlide.tsx`
- `src/lib/deck/exportPptx.ts` — `pptxgenjs` mapping
- `src/lib/deck/sourceGuard.ts` — shared client-side host check
- `src/hooks/useDeckDraft.ts` — localStorage + Supabase persistence
- `supabase/functions/discover-paracosm-pages/index.ts`
- `supabase/functions/scrape-paracosm-pages/index.ts`
- `supabase/functions/compose-deck/index.ts`
- Migration: `agentic_decks` table + RLS

**Changed**
- `src/App.tsx` — register `/agentic-ecosystem-deck`
- `src/lib/routeRegistry.ts` — register the route under `/`
- `src/index.css` — add `--slide-*` scoped tokens + `.slide-content` font scaling per slides-app skill
- `src/components/Footer.tsx` — add "Generate a deck" link under Get Started
- `src/pages/LandingPage.tsx` (or the closest service section) — small CTA "Generate an Agentic Ecosystem deck"

**Dependencies (1 new)**
- `pptxgenjs` (client-side export)

## Out of scope

- Generating images for slides (use clean typographic layouts; can be added later via `--image` AI gateway).
- Multi-user collaboration on a deck.
- Source domains beyond `paracosm.helloarchitekt.com`.
- Translating the generated deck to FR (English-only v1; FR can come later via the existing i18n pattern).

## Open questions (will default if unanswered)

1. **Should anonymous users be able to generate a deck**, or require auth before step 1?  → Default: allow anonymous through step 4, require auth to **save** or **email**.
2. **Default deck length**?  → Default: Standard (12 slides).
3. **Should the export include a Paracosm-branded title slide** (logo on white, per logo memory)?  → Default: yes.
