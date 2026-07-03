# Editorial Rebrand — Full Site + Home Callouts

Extend the editorial magazine art direction (already live on `/` and Tier 1 pages: Trainings, About, Case Studies, Footer) to **every remaining page** of calm-magic.com, and add **four promotional callouts** to the magazine home (`EditorialHome`).

## Part 1 — New callouts on the magazine home (`/`)

Add a new editorial section between `PartnerInnovationPlaysSection` and `EditorialClosing`:

**`EditorialDispatchesSection.tsx`** — a "Dispatches" chapter (numeral `04`, kicker "Dispatches", warm tone) presented as a 2×2 magazine grid of four plate-cards, each with kicker, serif headline, one-line dek, and a pill CTA:

1. **Tonalli** — "Creative OS for voice and spatial work." → `/tonalli`  (clay tone card)
2. **GL!TCH Session** — next live session, date + city → `/glitch-events`  (night tone card, gold accent)
3. **Yutori Nights** — intimate evening series → `/events-and-retreats#yutori` (warm tone card)
4. **Think Like a Forest — Retreat** → `/events-and-retreats#think-like-a-forest` (clay tone card, plate image = forest)
5. **LinkedIn Newsletter invite** — full-width "colophon strip" under the 2×2 grid: serif pull-quote + CTA "Subscribe on LinkedIn" → opens the user's LinkedIn newsletter URL in a new tab.

Copy will be short, editorial, bilingual-ready (EN default, FR keys registered in `src/i18n/{en,fr}/landing.json` under `dispatches.*`). Analytics: `editorial_dispatch_click` with `{ dispatch: 'tonalli' | 'glitch' | 'yutori' | 'forest' | 'linkedin' }`.

**Two inputs needed from you before build** (I'll use sensible placeholders and you can swap after):
- LinkedIn newsletter URL
- Think Like a Forest retreat date/location + hero image (I'll reuse `assets/retreats/forest-circle.jpg` if none provided)
- Next GL!TCH session date/city
- Yutori Nights next date/city

## Part 2 — Editorial retrofit for every remaining page

Same kit as Tier 1 (`EditorialSection`, `EditorialChapterHeader`, `EditorialPullQuote`, `EditorialWovenCallout`, `EditorialPlate`, `EditorialCTA`, `editorialTokens`). Every page becomes a sequence of tone-alternating chapters (warm → night → clay → paper) with numerals, kickers, plates, and pill CTAs. No copy rewrites beyond kickers/numerals; no routing, data, or logic changes.

**Tier 1 remaining (public journey — ship first pass):**
- `LandingPage` (`/home`) — hero, positioning, offering triad, summer deal, hybrid-cognition banner as chapters 01–05
- `EventsAndRetreats`, `ParacosmRetreatLanding`, `HybridCognitionEvent` — night-tone retreat editorial; add `#yutori` and `#think-like-a-forest` anchors for the new callouts

**Tier 2 (content pages):**
- `Pricing`, `Tonalli`, `Origins`, `Lineage`, `RelationalHealing`
- `BookChapter`, `BookCompass`, `BookCompassesIndex`, `BookOperatorsIndex`, `BookThanks`
- `Drift`, `DriftLibrary`, `GlitchEvents`, `GlitchMethodology`, `GlitchInsights`

**Tier 3 (light touch — chrome + type only):**
- `EntrepreneurialTarot`, `PatternEncyclopedia`, `DesignSystemShowcase`, `NotFound`, auth pages, subscription success/canceled, credits, dashboards (chrome only — inner tool surfaces of `ParacosmDashboard`, `PrdEditor`, `CalmMagicBoard`, `CalmMagicVisualization`, `PrdsDashboard`, admin views stay functional)

**Shared chrome:** headers already partly editorial via footer; nav links on remaining pages get uppercase + tracked treatment to match.

## Out of scope

- No copy rewrites beyond section kickers/numerals
- No routing changes (except adding `#yutori` and `#think-like-a-forest` anchor targets)
- No data model, RLS, or edge function changes
- No changes to interactive tool surfaces (board, editor, dashboards inner UI) — only their chrome
- Preserve every `usePageSeo`, JSON-LD, i18n key, and analytics event

## Rollout order

1. Home callouts (`EditorialDispatchesSection` + i18n + anchors on `EventsAndRetreats`)
2. Tier 1 remaining (`LandingPage`, `EventsAndRetreats`, `ParacosmRetreatLanding`, `HybridCognitionEvent`)
3. Tier 2 (content pages)
4. Tier 3 (chrome only)

After each tier: quick visual pass at 390px + 1280px.

## Technical notes

- All colors stay as HSL tokens in `index.css`; components consume tone via `tone` prop from `editorialTokens.ts`
- Fonts already loaded — no new network requests
- Preserve `usePageSeo` and JSON-LD on every retrofitted page
- Analytics event names preserved; new events prefixed `editorial_dispatch_*`

Please drop the four inputs (LinkedIn URL, forest retreat details, GL!TCH date, Yutori date) in your next message — or say "use placeholders" and I'll ship with sensible defaults you can edit.
