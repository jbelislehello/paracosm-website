

# Fix Navigation Alignment (Language Switcher + Get Started Button)

## Problem

In the landing page header, the "FR" language switcher and "Get Started" button appear cut off or misaligned on the right edge. This is caused by the layout structure in the header: the `Sheet` component (mobile menu) sits between the desktop nav and the desktop actions div without being properly hidden on large screens, and the container may not have enough room for all elements.

## Solution

**File**: `src/pages/LandingPage.tsx`

1. **Wrap the right-side elements together**: Combine the mobile menu trigger and the desktop actions (LanguageSwitcher + Get Started) into a single flex container with `items-center` alignment, so they share the same right-aligned space.

2. **Restructure the header layout** (lines 54-105):
   - Keep the logo on the left
   - Keep the desktop nav in the center
   - Group the mobile hamburger, language switcher, and Get Started button into one right-aligned flex container
   - Ensure the `Sheet` wrapper doesn't interfere with desktop layout spacing

3. **Specific changes**:
   - Move the `Sheet` (mobile menu) and the desktop actions `div` into a single parent `div` with `flex items-center gap-2`
   - This ensures both mobile and desktop right-side elements are properly aligned and don't push each other off-screen
   - Add `flex-shrink-0` to prevent the right group from being compressed

This is a single-file change affecting only the header structure in `src/pages/LandingPage.tsx`.

