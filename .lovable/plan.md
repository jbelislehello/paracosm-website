## Goal
Extend the editorial magazine art direction (used on `/` via `EditorialHome`) across the rest of the Paracosm site so every page reads as one continuous publication — same typographic system, same tonal palette (warm / night / clay), same chapter framing, same plate-style imagery.

## Art direction to propagate

Codified from `EditorialHero`, `TriadChapter`, `PartnerInnovationPlaysSection`, `EditorialClosing`:

- **Type**: serif display (large, tight leading, italic pull quotes) + small uppercase kickers with wide tracking (`tracking-[0.3em]–[0.4em]`), 10–12px, opacity 60–70.
- **Numerals**: oversized serif chapter numerals (`01`, `02`, `03`) as section anchors.
- **Palette rotation**: warm cream, night indigo, clay rose — sections alternate tones instead of one flat background.
- **Layout**: 12-col grid, wide gutters, sticky plate image (4:5) with caption strip, two-column body prose, "woven in" bordered callouts.
- **CTA**: pill button, uppercase, tracked, hover translate-y, tone-aware (gold-on-night vs foreground-on-warm).
- **Motion**: restrained — fade/slide on scroll, no parallax tricks.

## Approach

1. **Extract into a shared editorial kit** (`src/components/editorial/`):
   - `EditorialSection.tsx` — tone-aware wrapper (warm/night/clay) with chapter-header slot.
   - `EditorialChapterHeader.tsx` — numeral + kicker + italic subtitle.
   - `EditorialPullQuote.tsx`, `EditorialWovenCallout.tsx`, `EditorialPlate.tsx`, `EditorialCTA.tsx`.
   - `editorialTokens.ts` — tone → bg/text/accent class maps (single source of truth).
2. **Global type + tokens** in `src/index.css` and `tailwind.config.ts`:
   - Register the serif display + body pair used on the editorial home as `font-editorial` / `font-editorial-body`.
   - Add semantic tokens `--editorial-warm`, `--editorial-night`, `--editorial-clay`, `--editorial-accent-gold`, `--editorial-accent-ember`, `--editorial-accent-rose`.
3. **Retrofit each top-level page** to compose from the kit instead of its current ad-hoc styling. Each page becomes a sequence of tone-alternating chapters with numerals and plates.

## Pages in scope (retrofit order)

Tier 1 — highest traffic, most visible:
1. `LandingPage` (`/home`) — reframe hero, positioning, offering triad, summer deal as chapters 01–05.
2. `TrainingsIndex` + `TrainingDetail` + `TrainingModule` — each training becomes a chapter; module = spread.
3. `EventsAndRetreats` + `ParacosmRetreatLanding` + `HybridCognitionEvent` — retreat as night-tone editorial.
4. `AboutUs` — long-form editorial with pull quotes and plates.
5. `CaseStudies` — each case = one chapter with plate + woven callout for outcomes.

Tier 2:
6. `Pricing`, `Tonalli`, `Origins`, `Lineage`, `RelationalHealing`.
7. `BookChapter`, `BookCompass`, `BookCompassesIndex`, `BookOperatorsIndex`, `BookThanks`.
8. `Drift`, `DriftLibrary`, `GlitchEvents`, `GlitchMethodology`, `GlitchInsights`, `HybridCognitionEvent`.

Tier 3 (light touch — mostly nav/footer + type):
9. `EntrepreneurialTarot`, `PatternEncyclopedia`, `DesignSystemShowcase`, `NotFound`, auth pages, dashboards.

Dashboards and tool-heavy pages (`ParacosmDashboard`, `PrdEditor`, `CalmMagicBoard`, `CalmMagicVisualization`, admin) keep their functional UI — only the chrome (header, section headers, footer) adopts editorial type + tokens, not the working surfaces.

## Shared chrome

- Update `Footer` and site headers to editorial type + night tone.
- Nav links: uppercase, tracked, small.
- Preserve existing routes, i18n keys, analytics events, SEO hooks — this is a visual retrofit only.

## Out of scope

- No copy rewrites (except section kickers/numerals needed to fit the chapter frame).
- No routing changes.
- No data model or backend changes.
- No changes to interactive tool surfaces (board, editor, dashboards inner UI).

## Rollout

Ship Tier 1 in one pass so the public journey is coherent, then Tier 2, then Tier 3. After each tier: quick visual pass on mobile (390px) + desktop.

## Technical notes

- Keep colors as HSL tokens in `index.css`; never hardcode hex in components.
- Tone-aware classes live in `editorialTokens.ts` — components consume via a `tone` prop just like `TriadChapter` today.
- Fonts loaded once via existing font pipeline; no new network requests per page.
- Preserve `usePageSeo` and JSON-LD on every retrofitted page.
