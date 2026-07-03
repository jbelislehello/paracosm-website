## Goal
Replace fragile `/#contact` and `/#agentic-demo` hash links with dedicated, always-available routes.

## New routes (in `src/App.tsx`)
- `/contact` → new lazy page `src/pages/Contact.tsx`
- `/agentic-demo` → new lazy page `src/pages/AgenticDemo.tsx`

## New pages
Both are thin editorial-styled wrappers reusing the existing section components so content stays canonical (no duplication):

- `src/pages/Contact.tsx`
  - Renders `ContactSection` inside a minimal shell (header/nav + `Footer`) matching the site's magazine aesthetic.
  - Uses `usePageSeo` (title "Contact — Paracosm", description, `/contact` path).
  - Keeps the `id="contact"` on the section so legacy `#contact` deep links still work if reached.

- `src/pages/AgenticDemo.tsx`
  - Renders `AgenticEcosystemDemo` in the same shell.
  - `usePageSeo` with title "Live Agentic UX Demo — Paracosm", `/agentic-demo` path.
  - Keeps `id="agentic-demo"` on the section.

## Update outgoing CTAs
Point every previously-patched hash link to the new canonical routes:

| File | Old target | New target |
|---|---|---|
| `src/pages/Pricing.tsx` | `/agentic-ux#contact` | `/contact` |
| `src/components/UpgradePromptModal.tsx` | `/agentic-ux#contact` | `/contact` |
| `src/components/calm-magic/BoardEntryGate.tsx` | `/agentic-ux#contact` | `/contact` |
| `src/pages/WuxiaTheFox.tsx` | `#contact` | keep in-page anchor (section is on same page) — no change |
| `src/pages/DreamAndLearn.tsx` (2 links) | `/home#agentic-demo` | `/agentic-demo` |

Also sweep with `rg` for any remaining `/#contact`, `/#agentic-demo`, `/home#agentic-demo`, `/agentic-ux#contact` and repoint to the new routes (except in-page anchors within `LandingPage`, `Index`, `WuxiaTheFox`, and `AgenticEcosystemDemo` themselves).

## Route registry / SEO
- Add both routes to `src/lib/routeRegistry.ts` with labels "Contact" and "Live Demo" so breadcrumbs and sitemap pick them up.

## Out of scope
- No changes to `ContactSection` or `AgenticEcosystemDemo` internals.
- No form/business-logic changes.
- Existing `#contact` / `#agentic-demo` anchors on `LandingPage` / `Index` / `WuxiaTheFox` remain functional for anyone deep-linking there.
