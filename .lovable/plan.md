

# Add Tonalli Link to Main Navigation

## What's Changing

Add a "Tonalli" link to both the desktop and mobile navigation menus in the landing page header.

## Changes

### File: `src/pages/LandingPage.tsx`

**Desktop nav** (around line 124, between "Events" and "Contact"):
- Add: `<Link to="/tonalli" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Tonalli</Link>`

**Mobile menu** (around line 145, between "Events" and "Contact"):
- Add: `<Link to="/tonalli" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Tonalli</Link>`

No new files, imports, or dependencies needed.

