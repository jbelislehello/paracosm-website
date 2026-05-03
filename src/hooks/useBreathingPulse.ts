import { useEffect, useRef, useState } from "react";

/**
 * Global slow breath pulse — returns a value in [0, 1] following a sine wave.
 * One shared rAF loop per consumer; respects prefers-reduced-motion.
 *
 * Period defaults to ~9.6s (close to a calm exhale-inhale cycle).
 */
export function useBreathingPulse(periodMs: number = 9600): number {
  const [value, setValue] = useState(0.5);
  const rafRef = useRef<number>();

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(0.5);
      return;
    }
    const tick = () => {
      const t = performance.now();
      const v = Math.sin((t / periodMs) * Math.PI * 2) * 0.5 + 0.5;
      setValue(v);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [periodMs]);

  return value;
}
