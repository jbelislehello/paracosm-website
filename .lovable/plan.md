# Real cover images for case studies

Right now most case studies use generic Unsplash IDs (`photo-xxxx`). Only `machine-bienveillance` has a real, project-specific image. This plan sources authentic cover images from the URLs already listed in each case study's `links` / `videos` and wires them through the CDN asset pipeline.

## Scope (case studies with usable sources)

| Case study | Source strategy |
|---|---|
| `wuxia-the-fox` | Scrape hero/cover from Le Soleil, École branchée, Baron Mag, Blurb, or Kickstarter. Prefer the book cover (Blurb / Renaud-Bray) or the iPad+book press photo (Le Soleil / École branchée). |
| `naissance-du-monde` | Use Vimeo `148532449` thumbnail (`vumbnail.com` or Vimeo oEmbed) or YouTube `bNR2VXOer6A` `maxresdefault.jpg`, or scrape La Bible Urbaine hero. |
| `machine-bienveillance` | Already custom — leave as is. |
| `oaciq-elise`, `calm-magic-methodology`, `io-theatre`, `simulateur-genial`, `lachine-passages`, `banff-residence`, `tedx-montreal` | **No URLs provided in prior turns.** Leave Unsplash placeholders and flag in the final summary. |

## Steps

1. **Fetch candidate images** for `wuxia-the-fox` and `naissance-du-monde`:
   - `fetch_website` on Le Soleil, École branchée, Baron Mag, La Bible Urbaine, Blurb pages → pick 1st-party hero/product image URL.
   - For YouTube: `https://i.ytimg.com/vi/{id}/maxresdefault.jpg`. For Vimeo: fetch oEmbed `https://vimeo.com/api/oembed.json?url=...` to get `thumbnail_url` (grab the largest size by stripping `_295x166` suffix).
2. **Download** the chosen image per case study to `/tmp/`.
3. **Upload via `lovable-assets create`** and write pointer to `src/assets/{slug}-cover.{ext}.asset.json`.
4. **Update `src/data/caseStudies.ts`** — replace the `image:` field for each migrated case study with the CDN URL from the pointer (matching the pattern already used for `machine-bienveillance`).
5. **Verify** `CaseStudyCard` renders correctly (its existing regex `/^(https?:)?\//.test(caseStudy.image)` already routes absolute/CDN paths through `<img src>` directly, so no component change needed).

## Out of scope
- No changes to i18n copy, video embeds, or link lists.
- No image generation — only real sourced images.
- Case studies with no user-provided URLs stay on Unsplash placeholders; I'll list them at the end so you can drop URLs later.

## Question before I build
Two viable Wuxia covers exist:
- **A — Book cover** (Blurb/Renaud-Bray product shot): most iconic, brand-consistent, timeless.
- **B — Press photo** (Le Soleil / École branchée: iPad + open book together): shows the augmented-book concept in action.

Reply "A", "B", or "you pick" and I'll proceed.
