

# Update Top Navigation in LandingPage

## Changes to `src/pages/LandingPage.tsx`

### 1. Remove "Book Call" button from top nav (line 152-156)
Remove the "Book Call" outline button entirely from the desktop actions area.

### 2. Link "Get Started" button to contact section (line 157-160)
Change the "Get Started" button from opening CalmMagicAssistant to scrolling to the `#contact` section instead. Replace `onClick={handleStartCoaching}` with an anchor link to `#contact`.

### 3. Update desktop nav links (lines 118-125)
- Change "Paracosm" to two separate links: **"AI Leadership"** (pointing to `/agentic-ux`) and **"Team Coaching"** (pointing to `/calm-magic-assistant`)
- Change "Calm Magic Board" to just **"Calm Magic"** (same `/calm-magic-board` route)
- Keep Drift, Tonalli, Events, Contact as-is

### 4. Update mobile nav links (lines 135-145)
Mirror the same changes: replace "Paracosm" with "AI Leadership" + "Team Coaching", rename "Calm Magic Board" to "Calm Magic".

## Technical Details

Desktop nav becomes:
```
AI Leadership | Team Coaching | Calm Magic | Drift | Tonalli | Events | Contact
```

The "Get Started" button changes from:
```tsx
<Button onClick={handleStartCoaching} ...>Get Started</Button>
```
to:
```tsx
<a href="#contact"><Button ...>Get Started</Button></a>
```

The "Book Call" `<a>` + `<Button>` block (lines 152-156) is removed entirely.

### Files modified
- `src/pages/LandingPage.tsx` only

