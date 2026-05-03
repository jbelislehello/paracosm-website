## Sync Freedom arrow to activeRegion in ExperienceDotsVisualization

Right now `arrowAngle` is driven only by autonomous rotation (or manual reset). When a user hovers/taps a force hotspot or legend card, `activeRegion` changes but the Freedom arrow ignores it. The plan is to ease the arrow toward the active axis whenever `activeRegion` is set, then resume free rotation (if enabled) when it clears.

### Behavior

- Each force maps to a target angle:
  - `sovereignty` → `0`
  - `memory` → `π/2`
  - `intimacy` → `π`
  - `novelty` → `3π/2`
  - `freedom` → no snap (it *is* the arrow)
  - `null` → no snap; resume normal rotation
- When `activeRegion` becomes a force axis:
  - **Reduced motion**: jump `arrowAngle` instantly to the target.
  - **Default**: ease toward the target via `requestAnimationFrame`, choosing the shortest angular path (handle the ±π wrap), with critically-damped feel (~280ms). Pause autonomous rotation while easing/locked.
- While `activeRegion` stays on a force axis, hold the arrow at that angle (don't drift).
- When `activeRegion` clears, resume autonomous rotation if `isRotating` is true (no snap-back).

### Implementation (`ExperienceDotsVisualization.tsx`)

1. Add a constant map `REGION_TARGET_ANGLE: Partial<Record<Exclude<ActiveRegion,null>, number>>` for the four axes.
2. Add a ref `lockedByRegionRef` (boolean) so the existing rotation effect can early-return while a region lock is active without changing its dependency list.
3. Modify the rotation `useEffect` (lines 122–138): only schedule the rAF loop when `isRotating && !lockedByRegionRef.current`.
4. Add a new `useEffect` keyed on `[activeRegion, prefersReducedMotion]`:
   - If `activeRegion` is null or `'freedom'`: clear the lock, allow rotation effect to resume.
   - Else compute `target = REGION_TARGET_ANGLE[activeRegion]`, set `lockedByRegionRef.current = true`, cancel any in-flight rotation rAF.
   - If `prefersReducedMotion`: `setArrowAngle(target)` and return.
   - Otherwise run a short rAF tween (~280ms, easeOutCubic) updating `arrowAngle` toward `target` along the shortest path: `delta = ((target - current + 3π) mod 2π) - π`.
   - Cleanup cancels the tween rAF.
5. When the lock releases and `isRotating` is true, the rotation effect re-runs naturally because we'll also bump it by toggling a small state — simplest approach: include `activeRegion` in the rotation effect's dep array and gate on `activeRegion === null || activeRegion === 'freedom'`. This avoids needing the ref entirely. Use this cleaner variant.

Final cleaner shape:

```ts
const REGION_TARGET_ANGLE = {
  sovereignty: 0,
  memory: Math.PI / 2,
  intimacy: Math.PI,
  novelty: (3 * Math.PI) / 2,
} as const;

const isLocked = activeRegion && activeRegion !== 'freedom';

// rotation effect: gate on !isLocked, add activeRegion to deps
useEffect(() => {
  if (!isRotating || isLocked) return;
  // ...existing rAF loop...
}, [isRotating, rotationSpeed, isLocked]);

// snap/ease effect
useEffect(() => {
  if (!isLocked) return;
  const target = REGION_TARGET_ANGLE[activeRegion as keyof typeof REGION_TARGET_ANGLE];
  if (prefersReducedMotion) { setArrowAngle(target); return; }
  const start = performance.now();
  const from = arrowAngleRef.current; // ref kept in sync with arrowAngle
  const delta = ((target - from + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  const dur = 280;
  let raf = 0;
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    setArrowAngle(((from + delta * eased) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [activeRegion, prefersReducedMotion]);
```

6. Add `arrowAngleRef` (a `useRef<number>` kept in sync via a tiny `useEffect` on `arrowAngle`) so the tween reads the current angle without re-firing on every frame.

### Files
- Modified: `src/components/calm-magic/components/ExperienceDotsVisualization.tsx`

No new files, no other components touched, no schema changes.