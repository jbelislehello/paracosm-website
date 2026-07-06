## Finding
This is already implemented. `src/contexts/LanguageContext.tsx` persists the selection:

- On mount, it reads `localStorage.getItem('language')` and restores `'en'` or `'fr'` if present (lines 45–50).
- Every time `language` changes, it calls `localStorage.setItem('language', language)` (line 86).

Because the header toggle calls `setLanguage(...)` from this same context, choosing FR (or EN) is already saved and re-applied on subsequent visits.

## Optional hardening (only if you want it)
- **Flash of English on first paint for FR users:** the initial state is `'en'` and switches after the mount effect runs, which can cause a brief EN flash. Fix by initializing `useState` lazily from `localStorage` so the first render already uses the saved language.
- **Respect browser language on first-ever visit:** if no value is stored, fall back to `navigator.language.startsWith('fr') ? 'fr' : 'en'` before defaulting to EN.
- **`<html lang>` attribute:** update `document.documentElement.lang` in the same effect so assistive tech and SEO reflect the active language.

## Recommendation
Persistence already works — no action required unless you want one or more of the three enhancements above. Tell me which (if any) to apply and I'll switch to build mode.
