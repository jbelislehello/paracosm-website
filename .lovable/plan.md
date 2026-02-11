

# Update Drift Dashboard Categories to MAGIC Compass

## What's Changing

The weekly dashboard section on the Drift landing page currently uses generic category labels (Tools, Ideas, Culture, Experiments, Interactions). These will be updated to match the MAGIC compass system from the Calm Magic framework: **Narrative, Workflow, Inquiry and Practices, Playgrounds, Human Dynamics and System Thinking**.

## Category Mapping

| MAGIC Letter | New Category | Previous Label | Energetic Axis |
|---|---|---|---|
| M | Narrative | Culture / Cultural Comment | LOVE (Aliveness) |
| A | Workflow | Tools | MAGIC (Spaciousness) |
| G | Inquiry and Practices | Ideas / Ideas and Books | CALM (Wholeness/Ground) |
| I | Playgrounds | Experiments | OPEN (Poiesis/Transformation) |
| C | Human Dynamics and System Thinking | Interactions / Emergence | FREE (Neurogenesis/Integration) |

## Changes

### File: `src/pages/DriftLanding.tsx`

Update the `dashboardSections` array (lines 27-33) to use the new MAGIC compass category names and updated descriptions:

```typescript
const dashboardSections = [
  { axis: energeticAxes[0], type: "Narrative", description: "Storytelling -- how discoveries become stories worth telling" },
  { axis: energeticAxes[1], type: "Workflow", description: "Process -- practical tools and instruments for daily practice" },
  { axis: energeticAxes[2], type: "Inquiry & Practices", description: "Questions and practices that open new understanding" },
  { axis: energeticAxes[3], type: "Playgrounds", description: "Experiments, prototypes, and bold attempts at transformation" },
  { axis: energeticAxes[4], type: "Human Dynamics & System Thinking", description: "How humans and systems interact, emerge, and evolve together" },
];
```

### No other files affected

The energeticAxes data (LOVE/MAGIC/CALM/OPEN/FREE) in `src/data/gardens.ts` stays unchanged -- the axes provide visual styling (colors, badges) while the new category names provide the conceptual framing.

