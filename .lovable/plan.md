

# Move Tools into Monthly Discovery Pages by Calm Magic Category

## Overview

Remove the standalone Tool Showcase section from the Drift landing page. Instead, each tool appears on the monthly discovery page corresponding to its discovery month/year, grouped under its Calm Magic axis alongside books, videos, songs, etc.

## Changes

### 1. Add `tools` field to `DriftMonthEntry` (in `src/data/driftMonthlyDiscoveries.ts`)

- Import `DriftTool` from `driftTools.ts`
- Add optional `tools?: DriftTool[]` to the `DriftMonthEntry` interface
- Create a helper that auto-populates tools into each month entry based on the `month`/`year` fields in `driftTools.ts` (no need to manually duplicate data)

### 2. Update `DriftMonthlyDiscovery.tsx` -- render tools per month

- Import `driftTools` and filter by current month/year
- Group the filtered tools by axis (love, magic, calm, open, free)
- Add a new "Tools" section (with a Wrench icon) after the existing resource sections (Books, Videos, Songs, Podcasts, Articles, Artefacts)
- Each axis group gets a colored header, and tools render as compact cards showing: name, price badge, description, and external link
- If no tools exist for a given month, the section is hidden

### 3. Update `DriftLanding.tsx` -- remove Tool Showcase

- Remove the `DriftToolShowcase` import and `<DriftToolShowcase />` component from the page
- The Monthly Review grid cards will now also show a Wrench icon when a month has tools (like it already does for Books, Videos, etc.)

### 4. Keep `DriftToolShowcase.tsx` and `driftTools.ts` as-is (data file stays, component can be deleted or kept)

- `src/data/driftTools.ts` stays -- it's the source of truth for tool data
- `src/components/DriftToolShowcase.tsx` can be deleted since it's no longer used

## Technical Details

### Tool grouping in monthly view

```text
Tools (section header with Wrench icon)
  |
  +-- LOVE
  |     +-- Tonalli card
  |     +-- Adobe Firefly card
  |
  +-- CALM
  |     +-- Read.ai card
  |     +-- ClickUp card
  |
  +-- MAGIC
        +-- NotebookLM card
```

Each tool card shows:
- Name (bold, linked to URL)
- Starting price (Badge)
- Description (muted text)
- Axis color dot + label

### Monthly Review grid update

Add a `Wrench` icon next to existing resource type icons (BookOpen, Play, Music, etc.) when a month has tools. This uses the same pattern already in place -- filter `driftTools` by month/year and check length > 0.

### Files modified
- `src/pages/DriftLanding.tsx` -- remove DriftToolShowcase, add tool icon to month cards
- `src/pages/DriftMonthlyDiscovery.tsx` -- add Tools section grouped by axis
- `src/data/driftTools.ts` -- no changes (keep as data source)
- `src/components/DriftToolShowcase.tsx` -- delete (no longer needed)

