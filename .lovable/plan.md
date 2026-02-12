

# Add "Paracosm" Text to the Right of the Logo

## Changes

Re-add the "Paracosm" text label next to the logo image across all 4 files. The logo image itself stays unchanged (rainbow arc on black rounded tile). The word "Paracosm" appears to its right.

## Files to Update

### 1. `src/pages/LandingPage.tsx` (line 57)
Add `<span className="font-bold text-slate-900 dark:text-white text-sm">Paracosm</span>` after the `<img>` tag

### 2. `src/pages/AboutUs.tsx` (line 95)
Same addition after the `<img>` tag

### 3. `src/pages/CaseStudies.tsx` (line 26)
Same addition after the `<img>` tag

### 4. `src/components/ParacosmUniverseSection.tsx` (line 165)
Same addition after the `<img>` tag

Each location already has a `flex items-center gap-2` wrapper, so the text will automatically appear to the right of the logo.

