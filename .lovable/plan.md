

# Fix Video Titles in Drift Monthly Discoveries

## Problem

The YouTube video IDs were assigned to the wrong titles. Nearly every video entry has a title that belongs to a different YouTube ID. For example, `vK5PlnVQUqo` is actually the CreativeMornings talk, but was labeled "Early Career Interview", while `AXmwf5Fo-84` is actually the Wuxia school experience but was labeled "CreativeMornings".

## Corrected Mapping (YouTube ID to Real Title)

| youtubeId | Current (wrong) title | Correct YouTube title | Correct platform |
|---|---|---|---|
| `vK5PlnVQUqo` | Jonathan Belisle -- Early Career Interview | Jonathan Belisle (CreativeMornings Montreal) | CreativeMornings |
| `swgfAfaEsdw` | FNC09 -- Psychogeography... | TEDxMontreal -- Jonathan Belisle | TEDx |
| `3uWumNsq7gs` | Environnements programmables... | Jonathan Belisle -- Stories of a Near Future Collective Talk | E-AI |
| `OkHQg18SF24` | Conference Infopresse Ottawa | Jour 37 -- Interview Jonathan Belisle -- La Machine a bienveillance | TV5MONDE |
| `AXmwf5Fo-84` | CreativeMornings Montreal | Wuxia le renard -- Experience scolaire a l'Externat Saint-Jean-Berchmans | Lu Interactive |
| `NDQFpxl5UqM` | Les nouveaux horizons du Transmedia | DesignOPS avec Jonathan Belisle | Sprinkler |
| `CEukKAuEyX4` | Wuxia le renard... | Le futur de l'edition numerique jeunesse, selon Jonathan Belisle | FRQSC / UQAM |
| `FEnLGeiNjAc` | TEDxMontreal... | Environnements programmables et desirables -- Jonathan Belisle | Communautique / Mandalab |
| `of1aeUkcRxg` | IoT Theatre -- eCOM MTL | Mutations :: Convivialite numerique et futur de la lecture | TOPO |
| `S0YgJmnQkZM` | La Machine a bienveillance | Entrevue Jonathan Belisle -- IoT Theatre | eCOM MTL |
| `LitZOgUQ3GU` | Le futur de l'edition numerique jeunesse | Trouver ton essence pour reussir ta carriere creative | monExpansion |
| `Jx-ZLX0NuIE` | Convivialite numerique... | Du burnout a la renaissance -- Redesign ta carriere | monExpansion |
| `6ToFJ8I6z1k` | Stories of a Near Future -- AI and Arts | Conference de Jonathan Belisle -- Tournee Infopresse a Ottawa | Infopresse |
| `yM0H3cZMr9k` | DesignOPS Podcast | De "clown" a polymathe : raconter le monde quand on ne rentre dans aucune case | The Long And Winding Answer |
| `GCncJuY8u_4` | Trouver ton essence... | Les nouveaux horizons du Transmedia | Festival Regards |
| `ImsYaGSF1mI` | Du burnout a la renaissance... | Jonathan Belisle (LienMultimedia, 2009) | LienMultimedia |
| `7jVV-476Bog` | De "clown" a polymathe... | FNC09 JonathanBelisle -- Psychogeography | LienMultimedia |

## Implementation

### Single file to modify: `src/data/driftMonthlyDiscoveries.ts`

Update every video entry's `title`, `speaker`, `description`, `platform`, `category`, and `axis` to match the actual YouTube content for its ID. The month assignments and YouTube IDs stay the same -- only the metadata needs correcting.

Key corrections per month:

- **Jan 2025** (`vK5PlnVQUqo`): Title becomes "Jonathan Belisle at CreativeMornings Montreal", platform "CreativeMornings", category stays WorldBuilders/FREE
- **Feb 2025** (`swgfAfaEsdw`): Title becomes "TEDxMontreal -- Jonathan Belisle", platform "TEDx", category becomes 21c Parenting/MAGIC (technology in education)
- **Mar 2025** (`3uWumNsq7gs`): Title becomes "Jonathan Belisle | Stories of a Near Future Collective Talk", platform "E-AI", category becomes Post-Broadcast/FREE
- **Apr 2025** (`OkHQg18SF24`): Title becomes "La Machine a bienveillance -- Interview Jonathan Belisle", platform "TV5MONDE", category becomes WorldBuilders/FREE
- **May 2025** (`AXmwf5Fo-84`): Title becomes "Wuxia le renard -- Experience scolaire", platform "Lu Interactive", category becomes Playgrounds/CALM
- **Jun 2025** (`NDQFpxl5UqM`): Title becomes "DesignOPS avec Jonathan Belisle", platform "Sprinkler", category becomes Workflows/CALM
- **Jul 2025** (`CEukKAuEyX4`): Title becomes "Le futur de l'edition numerique jeunesse", platform "FRQSC / UQAM", category becomes Post-Broadcast/FREE
- **Aug 2025** (`FEnLGeiNjAc`): Title becomes "Environnements programmables et desirables", platform "Communautique / Mandalab", category becomes Sensory Rooms/MAGIC
- **Sep 2025** (`of1aeUkcRxg`): Title becomes "Convivialite numerique et futur de la lecture", platform "TOPO", category becomes Narratives/MAGIC
- **Oct 2025** (`S0YgJmnQkZM`): Title becomes "Entrevue Jonathan Belisle -- IoT Theatre", platform "eCOM MTL", category becomes Connected Life/OPEN
- **Nov 2025** (`LitZOgUQ3GU`): Title becomes "Trouver ton essence pour reussir ta carriere creative", platform "monExpansion", category becomes Inquiry and Practices/CALM
- **Dec 2025** (`Jx-ZLX0NuIE`): Title becomes "Du burnout a la renaissance -- Redesign ta carriere", platform "monExpansion", category becomes Embodied Cognition/LOVE
- **Dec 2025** (`6ToFJ8I6z1k`): Title becomes "Conference Infopresse -- Tournee a Ottawa", platform "Infopresse", category becomes Telling Stories/OPEN
- **Jan 2026** (`yM0H3cZMr9k`): Title becomes "De 'clown' a polymathe : raconter le monde", platform "The Long And Winding Answer", category becomes Human Dynamics and System Thinking/OPEN
- **Jan 2026** (`GCncJuY8u_4`): Title becomes "Les nouveaux horizons du Transmedia", platform "Festival Regards", category becomes Post-Broadcast/FREE
- **Feb 2026** (`ImsYaGSF1mI`): Title becomes "Jonathan Belisle (LienMultimedia)", platform "LienMultimedia", category becomes Telling Stories/OPEN
- **Feb 2026** (`7jVV-476Bog`): Title becomes "FNC09 -- Psychogeographie et realite augmentee", platform "LienMultimedia", category becomes Tangible Play/LOVE

