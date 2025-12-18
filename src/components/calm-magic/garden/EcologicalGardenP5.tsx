import React, { useRef, useEffect, useState, useCallback } from 'react';
import p5 from 'p5';
import { RingLevel, getTileRing } from '@/utils/ringToleranceSystem';
import { 
  NatureCognitiveMode, 
  NATURE_COGNITIVE_MODES, 
  VegetationType, 
  getVegetationType, 
  getTerrainType 
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
    base: { h: 280, s: 30, b: 25 },      // Deep purple base
    accent: { h: 320, s: 50, b: 60 },    // Rose accent
    highlight: { h: 200, s: 60, b: 70 }, // Cyan highlight
  },
  systems: {
    base: { h: 200, s: 35, b: 20 },      // Deep blue base
    accent: { h: 160, s: 50, b: 55 },    // Teal accent
    highlight: { h: 45, s: 70, b: 75 },  // Amber highlight
  },
  prototypes: {
    base: { h: 120, s: 30, b: 22 },      // Deep green base
    accent: { h: 80, s: 50, b: 60 },     // Lime accent
    highlight: { h: 340, s: 60, b: 70 }, // Rose highlight
  }
};

// Ring colors (matching tolerance system)
const RING_COLORS: Record<RingLevel, { h: number; s: number; b: number }> = {
  1: { h: 210, s: 70, b: 50 },  // Blue - Calmness
  2: { h: 270, s: 60, b: 50 },  // Purple - Spaciousness
  3: { h: 142, s: 71, b: 45 },  // Green - Openness
  4: { h: 45, s: 93, b: 47 },   // Amber - Freedom
};

export default function EcologicalGardenP5({
  garden,
  tileData,
  visitedTiles,
  currentNatureMode,
  onTileClick
}: EcologicalGardenP5Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  
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
    
    const vegetation = getVegetationType(
      data.fragmentCount,
      data.quotes.length > 0,
      0, // connection count - could be enhanced
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
      isVisited
    };
  }, [tileData, visitedTiles, currentNatureMode]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let width = containerRef.current?.clientWidth || 800;
      let height = containerRef.current?.clientHeight || 500;

      p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        p.colorMode(p.HSB, 360, 100, 100, 1);
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

        // Draw central PRD tree marker
        drawCentralTree(p);

        p.pop();

        // 2D overlay
        draw2DOverlay(p);
      };

      const drawEcologicalTile = (p: p5, tile: TileEcology) => {
        const { row, col, fragmentCount, quotes, vegetation, ring, isVisited } = tile;
        
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
        
        // Top face
        p.fill(ringColor.h, ringColor.s * (isVisited ? 0.8 : 0.3), ringColor.b * (isVisited ? 0.9 : 0.4), 0.95);
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

        // Draw vegetation based on type
        if (isVisited && fragmentCount > 0) {
          drawVegetation(p, vegetation, fragmentCount, ringColor);
        }

        // Draw rocks for quotes
        if (quotes.length > 0) {
          drawRocks(p, quotes, ringColor);
        }

        p.pop();
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
