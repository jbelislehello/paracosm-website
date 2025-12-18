import React, { useRef, useEffect, useCallback } from 'react';
import p5 from 'p5';
import { RingLevel, getTileRing } from '@/utils/ringToleranceSystem';
import { 
  NatureCognitiveMode, 
  NATURE_COGNITIVE_MODES, 
  VegetationType, 
  getVegetationType, 
  getTerrainType,
  shouldHaveWater,
  ParticleConfig
} from '@/data/natureTaxonomy';
import { BluntQuote, RockFormation, getDominantRockFormation } from '@/utils/bluntQuoteExtraction';

interface TileEcology {
  row: number;
  col: number;
  fragmentCount: number;
  quotes: BluntQuote[];
  vegetation: VegetationType;
  terrain: string;
  ring: RingLevel;
  isVisited: boolean;
  hasWater: boolean;
}

interface EcologicalGardenP5Props {
  garden: 'intelligence' | 'systems' | 'prototypes';
  tileData: Map<string, { fragmentCount: number; quotes: BluntQuote[] }>;
  visitedTiles: Set<string>;
  currentNatureMode: NatureCognitiveMode | null;
  onTileClick?: (row: number, col: number) => void;
}

// Garden-specific color palettes
const GARDEN_PALETTES = {
  intelligence: {
    base: { h: 280, s: 30, b: 25 },
    accent: { h: 320, s: 50, b: 60 },
    highlight: { h: 200, s: 60, b: 70 },
  },
  systems: {
    base: { h: 200, s: 35, b: 20 },
    accent: { h: 160, s: 50, b: 55 },
    highlight: { h: 45, s: 70, b: 75 },
  },
  prototypes: {
    base: { h: 120, s: 30, b: 22 },
    accent: { h: 80, s: 50, b: 60 },
    highlight: { h: 340, s: 60, b: 70 },
  }
};

// Ring colors (matching tolerance system)
const RING_COLORS: Record<RingLevel, { h: number; s: number; b: number }> = {
  1: { h: 210, s: 70, b: 50 },
  2: { h: 270, s: 60, b: 50 },
  3: { h: 142, s: 71, b: 45 },
  4: { h: 45, s: 93, b: 47 },
};

// Particle class for nature-responsive animations
class NatureParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  config: ParticleConfig;
  phase: number;
  
  constructor(config: ParticleConfig, bounds: { w: number; h: number; d: number }) {
    this.config = config;
    this.x = (Math.random() - 0.5) * bounds.w;
    this.y = (Math.random() - 0.5) * bounds.h;
    this.z = (Math.random() - 0.5) * bounds.d;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.maxLife = 200 + Math.random() * 200;
    this.life = Math.random() * this.maxLife;
    this.phase = Math.random() * Math.PI * 2;
  }
  
  update(frameCount: number) {
    const speed = this.config.speed;
    
    switch (this.config.behavior) {
      case 'flow':
        this.vx = speed + Math.sin(frameCount * 0.02 + this.phase) * 0.3;
        this.vy = Math.sin(frameCount * 0.01 + this.phase) * 0.2;
        this.vz = Math.cos(frameCount * 0.015 + this.phase) * 0.2;
        break;
      case 'rise':
        this.vy = -speed * 0.5;
        this.vx = Math.sin(frameCount * 0.01 + this.phase) * 0.1;
        this.vz = Math.cos(frameCount * 0.01 + this.phase) * 0.1;
        break;
      case 'wander':
        this.vx = Math.sin(frameCount * 0.03 + this.phase) * speed;
        this.vy = Math.sin(frameCount * 0.02 + this.phase * 1.5) * speed * 0.5;
        this.vz = Math.cos(frameCount * 0.025 + this.phase) * speed;
        break;
      case 'fall':
        this.vy = speed;
        this.vx = Math.sin(frameCount * 0.01 + this.phase) * 0.3;
        this.vz = Math.cos(frameCount * 0.015 + this.phase) * 0.2;
        break;
      case 'spiral':
        const angle = frameCount * 0.02 + this.phase;
        this.vx = Math.cos(angle) * speed;
        this.vy = -speed * 0.3;
        this.vz = Math.sin(angle) * speed;
        break;
      case 'pulse':
        // Ripples expand outward
        this.life -= 2;
        break;
    }
    
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    this.life--;
  }
  
  reset(bounds: { w: number; h: number; d: number }) {
    this.x = (Math.random() - 0.5) * bounds.w;
    this.y = (Math.random() - 0.5) * bounds.h;
    this.z = (Math.random() - 0.5) * bounds.d;
    this.life = this.maxLife;
    this.phase = Math.random() * Math.PI * 2;
  }
  
  isAlive() {
    return this.life > 0;
  }
}

