

# Add 70 Resources to Drift + Axis Filters on Search

## Overview
Add approximately 70 new resources (videos, podcasts, articles) across the Drift timeline, distributed by content release date. Also add **axis-based filter buttons** (Love, Magic, Calm, Open, Free) to the Monthly Review search section on the Drift landing page, complementing the existing resource-type filters.

---

## Part 1: Axis Filters on Drift Landing Page

**File: `src/pages/DriftLanding.tsx`**

Add a second row of filter buttons below the existing type filters (Books, Podcasts, etc.) for the 5 Calm Magic axes: Love, Magic, Calm, Open, Free. Each button uses the axis color. When active, only months containing content on the selected axis/axes are shown. Combines with existing type + text filters.

- New state: `axisFilters` (`Set<DriftAxis>`)
- Filter logic: if axis filters active, only show months where at least one resource matches a selected axis
- Buttons styled as colored pills using each axis's color from `axisColors`

---

## Part 2: Resource Distribution

**File: `src/data/driftMonthlyDiscoveries.ts`**

After deduplication between the two lists (many items appear in both), approximately 70 unique resources will be added. Content types:
- YouTube videos (with extractable `youtubeId`) go into the `videos` array
- Podcasts/audio interviews go into the `podcasts` array
- Articles, archives, PDFs, resource hubs go into the `articles` array
- Playlists (no single youtubeId) go into `articles` as reference links

### Axis Mapping

| Thinker/Creator | Axis | Category |
|---|---|---|
| Carl Jung | **magic** | Inquiry and Practices |
| Jean Piaget | **magic** | 21c Parenting |
| Mircea Eliade | **magic** | Inquiry and Practices |
| Henri Bergson | **magic** | Narratives |
| Moshe Feldenkrais | **love** | Embodied Cognition |
| Steve Paxton | **love** | Tangible Play |
| Anna Halprin | **love** | Embodied Cognition |
| Richard Shusterman | **love** | Embodied Cognition |
| Robert Sapolsky | **love** | Embodied Cognition |
| Nam June Paik | **free** | Post-Broadcast |
| Rirkrit Tiravanija | **love** | Tangible Play |
| Nicolas Bourriaud | **free** | Post-Broadcast |
| Rick Rubin | **calm** | Inquiry and Practices |
| Christopher Nolan | **magic** | Narratives |
| J.J. Abrams | **magic** | Narratives |
| Eric Berlow | **open** | Human Dynamics and System Thinking |
| Tom Wujec | **calm** | Workflows |
| Andrew Stanton | **magic** | Telling Stories |
| Chris Anderson | **open** | Telling Stories |
| Susan Cain | **love** | Embodied Cognition |
| Ken Robinson | **calm** | Playgrounds |
| Bud Caddell | **calm** | Workflows |
| Robert Sapolsky (Stanford lectures) | **open** | Human Dynamics and System Thinking |

### Month-by-Month Distribution

**New entries to create:**

| Year | Month | Theme | Content |
|---|---|---|---|
| 2014 | 1 | Foundations | Ken Robinson TED (2006, foundational); J.J. Abrams Mystery Box TED (2007); archive.org Bergson audiobook |
| 2014 | 6 | Archetypes | Jung Face to Face BBC (1959 archival); Jung playlist; Piaget interviews (1974 archival); Piaget playlist |
| 2014 | 12 | Sacred Time | Eliade interviews (archival); Eliade playlist; "How to Make Time Sacred"; Feldenkrais archive + playlist |

**Augmenting existing entries:**

| Year/Month | Content Added |
|---|---|
| 2015/10 | Bergson Aeon video essay (article) |
| 2016/9 | Bergson Hermitix podcast |
| 2019/4 | Eric Berlow TED "Simplifying complexity" (video) |
| 2020/11 | Steve Paxton Q&A Contact Quarterly 2020 (article) |
| 2021/1 | Sapolsky Stanford Human Behavioral Biology lecture (video); Sapolsky stress playlist (article) |
| 2021/6 | Sapolsky "Psychology of Stress" (video) |
| 2022/2 | Eliade "How to Make Time Sacred" -- already related to Eliade book in Feb 2022 (video) |
| 2022/6 | Tom Wujec TED talks (article); Chris Anderson TED talk (video) |
| 2022/8 | Susan Cain TED-Ed "Power of Introverts" (video) |
| 2023/1 | Rick Rubin -- Tim Ferriss transcript (article); Tim Ferriss episode (podcast); On Being (podcast) |
| 2023/6 | Bud Caddell TEDx (article); TED playlist "How to make a great presentation" (article) |
| 2023/9 | Andrew Stanton TED "Clues to a great story" (video) |
| 2023/11 | Nolan x Cameron "Time Travel" conversation (video) |
| 2024/4 | Steve Paxton -- Talking Dance (video); Paxton + Forti conversation (video) |
| 2024/5 | Anna Halprin "Power of Ritual" (podcast); Halprin New Thinking Allowed (article) |
| 2024/6 | Shusterman interview (video); Shusterman video hub (article); Shusterman playlist (article) |
| 2024/7 | Jung Psyche.co video essay (article); Jung OpenCulture article (article); Jung Face to Face alt upload (video) |
| 2024/8 | Nam June Paik -- Smithsonian interview (article); Symposium (video); Biennale PDF (article) |
| 2024/10 | Rirkrit Tiravanija Bloomberg Brilliant Ideas (video); Tiravanija PHI (video) |
| 2024/11 | Nolan TENET interview (video); Nolan Oppenheimer Bulletin (article) |
| 2024/12 | Rick Rubin Tetragrammaton hub (podcast) |
| 2025/1 | Bourriaud Altermodern (video) |
| 2025/3 | Danspace Project Steve Paxton 2025 (article) |
| 2025/7 | Bourriaud interview Doors Agency 2025 (article) |

### YouTube IDs to Extract

For items going into the `videos` array, youtubeIds extracted from URLs:
- Jung Face to Face: `oBYEFX2dqpM` (and alt: `cjxC-Ab84hQ`)
- Piaget Rencontre: `HqWiTk4Rjok`
- Piaget Interview: `Nj-1h2Qk2fE`
- Piaget on Piaget: `I1JWr4G8YLM`
- Eliade vol 3: `fZ7yLe2axjg`
- Eliade 1960: `k8AyjjhSVQc`
- Eliade 1987: `S6W9se3oKJ0`
- Eliade Sacred: `oHxJMHbZo7A`
- Bergson Hermitix: `dqnqOIREiic`
- Paxton Talking Dance: `_82Od5NM4LI`
- Paxton + Forti: `12j9JxDGlE4`
- Shusterman: `LXBf2l_tUVI`
- Sapolsky Stress: `bEcdGK4DQSg`
- Sapolsky lecture 1: `NNnIGh9g6fA`
- Paik Symposium: `O1LkIE0uJSw`
- Tiravanija Bloomberg: `ptbhV4HgMr0`
- Tiravanija PHI: `OQGeyuuA4IA`
- Bourriaud Altermodern: `bqHMILrKpDY`
- Nolan x Cameron: `hGrqHOp2RW8`
- Nolan TENET: `_Woppb0k_2M`
- Stanton TED: extracted from TED embed
- Anderson TED: extracted from TED embed

---

## Files Changed
- **`src/data/driftMonthlyDiscoveries.ts`** -- 3 new month entries (2014) + augment ~20 existing months with videos, podcasts, articles
- **`src/pages/DriftLanding.tsx`** -- Add axis filter row (Love/Magic/Calm/Open/Free) + update filter logic

## No other files need changes
The DriftLibrary and monthly discovery pages already render all content types dynamically.

