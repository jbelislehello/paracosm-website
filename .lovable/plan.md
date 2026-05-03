# Plain-language tooltips on the two Torus visualizations

Make the geometric labels (Tangent T, Normal N, Curvature κ, Throat, Outer skin, Inner flow, Phase arcs, Attention flow) understandable to a non-mathematician by adding hover-and-tap tooltips that translate each symbol into one or two sentences of human language.

## Approach

Use shadcn's existing `Tooltip` (already installed) for desktop hover and a unified `Popover` fallback for touch tap. Since SVG `<g>` elements are awkward to wrap in Radix triggers, overlay small **invisible HTML hotspot divs** positioned absolutely over the SVG, sized to each anatomical region. Hotspots get:
- `cursor-help` on desktop
- `aria-label` for screen readers
- A subtle dotted underline / dashed circle on hover to confirm interactivity
- Open on hover *and* on click/tap (via a tiny `useTapHover` helper that toggles Tooltip `open` state)

Add a shared primitive so both components stay consistent.

## New file

**`src/components/calm-magic/geometry/GeometryHotspot.tsx`**
- Props: `style` (positioning), `label`, `body`, `symbol?`, `accent?`
- Renders an absolutely positioned div containing a `Tooltip` whose trigger is a small focusable span. On `onClick`/`onTouchStart` it sets `open` true for ~4s; `onMouseEnter`/`Leave` keep normal hover behavior.
- Tooltip content: serif italic symbol + label heading, then a short plain-language paragraph.

## `TorusEnergyField.tsx` changes

Wrap the existing `<svg>` in `<div className="relative">` and add an absolutely-positioned overlay layer. Add hotspots over:

| Region | Plain language |
|---|---|
| Outer skin | "The collective edge — how the whole group is holding together right now." |
| Inner flow | "The personal current — what each individual is learning underneath." |
| Throat κ(s) | "The narrow place where attention concentrates and new ideas get born." |
| Attention frame (T/N marker) | "Where the group's focus is moving (T) and the direction it's quietly bending toward (N)." |
| Tangent T (legend card) | Already has copy; wrap with tooltip giving longer plain version. |
| Normal N (legend card) | Same. |
| Curvature κ (legend card) | Same. |

Hotspot positions are computed from the same `cx, cy, R, r` constants already in the file, converted to percentages of the 400×320 viewBox so they track the responsive SVG.

## `TorusRelationnel.tsx` changes

Same pattern, smaller scale (150px square). Hotspots over:

| Region | Plain language |
|---|---|
| Center point | "You — the still point the four phases move around." |
| Tangent line (rotating) | "The pulse of attention right now: where contact is heading next." |
| Each phase arc (Approche, Ouverture, Intensité, Retrait) | One-sentence felt-sense description, e.g. *Approche*: "Sensing toward the other before any words." |
| Dashed flow diamond | "The natural cycle — contact rises, peaks, releases, returns." |

Phase arc tooltips replace the need to read the small letters; clicking still calls `onPhaseChange` (hotspot wraps but does not block the underlying `<path>` click — handled by forwarding the click).

## Mobile / tap behaviour

`useTapHover` (inline in `GeometryHotspot.tsx`):
```ts
const [open, setOpen] = useState(false);
const onTap = () => { setOpen(true); window.setTimeout(() => setOpen(false), 4000); };
```
Pass `open` + `onOpenChange` to `Tooltip` so Radix still handles hover; tap forces it open on touch devices where hover is unreliable.

## Visual affordance

A 1px dashed circle (or rectangle for the legend cards) appears at 30% opacity on hover/focus so users discover the hotspots without cluttering the figure at rest. No always-visible icons — keeps the "textbook plate" aesthetic intact.

## Files

- **Create**: `src/components/calm-magic/geometry/GeometryHotspot.tsx`
- **Edit**: `src/components/calm-magic/components/TorusEnergyField.tsx` (add overlay layer + hotspots + wrap legend cards)
- **Edit**: `src/components/journal/TorusRelationnel.tsx` (add overlay layer + phase/center/tangent hotspots)

No new dependencies.
