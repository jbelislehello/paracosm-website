

# Add Tonalli Link Card to Landing Page

## What's Changing

A new section will be added to the landing page to help visitors discover the Tonalli Initiative. It will be placed between the "Bridge to Relational Innovation" section and the Contact section (between lines 468 and 470).

## Design

A compact, visually distinct card section with:
- Warm amber/orange gradient background (matching Tonalli's branding)
- "Tonalli Initiative" title with a short tagline
- Two subtle highlights for Voice and Spatial branches (icons: Mic and Eye)
- A CTA button linking to `/tonalli`

## Technical Details

### File: `src/pages/Index.tsx`

- Import `Mic` and `Eye` icons from lucide-react (line 13)
- Add a new section (~30 lines) between line 468 and line 470, styled as a dark card with amber accents
- Uses `Link` to `/tonalli` for the CTA button
- Responsive grid layout consistent with other landing page sections

No new files or components needed -- just a self-contained section block in the existing page.

