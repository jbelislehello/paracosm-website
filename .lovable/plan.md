## 1. Remove the "Why it works" recap from the Design System page

`src/pages/DesignSystemShowcase.tsx` currently renders `<WhyItWorksRecap lens="design-system" />` near the top. Remove that JSX line and its import. The `WhyItWorksRecap` component and its `"design-system"` lens stay in the codebase (still usable elsewhere), we just stop rendering it on `/design-system`.

## 2. Surface the Book in navigation

The Book launch page exists at the route `/book` (`src/pages/BookLaunch.tsx`), with chapter pages under `/book/chapter/:slug`. Today it's only reachable from:
- the top `BookAnnouncementBanner` (sitewide banner)
- one card inside the landing page

It is **not** in the main nav, which is likely why it feels "missing".

Proposed fix: add a "Book" link to the primary navigation in `src/pages/LandingPage.tsx` (both desktop and mobile menus), styled with the same `font-vhs uppercase tracking-[0.3em]` Static Bloom treatment used for the other nav items (e.g. "Events & Retreats"). Place it next to "Events & Retreats". Also add the `book` key to `src/i18n/en/navigation.json` and `src/i18n/fr/navigation.json` (`"book": "Book"` / `"book": "Livre"`).

No other pages or behavior change.