

# Comprehensive Site Fixes -- Errors, UX, Readability, Findability

## Issues Found

After a full audit of the public-facing pages (`/`, `/paracosm-retreat`, `/drift`, `/calm-magic-assistant`), here are all the issues to fix:

---

### 1. Drift page title is nearly invisible
The "Drift" heading uses a gradient that blends into the white background, making it unreadable.

**Fix:** Change the gradient colors in `src/pages/DriftLanding.tsx` to use visible, high-contrast colors (e.g., `from-slate-800 via-purple-600 to-blue-600`).

---

### 2. Retreat landing page missing Footer
`/paracosm-retreat` ends abruptly after the invitation form with no footer.

**Fix:** Import and add `<Footer />` at the bottom of `src/pages/ParacosmRetreatLanding.tsx`.

---

### 3. Footer copyright year says 2025
The footer bottom bar shows "2025" instead of "2026."

**Fix:** Update the year in `src/components/Footer.tsx` from `2025` to `2026`.

---

### 4. Event category badges all link to Medium
In `src/components/ParacosmEventsSection.tsx`, every event card's category badge is wrapped in an `<a>` tag linking to `https://medium.com/futurographer`. This is confusing -- users clicking a category badge expect filtering, not navigation to an external blog.

**Fix:** Remove the `<a>` wrapper from the category badge and render it as a plain `<span>` or keep it as a styled div.

---

### 5. Footer "Retreats" item is plain text, not a link
The Paracosm column in the footer shows "Retreats" as non-clickable text. Now that the `/paracosm-retreat` page exists, it should be a link.

**Fix:** Change from `<span>` to `<Link to="/paracosm-retreat">` in `src/components/Footer.tsx`.

---

### 6. Footer "Satori & Kensho" is plain text, not a link
Same issue -- it should link to `https://suno.com/@jbelisle` as it does in the Universe section.

**Fix:** Change from `<span>` to `<a href="https://suno.com/@jbelisle" target="_blank">` in `src/components/Footer.tsx`.

---

### 7. Footer "IoTheatre" is plain text with no destination
Currently just a label. This is acceptable if there is no page yet, but visually it looks like a dead item.

**Fix:** Add a subtle `text-slate-500` style or a "(Coming Soon)" indicator to distinguish it from clickable links. No code link needed.

---

## Files Modified

| File | Change |
|------|--------|
| `src/pages/DriftLanding.tsx` | Fix "Drift" title contrast |
| `src/pages/ParacosmRetreatLanding.tsx` | Add Footer |
| `src/components/Footer.tsx` | Fix year, link Retreats, link Satori & Kensho |
| `src/components/ParacosmEventsSection.tsx` | Remove misleading Medium link from category badges |

