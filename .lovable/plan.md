

# Move Tonalli to Its Own Page

## What's Changing

The Tonalli Initiative section currently embedded in the GL!TCH Methodology page will be extracted into its own dedicated page at `/tonalli`, with its own header, footer, and navigation. The section will be removed from `GlitchMethodology.tsx`.

## Changes

### 1. Create `src/pages/Tonalli.tsx`
- New standalone page with the same dark theme styling
- Header with "Tonalli" branding and a "Back to Home" link
- All existing Tonalli content moved here (Voice, Spatial, Educational Design Platforms, Medium link)
- Its own CTA section with `mailto:jbelisle@helloarchitekt.com`
- Footer consistent with other pages

### 2. Update `src/App.tsx`
- Import the new `Tonalli` page
- Add route: `<Route path="/tonalli" element={<Tonalli />} />`

### 3. Update `src/pages/GlitchMethodology.tsx`
- Remove the entire Tonalli section (lines 263-405)
- Remove unused icon imports (`Mic`, `Eye`, `ExternalLink`, `Lightbulb`, `Box`, `Palette`) if no longer needed
- Optionally add a small link/card pointing to `/tonalli` so visitors can discover it

### 4. Update navigation (landing page or other nav)
- Add a link to `/tonalli` from the landing page or main navigation so the new page is discoverable

