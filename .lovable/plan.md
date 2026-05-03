## Add Contextual Info Panel for Active Force Axis

Display `REGION_COPY` content for the currently `activeRegion` in a small panel anchored beside the rotating Freedom arrow inside `ExperienceDotsVisualization.tsx`.

### Behavior

- Visible only when `activeRegion` is non-null (covers Sovereignty, Memory, Intimacy, Novelty, and Freedom).
- Renders the region's `symbol`, `label`, and `body` from the existing `REGION_COPY` map.
- Color-keyed: border / symbol use `getForceColor(activeRegion)` for the four forces; Freedom uses the existing `#ff6b6b` accent.
- Anchored on the SVG-overlay layer (same parent as the `GeometryHotspot` overlays) so it stays in sync with the compass. Position: just outside the arrow's reach, top-right of the compass area, so it never covers the rotating arrow or cardinal labels.
- Smooth fade/slide-in (`opacity` + small translate, ~200ms) and respects `prefersReducedMotion` (no transform, instant opacity).
- Non-interactive (`pointer-events-none`) so it doesn't steal hover from hotspots / dots.
- `aria-live="polite"` region for screen readers; panel itself uses `role="status"`.

### Layout

```text
+-----------------------------------------------+
|                       [ S  Sovereignty     ]  |
|        ◌  ← compass    [ Your sense of ... ]  |
|       arrow                                   |
+-----------------------------------------------+
```

- Absolute-positioned div inside the same `relative` container that wraps the SVG and `GeometryHotspot`s (around line 805 closing `</div>`).
- Tailwind: `absolute top-3 right-3 max-w-[220px] rounded-md border bg-background/90 backdrop-blur p-3 shadow-sm pointer-events-none`.
- Mobile (current viewport 390px): cap `max-w-[60%]` and shrink padding so it doesn't crowd the compass.

### Technical Changes (single file)

`src/components/calm-magic/components/ExperienceDotsVisualization.tsx`

1. After the closing `</svg>` block and the hotspots map (around line 804), add a new `{activeRegion && (...)}` JSX block rendering the panel.
2. Read `REGION_COPY[activeRegion]` and `getForceColor` (forces only; Freedom uses red literal).
3. Use `usePrefersReducedMotion` (already imported per prior work) to switch between transform-based entrance and pure opacity.
4. No new state, no new effects, no new deps — purely derived from existing `activeRegion`.

### Out of Scope

- No changes to hotspot positions, arrow easing, or legend.
- No new copy strings; reuses existing `REGION_COPY`.