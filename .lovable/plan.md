## Focus management for the SVG compass

Goal: ensure the compass keyboard region (`data-testid="compass-keyboard-region"`) holds focus appropriately so keyboard navigation, info panel, and visual highlights stay consistent across pointer and programmatic interactions.

### Current behavior

- Wrapper at `ExperienceDotsVisualization.tsx:562` is `tabIndex={0}` with arrow-key handling, but:
  - Clicking the SVG (`onClick={handleSVGClick}` at line 588) places focus on the inner `<svg>` (or nowhere), so subsequent arrow keys do nothing.
  - Hovering a `GeometryHotspot` or legend button changes `activeRegion` but never moves focus, so arrow keys after a hover still operate from wherever focus last was.
  - When `activeRegion` changes programmatically (autonomous rotation, hotspot hover), focus does not follow, and there is no visible focus state on the compass region.
  - Clicking outside the compass leaves `activeRegion` set; focus ring stays even though the user has moved on.

### Changes (single file: `src/components/calm-magic/components/ExperienceDotsVisualization.tsx`)

1. **Wrapper ref + helper.** Add `const compassRegionRef = useRef<HTMLDivElement>(null)` and attach to the wrapper div at line 562. Add a small helper `focusCompass()` that calls `compassRegionRef.current?.focus({ preventScroll: true })`.

2. **Click on SVG re-focuses the compass region.** In the wrapper's `onMouseDown` (use mousedown, not click, to avoid the focus-then-blur flicker on Safari), call `focusCompass()`. Keep `handleSVGClick` for placement logic. Also set `tabIndex={-1}` on the inner `<svg>` so it is not itself a focus target.

3. **Pointer interactions on hotspots/legend re-anchor focus.** When `GeometryHotspot.onActiveChange(true)` fires (line 821) or a legend button receives `onMouseEnter`/`onFocus` (lines 870–873), call `focusCompass()` so arrow keys continue from the just-activated axis. Legend buttons that already receive native focus remain functional; their existing `onFocus` handler stays.

4. **Keep focus on programmatic region changes.** When `activeRegion` changes and the wrapper currently contains `document.activeElement` (or contains nothing focused yet but the user previously interacted), re-assert focus via a `useEffect([activeRegion])` that only refocuses if `compassRegionRef.current?.contains(document.activeElement)` is true. This avoids stealing focus when the user is typing elsewhere.

5. **Escape returns focus to wrapper and clears region.** Existing Escape handler already sets `activeRegion = null`; additionally call `focusCompass()` so the visible focus ring stays on the compass group rather than disappearing into the document body.

6. **Outside click clears active region.** Add a `useEffect` listening on `mousedown` at the document level: if the click target is not inside `compassRegionRef.current`, call `setActiveRegion(null)`. This prevents stale highlights when the user moves on.

7. **Visible focus state.** The wrapper already has `focus-visible:ring-2 focus-visible:ring-purple-400`; no change needed, but verify the ring renders above the SVG by adding `relative z-0` (already `relative`) and ensuring no child has a higher stacking context that would hide it. If needed, add `focus-visible:ring-offset-2 focus-visible:ring-offset-background`.

### Tests (extend `__tests__/ExperienceDotsVisualization.keyboard.test.tsx`)

Add three cases:

1. **Click on SVG focuses the compass region.** Render, `fireEvent.mouseDown` on the inner `<svg>`, expect `document.activeElement === getByTestId('compass-keyboard-region')`.
2. **Escape restores focus to the compass.** After ArrowRight then a manual `blur()`, press Escape via `user.keyboard('{Escape}')` while the wrapper still owns focus; expect status panel removed and `document.activeElement` is the compass region.
3. **Outside click clears active region.** After ArrowRight shows "Sovereignty", `fireEvent.mouseDown(document.body)`; expect `queryByRole('status')` returns null.

### Out of scope

- No changes to rotation, audio, hotspot tooltip behavior, or info panel markup.
- No new dependencies.

### Files

- `src/components/calm-magic/components/ExperienceDotsVisualization.tsx` (focus ref, mousedown handlers, effects)
- `src/components/calm-magic/components/__tests__/ExperienceDotsVisualization.keyboard.test.tsx` (3 new cases)
