## Plan — Top-of-site CTA: Hybrid Cognition Event

Add a new promotional banner at the very top of the site (above the existing Summer Deal / Book banners) inviting entrepreneurs and creatives to explore a new form of hybrid cognition, linking out to the Prisme.one event.

### 1. New component: `src/components/landing/HybridCognitionBanner.tsx`
- Sticky-eligible top banner, distinct gradient from Summer Deal (e.g. deep indigo → cyan) so the two stack visually without clashing.
- Bilingual copy via `LanguageContext`:
  - FR (primary): "Entrepreneurs & créatifs — plongez dans une nouvelle forme de cognition hybride."
  - EN: "Entrepreneurs & creatives — dive into a new form of hybrid cognition."
- CTA button → opens the Prisme.one URL in a new tab (`rel="noopener noreferrer"`), full UTM chain preserved.
- Dismiss (X) with `localStorage` key `hybrid_cognition_banner_dismissed_v1` (same pattern as `SummerDealBanner`).
- Fires `trackEvent('hybrid_cognition_cta_click', { location: 'top_banner' })` on click and `hybrid_cognition_banner_dismiss` on dismiss.

### 2. i18n
- Add `hybrid_cognition` keys to `src/i18n/en/landing.json` and `src/i18n/fr/landing.json` (tag, message, CTA label, dismiss label).

### 3. Mount
- In `src/pages/LandingPage.tsx`, render `<HybridCognitionBanner />` as the first child, above `BookAnnouncementBanner` and `SummerDealBanner`.

### 4. Verify
- Playwright screenshot of `/` at mobile + desktop to confirm stacking order and that the CTA is visible above the fold.

### Technical notes
- Frontend-only, no DB or edge function changes.
- External link — no routing changes.
- No changes to security, sitemap, or SEO metadata.
