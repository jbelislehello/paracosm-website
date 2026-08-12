# Calm Magic Agents — Promo Page (`/calm-magic-agents`)

A scroll-story marketing page for the 12 Calm Magic agents, in the editorial magazine system, converting to `/pricing`.

## Page structure

1. **Hero** — kicker "Calm Magic · 12 Agents", headline "Not assistants. Companions for the hardest thinking you'll ever do.", subtitle on the 64-tile / 5-season anchoring, primary CTA "See plans" → `/pricing`, secondary "Meet the agents" → anchor.
2. **Sticky anchor rail** — thin sub-nav (desktop only) with anchors: Agents · Seasons · Origin · Infrastructure · Plans. Highlights the active section on scroll.
3. **Seasons band** — 5 short cards (POLLENS · NOEMS · POEMS · TOTEMS · ANTHEMS) framing which agents live where, plus Σ Convergence.
4. **Agent scroll-story** — 12 alternating full-width sections, one per agent: glyph, name, season tag, domain, 2–3 lines of voice/what it does, and a "what you leave with" line. Sticky sub-CTA appears every 4 agents.
5. **Origin section** — condensed, tasteful version of the lived-experience origin (relational complexity, service design rigor, building under real constraint). No invented claims, no financial/personal details.
6. **Infrastructure section** — agents run on Crewdle Connect: they work, remember, and coordinate. Includes the Product Hunt milestone only if you confirm it should be public.
7. **Who it's for** — 5 audience lines (founders, leaders, creatives, teams, anyone operating below capacity).
8. **Closing CTA** — "The agents are live. The board is open." → `/pricing`, secondary → `/calm-magic-assistant`.
9. **Footer** — shared `Footer`.

## Agent roster (as provided)

Witness (Pollens, daily check-in / felt state) · Weaver (Pollens, relationships / networks) · Cartographer (Noems, vision mapping / PRD) · Glitch (Noems, failure intelligence) · Oracle (Noems, cross-domain resonance) · Steward (Totems, resources / long-term care) · Grove (Totems, community / belonging) · Threshold (Totems, consent design / access ethics) · Herald (Anthems, communication / launch) · Conductor (Anthems, rhythm / coordination) · Observatory (Anthems, systemic awareness without surveillance) · Sigma (Σ Convergence, meta-reflection / cycle synthesis).

Note: current site copy elsewhere says "8 relational agents, one per board row" (`src/data/paracosmProducts.ts`). I'll update that entry to 12 so the site stays consistent.

## Design

Editorial magazine system only (`src/components/editorial/*`): serif display headings, numerals, hairline rules, generous whitespace, semantic tokens. No bloom/VHS, no purple-blue AI gradients. Each agent gets a season-derived accent from existing season tokens rather than a new palette. Glyphs rendered as typographic marks with `aria-hidden`.

## Technical notes

- New data file `src/data/calmMagicAgents.ts` — one entry per agent with `slug`, `glyph`, `name`, `season`, `domain`, `en`/`fr` copy (bilingual via `useLanguage`, EN default), one field per attribute (no concatenated strings).
- New page `src/pages/CalmMagicAgents.tsx` + section components under `src/components/agents/` (`AgentStorySection`, `SeasonBand`, `AgentAnchorRail`) to keep files small.
- Route `/calm-magic-agents` in `src/App.tsx` (lazy, public), registered in `src/lib/routeRegistry.ts` so it lands in the sitemap.
- SEO via `usePageSeo`: bilingual title/description, single H1, `ItemList` JSON-LD of the 12 agents through `src/lib/structuredData.ts`.
- Nav: add "Agents" to `EditorialSiteHeader` and the `navigation.json` EN/FR i18n files.
- Analytics: `trackEvent` on hero CTA, mid-page CTA, and closing CTA so the pricing funnel is measurable.
- No backend changes.

## Open item

Confirm whether the Crewdle Connect / Product Hunt ranking should appear publicly; if unconfirmed I'll omit the ranking and keep the infrastructure mention generic.
