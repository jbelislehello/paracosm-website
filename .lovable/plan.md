
# Add Multi-Card Picker for Constellation Cells

## What It Does

When a constellation grid cell contains 2 or more cards, clicking it opens a small popover menu listing all cards in that cell. Users can then pick which card to view. Single-card cells continue to select the card directly on click.

## How It Works

Currently, line 99 only handles single-card cells: `onClick={() => cards.length === 1 && onCardSelect(cards[0])}`. Multi-card cells are clickable but do nothing.

The fix uses the existing Radix Popover component (already installed) to show a compact picker anchored to the cell.

## Technical Details

### File Modified

| File | Changes |
|------|---------|
| `src/components/tarot/ConstellationView.tsx` | Add Popover-based picker for multi-card cells |

### Changes

1. **Import Popover** from `@/components/ui/popover` alongside existing Tooltip imports

2. **Add state** for tracking which cell's popover is open:
   ```text
   const [openPickerKey, setOpenPickerKey] = useState<string | null>(null);
   ```

3. **Wrap multi-card cells** in a `Popover` with `PopoverTrigger` on the existing button. Single-card cells keep their direct `onClick` behavior unchanged.

4. **PopoverContent** renders a compact list of cards in that cell, each as a clickable row showing card name and question. Clicking a row calls `onCardSelect(card)` and closes the popover.

5. **Styling**: The popover uses `bg-slate-900/95 border-slate-700 backdrop-blur-xl` to match the existing tooltip aesthetic, with hover highlights on each card row and a high z-index for visibility.

### Picker layout (per card row)

```text
+-----------------------------------+
| [color dot]  Card Name            |
|              "Core question?"     |
+-----------------------------------+
| [color dot]  Card Name            |
|              "Core question?"     |
+-----------------------------------+
```

Each row is a button. Clicking it selects that card and closes the picker.

### Click behavior summary

| Cell type | Current behavior | New behavior |
|-----------|-----------------|--------------|
| 0 cards | No action | No action (unchanged) |
| 1 card | Selects card directly | Unchanged |
| 2+ cards | Nothing happens | Opens popover picker |
