

# Add 33 Books + Create Axis-Based Resource Libraries

## Part 1: Distribute 33 New Books (max 3 per month)

15 empty months remain (Oct-Dec 2023, Jan-Dec 2024). With 33 books and a 3-book max, here is the distribution:

| Month | Books |
|---|---|
| **Oct 2023** | Patrimoine mondial UNESCO / Living in the End Times (Zizek) / Dark Ecology (Morton) |
| **Nov 2023** | The Seven Day Circle (Zerubavel) / Damn Good Advice (Lois) / The 4-Hour Workweek (Ferriss) |
| **Dec 2023** | Bicycle Diaries (Byrne) / World War Z (Brooks) / Blood, Sweat, and Pixels (Schreier) |
| **Jan 2024** | The Language Animal (Taylor) / Out on the Wire (Abel) / Calvinic Magic (Van De Car) |
| **Feb 2024** | When (Pink) / Blink (Gladwell) / Less Than Nothing (Zizek) |
| **Mar 2024** | The Fractalist (Mandelbrot) / Cunningham's Encyclopedia of Magical Herbs / Precis de botanique |
| **Apr 2024** | A Forest of Kings (Schele & Freidel) / Revolte consommee (Heath & Potter) / Tribes (Godin) |
| **May 2024** | L'homme nomade (Attali) / Getting the Love You Want (Hendrix) / Dialogue and the Art of Thinking Together (Isaacs) |
| **Jun 2024** | Cibles / No Bad Parts (Schwartz) / The Creative Habit (Tharp) |
| **Jul 2024** | This Is Your Brain on Music (Levitin) / L'entrainement de l'esprit (Andre) |
| **Aug 2024** | Other Minds (Godfrey-Smith) / The Wisdom of Insecurity (Watts) |
| **Sep 2024** | Ready (Richo) / L'enneagramme |
| **Oct 2024** | (empty -- ready for future content) |
| **Nov 2024** | (empty) |
| **Dec 2024** | (empty) |

### Axis Assignments

- **LOVE**: Getting the Love You Want, No Bad Parts, This Is Your Brain on Music, L'entrainement de l'esprit, Ready
- **MAGIC**: Dark Ecology, Calvinic Magic, Cunningham's Encyclopedia, L'enneagramme, The Fractalist, Other Minds
- **CALM**: The Seven Day Circle, The 4-Hour Workweek, When, Blink, The Creative Habit, Precis de botanique, Dialogue and the Art of Thinking Together
- **OPEN**: Living in the End Times, Damn Good Advice, Blood Sweat and Pixels, The Language Animal, Less Than Nothing, Revolte consommee, Tribes, A Forest of Kings, Cibles
- **FREE**: Patrimoine mondial UNESCO, Bicycle Diaries, World War Z, Out on the Wire, L'homme nomade, The Wisdom of Insecurity

## Part 2: Resource Library Pages (one per axis)

Create a new route `/drift/library/:axis` (e.g., `/drift/library/love`) that aggregates all books across every month for a given axis. This gives each of the 5 Calm Magic forces its own curated library view.

### New file: `src/pages/DriftLibrary.tsx`

- Reads the `axis` param from the URL
- Filters all `driftMonthlyDiscoveries` entries to collect books (and future songs, videos, podcasts, articles) matching that axis
- Displays axis name, color, description (from `energeticAxes` in `gardens.ts`)
- Lists all resources grouped by type (books first, then videos, songs, podcasts, articles)
- Each book card shows title, author, description, category, and Amazon link

### Update: `src/pages/DriftLanding.tsx`

- Add a "Resource Libraries" section below the archive grid
- Show 5 cards (one per axis: LOVE, MAGIC, CALM, OPEN, FREE) with axis color, name, and book count
- Each card links to `/drift/library/:axis`

### Update: `src/App.tsx`

- Add route: `<Route path="/drift/library/:axis" element={<DriftLibrary />} />`

## Files to Create/Modify

1. **`src/data/driftMonthlyDiscoveries.ts`** -- Add book data to the 12 empty month entries (Oct 2023 - Sep 2024)
2. **`src/pages/DriftLibrary.tsx`** -- New page for axis-based resource library
3. **`src/pages/DriftLanding.tsx`** -- Add library section with 5 axis cards
4. **`src/App.tsx`** -- Add new route

