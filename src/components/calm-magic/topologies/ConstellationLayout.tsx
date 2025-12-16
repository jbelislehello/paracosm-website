import { useRef, useEffect, useCallback, useState } from 'react';
import p5 from 'p5';
import { ManifoldSeason, SEASON_HEX_COLORS, getTileAcronym } from '@/utils/torusManifoldMath';
import { RingLevel, getTileRing } from '@/utils/ringToleranceSystem';

interface ConstellationLayoutProps {
  selectedTile: { row: number; col: number };
  season: ManifoldSeason;
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  currentUnlockedRing: RingLevel;
  onTileClick?: (row: number, col: number) => void;
  densityMap?: Map<string, number>;
}

interface StarPosition {
  row: number;
  col: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function ConstellationLayout({
  selectedTile,
  season,
  visitedTiles,
  journeyPath,
  currentUnlockedRing,
  onTileClick,
  densityMap = new Map()
}: ConstellationLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [positions, setPositions] = useState<StarPosition[]>([]);

  // Initialize star positions with force-directed layout
  const initializePositions = useCallback((width: number, height: number) => {
    const stars: StarPosition[] = [];
    
    // Create initial positions in a grid, then add some randomness
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        // Start with grid positions
        const baseX = (col + 1) * (width / 9);
        const baseY = (row + 1) * (height / 9);
        
        // Add randomness for organic feel
        const randomOffset = 30;
        stars.push({
          row,
          col,
          x: baseX + (Math.random() - 0.5) * randomOffset,
          y: baseY + (Math.random() - 0.5) * randomOffset,
          vx: 0,
          vy: 0
        });
      }
    }
    
    return stars;
  }, []);

  // Apply force-directed simulation
  const simulateForces = useCallback((stars: StarPosition[], width: number, height: number) => {
    const newStars = stars.map(star => ({ ...star }));
    
    // Parameters
    const repulsionStrength = 500;
    const attractionStrength = 0.01;
    const damping = 0.9;
    const centerPull = 0.001;
    
    // Apply forces
    for (let i = 0; i < newStars.length; i++) {
      let fx = 0, fy = 0;
      
      // Repulsion from other stars
      for (let j = 0; j < newStars.length; j++) {
        if (i === j) continue;
        
        const dx = newStars[i].x - newStars[j].x;
        const dy = newStars[i].y - newStars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        
        if (dist < 100) {
          const force = repulsionStrength / (dist * dist);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }
      }
      
      // Attraction to neighbors (same row or column)
      for (let j = 0; j < newStars.length; j++) {
        if (i === j) continue;
        
        const sameRow = newStars[i].row === newStars[j].row;
        const sameCol = newStars[i].col === newStars[j].col;
        const adjacent = Math.abs(newStars[i].row - newStars[j].row) <= 1 && 
                        Math.abs(newStars[i].col - newStars[j].col) <= 1;
        
        if (sameRow || sameCol || adjacent) {
          const dx = newStars[j].x - newStars[i].x;
          const dy = newStars[j].y - newStars[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 60) {
            fx += dx * attractionStrength;
            fy += dy * attractionStrength;
          }
        }
      }
      
      // Pull toward center
      const centerX = width / 2;
      const centerY = height / 2;
      fx += (centerX - newStars[i].x) * centerPull;
      fy += (centerY - newStars[i].y) * centerPull;
      
      // Update velocity and position
      newStars[i].vx = (newStars[i].vx + fx) * damping;
      newStars[i].vy = (newStars[i].vy + fy) * damping;
      newStars[i].x += newStars[i].vx;
      newStars[i].y += newStars[i].vy;
      
      // Keep within bounds
      const margin = 50;
      newStars[i].x = Math.max(margin, Math.min(width - margin, newStars[i].x));
      newStars[i].y = Math.max(margin, Math.min(height - margin, newStars[i].y));
    }
    
    return newStars;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let width = containerRef.current?.clientWidth || 800;
      let height = containerRef.current?.clientHeight || 600;
      let stars = initializePositions(width, height);
      let hoveredTile: { row: number; col: number } | null = null;
      let twinkleOffset = 0;

      p.setup = () => {
        p.createCanvas(width, height);
        p.textFont('monospace');
      };

      p.windowResized = () => {
        width = containerRef.current?.clientWidth || 800;
        height = containerRef.current?.clientHeight || 600;
        p.resizeCanvas(width, height);
        stars = initializePositions(width, height);
      };

      p.draw = () => {
        // Night sky gradient background
        drawBackground(p, width, height);
        
        twinkleOffset += 0.03;
        
        // Run simulation
        stars = simulateForces(stars, width, height);
        setPositions(stars);
        
        // Draw constellation connections first
        drawConstellationLines(p, stars);
        
        // Draw journey path
        if (journeyPath.length > 1) {
          drawJourneyPath(p, stars);
        }
        
        // Draw all stars
        stars.forEach(star => {
          drawStar(p, star, hoveredTile, twinkleOffset);
        });
        
        // Draw legend
        drawLegend(p, width, height);
      };

      const drawBackground = (p: p5, w: number, h: number) => {
        // Dark gradient
        for (let y = 0; y < h; y++) {
          const inter = y / h;
          const c = p.lerpColor(p.color(10, 12, 20), p.color(20, 25, 40), inter);
          p.stroke(c);
          p.line(0, y, w, y);
        }
        
        // Scattered background stars
        p.noStroke();
        for (let i = 0; i < 100; i++) {
          const x = (i * 73) % w;
          const y = (i * 91) % h;
          const twinkle = Math.sin(twinkleOffset * 2 + i) * 0.5 + 0.5;
          p.fill(255, 255, 255, 20 + twinkle * 30);
          p.ellipse(x, y, 1 + twinkle, 1 + twinkle);
        }
      };

      const drawConstellationLines = (p: p5, starPositions: StarPosition[]) => {
        p.push();
        p.strokeWeight(1);
        
        // Connect adjacent tiles (same row, col, or diagonal)
        for (let i = 0; i < starPositions.length; i++) {
          for (let j = i + 1; j < starPositions.length; j++) {
            const s1 = starPositions[i];
            const s2 = starPositions[j];
            
            const rowDiff = Math.abs(s1.row - s2.row);
            const colDiff = Math.abs(s1.col - s2.col);
            
            // Only connect adjacent tiles
            if (rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)) {
              const key1 = `${s1.row}-${s1.col}`;
              const key2 = `${s2.row}-${s2.col}`;
              const bothVisited = visitedTiles.has(key1) && visitedTiles.has(key2);
              
              if (bothVisited) {
                p.stroke(100, 150, 255, 60);
              } else {
                p.stroke(60, 70, 90, 30);
              }
              
              p.line(s1.x, s1.y, s2.x, s2.y);
            }
          }
        }
        
        p.pop();
      };

      const drawStar = (
        p: p5, 
        star: StarPosition, 
        hovered: { row: number; col: number } | null,
        twinkle: number
      ) => {
        const { row, col, x, y } = star;
        const tileKey = `${row}-${col}`;
        const isVisited = visitedTiles.has(tileKey);
        const isSelected = selectedTile.row === row && selectedTile.col === col;
        const ring = getTileRing(row, col);
        const isAccessible = ring <= currentUnlockedRing;
        const isHovered = hovered?.row === row && hovered?.col === col;
        const density = densityMap.get(tileKey) || 0;
        
        // Twinkle effect
        const twinkleAmount = Math.sin(twinkle * 3 + row * 0.5 + col * 0.7) * 0.3 + 0.7;
        
        // Base size based on visited/density
        let starSize = 6;
        if (isVisited) starSize = 10 + density * 2;
        if (isSelected) starSize = 14;
        if (isHovered) starSize += 3;
        
        p.push();
        p.translate(x, y);
        
        // Glow effect for visited/selected
        if (isVisited || isSelected) {
          const seasonColor = SEASON_HEX_COLORS[season];
          p.noStroke();
          
          // Outer glow
          p.fill(
            (seasonColor >> 16) & 255,
            (seasonColor >> 8) & 255,
            seasonColor & 255,
            20 * twinkleAmount
          );
          p.ellipse(0, 0, starSize * 4, starSize * 4);
          
          // Inner glow
          p.fill(
            (seasonColor >> 16) & 255,
            (seasonColor >> 8) & 255,
            seasonColor & 255,
            40 * twinkleAmount
          );
          p.ellipse(0, 0, starSize * 2, starSize * 2);
        }
        
        // Star core
        if (!isAccessible) {
          p.fill(50, 55, 65, 100);
          p.noStroke();
        } else if (isSelected) {
          p.fill(255, 255, 255, 255);
          p.stroke(255, 255, 255, 100);
          p.strokeWeight(2);
        } else if (isVisited) {
          p.fill(255, 255, 255, 200 * twinkleAmount);
          p.noStroke();
        } else {
          p.fill(150, 160, 180, 80 + 40 * twinkleAmount);
          p.noStroke();
        }
        
        // Draw star shape
        if (isVisited || isSelected) {
          // 4-pointed star shape
          drawStarShape(p, 0, 0, starSize / 2, starSize, 4);
        } else {
          p.ellipse(0, 0, starSize * twinkleAmount, starSize * twinkleAmount);
        }
        
        // Label for hovered or selected
        if ((isHovered || isSelected) && isAccessible) {
          const acronym = getTileAcronym(row, col);
          p.fill(255, 255, 255, 200);
          p.noStroke();
          p.textAlign(p.CENTER, p.TOP);
          p.textSize(9);
          p.text(acronym, 0, starSize + 5);
        }
        
        p.pop();
      };

      const drawStarShape = (p: p5, cx: number, cy: number, innerRadius: number, outerRadius: number, points: number) => {
        p.beginShape();
        for (let i = 0; i < points * 2; i++) {
          const angle = (p.TWO_PI / (points * 2)) * i - p.HALF_PI;
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          p.vertex(cx + p.cos(angle) * r, cy + p.sin(angle) * r);
        }
        p.endShape(p.CLOSE);
      };

      const drawJourneyPath = (p: p5, starPositions: StarPosition[]) => {
        if (journeyPath.length < 2) return;
        
        p.push();
        p.strokeWeight(2);
        p.noFill();
        
        for (let i = 0; i < journeyPath.length - 1; i++) {
          const fromStar = starPositions.find(s => s.row === journeyPath[i].row && s.col === journeyPath[i].col);
          const toStar = starPositions.find(s => s.row === journeyPath[i + 1].row && s.col === journeyPath[i + 1].col);
          
          if (!fromStar || !toStar) continue;
          
          const progress = i / (journeyPath.length - 1);
          p.stroke(
            p.lerp(100, 255, progress),
            p.lerp(180, 220, progress),
            p.lerp(255, 150, progress),
            180
          );
          
          p.line(fromStar.x, fromStar.y, toStar.x, toStar.y);
        }
        
        p.pop();
      };

      const drawLegend = (p: p5, w: number, h: number) => {
        p.push();
        p.textSize(10);
        p.textAlign(p.LEFT, p.CENTER);
        p.noStroke();
        
        const legendY = h - 30;
        
        // Visited star
        p.fill(255, 255, 255, 200);
        drawStarShape(p, 20, legendY, 3, 6, 4);
        p.fill(150, 150, 150);
        p.text('Visited', 35, legendY);
        
        // Available
        p.fill(150, 160, 180, 100);
        p.ellipse(100, legendY, 6, 6);
        p.fill(150, 150, 150);
        p.text('Available', 115, legendY);
        
        // Locked
        p.fill(50, 55, 65, 100);
        p.ellipse(190, legendY, 6, 6);
        p.fill(150, 150, 150);
        p.text('Locked', 205, legendY);
        
        // Journey path
        p.stroke(100, 180, 255, 180);
        p.strokeWeight(2);
        p.line(270, legendY, 295, legendY);
        p.noStroke();
        p.fill(150, 150, 150);
        p.text('Journey Path', 305, legendY);
        
        p.pop();
      };

      p.mousePressed = () => {
        if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
        
        for (const star of stars) {
          const dist = p.dist(p.mouseX, p.mouseY, star.x, star.y);
          
          if (dist < 15) {
            const ring = getTileRing(star.row, star.col);
            if (ring <= currentUnlockedRing && onTileClick) {
              onTileClick(star.row, star.col);
            }
            return;
          }
        }
      };

      p.mouseMoved = () => {
        hoveredTile = null;
        for (const star of stars) {
          const dist = p.dist(p.mouseX, p.mouseY, star.x, star.y);
          
          if (dist < 15) {
            hoveredTile = { row: star.row, col: star.col };
            return;
          }
        }
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, [selectedTile, season, visitedTiles, journeyPath, currentUnlockedRing, onTileClick, densityMap, initializePositions, simulateForces]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}

