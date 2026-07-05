## Objectif

Rendre plus proéminent, sur la page d'accueil (`/` → `EditorialHome`), le langage original **inventivité & expressivité** (Dreams = inventif, Learn = expressif — actuellement vivant surtout sur `/dream-and-learn`), et élargir l'audience pour parler aussi aux **PME / SMBs**, sans déplacer le focus principal (CEOs, directeurs, équipes créatives).

## Portée

Deux fichiers, pas de nouveau composant, pas de refonte visuelle :

1. **`src/components/editorial/EditorialHero.tsx`** — retravailler le bloc d'intro (h1 + paragraphe) pour installer d'emblée le couple **inventivité / expressivité** comme thèse d'ouverture, et mentionner explicitement les PME aux côtés des dirigeants et créatifs.
2. **`src/pages/EditorialHome.tsx`** — ajuster les `body` des 3 `TriadChapter` (Foreplay / Foresight / Forecast) pour :
   - inclure "PME" / "SMB" dans l'énumération d'audience de Foreplay et Foresight (aujourd'hui : « entrepreneurs, executives, and creative teams » / « founders, executives, and creative partners »),
   - réinjecter les mots **inventive** et **expressive** dans au moins un `pullQuote` ou une phrase de body, pour que le lecteur croise ce vocabulaire dès la home et pas seulement sur `/dream-and-learn`.

## Détails d'édition

- **Hero** : remplacer le paragraphe descriptif par une formulation du type
  > « Paracosm outille l'**inventivité** (les Dreams) et l'**expressivité** (le Learn) des dirigeants, équipes créatives et **PME ambitieuses** — un même arc Foreplay · Foresight · Forecast pour transformer les questions IA en évidences vécues, testées et livrées. »
  
  Mettre `inventivité` et `expressivité` en emphase visuelle (même traitement `<b>` / `<em>` que les mots-clés existants), sans casser la hiérarchie typographique.

- **Foreplay (01)** : élargir l'audience du body à « fondateurs de PME, dirigeants et équipes créatives » ; garder la mention de la formation Crewdle × Paracosm intacte.

- **Foresight (02)** : ajuster le `pullQuote` ou une phrase du body pour évoquer un lieu qui accueille l'**inventivité** avant qu'elle ne soit compressée par le calendrier. Ajouter « PME en croissance » à l'audience.

- **Forecast (03)** : garder tel quel côté audience (le Forecast reste résidence engagée, adapté aux orgs qui peuvent embarquer plusieurs semaines) ; réinjecter **expressive** dans le body pour boucler la thèse (« l'imagination devient infrastructure expressive »).

## Hors scope

- Pas de nouveau composant, pas de nouvelle section, pas de changement de couleurs/typo/animation.
- Pas de retouches sur `/dream-and-learn` (source du vocabulaire, reste tel quel).
- Pas de traduction i18n : `EditorialHome` / `EditorialHero` sont hardcodés en anglais éditorial aujourd'hui ; on garde le même registre (le vocabulaire "inventive/expressive" existe déjà en anglais dans le codebase).
- Pas de dilution du focus CEO/directeurs/créatifs — les PME sont ajoutées en co-audience, pas en audience principale.

## Vérification

- Grep `inventiv|expressiv|SMB|PME` sur les deux fichiers pour confirmer présence.
- Build lint/TS (pas de changement de types).
- Contrôle visuel du hero et des 3 chapitres en desktop et mobile.
