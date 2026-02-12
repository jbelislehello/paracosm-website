

# Add Tool Showcase to Drift Section

## Overview

Add a new "Tool Showcase" section to the Drift landing page that displays tools from the Partner Tools data plus the 9 new tools you requested. Each tool card shows: name, starting price, function (description), Calm Magic category (axis), and month of discovery.

## New Data File: `src/data/driftTools.ts`

Create a new data file with a `DriftTool` interface and array containing:

**Fields per tool:**
- `name` -- tool name
- `description` -- what it does (function)
- `startingPrice` -- e.g. "Free", "$10/mo", "Custom"
- `axis` -- Calm Magic category (love, magic, calm, open, free)
- `year` and `month` -- when discovered
- `url` -- link to the tool

**Tools to include (from Partner Tools):**
1. Tonalli -- voice, love
2. Muse -- voice, love
3. Hume AI -- voice, love
4. Sesame -- voice, love
5. ElevenLabs -- voice, love
6. Lovable -- mcp, calm
7. GumLoop -- mcp, calm
8. Base44 -- mcp, calm
9. n8n -- mcp, open
10. GPT Trainer -- ai, magic
11. OpenAI APIs -- ai, magic
12. LangChain -- ai, open
13. Supabase -- database, open
14. SharePoint -- collaboration, open
15. Teams -- collaboration, open

**New tools to add:**
16. Read.ai -- meeting intelligence, calm
17. CmapTools -- concept mapping, magic
18. Axure -- prototyping, free
19. Adobe Firefly -- generative AI for images, love
20. ActiveInbox -- email workflow, calm
21. NotebookLM -- AI research notebook, magic
22. Antigravity -- creative tool, free
23. Wolfram Alpha -- computational knowledge, open
24. ClickUp -- project management, calm

Each tool will be assigned a reasonable month/year and a starting price based on public pricing.

## New Component: `src/components/DriftToolShowcase.tsx`

A filterable card grid section with:
- Section header: "Tool Showcase"
- Filter chips by Calm Magic axis (Love, Magic, Calm, Open, Free, All)
- Cards showing: tool name, starting price badge, description, axis color dot + label, month/year discovered
- Link to tool URL
- Consistent styling with existing Drift cards (border-2, hover:shadow-lg)

## Modified File: `src/pages/DriftLanding.tsx`

- Import and insert `DriftToolShowcase` between the "Discovery Categories" section and the "Monthly Review" section
- Single import line + single component placement

## Technical Details

- The `DriftTool` interface is separate from `PartnerTool` to keep concerns clean (Drift has axis/month/price; Partner Tools has category)
- Axis mapping from partner tool categories: voice->love, mcp->calm, ai->magic, database->open, collaboration->open
- Filter state managed with `useState` inside the component
- Reuses existing `Card`, `Badge`, `Button` components and `axisColors`/`axisLabels` from driftMonthlyDiscoveries

