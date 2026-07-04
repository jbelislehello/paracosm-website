## Change

Extend `src/lib/sitemap.ts`'s `expandDynamic` switch to enumerate the three agentic residency slugs so they emit as concrete URLs in `sitemap.xml`.

Add to the switch:

```ts
case "/agentic-ux/residencies/:slug": {
  return agenticResidencies.map((r) => `/agentic-ux/residencies/${r.slug}`);
}
```

Plus a top-of-file import from `@/data/agenticResidencies`.

Result — three new sitemap entries:

```
https://calm-magic.com/agentic-ux/residencies/diagnostic-sprint
https://calm-magic.com/agentic-ux/residencies/prototype-residency
https://calm-magic.com/agentic-ux/residencies/ecosystem-build
```

All other public routes in `ROUTE_REGISTRY` (About, Case Studies, Pricing, Book, GL!TCH, Calm Magic, Dream & Learn, Retreat, Wuxia, Tonalli, Tarot, Pattern Encyclopedia, Agentic UX, Design System, Lineage, Origins, Credits, Events & Retreats, Contact, Agentic Demo, Residencies + archetypes, Drift + library/year-month, Calm Magic Board sections, Trainings + slug) are already emitted by the existing sitemap builder — verified against the registry. No-index routes (auth, admin dashboards, PRD editor, training modules, agentic ecosystem deck) stay excluded, which is correct.

## robots.txt

Already correct — allows all crawlers and points to `https://calm-magic.com/sitemap.xml`. No change needed.

## Verification

After the edit, hit `/sitemap.xml` in the preview and confirm the three residency URLs appear alongside the existing entries.

## Out of scope

- No new routes, no OG image generation, no per-page priority tuning.
