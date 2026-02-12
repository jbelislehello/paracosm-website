

# Fix Logo: Replace logo-paracosm.jpeg with Rainbow Arc Image

## Problem
The header logo on `/` and `/about` still shows the old logo on a black background. Previous attempts to overwrite `src/assets/logo-paracosm.jpeg` may not have taken effect properly.

## Solution
Overwrite `src/assets/logo-paracosm.jpeg` with the freshly uploaded rainbow arc image (`IMG_2998-2.jpeg`). The styling (`bg-white rounded-lg p-1`) is already correct in both `LandingPage.tsx` and `AboutUs.tsx` -- no code changes needed, only the asset file replacement.

## Steps

1. Copy `user-uploads://IMG_2998-2.jpeg` to `src/assets/logo-paracosm.jpeg`, replacing the existing file
2. Verify the logo renders correctly on the landing page

## Files Modified
- `src/assets/logo-paracosm.jpeg` -- overwritten with the new rainbow arc logo

