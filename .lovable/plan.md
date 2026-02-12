

# Update Logo Display: Black Rounded Tile + "Paracosm" Text

## What Changes

Replace the current logo-only display with a logo + text lockup across all pages. Every instance of the Paracosm logo in the navigation headers will show the rainbow arc logo on a black rounded background with "Paracosm" written to its right.

## Current State

The logo currently appears as:
```text
[logo image on black rounded bg]
```
No text beside it.

## Target State

```text
[logo image on black rounded bg]  Paracosm
```

## Files to Update (4 files, ~6 instances)

### 1. `src/pages/LandingPage.tsx` (line 57)
- Change the logo `<div>` from just the image to include "Paracosm" text to the right
- Text in a clean, bold font style

### 2. `src/pages/AboutUs.tsx` (line 95)
- Same update in the navigation header

### 3. `src/pages/CaseStudies.tsx` (line 26)
- Same update in the navigation header

### 4. `src/components/ParacosmUniverseSection.tsx` (line 165)
- Same update for the logo instance in the universe section card

## Implementation Detail

Each logo instance will change from:
```jsx
<img src={logoParacosm} alt="Paracosm" className="bg-black rounded-lg p-1 w-8 h-8 object-contain" />
```
To:
```jsx
<div className="flex items-center gap-2">
  <img src={logoParacosm} alt="Paracosm" className="bg-black rounded-lg p-1 w-8 h-8 object-contain" />
  <span className="font-bold text-slate-900 dark:text-white text-sm">Paracosm</span>
</div>
```

The ParacosmUniverseSection instance (which is slightly larger at w-10 h-10) will keep its size but also get the text added.

No new files or dependencies needed.

