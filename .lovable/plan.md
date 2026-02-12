

# Add Paracosm Rainbow Arc Logo to the Drift Landing Page

## What Changes
Replace the generic project logo with the uploaded rainbow arc image, displayed inside a white-background container with a thin purple border, placed in the Drift hero section above the "Drift" title.

## Steps

### 1. Copy the uploaded image into the project
- Copy `user-uploads://IMG_2998.jpeg` to `src/assets/drift/logo-drift.jpeg`

### 2. Update `src/pages/DriftLanding.tsx`
- Import the new logo: `import logoDrift from "@/assets/drift/logo-drift.jpeg"`
- Add the logo image above the "Drift" `<h1>` in the hero section, inside a container with:
  - White background (`bg-white`)
  - Thin purple border (`border border-purple-300 rounded-2xl`)
  - Appropriate sizing (e.g., `w-32 h-auto mx-auto`)
  - The image displayed with `object-contain` for proper aspect ratio

### 3. Update `public/logo.svg` (Optional)
- If the user also wants the site-wide favicon/logo replaced, that can be a follow-up step. This plan focuses on the Drift page only.

## Visual Result
The hero section will show: Rainbow arc logo (white bg, purple border) -> "Drift" title -> subtitle text -> CTA buttons.
