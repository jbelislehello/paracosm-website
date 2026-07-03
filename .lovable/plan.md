# Editorial Front Door

A new magazine-style homepage becomes the true entry to paracosm. The current landing moves to `/home` and stays reachable from nav. The editorial page previews the scope of paracosm's imagination capabilities and routes people into the deeper site.

## Routing changes

- `/` renders the new `EditorialHome` page.
- Current `LandingPage` moves to `/home` (component untouched; only the route path changes in `src/App.tsx`).
- Add "Home" link in nav pointing to `/home` so nothing is orphaned.
- Preserve `/index` redirect behavior.

## Page structure (top → bottom)

1. **Opening spread** — Oversized display-serif headline (a single sentence about imagination as infrastructure), small kicker "Paracosm — an editorial", scroll cue. Image-forward, generous whitespace.
2. **The triad manifesto** — Three full-width editorial "chapters", one per offer family. Each chapter is a magazine spread: large numeral (01/02/03), display headline, pull quote, 2-column body, one hero image, one CTA into the real section.
   - **01 · Foreplay** (Trainings) — imagination as rehearsal. Links to `/trainings`.
   - **02 · Foresight** (Vision Retreats) — imagination as premonition. Calm Magic woven in here: the 5-axis compass (Love · Magic · Calm · Open · Free) framed as the instrument of foresight, plus the *Intelligence* and *Systems* Gardens as the retreat's inner terrain. Links to retreats.
   - **03 · Forecast** (Prototype Residencies) — imagination as measurable outcome. Calm Magic woven in here too: the *Prototypes Garden* + engineering-grade ROI benefits (reduced turnover, innovation acceleration, alignment efficiency, avoids the 60–80% transformation failure rate). Links to residencies.
3. **Innovation plays with partners** — Reuse the existing `NavigatorPositioningSection` (Base44/Lovable/Crewdle) as the ecosystem map, followed by a new `PartnerInnovationPlaysSection` — a 3-card grid describing the unique play paracosm runs with each partner (what it unlocks, who it's for, the outcome). Editorially framed, not logo-soup.
4. **Closing spread** — Statement + dual CTA: "Enter the site" → `/home`, "Book a discovery call" → mailto. Small footer with links to Trainings, Retreats, Residencies, Book.

## New/edited files

- `src/pages/EditorialHome.tsx` (new)
- `src/components/editorial/EditorialHero.tsx` (new)
- `src/components/editorial/TriadChapter.tsx` (new, reused 3x with props; Calm Magic content passed into chapters 02 and 03)
- `src/components/editorial/PartnerInnovationPlaysSection.tsx` (new)
- `src/components/editorial/EditorialClosing.tsx` (new)
- Reuse: `NavigatorPositioningSection`, `RelationalPlaceQuote` (as pull quote inside chapter 02).
- `src/App.tsx` — swap `/` to `EditorialHome`, add `/home` → `LandingPage`.
- `src/pages/LandingPage.tsx` — add "Home" nav entry pointing to `/home` (or `/`).
- `src/lib/routeRegistry.ts` + `src/lib/sitemap.ts` — register `/home`, keep `/` as editorial.

## Technical notes

- Design tokens only (no hardcoded colors). Use existing display font stack; if a stronger editorial serif is needed, install one @fontsource package and add a `font-editorial` token.
- framer-motion for restrained reveals (fade + slight y on chapter entry), respect `prefers-reduced-motion`.
- Images: reuse existing brand assets from `src/assets/`; generate 1–2 editorial hero images only if no suitable asset exists.
- SEO: set title/description via `usePageSeo`; add `Article`-style JSON-LD is not needed here (marketing page). Keep single H1 in the opening spread.
- Analytics: `trackEvent` on each chapter CTA, partner card, and the two closing CTAs.
