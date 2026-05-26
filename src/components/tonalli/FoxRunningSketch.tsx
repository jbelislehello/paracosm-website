import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

/**
 * Tonalli — Wuxia the Fox running through the fields.
 * A p5.js generative scene: parallax grass fields, drifting sun,
 * floating pollen, and a stylized fox in a gallop cycle.
 *
 * Controls overlay lets viewers tune fox speed, pollen density,
 * and time-of-day (dawn → dusk → night) in real time.
 */
const FoxRunningSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  // Live-tunable params (refs so the p5 loop reads latest values without re-mounting)
  const speedRef = useRef(1);
  const pollenRef = useRef(60);
  const todRef = useRef(0.55); // 0 dawn, 0.5 midday, 0.75 dusk, 1 night

  const [speed, setSpeed] = useState(1);
  const [pollenCount, setPollenCount] = useState(60);
  const [tod, setTod] = useState(0.55);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pollenRef.current = pollenCount; }, [pollenCount]);
  useEffect(() => { todRef.current = tod; }, [tod]);

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
      const bladesBack: Blade[] = [];
      const bladesFront: Blade[] = [];
      const pollen: Pollen[] = [];
      const clouds: Cloud[] = [];

      // Cached sky+hills layer — re-rasterized only when viewport or time-of-day bucket changes
      let bgLayer: p5.Graphics | null = null;
      let bgKey = '';

      // Mobile-aware quality tier
      const tier = () => {
        const small = w < 640;
        const tiny = w < 420;
        return {
          isSmall: small,
          bladeMul: tiny ? 0.35 : small ? 0.55 : 1,
          pollenCap: tiny ? 60 : small ? 120 : 300,
          skyStep: tiny ? 3 : small ? 2 : 1,
          frameRate: tiny ? 30 : small ? 45 : 60,
        };
      };

      const makePollen = (): Pollen => ({
        x: p.random(w),
        y: p.random(h * 0.2, h * 0.9),
        r: p.random(1.2, 3),
        vy: p.random(-0.25, -0.05),
        vx: p.random(-0.2, 0.2),
        hue: p.random(38, 52),
      });

      const syncPollenCount = () => {
        const cap = tier().pollenCap;
        const target = Math.min(cap, Math.round(pollenRef.current));
        while (pollen.length < target) pollen.push(makePollen());
        if (pollen.length > target) pollen.length = target;
      };

      const seedScene = () => {
        blades.length = 0;
        bladesBack.length = 0;
        bladesFront.length = 0;
        pollen.length = 0;
        clouds.length = 0;

        const mul = tier().bladeMul;
        for (let layer = 0; layer < 3; layer++) {
          const base = layer === 0 ? 220 : layer === 1 ? 160 : 110;
          const density = Math.round(base * mul);
          const baseY = h * (0.72 + layer * 0.07);
          for (let i = 0; i < density; i++) {
            const b: Blade = {
              x: p.random(-40, w + 40),
              baseY: baseY + p.random(-8, 12),
              height: p.random(10, 26) + layer * 6,
              sway: p.random(0.4, 1.4),
              shade: p.random(0, 1),
              layer,
            };
            blades.push(b);
            if (layer === 2) bladesBack.push(b);
            else bladesFront.push(b);
          }
        }

        syncPollenCount();

        for (let i = 0; i < 5; i++) {
          clouds.push({
            x: p.random(w),
            y: p.random(h * 0.08, h * 0.3),
            r: p.random(50, 120),
            speed: p.random(0.05, 0.2),
          });
        }

        bgKey = ''; // invalidate cached background
      };

      const resize = () => {
        const rect = containerRef.current!.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        p.resizeCanvas(w, h);
        if (bgLayer) { bgLayer.remove(); bgLayer = null; }
        p.frameRate(tier().frameRate);
        seedScene();
      };

      p.setup = () => {
        const rect = containerRef.current!.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        const c = p.createCanvas(w, h);
        c.parent(containerRef.current!);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.frameRate(tier().frameRate);
        seedScene();
      };

      const palette = () => {
        const k = todRef.current;
        const topHue = p.lerp(20, 230, Math.min(1, k * 1.1));
        const topSat = p.lerp(60, 70, k);
        const topBri = p.lerp(92, 18, k);
        const botHue = p.lerp(35, 250, k);
        const botSat = p.lerp(40, 55, k);
        const botBri = p.lerp(85, 8, k);
        const sunBri = p.lerp(100, 30, Math.max(0, k - 0.4) * 1.6);
        const sunAlpha = k > 0.9 ? 0 : 1;
        return { topHue, topSat, topBri, botHue, botSat, botBri, sunBri, sunAlpha, k };
      };

      // Rasterize sky + stars + hills into an offscreen buffer.
      // Re-rendered only when viewport or time-of-day bucket changes.
      const ensureBackground = () => {
        const todQ = Math.round(todRef.current * 40); // ~40 buckets across tod range
        const key = `${w}x${h}|${todQ}`;
        if (bgLayer && bgKey === key) return;
        if (!bgLayer) bgLayer = p.createGraphics(w, h);
        bgLayer.colorMode(p.HSB, 360, 100, 100, 1);
        const g = bgLayer;
        const pal = palette();
        const step = tier().skyStep;
        const skyH = h * 0.78;
        g.noStroke();
        for (let y = 0; y < skyH; y += step) {
          const m = y / skyH;
          g.fill(
            p.lerp(pal.topHue, pal.botHue, m),
            p.lerp(pal.topSat, pal.botSat, m),
            p.lerp(pal.topBri, pal.botBri, m),
          );
          g.rect(0, y, w, step);
        }

        if (pal.k > 0.78) {
          const starAlpha = (pal.k - 0.78) / 0.22;
          g.fill(0, 0, 100, starAlpha * 0.9);
          const starCount = tier().isSmall ? 20 : 40;
          for (let i = 0; i < starCount; i++) {
            const sx = (i * 97.3) % w;
            const sy = (i * 53.7) % (h * 0.5);
            g.circle(sx, sy, 1.4 + (i % 3) * 0.4);
          }
        }

        const hillBri = p.lerp(55, 12, pal.k);
        const fieldBri = p.lerp(48, 10, pal.k);
        g.fill(150, 30, hillBri);
        g.beginShape();
        g.vertex(0, h * 0.7);
        for (let x = 0; x <= w; x += 14) {
          const y = h * 0.7 + Math.sin(x * 0.008 + 1) * 18 - 30;
          g.vertex(x, y);
        }
        g.vertex(w, h); g.vertex(0, h);
        g.endShape(g.CLOSE);

        g.fill(95, 45, fieldBri);
        g.beginShape();
        g.vertex(0, h * 0.78);
        for (let x = 0; x <= w; x += 12) {
          const y = h * 0.78 + Math.sin(x * 0.012 + 2) * 10;
          g.vertex(x, y);
        }
        g.vertex(w, h); g.vertex(0, h);
        g.endShape(g.CLOSE);

        bgKey = key;
      };

      const drawSun = () => {
        const pal = palette();
        if (pal.sunAlpha <= 0) return;
        const sx = w * 0.78;
        const sy = h * (0.18 + pal.k * 0.45) + Math.sin(t * 0.4) * 4;
        const hue = p.lerp(45, 12, pal.k);
        const halos = tier().isSmall ? 4 : 8;
        for (let i = halos; i > 0; i--) {
          p.noStroke();
          p.fill(hue, 70, 100, 0.05 * i * pal.sunAlpha);
          p.circle(sx, sy, 60 + i * 14);
        }
        p.fill(hue, 30, pal.sunBri, pal.sunAlpha);
        p.circle(sx, sy, 60);
      };

      const drawClouds = () => {
        const pal = palette();
        const cloudBri = p.lerp(100, 30, pal.k);
        p.noStroke();
        clouds.forEach((c) => {
          c.x += c.speed;
          if (c.x - c.r > w) c.x = -c.r;
          for (let i = 0; i < 5; i++) {
            p.fill(30, 18, cloudBri, 0.18);
            p.ellipse(c.x + i * c.r * 0.3, c.y + Math.sin(i) * 4, c.r, c.r * 0.55);
          }
        });
      };

      const drawPollen = () => {
        syncPollenCount();
        p.noStroke();
        pollen.forEach((s) => {
          s.x += s.vx + Math.sin(t + s.y * 0.01) * 0.3;
          s.y += s.vy;
          if (s.y < -10) { s.y = h + 10; s.x = p.random(w); }
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

        const bob = Math.sin(phase * 2) * 2.5;
        p.translate(0, bob);

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

        p.noStroke();
        p.fill(18, 80, 92);
        p.ellipse(0, 0, 56, 26);

        p.fill(35, 25, 100);
        p.ellipse(2, 6, 42, 14);

        const legA = Math.sin(phase) * 14;
        const legB = Math.sin(phase + p.PI) * 14;
        p.stroke(15, 80, 70);
        p.strokeWeight(4);
        p.strokeCap(p.ROUND);

        p.line(-14, 8, -14 + legA * 0.5, 22 + Math.abs(legA) * 0.3);
        p.line(-18, 8, -18 + legB * 0.5, 22 + Math.abs(legB) * 0.3);
        p.line(16, 8, 16 + legB * 0.6, 22 + Math.abs(legB) * 0.3);
        p.line(20, 8, 20 + legA * 0.6, 22 + Math.abs(legA) * 0.3);

        p.noStroke();
        p.push();
        p.translate(26, -6);
        p.rotate(Math.sin(phase) * 0.05);
        p.fill(18, 80, 92);
        p.triangle(-6, -10, 22, -2, -6, 10);
        p.fill(35, 25, 100);
        p.triangle(2, 0, 18, -1, 2, 8);
        p.fill(18, 80, 80);
        p.triangle(-4, -10, 2, -20, 6, -8);
        p.fill(15, 90, 60);
        p.triangle(-2, -10, 2, -16, 4, -9);
        p.fill(0, 0, 8);
        p.circle(8, -2, 2.4);
        p.fill(0, 0, 8);
        p.circle(20, -1, 2.6);
        p.pop();

        p.pop();
      };

      // Continuous fox position independent of frame rate jitter
      let foxProgress = 0;

      p.draw = () => {
        const dt = 0.016;
        t += dt;

        drawSky();
        drawClouds();
        drawSun();
        drawHills();

        const layer2 = blades.filter((b) => b.layer === 2);
        layer2.forEach((b) => {
          const wind = Math.sin(t * 2 + b.x * 0.02) * b.sway;
          p.stroke(60, 50, 60, 0.8);
          p.strokeWeight(1.6);
          p.line(b.x, b.baseY, b.x + wind, b.baseY - b.height);
        });

        drawPollen();

        const speed = speedRef.current;
        const basePeriod = 9; // seconds at speed=1
        foxProgress += (dt / basePeriod) * speed;
        if (foxProgress > 1) foxProgress -= 1;
        const foxX = -80 + foxProgress * (w + 160);
        const foxY = h * 0.74;
        const foxScale = Math.max(0.7, Math.min(1.4, w / 700));
        const gallop = t * 9 * speed;
        drawFox(foxX, foxY, foxScale, gallop);

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
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="w-full h-[320px] md:h-[460px] rounded-2xl overflow-hidden border border-amber-500/20 shadow-[0_0_60px_-15px_rgba(245,158,11,0.35)] bg-slate-900"
        aria-label="Wuxia the fox running through generative fields"
        role="img"
      />
      <div className="absolute top-3 right-3 w-[220px] rounded-xl bg-slate-950/70 backdrop-blur-md border border-amber-500/20 p-3 text-xs text-amber-50 shadow-lg">
        <div className="font-semibold tracking-wide uppercase text-amber-200/90 mb-2">Scene controls</div>

        <label className="block mb-2">
          <div className="flex justify-between mb-1">
            <span>Fox speed</span>
            <span className="tabular-nums text-amber-200/80">{speed.toFixed(2)}×</span>
          </div>
          <input
            type="range" min={0.2} max={3} step={0.05} value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-amber-400"
          />
        </label>

        <label className="block mb-2">
          <div className="flex justify-between mb-1">
            <span>Pollen</span>
            <span className="tabular-nums text-amber-200/80">{pollenCount}</span>
          </div>
          <input
            type="range" min={0} max={300} step={5} value={pollenCount}
            onChange={(e) => setPollenCount(parseInt(e.target.value, 10))}
            className="w-full accent-amber-400"
          />
        </label>

        <label className="block">
          <div className="flex justify-between mb-1">
            <span>Time of day</span>
            <span className="tabular-nums text-amber-200/80">
              {tod < 0.25 ? 'dawn' : tod < 0.55 ? 'midday' : tod < 0.85 ? 'dusk' : 'night'}
            </span>
          </div>
          <input
            type="range" min={0} max={1} step={0.01} value={tod}
            onChange={(e) => setTod(parseFloat(e.target.value))}
            className="w-full accent-amber-400"
          />
        </label>
      </div>
    </div>
  );
};

export default FoxRunningSketch;
