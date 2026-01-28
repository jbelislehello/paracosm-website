
# Glitch Session Timer Component

## Overview

Create a **GlitchSessionTimer** component that facilitates live 25-minute group sessions (5-20+ participants) through the GL!TCH → DRIFT → TUNE breath cycle. The component will provide visual phase indicators, countdown timers, facilitator prompts, and amplification techniques for larger groups.

## Component Location

```text
src/components/calm-magic/tools/GlitchSessionTimer.tsx
```

## Session Structure (25 minutes total)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        25-MINUTE GLITCH SESSION                         │
├──────────────────┬────────────────────────┬────────────────────────────┤
│   GL!TCH (7min)  │     DRIFT (10min)      │       TUNE (6min)          │
│                  │                        │                            │
│  🔍 Sensing      │  🌊 Exploring          │  ✨ Crystallizing          │
│  the Field       │  Possibilities         │  Form                      │
├──────────────────┼────────────────────────┼────────────────────────────┤
│  • Harvest       │  • Small group         │  • Commitment              │
│    frictions     │    brainstorm          │    rounds                  │
│  • Pattern       │  • Wild guesses        │  • Weave narrative         │
│    spotting      │  • Somatic check-in    │  • Next steps              │
└──────────────────┴────────────────────────┴────────────────────────────┘
```

## Integration Point

Add as a new tab in `InteractiveToolsPanel.tsx`:
- Tab label: "⏱️ Session Timer"
- New `TabsTrigger` with `value="session"`
- New `TabsContent` rendering `GlitchSessionTimer`

---

## Technical Implementation

### Data Structure

```typescript
interface SessionPhase {
  id: 'glitch' | 'drift' | 'tune';
  name: string;
  duration: number; // seconds
  color: string;
  icon: string;
  facilitatorPrompts: string[];
  participantPrompts: string[];
  amplificationTechniques: string[];
}

type SessionStatus = 'idle' | 'running' | 'paused' | 'complete';
```

### Phase Configuration

| Phase   | Duration | Color   | Icon |
|---------|----------|---------|------|
| GL!TCH  | 7 min    | Red     | 🔍   |
| DRIFT   | 10 min   | Purple  | 🌊   |
| TUNE    | 6 min    | Emerald | ✨   |

### Facilitator Prompts by Phase

**GL!TCH — Sensing the Field (7 min)**
- "What tensions or frictions are present in the room?"
- "What patterns are you noticing?"
- "Where is energy blocked or stuck?"
- "What's alive that wants attention?"

**DRIFT — Dancing with Possibility (10 min)**
- "What wild guesses emerge?"
- "How might we approach this differently?"
- "What does your body sense about this?"
- "What connections are forming?"

**TUNE — Crystallizing Form (6 min)**
- "What's ready to commit to form?"
- "What's one concrete next step?"
- "How do we weave these threads together?"
- "What wants to be named?"

### Amplification Techniques (for 10+ participants)

- **Roving Mic Harvest**: Pass mic to capture 3-5 glitches from crowd
- **Fishbowl Drift**: Inner circle explores while outer circle witnesses
- **Popcorn Commitments**: Random participants share TUNE commitments
- **Resonance Checks**: Quick hand-raise for agreement/energy

---

## UI Components

### Main Timer Display
- Large circular progress indicator showing phase completion
- Current phase name with icon and color theming
- Time remaining in MM:SS format (phase + total)
- Visual pulse animation synchronized with facilitator "breath" pacing

### Phase Navigation Bar
- Horizontal progress bar showing all three phases
- Active phase highlighted with glow effect
- Completed phases show checkmark
- Click to jump between phases (facilitator control)

### Facilitator Panel (collapsible)
- Current phase-specific prompts (rotates every 90 seconds)
- Amplification technique suggestions for current phase
- "Next Prompt" button to cycle through prompts manually
- Quick notes textarea for capturing key insights

### Control Bar
- Play/Pause button
- Reset Session button
- Skip to Next Phase button
- Group size indicator (affects amplification suggestions)

### Audio Cues (optional)
- Gentle chime at phase transitions
- Soft bell at 1-minute warning
- Completion tone at session end

---

## State Management

```typescript
// Core timer state
const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
const [timeRemaining, setTimeRemaining] = useState(0);
const [totalTimeRemaining, setTotalTimeRemaining] = useState(25 * 60);

// Facilitator state
const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
const [groupSize, setGroupSize] = useState<'small' | 'medium' | 'large'>('medium');
const [sessionNotes, setSessionNotes] = useState('');

// Timer logic with useEffect + setInterval
```

---

## Visual Design

### Color Theming by Phase
- **GL!TCH**: Red/Rose gradient (`from-red-500 to-rose-600`)
- **DRIFT**: Purple/Indigo gradient (`from-purple-500 to-indigo-600`)  
- **TUNE**: Emerald/Teal gradient (`from-emerald-500 to-teal-600`)

### Breathing Animation
- Pulsing outer ring synced to 4-second breath cycle
- Subtle scale animation on active phase indicator
- Gradient transitions between phases

### Responsive Layout
- Full-width for desktop facilitator view
- Compact mobile view for participant reference
- Large type for visibility in workshop settings

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/calm-magic/tools/GlitchSessionTimer.tsx` | **CREATE** - Main timer component |
| `src/components/calm-magic/tools/InteractiveToolsPanel.tsx` | **MODIFY** - Add new tab |
| `src/data/glitchSessionConfig.ts` | **CREATE** - Phase configuration and prompts |

---

## Component Dependencies

- Existing UI components: `Card`, `CardHeader`, `CardContent`, `Button`, `Progress`, `Badge`, `Slider`
- Icons from `lucide-react`: `Play`, `Pause`, `SkipForward`, `RotateCcw`, `Users`, `Volume2`, `VolumeX`
- Timer pattern from `MeditationMode.tsx` and `CompilationProgressToast.tsx`
- Mode-aware content from `modeAwareContent.ts` for terminology adaptation
