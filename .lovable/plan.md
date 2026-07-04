## Problem

On `/` (EditorialHome), chapters render as **01 → 02 → 03 → 05 → 04**:

- `TriadChapter` 01 Foreplay
- `TriadChapter` 02 Foresight
- `TriadChapter` 03 Forecast
- `NavigatorPositioningSection` (no numeral)
- `PartnerInnovationPlaysSection` (no numeral)
- `EditorialBulletinsSection` — hard-coded `numeral="05"`
- `EditorialDispatchesSection` — hard-coded `numeral="04"`
- `EditorialClosing`

## Fix

Swap the numerals so the on-page order matches the count. Keep component order unchanged (Bulletins before Dispatches is the intended editorial flow per prior decisions).

- `src/components/editorial/EditorialBulletinsSection.tsx` — change `numeral="05"` → `numeral="04"` (and update any "Chapter 05" copy in that section, plus internal cross-references if present).
- `src/components/editorial/EditorialDispatchesSection.tsx` — change `numeral="04"` → `numeral="05"` (and update any "Chapter 04" copy / cross-references).

## Verification

- `rg -n "0[45]" src/components/editorial/EditorialBulletinsSection.tsx src/components/editorial/EditorialDispatchesSection.tsx` to catch any stray numeral strings beyond the `numeral` prop.
- Visually confirm the homepage now reads 01 → 02 → 03 → 04 → 05.

## Out of scope

- No renumbering of Chapters 01–03.
- No reordering of sections.
- No numeral added to `NavigatorPositioningSection` or `PartnerInnovationPlaysSection` (they are intentionally interstitial).
