

# Expand Drift Archive to 2023 + Multi-Content Support

## Overview

Extend the Drift monthly discoveries back to January 2023, add the 10 new books you provided, and prepare the data model for songs, podcasts, and articles alongside books and videos.

## 1. Expand the Data Model

Add new content types to `src/data/driftMonthlyDiscoveries.ts`:

```text
DriftMonthEntry
  +-- books: DriftBook[]
  +-- videos?: DriftVideo[]
  +-- songs?: DriftSong[]        (NEW)
  +-- podcasts?: DriftPodcast[]  (NEW)
  +-- articles?: DriftArticle[]  (NEW)
```

Each new type will have relevant fields (title, author/artist, description, category, axis, and a URL). This makes it easy to add content later without restructuring.

## 2. Distribute the 10 Books Provided

You gave 10 books. With 2 per month, that covers 5 months. I'll distribute them across Jan-May 2023:

| Month | Book 1 | Book 2 |
|---|---|---|
| Jan 2023 | Dynamic Light and Shade (Burne Hogarth) | Management (Robbins et al.) |
| Feb 2023 | Exploring Storyboarding (Tumminello) | Le Pendule de Foucault (Eco) |
| Mar 2023 | The Innovator's Toolkit (Silverstein et al.) | Design Thinking for Strategic Innovation (Mootee) |
| Apr 2023 | Designing for Interaction (Saffer) | Journal Sparks (Neuburger) |
| May 2023 | Mapping Experiences (Kalbach) | Unstuck (Yamashita & Spataro) |

Months June 2023 through December 2024 (19 months) will be created as empty entries with placeholder structure, ready for you to fill in as "more books are coming."

## 3. Category/Axis Assignments

Each book will be mapped to a Calm Magic axis and discovery category based on its topic:

- **Dynamic Light and Shade** -- Tangible Play / LOVE (craft, hands-on rendering)
- **Management** -- Human Dynamics and System Thinking / OPEN
- **Exploring Storyboarding** -- Telling Stories / OPEN
- **Le Pendule de Foucault** -- Narratives / MAGIC
- **The Innovator's Toolkit** -- Workflows / CALM
- **Design Thinking for Strategic Innovation** -- Workflows / CALM
- **Designing for Interaction** -- Connected Life / OPEN
- **Journal Sparks** -- Playgrounds / CALM
- **Mapping Experiences** -- Inquiry and Practices / CALM
- **Unstuck** -- Embodied Cognition / LOVE

## 4. Update the Monthly Discovery Page

In `src/pages/DriftMonthlyDiscovery.tsx`, add rendering sections for each new content type (songs, podcasts, articles) similar to the existing Videos section -- each with its own icon, card style, and external link.

## 5. Update the Landing Page Grid

In `src/pages/DriftLanding.tsx`, the archive grid already dynamically lists all entries. Months without books will show as available but empty. Optionally, we can show icons for which content types are available in each month card (book, video, headphones, music, article icons).

## Files to Modify

- **`src/data/driftMonthlyDiscoveries.ts`** -- Add new interfaces, add 24 months of entries (Jan 2023 - Dec 2024), distribute the 10 books
- **`src/pages/DriftMonthlyDiscovery.tsx`** -- Add rendering for songs, podcasts, articles sections
- **`src/pages/DriftLanding.tsx`** -- Update month card to show content type indicators

## Note on Empty Months

Months without any content (Jun 2023 - Dec 2024) will have empty arrays. They will appear in the archive grid so you can fill them in over time. If you prefer to hide empty months, I can add that logic instead.

