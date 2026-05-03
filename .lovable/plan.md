## Automated Tests for Compass Keyboard Navigation

The previous plan to add keyboard navigation was interrupted before implementation, and the project has no test setup yet. This plan covers both: implement the keyboard handler (small, deterministic) and add a Vitest suite that exercises it.

### 1. Test infrastructure (new)

Add a minimal Vitest + Testing Library setup since none exists:

- `package.json` devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- `vitest.config.ts` — jsdom env, globals on, alias `@` → `src`, setup file.
- `src/test/setup.ts` — `@testing-library/jest-dom` import + `matchMedia` polyfill (needed by `usePrefersReducedMotion`).
- `tsconfig.app.json` — add `"vitest/globals"` to `compilerOptions.types`.

### 2. Implement keyboard handler in `ExperienceDotsVisualization.tsx`

Replace the wrapper at line 562 with a focusable container:

```tsx
<div
  className="relative outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
  tabIndex={0}
  role="group"
  aria-label="Freedom compass. Arrow keys focus axes; Enter/Space focus Freedom; Escape clears."
  data-testid="compass-keyboard-region"
  onKeyDown={(e) => {
    const map: Record<string, ActiveRegion> = {
      ArrowRight: 'sovereignty',
      ArrowDown: 'memory',
      ArrowLeft: 'intimacy',
      ArrowUp: 'novelty',
      Enter: 'freedom',
      ' ': 'freedom',
      Escape: null,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    setActiveRegion(map[e.key]);
  }}
>
```

The existing info panel already renders `REGION_COPY[activeRegion].label` with `role="status"` and `aria-live="polite"`, so it updates automatically.

### 3. Test suite

`src/components/calm-magic/components/__tests__/ExperienceDotsVisualization.keyboard.test.tsx`

Covers:

1. **ArrowRight → Sovereignty panel** — render, focus the compass region, press `ArrowRight`, assert the status panel contains "Sovereignty".
2. **ArrowDown / ArrowLeft / ArrowUp** — parameterized via `it.each`, asserts "Memory", "Intimacy", "Novelty" respectively.
3. **Enter and Space → Freedom** — both keys produce the Freedom label.
4. **Escape clears** — after pressing `ArrowRight` and seeing "Sovereignty", press `Escape` and assert the panel is no longer in the document (queryByRole `status` returns null, or the label text is gone).
5. **Unhandled keys are ignored** — pressing `Tab` or `a` does not change panel state.

Test pattern:

```tsx
const user = userEvent.setup();
render(<ExperienceDotsVisualization mode="personal" />);
const region = screen.getByTestId('compass-keyboard-region');
region.focus();
await user.keyboard('{ArrowRight}');
expect(screen.getByRole('status')).toHaveTextContent('Sovereignty');
await user.keyboard('{Escape}');
expect(screen.queryByRole('status')).toBeNull();
```

### 4. Out of scope

- No tests for arrow-tween animation (timing/RAF), GeometryHotspot rendering, or audio.
- No changes to the info panel, hotspots, or rotation logic.

### Files changed

- `package.json` (deps)
- `vitest.config.ts` (new)
- `src/test/setup.ts` (new)
- `tsconfig.app.json` (types)
- `src/components/calm-magic/components/ExperienceDotsVisualization.tsx` (keyboard handler on wrapper at line 562)
- `src/components/calm-magic/components/__tests__/ExperienceDotsVisualization.keyboard.test.tsx` (new)