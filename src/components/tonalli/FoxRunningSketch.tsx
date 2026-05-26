import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

/**
 * Tonalli — generative biosphere scene.
 *
 * Multiple scene generators (biomes) populate flora & fauna procedurally:
 *   meadow  → tall grass + pollen + fox
 *   forest  → pines + ferns + fox + fireflies
 *   desert  → cacti + dust motes + fennec fox
 *   tundra  → snow tufts + drifting flakes + arctic fox
 *
 * Scroll-linked behavior: as the viewer scrolls through the section,
 * the fox accelerates and grass wind intensifies (mapped to scroll
 * progress through the canvas's viewport position).
 */

type Biome = 'meadow' | 'forest' | 'desert' | 'tundra';

const BIOMES: { id: Biome; label: string }[] = [
  { id: 'meadow', label: 'Meadow' },
  { id: 'forest', label: 'Forest' },
  { id: 'desert', label: 'Desert' },
  { id: 'tundra', label: 'Tundra' },
];

const FoxRunningSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  // Live-tunable params
  const speedRef = useRef(1);
  const pollenRef = useRef(60);
  const todRef = useRef(0.55);
  const biomeRef = useRef<Biome>('meadow');

  // Scroll-driven (0..1) — boosts fox speed & wind
  const scrollRef = useRef(0);
  const scrollLinkedRef = useRef(true);

  const reseedRef = useRef<() => void>(() => {});
  const biomeChangeRef = useRef<(b: Biome) => void>(() => {});

  const [speed, setSpeed] = useState(1);
  const [pollenCount, setPollenCount] = useState(60);
  const [tod, setTod] = useState(0.55);
  const [biome, setBiome] = useState<Biome>('meadow');
  const [scrollLinked, setScrollLinked] = useState(true);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pollenRef.current = pollenCount; }, [pollenCount]);
  useEffect(() => { todRef.current = tod; }, [tod]);
  useEffect(() => { scrollLinkedRef.current = scrollLinked; }, [scrollLinked]);
  useEffect(() => {
    // Defer to sketch so it can snapshot the current frame and crossfade
    biomeChangeRef.current?.(biome);
  }, [biome]);

  // Scroll listener — maps the canvas's vertical position in viewport to 0..1
  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: 0 when canvas bottom enters viewport, 1 when canvas top exits
      const raw = 1 - (rect.bottom) / (vh + rect.height);
      scrollRef.current = Math.max(0, Math.min(1, raw));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let w = 0;
      let h = 0;
      let t = 0;

      type Blade = { x: number; baseY: number; height: number; sway: number; shade: number; layer: number };
      type ParticleKind = 'pollen' | 'firefly' | 'dust' | 'snow';
      type Mote = { x: number; y: number; r: number; vy: number; vx: number; hue: number; sat: number; kind: ParticleKind; phase: number; drift: number };
      type Cloud = { x: number; y: number; r: number; speed: number };
      type Tree = { x: number; baseY: number; h: number; w: number; layer: number };
      type Cactus = { x: number; baseY: number; h: number; arms: number };

      const bladesBack: Blade[] = [];
      const bladesFront: Blade[] = [];
      const motes: Mote[] = [];
      const clouds: Cloud[] = [];
      const trees: Tree[] = [];
      const cacti: Cactus[] = [];

      let bgLayer: p5.Graphics | null = null;
      let bgKey = '';

      // Crossfade state — snapshot of previous biome, faded out over FADE_MS
      let prevFrame: p5.Image | null = null;
      let fadeAlpha = 0;
      let fadeStart = 0;
      const FADE_MS = 750;

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

      // Biome config — drives palette tints, ground hue, flora, fauna & particle kind.
      const biomeConfig = () => {
        const b = biomeRef.current;
        switch (b) {
          case 'forest':
            return {
              groundHue: 110, groundSat: 50, bladeHueBase: 130,
              skyTint: { h: 200, s: 30, b: -8 },
              moteHue: [50, 70] as [number, number], moteSat: 80,
              foxFur: { h: 22, s: 78, b: 78 }, foxEar: { h: 22, s: 78, b: 65 },
              flora: 'pines' as const, fauna: 'fox' as const,
              particle: 'firefly' as ParticleKind,
            };
          case 'desert':
            return {
              groundHue: 38, groundSat: 55, bladeHueBase: 42,
              skyTint: { h: 25, s: -10, b: 10 },
              moteHue: [28, 42] as [number, number], moteSat: 35,
              foxFur: { h: 38, s: 35, b: 96 }, foxEar: { h: 38, s: 35, b: 85 },
              flora: 'cacti' as const, fauna: 'fennec' as const,
              particle: 'dust' as ParticleKind,
            };
          case 'tundra':
            return {
              groundHue: 200, groundSat: 12, bladeHueBase: 200,
              skyTint: { h: 210, s: 10, b: 6 },
              moteHue: [0, 0] as [number, number], moteSat: 0,
              foxFur: { h: 0, s: 0, b: 98 }, foxEar: { h: 0, s: 0, b: 80 },
              flora: 'tufts' as const, fauna: 'arctic' as const,
              particle: 'snow' as ParticleKind,
            };
          default: // meadow
            return {
              groundHue: 95, groundSat: 45, bladeHueBase: 80,
              skyTint: { h: 0, s: 0, b: 0 },
              moteHue: [38, 52] as [number, number], moteSat: 60,
              foxFur: { h: 18, s: 80, b: 92 }, foxEar: { h: 18, s: 80, b: 80 },
              flora: 'grass' as const, fauna: 'fox' as const,
              particle: 'pollen' as ParticleKind,
            };
        }
      };

      const makeMote = (): Mote => {
        const bc = biomeConfig();
        const kind = bc.particle;
        // Per-kind defaults
        let r = p.random(1.2, 3);
        let vy = p.random(-0.25, -0.05);
        let vx = p.random(-0.2, 0.2);
        if (kind === 'firefly') { r = p.random(1.4, 2.4); vy = p.random(-0.15, 0.15); vx = p.random(-0.3, 0.3); }
        else if (kind === 'dust') { r = p.random(0.8, 2); vy = p.random(-0.05, 0.05); vx = p.random(0.4, 1.2); }
        else if (kind === 'snow') { r = p.random(1.4, 3.2); vy = p.random(0.4, 1.1); vx = p.random(-0.2, 0.2); }
        return {
          x: p.random(w),
          y: p.random(h * 0.1, h * 0.9),
          r, vy, vx,
          hue: p.random(bc.moteHue[0], bc.moteHue[1]),
          sat: bc.moteSat,
          kind,
          phase: p.random(0, Math.PI * 2),
          drift: p.random(0.5, 1.5),
        };
      };

      const syncMoteCount = () => {
        const cap = tier().pollenCap;
        const target = Math.min(cap, Math.round(pollenRef.current));
        while (motes.length < target) motes.push(makeMote());
        if (motes.length > target) motes.length = target;
      };

      const seedScene = () => {
        bladesBack.length = 0;
        bladesFront.length = 0;
        motes.length = 0;
        clouds.length = 0;
        trees.length = 0;
        cacti.length = 0;

        const bc = biomeConfig();
        const mul = tier().bladeMul;

        // Universal ground blades / tufts
        for (let layer = 0; layer < 3; layer++) {
          const base = layer === 0 ? 220 : layer === 1 ? 160 : 110;
          const density = Math.round(base * mul * (bc.flora === 'tufts' ? 0.4 : 1));
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
            if (layer === 2) bladesBack.push(b);
            else bladesFront.push(b);
          }
        }

        // Biome-specific flora
        if (bc.flora === 'pines') {
          const n = Math.round(14 * mul);
          for (let i = 0; i < n; i++) {
            trees.push({
              x: p.random(-30, w + 30),
              baseY: h * (0.74 + p.random(-0.02, 0.04)),
              h: p.random(70, 140),
              w: p.random(28, 48),
              layer: p.random() < 0.5 ? 0 : 1,
            });
          }
          trees.sort((a, b) => a.layer - b.layer);
        } else if (bc.flora === 'cacti') {
          const n = Math.round(8 * mul);
          for (let i = 0; i < n; i++) {
            cacti.push({
              x: p.random(-20, w + 20),
              baseY: h * (0.76 + p.random(-0.02, 0.04)),
              h: p.random(40, 90),
              arms: Math.floor(p.random(0, 3)),
            });
          }
        }

        syncMoteCount();

        for (let i = 0; i < 5; i++) {
          clouds.push({
            x: p.random(w),
            y: p.random(h * 0.08, h * 0.3),
            r: p.random(50, 120),
            speed: p.random(0.05, 0.2),
          });
        }

        bgKey = '';
      };

      reseedRef.current = seedScene;

      biomeChangeRef.current = (next: Biome) => {
        if (next === biomeRef.current) return;
        // Snapshot the current rendered scene, then swap biome and reseed.
        // The snapshot is drawn on top with decaying alpha = crossfade.
        try { prevFrame = p.get(); } catch { prevFrame = null; }
        biomeRef.current = next;
        seedScene();
        fadeStart = p.millis();
        fadeAlpha = 1;
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
        const bc = biomeConfig();
        const topHue = p.lerp(20, 230, Math.min(1, k * 1.1)) + bc.skyTint.h * 0.15;
        const topSat = Math.max(0, p.lerp(60, 70, k) + bc.skyTint.s);
        const topBri = Math.max(0, p.lerp(92, 18, k) + bc.skyTint.b);
        const botHue = p.lerp(35, 250, k) + bc.skyTint.h * 0.1;
        const botSat = Math.max(0, p.lerp(40, 55, k) + bc.skyTint.s * 0.5);
        const botBri = Math.max(0, p.lerp(85, 8, k) + bc.skyTint.b);
        const sunBri = p.lerp(100, 30, Math.max(0, k - 0.4) * 1.6);
        const sunAlpha = k > 0.9 ? 0 : 1;
        return { topHue, topSat, topBri, botHue, botSat, botBri, sunBri, sunAlpha, k };
      };

      const ensureBackground = () => {
        const todQ = Math.round(todRef.current * 40);
        const key = `${w}x${h}|${todQ}|${biomeRef.current}`;
        if (bgLayer && bgKey === key) return;
        if (!bgLayer) bgLayer = p.createGraphics(w, h);
        bgLayer.colorMode(p.HSB, 360, 100, 100, 1);
        const g = bgLayer;
        const pal = palette();
        const bc = biomeConfig();
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
        g.fill((bc.groundHue + 50) % 360, bc.groundSat * 0.6, hillBri);
        g.beginShape();
        g.vertex(0, h * 0.7);
        for (let x = 0; x <= w; x += 14) {
          const y = h * 0.7 + Math.sin(x * 0.008 + 1) * 18 - 30;
          g.vertex(x, y);
        }
        g.vertex(w, h); g.vertex(0, h);
        g.endShape(g.CLOSE);

        g.fill(bc.groundHue, bc.groundSat, fieldBri);
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

      const drawMotes = () => {
        syncMoteCount();
        p.noStroke();
        motes.forEach((s) => {
          s.x += s.vx + Math.sin(t + s.y * 0.01) * 0.3;
          s.y += s.vy;
          if (s.y < -10) { s.y = h + 10; s.x = p.random(w); }
          if (s.x < -10) s.x = w + 10;
          if (s.x > w + 10) s.x = -10;
          p.fill(s.hue, s.sat, 100, 0.5);
          p.circle(s.x, s.y, s.r * 3);
          p.fill(s.hue, s.sat * 0.5, 100, 1);
          p.circle(s.x, s.y, s.r);
        });
      };

      const drawTrees = (layer: number) => {
        const pal = palette();
        const bri = p.lerp(60, 14, pal.k);
        trees.filter((tr) => tr.layer === layer).forEach((tr) => {
          // trunk
          p.noStroke();
          p.fill(22, 60, bri * 0.7);
          p.rect(tr.x - 3, tr.baseY - tr.h * 0.35, 6, tr.h * 0.35);
          // triangular pine canopy
          p.fill(135, 60, bri);
          const tiers = 3;
          for (let i = 0; i < tiers; i++) {
            const yTop = tr.baseY - tr.h + i * (tr.h * 0.25);
            const yBot = yTop + tr.h * 0.45;
            const halfW = tr.w * (0.4 + i * 0.18);
            p.triangle(tr.x - halfW, yBot, tr.x + halfW, yBot, tr.x, yTop);
          }
        });
      };

      const drawCacti = () => {
        const pal = palette();
        const bri = p.lerp(55, 18, pal.k);
        p.noStroke();
        cacti.forEach((c) => {
          p.fill(130, 55, bri);
          p.rect(c.x - 8, c.baseY - c.h, 16, c.h, 8);
          if (c.arms > 0) {
            p.rect(c.x - 20, c.baseY - c.h * 0.7, 8, c.h * 0.4, 4);
            p.rect(c.x - 20, c.baseY - c.h * 0.7, 18, 8, 4);
          }
          if (c.arms > 1) {
            p.rect(c.x + 12, c.baseY - c.h * 0.55, 8, c.h * 0.35, 4);
            p.rect(c.x + 2, c.baseY - c.h * 0.55, 18, 8, 4);
          }
        });
      };

      const drawFox = (cx: number, cy: number, scale: number, phase: number) => {
        const bc = biomeConfig();
        const isFennec = bc.fauna === 'fennec';
        const isArctic = bc.fauna === 'arctic';
        const earScale = isFennec ? 1.6 : 1;

        p.push();
        p.translate(cx, cy);
        p.scale(scale);

        const bob = Math.sin(phase * 2) * 2.5;
        p.translate(0, bob);

        // tail
        const tailSway = Math.sin(phase + 1) * 0.4;
        p.push();
        p.translate(-30, -6);
        p.rotate(-0.5 + tailSway);
        p.noStroke();
        p.fill(bc.foxFur.h, bc.foxFur.s * 0.95, bc.foxFur.b * 0.95);
        p.ellipse(0, 0, 36, 14);
        p.fill(0, 0, 100);
        p.ellipse(10, 2, 14, 8);
        p.pop();

        // body
        p.noStroke();
        p.fill(bc.foxFur.h, bc.foxFur.s, bc.foxFur.b);
        p.ellipse(0, 0, 56, 26);

        p.fill(isArctic ? 0 : 35, isArctic ? 0 : 25, 100);
        p.ellipse(2, 6, 42, 14);

        const legA = Math.sin(phase) * 14;
        const legB = Math.sin(phase + p.PI) * 14;
        p.stroke(bc.foxFur.h, Math.min(100, bc.foxFur.s * 1.1), bc.foxFur.b * 0.75);
        p.strokeWeight(4);
        p.strokeCap(p.ROUND);
        p.line(-14, 8, -14 + legA * 0.5, 22 + Math.abs(legA) * 0.3);
        p.line(-18, 8, -18 + legB * 0.5, 22 + Math.abs(legB) * 0.3);
        p.line(16, 8, 16 + legB * 0.6, 22 + Math.abs(legB) * 0.3);
        p.line(20, 8, 20 + legA * 0.6, 22 + Math.abs(legA) * 0.3);

        // head + ear
        p.noStroke();
        p.push();
        p.translate(26, -6);
        p.rotate(Math.sin(phase) * 0.05);
        p.fill(bc.foxFur.h, bc.foxFur.s, bc.foxFur.b);
        p.triangle(-6, -10, 22, -2, -6, 10);
        p.fill(isArctic ? 0 : 35, isArctic ? 0 : 25, 100);
        p.triangle(2, 0, 18, -1, 2, 8);
        p.fill(bc.foxEar.h, bc.foxEar.s, bc.foxEar.b);
        p.triangle(-4, -10, 2 + (earScale - 1) * 2, -20 * earScale, 6 + (earScale - 1) * 4, -8);
        p.fill(bc.foxFur.h, bc.foxFur.s, bc.foxFur.b * 0.7);
        p.triangle(-2, -10, 2, -16 * earScale, 4, -9);
        p.fill(0, 0, 8);
        p.circle(8, -2, 2.4);
        p.fill(0, 0, 8);
        p.circle(20, -1, 2.6);
        p.pop();

        p.pop();
      };

      let foxProgress = 0;

      p.draw = () => {
        const dt = 0.016;
        const scroll = scrollLinkedRef.current ? scrollRef.current : 0;
        // wind & speed boosters: 1× at top of view → 2.5× / 3× as you scroll past
        const windBoost = 1 + scroll * 2.5;
        const speedBoost = 1 + scroll * 2;
        t += dt * windBoost * 0.5 + dt * 0.5; // wind progresses faster with scroll

        ensureBackground();
        if (bgLayer) p.image(bgLayer, 0, 0);
        drawClouds();
        drawSun();

        const bc = biomeConfig();
        if (bc.flora === 'pines') drawTrees(0);

        // back grass
        bladesBack.forEach((b) => {
          const wind = Math.sin(t * 2 + b.x * 0.02) * b.sway * windBoost;
          const hue = bc.bladeHueBase - 20;
          p.stroke(hue, 50, 60, 0.8);
          p.strokeWeight(1.6);
          p.line(b.x, b.baseY, b.x + wind, b.baseY - b.height);
        });

        if (bc.flora === 'cacti') drawCacti();
        if (bc.flora === 'pines') drawTrees(1);

        drawMotes();

        const userSpeed = speedRef.current;
        const effSpeed = userSpeed * speedBoost;
        const basePeriod = 9;
        foxProgress += (dt / basePeriod) * effSpeed;
        if (foxProgress > 1) foxProgress -= 1;
        const foxX = -80 + foxProgress * (w + 160);
        const foxY = h * 0.74;
        const foxScale = Math.max(0.7, Math.min(1.4, w / 700));
        const gallop = t * 9 * effSpeed;
        drawFox(foxX, foxY, foxScale, gallop);

        bladesFront.forEach((b) => {
          const wind = Math.sin(t * 2 + b.x * 0.02) * b.sway * windBoost;
          const hue = bc.bladeHueBase - b.layer * 10;
          p.stroke(hue, 65, 30 + b.shade * 25);
          p.strokeWeight(1 + (1 - b.layer) * 0.6);
          p.line(b.x, b.baseY, b.x + wind, b.baseY - b.height);
        });

        // subtle scroll indicator (top-left bar)
        p.noStroke();
        p.fill(45, 80, 100, 0.25);
        p.rect(12, 12, 80, 3, 2);
        p.fill(45, 80, 100, 0.95);
        p.rect(12, 12, 80 * scroll, 3, 2);

        // Biome crossfade — draw the previous biome snapshot on top, fading out
        if (prevFrame && fadeAlpha > 0) {
          const elapsed = p.millis() - fadeStart;
          const linear = Math.max(0, 1 - elapsed / FADE_MS);
          // ease-out cubic for a softer end
          fadeAlpha = linear * linear * (3 - 2 * linear);
          p.push();
          p.tint(0, 0, 100, fadeAlpha);
          p.image(prevFrame, 0, 0);
          p.noTint();
          p.pop();
          if (fadeAlpha <= 0.01) {
            prevFrame = null;
            fadeAlpha = 0;
          }
        }
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
        aria-label="Wuxia the fox running through a generative biosphere"
        role="img"
      />
      <div className="absolute top-3 right-3 w-[240px] rounded-xl bg-slate-950/70 backdrop-blur-md border border-amber-500/20 p-3 text-xs text-amber-50 shadow-lg">
        <div className="font-semibold tracking-wide uppercase text-amber-200/90 mb-2">Biosphere</div>

        <label className="flex items-center justify-between mb-3 cursor-pointer">
          <span>Scroll-linked motion</span>
          <button
            type="button"
            role="switch"
            aria-checked={scrollLinked}
            onClick={() => setScrollLinked((v) => !v)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              scrollLinked ? 'bg-amber-400/70' : 'bg-slate-700/70'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-amber-50 transition-transform ${
                scrollLinked ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </label>

        <label className="block mb-3">
          <div className="flex justify-between mb-1">
            <span>Biome</span>
            <span className="text-amber-200/80 capitalize">{biome}</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {BIOMES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBiome(b.id)}
                className={`px-2 py-1 rounded-md border text-[11px] transition-colors ${
                  biome === b.id
                    ? 'bg-amber-400/20 border-amber-400/60 text-amber-100'
                    : 'bg-slate-900/40 border-slate-700/60 text-amber-50/70 hover:bg-slate-800/60'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </label>

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
            <span>Particles</span>
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

        <p className="mt-3 text-[10px] leading-tight text-amber-200/60">
          Scroll the page — fox gallop and wind intensify with scroll progress.
        </p>
      </div>
    </div>
  );
};

export default FoxRunningSketch;
