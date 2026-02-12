

# Fix Remaining Black Background on Logo

## Problem
The logo still shows on a black background in two files that were missed in previous updates.

## Changes

### 1. `src/components/ParacosmUniverseSection.tsx` (line 165)
- Change `bg-black` to `bg-white` on the logo `<img>` tag

### 2. `src/pages/CaseStudies.tsx` (line 26)
- Change `bg-black` to `bg-white` on the logo `<img>` tag

## No other files affected
LandingPage.tsx and AboutUs.tsx already use `bg-white` -- only these two remaining instances need updating.

