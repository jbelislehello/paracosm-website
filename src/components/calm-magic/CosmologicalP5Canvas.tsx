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
      
      // Enhanced diagonal particle system
      interface DiagonalParticle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        maxLife: number;
        size: number;
        color: { r: number; g: number; b: number };
        type: 'trail' | 'spark' | 'burst' | 'comet';
      }
      let diagonalParticles: DiagonalParticle[] = [];
      let diagonalTrailPoints: { x: number; y: number; alpha: number }[] = [];
      let lastDiagonalSpawnTime = 0;
      let burstTriggered = false;

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

      // Spawn diagonal pathway particles
      const spawnDiagonalParticles = (fromX: number, fromY: number, toX: number, toY: number) => {
        const now = p.millis();
        if (now - lastDiagonalSpawnTime < 50) return; // Throttle spawning
        lastDiagonalSpawnTime = now;

        const dx = toX - fromX;
        const dy = toY - fromY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Comet head particles
        for (let i = 0; i < 3; i++) {
          const progress = (p.frameCount * 0.015 + i * 0.3) % 1;
          const px = fromX + dx * progress;
          const py = fromY + dy * progress;
          
          diagonalParticles.push({
            x: px,
            y: py,
            vx: Math.cos(angle) * 2 + (Math.random() - 0.5) * 0.5,
            vy: Math.sin(angle) * 2 + (Math.random() - 0.5) * 0.5,
            life: 1,
            maxLife: 1,
            size: 10 + Math.random() * 5,
            color: { r: 255, g: 200 + Math.random() * 55, b: 100 },
            type: 'comet',
          });
        }

        // Trail particles
        for (let i = 0; i < 8; i++) {
          const progress = Math.random();
          const px = fromX + dx * progress;
          const py = fromY + dy * progress;
          const perpAngle = angle + Math.PI / 2;
          const offset = (Math.random() - 0.5) * 20;

          diagonalParticles.push({
            x: px + Math.cos(perpAngle) * offset,
            y: py + Math.sin(perpAngle) * offset,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            life: 0.5 + Math.random() * 0.5,
            maxLife: 0.5 + Math.random() * 0.5,
            size: 3 + Math.random() * 4,
            color: { r: 255, g: 180 + Math.random() * 75, b: 50 + Math.random() * 100 },
            type: 'trail',
          });
        }

        // Sparkle particles
        for (let i = 0; i < 2; i++) {
          const progress = Math.random();
          const px = fromX + dx * progress;
          const py = fromY + dy * progress;

          diagonalParticles.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 0.3 + Math.random() * 0.4,
            maxLife: 0.3 + Math.random() * 0.4,
            size: 2 + Math.random() * 3,
            color: { r: 255, g: 255, b: 200 + Math.random() * 55 },
            type: 'spark',
          });
        }

        // Store trail points for ribbon effect
        const numPoints = 20;
        for (let i = 0; i < numPoints; i++) {
          const t = i / numPoints;
          diagonalTrailPoints.push({
            x: fromX + dx * t,
            y: fromY + dy * t,
            alpha: 1 - t * 0.5,
          });
        }
      };

      // Spawn burst particles at destination
      const spawnBurstAtDestination = (x: number, y: number) => {
        for (let i = 0; i < 20; i++) {
          const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.3;
          const speed = 2 + Math.random() * 4;

          diagonalParticles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0.6 + Math.random() * 0.4,
            maxLife: 0.6 + Math.random() * 0.4,
            size: 4 + Math.random() * 6,
            color: { r: 200 + Math.random() * 55, g: 100 + Math.random() * 100, b: 255 },
            type: 'burst',
          });
        }

        // Inner ring
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI * 2 * i) / 12;
          const speed = 1 + Math.random() * 2;

          diagonalParticles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0.8 + Math.random() * 0.2,
            maxLife: 0.8 + Math.random() * 0.2,
            size: 6 + Math.random() * 4,
            color: { r: 255, g: 220, b: 100 },
            type: 'burst',
          });
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
        
        // Spawn new particles
        spawnDiagonalParticles(from.x, from.y, to.x, to.y);
        
        // Trigger burst at destination once
        if (!burstTriggered) {
          burstTriggered = true;
          spawnBurstAtDestination(to.x, to.y);
        }
        
        // Draw glowing base line with gradient
        const gradient = p.drawingContext as CanvasRenderingContext2D;
        const lineGradient = gradient.createLinearGradient(from.x, from.y, to.x, to.y);
        lineGradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
        lineGradient.addColorStop(0.5, 'rgba(255, 150, 255, 0.6)');
        lineGradient.addColorStop(1, 'rgba(200, 100, 255, 0.8)');
        
        gradient.strokeStyle = lineGradient;
        gradient.lineWidth = 4;
        gradient.shadowBlur = 15;
        gradient.shadowColor = 'rgba(255, 200, 100, 0.6)';
        gradient.beginPath();
        gradient.moveTo(from.x, from.y);
        gradient.lineTo(to.x, to.y);
        gradient.stroke();
        gradient.shadowBlur = 0;
        
        // Draw energy ribbon trail
        if (diagonalTrailPoints.length > 1) {
          p.noFill();
          p.strokeWeight(8);
          for (let i = 1; i < diagonalTrailPoints.length; i++) {
            const alpha = diagonalTrailPoints[i].alpha * 100;
            p.stroke(255, 200, 100, alpha);
            p.line(
              diagonalTrailPoints[i - 1].x, 
              diagonalTrailPoints[i - 1].y,
              diagonalTrailPoints[i].x, 
              diagonalTrailPoints[i].y
            );
          }
        }
        
        // Draw all particle types
        diagonalParticles.forEach(particle => {
          const lifeRatio = particle.life / particle.maxLife;
          const alpha = lifeRatio * 255;
          const { r, g, b } = particle.color;
          
          p.noStroke();
          
          switch (particle.type) {
            case 'comet':
              // Glowing comet head
              p.fill(r, g, b, alpha * 0.3);
              p.circle(particle.x, particle.y, particle.size * 2);
              p.fill(r, g, b, alpha * 0.6);
              p.circle(particle.x, particle.y, particle.size * 1.2);
              p.fill(255, 255, 255, alpha);
              p.circle(particle.x, particle.y, particle.size * 0.5);
              break;
              
            case 'trail':
              // Soft trail particles
              p.fill(r, g, b, alpha * 0.7);
              p.circle(particle.x, particle.y, particle.size * lifeRatio);
              break;
              
            case 'spark':
              // Sharp sparkle with star shape
              p.fill(r, g, b, alpha);
              p.push();
              p.translate(particle.x, particle.y);
              p.rotate(p.frameCount * 0.2);
              const sparkSize = particle.size * lifeRatio;
              for (let i = 0; i < 4; i++) {
                p.rotate(p.PI / 2);
                p.triangle(0, 0, -sparkSize * 0.3, -sparkSize, sparkSize * 0.3, -sparkSize);
              }
              p.pop();
              break;
              
            case 'burst':
              // Explosion burst with glow
              p.fill(r, g, b, alpha * 0.5);
              p.circle(particle.x, particle.y, particle.size * 1.5 * lifeRatio);
              p.fill(255, 255, 255, alpha * 0.8);
              p.circle(particle.x, particle.y, particle.size * 0.6 * lifeRatio);
              break;
          }
        });
        
        // Draw pulsing orbs at endpoints
        const pulse = Math.sin(p.frameCount * 0.15) * 0.3 + 0.7;
        
        // Source orb
        p.fill(255, 220, 100, 150 * pulse);
        p.circle(from.x, from.y, 25 * pulse);
        p.fill(255, 255, 255, 200);
        p.circle(from.x, from.y, 8);
        
        // Destination orb
        p.fill(200, 100, 255, 180 * pulse);
        p.circle(to.x, to.y, 30 * pulse);
        p.fill(255, 255, 255, 200);
        p.circle(to.x, to.y, 10);
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
        // Update diagonal particles
        diagonalParticles = diagonalParticles.filter(particle => particle.life > 0);
        diagonalParticles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life -= 0.02;
          
          // Add some drag
          particle.vx *= 0.98;
          particle.vy *= 0.98;
          
          // Gravity for burst particles
          if (particle.type === 'burst') {
            particle.vy += 0.05;
          }
        });
        
        // Fade trail points
        diagonalTrailPoints = diagonalTrailPoints.filter(pt => pt.alpha > 0.05);
        diagonalTrailPoints.forEach(pt => {
          pt.alpha *= 0.95;
        });
        
        // Reset burst trigger when diagonal path ends
        if (!diagonalPathActive) {
          burstTriggered = false;
          diagonalParticles = [];
          diagonalTrailPoints = [];
        }
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
