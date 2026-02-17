

# Add Smooth Scroll Animations and Entrance Transitions to the Tarot Page

## Overview

Each major section of the `/tarot` page will animate into view as the user scrolls, creating an immersive, progressive reveal effect using the Intersection Observer API.

## What Changes

### 1. New reusable hook: `useScrollReveal`

A custom hook wrapping `IntersectionObserver`. Returns a `ref` and a boolean `isVisible`. Once the element enters the viewport, `isVisible` flips to `true` permanently (one-shot reveal). Disconnects the observer after triggering.

### 2. New CSS keyframes in `src/index.css`

| Keyframe | Effect |
|----------|--------|
| `scroll-fade-up` | opacity 0 + translateY(30px) to full visibility, 0.7s ease-out |
| `scroll-slide-up` | opacity 0 + translateY(40px) + scale(0.97) to full visibility, 0.8s ease-out |

Both automatically respect the existing `prefers-reduced-motion` media query already in the stylesheet.

### 3. Section-by-section animations on the tarot page

| Section | Animation | Details |
|---------|-----------|---------|
| Hero | `scroll-fade-up` with staggered delays | Icon: 0ms, Title: 150ms, Subtitle: 300ms, Sub-text: 450ms |
| Draw buttons | `scroll-fade-up` | Single reveal when scrolled into view |
| Drawn cards | Unchanged | Already use `animate-fade-in` with stagger |
| Tabs section | `scroll-slide-up` | Subtle scale + slide for heavier content block |
| Footer | `scroll-fade-up` | Gentle fade in |

Elements start as `opacity-0` and receive their animation class when `isVisible` becomes true.

## Technical Details

### New File

| File | Purpose |
|------|---------|
| `src/hooks/useScrollReveal.ts` | Custom hook with configurable `threshold` (default 0.15) and `rootMargin`. Returns `{ ref, isVisible }`. |

### Modified Files

| File | Changes |
|------|---------|
| `src/index.css` | Add two `@keyframes` blocks and two utility classes (`.animate-scroll-fade-up`, `.animate-scroll-slide-up`) |
| `src/pages/EntrepreneurialTarot.tsx` | Import `useScrollReveal`. Create one instance per section (hero, draw, tabs). Conditionally apply animation classes. Hero sub-elements get individual `animation-delay` inline styles and start with `opacity-0` until visible. |

### Hook implementation

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

### CSS additions

```text
@keyframes scroll-fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scroll-slide-up {
  from { opacity: 0; transform: translateY(40px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-scroll-fade-up {
  animation: scroll-fade-up 0.7s ease-out forwards;
}

.animate-scroll-slide-up {
  animation: scroll-slide-up 0.8s ease-out forwards;
}
```

### Page integration pattern

Each section wraps its content in a div using the hook:

```text
const heroReveal = useScrollReveal();
const drawReveal = useScrollReveal();
const tabsReveal = useScrollReveal({ threshold: 0.1 });

// Hero section
<section ref={heroReveal.ref}>
  <div className={heroReveal.isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}
       style={{ animationDelay: '0ms' }}>
    ...icon...
  </div>
  <div className={heroReveal.isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}
       style={{ animationDelay: '150ms' }}>
    ...title...
  </div>
  // etc.
</section>

// Tabs section uses slide-up variant
<section ref={tabsReveal.ref}
         className={tabsReveal.isVisible ? 'animate-scroll-slide-up' : 'opacity-0'}>
  ...tabs...
</section>
```

