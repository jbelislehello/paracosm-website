

# Update HA Labs + Paracosm Panel

## Changes

### HA Labs Side

1. **Satori & Kensho** -- convert from plain text to a link pointing to `https://suno.com/@jbelisle` (external, opens in new tab)

2. **"Calm Magic: The Book"** -- rename to **"Calm Magic: The Newsletter"** and make it a link to `https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=6884529759464816640` (external, opens in new tab)

### Paracosm Side

3. **Add a new "Drift" branch** with icon `Mic` (or `Book`), containing one sub-item:
   - "Monthly Review" -- links to `/drift` (internal)

4. **Remove "Drift Podcast"** from under "Events" since Drift now has its own branch.

## Technical Details

**File:** `src/components/ParacosmUniverseSection.tsx`

### Data changes

In `haLabsBranches`:
- Line 10: Change `"Satori & Kensho"` to `{ label: "Satori & Kensho", href: "https://suno.com/@jbelisle" }`
- Line 17: Change `"Calm Magic: The Book"` to `{ label: "Calm Magic: The Newsletter", href: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=6884529759464816640" }`

In `paracosmBranches`:
- Add a new branch after "Events":
  ```tsx
  {
    label: "Drift",
    icon: Mic,
    children: [
      { label: "Monthly Review", to: "/drift" },
    ],
  }
  ```
- Remove `{ label: "Drift Podcast", to: "/drift" }` from the Events children array

### Rendering update

The HA Labs item renderer (around lines 110-133) currently handles two types: plain strings and objects with `{ label, to }`. It needs to also handle objects with `{ label, href }` for external links, rendering an `<a href="..." target="_blank" rel="noopener noreferrer">` instead of a `<Link>`.

The check will be: if the item has an `href` property, render as an external `<a>` tag; if it has a `to` property, render as an internal `<Link>`.

### Files modified
- `src/components/ParacosmUniverseSection.tsx` only

