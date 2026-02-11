

# Update Drift Discovery Categories

## Overview

Replace the current 5 discovery categories (Narrative, Workflow, Inquiry & Practices, Playgrounds, Human Dynamics & System Thinking) with the full list of 15 categories provided by the user.

## New Categories

The `dashboardSections` array in `src/pages/DriftLanding.tsx` will be expanded from 5 to 15 categories. Since the current code maps each category to one of the 5 energetic axes (LOVE, MAGIC, CALM, OPEN, FREE), I'll distribute the 15 categories across these axes in groups of 3:

| Axis (Color) | Categories |
|---|---|
| **LOVE** (red) | Tangible Play, Embodied Cognition, Wearables |
| **MAGIC** (purple) | Sensory Rooms, 21c Parenting, Narratives |
| **CALM** (cyan) | Workflows, Inquiry and Practices, Playgrounds |
| **OPEN** (green) | Human Dynamics & System Thinking, Connected Life, Telling Stories (Narratives) |
| **FREE** (amber) | WorldBuilders, Post-Broadcast, Connected Life |

Note: "Connected Life" appears twice in the user's list -- both will be kept as provided.

## Technical Changes

**File:** `src/pages/DriftLanding.tsx`

- Replace the 5-item `dashboardSections` array (lines 28-32) with a 15-item array
- Each entry keeps the same structure: `{ axis, type, description }`
- The grid layout (`grid-cols-1 lg:grid-cols-2`) will be updated to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to better accommodate 15 cards
- Each category gets a brief description consistent with the existing style

### Files modified
- `src/pages/DriftLanding.tsx` only

