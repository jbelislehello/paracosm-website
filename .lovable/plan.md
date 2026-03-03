

# Add GL!TCH — The Imagination of Women Event

## What

Add the new accepted conference workshop to the events array in `src/components/ParacosmEventsSection.tsx`. This is a GL!TCH session at the "Sustainability, Temporalities and Futures" academic conference in Turku, Finland.

## Changes

### File: `src/components/ParacosmEventsSection.tsx`

Add one new event object to the `events` array, positioned chronologically (June 2026 — after the April summit, before the Summer lab):

```ts
{
  name: "GL!TCH — The Imagination of Women",
  description: "A structured creative lab using narrative rupture to reveal suppressed feminine and queer imaginaries. Participants leave with a Glitch Map, a working prototype, and a shared vocabulary for sustaining transformation. Accepted at the Sustainability, Temporalities and Futures conference.",
  date: "June 9-10, 2026",
  location: "Turku, Finland",
  category: "Events",
  color: "from-orange-500 to-amber-500",
  cta: "Learn More",
  link: "https://futuresconference2026.com/"
}
```

Category is **Events** (orange badge) since this is a public conference presentation rather than a private retreat or organizational engagement.

No other files need changes.

