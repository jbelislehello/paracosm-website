# Wuxia video gallery with thumbnails + clear playback order

Replace the current 2-up iframe grid (in `CaseStudyDetail.tsx`) with a **VideoGallery** component: one large "now playing" player, a numbered thumbnail strip below acting as a playlist, and prev/next controls. Applies to any case study with `videos[]`, so Wuxia and *Naissance du Monde* both benefit.

## Component: `src/components/case-studies/VideoGallery.tsx` (new)

- Props: `videos: { provider, id, title }[]`.
- State: `activeIndex` (default 0), `hasStarted` (defer iframe creation until user clicks, so YouTube/Vimeo don't autoload 2+ players at once).
- Layout:
  - **Featured player** (top): `aspect-video`, rounded, shows the active video. Before first play, renders the thumbnail with a large play button overlay + video title + "1 / N" counter.
  - **Thumbnail strip** (below): horizontal scroll (mobile) / flex-wrap (desktop). Each item = 16:9 thumbnail with:
    - Numbered order badge (`1`, `2`, …) top-left
    - "▶ Now playing" ring / accent border on the active one
    - Title underneath, truncated
  - **Prev / Next buttons** on the featured player (bottom-right), disabled at boundaries.
- Thumbnails resolved client-side, no extra fetches:
  - YouTube: `https://i.ytimg.com/vi/{id}/hqdefault.jpg`
  - Vimeo: use a static override map keyed by video id (Vimeo requires an API call for thumbnails). Extend `CaseStudy.videos[]` type with an optional `thumbnail?: string` field so Vimeo entries can provide the CDN thumbnail URL we already have from oEmbed. YouTube entries can omit it.
- Keyboard: `←` / `→` on the gallery container step through videos.
- A11y: buttons have `aria-label`, thumbnails are `<button>` with `aria-current="true"` for active.

## Data update: `src/data/caseStudies.ts`

- Extend `videos` type: `{ provider: 'vimeo' | 'youtube'; id: string; title: string; thumbnail?: string }`.
- On the *Naissance du Monde* Vimeo entry, add `thumbnail: 'https://i.vimeocdn.com/video/547498526-b1811c16ff9fab209ed2c7c17b7e9d3ef2fcd97a5385539774d64cd5f86c4673-d_640'` (already fetched from oEmbed).
- Wuxia has 2 YouTube videos → no thumbnail field needed; YouTube URL pattern used automatically.
- Confirm playback order: for Wuxia, keep **1) Trailer (`dd8DISjnSfQ`)** then **2) Captation (`AXmwf5Fo-84`)**. For Naissance du Monde, keep **1) Vimeo captation** then **2) Queen Ka & Ivy YouTube**.

## Wiring: `src/components/case-studies/CaseStudyDetail.tsx`

- Replace lines 59–79 (the grid of iframes) with `<VideoGallery videos={caseStudy.videos} />`.
- No other changes.

## Out of scope
- No autoplay, no i18n string changes (component labels stay minimal: numeric badges + "Now playing" — small text, add EN string via inline literal like the existing "Back to Case Studies" button which is already hard-coded English).
- No changes to the Tonalli page video block (that's a separate curated section, not a case-study gallery).
- No image uploads — thumbnails come straight from YouTube's CDN and the existing Vimeo CDN URL.
