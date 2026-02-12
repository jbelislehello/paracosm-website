

# Paracosm Logo: Black Background, Rounded Corners, No Title

## What Changes

Remove the "Paracosm" text label next to the logo and ensure the logo image sits on a black background with rounded corners across all 4 locations where it appears.

## Files to Modify

### 1. `src/pages/LandingPage.tsx` (line ~57-58)
- Remove `<span className="font-bold text-lg">Paracosm</span>`
- Update the `<img>` tag: add `bg-black` and keep `rounded-md`, ensure `object-contain` and padding so the logo floats on a black pill/square

### 2. `src/pages/CaseStudies.tsx` (line ~26-27)
- Same change: remove the "Paracosm" span, add `bg-black` to the img wrapper

### 3. `src/pages/AboutUs.tsx` (line ~95-96)
- Same change

### 4. `src/components/ParacosmUniverseSection.tsx` (line ~165-167)
- Remove the `<h3>Paracosm</h3>` text block next to the logo
- Add `bg-black` to the img element

## Technical Detail

Each `<img>` tag will get the class `bg-black rounded-lg p-1 w-8 h-8 object-contain` (or `w-10 h-10` in the universe section to match its current size). The black background ensures the rainbow arc design pops clearly. The slight padding prevents the artwork from touching the rounded edges.

