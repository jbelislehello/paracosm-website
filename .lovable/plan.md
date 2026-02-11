

# Add Tonalli Initiative Section to GL!TCH Methodology Page

## Overview

A new "Tonalli Initiative" section will be added to the GL!TCH Methodology page, positioned between the "Session Formats" section and the existing CTA. It will present Tonalli as an R&D branch of Paracosm -- a presence-first creative OS with two branches (Voice and Spatial) and three educational design platforms.

## Section Structure

### 1. Tonalli Header
- Tagline: "Tonalli turns expression into an interface -- voice and presence become the controller for learning, ideation, and generative storytelling."
- Badge linking to the Medium publication (medium.com/noemtoys)
- Warm amber/orange gradient styling consistent with Paracosm branding

### 2. Two Branch Cards (side by side)

**Tonalli Voice** (left card, rose/violet accent)
- Audio-first interactive medium where speaking becomes a way to "conduct" an experience
- Use cases: Brainstorming & ideation, Writing/story prototyping, Workshops & group creativity, Learning-by-speaking

**Tonalli Spatial** (right card, cyan/teal accent)
- Camera-vision / projection-based interactive lamp
- Setup: camera vision + pico projector, designed for schools/museums/homes
- Use cases: Interactive storytelling in a room, Playful learning environments, Museum/school installations, "Walkable" scenes

### 3. Educational Design Platforms (3 cards)

Three platform cards matching the Medium publication topics:

| Platform | Description | Medium Topic Link |
|----------|-------------|-------------------|
| **Sensory Rooms** | Immersive spatial experiences for sensory learning | medium.com/noemtoys (Sensory Rooms topic) |
| **Cognitive Toys** | Tangible computing toys for embodied cognition | medium.com/noemtoys (Tangible Play topic) |
| **Expressivity** | Wearables and embodied interaction for creative expression | medium.com/noemtoys (Embodied Cognition topic) |

### 4. Medium Publication Link
- "Read our research" link to medium.com/noemtoys with an external link icon
- Subtle R&D branch of Paracosm attribution

## Technical Details

### File: `src/pages/GlitchMethodology.tsx`

- Add new section (~80 lines) between the Session Formats section (ends at line 261) and the CTA section (starts at line 263)
- Import additional icons: `Mic`, `Eye`, `ExternalLink`, `Lightbulb`, `Box`, `Palette` from lucide-react
- Use the same dark theme styling (slate-900/800 backgrounds, white/opacity text) consistent with the rest of the page
- Platform cards link to corresponding Medium publication topic pages
- No new components or files needed -- all inline in the existing page

### Visual Design
- Branch cards use glowing border accents (rose for Voice, cyan for Spatial) matching existing card patterns
- Platform cards are smaller, in a 3-column grid with distinct icon colors
- Medium publication link styled as a subtle pill badge at the top of the section

