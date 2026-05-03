## Add "Dream & Learn" CTA to Calm Magic Board

Add a small CTA button in the desktop header toolbar of `src/pages/CalmMagicBoard.tsx` and a matching entry in the mobile menu sheet, both routing to `/dream-and-learn`.

### Desktop header (around line 1144, right after the PRD button)

```tsx
<Button
  variant="outline"
  size="sm"
  onClick={() => navigate('/dream-and-learn')}
  title="Dream & Learn"
>
  <Sparkles className="w-4 h-4 mr-1" />
  Dream & Learn
</Button>
```

`Sparkles` is already imported in this file — no new imports.

### Mobile menu (around line 1445, next to the Encyclopedia button)

```tsx
<Button
  variant="outline"
  size="sm"
  className="justify-start"
  onClick={() => { navigate('/dream-and-learn'); setShowMobileMenu(false); }}
>
  <Sparkles className="w-4 h-4 mr-2" />
  Dream & Learn
</Button>
```

### Out of scope
- No route changes (`/dream-and-learn` already exists in `App.tsx`).
- No styling/theme changes; reuses existing `outline` button variant for consistency with neighboring PRD/Encyclopedia buttons.
