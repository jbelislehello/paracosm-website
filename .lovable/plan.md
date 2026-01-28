
# Glitch Session Timer Component

## Overview

Create a **GlitchSessionTimer** component that facilitates live 25-minute group sessions (5-20+ participants) through the GL!TCH → DRIFT → TUNE breath cycle. The component will provide visual phase indicators, countdown timers, facilitator prompts, and amplification techniques for larger groups.

## Session Structure (25 minutes total)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        25-MINUTE GLITCH SESSION                         │
├──────────────────┬────────────────────────┬────────────────────────────┤
│   GL!TCH (7min)  │     DRIFT (10min)      │       TUNE (6min)          │
│                  │                        │                            │
│  Sensing         │  Exploring             │  Crystallizing             │
│  the Field       │  Possibilities         │  Form                      │
├──────────────────┼────────────────────────┼────────────────────────────┤
│  - Harvest       │  - Small group         │  - Commitment              │
│    frictions     │    brainstorm          │    rounds                  │
│  - Pattern       │  - Wild guesses        │  - Weave narrative         │
│    spotting      │  - Somatic check-in    │  - Next steps              │
└──────────────────┴────────────────────────┴────────────────────────────┘
```

---

## Files to Create

### 1. Session Configuration Data
**File:** `src/data/glitchSessionConfig.ts`

Defines the session phases with:
- Phase IDs: 'glitch', 'drift', 'tune'
- Durations: 7 min, 10 min, 6 min
- Colors: Red, Purple, Emerald
- Facilitator prompts for each phase
- Amplification techniques for larger groups (10+)

### 2. Main Timer Component
**File:** `src/components/calm-magic/tools/GlitchSessionTimer.tsx`

**Features:**
- Large circular progress indicator with phase completion
- Current phase name with icon and color theming
- Time remaining display (MM:SS format)
- Visual pulse animation for facilitator pacing

**UI Sections:**
- **Phase Navigation Bar**: Shows all three phases with active highlighting
- **Facilitator Panel**: Phase-specific prompts that rotate, amplification suggestions
- **Control Bar**: Play/Pause, Reset, Skip Phase, Group Size selector
- **Notes Area**: Quick capture of session insights

**State Management:**
- Session status: idle, running, paused, complete
- Current phase index and time remaining
- Prompt cycling (every 90 seconds)
- Group size for amplification suggestions

---

## File to Modify

### InteractiveToolsPanel.tsx

**Changes:**
1. Import the new `GlitchSessionTimer` component
2. Update grid from `grid-cols-9` to `grid-cols-10`
3. Add new TabsTrigger: `value="session"` with label "Session Timer"
4. Add new TabsContent rendering `GlitchSessionTimer`
5. Add mapping in `toolTabMap`: `'GlitchSessionTimer': 'session'`

---

## Visual Design

### Color Theming by Phase
| Phase | Color Gradient | Icon |
|-------|---------------|------|
| GL!TCH | Red to Rose | Search icon |
| DRIFT | Purple to Indigo | Waves icon |
| TUNE | Emerald to Teal | Sparkles icon |

### Animations
- Pulsing outer ring synced to 4-second breath cycle
- Subtle scale animation on active phase
- Smooth gradient transitions between phases

### Responsive
- Full-width for desktop facilitator view
- Large typography for workshop visibility

---

## Facilitator Prompts

**GL!TCH Phase (7 min)**
- "What tensions or frictions are present in the room?"
- "What patterns are you noticing?"
- "Where is energy blocked or stuck?"
- "What's alive that wants attention?"

**DRIFT Phase (10 min)**
- "What wild guesses emerge?"
- "How might we approach this differently?"
- "What does your body sense about this?"
- "What connections are forming?"

**TUNE Phase (6 min)**
- "What's ready to commit to form?"
- "What's one concrete next step?"
- "How do we weave these threads together?"
- "What wants to be named?"

---

## Amplification Techniques (10+ participants)

- **Roving Mic Harvest**: Pass mic to capture glitches from crowd
- **Fishbowl Drift**: Inner circle explores, outer circle witnesses
- **Popcorn Commitments**: Random participants share commitments
- **Resonance Checks**: Quick hand-raise for agreement

---

## Technical Details

**Dependencies:** Uses existing UI components (Card, Button, Progress, Badge, Slider) and lucide-react icons

**Timer Logic:** useEffect with setInterval, handles phase transitions automatically with optional audio cues

**Group Size Options:** Small (5-9), Medium (10-15), Large (16+) - affects which amplification techniques are shown
