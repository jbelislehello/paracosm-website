import { useEffect, useState } from 'react';

export function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getParallaxStyle = (speed: number = 0.3, offset: number = 0) => ({
    transform: `translateY(${(scrollY - offset) * speed}px)`,
    willChange: 'transform' as const,
  });

  return { scrollY, getParallaxStyle };
}
