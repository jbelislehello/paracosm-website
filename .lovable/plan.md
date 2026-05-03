# Sync hotspots + activeRegion on ExperienceDotsVisualization

The Torus pattern (`GeometryHotspot` + lifted `activeRegion` + animated highlight) is already wired into `TorusRelationnel` and `TorusEnergyField`. Their direct sibling under `EnhancedTorusEnergyField` — `ExperienceDotsVisualization` ("Experience Paths" tab) — has no hotspots or plain-language explanations. It's the next Torus-related visualization missing the pattern.

The four force axes (Sovereignty / Memory / Intimacy / Novelty) and the center Freedom node are the natural semantic regions.

## Changes

**`src/components/calm-magic/components/ExperienceDotsVisualization.tsx`**

1. Import `GeometryHotspot` and `usePrefersReducedMotion`.
2. Add `type ActiveRegion = 'sovereignty' | 'memory' | 'intimacy' | 'novelty' | 'freedom' | null` and `const [activeRegion, setActiveRegion] = useState<ActiveRegion>(null)`.
3. Wrap the SVG in a `relative` container; overlay 5 `GeometryHotspot`s positioned via percentages over the four cardinal labels and the center Freedom point. Each emits `onActiveChange` to set/clear `activeRegion`.
4. Hotspot copy (plain language): Sovereignty = agency, Memory = continuity, Intimacy = closeness, Novelty = openness, Freedom = the sweeping attention arrow.
5. React to `activeRegion` inside the SVG:
   - The matching axis's three ring dots scale up (1.0 → 1.18) with a soft halo (blurred duplicate circle, opacity 0.45). Halo + scale gated by `usePrefersReducedMotion` — falls back to opacity bump only.
   - A faint dashed radial spoke from center through that axis becomes visible while active, anchoring the explanation visually.
   - The corresponding cardinal label text gains weight + ring style.
   - When `activeRegion === 'freedom'`, the center pivot pulses and the dashed reach circle brightens.
6. Two-way sync: hovering a card in the bottom "Calm Magic Forces" legend grid sets `activeRegion`, and matching legend cards get a ring style when their region is active from any source.
7. All transitions use `transition-all duration-220 ease-out` to match `TorusRelationnel` / `TorusEnergyField`.
8. Existing rotation, placement, connection, and audio logic remain untouched.

## Technical notes
- Hotspot positions derive from `centerX`, `centerY`, and each cardinal angle so they remain aligned.
- No changes needed to `GeometryHotspot.tsx` or `usePrefersReducedMotion.ts` — current API supports this.
- No new files, no schema changes, no impact on other consumers of `EnhancedTorusEnergyField`.

## Files
- Modified: `src/components/calm-magic/components/ExperienceDotsVisualization.tsx`
