

# Add Case Studies Link to HA Labs "Client Projects" Section

## Change

In `src/components/ParacosmUniverseSection.tsx`, the "Client Projects" branch under HA Labs currently has an empty `items` array (line 42). Add a link to the Case Studies page.

## Technical Details

**File:** `src/components/ParacosmUniverseSection.tsx` (line 40-42)

Change:
```tsx
{
  title: "Client Projects",
  icon: Code,
  items: [],
},
```

To:
```tsx
{
  title: "Client Projects",
  icon: Code,
  items: [
    { label: "Case Studies", to: "/case-studies" },
  ],
},
```

This follows the existing pattern used by other linked items (e.g., `{ label: "Tonalli (Voice & Spatial Computer)", to: "/tonalli" }`), so it will automatically render as a clickable link styled in indigo.

### Files modified
- `src/components/ParacosmUniverseSection.tsx` only
