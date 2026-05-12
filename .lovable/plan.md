Restore the two lines I incorrectly removed in `src/pages/DesignSystemShowcase.tsx`:

1. Re-add the import on line 18:
   ```tsx
   import WhyItWorksRecap from "@/components/resonance/WhyItWorksRecap";
   ```
2. Re-add the render right after the `<header>` block (between line 30 `</header>` and the container div):
   ```tsx
   <WhyItWorksRecap lens="design-system" />
   ```

No other files change. The Book nav link added in the same turn stays in place (separate concern, not part of this revert).