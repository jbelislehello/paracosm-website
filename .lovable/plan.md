

# Remove "Paracosm" Title Text from Logo

## What Changes

Remove the "Paracosm" text label that was just added next to the logo image across all pages. The logo will return to showing only the rainbow arc image on its black rounded background tile, without any accompanying text.

## Files to Update (4 files)

### 1. `src/pages/LandingPage.tsx` (line 58)
Remove the `<span>` with "Paracosm" text

### 2. `src/pages/AboutUs.tsx` (line 96)
Remove the `<span>` with "Paracosm" text

### 3. `src/pages/CaseStudies.tsx` (line 27)
Remove the `<span>` with "Paracosm" text

### 4. `src/components/ParacosmUniverseSection.tsx` (line 166)
Remove the `<span>` with "Paracosm" text

Each instance removes this line:
```jsx
<span className="font-bold text-slate-900 dark:text-white text-sm">Paracosm</span>
```

No other changes needed -- the logo image and its black rounded tile styling remain untouched.

