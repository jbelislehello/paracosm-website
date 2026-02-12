

# Fix Logo: Replace Old Black-Background Logo with New Rainbow Arc Logo

## Problem
The main landing page (`/`) and About Us page still display the old Paracosm logo on a black background. The Drift page was updated, but the header logo across other pages was not.

## What Will Change

The header logo in the navigation bar (currently showing the old logo with `bg-black`) will be updated to use the new rainbow arc image on a white background with a thin purple border -- matching the Drift page logo style.

## Steps

### 1. Replace the old logo asset
- Overwrite `src/assets/logo-paracosm.jpeg` with the new rainbow arc image (`logo-drift.jpeg`), so all imports of this file automatically use the new logo.

### 2. Update styling in `src/pages/LandingPage.tsx`
- Change the logo container from `bg-black rounded-lg p-1` to `bg-white border border-purple-300 rounded-lg p-1` so the white background and purple border match the brand specification.

### 3. Update styling in `src/pages/AboutUs.tsx`
- Same styling change as above: replace `bg-black` with `bg-white border border-purple-300`.

### 4. Check for any other pages using the old logo
- Search confirms `logo-paracosm.jpeg` is only used in `LandingPage.tsx` and `AboutUs.tsx`.

## Files Modified
- `src/assets/logo-paracosm.jpeg` -- replaced with the rainbow arc image
- `src/pages/LandingPage.tsx` -- updated logo container styling
- `src/pages/AboutUs.tsx` -- updated logo container styling

