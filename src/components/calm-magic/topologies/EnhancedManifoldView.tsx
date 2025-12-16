import { useRef, useEffect, useCallback, useState } from 'react';
import p5 from 'p5';
import { 
  ManifoldSeason, 
  SEASON_HEX_COLORS,
  TORUS_MAJOR_RADIUS,
  TORUS_BASE_MINOR_RADIUS,
  getTileAcronym,
  columnToTheta,
  rowSeasonToPhi,
  gaussianCurvature,
  calculateLocalRadius
} from '@/utils/torusManifoldMath';
import { ManifoldControlsSidebar } from './ManifoldControlsSidebar';
import { getTileRing, RingLevel } from '@/utils/ringToleranceSystem';

interface EnhancedManifoldViewProps {
  selectedTile: { row: number; col: number };
  season: ManifoldSeason;
  visitedTiles?: Set<string>;
  journeyPath?: Array<{ row: number; col: number; season?: ManifoldSeason }>;
  currentUnlockedRing?: RingLevel;
  onTileClick?: (row: number, col: number) => void;
  densityMap?: Map<string, number>;
}

export type ViewMode = 'torus' | 'flat-overlay' | 'cross-section' | 'unfolded';

const SEASONS: ManifoldSeason[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const RING_COLORS = {
  1: { r: 34, g: 197, b: 94, a: 180 },   // Green - Inner Safe
  2: { r: 59, g: 130, b: 246, a: 150 },  // Blue - Stretch
  3: { r: 245, g: 158, b: 11, a: 120 },  // Amber - Edge
  4: { r: 168, g: 85, b: 247, a: 100 }   // Purple - Integrator
};

export function EnhancedManifoldView({
  selectedTile,
  season,
  visitedTiles = new Set(),
  journeyPath = [],
  currentUnlockedRing = 1,
  onTileClick,
  densityMap = new Map()
}: EnhancedManifoldViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const rotationRef = useRef({ x: -0.3, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const hoveredTileRef = useRef<{ row: number; col: number } | null>(null);
  
  // Control states
  const [viewMode, setViewMode] = useState<ViewMode>('torus');
  const [showCurvature, setShowCurvature] = useState(false);
  const [showSeasonColors, setShowSeasonColors] = useState(true);
  const [showWireframe, setShowWireframe] = useState(true);
  const [showTileMarkers, setShowTileMarkers] = useState(true);
  const [showConnections, setShowConnections] = useState(false);
  const [showRingZones, setShowRingZones] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [opacity, setOpacity] = useState(0.6);
  
  // Refs for controls accessible in p5
  const controlsRef = useRef({
    viewMode,
    showCurvature,
    showSeasonColors,
    showWireframe,
    showTileMarkers,
    showConnections,
    showRingZones,
    isAnimating,
    opacity
  });
  
  // Update refs when controls change
  useEffect(() => {
    controlsRef.current = {
      viewMode,
      showCurvature,
      showSeasonColors,
      showWireframe,
      showTileMarkers,
      showConnections,
      showRingZones,
      isAnimating,
      opacity
    };
  }, [viewMode, showCurvature, showSeasonColors, showWireframe, showTileMarkers, showConnections, showRingZones, isAnimating, opacity]);
  
  const SCALE = 55;
  const R = TORUS_MAJOR_RADIUS * SCALE;
  const r = TORUS_BASE_MINOR_RADIUS * SCALE;

  const getTilePosition = useCallback((row: number, col: number, seasonIdx: number, p: p5, density: number = 0) => {
    const theta = (col / 8) * p.TWO_PI;
    const phi = ((row / 8) + (seasonIdx / 5)) * p.TWO_PI;
    const localR = r * (1 + 0.3 * Math.log(1 + density));
    
    const x = (R + localR * p.cos(phi)) * p.cos(theta);
    const y = (R + localR * p.cos(phi)) * p.sin(theta);
    const z = localR * p.sin(phi);
    
    return { x, y, z, theta, phi };
  }, [R, r]);

  const getSeasonIndex = useCallback((s: ManifoldSeason) => {
    return SEASONS.indexOf(s);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
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
        const ctrl = controlsRef.current;
        p.background(8, 10, 15);
        
        // Lighting
        p.ambientLight(50);
        p.directionalLight(255, 255, 255, 0.5, 0.5, -1);
        p.pointLight(255, 200, 150, 0, 0, 400);
        
        // Auto rotation
        if (ctrl.isAnimating && !isDraggingRef.current) {
          rotationRef.current.y += 0.002;
        }
        
        // Apply rotation
        p.rotateX(rotationRef.current.x);
        p.rotateY(rotationRef.current.y);
        
        if (ctrl.viewMode === 'torus' || ctrl.viewMode === 'flat-overlay') {
          // Draw torus surface with optional curvature colors
          if (ctrl.showSeasonColors || ctrl.showCurvature) {
            drawTorusSurface(p, ctrl);
          }
          
          // Draw wireframe
          if (ctrl.showWireframe) {
            drawTorusWireframe(p);
          }
          
          // Draw ring zones overlay
          if (ctrl.showRingZones) {
            drawRingZones(p);
          }
          
          // Draw tile markers
          if (ctrl.showTileMarkers) {
            drawTileMarkers(p);
          }
          
          // Draw connections between adjacent tiles
          if (ctrl.showConnections) {
            drawTileConnections(p);
          }
          
          // Draw journey path
          if (journeyPath.length > 1) {
            drawJourneyPath(p);
          }
          
          // Draw flat overlay if enabled
          if (ctrl.viewMode === 'flat-overlay') {
            drawFlatMatrixOverlay(p);
          }
        } else if (ctrl.viewMode === 'cross-section') {
          drawCrossSection(p);
        } else if (ctrl.viewMode === 'unfolded') {
          drawUnfoldedView(p);
        }
        
        // Draw hovered tile label
        if (hoveredTileRef.current) {
          drawHoveredLabel(p);
        }
      };

      const drawTorusSurface = (p: p5, ctrl: typeof controlsRef.current) => {
        p.push();
        p.noStroke();
        
        const segments = 32;
        
        for (let i = 0; i < segments; i++) {
          for (let j = 0; j < segments; j++) {
            const phi1 = (i / segments) * p.TWO_PI;
            const phi2 = ((i + 1) / segments) * p.TWO_PI;
            const theta1 = (j / segments) * p.TWO_PI;
            const theta2 = ((j + 1) / segments) * p.TWO_PI;
            
            // Get season index for this phi
            const seasonIdx = Math.floor((phi1 / p.TWO_PI) * 5) % 5;
            const currentSeason = SEASONS[seasonIdx];
            
            let fillColor: p5.Color;
            
            if (ctrl.showCurvature) {
              // Color based on Gaussian curvature
              const K = gaussianCurvature(phi1, r / SCALE);
              const normalized = Math.max(-1, Math.min(1, K * 2));
              
              if (normalized > 0) {
                fillColor = p.color(100, 150, 255, ctrl.opacity * 255);
              } else {
                fillColor = p.color(255, 100, 100, ctrl.opacity * 255);
              }
            } else {
              // Season colors
              const hexColor = SEASON_HEX_COLORS[currentSeason];
              fillColor = p.color(hexColor);
              fillColor.setAlpha(ctrl.opacity * 255 * 0.4);
            }
            
            p.fill(fillColor);
            
            p.beginShape();
            const v1 = torusVertex(phi1, theta1, p);
            const v2 = torusVertex(phi1, theta2, p);
            const v3 = torusVertex(phi2, theta2, p);
            const v4 = torusVertex(phi2, theta1, p);
            p.vertex(v1.x, v1.y, v1.z);
            p.vertex(v2.x, v2.y, v2.z);
            p.vertex(v3.x, v3.y, v3.z);
            p.vertex(v4.x, v4.y, v4.z);
            p.endShape(p.CLOSE);
          }
        }
        p.pop();
      };
      
      const torusVertex = (phi: number, theta: number, p: p5) => {
        const x = (R + r * p.cos(phi)) * p.cos(theta);
        const y = (R + r * p.cos(phi)) * p.sin(theta);
        const z = r * p.sin(phi);
        return { x, y, z };
      };

      const drawTorusWireframe = (p: p5) => {
        p.push();
        p.noFill();
        p.stroke(60, 70, 90);
        p.strokeWeight(0.5);
        
        // Draw 8 longitude lines (theta - columns)
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
        
        // Draw 40 latitude lines (phi - rows × seasons)
        for (let i = 0; i < 40; i++) {
          const phi = (i / 40) * p.TWO_PI;
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
        p.pop();
      };

      const drawRingZones = (p: p5) => {
        const currentSeasonIdx = getSeasonIndex(season);
        
        p.push();
        p.noStroke();
        
        // Draw ring zone indicators for each tile
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const ring = getTileRing(row, col) as RingLevel;
            const ringColor = RING_COLORS[ring];
            
            if (ring <= currentUnlockedRing) {
              const pos = getTilePosition(row, col, currentSeasonIdx, p);
              
              p.push();
              p.translate(pos.x, pos.y, pos.z);
              p.rotateY(-rotationRef.current.y);
              p.rotateX(-rotationRef.current.x);
              
              // Draw subtle ring zone glow
              const glowColor = p.color(ringColor.r, ringColor.g, ringColor.b, ringColor.a * 0.3);
              p.fill(glowColor);
              p.circle(0, 0, 20 + ring * 2);
              p.pop();
            }
          }
        }
        p.pop();
      };

      const drawTileMarkers = (p: p5) => {
        const currentSeasonIdx = getSeasonIndex(season);
        
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const tileKey = `${season}-${row}-${col}`;
            const density = densityMap.get(tileKey) || 0;
            const pos = getTilePosition(row, col, currentSeasonIdx, p, density);
            const tileVisitKey = `${row}-${col}`;
            const isSelected = row === selectedTile.row && col === selectedTile.col;
            const isVisited = visitedTiles.has(tileVisitKey);
            const isHovered = hoveredTileRef.current?.row === row && hoveredTileRef.current?.col === col;
            const ring = getTileRing(row, col) as RingLevel;
            const isAccessible = ring <= currentUnlockedRing;
            
            p.push();
            p.translate(pos.x, pos.y, pos.z);
            p.rotateY(-rotationRef.current.y);
            p.rotateX(-rotationRef.current.x);
            
            const seasonColor = p.color(SEASON_HEX_COLORS[season]);
            
            if (isSelected) {
              // Selected tile - larger, glowing
              p.fill(seasonColor);
              p.noStroke();
              p.sphere(10);
              
              // Pulsing ring
              p.noFill();
              p.stroke(seasonColor);
              p.strokeWeight(2);
              const pulseSize = 16 + p.sin(p.frameCount * 0.1) * 4;
              p.circle(0, 0, pulseSize);
              
              // Draw tile acronym
              p.fill(255);
              p.textSize(8);
              p.textAlign(p.CENTER, p.CENTER);
              p.text(getTileAcronym(row, col), 0, -20);
            } else if (isVisited) {
              seasonColor.setAlpha(200);
              p.fill(seasonColor);
              p.noStroke();
              p.sphere(7);
            } else if (isHovered && isAccessible) {
              p.fill(255);
              p.noStroke();
              p.sphere(9);
              
              // Show acronym on hover
              p.fill(255);
              p.textSize(8);
              p.textAlign(p.CENTER, p.CENTER);
              p.text(getTileAcronym(row, col), 0, -18);
            } else if (!isAccessible) {
              // Locked tile - faded wireframe
              p.noFill();
              p.stroke(60, 60, 80, 100);
              p.strokeWeight(0.5);
              p.sphere(5);
            } else {
              // Accessible but not visited
              p.noFill();
              p.stroke(100, 120, 140);
              p.strokeWeight(1);
              p.sphere(6);
            }
            
            p.pop();
          }
        }
      };

      const drawTileConnections = (p: p5) => {
        const currentSeasonIdx = getSeasonIndex(season);
        
        p.push();
        p.stroke(100, 120, 140, 80);
        p.strokeWeight(1);
        
        // Draw connections between adjacent tiles
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const pos1 = getTilePosition(row, col, currentSeasonIdx, p);
            
            // Connect to right neighbor
            if (col < 7) {
              const pos2 = getTilePosition(row, col + 1, currentSeasonIdx, p);
              p.line(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
            }
            
            // Connect to bottom neighbor
            if (row < 7) {
              const pos2 = getTilePosition(row + 1, col, currentSeasonIdx, p);
              p.line(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
            }
          }
        }
        p.pop();
      };

      const drawJourneyPath = (p: p5) => {
        const currentSeasonIdx = getSeasonIndex(season);
        
        p.push();
        p.noFill();
        p.stroke(SEASON_HEX_COLORS[season]);
        p.strokeWeight(3);
        
        p.beginShape();
        journeyPath.forEach((point) => {
          const seasonIdx = point.season ? getSeasonIndex(point.season) : currentSeasonIdx;
          const pos = getTilePosition(point.row, point.col, seasonIdx, p);
          p.vertex(pos.x, pos.y, pos.z);
        });
        p.endShape();
        p.pop();
      };

      const drawFlatMatrixOverlay = (p: p5) => {
        p.push();
        // Position the flat matrix to the side of the torus
        p.translate(R * 2.5, 0, 0);
        p.rotateY(-p.HALF_PI * 0.3);
        
        const cellSize = 18;
        const gridSize = cellSize * 8;
        const offsetX = -gridSize / 2;
        const offsetY = -gridSize / 2;
        
        // Draw grid background
        p.fill(20, 25, 35, 200);
        p.noStroke();
        p.rect(offsetX - 5, offsetY - 5, gridSize + 10, gridSize + 10, 4);
        
        // Draw cells
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const x = offsetX + col * cellSize;
            const y = offsetY + row * cellSize;
            const isSelected = row === selectedTile.row && col === selectedTile.col;
            const tileKey = `${row}-${col}`;
            const isVisited = visitedTiles.has(tileKey);
            const ring = getTileRing(row, col) as RingLevel;
            
            // Cell fill based on state
            if (isSelected) {
              p.fill(SEASON_HEX_COLORS[season]);
            } else if (isVisited) {
              const seasonColor = p.color(SEASON_HEX_COLORS[season]);
              seasonColor.setAlpha(100);
              p.fill(seasonColor);
            } else {
              const ringColor = RING_COLORS[ring];
              p.fill(ringColor.r, ringColor.g, ringColor.b, 40);
            }
            
            p.stroke(60, 70, 90);
            p.strokeWeight(0.5);
            p.rect(x, y, cellSize - 1, cellSize - 1, 2);
            
            // Draw acronym
            p.fill(200);
            p.noStroke();
            p.textSize(6);
            p.textAlign(p.CENTER, p.CENTER);
            const acronym = getTileAcronym(row, col);
            p.text(acronym.split('×')[0], x + cellSize / 2, y + cellSize / 2);
          }
        }
        
        // Draw axis labels
        p.fill(150);
        p.textSize(8);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('CHORDS →', offsetX + gridSize / 2, offsetY + gridSize + 15);
        
        p.push();
        p.translate(offsetX - 15, offsetY + gridSize / 2);
        p.rotate(-p.HALF_PI);
        p.text('AGENDAS ↓', 0, 0);
        p.pop();
        
        p.pop();
      };

      const drawCrossSection = (p: p5) => {
        p.push();
        
        // Draw cross-section of torus tube
        const centerX = 0;
        const centerY = 0;
        
        // Draw tube cross-section circles
        p.noFill();
        p.stroke(80, 90, 100);
        p.strokeWeight(2);
        p.circle(centerX, centerY, r * 2);
        
        // Draw ring zones as concentric regions
        for (let ring = 4; ring >= 1; ring--) {
          const ringColor = RING_COLORS[ring as RingLevel];
          const zoneR = (r / 4) * (5 - ring) + r * 0.2;
          
          p.fill(ringColor.r, ringColor.g, ringColor.b, ringColor.a * 0.5);
          p.noStroke();
          p.circle(centerX, centerY, zoneR * 2);
        }
        
        // Draw flow arrows
        p.stroke(255, 200, 100);
        p.strokeWeight(2);
        
        // GL!TCH arrow (up)
        p.line(centerX - 80, -r - 30, centerX - 80, -r - 60);
        p.line(centerX - 80, -r - 60, centerX - 85, -r - 50);
        p.line(centerX - 80, -r - 60, centerX - 75, -r - 50);
        
        // TUNE arrow (down)
        p.line(centerX + 80, r + 30, centerX + 80, r + 60);
        p.line(centerX + 80, r + 60, centerX + 75, r + 50);
        p.line(centerX + 80, r + 60, centerX + 85, r + 50);
        
        // Labels
        p.fill(255, 200, 100);
        p.noStroke();
        p.textSize(10);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('GL!TCH ↑', centerX - 80, -r - 75);
        p.text('TUNE ↓', centerX + 80, r + 75);
        p.text('DRIFT ←→', centerX, r + 90);
        
        // Season label
        p.fill(SEASON_HEX_COLORS[season]);
        p.textSize(14);
        p.text(season, centerX, centerY);
        
        p.pop();
      };

      const drawUnfoldedView = (p: p5) => {
        p.push();
        
        const width = 350;
        const height = 200;
        const cellW = width / 8;
        const cellH = height / 40;
        
        const offsetX = -width / 2;
        const offsetY = -height / 2;
        
        // Draw unfolded torus as rectangle
        // θ (columns) on X-axis, φ (rows × seasons) on Y-axis
        
        // Background
        p.fill(15, 18, 25);
        p.noStroke();
        p.rect(offsetX - 10, offsetY - 10, width + 20, height + 20, 4);
        
        // Draw season bands
        SEASONS.forEach((s, sIdx) => {
          const y = offsetY + (sIdx / 5) * height;
          const h = height / 5;
          
          const seasonColor = p.color(SEASON_HEX_COLORS[s]);
          seasonColor.setAlpha(60);
          p.fill(seasonColor);
          p.noStroke();
          p.rect(offsetX, y, width, h);
          
          // Season label
          p.fill(SEASON_HEX_COLORS[s]);
          p.textSize(8);
          p.textAlign(p.LEFT, p.CENTER);
          p.text(s.slice(0, 3), offsetX + 5, y + h / 2);
        });
        
        // Draw tile grid
        const currentSeasonIdx = getSeasonIndex(season);
        
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const x = offsetX + col * cellW;
            const y = offsetY + (currentSeasonIdx * 8 + row) * cellH;
            
            const isSelected = row === selectedTile.row && col === selectedTile.col;
            const tileKey = `${row}-${col}`;
            const isVisited = visitedTiles.has(tileKey);
            
            if (isSelected) {
              p.fill(SEASON_HEX_COLORS[season]);
              p.stroke(255);
              p.strokeWeight(2);
            } else if (isVisited) {
              const sColor = p.color(SEASON_HEX_COLORS[season]);
              sColor.setAlpha(150);
              p.fill(sColor);
              p.stroke(80);
              p.strokeWeight(0.5);
            } else {
              p.noFill();
              p.stroke(60, 70, 80);
              p.strokeWeight(0.5);
            }
            
            p.rect(x, y, cellW - 1, cellH * 8 - 1, 1);
          }
        }
        
        // Axis labels
        p.fill(150);
        p.noStroke();
        p.textSize(10);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('θ (Columns) →', offsetX + width / 2, offsetY + height + 20);
        
        p.push();
        p.translate(offsetX - 25, offsetY + height / 2);
        p.rotate(-p.HALF_PI);
        p.text('φ (Rows × Seasons)', 0, 0);
        p.pop();
        
        p.pop();
      };

      const drawHoveredLabel = (p: p5) => {
        if (!hoveredTileRef.current) return;
        
        const { row, col } = hoveredTileRef.current;
        const acronym = getTileAcronym(row, col);
        const ring = getTileRing(row, col);
        const theta = columnToTheta(col);
        const phi = rowSeasonToPhi(row, season);
        const K = gaussianCurvature(phi, TORUS_BASE_MINOR_RADIUS);
        
        p.push();
        p.resetMatrix();
        
        const mx = p.mouseX - p.width / 2;
        const my = p.mouseY - p.height / 2;
        
        p.fill(15, 20, 30, 245);
        p.stroke(60, 70, 90);
        p.strokeWeight(1);
        p.rect(mx + 15, my - 35, 140, 70, 6);
        
        p.fill(255);
        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(14);
        p.text(acronym, mx + 22, my - 28);
        
        p.fill(150);
        p.textSize(9);
        p.text(`Ring ${ring} • θ=${theta.toFixed(2)} φ=${phi.toFixed(2)}`, mx + 22, my - 8);
        p.text(`Curvature: ${K.toFixed(4)}`, mx + 22, my + 6);
        p.text(`Season: ${season}`, mx + 22, my + 20);
        
        p.pop();
      };

      p.mousePressed = () => {
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
          
          if (hoveredTileRef.current && onTileClick) {
            const ring = getTileRing(hoveredTileRef.current.row, hoveredTileRef.current.col);
            if (ring <= currentUnlockedRing) {
              onTileClick(hoveredTileRef.current.row, hoveredTileRef.current.col);
            }
          }
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
          rotationRef.current.x = p.constrain(rotationRef.current.x, -p.HALF_PI, p.HALF_PI);
          
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseMoved = () => {
        if (controlsRef.current.viewMode !== 'torus' && controlsRef.current.viewMode !== 'flat-overlay') {
          hoveredTileRef.current = null;
          return;
        }
        
        const currentSeasonIdx = getSeasonIndex(season);
        let closestTile: { row: number; col: number } | null = null;
        let closestDist = Infinity;
        
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const pos = getTilePosition(row, col, currentSeasonIdx, p);
            const screenPos = project3DToScreen(pos, p);
            const dist = p.dist(p.mouseX, p.mouseY, screenPos.x, screenPos.y);
            
            if (dist < 25 && dist < closestDist) {
              closestDist = dist;
              closestTile = { row, col };
            }
          }
        }
        
        hoveredTileRef.current = closestTile;
      };

      const project3DToScreen = (pos: { x: number; y: number; z: number }, p: p5) => {
        const cosY = p.cos(rotationRef.current.y);
        const sinY = p.sin(rotationRef.current.y);
        const cosX = p.cos(rotationRef.current.x);
        const sinX = p.sin(rotationRef.current.x);
        
        let x1 = pos.x * cosY - pos.y * sinY;
        let y1 = pos.x * sinY + pos.y * cosY;
        let z1 = pos.z;
        
        let y2 = y1 * cosX - z1 * sinX;
        
        return {
          x: p.width / 2 + x1,
          y: p.height / 2 + y2
        };
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
  }, [selectedTile, season, visitedTiles, journeyPath, currentUnlockedRing, onTileClick, densityMap, getTilePosition, getSeasonIndex, R, r]);

  const handleReset = () => {
    rotationRef.current = { x: -0.3, y: 0 };
  };

  // Calculate stats for controls sidebar
  const seasonBreakdown = SEASONS.reduce((acc, s) => {
    acc[s] = Array.from(visitedTiles).filter(key => {
      // Count visited tiles
      return true;
    }).length;
    return acc;
  }, {} as Record<ManifoldSeason, number>);
  
  // Simple count - all visited tiles are in current season for now
  const totalEntries = visitedTiles.size;

  return (
    <div className="relative w-full h-full bg-background flex">
      {/* Main canvas */}
      <div ref={containerRef} className="flex-1 h-full" />
      
      {/* Controls sidebar */}
      <ManifoldControlsSidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCurvature={showCurvature}
        setShowCurvature={setShowCurvature}
        showSeasonColors={showSeasonColors}
        setShowSeasonColors={setShowSeasonColors}
        showWireframe={showWireframe}
        setShowWireframe={setShowWireframe}
        showTileMarkers={showTileMarkers}
        setShowTileMarkers={setShowTileMarkers}
        showConnections={showConnections}
        setShowConnections={setShowConnections}
        showRingZones={showRingZones}
        setShowRingZones={setShowRingZones}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        opacity={opacity}
        setOpacity={setOpacity}
        currentSeason={season}
        selectedTile={selectedTile}
        seasonBreakdown={seasonBreakdown}
        totalEntries={totalEntries}
        onReset={handleReset}
      />
      
      {/* Bottom info bar */}
      <div className="absolute bottom-3 left-3 right-64 z-10 p-2.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `#${SEASON_HEX_COLORS[season].toString(16).padStart(6, '0')}` }} />
            <span className="font-medium">{season}</span>
          </span>
          <span className="text-muted-foreground">
            Selected: <span className="text-foreground">{getTileAcronym(selectedTile.row, selectedTile.col)}</span>
          </span>
          <span className="text-muted-foreground">
            Ring: <span className="text-foreground">{getTileRing(selectedTile.row, selectedTile.col)}</span>
          </span>
        </div>
        <span className="text-muted-foreground">
          Drag to rotate • Click tile to navigate
        </span>
      </div>
    </div>
  );
}
