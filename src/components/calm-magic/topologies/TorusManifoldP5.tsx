import { useRef, useEffect, useCallback } from 'react';
import p5 from 'p5';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Play, Pause } from 'lucide-react';
import { 
  ManifoldSeason, 
  SEASON_HEX_COLORS,
  TORUS_MAJOR_RADIUS,
  TORUS_BASE_MINOR_RADIUS,
  getTileAcronym,
  COLUMN_LABELS,
  ROW_LABELS
} from '@/utils/torusManifoldMath';

interface TorusManifoldP5Props {
  selectedTile: { row: number; col: number };
  season: ManifoldSeason;
  visitedTiles?: Set<string>;
  journeyPath?: Array<{ row: number; col: number; season?: ManifoldSeason }>;
  onTileClick?: (row: number, col: number) => void;
  onClose: () => void;
}

const SEASONS: ManifoldSeason[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

export function TorusManifoldP5({
  selectedTile,
  season,
  visitedTiles = new Set(),
  journeyPath = [],
  onTileClick,
  onClose
}: TorusManifoldP5Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const rotationRef = useRef({ x: -0.3, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const hoveredTileRef = useRef<{ row: number; col: number } | null>(null);
  
  // Scale factor for visualization
  const SCALE = 60;
  const R = TORUS_MAJOR_RADIUS * SCALE;
  const r = TORUS_BASE_MINOR_RADIUS * SCALE;

  const getTilePosition = useCallback((row: number, col: number, seasonIdx: number, p: p5) => {
    const theta = (col / 8) * p.TWO_PI;
    const phi = ((row / 8) + (seasonIdx / 5)) * p.TWO_PI;
    
    const x = (R + r * p.cos(phi)) * p.cos(theta);
    const y = (R + r * p.cos(phi)) * p.sin(theta);
    const z = r * p.sin(phi);
    
    return { x, y, z };
  }, [R, r]);

  const getSeasonIndex = useCallback((s: ManifoldSeason) => {
    return SEASONS.indexOf(s);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let font: p5.Font;

      p.preload = () => {
        // Using default font
      };

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current!.clientWidth,
          containerRef.current!.clientHeight,
          p.WEBGL
        );
        canvas.parent(containerRef.current!);
        p.textFont('monospace');
        p.textSize(10);
      };

      p.draw = () => {
        p.background(10, 10, 15);
        
        // Lighting
        p.ambientLight(60);
        p.directionalLight(255, 255, 255, 0.5, 0.5, -1);
        p.pointLight(255, 200, 150, 0, 0, 300);
        
        // Auto rotation
        if (autoRotateRef.current && !isDraggingRef.current) {
          rotationRef.current.y += 0.003;
        }
        
        // Apply rotation
        p.rotateX(rotationRef.current.x);
        p.rotateY(rotationRef.current.y);
        
        // Draw torus wireframe
        drawTorusWireframe(p);
        
        // Draw season bands
        drawSeasonBands(p);
        
        // Draw all tile markers
        drawTileMarkers(p);
        
        // Draw journey path
        if (journeyPath.length > 1) {
          drawJourneyPath(p);
        }
        
        // Draw hovered tile label
        if (hoveredTileRef.current) {
          drawHoveredLabel(p);
        }
      };

      const drawTorusWireframe = (p: p5) => {
        p.push();
        p.noFill();
        p.stroke(60, 70, 80);
        p.strokeWeight(0.5);
        
        // Draw longitude lines (theta)
        for (let i = 0; i < 8; i++) {
          const theta = (i / 8) * p.TWO_PI;
          p.beginShape();
          for (let j = 0; j <= 40; j++) {
            const phi = (j / 40) * p.TWO_PI;
            const x = (R + r * p.cos(phi)) * p.cos(theta);
            const y = (R + r * p.cos(phi)) * p.sin(theta);
            const z = r * p.sin(phi);
            p.vertex(x, y, z);
          }
          p.endShape();
        }
        
        // Draw latitude lines (phi) - one per row per season
        for (let s = 0; s < 5; s++) {
          for (let row = 0; row < 8; row++) {
            const phi = ((row / 8) + (s / 5)) * p.TWO_PI;
            p.beginShape();
            for (let j = 0; j <= 32; j++) {
              const theta = (j / 32) * p.TWO_PI;
              const x = (R + r * p.cos(phi)) * p.cos(theta);
              const y = (R + r * p.cos(phi)) * p.sin(theta);
              const z = r * p.sin(phi);
              p.vertex(x, y, z);
            }
            p.endShape(p.CLOSE);
          }
        }
        p.pop();
      };

      const drawSeasonBands = (p: p5) => {
        p.push();
        p.noStroke();
        
        SEASONS.forEach((s, idx) => {
          const color = p.color(SEASON_HEX_COLORS[s]);
          color.setAlpha(30);
          p.fill(color);
          
          // Draw a band for each season
          const phiStart = (idx / 5) * p.TWO_PI;
          const phiEnd = ((idx + 1) / 5) * p.TWO_PI;
          
          p.beginShape(p.TRIANGLE_STRIP);
          for (let j = 0; j <= 32; j++) {
            const theta = (j / 32) * p.TWO_PI;
            
            // Inner edge
            const phi1 = phiStart;
            const x1 = (R + r * p.cos(phi1)) * p.cos(theta);
            const y1 = (R + r * p.cos(phi1)) * p.sin(theta);
            const z1 = r * p.sin(phi1);
            p.vertex(x1, y1, z1);
            
            // Outer edge
            const phi2 = phiEnd;
            const x2 = (R + r * p.cos(phi2)) * p.cos(theta);
            const y2 = (R + r * p.cos(phi2)) * p.sin(theta);
            const z2 = r * p.sin(phi2);
            p.vertex(x2, y2, z2);
          }
          p.endShape();
        });
        p.pop();
      };

      const drawTileMarkers = (p: p5) => {
        const currentSeasonIdx = getSeasonIndex(season);
        
        // Draw markers for current season's tiles
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const pos = getTilePosition(row, col, currentSeasonIdx, p);
            const tileKey = `${row}-${col}`;
            const isSelected = row === selectedTile.row && col === selectedTile.col;
            const isVisited = visitedTiles.has(tileKey);
            const isHovered = hoveredTileRef.current?.row === row && hoveredTileRef.current?.col === col;
            
            p.push();
            p.translate(pos.x, pos.y, pos.z);
            
            // Billboard rotation to face camera
            p.rotateY(-rotationRef.current.y);
            p.rotateX(-rotationRef.current.x);
            
            const seasonColor = p.color(SEASON_HEX_COLORS[season]);
            
            if (isSelected) {
              // Selected tile - larger, glowing
              p.fill(seasonColor);
              p.noStroke();
              p.sphere(12);
              
              // Glow ring
              p.noFill();
              p.stroke(seasonColor);
              p.strokeWeight(2);
              const pulseSize = 18 + p.sin(p.frameCount * 0.1) * 4;
              p.circle(0, 0, pulseSize);
            } else if (isVisited) {
              // Visited tile - filled
              seasonColor.setAlpha(200);
              p.fill(seasonColor);
              p.noStroke();
              p.sphere(8);
            } else if (isHovered) {
              // Hovered tile
              p.fill(255);
              p.noStroke();
              p.sphere(10);
            } else {
              // Default tile
              p.noFill();
              p.stroke(100, 110, 120);
              p.strokeWeight(1);
              p.sphere(6);
            }
            
            p.pop();
          }
        }
      };

      const drawJourneyPath = (p: p5) => {
        const currentSeasonIdx = getSeasonIndex(season);
        
        p.push();
        p.noFill();
        p.stroke(SEASON_HEX_COLORS[season]);
        p.strokeWeight(2);
        
        p.beginShape();
        journeyPath.forEach((point, idx) => {
          const seasonIdx = point.season ? getSeasonIndex(point.season) : currentSeasonIdx;
          const pos = getTilePosition(point.row, point.col, seasonIdx, p);
          p.vertex(pos.x, pos.y, pos.z);
        });
        p.endShape();
        p.pop();
      };

      const drawHoveredLabel = (p: p5) => {
        if (!hoveredTileRef.current) return;
        
        const { row, col } = hoveredTileRef.current;
        const acronym = getTileAcronym(row, col);
        const rowLabel = ROW_LABELS[row] || '';
        const colLabel = COLUMN_LABELS[col] || '';
        
        // Draw label in screen space
        p.push();
        p.resetMatrix();
        
        // Position near mouse
        const mx = p.mouseX - p.width / 2;
        const my = p.mouseY - p.height / 2;
        
        p.fill(20, 25, 30, 240);
        p.noStroke();
        p.rect(mx + 15, my - 25, 120, 50, 4);
        
        p.fill(255);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(14);
        p.text(acronym, mx + 22, my - 20);
        
        p.fill(180);
        p.textSize(10);
        p.text(`${rowLabel} × ${colLabel}`, mx + 22, my);
        
        p.pop();
      };

      p.mousePressed = () => {
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
          
          // Check for tile click
          checkTileClick(p);
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
          
          // Clamp X rotation
          rotationRef.current.x = p.constrain(rotationRef.current.x, -p.HALF_PI, p.HALF_PI);
          
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseMoved = () => {
        // Simple hover detection based on screen position
        const currentSeasonIdx = getSeasonIndex(season);
        let closestTile: { row: number; col: number } | null = null;
        let closestDist = Infinity;
        
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const pos = getTilePosition(row, col, currentSeasonIdx, p);
            
            // Project to screen (simplified)
            const screenPos = project3DToScreen(pos, p);
            const dist = p.dist(p.mouseX, p.mouseY, screenPos.x, screenPos.y);
            
            if (dist < 20 && dist < closestDist) {
              closestDist = dist;
              closestTile = { row, col };
            }
          }
        }
        
        hoveredTileRef.current = closestTile;
      };

      const project3DToScreen = (pos: { x: number; y: number; z: number }, p: p5) => {
        // Simplified projection - apply rotation then orthographic projection
        const cosY = p.cos(rotationRef.current.y);
        const sinY = p.sin(rotationRef.current.y);
        const cosX = p.cos(rotationRef.current.x);
        const sinX = p.sin(rotationRef.current.x);
        
        // Rotate Y
        let x1 = pos.x * cosY - pos.y * sinY;
        let y1 = pos.x * sinY + pos.y * cosY;
        let z1 = pos.z;
        
        // Rotate X
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;
        
        return {
          x: p.width / 2 + x1,
          y: p.height / 2 + y2
        };
      };

      const checkTileClick = (p: p5) => {
        if (hoveredTileRef.current && onTileClick) {
          onTileClick(hoveredTileRef.current.row, hoveredTileRef.current.col);
        }
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
        }
      };
    };

    p5Ref.current = new p5(sketch);

    return () => {
      p5Ref.current?.remove();
    };
  }, [selectedTile, season, visitedTiles, journeyPath, onTileClick, getTilePosition, getSeasonIndex, R, r]);

  const handleReset = () => {
    rotationRef.current = { x: -0.3, y: 0 };
  };

  const toggleAutoRotate = () => {
    autoRotateRef.current = !autoRotateRef.current;
  };

  return (
    <div className="relative w-full h-full bg-background">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAutoRotate}
          className="bg-background/80 backdrop-blur-sm"
        >
          {autoRotateRef.current ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="bg-background/80 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="bg-background/80 backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Info panel */}
      <div className="absolute bottom-4 left-4 z-10 p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-xs">
        <div className="flex items-center gap-4 mb-2">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: SEASON_HEX_COLORS[season] }} />
            {season}
          </span>
          <span className="text-muted-foreground">
            Selected: {getTileAcronym(selectedTile.row, selectedTile.col)}
          </span>
        </div>
        <p className="text-muted-foreground">
          Drag to rotate • Click tile to navigate
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-muted-foreground/60" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-muted-foreground" />
            <span>Available</span>
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
