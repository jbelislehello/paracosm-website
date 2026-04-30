## Remove the Crewdle popup announcement

The Crewdle component renders two things: a top banner bar and an auto-opening modal (popup) that re-surfaces every 7 days. The user wants the popup announcement gone.

### Changes
1. **`src/pages/LandingPage.tsx`**
   - Remove the `<CrewdleAnnouncementBanner />` usage (line 50).
   - Remove the import (line 16).

2. **`src/components/CrewdleAnnouncementBanner.tsx`**
   - Delete the file (no longer referenced anywhere else).

### Notes
- The Crewdle CDO role context is already preserved in the partner/announcement section via `PartnerToolsSection.tsx` (Principal Systems Auteur & Fractional CDO) and the April Drift edition, so removing the popup loses no information.
- The `BookAnnouncementBanner` (separate component) is unaffected.