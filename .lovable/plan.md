## Add per-axis + overall progress indicator to DreamSequence

Insert a compact progress block between the question header and the board grid in `src/components/calm-magic/dream/DreamSequence.tsx`.

### Progress model (derived state, no new state needed)

Per axis (`love`, `magic`, `calm`, `open`, `free`):
- Not started → `0%`
- `axis_begin` received → baseline `40%`
- During `narration` deltas → grows up to `90%` based on accumulated narration length (cap at 200 chars)
- `axis_end` received → `100%` (✓ check)

Overall: average of the 5 axes × 95, plus 5 when the `summary` event arrives. Caps at 100.

### UI

```
Channeling magic…                           62%
████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (gradient bar, rose→purple→amber)

█████ ✓   ████░ 70%   ░░░░ 0%   ░░░░ 0%   ░░░░ 0%
LOVE      MAGIC        CALM      OPEN      FREE
```

- One overall gradient bar (h-1.5) with status label + percent on the row above
- Five per-axis mini-bars (h-1, flex-1) tinted with each axis's `AXIS_META.color`
- Active axis bar pulses; completed axes show ✓
- `aria-live="polite"` on the wrapper so screen readers announce progress changes
- Hidden when an `error` is set (the error card replaces it)

No changes to the SSE handlers — purely derived from existing `axes`, `activeAxis`, `summary`, `done` state.

### Files

- `src/components/calm-magic/dream/DreamSequence.tsx` — add `axisProgress()` helper + `overallPct` derivation + progress JSX block before the board grid.
