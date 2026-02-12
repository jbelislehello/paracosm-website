
# Add 36 New Books to Drift (2022 Archive)

## Overview

36 new books need to be added. Since all monthly slots from 2023-2024 are full, we create 12 new months for 2022 (Jan-Dec), each with 3 books. The archive grid on `/drift` auto-renders from the data array, so adding 2022 entries will make them appear automatically.

## Monthly Distribution (2022)

| Month | Book | Axis |
|---|---|---|
| **Jan 2022** | Skin in the Game (Taleb) | OPEN |
| **Jan 2022** | Siddhartha (Hesse) | MAGIC |
| **Jan 2022** | Les fous du son (de Wilde) | LOVE |
| **Feb 2022** | La Bhagavad-Gita | MAGIC |
| **Feb 2022** | Le Parfum (Suskind) | LOVE |
| **Feb 2022** | Le sacre et le profane (Eliade) | MAGIC |
| **Mar 2022** | Zero to One (Thiel) | OPEN |
| **Mar 2022** | Labanotation (Hutchinson Guest) | LOVE |
| **Mar 2022** | Lighter (Yung Pueblo) | LOVE |
| **Apr 2022** | Rework (Fried and Hansson) | CALM |
| **Apr 2022** | Divining a Digital Future | OPEN |
| **Apr 2022** | The Year of Dreaming Dangerously (Zizek) | OPEN |
| **May 2022** | Antifragile (Taleb) | CALM |
| **May 2022** | Le point de bascule (Gladwell) | OPEN |
| **May 2022** | Who's Your City? (Florida) | FREE |
| **Jun 2022** | Drive (Pink) | CALM |
| **Jun 2022** | Spreadable Media (Jenkins et al.) | OPEN |
| **Jun 2022** | Precis de meditations | CALM |
| **Jul 2022** | Little Bets (Sims) | CALM |
| **Jul 2022** | Discours (Rousseau) | OPEN |
| **Jul 2022** | Chaos calme (Veronesi) | LOVE |
| **Aug 2022** | Christiane Singer (engagement/mariage) | LOVE |
| **Aug 2022** | Hannah Arendt (La condition de l'homme moderne) | OPEN |
| **Aug 2022** | Kuthark: Rune Magic (Thorsson) | MAGIC |
| **Sep 2022** | Le Satyricon (Petrone) | FREE |
| **Sep 2022** | The Art of Game Design (Schell) | OPEN |
| **Sep 2022** | Cinema 1: L'image-mouvement (Deleuze) | MAGIC |
| **Oct 2022** | Cinema 2: L'image-temps (Deleuze) | MAGIC |
| **Oct 2022** | Cosmos (Sagan) | MAGIC |
| **Oct 2022** | Le sentiment meme de soi (Damasio) | CALM |
| **Nov 2022** | hot text: Web Writing That Works (Price) | OPEN |
| **Nov 2022** | The Organism (Goldstein) | CALM |
| **Nov 2022** | FUTURETAINMENT (Walsh) | OPEN |
| **Dec 2022** | Bubbletecture | FREE |
| **Dec 2022** | The Seven Arts of Change | CALM |
| **Dec 2022** | La guerre des yeux (Virilio) | OPEN |

## Axis Summary
- **LOVE**: 6 books (Les fous du son, Le Parfum, Labanotation, Lighter, Chaos calme, Christiane Singer)
- **MAGIC**: 7 books (Siddhartha, Bhagavad-Gita, Le sacre et le profane, Kuthark, Cinema 1, Cinema 2, Cosmos)
- **CALM**: 7 books (Rework, Antifragile, Drive, Precis de meditations, Little Bets, Le sentiment meme de soi, The Organism, The Seven Arts of Change)
- **OPEN**: 12 books (Skin in the Game, Zero to One, Divining a Digital Future, Year of Dreaming Dangerously, Le point de bascule, Spreadable Media, Discours Rousseau, Hannah Arendt, Art of Game Design, hot text, FUTURETAINMENT, La guerre des yeux)
- **FREE**: 3 books (Who's Your City?, Le Satyricon, Bubbletecture)

## Technical Changes

### 1. `src/data/driftMonthlyDiscoveries.ts`
- Add 12 new month entries for 2022 (Jan-Dec) at the beginning of the `driftMonthlyDiscoveries` array, each with 3 books
- The archive grid on the landing page auto-renders from this array, so no other UI changes needed

### Files Modified

1. `src/data/driftMonthlyDiscoveries.ts` -- add 12 new 2022 month entries with 36 books
