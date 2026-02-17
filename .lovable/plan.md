

# Add Paracosm Retreat to Events Section

## Problem
The retreat is currently only linked from the Footer, Ecosystem section, and Tarot page -- but **not** from the "Upcoming Learning Events" section on the homepage, which is where users naturally look for upcoming events.

## Fix

**File: `src/components/ParacosmEventsSection.tsx`**

1. Add a new event card to the `events` array:
   - **Name**: "Paracosm Retreat -- Relational Intelligence"
   - **Date**: August 25-27, 2026
   - **Location**: Botanico House, Azores Island
   - **Category**: Retreats
   - **CTA**: "Request Invitation"
   - **Link**: `/paracosm-retreat` (internal route)

2. Update the CTA button rendering logic to use React Router's `Link` component for internal paths (starting with `/`) instead of an `<a>` tag, so clicking navigates within the app rather than opening a new tab.

## Result
The retreat will appear in the Events section under both "All" and "Retreats" filters, making it immediately discoverable alongside other events.

## Files Changed
| File | Action |
|------|--------|
| `src/components/ParacosmEventsSection.tsx` | Add retreat event + internal link handling |