export default function EcologicalGardenP5({
  garden,
  tileData,
  visitedTiles,
  currentNatureMode,
  onTileClick
}: EcologicalGardenP5Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const particlesRef = useRef<NatureParticle[]>([]);
  
  // Camera controls
  const rotationRef = useRef({ x: -0.7, y: 0.4 });
  const zoomRef = useRef(1);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const hoverTileRef = useRef<{ row: number; col: number } | null>(null);

  const palette = GARDEN_PALETTES[garden];
  const cubeSize = 36;

  // Build tile ecology data
  const getTileEcology = useCallback((row: number, col: number): TileEcology => {
    const key = `${row}-${col}`;
    const data = tileData.get(key) || { fragmentCount: 0, quotes: [] };
    const ring = getTileRing(row, col);
    const isVisited = visitedTiles.has(key);
    const hasWater = shouldHaveWater(row, col, currentNatureMode);
    
    const vegetation = getVegetationType(
      data.fragmentCount,
      data.quotes.length > 0,
      0,
      currentNatureMode
    );
    
    const terrain = getTerrainType(
      data.fragmentCount,
      data.quotes.length > 0,
      currentNatureMode ? NATURE_COGNITIVE_MODES[currentNatureMode].axis : 'LOVE'
    );

    return {
      row,
      col,
      fragmentCount: data.fragmentCount,
      quotes: data.quotes,
      vegetation,
      terrain,
      ring,
      isVisited,
      hasWater
    };
  }, [tileData, visitedTiles, currentNatureMode]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let width = containerRef.current?.clientWidth || 800;
      let height = containerRef.current?.clientHeight || 500;
      const bounds = { w: 400, h: 200, d: 400 };

      // Initialize particles based on current nature mode
      const initParticles = () => {
        particlesRef.current = [];
        if (currentNatureMode) {
          const mode = NATURE_COGNITIVE_MODES[currentNatureMode];
          mode.particles.forEach(config => {
            for (let i = 0; i < config.count; i++) {
              particlesRef.current.push(new NatureParticle(config, bounds));
            }
          });
        }
      };

      p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        initParticles();
      };

      p.windowResized = () => {
        width = containerRef.current?.clientWidth || 800;
        height = containerRef.current?.clientHeight || 500;
        p.resizeCanvas(width, height);
      };

      p.draw = () => {
        p.clear();
        
        // Subtle ambient light
        p.ambientLight(60);
        p.directionalLight(255, 255, 255, 0.5, 0.5, -1);

        p.push();
        
        // Apply camera transforms
        p.scale(zoomRef.current);
        p.rotateX(rotationRef.current.x);
        p.rotateY(rotationRef.current.y);

        // Draw 64 tiles with depth sorting
        const tiles: Array<{ row: number; col: number; depth: number }> = [];
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const depth = (7 - row) + col;
            tiles.push({ row, col, depth });
          }
        }
        tiles.sort((a, b) => b.depth - a.depth);

        for (const { row, col } of tiles) {
          drawEcologicalTile(p, getTileEcology(row, col));
        }

        // Draw water features (streams between water tiles)
        drawWaterConnections(p);

        // Draw central PRD tree marker
        drawCentralTree(p);

        // Draw nature particles
        drawParticles(p);

        p.pop();

        // 2D overlay
        draw2DOverlay(p);
      };

      const drawEcologicalTile = (p: p5, tile: TileEcology) => {
        const { row, col, fragmentCount, quotes, vegetation, ring, isVisited, hasWater } = tile;
        
        // Grid position
        const gridCenter = 3.5;
        const x = (col - gridCenter) * cubeSize * 1.15;
        const z = (row - gridCenter) * cubeSize * 1.15;
        
        // Elevation based on fragment count
        const baseElevation = isVisited ? fragmentCount * 2 : 0;
        const y = -baseElevation;
        
        const isHovered = hoverTileRef.current?.row === row && hoverTileRef.current?.col === col;
        const hoverOffset = isHovered ? -8 : 0;

        p.push();
        p.translate(x, y + hoverOffset, z);

        // Get ring color
        const ringColor = RING_COLORS[ring];
        
        // Draw base terrain tile
        const tileHeight = 8 + fragmentCount * 1.5;
        
        // Top face - add blue tint for water tiles
        if (hasWater && isVisited) {
          p.fill(200, 50, ringColor.b * (isVisited ? 0.9 : 0.4), 0.95);
        } else {
          p.fill(ringColor.h, ringColor.s * (isVisited ? 0.8 : 0.3), ringColor.b * (isVisited ? 0.9 : 0.4), 0.95);
        }
        p.stroke(ringColor.h, ringColor.s * 0.5, ringColor.b * 1.2, 0.6);
        p.strokeWeight(isHovered ? 2 : 1);
        
        const size = cubeSize * 0.9;
        const half = size / 2;
        
        // Top face
        p.beginShape();
        p.vertex(-half, 0, half);
        p.vertex(half, 0, half);
        p.vertex(half, 0, -half);
        p.vertex(-half, 0, -half);
        p.endShape(p.CLOSE);
        
        // Front face
        p.fill(ringColor.h, ringColor.s * (isVisited ? 0.7 : 0.25), ringColor.b * (isVisited ? 0.7 : 0.3), 0.9);
        p.beginShape();
        p.vertex(-half, 0, half);
        p.vertex(half, 0, half);
        p.vertex(half, tileHeight, half);
        p.vertex(-half, tileHeight, half);
        p.endShape(p.CLOSE);
        
        // Right face
        p.fill(ringColor.h, ringColor.s * (isVisited ? 0.6 : 0.2), ringColor.b * (isVisited ? 0.6 : 0.25), 0.85);
        p.beginShape();
        p.vertex(half, 0, half);
        p.vertex(half, 0, -half);
        p.vertex(half, tileHeight, -half);
        p.vertex(half, tileHeight, half);
        p.endShape(p.CLOSE);

        // Draw water pool on water tiles
        if (hasWater && isVisited) {
          drawPool(p, fragmentCount);
        }

        // Draw vegetation based on type
        if (isVisited && fragmentCount > 0 && !hasWater) {
          drawVegetation(p, vegetation, fragmentCount, ringColor);
        }

        // Draw rocks for quotes
        if (quotes.length > 0) {
          drawRocks(p, quotes, ringColor);
        }

        p.pop();
      };

      const drawPool = (p: p5, fragmentCount: number) => {
        // Animated water pool
        const ripple = Math.sin(p.frameCount * 0.03) * 2;
        const poolSize = 12 + fragmentCount * 2;
        
        // Water surface
        p.fill(200, 60, 55, 0.5);
        p.noStroke();
        p.ellipse(0, -0.5, poolSize + ripple, poolSize * 0.7 + ripple * 0.7);
        
        // Inner highlight
        p.fill(200, 40, 70, 0.4);
        p.ellipse(0, -0.5, poolSize * 0.6, poolSize * 0.4);
        
        // Animated ripples
        p.noFill();
        p.stroke(200, 30, 80, 0.3);
        p.strokeWeight(1);
        const ripplePhase = (p.frameCount * 0.02) % 1;
        p.ellipse(0, -0.5, poolSize * ripplePhase * 1.5, poolSize * 0.7 * ripplePhase * 1.5);
      };

      const drawWaterConnections = (p: p5) => {
        // Find water tiles and draw streams between adjacent ones
        const waterTiles: Array<{ row: number; col: number; x: number; z: number }> = [];
        const gridCenter = 3.5;
        
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const tile = getTileEcology(row, col);
            if (tile.hasWater && tile.isVisited) {
              waterTiles.push({
                row,
                col,
                x: (col - gridCenter) * cubeSize * 1.15,
                z: (row - gridCenter) * cubeSize * 1.15
              });
            }
          }
        }
        
        // Draw streams between adjacent water tiles
        p.noFill();
        p.stroke(200, 50, 65, 0.4);
        p.strokeWeight(3);
        
        waterTiles.forEach(tile => {
          // Check for adjacent water tiles
          waterTiles.forEach(other => {
            const dr = Math.abs(tile.row - other.row);
            const dc = Math.abs(tile.col - other.col);
            // Adjacent (not diagonal)
            if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
              // Draw curved stream with animation
              const flowOffset = Math.sin(p.frameCount * 0.04) * 3;
              const midX = (tile.x + other.x) / 2 + flowOffset;
              const midZ = (tile.z + other.z) / 2;
              
              p.beginShape();
              p.vertex(tile.x, -1, tile.z);
              p.quadraticVertex(midX, -2, midZ, other.x, -1, other.z);
              p.endShape();
            }
          });
        });
      };

      const drawVegetation = (
        p: p5, 
        type: VegetationType, 
        density: number,
        baseColor: { h: number; s: number; b: number }
      ) => {
        const vegetationCount = Math.min(density, 6);
        
        for (let i = 0; i < vegetationCount; i++) {
          const angle = (i / vegetationCount) * Math.PI * 2;
          const radius = 8 + Math.random() * 6;
          const vx = Math.cos(angle) * radius;
          const vz = Math.sin(angle) * radius;
          
          p.push();
          p.translate(vx, 0, vz);
          
          switch (type) {
            case 'dense_canopy':
            case 'ancient_trees':
              drawTree(p, 12 + density * 2, baseColor);
              break;
            case 'bamboo':
              drawBamboo(p, 10 + density, baseColor);
              break;
            case 'ferns':
            case 'wildflowers':
              drawFlower(p, 4 + Math.random() * 3, baseColor);
              break;
            case 'moss_lichen':
              drawMoss(p, baseColor);
              break;
            default:
              drawGrass(p, baseColor);
          }
          
          p.pop();
        }
      };

      const drawTree = (p: p5, height: number, base: { h: number; s: number; b: number }) => {
        // Trunk
        p.fill(30, 40, 35);
        p.noStroke();
        p.push();
        p.rotateX(Math.PI / 2);
        p.cylinder(1.5, height * 0.6);
        p.pop();
        
        // Canopy
        p.fill(base.h, base.s * 0.8, base.b * 1.1);
        p.push();
        p.translate(0, -height * 0.5, 0);
        p.sphere(height * 0.35);
        p.pop();
      };

      const drawBamboo = (p: p5, height: number, base: { h: number; s: number; b: number }) => {
        p.fill(100, 50, 50);
        p.noStroke();
        for (let i = 0; i < 3; i++) {
          p.push();
          p.translate(i * 2 - 2, -height / 2, 0);
          p.rotateX(Math.PI / 2);
          p.cylinder(0.8, height);
          p.pop();
        }
      };

      const drawFlower = (p: p5, height: number, base: { h: number; s: number; b: number }) => {
        // Stem
        p.fill(120, 50, 40);
        p.noStroke();
        p.push();
        p.translate(0, -height / 2, 0);
        p.rotateX(Math.PI / 2);
        p.cylinder(0.3, height);
        p.pop();
        
        // Flower head
        p.fill((base.h + 60) % 360, 70, 75);
        p.push();
        p.translate(0, -height, 0);
        p.sphere(1.5);
        p.pop();
      };

      const drawMoss = (p: p5, base: { h: number; s: number; b: number }) => {
        p.fill(base.h, base.s * 0.6, base.b * 0.8, 0.7);
        p.noStroke();
        p.ellipse(0, 0, 6, 4);
      };

      const drawGrass = (p: p5, base: { h: number; s: number; b: number }) => {
        p.stroke(80, 40, 50);
        p.strokeWeight(0.5);
        for (let i = 0; i < 3; i++) {
          const gx = (Math.random() - 0.5) * 4;
          const gz = (Math.random() - 0.5) * 4;
          p.line(gx, 0, gz, gx + (Math.random() - 0.5) * 2, -3 - Math.random() * 2, gz);
        }
      };

      const drawRocks = (p: p5, quotes: BluntQuote[], base: { h: number; s: number; b: number }) => {
        const rockType = getDominantRockFormation(quotes);
        
        p.fill(30, 15, 45);
        p.noStroke();
        
        switch (rockType) {
          case 'boulder':
            p.push();
            p.translate(0, -4, 0);
            p.scale(1, 0.7, 1);
            p.sphere(5);
            p.pop();
            break;
          case 'standing_stone':
            p.push();
            p.translate(0, -6, 0);
            p.rotateX(Math.PI / 2);
            p.cylinder(2, 12);
            p.pop();
            break;
          case 'monolith':
            p.push();
            p.translate(0, -8, 0);
            p.box(4, 16, 3);
            p.pop();
            break;
          case 'cairn':
            for (let i = 0; i < 3; i++) {
              p.push();
              p.translate(0, -2 - i * 2.5, 0);
              p.sphere(2.5 - i * 0.5);
              p.pop();
            }
            break;
          default:
            // Pebbles
            for (let i = 0; i < 3; i++) {
              p.push();
              p.translate((Math.random() - 0.5) * 8, -1, (Math.random() - 0.5) * 8);
              p.sphere(1 + Math.random());
              p.pop();
            }
        }
      };

      const drawParticles = (p: p5) => {
        particlesRef.current.forEach(particle => {
          particle.update(p.frameCount);
          
          if (!particle.isAlive()) {
            particle.reset(bounds);
          }
          
          const { config } = particle;
          const alpha = Math.min(1, particle.life / 50);
          const size = config.size.min + (config.size.max - config.size.min) * Math.random();
          
          p.push();
          p.translate(particle.x, particle.y, particle.z);
          
          // Draw particle based on type
          p.noStroke();
          
          switch (config.type) {
            case 'firefly':
              // Glowing firefly
              if (config.glow) {
                p.fill(config.color.h, config.color.s, config.color.b, alpha * 0.3);
                p.sphere(size * 2);
              }
              p.fill(config.color.h, config.color.s, config.color.b, alpha);
              p.sphere(size);
              break;
              
            case 'droplet':
              // Water droplet
              p.fill(config.color.h, config.color.s, config.color.b, alpha * 0.7);
              p.ellipsoid(size * 0.5, size, size * 0.5);
              break;
              
            case 'mist':
              // Soft mist cloud
              p.fill(config.color.h, config.color.s, config.color.b, alpha * 0.2);
              p.sphere(size);
              break;
              
            case 'leaf':
              // Falling leaf
              p.fill(config.color.h, config.color.s, config.color.b, alpha);
              p.rotateZ(p.frameCount * 0.05 + particle.phase);
              p.ellipse(0, 0, size, size * 0.5);
              break;
              
            case 'seed':
              // Rising seed
              p.fill(config.color.h, config.color.s, config.color.b, alpha * 0.8);
              p.ellipsoid(size * 0.3, size, size * 0.3);
              break;
              
            case 'snow':
              // Snowflake
              p.fill(config.color.h, config.color.s, config.color.b, alpha * 0.8);
              p.sphere(size * 0.5);
              break;
              
            case 'ripple':
              // Expanding ripple (rendered differently)
              p.noFill();
              p.stroke(config.color.h, config.color.s, config.color.b, alpha * 0.5);
              p.strokeWeight(1);
              const rippleSize = (1 - particle.life / particle.maxLife) * size * 3;
              p.ellipse(0, 0, rippleSize, rippleSize * 0.6);
              break;
          }
          
          p.pop();
        });
      };

      const drawCentralTree = (p: p5) => {
        // Large central tree representing PRD
        p.push();
        p.translate(0, 0, 0);
        
        // Trunk
        p.fill(25, 50, 30);
        p.noStroke();
        p.push();
        p.rotateX(Math.PI / 2);
        p.cylinder(8, 60);
        p.pop();
        
        // Canopy layers
        const canopyColors = [
          { h: palette.accent.h, s: 50, b: 45 },
          { h: palette.highlight.h, s: 45, b: 55 },
          { h: palette.base.h, s: 40, b: 50 },
        ];
        
        for (let i = 0; i < 3; i++) {
          p.fill(canopyColors[i].h, canopyColors[i].s, canopyColors[i].b, 0.85);
          p.push();
          p.translate(0, -35 - i * 12, 0);
          p.sphere(20 - i * 4);
          p.pop();
        }
        
        p.pop();
      };

      const draw2DOverlay = (p: p5) => {
        p.push();
        // Reset to 2D context
        p.resetMatrix();
        p.camera();
        
        // Title
        p.fill(255);
        p.noStroke();
        p.textSize(11);
        p.textAlign(p.LEFT, p.TOP);
        p.text('64-Tile Ecological Garden', 16, 16);
        
        // Nature mode indicator
        if (currentNatureMode) {
          const mode = NATURE_COGNITIVE_MODES[currentNatureMode];
          p.textSize(10);
          p.fill(200);
          p.text(`${mode.icon} ${mode.name}`, 16, 32);
        }
        
        // Particle count indicator
        p.textSize(9);
        p.fill(150);
        p.text(`Particles: ${particlesRef.current.length}`, 16, 48);
        
        p.pop();
      };

      // Mouse controls
      p.mousePressed = () => {
        if (p.mouseX > 0 && p.mouseX < width && p.mouseY > 0 && p.mouseY < height) {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseReleased = () => {
        isDraggingRef.current = false;
      };

      p.mouseDragged = () => {
        if (isDraggingRef.current) {
          const dx = p.mouseX - lastMouseRef.current.x;
          const dy = p.mouseY - lastMouseRef.current.y;
          
          rotationRef.current.y += dx * 0.01;
          rotationRef.current.x += dy * 0.01;
          rotationRef.current.x = p.constrain(rotationRef.current.x, -1.2, -0.2);
          
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseWheel = (event: WheelEvent) => {
        const delta = event.deltaY > 0 ? -0.05 : 0.05;
        zoomRef.current = p.constrain(zoomRef.current + delta, 0.5, 2);
        return false;
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, [garden, tileData, visitedTiles, currentNatureMode, getTileEcology, palette]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[500px] rounded-lg overflow-hidden bg-gradient-to-b from-background/50 to-muted/30"
      style={{ touchAction: 'none' }}
    />
  );
}
