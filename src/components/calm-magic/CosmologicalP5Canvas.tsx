import { useEffect, useRef, useState, useCallback } from 'react';
import p5 from 'p5';
import { 
  getTileCosmology, 
  isPortalDay, 
  getKinForTile,
  getCastleForKin,
  CASTLES,
  TileCosmology 
} from '@/data/cosmologicalMapping';

interface CosmologicalP5CanvasProps {
  season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  selectedTile?: { row: number; col: number } | null;
  visitedTiles?: Set<string>;
  onTileClick?: (row: number, col: number) => void;
  highlightedPortals?: number[];
  diagonalPathActive?: { from: { row: number; col: number }; to: { row: number; col: number } } | null;
}

const CosmologicalP5Canvas = ({
  season,
  selectedTile,
  visitedTiles = new Set(),
  onTileClick,
  highlightedPortals = [],
  diagonalPathActive,
}: CosmologicalP5CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ row: number; col: number } | null>(null);

  const GRID_SIZE = 8;
  const TILE_SIZE = 56;
  const GAP = 4;
  const PADDING = 40;
  const CANVAS_SIZE = GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * GAP + PADDING * 2;

  const getTilePosition = useCallback((row: number, col: number) => {
    return {
      x: PADDING + col * (TILE_SIZE + GAP) + TILE_SIZE / 2,
      y: PADDING + (7 - row) * (TILE_SIZE + GAP) + TILE_SIZE / 2, // Flip Y for visual display
    };
  }, []);

  const initSketch = useCallback(() => {
    if (!containerRef.current) return;

    // Cleanup previous instance
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const sketch = (p: p5) => {
      let rotation = 0;
      let portalParticles: { x: number; y: number; angle: number; speed: number; tileId: number }[] = [];
      let diagonalParticles: { x: number; y: number; progress: number; fromX: number; fromY: number; toX: number; toY: number }[] = [];

      p.setup = () => {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.frameRate(30);
        
        // Initialize portal particles
        initPortalParticles();
      };

      const initPortalParticles = () => {
        portalParticles = [];
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const tileId = row * 8 + col + 1;
            const kin = getKinForTile(tileId, season);
            
            if (isPortalDay(kin)) {
              const pos = getTilePosition(row, col);
              for (let i = 0; i < 5; i++) {
                portalParticles.push({
                  x: pos.x,
                  y: pos.y,
                  angle: (Math.PI * 2 * i) / 5,
                  speed: 0.02 + Math.random() * 0.01,
                  tileId,
                });
              }
            }
          }
        }
      };

      p.draw = () => {
        p.background(20, 20, 25);
        rotation += 0.005;

        // Draw castle quadrant backgrounds
        drawCastleRegions(p);

        // Draw wavespell wave patterns
        drawWavespellPatterns(p, rotation);

        // Draw grid base
        drawGridBase(p);

        // Draw tiles
        drawTiles(p, rotation);

        // Draw portal vortexes
        drawPortalVortexes(p, rotation);

        // Draw diagonal path animation
        if (diagonalPathActive) {
          drawDiagonalPath(p);
        }

        // Draw hexagram overlay on hovered tile
        if (hoveredTile) {
          drawHexagramOverlay(p, hoveredTile);
        }

        // Update particles
        updateParticles();
      };

      const drawCastleRegions = (p: p5) => {
        const castle = CASTLES.find(c => c.season === season);
        if (!castle) return;

        // Draw subtle castle color overlay
        p.noStroke();
        p.fill(p.color(castle.color + '15'));
        p.rect(PADDING - 10, PADDING - 10, 
               GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * GAP + 20, 
               GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * GAP + 20,
               12);

        // Draw castle boundary glow
        p.noFill();
        p.strokeWeight(2);
        p.stroke(p.color(castle.color + '60'));
        p.rect(PADDING - 10, PADDING - 10, 
               GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * GAP + 20, 
               GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * GAP + 20,
               12);
      };

      const drawWavespellPatterns = (p: p5, rotation: number) => {
        p.noFill();
        p.strokeWeight(1);
        
        // Draw 4 wavespell wave lines
        for (let ws = 0; ws < 4; ws++) {
          const yOffset = PADDING + (ws * 2 + 0.5) * (TILE_SIZE + GAP);
          
          p.stroke(255, 255, 255, 30);
          p.beginShape();
          for (let x = PADDING; x < CANVAS_SIZE - PADDING; x += 5) {
            const wave = Math.sin((x - rotation * 50) * 0.05 + ws) * 8;
            p.vertex(x, yOffset + wave);
          }
          p.endShape();
        }
      };

      const drawGridBase = (p: p5) => {
        // Draw diagonal fan lines
        p.stroke(255, 255, 255, 20);
        p.strokeWeight(1);
        
        for (let i = 0; i < GRID_SIZE; i++) {
          // From bottom-left corner going up-right
          const startX = PADDING + i * (TILE_SIZE + GAP);
          const startY = CANVAS_SIZE - PADDING;
          const endX = CANVAS_SIZE - PADDING;
          const endY = PADDING + (GRID_SIZE - 1 - i) * (TILE_SIZE + GAP);
          
          p.line(startX, startY, endX, endY);
        }
      };

      const drawTiles = (p: p5, rotation: number) => {
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const tileId = row * 8 + col + 1;
            const pos = getTilePosition(row, col);
            const tileKey = `${row}-${col}`;
            const isVisited = visitedTiles.has(tileKey);
            const isSelected = selectedTile?.row === row && selectedTile?.col === col;
            const isHovered = hoveredTile?.row === row && hoveredTile?.col === col;
            
            const cosmology = getTileCosmology(tileId, season);
            const kin = cosmology.kin;
            const isPortal = cosmology.isPortalDay;

            // Tile background
            p.noStroke();
            if (isSelected) {
              p.fill(100, 200, 255, 180);
            } else if (isVisited) {
              p.fill(80, 180, 120, 150);
            } else if (isHovered) {
              p.fill(255, 255, 255, 50);
            } else {
              p.fill(40, 40, 50, 150);
            }

            // Portal tiles get special treatment
            if (isPortal) {
              const pulse = Math.sin(rotation * 4 + row + col) * 0.2 + 0.8;
              p.fill(p.lerpColor(p.color(40, 40, 50), p.color(200, 100, 255), pulse * 0.5));
            }

            p.rect(pos.x - TILE_SIZE / 2, pos.y - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, 6);

            // Draw hexagram number
            p.fill(255, 255, 255, isPortal ? 255 : 180);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(10);
            p.text(cosmology.hexagram.number.toString(), pos.x, pos.y - 10);

            // Draw Tzolkin seal glyph
            p.textSize(16);
            p.text(cosmology.seal.glyph, pos.x, pos.y + 8);

            // Portal indicator
            if (isPortal) {
              p.noFill();
              p.stroke(200, 100, 255, 150);
              p.strokeWeight(2);
              p.circle(pos.x, pos.y, TILE_SIZE - 8);
            }

            // Selected ring
            if (isSelected) {
              p.noFill();
              p.stroke(100, 200, 255);
              p.strokeWeight(3);
              p.rect(pos.x - TILE_SIZE / 2 - 2, pos.y - TILE_SIZE / 2 - 2, TILE_SIZE + 4, TILE_SIZE + 4, 8);
            }
          }
        }
      };

      const drawPortalVortexes = (p: p5, rotation: number) => {
        portalParticles.forEach(particle => {
          const radius = 20 + Math.sin(rotation * 3 + particle.angle) * 5;
          const x = particle.x + Math.cos(particle.angle + rotation * 2) * radius;
          const y = particle.y + Math.sin(particle.angle + rotation * 2) * radius;
          
          p.noStroke();
          p.fill(200, 100, 255, 100);
          p.circle(x, y, 4);
          
          particle.angle += particle.speed;
        });
      };

      const drawDiagonalPath = (p: p5) => {
        if (!diagonalPathActive) return;
        
        const from = getTilePosition(diagonalPathActive.from.row, diagonalPathActive.from.col);
        const to = getTilePosition(diagonalPathActive.to.row, diagonalPathActive.to.col);
        
        // Animated line
        p.stroke(255, 200, 100);
        p.strokeWeight(3);
        p.line(from.x, from.y, to.x, to.y);
        
        // Particles along path
        const particleCount = 5;
        for (let i = 0; i < particleCount; i++) {
          const t = ((p.frameCount * 0.02 + i / particleCount) % 1);
          const px = p.lerp(from.x, to.x, t);
          const py = p.lerp(from.y, to.y, t);
          
          p.noStroke();
          p.fill(255, 220, 100, 200 * (1 - t));
          p.circle(px, py, 8 * (1 - t * 0.5));
        }
      };

      const drawHexagramOverlay = (p: p5, tile: { row: number; col: number }) => {
        const tileId = tile.row * 8 + tile.col + 1;
        const cosmology = getTileCosmology(tileId, season);
        const pos = getTilePosition(tile.row, tile.col);
        
        // Draw hexagram lines to the right of the tile
        const hexX = pos.x + TILE_SIZE / 2 + 15;
        const hexY = pos.y - 20;
        const lineWidth = 20;
        const lineHeight = 5;
        const lineGap = 3;
        
        p.noStroke();
        
        cosmology.hexagram.lines.forEach((solid, idx) => {
          const y = hexY + (5 - idx) * (lineHeight + lineGap);
          
          if (solid) {
            // Solid yang line
            p.fill(255, 255, 255, 200);
            p.rect(hexX, y, lineWidth, lineHeight, 1);
          } else {
            // Broken yin line
            p.fill(255, 255, 255, 200);
            p.rect(hexX, y, lineWidth * 0.4, lineHeight, 1);
            p.rect(hexX + lineWidth * 0.6, y, lineWidth * 0.4, lineHeight, 1);
          }
        });
      };

      const updateParticles = () => {
        // Update diagonal particles if active
        diagonalParticles = diagonalParticles.filter(p => p.progress < 1);
        diagonalParticles.forEach(p => {
          p.progress += 0.02;
          p.x = p5.prototype.lerp(p.fromX, p.toX, p.progress);
          p.y = p5.prototype.lerp(p.fromY, p.toY, p.progress);
        });
      };

      p.mousePressed = () => {
        const mouseX = p.mouseX;
        const mouseY = p.mouseY;
        
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const pos = getTilePosition(row, col);
            if (
              mouseX > pos.x - TILE_SIZE / 2 &&
              mouseX < pos.x + TILE_SIZE / 2 &&
              mouseY > pos.y - TILE_SIZE / 2 &&
              mouseY < pos.y + TILE_SIZE / 2
            ) {
              onTileClick?.(row, col);
              return;
            }
          }
        }
      };

      p.mouseMoved = () => {
        const mouseX = p.mouseX;
        const mouseY = p.mouseY;
        
        let found = false;
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const pos = getTilePosition(row, col);
            if (
              mouseX > pos.x - TILE_SIZE / 2 &&
              mouseX < pos.x + TILE_SIZE / 2 &&
              mouseY > pos.y - TILE_SIZE / 2 &&
              mouseY < pos.y + TILE_SIZE / 2
            ) {
              setHoveredTile({ row, col });
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (!found) {
          setHoveredTile(null);
        }
      };
    };

    p5InstanceRef.current = new p5(sketch, containerRef.current);
  }, [season, selectedTile, visitedTiles, onTileClick, diagonalPathActive, getTilePosition, hoveredTile]);

  useEffect(() => {
    initSketch();
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [initSketch]);

  return (
    <div 
      ref={containerRef} 
      className="rounded-lg overflow-hidden bg-background/50"
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
    />
  );
};

export default CosmologicalP5Canvas;
