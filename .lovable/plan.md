

# Update OG Image: Logo + "PARACOSM" Title

## What We'll Do

Create a new Open Graph social sharing image (1200x630) with:
- **White background**
- **The uploaded rainbow arc logo** (from IMG_2996/IMG_2997) on the left
- **"PARACOSM"** text in black, positioned to the right of the logo

## Technical Steps

1. **Create a temporary edge function** (`generate-og-image`) that sends the uploaded rainbow arc image to the AI image generation API with instructions to place it on a white background with "PARACOSM" in black text to its right
2. **Deploy and call** the edge function to generate the image
3. **Save the result** as `public/og-image.jpeg`, replacing the current file
4. **Clean up** by deleting the edge function (one-time use)

## Design Spec for the Prompt

- White (#FFFFFF) background, 1200x630 pixels
- The rainbow arc logo displayed at roughly 400x400 on the left side
- "PARACOSM" in bold, clean black sans-serif uppercase text centered vertically to the right of the logo
- No tagline, no extra decoration -- just logo + title

## Files Changed

- `public/og-image.jpeg` (replaced with new generated image)
- Temporary edge function created and deleted

No changes needed to `index.html` since it already references `/og-image.jpeg`.

