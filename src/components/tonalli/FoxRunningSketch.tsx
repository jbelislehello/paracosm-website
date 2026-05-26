import { useEffect, useRef } from 'react';
import p5 from 'p5';

/**
 * Tonalli — Wuxia the Fox running through the fields.
 * A p5.js generative scene: parallax grass fields, drifting sun,
 * floating pollen, and a stylized fox in a gallop cycle.
 */
const FoxRunningSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let w = 0;
      let h = 0;
      let t = 0;

      type Blade = { x: number; baseY: number; height: number; sway: number; shade: number; layer: number };
      type Pollen = { x: number; y: number; r: number; vy: number; vx: number; hue: number };
      type Cloud = { x: number; y: number; r: number; speed: number };

      const blades: Blade[] = [];
      const pollen: Pollen[] = [];
      const clouds: Cloud[] = [];

      const seedScene = () => {
        blades.length = 0;
        pollen.length = 0;
        clouds.length = 0;

        // 3 parallax grass layers
        for (let layer = 0; layer < 3; layer++) {
          const density = layer === 0 ? 220 : layer === 1 ? 160 : 110;
          const baseY = h * (0.72 + layer * 0.07);
          for (let i = 0; i < density; i++) {
            blades.push({
              x: p.random(-40, w + 40),
              baseY: baseY + p.random(-8, 12),
              height: p.random(10, 26) + layer * 6,
              sway: p.random(0.4, 1.4),
              shade: p.random(0, 1),
              layer,
            });
          }
        }

        for (let i = 0; i < 60; i++) {
          pollen.push({
            x: p.random(w),
            y: p.random(h * 0.2, h * 0.9),
            r: p.random(1.2, 3),
            vy: p.random(-0.25, -0.05),
            vx: p.random(-0.2, 0.2),
            hue: p.random(38, 52),
          });
        }

        for (let i = 0; i < 5; i++) {
          clouds.push({
            x: p.random(w),
            y: p.random(h * 0.08, h * 0.3),
            r: p.random(50, 120),
            speed: p.random(0.05, 0.2),
          });
        }
      };

      const resize = () => {
        const rect = containerRef.current!.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        p.resizeCanvas(w, h);
        seedScene();
      };

      p.setup = () => {
        const rect = containerRef.current!.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        const c = p.createCanvas(w, h);
        c.parent(containerRef.current!);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        seedScene();
      };

      const drawSky = () => {
        // Warm dusk gradient
        for (let y = 0; y < h * 0.78; y++) {
          const k = y / (h * 0.78);
          const hue = p.lerp(28, 260, k * 0.6 + 0.05);
          const sat = p.lerp(55, 35, k);
          const bri = p.lerp(95, 38, k);
          p.stroke(hue, sat, bri);
          p.line(0, y, w, y);
        }
      };

      const drawSun = () => {
        const sx = w * 0.78;
        const sy = h * 0.32 + Math.sin(t * 0.4) * 4;
        for (let i = 8; i > 0; i--) {
          p.noStroke();
          p.fill(40, 70, 100, 0.05 * i);
          p.circle(sx, sy, 60 + i * 14);
        }
        p.fill(45, 30, 100, 1);
        p.circle(sx, sy, 60);
      };

      const drawClouds = () => {
        p.noStroke();
        clouds.forEach((c) => {
          c.x += c.speed;
          if (c.x - c.r > w) c.x = -c.r;
          for (let i = 0; i < 5; i++) {
            p.fill(30, 18, 100, 0.18);
            p.ellipse(c.x + i * c.r * 0.3, c.y + Math.sin(i) * 4, c.r, c.r * 0.55);
          }
        });
      };

      const drawHills = () => {
        // Distant hill
        p.noStroke();
        p.fill(150, 30, 55);
        p.beginShape();
        p.vertex(0, h * 0.7);
        for (let x = 0; x <= w; x += 14) {
          const y = h * 0.7 + Math.sin(x * 0.008 + 1) * 18 - 30;
          p.vertex(x, y);
        }
        p.vertex(w, h);
        p.vertex(0, h);
        p.endShape(p.CLOSE);

        // Mid field
        p.fill(95, 45, 48);
        p.beginShape();
        p.vertex(0, h * 0.78);
        for (let x = 0; x <= w; x += 12) {
          const y = h * 0.78 + Math.sin(x * 0.012 + 2) * 10;
          p.vertex(x, y);
        }
        p.vertex(w, h);
        p.vertex(0, h);
        p.endShape(p.CLOSE);
      };

      const drawGrass = () => {
        blades.forEach((b) => {
          const wind = Math.sin(t * 2 + b.x * 0.02) * b.sway;
          const layerHue = 80 - b.layer * 12;
          const sat = 55 + b.layer * 5;
          const bri = 35 + b.layer * 15 + b.shade * 10;
          p.stroke(layerHue, sat, bri);
          p.strokeWeight(1 + b.layer * 0.4);
          p.noFill();
          p.line(b.x, b.baseY, b.x + wind, b.baseY - b.height);
        });
      };

      const drawPollen = () => {
        p.noStroke();
        pollen.forEach((s) => {
          s.x += s.vx + Math.sin(t + s.y * 0.01) * 0.3;
          s.y += s.vy;
          if (s.y < -10) {
            s.y = h + 10;
            s.x = p.random(w);
          }
          if (s.x < -10) s.x = w + 10;
          if (s.x > w + 10) s.x = -10;
          p.fill(s.hue, 60, 100, 0.5);
          p.circle(s.x, s.y, s.r * 3);
          p.fill(s.hue, 30, 100, 1);
          p.circle(s.x, s.y, s.r);
        });
      };

      const drawFox = (cx: number, cy: number, scale: number, phase: number) => {
        p.push();
        p.translate(cx, cy);
        p.scale(scale);

        // Gallop bob
        const bob = Math.sin(phase * 2) * 2.5;
        p.translate(0, bob);

        // Tail
        const tailSway = Math.sin(phase + 1) * 0.4;
        p.push();
        p.translate(-30, -6);
        p.rotate(-0.5 + tailSway);
        p.noStroke();
        p.fill(18, 75, 88);
        p.ellipse(0, 0, 36, 14);
        p.fill(0, 0, 100);
        p.ellipse(10, 2, 14, 8);
        p.pop();

        // Body
        p.noStroke();
        p.fill(18, 80, 92);
        p.ellipse(0, 0, 56, 26);

        // Belly
        p.fill(35, 25, 100);
        p.ellipse(2, 6, 42, 14);

        // Back legs (alternating)
        const legA = Math.sin(phase) * 14;
        const legB = Math.sin(phase + p.PI) * 14;
        p.stroke(15, 80, 70);
        p.strokeWeight(4);
        p.strokeCap(p.ROUND);

        // back pair
        p.line(-14, 8, -14 + legA * 0.5, 22 + Math.abs(legA) * 0.3);
        p.line(-18, 8, -18 + legB * 0.5, 22 + Math.abs(legB) * 0.3);
        // front pair
        p.line(16, 8, 16 + legB * 0.6, 22 + Math.abs(legB) * 0.3);
        p.line(20, 8, 20 + legA * 0.6, 22 + Math.abs(legA) * 0.3);

        // Head
        p.noStroke();
        p.push();
        p.translate(26, -6);
        p.rotate(Math.sin(phase) * 0.05);
        p.fill(18, 80, 92);
        p.triangle(-6, -10, 22, -2, -6, 10);
        // Cheek
        p.fill(35, 25, 100);
        p.triangle(2, 0, 18, -1, 2, 8);
        // Ears
        p.fill(18, 80, 80);
        p.triangle(-4, -10, 2, -20, 6, -8);
        p.fill(15, 90, 60);
        p.triangle(-2, -10, 2, -16, 4, -9);
        // Eye
        p.fill(0, 0, 8);
        p.circle(8, -2, 2.4);
        // Nose
        p.fill(0, 0, 8);
        p.circle(20, -1, 2.6);
        p.pop();

        p.pop();
      };

      p.draw = () => {
        t += 0.016;

        drawSky();
        drawClouds();
        drawSun();
        drawHills();

        // Back grass layer
        const layer2 = blades.filter((b) => b.layer === 2);
        layer2.forEach((b) => {
          const wind = Math.sin(t * 2 + b.x * 0.02) * b.sway;
          p.stroke(60, 50, 60, 0.8);
          p.strokeWeight(1.6);
          p.line(b.x, b.baseY, b.x + wind, b.baseY - b.height);
        });

        drawPollen();

        // Fox runs along middle ground — loops across screen
        const period = 9; // seconds for a full crossing
        const progress = ((t % period) / period); // 0..1
        const foxX = -80 + progress * (w + 160);
        const foxY = h * 0.74;
        const foxScale = Math.max(0.7, Math.min(1.4, w / 700));
        const gallop = t * 9;
        drawFox(foxX, foxY, foxScale, gallop);

        // Front grass overlays the fox for depth
        const front = blades.filter((b) => b.layer <= 1);
        front.forEach((b) => {
          const wind = Math.sin(t * 2 + b.x * 0.02) * b.sway;
          const hue = 80 - b.layer * 10;
          p.stroke(hue, 65, 30 + b.shade * 25);
          p.strokeWeight(1 + (1 - b.layer) * 0.6);
          p.line(b.x, b.baseY, b.x + wind, b.baseY - b.height);
        });
      };

      p.windowResized = resize;
    };

    p5Ref.current = new p5(sketch);

    const ro = new ResizeObserver(() => {
      // p5 listens to windowResized; trigger it
      window.dispatchEvent(new Event('resize'));
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[320px] md:h-[460px] rounded-2xl overflow-hidden border border-amber-500/20 shadow-[0_0_60px_-15px_rgba(245,158,11,0.35)] bg-slate-900"
      aria-label="Wuxia the fox running through generative fields"
      role="img"
    />
  );
};

export default FoxRunningSketch;
