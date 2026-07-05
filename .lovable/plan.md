## Objectif

Remplacer le placeholder Unsplash de `tedx-montreal` par un vrai visuel, et ajouter la vidéo YouTube du talk dans la galerie vidéo du case study.

## Sources

- Page TEDx : `https://tedxmontreal.com/en/tedxmontreal-jonathan-belisle/` (scrape pour photo de scène / portrait éditorial)
- Vidéo : `https://youtu.be/swgfAfaEsdw` → id YouTube `swgfAfaEsdw`

## Étapes

1. `fetch_website` sur la page TEDx → identifier la meilleure image (photo de scène de préférence, sinon portrait officiel TEDx). Fallback : thumbnail YouTube haute résolution (`https://i.ytimg.com/vi/swgfAfaEsdw/maxresdefault.jpg`) si aucune image forte n'est disponible sur la page.
2. `curl` vers `/tmp/covers/tedx-montreal.jpg`.
3. `lovable-assets create --file /tmp/covers/tedx-montreal.jpg` → écrire `src/assets/tedx-montreal-cover.jpg.asset.json`.
4. Mettre à jour `src/data/caseStudies.ts` pour `tedx-montreal` :
   - `image:` → URL CDN du nouvel asset
   - Ajouter `videos: [{ provider: 'youtube', id: 'swgfAfaEsdw', title: 'TEDxMontréal — Jonathan Bélisle' }]` (même pattern que Wuxia, rendu par `VideoGallery` dans `CaseStudyDetail`)

## Hors scope

- Aucune modif de copy/i18n.
- Les 3 case studies encore sans URL (`oaciq-elise`, `calm-magic-methodology`, `simulateur-genial`, `banff-residence`) restent inchangés.

## Détails techniques

Pattern déjà en place : `wuxia-the-fox` utilise `videos: [...]` consommé par `VideoGallery.tsx`. Aucun changement de schema requis, uniquement des données.
