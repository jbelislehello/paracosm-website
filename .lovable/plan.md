## Goal

Give every shareable page its own canonical URL and unique social preview metadata (title, description, og:url, og:title, og:image, twitter card) — so when you share a link to the Calm Magic demo or Dream & Learn page, the URL and preview reflect that specific page rather than the homepage.

## Approach

Currently `index.html` hard-codes a single canonical (`https://paracosm.helloarchitekt.com/`) and OG block, and only `document.title` is updated per page. We'll introduce a tiny reusable hook that updates the canonical link + OG/Twitter meta tags on mount, then call it from each page.

No new dependencies (no react-helmet) — a lightweight hook keeps bundle size flat and matches the existing pattern already used in `CalmMagicDemo.tsx`.

## Changes

### 1. New hook — `src/hooks/usePageSeo.ts`
A small utility that, given `{ title, description, path, image? }`:
- sets `document.title`
- upserts `<link rel="canonical">` to `https://paracosm.helloarchitekt.com{path}`
- upserts `<meta name="description">`
- upserts `<meta property="og:title">`, `og:description`, `og:url`, `og:image`, `og:type`
- upserts `<meta name="twitter:title">`, `twitter:description`, `twitter:image`, `twitter:card`

Uses the project's primary custom domain (`paracosm.helloarchitekt.com`) as the canonical host so shared links unify there regardless of which deployment URL the visitor opened.

### 2. Apply per-page SEO

Update these pages to call `usePageSeo` with unique values:

| Page | Path | Canonical |
|---|---|---|
| `LandingPage.tsx` | `/` | `https://paracosm.helloarchitekt.com/` |
| `CalmMagicDemo.tsx` | `/calm-magic-demo` (current route) | `…/calm-magic-demo` |
| `DreamAndLearn.tsx` | `/dream-and-learn` | `…/dream-and-learn` |
| `ParacosmRetreatLanding.tsx` | `/retreat` | `…/retreat` |
| `Drift.tsx`, `GlitchMethodology.tsx`, `BookLaunch.tsx`, `Pricing.tsx`, `AboutUs.tsx`, `CaseStudies.tsx`, `WuxiaTheFox.tsx`, `Tonalli.tsx` | their existing routes | matching canonical URLs |

I'll confirm each route by reading `src/App.tsx` before wiring values.

Each page gets:
- a unique title (most already have one — kept/refined)
- a unique description tuned to that page's offering
- its specific canonical path

### 3. Clean `index.html`
Keep the homepage canonical/OG as the default fallback (for crawlers hitting before JS executes), but the per-page hook will override at runtime for SPAs and for social scrapers that execute JS (LinkedIn/Twitter generally use the static HTML, so the homepage default remains as a sensible baseline).

### 4. Optional small enhancement
For the Calm Magic demo, since `calm-magic.com` is also a custom domain, I'll keep canonical pointed at the `paracosm.helloarchitekt.com/calm-magic-demo` URL for SEO consolidation. Let me know if you'd rather canonicalize Calm Magic pages to `calm-magic.com` instead — happy to switch.

## Files

- **Create:** `src/hooks/usePageSeo.ts`
- **Edit:** `src/pages/LandingPage.tsx`, `src/pages/CalmMagicDemo.tsx`, `src/pages/DreamAndLearn.tsx`, plus the additional landing-style pages listed above.

## Note on social previews

Social platforms (LinkedIn, Facebook, Twitter, iMessage) read the static HTML — they do **not** execute React. The runtime hook gives Google + browser tabs unique canonicals immediately, but to get unique preview cards per page on social shares we'd need either prerendering or static `index.html`-injected meta. If unique social card images per page matter to you, tell me and I'll add a follow-up plan for prerendering those routes.