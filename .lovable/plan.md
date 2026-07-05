## Objectif

Remplacer les placeholders Unsplash pour 3 case studies. Les 4 autres (`oaciq-elise`, `calm-magic-methodology`, `simulateur-genial`, `tedx-montreal`) restent tels quels — l'utilisateur fournira les URLs plus tard.

## Sources

- **io-theatre** — je scrape `zonesismique.com/portfolio/portfolio/boutique-interactive-saga-world/` et `share.google/CfawAptIYsnQ8luyx`, puis je choisis le visuel le plus fort éditorialement (photo d'installation, pas un logo/portrait).
- **lachine-passages** — visuel du Canal Lachine / installation Parcs Canada. Aucune URL image directe fournie ; je cherche sur le web (Firecrawl/web_search) une photo libre de droits ou d'archive Parcs Canada représentant le site. Si rien de crédible ne sort, je vous propose 2-3 candidats avant upload.
- **banff-residence** — reste un case study distinct de Paspébiac (confirmé). Aucune URL fournie ici ; je cherche une photo du Banff Centre / résidence. Même logique : je propose des candidats si l'automatique est faible.

## Étapes

1. `fetch_website` sur les 2 URLs io-theatre → extraire le meilleur visuel → `curl` vers `/tmp/`.
2. `web_search` pour lachine-passages (Canal Lachine, écluses, passages sonores) et banff-residence (Banff Centre residency). Si visuel évident, télécharger. Sinon, revenir avec 2-3 propositions.
3. Upload via `lovable-assets create --file …` pour chaque image retenue → écrire `src/assets/<slug>-cover.jpg.asset.json`.
4. Mettre à jour `src/data/caseStudies.ts` : remplacer le champ `image` (photo Unsplash id) par l'URL CDN du `.asset.json` pour les 3 cases.
5. Vérification : build passe, pas d'imports orphelins.

## Hors scope

- Les 4 autres case studies.
- Renommage `banff-residence` → `paspebiac-museum` (confirmé : on garde séparé).
- Modifications de copy/i18n — uniquement le champ `image`.

## Détails techniques

Fichier ciblé : `src/data/caseStudies.ts`. Le pattern est déjà établi par `wuxia-the-fox` et `naissance-du-monde` (URL `/__l5e/assets-v1/…` en dur dans `image:`). Aucun changement de type/schema requis.
