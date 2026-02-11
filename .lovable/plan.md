

# Integrate Expressivity Tools into Calm Magic Board

## Overview

The Calm Magic Expressivity Tools panel (currently a floating popup window on the Team Coaching page) will be moved into the Calm Magic Board as a new tab. The Team Coaching page will be simplified to show coaching content and a CTA to launch the Board.

## What Changes

### 1. Add "Expressivity" tab to the Calm Magic Board (`src/pages/CalmMagicBoard.tsx`)

- Add `'expressivity'` to the `ViewTab` type union
- Add a new tab trigger in both desktop and mobile sub-navigation (using a Heart or Sparkles icon)
- Render `InteractiveToolsPanel` when the expressivity tab is active, passing the board's own `emotionalState`-equivalent data (shadow position, season qualities, etc.) to connect the tools to the board's live state
- The "Boussole Calm Magic" CTA inside InteractiveToolsPanel already links back to the Board Entry Gate, which will be adjusted since we're already inside the board

### 2. Connect InteractiveToolsPanel to Board state (`src/components/calm-magic/tools/InteractiveToolsPanel.tsx`)

- Accept optional board-context props (current season, visited tiles count, shadow position) so the tools can reflect live board state
- Remove or hide the "Ouvrir le Board" CTA when rendered inside the board (add an `insideBoard` prop)
- Connect the Client Needs Assessment results to the board's Window of Tolerance / shadow position data when available

### 3. Simplify the Team Coaching page (`src/pages/RelationalHealing.tsx`)

- Remove the `CalmMagicAssistant` popup component entirely (no more floating window)
- Remove the `isCalmMagicOpen` state and the header button toggling the popup
- Replace the hero CTA with a direct link to `/calm-magic-board` (or the Board Entry Gate modal for mode selection)
- Keep the `CoachingServices` section and footer as-is
- Add a prominent "Launch Calm Magic Board" CTA card in the hero

### 4. Update navigation references

- The "Team Coaching" link in `LandingPage.tsx` nav still points to `/calm-magic-assistant` (no change needed, page still exists)
- Landing page hero CTA for "Relational Intelligence & Team Coaching" still works

## Technical Details

### ViewTab type change in CalmMagicBoard.tsx
```
type ViewTab = 'matrix' | 'window-of-tolerance' | 'topologies' | 'prd-assembly' | 'constellation' | 'expressivity';
```

### InteractiveToolsPanel new props
```typescript
interface InteractiveToolsPanelProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
  insideBoard?: boolean;           // hides the "Ouvrir le Board" CTA
  currentSeason?: string;          // connects to board season
  visitedTilesCount?: number;      // shows board progress
}
```

### Files modified
- `src/pages/CalmMagicBoard.tsx` -- add expressivity tab + render InteractiveToolsPanel
- `src/components/calm-magic/tools/InteractiveToolsPanel.tsx` -- add `insideBoard` prop, hide Board CTA when inside board
- `src/pages/RelationalHealing.tsx` -- remove CalmMagicAssistant popup, replace with Board launch CTA
- `src/components/calm-magic/components/ViewModeNavigation.tsx` (if it exists for the old popup nav) -- may need cleanup

### Files NOT modified
- `CoachingServices.tsx` stays as-is
- `LandingPage.tsx` nav stays as-is (the route still exists)
- The `CalmMagicAssistant` component files remain in the codebase but are no longer imported by RelationalHealing

