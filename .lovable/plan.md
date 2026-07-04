# Update — Machine à Bienveillance case study

Rewrite the existing `machine-bienveillance` entry with facts sourced from the ONF blog, Le Soir, and the Communication (OpenEdition) academic article, and swap the placeholder Unsplash image for the uploaded photo.

## Content changes (FR + EN, `src/i18n/{fr,en}/case-studies.json`)

- **Year**: 2017 (correct from 2018).
- **Title / subtitle**: "La Machine à Bienveillance" / "Installation interactive ONF/NFB — bienveillance vs. incivilité".
- **Description** (FR/EN): Installation immersive coproduite avec l'Office national du film du Canada, présentée à MURAL (Montréal, 2017) puis en tournée en Europe dont Bruxelles (2019, festival "Brux'ils, Brux'elles" / Recyclart). Une sculpture monumentale en forme de caméra de surveillance rose renverse le dispositif: au lieu de surveiller, elle "surveille avec bienveillance" — dialogue, compliments et micro-gestes de civilité adressés aux passant·e·s.
- **Role**: Concepteur d'expérience / design d'interaction conversationnelle (adapté au rôle réel de l'utilisateur — voir question ci-dessous).
- **Methods**: Design d'interaction située, dramaturgie conversationnelle, art public participatif, recherche-création (référence article *Communication*).
- **Results**: Milliers d'interactions publiques à Montréal et Bruxelles; couverture presse (Le Soir), diffusion ONF, étude académique publiée dans *Communication* (OpenEdition).
- **Impact**: Reframe du regard technologique — la surveillance comme vecteur de lien social plutôt que de contrôle; contribution au discours sur les incivilités urbaines et l'IA relationnelle.
- **Awards**: retirer le "Prix Arts Numériques 2018" (non vérifiable) — remplacer par "Sélection MURAL Festival 2017" et "Tournée européenne Brux'ils Brux'elles 2019".
- **Technologies**: Dialogue scripté / IA conversationnelle, capteurs de présence, sculpture LED, structure acier — remplace les libellés génériques actuels.
- **Sources**: ajouter un champ `sources` (array d'URLs) rendu comme liste de références sous la fiche.

## Data changes (`src/data/caseStudies.ts`)

- `year: '2017'`
- `image`: nouvelle référence vers l'asset uploadé (via `lovable-assets` pointant sur l'image `10-la-machine-a-bienveillance-1080x560.jpg`) au lieu du photo-id Unsplash.
- Ajouter `sources: [...]` avec les 5 URLs fournies (ONF, YouTube, Facebook, Le Soir, OpenEdition).
- Ajuster `awards` array (2 entrées).

## Rendering

- Case study detail component: ajouter le rendu d'une section "Références / Presse" si `sources?.length` (liste `<a target="_blank" rel="noopener">` avec libellés dérivés du hostname).
- Aucun autre changement de layout.

## Question ouverte

Un point à confirmer avant d'écrire les copies finales: **quel a été ton rôle exact** sur *La Machine à Bienveillance*? (concepteur UX conversationnel, collaborateur ONF, dramaturge d'interaction, autre) — pour éviter d'inventer un crédit.
