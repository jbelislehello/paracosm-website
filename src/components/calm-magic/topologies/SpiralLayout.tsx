import { useRef, useEffect, useCallback } from 'react';
import p5 from 'p5';
import { ManifoldSeason, SEASON_HEX_COLORS, getTileAcronym } from '@/utils/torusManifoldMath';
import { RingLevel, getTileRing } from '@/utils/ringToleranceSystem';

interface SpiralLayoutProps {
  selectedTile: { row: number; col: number };
  season: ManifoldSeason;
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  currentUnlockedRing: RingLevel;
  onTileClick?: (row: number, col: number) => void;
  densityMap?: Map<string, number>;
}

export function SpiralLayout({
  selectedTile,
  season,
  visitedTiles,
  journeyPath,
  currentUnlockedRing,
  onTileClick,
  densityMap = new Map()
}: SpiralLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  // Generate spiral order for all 64 tiles
  const getSpiralOrder = useCallback(() => {
    const order: Array<{ row: number; col: number; spiralIndex: number }> = [];
    
    // Start from center (3,3) and spiral outward
    const visited = new Set<string>();
    let row = 3, col = 3;
    let direction = 0; // 0=right, 1=down, 2=left, 3=up
    let stepsInDirection = 1;
    let stepsTaken = 0;
    let directionChanges = 0;
    
    for (let i = 0; i < 64; i++) {
      if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        const key = `${row}-${col}`;
        if (!visited.has(key)) {
          visited.add(key);
          order.push({ row, col, spiralIndex: order.length });
        }
      }
      
      // Move in current direction
      stepsTaken++;
      switch (direction) {
        case 0: col++; break;
        case 1: row++; break;
        case 2: col--; break;
        case 3: row--; break;
      }
      
      // Check if we need to change direction
      if (stepsTaken >= stepsInDirection) {
        stepsTaken = 0;
        direction = (direction + 1) % 4;
        directionChanges++;
        if (directionChanges % 2 === 0) {
          stepsInDirection++;
        }
      }
    }
    
    // Fill any missing tiles
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const key = `${r}-${c}`;
        if (!visited.has(key)) {
          order.push({ row: r, col: c, spiralIndex: order.length });
        }
      }
    }
    
    return order;
  }, []);

  // Calculate spiral position for a tile
  const getSpiralPosition = useCallback((row: number, col: number, width: number, height: number) => {
    const spiralOrder = getSpiralOrder();
    const tileInfo = spiralOrder.find(t => t.row === row && t.col === col);
    const spiralIndex = tileInfo?.spiralIndex || 0;
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Archimedean spiral: r = a + b*theta
    const a = 20; // Starting radius
    const b = 8; // Growth rate
    const theta = spiralIndex * 0.4; // Angle increment per tile
    
    const r = a + b * theta;
    const x = centerX + r * Math.cos(theta - Math.PI / 2);
    const y = centerY + r * Math.sin(theta - Math.PI / 2);
    
    return { x, y, theta, r };
  }, [getSpiralOrder]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let width = containerRef.current?.clientWidth || 800;
      let height = containerRef.current?.clientHeight || 600;
      let hoveredTile: { row: number; col: number } | null = null;
      let animationOffset = 0;

      p.setup = () => {
        p.createCanvas(width, height);
        p.textFont('monospace');
      };

      p.windowResized = () => {
        width = containerRef.current?.clientWidth || 800;
        height = containerRef.current?.clientHeight || 600;
        p.resizeCanvas(width, height);
      };

      p.draw = () => {
        p.background(15, 18, 25);
        animationOffset += 0.01;
        
        // Draw spiral guide lines
        drawSpiralGuide(p, width, height);
        
        // Draw ring indicators
        drawRingIndicators(p, width, height);
        
        // Draw journey path first (behind tiles)
        if (journeyPath.length > 1) {
          drawJourneyPath(p, width, height);
        }
        
        // Draw all tiles
        const spiralOrder = getSpiralOrder();
        spiralOrder.forEach(({ row, col }) => {
          drawTile(p, row, col, width, height, hoveredTile, animationOffset);
        });
        
        // Draw center origin marker
        drawCenterMarker(p, width, height);
      };

      const drawSpiralGuide = (p: p5, w: number, h: number) => {
        p.push();
        p.noFill();
        p.stroke(40, 50, 60, 40);
        p.strokeWeight(1);
        
        const centerX = w / 2;
        const centerY = h / 2;
        
        // Draw spiral path
        p.beginShape();
        for (let i = 0; i < 200; i++) {
          const theta = i * 0.4;
          const r = 20 + 8 * theta;
          const x = centerX + r * Math.cos(theta - Math.PI / 2);
          const y = centerY + r * Math.sin(theta - Math.PI / 2);
          p.vertex(x, y);
        }
        p.endShape();
        
        p.pop();
      };

      const drawRingIndicators = (p: p5, w: number, h: number) => {
        p.push();
        p.noFill();
        p.strokeWeight(1);
        
        const centerX = w / 2;
        const centerY = h / 2;
        const ringColors = [
          'rgba(139, 92, 246, 0.3)',
          'rgba(59, 130, 246, 0.3)',
          'rgba(16, 185, 129, 0.3)',
          'rgba(245, 158, 11, 0.3)'
        ];
        const ringRadii = [80, 140, 200, 260];
        
        ringRadii.forEach((radius, i) => {
          p.stroke(ringColors[i]);
          p.ellipse(centerX, centerY, radius * 2, radius * 2);
        });
        
        // Ring labels
        p.textSize(9);
        p.noStroke();
        p.textAlign(p.LEFT, p.CENTER);
        const labels = ['Ring 1: Inner', 'Ring 2: Stretch', 'Ring 3: Edge', 'Ring 4: Full'];
        const labelColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
        
        labels.forEach((label, i) => {
          p.fill(labelColors[i]);
          p.text(label, centerX + ringRadii[i] + 10, centerY - ringRadii[i] + 30);
        });
        
        p.pop();
      };

      const drawTile = (
        p: p5, 
        row: number, 
        col: number, 
        w: number, 
        h: number, 
        hovered: { row: number; col: number } | null,
        animOffset: number
      ) => {
        const pos = getSpiralPosition(row, col, w, h);
        const tileKey = `${row}-${col}`;
        const isVisited = visitedTiles.has(tileKey);
        const isSelected = selectedTile.row === row && selectedTile.col === col;
        const ring = getTileRing(row, col);
        const isAccessible = ring <= currentUnlockedRing;
        const isHovered = hovered?.row === row && hovered?.col === col;
        const density = densityMap.get(tileKey) || 0;
        
        const baseSize = 24;
        const tileSize = baseSize + density * 4;
        
        // Subtle floating animation
        const floatOffset = Math.sin(animOffset * 2 + pos.theta) * 2;
        
        p.push();
        p.translate(pos.x, pos.y + floatOffset);
        
        // Glow for selected
        if (isSelected) {
          p.noStroke();
          const seasonColor = SEASON_HEX_COLORS[season];
          p.fill(
            (seasonColor >> 16) & 255,
            (seasonColor >> 8) & 255,
            seasonColor & 255,
            30
          );
          p.ellipse(0, 0, tileSize * 2.5, tileSize * 2.5);
        }
        
        // Ring-based coloring
        const ringColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
        const ringColor = p.color(ringColors[ring - 1] || '#ffffff');
        
        if (!isAccessible) {
          p.fill(30, 35, 45, 80);
          p.stroke(50, 55, 65, 60);
        } else if (isSelected) {
          p.fill(p.red(ringColor), p.green(ringColor), p.blue(ringColor), 240);
          p.stroke(255, 255, 255, 220);
          p.strokeWeight(2);
        } else if (isVisited) {
          p.fill(p.red(ringColor), p.green(ringColor), p.blue(ringColor), 180);
          p.stroke(255, 255, 255, 100);
        } else {
          p.fill(40, 50, 60, isHovered ? 160 : 100);
          p.stroke(80, 100, 120, isHovered ? 180 : 80);
        }
        
        p.strokeWeight(isSelected ? 2 : 1);
        p.ellipse(0, 0, tileSize, tileSize);
        
        // Tile label
        if (isAccessible) {
          const acronym = getTileAcronym(row, col);
          p.fill(255, 255, 255, isVisited || isSelected ? 255 : 120);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(7);
          p.text(acronym, 0, 0);
        }
        
        p.pop();
      };

      const drawJourneyPath = (p: p5, w: number, h: number) => {
        if (journeyPath.length < 2) return;
        
        p.push();
        p.strokeWeight(2);
        p.noFill();
        
        for (let i = 0; i < journeyPath.length - 1; i++) {
          const from = getSpiralPosition(journeyPath[i].row, journeyPath[i].col, w, h);
          const to = getSpiralPosition(journeyPath[i + 1].row, journeyPath[i + 1].col, w, h);
          
          const progress = i / (journeyPath.length - 1);
          p.stroke(
            p.lerp(100, 255, progress),
            p.lerp(150, 200, progress),
            p.lerp(255, 100, progress),
            120
          );
          
          // Curved line using bezier
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const offset = 20;
          
          p.bezier(
            from.x, from.y,
            midX + offset, midY - offset,
            midX - offset, midY + offset,
            to.x, to.y
          );
        }
        
        p.pop();
      };

      const drawCenterMarker = (p: p5, w: number, h: number) => {
        const centerX = w / 2;
        const centerY = h / 2;
        
        p.push();
        
        // Pulsing center
        const pulse = Math.sin(p.frameCount * 0.05) * 0.3 + 0.7;
        
        p.noStroke();
        p.fill(255, 255, 255, 20 * pulse);
        p.ellipse(centerX, centerY, 40, 40);
        
        p.fill(255, 255, 255, 60 * pulse);
        p.ellipse(centerX, centerY, 20, 20);
        
        p.fill(255, 255, 255, 150);
        p.ellipse(centerX, centerY, 8, 8);
        
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(9);
        p.fill(150, 150, 150);
        p.text('ORIGIN', centerX, centerY + 25);
        
        p.pop();
      };

      p.mousePressed = () => {
        if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
        
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const pos = getSpiralPosition(row, col, width, height);
            const dist = p.dist(p.mouseX, p.mouseY, pos.x, pos.y);
            
            if (dist < 15) {
              const ring = getTileRing(row, col);
              if (ring <= currentUnlockedRing && onTileClick) {
                onTileClick(row, col);
              }
              return;
            }
          }
        }
      };

      p.mouseMoved = () => {
        hoveredTile = null;
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const pos = getSpiralPosition(row, col, width, height);
            const dist = p.dist(p.mouseX, p.mouseY, pos.x, pos.y);
            
            if (dist < 15) {
              hoveredTile = { row, col };
              return;
            }
          }
        }
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, [selectedTile, season, visitedTiles, journeyPath, currentUnlockedRing, onTileClick, densityMap, getSpiralPosition, getSpiralOrder]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
