

# Integrate paracosm.life Content into Your Current Site

## What We Found on paracosm.life

The WordPress site has rich content that your Lovable app is currently missing:

1. **7 detailed service offerings** (Ontological Maps, Poetry Retreats, AI Residencies, Expansive Leadership, Chief AI Officer on Demand, Prototypes to Think, Keynotes, Training)
2. **8 types of AI Assistants** you create (Personal Consigliere, Executive AI, Documentation, Learning, Risk, Data Quality, Research, Experience Design)
3. **Notable client logos** (Behaviour Interactive, Canadian Museum for Human Rights, OACIQ, INIS, NFB/ONF, Prodago, Sid Lee, FoST, Loto-Quebec, Quartier de l'Innovation)
4. **Keynote venue logos** (NFB, Annenberg, Banff, Infopresse, Phi Centre, SXSW, TEDx, TIFF, Telefilm, Creative Mornings)
5. **Tagline**: "Connecting ideas and helping humans feel the future"

## Integration Strategy

Rather than duplicating the whole WordPress site, we add **two new sections** to the landing page that bring in the missing high-value content, plus update the hero tagline.

### 1. New Component: `ServicesShowcase.tsx`
A clean services grid showing all 7 service offerings + the 8 AI assistant types in a tabbed layout:
- **Tab 1: "Services"** -- card grid with icon, title, and one-liner for each of the 7 services
- **Tab 2: "AI Assistants We Build"** -- card grid for the 8 assistant types
- CTA button linking to contact

### 2. New Component: `SocialProofSection.tsx`
A "Trust" section combining:
- **Client logos** in a scrolling marquee or responsive grid (using text names as placeholders since we can't hotlink their images)
- **Keynote venues** in a second row
- The tagline "Connecting ideas and helping humans feel the future" as a section quote

### 3. Landing Page Updates
- Add ServicesShowcase between the Calm Magic Board section and the Universe section
- Add SocialProofSection between CoachingApproach and TransformationJourney
- Update hero subtitle to incorporate the paracosm.life tagline

## Files to Create
- `src/components/ServicesShowcase.tsx`
- `src/components/SocialProofSection.tsx`

## Files to Modify
- `src/pages/LandingPage.tsx` -- import and place the two new sections

## Technical Details

### ServicesShowcase
- Uses existing `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from shadcn
- Lucide icons for each service (Brain, Mountain, Cpu, Compass, UserCog, Wrench, Mic, GraduationCap)
- Cards using existing styling patterns (white/70 backdrop-blur, rounded-2xl, border)

### SocialProofSection
- Two rows of client/venue names in styled badges or minimal cards
- Responsive grid (3-4 cols on mobile, 5-6 on desktop)
- Gradient text quote in the center
- No external image hotlinking -- uses text-based logo placeholders with the org names

### Content Source
All text comes directly from paracosm.life, lightly edited for consistency with the existing site tone. Service descriptions, assistant types, and client names are hardcoded as data arrays in each component.

