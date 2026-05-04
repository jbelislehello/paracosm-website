## Add shimmer to RecentDreams skeletons

1. **`src/index.css`**: add a reusable shimmer utility that overlays a moving highlight on top of any skeleton via `::after`:
   ```css
   @keyframes skeleton-shimmer {
     0% { transform: translateX(-100%); }
     100% { transform: translateX(100%); }
   }
   .skeleton-shimmer {
     position: relative;
     overflow: hidden;
     isolation: isolate;
   }
   .skeleton-shimmer::after {
     content: '';
     position: absolute;
     inset: 0;
     background: linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.06), transparent);
     animation: skeleton-shimmer 1.8s ease-in-out infinite;
   }
   ```
   Uses semantic token `--foreground` for theme-correct contrast in light/dark.

2. **`src/components/calm-magic/dream/RecentDreams.tsx`**: append `skeleton-shimmer` to each `Skeleton` in the loading branch (keeps the existing subtle `animate-pulse` underneath for layered effect).

No other changes.