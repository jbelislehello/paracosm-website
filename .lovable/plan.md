In `src/pages/DesignSystemShowcase.tsx`:

1. Change `<Tabs defaultValue="design-system" ...>` to `defaultValue="mental-models"` and update the grid from `grid-cols-3` to `grid-cols-2`.
2. Remove the `<TabsTrigger value="design-system">` (line 61).
3. Remove the entire `<TabsContent value="design-system">...</TabsContent>` block (lines 67–189), including the Venn diagram, Building Blocks accordion (color palette + typography), UI Patterns accordion, and Rules accordion.
4. Drop now-unused imports: `Palette`, `Layers`, `Type` from lucide-react; `designSystemColors`, `Accordion*`, `Card*`, `Badge`, `Progress`, `Button` if no longer referenced (verify after removal — `Brain`, `Map`, `ArrowLeft` stay).

Result: the Why It Works page shows only the **Models** and **Journey Map** tabs, defaulting to Models. The page title ("Design System & Journey Map") and intro paragraph (line 37–40) — should I also rename those, or leave them? I'll leave them as-is unless you say otherwise; this plan only touches the tab itself.