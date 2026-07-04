## Verification plan

Fetch the running dev server's `/sitemap.xml` and inspect it directly, then cross-check against `ROUTE_REGISTRY` and the residency data.

### Steps

1. `curl -s http://localhost:8080/sitemap.xml` and save to `/tmp/sitemap.xml`.
2. Confirm the three residency URLs are present with correct `<loc>`:
   - `https://calm-magic.com/agentic-ux/residencies/diagnostic-sprint`
   - `https://calm-magic.com/agentic-ux/residencies/prototype-residency`
   - `https://calm-magic.com/agentic-ux/residencies/ecosystem-build`
3. Confirm every non-`noindex` entry in `ROUTE_REGISTRY` appears once (static + expanded dynamic: drift axes, drift year/month, trainings slugs, residency archetypes, agentic residency slugs).
4. Confirm `<lastmod>` on every entry equals today's date (the builder uses `new Date().toISOString().slice(0,10)` — no per-entry override exists in code, so all rows share the build date; this is expected).
5. Confirm each residency's canonical URL matches what `usePageSeo` emits on the page (`/agentic-ux/residencies/${slug}` against host `https://calm-magic.com`) — a quick read of `src/pages/AgenticResidency.tsx` is enough; no need to boot the page.
6. Report the full URL count, any missing routes, and any drift between sitemap `<loc>` and page canonical.

### Notes on `lastmod`

The current builder has no per-route `lastmod` — every URL gets today's date. That's valid per the sitemap spec and fine for search engines, but if you want per-residency `lastmod` (e.g. tied to a `updatedAt` field on each residency), that's a separate feature — flag it and I'll plan it.

### Out of scope

- No code changes; verification only.
- No live crawler / Search Console submission (that's a publish-time step).
