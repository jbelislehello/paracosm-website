## Already implemented

Saving your EN/FR choice across reloads and future visits is already working in `src/contexts/LanguageContext.tsx`:

1. **Initial render uses saved language** — `getInitialLanguage()` reads `localStorage.getItem('language')` synchronously before the first paint, so FR users no longer see an English flash.
2. **Fallback to browser language** — if nothing is stored, it uses `navigator.language` (FR browsers land on FR, everyone else on EN).
3. **Writes on every change** — an effect calls `localStorage.setItem('language', language)` whenever you toggle, wrapped in `try/catch` for private-mode safety.
4. **Keeps `<html lang>` in sync** — same effect sets `document.documentElement.lang` for SEO and assistive tech.

The site-wide toggle in `EditorialSiteHeader` (desktop nav + mobile bar) calls `setLanguage(...)` from this same context, so switching anywhere persists everywhere.

## Recommendation

No code changes required. If you're still seeing the language reset, tell me the exact steps (browser, incognito?, which page) and I'll investigate — otherwise we're done.