

# Add Paracosm Retreat to Events Section

## What's Missing
The "Upcoming Learning Events" section on the homepage does not include the Paracosm Retreat. It only shows 4 events (GL!TCH Session, AI & Municipalites, Transformation Design Lab, and the Relational Intelligence Summit). The retreat is linked from the Footer, Ecosystem section, and Tarot page -- but not here, where users naturally look.

## What We'll Do

Add the retreat as a new event card in the Events section so it appears under both "All" and "Retreats" filters:

- **Name**: Paracosm Retreat -- Relational Intelligence
- **Date**: August 25-27, 2026
- **Location**: Botanico House, Azores Island
- **CTA**: "Request Invitation"
- **Links to**: `/paracosm-retreat` (the existing landing page)

We'll also make the button navigate within the app (instead of opening a new browser tab) since it's an internal page.

## Technical Details

**File: `src/components/ParacosmEventsSection.tsx`**

1. Add a new entry to the `events` array with `category: "Retreats"` and `link: "/paracosm-retreat"`
2. Import `Link` from `react-router-dom`
3. Update the CTA button rendering: if the link starts with `/`, wrap it in a React Router `Link`; otherwise keep the existing `<a>` tag for external URLs

| File | Change |
|------|--------|
| `src/components/ParacosmEventsSection.tsx` | Add retreat event + internal link handling |

