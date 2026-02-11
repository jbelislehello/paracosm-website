

# Reorganize Events Section by GL!TCH Publication Categories

## What's Changing

The events section will be reorganized to align with the five content categories from the Gl!tch Medium publication (medium.com/futurographer), and the "AI Symposium - Brome Misisquoi" event will be updated with its proper title and dates.

## The 5 Categories (from the publication)

1. **Connected Life** -- Connected technology
2. **Telling Stories** -- Storytelling
3. **Worldbuilders** -- Worldbuilding
4. **Learning Enterprises** -- Enterprise architecture
5. **Post-Broadcast** -- Narratives

## Updated Event Details

The "AI Symposium - Brome Misisquoi" becomes:
- **Title**: "AI & Municipalites" (GL!TCH Summit)
- **Date**: April 22-23, 2026
- **Location**: Cantons-de-l'Est, QC

## Event-to-Category Mapping

| Event | Category |
|-------|----------|
| GL!TCH Session: Maitriser X Detourner | **Connected Life** -- AI-augmented transformation at E-AI conference |
| AI & Municipalites (GL!TCH Summit) | **Learning Enterprises** -- AI governance for municipal leaders |
| Transformation Design Lab | **Worldbuilders** -- Diegetic prototyping and vision-to-implementation |
| GL!TCH - Relational Intelligence Summit | **Telling Stories** -- Coaching through narrative and relational practices |

## Technical Changes

### 1. Update `src/components/ParacosmEventsSection.tsx`
- Add a `category` field to each event object (e.g., "Connected Life", "Learning Enterprises")
- Update the "AI Symposium" event with new title "AI & Municipalites", date "April 22-23, 2026", and location "Cantons-de-l'Est, QC"
- Display category labels as colored badges/tags on each event card
- Add category filter tabs at the top so visitors can browse by category
- Include a subtle link to the Gl!tch Medium publication for each category

### 2. Update `index.html` structured data
- Update the "AI Symposium" Event schema with:
  - New name: "AI & Municipalites"
  - New startDate: "2026-04-22"
  - New endDate: "2026-04-23"
  - Updated location: Cantons-de-l'Est, QC

### 3. Visual Design
- Each category gets a distinct color and icon:
  - **Connected Life**: Cyan/teal with a wifi/network icon
  - **Telling Stories**: Pink/rose with a book/pen icon
  - **Worldbuilders**: Purple with a globe/compass icon
  - **Learning Enterprises**: Blue with a building/briefcase icon
  - **Post-Broadcast**: Orange/amber with a radio/broadcast icon
- Category tags appear as small pill badges above each event title
- Optional: horizontal scrollable category filter bar at the top of the section

