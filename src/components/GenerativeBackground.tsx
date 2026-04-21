import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const GenerativeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current || p5Ref.current) return;

    const sketch = (p: p5) => {
      const particles: Array<{
        x: number; y: number; vx: number; vy: number;
        size: number; hue: number; life: number;
      }> = [];
      const PARTICLE_COUNT = 80;
      let noiseScale = 0.003;
      let scrollOffset = 0;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        canvas.style('pointer-events', 'none');
        p.colorMode(p.HSB, 360, 100, 100, 100);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            vx: 0, vy: 0,
            size: p.random(1.5, 4),
            hue: p.random(220, 290), // blue-purple range
            life: p.random(100, 300),
          });
        }
      };

      p.draw = () => {
        p.clear();
        scrollOffset = window.scrollY * 0.0005;
        const time = p.frameCount * 0.005;

        for (const particle of particles) {
          const angle = p.noise(
            particle.x * noiseScale,
            particle.y * noiseScale,
            time + scrollOffset
          ) * p.TWO_PI * 2;

          particle.vx = p.cos(angle) * 0.4;
          particle.vy = p.sin(angle) * 0.4;
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life--;

          if (particle.life <= 0 || particle.x < -20 || particle.x > p.width + 20 ||
              particle.y < -20 || particle.y > p.height + 20) {
            particle.x = p.random(p.width);
            particle.y = p.random(p.height);
            particle.life = p.random(100, 300);
            particle.hue = p.random(220, 290);
          }

          const alpha = p.map(particle.life, 0, 300, 0, 12);
          p.noStroke();
          p.fill(particle.hue, 40, 80, alpha);
          p.ellipse(particle.x, particle.y, particle.size);

          // Trailing glow
          p.fill(particle.hue, 30, 90, alpha * 0.3);
          p.ellipse(particle.x, particle.y, particle.size * 3);
        }

        // Draw subtle connection lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const d = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            if (d < 120) {
              const lineAlpha = p.map(d, 0, 120, 4, 0);
              p.stroke(260, 30, 80, lineAlpha);
              p.strokeWeight(0.5);
              p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            }
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }} />;
};

export default GenerativeBackground;
