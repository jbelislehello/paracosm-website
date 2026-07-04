# Add videos to Tonalli page + refresh "La Naissance du Monde" case study

## 1. Tonalli page (`src/pages/Tonalli.tsx`)

Insert a new editorial section between "Two branches" (01) and "Educational design platforms" (02), renumbering the rest:

- **02 · In the wild** (tone `paper` or `warm`) — showcase of two field pieces of Tonalli Voice: *La Naissance du Monde* (Loto-Québec / Les Divertisseurs, with Queen Ka & Ivy).
- Two responsive 16:9 embeds side-by-side on desktop, stacked on mobile:
  - Vimeo: `https://player.vimeo.com/video/148532449`
  - YouTube: `https://www.youtube-nocookie.com/embed/bNR2VXOer6A`
- Below each embed: caption + outbound link (Vimeo original, La Bible Urbaine article) styled with `editorialType.caption`.
- Bump "Educational design platforms" numeral to 03 and "Get in touch" to 04.

## 2. Case study — La Naissance du Monde

### Data (`src/data/caseStudies.ts`)
Add to the `naissance-du-monde` entry:
- `links`: 3 entries (Vimeo, La Bible Urbaine article, YouTube).
- New optional field `videos?: { provider: 'vimeo' | 'youtube'; id: string; title: string }[]` on the `CaseStudy` interface, populated with the two IDs (`148532449`, `bNR2VXOer6A`).

### Copy (`src/i18n/{fr,en}/case-studies.json`)
Replace the current generic "large-scale public art" copy with real facts:
- **Subtitle** FR: "Œuvre interactive parlée — Loto-Québec / Les Divertisseurs" · EN equivalent.
- **Description**: pièce de spoken word interactive coproduite pour Les Divertisseurs de Loto-Québec, avec les artistes Queen Ka et Ivy — la voix (récitation, souffle, intonation) devient l'interface qui fait naître un monde visuel et sonore.
- **Role**: TBD — voir question ci-dessous.
- **Methods**: design d'interaction vocale, dramaturgie du souffle, direction créative interactive, collaboration avec artistes de scène.
- **Results / Impact**: diffusion Les Divertisseurs, couverture La Bible Urbaine, référence pour les projets Tonalli Voice actuels.
- **Technologies**: reconnaissance vocale, moteur temps réel, projection scénographique (remplace les LED/capteurs météo génériques actuels).

### Rendering (`src/components/case-studies/CaseStudyDetail.tsx`)
Ajouter, sous l'image d'en-tête, un rendu conditionnel `caseStudy.videos?.map(...)` : grille responsive avec `<iframe>` (Vimeo `player.vimeo.com/video/{id}`, YouTube `youtube-nocookie.com/embed/{id}`), `aspect-video`, `allowFullScreen`, `loading="lazy"`.

## Question

Quel a été **ton rôle exact** sur *La Naissance du Monde* (Les Divertisseurs / Loto-Québec, avec Queen Ka & Ivy) ? Design d'interaction vocale, direction créative, développement interactif — pour ne pas inventer un crédit.
