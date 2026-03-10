

# Add LinkedIn Newsletter Link to E-AI Event Card

## Change

Add a secondary link to the GL!TCH E-AI event card for the LinkedIn Calm Magic newsletter article. 

### File: `src/components/ParacosmEventsSection.tsx`

**Data model change (line 15-25):** Add an optional `secondaryLink` and `secondaryCta` field to the E-AI event object:
```ts
secondaryCta: "Read Newsletter Article",
secondaryLink: "https://www.linkedin.com/pulse/b%25C3%25A2tir-une-entreprise-apprenante-%25C3%25A0-l%25C3%25A8re-de-lia-jonathan-belisle-xxyue"
```

**Rendering change (around lines 150-175):** After the main CTA button, render the secondary link if present — a second outline button with a `BookOpen` icon (already imported but unused). Same styling as the primary CTA but always visible as a secondary action.

No new files or dependencies needed.

