

# Remove Purple Border from Logo

## Change
Remove the `border border-purple-300` classes from the logo `<img>` tag on both pages where it appears.

## Files to Modify

### 1. `src/pages/LandingPage.tsx`
- Change `className="bg-white border border-purple-300 rounded-lg p-1 w-8 h-8 object-contain"` to `className="bg-white rounded-lg p-1 w-8 h-8 object-contain"`

### 2. `src/pages/AboutUs.tsx`
- Same change: remove `border border-purple-300` from the logo `<img>` class on line 95

### 3. `src/pages/DriftLanding.tsx`
- Remove `border border-purple-300` from the Drift hero logo container as well, for consistency

