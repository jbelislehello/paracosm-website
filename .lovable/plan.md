
# Add Tools to Axis Library Pages

## Problem
The axis library pages (`/drift/library/love`, `/drift/library/magic`, etc.) aggregate all resources for a given Calm Magic axis but do not include tools. Tools only appear on individual monthly discovery pages.

## Solution
Add a "Tools" section to `DriftLibrary.tsx` that collects all tools from `driftTools.ts` matching the current axis and displays them as cards, consistent with how they appear on monthly pages.

## Changes

### `src/pages/DriftLibrary.tsx`

1. **Import** `driftTools` from `@/data/driftTools` and `Wrench` from `lucide-react`
2. **Filter tools** by axis: `const allTools = driftTools.filter(t => t.axis === axisKey)`
3. **Update total count** to include `allTools.length`
4. **Add a "Tools" section** after the Artefacts section (or after Videos), rendering each tool as a card with:
   - Name (bold, linked to external URL)
   - Starting price (Badge)
   - Description (muted text)
   - Month/year label showing when it was discovered
5. Section is hidden if no tools exist for that axis

### No other files changed

## Technical Details

The tool cards will follow the same Card/CardContent pattern used for books:

```text
Tools (section header with Wrench icon + count)
  |
  +-- Card: Tool name, price badge, description, month/year, external link
  +-- Card: ...
```

Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (same as books).

### Files modified
- `src/pages/DriftLibrary.tsx` -- add tools section with axis filtering
