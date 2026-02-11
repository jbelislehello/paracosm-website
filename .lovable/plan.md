

# Add Video Content to Drift Monthly Discovery Pages

## Overview

Add 17 video talks/interviews (all featuring Jonathan Belisle) to the existing monthly discovery pages, distributed across the 14 months (Jan 2025 -- Feb 2026). Each video gets categorized into a Drift discovery category and rendered as an embedded YouTube card alongside the existing book cards.

## Video Inventory and Categorization

| # | Video Title | Year | Category (Axis) | Month |
|---|------------|------|-----------------|-------|
| 1 | Jonathan Belisle (LienMultimedia, early career) | 2009 | Telling Stories (OPEN) | Jan 2025 |
| 2 | FNC09 -- Psychogeography and augmented reality in cities | 2009 | Tangible Play (LOVE) | Feb 2025 |
| 3 | Environnements programmables et desirables (Mandalab) | 2011 | Sensory Rooms (MAGIC) | Mar 2025 |
| 4 | Conference Infopresse Ottawa | 2012 | Telling Stories (OPEN) | Apr 2025 |
| 5 | Jonathan Belisle at CreativeMornings Montreal | 2014 | WorldBuilders (FREE) | May 2025 |
| 6 | Les nouveaux horizons du Transmedia | 2014 | Post-Broadcast (FREE) | Jun 2025 |
| 7 | Wuxia le renard -- Interactive reading school experience | 2014 | Playgrounds (CALM) | Jul 2025 |
| 8 | TEDxMontreal -- Technology in children's education | 2015 | 21c Parenting (MAGIC) | Aug 2025 |
| 9 | IoT Theatre interview (eCOM MTL) | 2016 | Connected Life (OPEN) | Sep 2025 |
| 10 | La Machine a bienveillance (TV5MONDE) | 2018 | WorldBuilders (FREE) | Oct 2025 |
| 11 | Le futur de l'edition numerique jeunesse | 2019 | Post-Broadcast (FREE) | Nov 2025 |
| 12 | Convivialite numerique et futur de la lecture (TOPO) | 2021 | Narratives (MAGIC) | Dec 2025 |
| 13 | Stories of a Near Future -- AI and arts (E-AI) | 2021 | Post-Broadcast (FREE) | Dec 2025 |
| 14 | DesignOPS podcast (Sprinkler) | 2023 | Workflows (CALM) | Jan 2026 |
| 15 | Trouver ton essence pour reussir ta carriere creative | 2024 | Inquiry and Practices (CALM) | Jan 2026 |
| 16 | Du burnout a la renaissance -- Redesign ta carriere | 2024 | Embodied Cognition (LOVE) | Feb 2026 |
| 17 | De "clown" a polymathe -- raconter le monde | 2026 | Human Dynamics and System Thinking (OPEN) | Feb 2026 |

## Implementation

### 1. Update data model in `src/data/driftMonthlyDiscoveries.ts`

- Add a new `DriftVideo` interface with fields: `title`, `speaker`, `description`, `category`, `axis`, `youtubeId`, `thumbnailUrl`, `duration`, `platform` (e.g., "CreativeMornings", "TEDx", etc.)
- Add an optional `videos` array to the `DriftMonthEntry` interface
- Add video data to each of the 14 month entries (1--2 videos per month)
- YouTube thumbnails will use `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`

### 2. Update page component in `src/pages/DriftMonthlyDiscovery.tsx`

- Import the `Play` icon from lucide-react
- After the books section, add a videos section rendering each video as a card with:
  - A clickable YouTube thumbnail image (links to YouTube in new tab)
  - A play button overlay on the thumbnail
  - Title, speaker/platform, description
  - Category and axis badges (same color scheme as books)
  - Duration badge
- Use the same card styling as books for visual consistency

### 3. Files modified

| File | Change |
|------|--------|
| `src/data/driftMonthlyDiscoveries.ts` | Add `DriftVideo` type, add `videos` to `DriftMonthEntry`, populate all 17 videos |
| `src/pages/DriftMonthlyDiscovery.tsx` | Render video cards with thumbnails below books |

