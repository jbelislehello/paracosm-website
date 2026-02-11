

# Replace Retreat Popup with Landing Page

## Overview

Remove the auto-popup retreat announcement from the homepage and create a dedicated `/paracosm-retreat` landing page. The page will reuse the existing retreat content (highlights, 3-day journey, audience, outcomes) but replace the "Book Consultation" CTA with an **invitation list signup form** (name + email). Updated details: **Azores Island, Portugal at Botanico House -- August 25**.

## Changes

### 1. Create new landing page: `src/pages/ParacosmRetreatLanding.tsx`

- Full-page layout (not a dialog) with the same gradient styling
- **Hero section**: Title, updated description mentioning Azores/Botanico House/August 25
- **Highlights grid**: 3 cards (Immersive Storytelling, Mathematical Creativity, Calm Magic Framework)
- **3-Day Journey overview**: Same 3-day structure from the popup
- **Audience & Outcomes sections**: From the existing i18n retreat content
- **Invitation list form**: Name + email fields with a "Request Invitation" submit button (stores in Supabase or shows a success toast for now)
- Uses existing `retreat.*` i18n translations where possible, with new keys for location/date details

### 2. Remove popup from `src/pages/LandingPage.tsx`

- Remove `RetreatAnnouncementPopup` import and component usage
- Remove all popup-related state (`isRetreatAnnouncementOpen`, `hasUserEngaged`)
- Remove the `useEffect` logic for scroll/click engagement tracking and localStorage
- Remove `handleCloseRetreatAnnouncement` function

### 3. Add route in `src/App.tsx`

- Add `<Route path="/paracosm-retreat" element={<ParacosmRetreatLanding />} />`

### 4. Update `src/components/ParacosmUniverseSection.tsx`

- Change `"Paracosm Retreat"` (plain string) to `{ label: "Paracosm Retreat", to: "/paracosm-retreat" }` so it links to the new landing page

### 5. Update i18n files

- Add new keys in `src/i18n/en/retreat.json` and `src/i18n/fr/retreat.json` for:
  - Location: "Azores Island, Portugal"
  - Venue: "Botanico House"
  - Date: "August 25, 2026"
  - Invitation list CTA text

### 6. Delete `src/components/RetreatAnnouncementPopup.tsx`

- No longer needed once the landing page replaces it

### Files modified
- `src/pages/ParacosmRetreatLanding.tsx` (new)
- `src/pages/LandingPage.tsx` (remove popup)
- `src/App.tsx` (add route)
- `src/components/ParacosmUniverseSection.tsx` (link "Paracosm Retreat")
- `src/i18n/en/retreat.json` (add location/date/invitation keys)
- `src/i18n/fr/retreat.json` (add location/date/invitation keys)
- `src/components/RetreatAnnouncementPopup.tsx` (delete)

