

# Add 50 Resources to Drift, Distributed by Release Date (2014-2026)

## Overview
Add 50 podcasts, articles, talks, and papers to the Drift monthly discovery data, distributed across months based on each item's original release/publication date. This requires creating new monthly entries for years 2014-2021 (currently the data starts at 2022) and adding podcasts/articles to existing 2022-2026 entries.

## Confirmed Feb 2026 Books
Verified on the live page -- all 8 Love-axis books (HOLO 1, HOLO 2, Non-Linear Leadership, Issue 01, Magazine Digi, Guide Montreal, Originals, The Order of Time) render correctly on the February 2026 monthly discovery page.

---

## Axis Assignment (Calm Magic Library Mapping)

| Content Group | Axis | Category |
|---|---|---|
| Complexity, creative math, emergence (1-12) | **open** | Human Dynamics and System Thinking |
| Product roadmapping, discovery, operating models (13-28) | **calm** | Workflows |
| AI governance, auditability, risk, compliance (29-40) | **open** | Connected Life |
| Neurodivergence, cognitive accessibility (41-46) | **love** | Embodied Cognition |
| Memory, embodiment, somatics, tantra (47-50) | **love** | Embodied Cognition |

---

## Distribution by Release Date

### New monthly entries to create (2014-2021)

These years currently don't exist in the data. Each new month entry will have a theme, an empty `books` array, and the relevant podcasts/articles.

**2015** -- 1 item
- Month 10: Karim Nader, "Reconsolidation and the Dynamic Nature of Memory" (paper, ~2015) -- article, axis: love

**2016** -- 1 item
- Month 9: Tricia Wang TED Talk, "The human insights missing from big data" (Sept 2016) -- podcast/talk, axis: open

**2019** -- 2 items
- Month 4: Sean Carroll/Strogatz, "Synchronization, Networks, and the Emergence of Complex Behavior" (Apr 2019) -- podcast, axis: open
- Month 6: Melissa Perri, "Product Thinking for Product Management" (show hub, June 2019) -- podcast, axis: calm

**2020** -- 1 item
- Month 11: Sean Carroll/Lisa Feldman Barrett, "Emotions, Actions, and the Brain" (Nov 2020) -- podcast, axis: open

**2021** -- 3 items
- Month 1: Peter Senge, "Compassionate Systems / Leading Complexity" (Jan 2021) -- podcast, axis: open
- Month 1: Peter Senge, "Can you navigate the uncertainty of change?" -- podcast, axis: open  
- Month 1: Peter Senge/Gary Hamel, "Leading System Change" -- podcast, axis: open

Also placing the "timeless" Donella Meadows items here:
- Month 6: Donella Meadows, "Leverage Points" (article, originally 1999 but evergreen) -- article, axis: open
- Month 6: Donella Meadows, "Molly's Interview with Dana" -- podcast, axis: open

### Existing entries to augment (2022-2026)

**2022**
- Month 6 (June): Shreyas Doshi -- Lenny's Podcast (pre-mortems, strategy) -- podcast, axis: calm
- Month 6: Quanta Magazine Emergence hub -- article, axis: open
- Month 6: Santa Fe Institute podcasts hub -- podcast, axis: open

**2023**
- Month 4 (April): NIST AI RMF -- Elham Tabassi/Wiley Rein -- podcast, axis: open
- Month 4: NIST AI RMF -- Reva Schwartz -- podcast, axis: open
- Month 4: Monitaur/Patrick Hall on NIST AI RMF -- podcast, axis: open
- Month 4: CR-MAP deep dive NIST AI RMF -- podcast, axis: open
- Month 6: Teresa Torres -- Lenny's Newsletter episode -- podcast, axis: calm
- Month 6: Teresa Torres -- "Getting into the Habit of Continuous Discovery" -- podcast, axis: calm
- Month 9: Teresa Torres -- Non-Nonsense Agile -- podcast, axis: calm
- Month 9: Teresa Torres -- All Things Product -- podcast, axis: calm
- Month 9: Shreyas Doshi -- The Knowledge Project -- podcast, axis: calm
- Month 9: SVPG -- Product Leadership Archetypes -- article, axis: calm
- Month 12: ICAEW -- "AI in audit: good, bad, ugly" -- podcast, axis: open
- Month 12: Europeana AI Fund -- Algorithm Audit -- podcast, axis: open

**2024**
- Month 2: Marty Cagan -- "Moving to the Product Operating Model" -- podcast, axis: calm
- Month 3: Marty Cagan -- One Knight in Product (Transformed) -- podcast, axis: calm
- Month 3: Marty Cagan -- Spotify episode (Transformed) -- podcast, axis: calm
- Month 4: Peter Levine -- "From Trauma to Awakening and Flow" -- podcast, axis: love
- Month 5: Christopher Wallis -- "Exploring Nondual Shaiva Tantra" -- podcast, axis: love
- Month 5: Deb Dana -- Rhythm of Regulation (hub) -- podcast, axis: love
- Month 6: Melissa Perri/John Cutler -- "Freeing Teams from Operational Overload" -- podcast, axis: calm
- Month 6: Melissa Perri -- "Why Context Switching Slows You Down" -- podcast, axis: calm
- Month 7: John Cutler -- "Product Management with John Cutler" -- podcast, axis: calm
- Month 7: John Cutler -- "Identifying Patterns in Product" -- podcast, axis: calm
- Month 7: John Cutler -- The Product Experience (interview) -- podcast, axis: calm
- Month 8: Stephanie Walter -- NNg UX Podcast, Accessibility and Neurodiversity -- podcast, axis: love
- Month 8: Stephanie Walter -- Neurodiversity and UX resources (article hub) -- article, axis: love
- Month 9: Carleton Accessibility Institute -- "A Neurodivergent Lens" (PDF) -- article, axis: love
- Month 9: Craig Abbott -- digital accessibility leadership -- podcast, axis: love
- Month 10: AccessiBrand -- neurodiversity and accessibility -- podcast, axis: love
- Month 10: Interview: netz-barrierefrei -- podcast, axis: love
- Month 11: Heidrick -- Miriam Vogel (EqualAI) "Building trust in AI" -- podcast, axis: open
- Month 11: AI governance standards ISO 42001 + NIST -- article, axis: open
- Month 12: EU AI Act Explained (Spotify hub) -- podcast, axis: open
- Month 12: Tricia Wang -- Rosenfeld Review on AI and research -- podcast, axis: open
- Month 12: Tech Seeking Human -- Tricia Wang "AI and Big Data isn't the answer" -- podcast, axis: open

**2025**
- Month 1: Simon Wardley -- "Maps, AI, and the Future of Reasoning" -- podcast, axis: open
- Month 1: Strategy Hero -- "The Power of Wardley Mapping" -- podcast, axis: open
- Month 1: Wardley Mapping Interviews playlist -- podcast, axis: open

---

## Technical Details

### File modified
**`src/data/driftMonthlyDiscoveries.ts`**

### Changes
1. Create ~8 new `DriftMonthEntry` objects for years 2015-2021, inserted before the existing 2022 entries
2. Add `podcasts` and `articles` arrays to ~15 existing monthly entries (2022-2025)
3. Each podcast entry follows the `DriftPodcast` interface: `{ title, host, description, category, axis, url, platform }`
4. Each article entry follows the `DriftArticle` interface: `{ title, author, description, category, axis, url, source }`
5. New months will need theme names assigned

### No other file changes needed
The DriftMonthlyDiscovery page and DriftLibrary already support rendering podcasts and articles arrays when present.

