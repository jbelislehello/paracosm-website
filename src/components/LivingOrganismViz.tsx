import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const AXES = [
  { label: 'LOVE', hue: 346, freq: 0.8 },
  { label: 'MAGIC', hue: 270, freq: 1.2 },
  { label: 'CALM', hue: 210, freq: 0.5 },
  { label: 'OPEN', hue: 142, freq: 0.9 },
  { label: 'FREE', hue: 45, freq: 1.5 },
];

const LivingOrganismViz: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current || p5Ref.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(400, 400);
        canvas.style('display', 'block');
        p.colorMode(p.HSB, 360, 100, 100, 100);
      };

      p.draw = () => {
        p.clear();
        const cx = p.width / 2;
        const cy = p.height / 2;
        const time = p.frameCount * 0.02;

        // Draw interconnected organism
        for (let i = 0; i < AXES.length; i++) {
          const axis = AXES[i];
          const angle = (i / AXES.length) * p.TWO_PI - p.HALF_PI;
          const breathe = p.sin(time * axis.freq) * 0.15 + 1;
          const baseRadius = 80 * breathe;

          // Organic tendril from center
          p.noFill();
          p.strokeWeight(2);
          const steps = 30;
          for (let s = 0; s < steps; s++) {
            const t = s / steps;
            const r = baseRadius * t;
            const wobble = p.noise(i, s * 0.1, time * 0.5) * 20 - 10;
            const x = cx + p.cos(angle + wobble * 0.01) * r;
            const y = cy + p.sin(angle + wobble * 0.01) * r;
            const alpha = p.map(t, 0, 1, 5, 25);
            p.stroke(axis.hue, 50, 85, alpha);
            p.ellipse(x, y, 8 + wobble * 0.5, 8 + wobble * 0.5);
          }

          // Pulsing node at end
          const endX = cx + p.cos(angle) * baseRadius;
          const endY = cy + p.sin(angle) * baseRadius;
          const pulseSize = 12 + p.sin(time * axis.freq * 2) * 4;

          p.fill(axis.hue, 40, 90, 30);
          p.noStroke();
          p.ellipse(endX, endY, pulseSize * 2.5);
          p.fill(axis.hue, 50, 85, 50);
          p.ellipse(endX, endY, pulseSize);

          // Connection lines between adjacent axes
          const nextIdx = (i + 1) % AXES.length;
          const nextAngle = (nextIdx / AXES.length) * p.TWO_PI - p.HALF_PI;
          const nextBreathe = p.sin(time * AXES[nextIdx].freq) * 0.15 + 1;
          const nextR = 80 * nextBreathe;
          const nextX = cx + p.cos(nextAngle) * nextR;
          const nextY = cy + p.sin(nextAngle) * nextR;

          p.stroke(axis.hue, 30, 80, 8);
          p.strokeWeight(1);
          p.line(endX, endY, nextX, nextY);
        }

        // Central heartbeat
        const heartbeat = p.sin(time * 1.5) * 0.3 + 1;
        p.noStroke();
        p.fill(300, 30, 90, 8);
        p.ellipse(cx, cy, 40 * heartbeat);
        p.fill(300, 40, 95, 15);
        p.ellipse(cx, cy, 20 * heartbeat);
      };

      p.windowResized = () => {
        if (containerRef.current) {
          const w = Math.min(containerRef.current.clientWidth, 400);
          p.resizeCanvas(w, w);
        }
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center items-center w-full max-w-[400px] mx-auto opacity-80" />
  );
};

export default LivingOrganismViz;
