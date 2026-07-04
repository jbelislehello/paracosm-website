# Update — Wuxia le renard case study

Enrich the existing `wuxia-the-fox` entry with the videos, links, and factual polish sourced from École branchée, Le Soleil, Blurb, l'UQAM (Archipel), Baron Mag, Lien Multimédia, Colin/Ex-Situ, Kickstarter and Renaud-Bray.

## Data (`src/data/caseStudies.ts`)
Add to the `wuxia-the-fox` entry:
- `videos`: two YouTube embeds — `dd8DISjnSfQ` (trailer/gameplay) and `AXmwf5Fo-84` (secondary capture).
- `links`: 9 press / academic / commerce references, each with a clean French title:
  - École branchée, Le Soleil, Baron Mag (portrait Jonathan Bélisle / Hello Architekt), Lien Multimédia
  - Mémoire UQAM (Archipel PDF, D4233)
  - Colin / Ex-Situ (documentation d'archives)
  - Blurb (livre papier), Renaud-Bray (édition FR), Kickstarter (campagne)

## Copy (`src/i18n/{fr,en}/case-studies.json`)
Refresh the current copy so it reflects the documented facts:
- **Subtitle** FR: "Livre-univers augmenté & app iPad — SAGA / TFO" · EN equivalent.
- **Description**: conte transmédia de 200 pages (Wuxia le renard — à la recherche des rêves perdus) publié en FR et EN, accompagné d'une application iPad qui reconnaît images, masques et blocs de bois du livre pour déclencher des scènes audiovisuelles ; coproduit avec SAGA et diffusé avec TFO.
- **Role**: auteur, illustrateur et directeur créatif du transmédia (livre + app), design de la reconnaissance visuelle/vocale — chef d'orchestre du dispositif Calm Magic à ses débuts.
- **Methods**: écriture jeunesse, direction artistique illustrée, design d'interaction multi-support (papier ↔ tablette), reconnaissance image + voix, méthodologie Calm Magic (première itération publique).
- **Results**: campagne Kickstarter financée avec succès (2014), livre imprimé (Blurb) distribué chez Renaud-Bray, app iPad publiée, tournée médiatique (Le Soleil, École branchée, Lien Multimédia, Baron Mag).
- **Impact**: pièce fondatrice du paracosme Wuxia — ancre pour la méthodologie Calm Magic ; référencée dans un mémoire universitaire de l'UQAM (Archipel D4233) et archivée par Colin / Ex-Situ ; posture publique de Jonathan Bélisle / Hello Architekt cimentée par Baron Mag.
- **Awards** (garder l'existant + ajouter):
  - Grand Prix Numix 2015 — Mention Spéciale
  - Campagne Kickstarter financée (2014)
  - Référencé dans mémoire académique UQAM (Archipel)
- **Technologies**: réalité augmentée iPad, vision par ordinateur (reconnaissance d'images/objets), reconnaissance vocale, synthèse audio, illustration + impression grand format.

## Rendering
Aucune modif de composant : `CaseStudyDetail` sait déjà rendre `videos` (ajouté à l'itération précédente) et `links`. Aucun changement de `CaseStudyCard`.

## Hors scope
Pas de nouvelle image d'en-tête — l'image Unsplash actuelle reste jusqu'à ce que tu m'envoies une image officielle Wuxia à uploader comme asset.
