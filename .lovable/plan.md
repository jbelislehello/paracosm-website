

# Replace Placeholder Logos with Uploaded Brand Logos

## Overview

Replace the current text-based placeholder logos across the site with the three uploaded brand images:
- **Paracosm** logo (rainbow arc on black) -- used on LandingPage, CaseStudies, AboutUs headers
- **Tonalli** logo (fox with UFO) -- used on the Tonalli page header
- **HA Labs** logo (black "ha" square) -- used in Footer and ParacosmUniverseSection

## Asset Setup

Copy the 3 uploaded images to `src/assets/` for proper ES module imports:
- `src/assets/logo-paracosm.jpeg`
- `src/assets/logo-tonalli.jpeg`
- `src/assets/logo-ha.jpg`

## Files to Modify

### 1. `src/pages/LandingPage.tsx` (line ~55-59)
Replace the gradient square with "P" text with an `<img>` tag using the Paracosm logo. Size it to match the current 32x32px placeholder. The logo has a dark background so it works well on both light and dark themes.

### 2. `src/pages/CaseStudies.tsx` (line ~24-28)
Same replacement -- swap the "P" square for the Paracosm logo image.

### 3. `src/pages/AboutUs.tsx` (line ~93-97)
Same replacement -- swap the "P" square for the Paracosm logo image.

### 4. `src/pages/Tonalli.tsx` (line ~12-14)
Replace the text-only "Tonalli" link with the Tonalli fox logo image next to the text.

### 5. `src/components/Footer.tsx` (line ~16-20)
Replace the gradient square with "HA" text with the HA Labs logo image.

### 6. `src/components/ParacosmUniverseSection.tsx`
Replace the HA Labs and Paracosm text placeholders in the universe section with the respective logo images.

## Design Considerations

- All logos will be rendered as `<img>` elements with `className` for sizing (h-8 w-8 or similar, matching current dimensions)
- The Paracosm logo (dark background with rainbow arcs) works well in both light/dark themes
- The HA logo (black square with white "ha") is compact and works at small sizes
- The Tonalli logo (fox) may need a slightly larger display size given its detail -- will use h-8 w-auto to preserve aspect ratio
- `object-contain` will be used to prevent cropping
- Alt text will be descriptive for accessibility

