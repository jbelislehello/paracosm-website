## Goal

When a user hovers/taps a `GeometryHotspot`, the corresponding region of the torus visualization should visibly *light up* in sync — so the explanation in the tooltip matches a clear visual change on the figure. Today the tooltip opens but the underlying geometry doesn't react, so the link between word and shape is invisible.

## Approach

Lift "which hotspot is active" into the parent component as a single string state (`activeRegion`), pass an `onHoverChange(active: boolean)` callback down to each `GeometryHotspot`, and let the parent SVG read that state to animate the matching shape (stroke, opacity, scale, halo).

### 1. `GeometryHotspot.tsx` — emit hover/focus state

Add an optional callback so the parent learns when the hotspot is "active" (hovered, focused, or tapped):

- New prop: `onActiveChange?: (active: boolean) => void`
- Wire `onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur` on the trigger button.
- On tap (touch), call `onActiveChange(true)` immediately and `onActiveChange(false)` when the 4s timer fires (in addition to the existing `setOpen` behavior).
- Keep all existing behavior (tooltip persistence, dashed affordance) unchanged.

### 2. `TorusRelationnel.tsx` — animated phase highlight

- Add `const [activeRegion, setActiveRegion] = useState<string | null>(null);` (values: `'center' | 'flow' | TorusPhase`).
- Pass `onActiveChange={(a) => setActiveRegion(a ? phase : null)}` to each phase hotspot, and `'center'` / `'flow'` for the center and rotating-tangent hotspots.
- In the SVG render of each phase arc:
  - When `activeRegion === phase`, animate fill from `transparent` → `hsl(var(--primary)/0.28)`, stroke from border → `hsl(var(--primary))`, `strokeWidth` 1 → 1.6, and add a subtle outward `transform: scale(1.04)` around the arc's quadrant center via a `<g>` wrapper with `transform-origin` and a CSS `transition: all 250ms ease-out`.
  - Add a soft halo: a second `<path>` duplicate of the arc at `opacity: 0.35`, `strokeWidth: 4`, `filter: blur(2px)` only when active.
- For `'center'`: pulse the central dot — bump radius (`6 + breath*2` → `9 + breath*2`) and add a faint expanding ring (`<circle>` with growing `r` and fading `opacity`, CSS-transitioned).
- For `'flow'`: thicken the rotating tangent line (1.2 → 2) and brighten its opacity (0.6 → 1), plus enlarge the moving dot.
- Also reflect `activeRegion === phase` in the bottom 2-column phase label grid (same `bg-primary/10 border-primary/30` treatment as the active phase) so the legend stays in sync with the figure.

### 3. `TorusEnergyField.tsx` — same pattern, anatomy-aware

Apply the identical lifted-state pattern so the four hotspots ("Outer skin", "Inner flow", "Throat κ", "Attention frame T·N") each highlight their target on hover/tap:

- Outer skin: when active, increase `strokeWidth` 1.2 → 2.2 and opacity to 0.95, add a blurred halo ellipse behind it, and scale the breathing group very slightly (`breathScale * 1.02`).
- Inner flow: same treatment on the red inner ellipse.
- Throat κ: enlarge the central dot (`4 + breath*2` → `8 + breath*2`), brighten to full opacity, and pulse a faint dashed circle outward.
- Attention frame: scale the `FrenetFrame` arrows up (`scale={20}` → `scale={28}`) and increase their opacity. Implement by passing an `emphasis` prop to `FrenetFrame` (default false → multiplies `scale` and `opacity`).
- Also link the bottom anatomy legend cards (Tangent / Normal / Curvature) to the same `activeRegion` state so hovering a legend card triggers the same SVG highlight, and hovering the SVG hotspot highlights the matching legend card (`ring-2 ring-[color]`).

### 4. Motion + accessibility

- All transitions: `transition: all 220ms ease-out` (CSS, not Framer) to stay lightweight and match the existing breathing aesthetic.
- Respect `prefers-reduced-motion`: wrap the scale/halo additions in a `useReducedMotion` check (simple `window.matchMedia('(prefers-reduced-motion: reduce)')` hook in `src/hooks/usePrefersReducedMotion.ts`, new file). When reduced, only color/opacity changes apply — no scale, no blur halos.
- Keep the current "breathing" baseline animation untouched; the highlight composes on top of it.

## Files

- `src/components/calm-magic/geometry/GeometryHotspot.tsx` — add `onActiveChange` prop and wire hover/focus/tap.
- `src/components/journal/TorusRelationnel.tsx` — lift `activeRegion` state, animate arc + center + tangent highlight, sync bottom phase grid.
- `src/components/calm-magic/components/TorusEnergyField.tsx` — lift `activeRegion` state, animate skin/flow/throat/frame highlight, two-way link to anatomy legend cards.
- `src/components/calm-magic/geometry/FrenetFrame.tsx` — add optional `emphasis` prop (scale + opacity multiplier).
- `src/hooks/usePrefersReducedMotion.ts` — new tiny hook returning a boolean.

## Out of scope

- No changes to `TorusPhase` data model, no new tooltip copy, no new hotspots — purely linking existing tooltip activation to a visible animated highlight on the matching geometry.
