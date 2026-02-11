

# Update Event Categories to Match Paracosm Ontology

## What's Changing

The events section currently uses the old Medium/Gl!tch publication categories (Connected Life, Telling Stories, Worldbuilders, Learning Enterprises, Post-Broadcast). These need to be updated to match the Paracosm ontological structure established earlier: **Relational Intelligence, Learning Organizations, Retreats, Events**.

Specifically, the user wants:
- "GL!TCH Session: Maitriser X Detourner" moved from "Connected Life" to **Learning Organizations**
- "AI & Municipalites -- GL!TCH Summit" is already effectively "Learning Organizations" (was "Learning Enterprises") -- just rename the category

## Changes to `src/components/ParacosmEventsSection.tsx`

### 1. Replace category list

Old categories: Connected Life, Telling Stories, Worldbuilders, Learning Enterprises, Post-Broadcast

New categories matching Paracosm structure:
- **Relational Intelligence** (replaces Telling Stories)
- **Learning Organizations** (replaces Learning Enterprises + Connected Life)
- **Retreats** (replaces Worldbuilders)
- **Events** (general / replaces Post-Broadcast)

### 2. Update event category assignments

| Event | Old Category | New Category |
|-------|-------------|--------------|
| GL!TCH Session: Maitriser X Detourner | Connected Life | Learning Organizations |
| AI & Municipalites -- GL!TCH Summit | Learning Enterprises | Learning Organizations |
| Transformation Design Lab | Worldbuilders | Retreats |
| GL!TCH - Relational Intelligence Summit | Telling Stories | Relational Intelligence |

### 3. Update category colors and icons to match

Keep similar gradient styling but align icons with new category meanings (e.g., Building for Learning Organizations, Users for Relational Intelligence, Globe for Retreats, Calendar for Events).

### Files modified
- `src/components/ParacosmEventsSection.tsx` only

