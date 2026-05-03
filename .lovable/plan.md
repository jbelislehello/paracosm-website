## Keyboard activation for legend buttons and hotspots

Goal: Legend chips and `GeometryHotspot` triggers should be reachable via Tab and activatable via Enter/Space, updating the info panel the same way mouse hover/click does. Today both elements are `<button>`s so they receive focus, but their behavior on Enter/Space is incomplete:

- **Legend buttons** (`ExperienceDotsVisualization.tsx:900`) update `activeRegion` on `onFocus`, but pressing Enter/Space afterwards does nothing — there is no `onClick` and no toggle. Tabbing away (`onBlur`) clears the region, so the panel disappears as soon as the user moves on instead of latching.
- **Hotspots** (`GeometryHotspot.tsx`) call `handleTap` on click, which works with Enter/Space natively, but the parent's `onActiveChange` callback only re-anchors focus on hover/focus, not on activation. Enter/Space currently sets a 4-second timer that auto-clears `activeRegion`, which fights with the keyboard model.

### Changes

**1. `src/components/calm-magic/components/ExperienceDotsVisualization.tsx`**

Legend buttons (lines ~897–918):
- Add `onClick` and `onKeyDown` (Enter/Space) that **toggle** `activeRegion` between the force and `null`. Toggle persists after blur so keyboard users can latch a region.
- Remove the `onBlur` auto-clear when the region was set by an explicit activation. Track latched state via a small ref or by checking current `activeRegion === force` on click. Simplest: keep `onFocus` as a soft preview, and on click/Enter/Space set a "latched" flag in a `useRef<ActiveRegion | null>`. While latched, `onBlur` does not clear; Escape (already wired on the compass) clears both `activeRegion` and the latch.
- Add `aria-pressed={isActive}` to communicate state to AT.

Hotspot wiring (lines ~843–856):
- Pass an `onActivate` prop to `GeometryHotspot` that latches the region (same ref/state as legend) and calls `focusCompass()`. This makes Enter/Space on the hotspot behave like a click without the 4-second auto-dismiss for keyboard users.

Compass keyboard handler (lines ~595–609):
- Escape already clears `activeRegion`; also clear the latch ref.

**2. `src/components/calm-magic/geometry/GeometryHotspot.tsx`**

- In `handleTap`, only schedule the 4-second auto-close timer for touch/mouse events, not for keyboard activations. Detect via `e.type === 'touchstart'` or by checking `e.detail === 0` on click (keyboard-triggered clicks have `detail === 0`). When keyboard-triggered, leave the tooltip open and skip the timer; rely on blur/Escape to close.
- Add an explicit `onKeyDown` for Enter/Space on the trigger that calls the same path as `handleTap` and signals keyboard activation, so the parent can latch.

**3. Tests — `src/components/calm-magic/components/__tests__/ExperienceDotsVisualization.keyboard.test.tsx`**

Add cases:
1. **Tab to legend, Enter latches region.** `userEvent.tab()` until a legend button (e.g., Sovereignty) is focused, press `{Enter}`, expect `getByRole('status')` shows "Sovereignty" and remains after a subsequent `tab()` moves focus away.
2. **Space toggles legend region off.** From the latched state, refocus same legend button and press `{Space}`; expect `queryByRole('status')` is null.
3. **Enter on a hotspot updates the panel.** Focus a `GeometryHotspot` button (find by `aria-label`), press `{Enter}`, expect the info panel shows the matching label and persists (no auto-clear within the test window — use a short `await` rather than fake timers).
4. **Escape clears latched region from legend.** After Enter latches Sovereignty, press `{Escape}`; expect panel removed.

### Out of scope

- No visual redesign of legend chips or hotspots.
- No changes to arrow-key navigation, outside-click clearing, or rotation/audio.
- Touch behavior of hotspots (4s auto-close) is preserved.

### Files

- `src/components/calm-magic/components/ExperienceDotsVisualization.tsx`
- `src/components/calm-magic/geometry/GeometryHotspot.tsx`
- `src/components/calm-magic/components/__tests__/ExperienceDotsVisualization.keyboard.test.tsx`
