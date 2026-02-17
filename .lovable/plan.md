

# Add Smooth Scroll Animations and Entrance Transitions to the Tarot Page

## Overview

Each major section of the `/tarot` page will animate into view as the user scrolls, creating an immersive, progressive reveal effect. This uses the Intersection Observer API for performant, scroll-triggered animations.

## What Changes

### 1. Reusable scroll-reveal hook

A small custom hook `useScrollReveal` wraps `IntersectionObserver`. It returns a ref and a boolean `isVisible`. When the element enters the viewport (with a configurable threshold), `isVisible` flips to `true` and stays true (one-shot reveal).

### 2. Entrance animations on each section

| Section | Animation |
|---------|-----------|
| Hero (icon, title, subtitle) | Fade up with staggered delays (icon first, then title, then text) |
| Draw buttons | Fade up when scrolled into view |
| Drawn cards | Already have `animate-fade-in` with staggered delays -- kept as-is |
| Tabs section (Constellation / Browser / Legend) | Slide up from below with a slight scale |
| Footer | Gentle fade in |

### 3. New CSS keyframes

- `scroll-fade-up`: opacity 0 + translateY(30px) to opacity 1 + translateY(0), 0.7s ease-out
- `scroll-slide-up`: opacity 0 + translateY(40px) + scale(0.97) to opacity 1 + translateY(0) + scale(1), 0.8s ease-out

These respect `prefers-reduced-motion` via the existing media query that disables animations.

## Technical Details

### New File

| File | Purpose |
|------|---------|
| `src/hooks/useScrollReveal.ts` | Custom hook: creates an IntersectionObserver, returns `{ ref, isVisible }`. Options for `threshold` (default 0.15) and `rootMargin`. Disconnects after first trigger. |

### Modified Files

| File | Changes |
|------|---------|
| `src/index.css` | Add `@keyframes scroll-fade-up` and `scroll-slide-up`, plus `.animate-scroll-fade-up` and `.animate-scroll-slide-up` utility classes |
| `src/pages/EntrepreneurialTarot.tsx` | Wrap each section (`<section>`) in a div that uses `useScrollReveal`. Apply the animation class conditionally: `className={isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}`. Hero sub-elements get staggered `animation-delay`. Tabs section uses the slide-up variant. |

### Hook implementation sketch

```text
function useScrollReveal(options?) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.15, ...options })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
```

### Stagger pattern for hero

- Sparkles icon: delay 0ms
- Title: delay 150ms
- Subtitle: delay 300ms
- Sub-text: delay 450ms

Each uses `animate-scroll-fade-up` with `animation-delay` and starts as `opacity-0` until visible.

