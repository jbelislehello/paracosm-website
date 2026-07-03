## Goal

The `/agentic-ux` page (Resource · Agentic UX) currently lists three residencies as summary cards only:

1. Diagnostic Sprint (2 weeks)
2. Prototype Residency (6–8 weeks)
3. Ecosystem Build (3–6 months)

Each should become its own dedicated, shareable page — in the same editorial style as `/agentic-ux` — with the summary cards on `/agentic-ux` linking through.

Note: these are **distinct** from the 7 elemental residencies at `/residencies/:archetype` (forest, mountain, etc.). Those stay untouched.

## New routes

```text
/agentic-ux/residencies/diagnostic-sprint
/agentic-ux/residencies/prototype-residency
/agentic-ux/residencies/ecosystem-build
```

Registered in `src/App.tsx` (lazy) and in `src/lib/routeRegistry.ts` with parent `/agentic-ux` so breadcrumbs read: Home › Agentic UX › {Residency name}.

## Data

Extract the 3 residencies into `src/data/agenticResidencies.ts` as the single source of truth. Shape:

```ts
{
  slug, numeral, title, duration, tagline,
  summary,                 // 1-line used on /agentic-ux card
  overview,                // 2-3 paragraph intro
  outcomes: string[],      // "What you leave with"
  arc: { label, body }[],  // week-by-week / phase-by-phase
  whoItsFor: string[],
  whatWeNeed: string[],    // inputs from the client team
  investment: string,      // qualitative (no hard price)
  next: { slug, title }    // pointer to sibling residency
}
```

Copy is written fresh but consistent with the existing Agentic UX voice (consent-first, bias-aware, rehearse-before-ship, TOTEM references where relevant).

## Page component

One shared component `src/pages/AgenticResidency.tsx` that:

- reads `useParams().slug`, looks up the record, 404s otherwise
- uses `usePageSeo` with title/desc derived from the record
- reuses existing editorial primitives (`EditorialSiteHeader`, `EditorialPageHero`, `EditorialSection`, `EditorialChapterHeader`, `EditorialCTA`, `editorialType`, `editorialTone`, `Footer`)

Section order:

```text
01  Hero          — numeral, kicker "Residency · Agentic UX", title, tagline, duration chip
02  Overview      — paragraphs + "What you leave with" list (paper tone)
03  The arc       — numbered phases with kicker/body rows (warm tone)
04  Who it's for  — two-column: "Right fit" / "What we need from you" (paper tone)
05  Next step     — night tone, mailto CTA to jbelisle@helloarchitekt.com
                    + ghost link to the next residency + back to /agentic-ux#residencies
```

Mailto subject encodes the residency name so leads route correctly (per core routing rule).

## Changes to /agentic-ux

In `src/pages/Index.tsx`:

- Import the shared `agenticResidencies` data (remove the inline `residencies` array).
- Wrap each residency card in `<Link to={/agentic-ux/residencies/${slug}}>` with a subtle "Read the residency →" affordance in the card footer.
- Keep the existing "Begin a conversation" CTA unchanged.

## Files

Create:
- `src/data/agenticResidencies.ts`
- `src/pages/AgenticResidency.tsx`

Edit:
- `src/pages/Index.tsx` — use shared data, link cards
- `src/App.tsx` — lazy route `/agentic-ux/residencies/:slug`
- `src/lib/routeRegistry.ts` — register the pattern with parent `/agentic-ux` for breadcrumbs + sitemap

No i18n, no DB, no backend changes.

## Out of scope

- No changes to `/residencies/:archetype` (elemental) or `src/data/residencies.ts`.
- No pricing pages, no Stripe.
- No new imagery — pages stay typographic/editorial like `/agentic-ux`.
