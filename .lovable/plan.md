

# Generate Professional OG Image for Social Sharing

## Overview

Create a proper 1200x630 Open Graph image featuring the Paracosm logo centered on a black background with branding text, replacing the current raw logo JPEG which isn't optimized for social cards.

## Approach

Use a Supabase Edge Function to call the Lovable AI image generation API (google/gemini-2.5-flash-image) with a detailed prompt describing the desired OG image layout. The generated image will then be saved as `public/og-image.jpeg`, replacing the current file.

## Steps

### 1. Create Edge Function `generate-og-image`
- Call the AI image generation endpoint with a prompt like: "Create a 1200x630 social sharing card with a pure black background. Center the Paracosm logo (a series of concentric rainbow-colored arcs on black). Below the logo, add the text 'PARACOSM' in clean white uppercase lettering, and beneath that in smaller text 'Building Learning Organizations'. Keep the design minimal and elegant."
- Return the generated base64 image

### 2. Deploy, call, and retrieve the image
- Deploy the edge function
- Call it to generate the image
- Download the base64 result and save it as `public/og-image.jpeg`

### 3. Clean up
- Delete the edge function since it's a one-time generation task
- Verify the OG image meta tags in `index.html` still point to `/og-image.jpeg` (they already do)

## Technical Notes

- The AI model produces images at its native resolution; the prompt will request 1200x630 dimensions explicitly
- The edge function needs the `LOVABLE_API_KEY` secret (should already be available)
- This is a one-time image generation, not a runtime function

