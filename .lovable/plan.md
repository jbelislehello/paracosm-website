## Yutori Nights copy + GL!TCH description contrast

### 1. Update Yutori Nights description
File: `src/pages/EventsAndRetreats.tsx` (Yutori Nights section, ~line 107)

Replace the current placeholder paragraph and the "Next date & city — TBA" line with the user's positioning:

> Yutori Nights is a series of listening & dance parties designed around **hybrid cognition** and **creative somatics** — a private event where AI meets sensory pleasures, music, and audio-visuals.

Keep it as one paragraph inside the existing `<p>` (same `font-redacted italic text-white/80` classes so it stays on-tone in the dark section). Remove the "Next date & city — TBA" caption since the new description reframes it as an ongoing series (or keep as "By invitation · dates announced per city" — see question below).

### 2. Darken GL!TCH card descriptions
File: `src/components/ParacosmEventsSection.tsx` (line 137)

The event card descriptions (which include all four GL!TCH events) currently use:

```
text-sm text-slate-600 dark:text-slate-300
```

against a near-white card. That's the low-contrast body the user is calling out.

Bump to:

```
text-sm text-slate-800 dark:text-slate-100 font-medium
```

This is a card-wide change (affects all events in the grid, not just GL!TCH) because they share one template — darkening only GL!TCH would create inconsistent typography inside the same grid. This matches the user's brand-consistency preference.

### Out of scope
- No changes to the editorial hero, layout, or Yutori CTA button.
- No touch to Calm Magic Board / Tier 4 surfaces.

### Question
Should the "Next date & city — TBA" line under Yutori be removed, or kept/rephrased (e.g. "By invitation · dates announced per city")?