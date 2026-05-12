import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** -1 = moves opposite scroll, 0.5 = slow drift, 1 = locked */
  speed?: number;
  className?: string;
}

export default function ParallaxLayer({ children, speed = 0.3, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    let lastY = window.scrollY;
    const update = () => {
      raf = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      node.style.transform = `translate3d(0, ${(-center * speed * 0.15).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      lastY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
