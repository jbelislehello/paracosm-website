## Goal
Restyle `OfferingTriadSection.tsx` to match the site-wide magazine editorial system — remove all bloom/VHS treatments (scanlines, chroma text, gradient halos, VHS/Redacted fonts, magenta/amber blur orbs).

## What changes

**Section shell**
- Replace `bloom-ink` background + scanlines + magenta/amber blur halos with `EditorialSection` wrapper (tone `night` — keeps the dramatic dark register the current design uses, but through the editorial tokens with gold accent).
- Header uses `EditorialChapterHeader` (numeral "02", kicker "The Arc", subtitle "One practice, three intensities.").
- Kill `font-vhs`, `font-display`, `font-redacted`, `bloom-chroma-static`. All headlines → `font-serif`. All labels → `editorialType.kicker` / `caption` / `cta`.

**Triad cards**
- Remove gradient halo divs, backdrop-blur, rounded-2xl gradient icon chips, framer-motion stagger.
- Each card becomes an editorial index-card: hairline top border, tabular numeral (01/02/03), small kicker with offering label, large serif F-word, italic serif promise, checklist with thin dividers, editorial CTA (`editorialType.cta` + `night.accentBorder` underline).
- Preserve all data: `fWord`, `label`, `route`, `promise`, `bullets`, `cta`, `Icon`, and the `trackEvent` analytics call.

**Connective line**
- Bottom "Foreplay → Foresight → Forecast" strip restyled with `editorialType.caption` and gold divider.

## Scope
- Single file: `src/components/landing/OfferingTriadSection.tsx`.
- No prop/API changes; drop-in replacement.
- No other files touched.

## Technical notes
- Import `EditorialSection`, `EditorialChapterHeader`, `editorialTone`, `editorialType` from `@/components/editorial`.
- Drop `framer-motion` and `Button` imports (no longer needed).
- Keep `Link`, `trackEvent`, and lucide icons (`Flame`, `Eye`, `Hammer`, `ArrowUpRight`, `Check`).
