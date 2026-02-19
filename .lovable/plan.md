
# Fix Top Navigation Centering

## Problem

The navigation header container uses `px-4` which overrides the Tailwind container's built-in `2rem` padding, pushing content too close to the screen edges. On wider screens this makes the nav appear left-leaning and potentially extending beyond the visible area.

## Fix

One change in `src/pages/LandingPage.tsx`, line 57:

- Remove the manual `px-4` from the container div so the Tailwind `container` class uses its configured `2rem` padding and `center: true` behavior
- Add `max-w-7xl mx-auto` to ensure consistent centering with a reasonable max width

### Before
```text
<div className="container flex items-center justify-between py-3 px-4">
```

### After
```text
<div className="container max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
```

This ensures:
- The container is properly centered on all screen sizes
- `px-6` provides comfortable horizontal breathing room (1.5rem) without being too tight
- `max-w-7xl` caps the width so nav items don't spread too far apart on ultra-wide screens
