import { useRef, useEffect, useCallback } from 'react';
import p5 from 'p5';
import { ManifoldSeason, SEASON_HEX_COLORS, getTileAcronym } from '@/utils/torusManifoldMath';
import { RingLevel, getTileRing } from '@/utils/ringToleranceSystem';

// Double Diamond design phases mapping to rows
const DIAMOND_PHASES = {
  discover: { rows: [0, 1], color: '#8B5CF6', label: 'DISCOVER', divergent: true },
  define: { rows: [2, 3], color: '#3B82F6', label: 'DEFINE', divergent: false },
  develop: { rows: [4, 5], color: '#10B981', label: 'DEVELOP', divergent: true },
  deliver: { rows: [6, 7], color: '#F59E0B', label: 'DELIVER', divergent: false }
};

interface DoubleDiamondLayoutProps {
  selectedTile: { row: number; col: number };
  season: ManifoldSeason;
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number }>;
  currentUnlockedRing: RingLevel;
  onTileClick?: (row: number, col: number) => void;
  densityMap?: Map<string, number>;
}

export function DoubleDiamondLayout({
  selectedTile,
  season,
  visitedTiles,
  journeyPath,
  currentUnlockedRing,
  onTileClick,
  densityMap = new Map()
}: DoubleDiamondLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  // Get phase for a row
  const getPhaseForRow = useCallback((row: number) => {
    for (const [key, phase] of Object.entries(DIAMOND_PHASES)) {
      if (phase.rows.includes(row)) return { key, ...phase };
    }
    return null;
  }, []);

  // Calculate diamond position for a tile
  const getDiamondPosition = useCallback((row: number, col: number, width: number, height: number) => {
    const phase = getPhaseForRow(row);
    if (!phase) return { x: 0, y: 0 };

    // Diamond parameters
    const diamondWidth = width * 0.35;
    const diamondHeight = height * 0.4;
    const centerY = height / 2;
    
    // First diamond (Discover/Define) or Second diamond (Develop/Deliver)
    const isFirstDiamond = phase.key === 'discover' || phase.key === 'define';
    const diamondCenterX = isFirstDiamond ? width * 0.28 : width * 0.72;
    
    // Row position within phase (0 or 1)
    const rowInPhase = phase.rows.indexOf(row);
    const totalRowsInPhase = phase.rows.length;
    
    // Calculate vertical position based on divergent/convergent
    let yOffset: number;
    if (phase.key === 'discover' || phase.key === 'develop') {
      // Divergent - top half of diamond
      yOffset = -diamondHeight * 0.5 + (rowInPhase / totalRowsInPhase) * diamondHeight * 0.5;
    } else {
      // Convergent - bottom half of diamond
      yOffset = (rowInPhase / totalRowsInPhase) * diamondHeight * 0.5;
    }
    
    // Calculate horizontal spread based on position in diamond
    const verticalProgress = Math.abs(yOffset) / (diamondHeight * 0.5);
    const horizontalSpread = phase.divergent 
      ? diamondWidth * (1 - verticalProgress) * 0.5
      : diamondWidth * verticalProgress * 0.5;
    
    // Distribute columns across the horizontal spread
    const colSpacing = horizontalSpread * 2 / 7;
    const xOffset = (col - 3.5) * colSpacing;
    
    return {
      x: diamondCenterX + xOffset,
      y: centerY + yOffset
    };
  }, [getPhaseForRow]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let width = containerRef.current?.clientWidth || 800;
      let height = containerRef.current?.clientHeight || 600;
      let hoveredTile: { row: number; col: number } | null = null;

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
        
        // Draw diamond outlines
        drawDiamondOutlines(p, width, height);
        
        // Draw phase labels
        drawPhaseLabels(p, width, height);
        
        // Draw journey path
        if (journeyPath.length > 1) {
          drawJourneyPath(p, width, height);
        }
        
        // Draw all tiles
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            drawTile(p, row, col, width, height, hoveredTile);
          }
        }
        
        // Draw center pivot point
        drawPivotPoint(p, width, height);
      };

      const drawDiamondOutlines = (p: p5, w: number, h: number) => {
        const diamondWidth = w * 0.35;
        const diamondHeight = h * 0.4;
        const centerY = h / 2;
        
        p.push();
        p.noFill();
        p.strokeWeight(1);
        
        // First diamond (Discover/Define)
        const d1x = w * 0.28;
        p.stroke(139, 92, 246, 60); // Purple
        p.beginShape();
        p.vertex(d1x, centerY - diamondHeight / 2);
        p.vertex(d1x + diamondWidth / 2, centerY);
        p.vertex(d1x, centerY + diamondHeight / 2);
        p.vertex(d1x - diamondWidth / 2, centerY);
        p.endShape(p.CLOSE);
        
        // Second diamond (Develop/Deliver)
        const d2x = w * 0.72;
        p.stroke(16, 185, 129, 60); // Green
        p.beginShape();
        p.vertex(d2x, centerY - diamondHeight / 2);
        p.vertex(d2x + diamondWidth / 2, centerY);
        p.vertex(d2x, centerY + diamondHeight / 2);
        p.vertex(d2x - diamondWidth / 2, centerY);
        p.endShape(p.CLOSE);
        
        // Connecting line between diamonds
        p.stroke(100, 100, 100, 40);
        p.line(d1x + diamondWidth / 2, centerY, d2x - diamondWidth / 2, centerY);
        
        p.pop();
      };

      const drawPhaseLabels = (p: p5, w: number, h: number) => {
        p.push();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.noStroke();
        
        const phases = [
          { label: 'DISCOVER', x: w * 0.15, color: '#8B5CF6' },
          { label: 'DEFINE', x: w * 0.38, color: '#3B82F6' },
          { label: 'DEVELOP', x: w * 0.62, color: '#10B981' },
          { label: 'DELIVER', x: w * 0.85, color: '#F59E0B' }
        ];
        
        phases.forEach(phase => {
          p.fill(phase.color);
          p.text(phase.label, phase.x, h * 0.08);
        });
        
        // Divergent/Convergent indicators
        p.textSize(9);
        p.fill(100, 100, 100);
        p.text('↔ Diverge', w * 0.15, h * 0.12);
        p.text('↕ Converge', w * 0.38, h * 0.12);
        p.text('↔ Diverge', w * 0.62, h * 0.12);
        p.text('↕ Converge', w * 0.85, h * 0.12);
        
        p.pop();
      };

      const drawTile = (p: p5, row: number, col: number, w: number, h: number, hovered: { row: number; col: number } | null) => {
        const pos = getDiamondPosition(row, col, w, h);
        const tileKey = `${row}-${col}`;
        const isVisited = visitedTiles.has(tileKey);
        const isSelected = selectedTile.row === row && selectedTile.col === col;
        const ring = getTileRing(row, col);
        const isAccessible = ring <= currentUnlockedRing;
        const isHovered = hovered?.row === row && hovered?.col === col;
        const density = densityMap.get(tileKey) || 0;
        const phase = getPhaseForRow(row);
        
        const tileSize = 28 + density * 4;
        
        p.push();
        p.translate(pos.x, pos.y);
        
        // Glow for selected
        if (isSelected) {
          p.noStroke();
          p.fill(255, 255, 255, 20);
          p.ellipse(0, 0, tileSize * 2, tileSize * 2);
        }
        
        // Tile shape - hexagon for visual interest
        const hexRadius = tileSize / 2;
        
        if (!isAccessible) {
          p.fill(30, 35, 45, 100);
          p.stroke(50, 55, 65, 80);
        } else if (isSelected) {
          const phaseColor = p.color(phase?.color || '#ffffff');
          p.fill(p.red(phaseColor), p.green(phaseColor), p.blue(phaseColor), 220);
          p.stroke(255, 255, 255, 200);
          p.strokeWeight(2);
        } else if (isVisited) {
          const phaseColor = p.color(phase?.color || '#ffffff');
          p.fill(p.red(phaseColor), p.green(phaseColor), p.blue(phaseColor), 180);
          p.stroke(p.red(phaseColor), p.green(phaseColor), p.blue(phaseColor), 255);
        } else {
          p.fill(40, 50, 60, isHovered ? 180 : 120);
          p.stroke(80, 100, 120, isHovered ? 200 : 100);
        }
        
        p.strokeWeight(isSelected ? 2 : 1);
        
        // Draw hexagon
        p.beginShape();
        for (let i = 0; i < 6; i++) {
          const angle = p.TWO_PI / 6 * i - p.PI / 6;
          const hx = p.cos(angle) * hexRadius;
          const hy = p.sin(angle) * hexRadius;
          p.vertex(hx, hy);
        }
        p.endShape(p.CLOSE);
        
        // Tile label
        if (isAccessible) {
          const acronym = getTileAcronym(row, col);
          p.fill(255, 255, 255, isVisited || isSelected ? 255 : 150);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(8);
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
          const from = getDiamondPosition(journeyPath[i].row, journeyPath[i].col, w, h);
          const to = getDiamondPosition(journeyPath[i + 1].row, journeyPath[i + 1].col, w, h);
          
          const progress = i / (journeyPath.length - 1);
          p.stroke(
            p.lerp(100, 255, progress),
            p.lerp(150, 200, progress),
            p.lerp(255, 100, progress),
            150
          );
          
          p.line(from.x, from.y, to.x, to.y);
        }
        
        p.pop();
      };

      const drawPivotPoint = (p: p5, w: number, h: number) => {
        const pivotX = w * 0.5;
        const pivotY = h / 2;
        
        p.push();
        p.noFill();
        p.stroke(255, 255, 255, 40);
        p.strokeWeight(1);
        p.ellipse(pivotX, pivotY, 20, 20);
        
        p.fill(255, 255, 255, 100);
        p.noStroke();
        p.ellipse(pivotX, pivotY, 6, 6);
        
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(9);
        p.fill(100, 100, 100);
        p.text('PIVOT', pivotX, pivotY + 15);
        p.pop();
      };

      p.mousePressed = () => {
        if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
        
        // Find clicked tile
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const pos = getDiamondPosition(row, col, width, height);
            const dist = p.dist(p.mouseX, p.mouseY, pos.x, pos.y);
            
            if (dist < 18) {
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
            const pos = getDiamondPosition(row, col, width, height);
            const dist = p.dist(p.mouseX, p.mouseY, pos.x, pos.y);
            
            if (dist < 18) {
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
  }, [selectedTile, season, visitedTiles, journeyPath, currentUnlockedRing, onTileClick, densityMap, getDiamondPosition, getPhaseForRow]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
