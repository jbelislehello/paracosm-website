import React, { useRef, useEffect, useState, useCallback } from 'react';
import p5 from 'p5';
import { ManifoldSeason, SEASON_HEX_COLORS, tileToTorusPoint, getTileAcronym } from '@/utils/torusManifoldMath';
import { RingLevel, getTileRing } from '@/utils/ringToleranceSystem';

export type IsometricViewMode = 'isometric' | 'torus' | 'transitioning';

interface IsometricCubeMatrixProps {
  selectedTile: { row: number; col: number };
  season: ManifoldSeason;
  visitedTiles: Set<string>;
  journeyPath: Array<{ row: number; col: number; season?: ManifoldSeason }>;
  currentUnlockedRing: RingLevel;
  onTileClick?: (row: number, col: number) => void;
  densityMap?: Map<string, number>;
  viewMode?: IsometricViewMode;
  showHorizonGrid?: boolean;
  showDepthFog?: boolean;
  cubeSize?: number;
  isAnimating?: boolean;
}

interface CubeState {
  row: number;
  col: number;
  isVisited: boolean;
  isSelected: boolean;
  isAccessible: boolean;
  ring: RingLevel;
  density: number;
  stepNumber?: number;
}

// Isometric projection constants
const ISO_ANGLE = Math.PI / 6; // 30 degrees
const COS_ISO = Math.cos(ISO_ANGLE);
const SIN_ISO = Math.sin(ISO_ANGLE);

export function IsometricCubeMatrix({
  selectedTile,
  season,
  visitedTiles,
  journeyPath,
  currentUnlockedRing,
  onTileClick,
  densityMap = new Map(),
  viewMode = 'isometric',
  showHorizonGrid = true,
  showDepthFog = true,
  cubeSize = 32,
  isAnimating = false
}: IsometricCubeMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [foldProgress, setFoldProgress] = useState(0);
  const [hoverTile, setHoverTile] = useState<{ row: number; col: number } | null>(null);
  
  // Camera controls
  const rotationRef = useRef({ x: -0.5, y: -0.4 }); // Adjusted for bottom-left view
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Get season hue for coloring
  const getSeasonHue = useCallback((): number => {
    const hues: Record<ManifoldSeason, number> = {
      'POLLENS': 340,   // Rose/pink
      'NOEMS': 280,     // Purple
      'POEMS': 220,     // Blue
      'TOTEMS': 160,    // Teal/green
      'ANTHEMS': 40     // Amber/gold
    };
    return hues[season] || 220;
  }, [season]);

  // Get cube state for a tile
  const getCubeState = useCallback((row: number, col: number): CubeState => {
    const tileKey = `${row}-${col}`;
    const isVisited = visitedTiles.has(tileKey);
    const isSelected = selectedTile.row === row && selectedTile.col === col;
    const ring = getTileRing(row, col);
    const isAccessible = ring <= currentUnlockedRing;
    const density = densityMap.get(tileKey) || 0;
    
    // Find step number if visited
    const pathIndex = journeyPath.findIndex(p => p.row === row && p.col === col);
    const stepNumber = pathIndex >= 0 ? pathIndex + 1 : undefined;

    return { row, col, isVisited, isSelected, isAccessible, ring, density, stepNumber };
  }, [visitedTiles, selectedTile, currentUnlockedRing, densityMap, journeyPath]);

  // Convert grid position to isometric screen coordinates
  // FIXED: Row 0, Col 0 now at bottom-left
  const gridToIsometric = useCallback((row: number, col: number, elevation: number = 0): { x: number; y: number } => {
    // Flip row so row 0 is at bottom, row 7 at top
    const flippedRow = 7 - row;
    
    // Standard isometric projection
    const x = (col - flippedRow) * cubeSize * COS_ISO;
    const y = (col + flippedRow) * cubeSize * SIN_ISO - elevation;
    
    // Offset to position origin (0,0) at bottom-left of view
    const offsetX = -cubeSize * 3;
    const offsetY = cubeSize * 2;
    
    return { x: x + offsetX, y: y + offsetY };
  }, [cubeSize]);

  // Convert grid position to torus 3D coordinates
  const gridToTorus = useCallback((row: number, col: number, density: number = 0): { x: number; y: number; z: number } => {
    const [tx, ty, tz] = tileToTorusPoint(row, col, season, density);
    // Scale for visualization
    const scale = 60;
    return { x: tx * scale, y: ty * scale, z: tz * scale };
  }, [season]);

  // Interpolate between isometric and torus positions
  const getInterpolatedPosition = useCallback((
    row: number, 
    col: number, 
    progress: number,
    density: number = 0
  ): { x: number; y: number; z: number } => {
    const iso = gridToIsometric(row, col, 0);
    const torus = gridToTorus(row, col, density);
    
    // Lerp between positions
    return {
      x: iso.x + (torus.x - iso.x) * progress,
      y: iso.y + (torus.y - iso.y) * progress,
      z: (torus.z) * progress
    };
  }, [gridToIsometric, gridToTorus]);

  // Get season color
  const getSeasonColor = useCallback((p: p5, ring: RingLevel): p5.Color => {
    const seasonHex = SEASON_HEX_COLORS[season];
    const r = (seasonHex >> 16) & 255;
    const g = (seasonHex >> 8) & 255;
    const b = seasonHex & 255;
    
    // Darken based on ring
    const ringFactor = 1 - (ring - 1) * 0.15;
    return p.color(r * ringFactor, g * ringFactor, b * ringFactor);
  }, [season]);

  // Calculate depth fog based on distance from camera
  // FIXED: Fog increases toward top-right (away from bottom-left camera position)
  const getDepthFog = useCallback((row: number, col: number): number => {
    // With origin at bottom-left, fog increases for higher rows and higher cols
    const flippedRow = 7 - row; // Flip to match visual position
    const distanceFromCamera = flippedRow * 0.5 + col * 0.6;
    const normalizedDistance = distanceFromCamera / 10;
    return Math.min(0.6, normalizedDistance * 0.4);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let width = containerRef.current?.clientWidth || 800;
      let height = containerRef.current?.clientHeight || 600;
      const seasonHue = getSeasonHue();

      p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        p.textFont('monospace');
        p.colorMode(p.HSB, 360, 100, 100, 1);
      };

      p.windowResized = () => {
        width = containerRef.current?.clientWidth || 800;
        height = containerRef.current?.clientHeight || 600;
        p.resizeCanvas(width, height);
      };

      p.draw = () => {
        // Draw horizon background gradient
        drawHorizonBackground(p, seasonHue);

        // Camera/view rotation
        if (isAnimating && viewMode === 'torus') {
          rotationRef.current.y += 0.003;
        }

        p.push();
        
        // Apply pan
        p.translate(panRef.current.x, panRef.current.y, 0);
        
        // Apply zoom
        p.scale(zoomRef.current);
        
        // Apply rotation for 3D view
        p.rotateX(rotationRef.current.x);
        p.rotateY(rotationRef.current.y);

        // Calculate fold progress for animation
        const targetFold = viewMode === 'torus' ? 1 : viewMode === 'isometric' ? 0 : foldProgress;
        const currentFold = foldProgress + (targetFold - foldProgress) * 0.05;
        setFoldProgress(currentFold);

        // Draw solid ground plane first (behind cubes)
        if (currentFold < 0.5) {
          drawGroundPlane(p, seasonHue, currentFold);
        }

        // Draw all 64 cubes - sorted by depth for proper rendering
        // FIXED: Depth sorting for bottom-left origin perspective
        const cubesWithDepth: Array<{ row: number; col: number; depth: number }> = [];
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            // With bottom-left origin, depth = flippedRow + col
            // Back cubes (high flippedRow, high col) should render first
            const flippedRow = 7 - row;
            const depth = flippedRow + col;
            cubesWithDepth.push({ row, col, depth });
          }
        }
        // Sort back-to-front (higher depth = further back = render first)
        cubesWithDepth.sort((a, b) => b.depth - a.depth);
        
        for (const { row, col } of cubesWithDepth) {
          const state = getCubeState(row, col);
          drawCube(p, state, currentFold, seasonHue);
        }

        // Draw journey path connections
        if (journeyPath.length > 1) {
          drawJourneyPath(p, currentFold);
        }

        // Draw axis labels
        if (currentFold < 0.5) {
          drawAxisLabels(p, currentFold);
        }

        p.pop();

        // Draw 2D overlay info
        draw2DOverlay(p, seasonHue);
      };

      const drawHorizonBackground = (p: p5, hue: number) => {
        // Create gradient background from top (dark) to horizon (lighter)
        p.push();
        p.resetMatrix();
        p.camera();
        p.noStroke();
        
        const gradientSteps = 30;
        const stepHeight = height / gradientSteps;
        
        for (let i = 0; i < gradientSteps; i++) {
          const t = i / gradientSteps;
          // Dark at top, slightly lighter toward middle
          const brightness = 6 + t * 12;
          const saturation = 25 - t * 10;
          p.fill(hue, saturation, brightness);
          p.rect(-width/2, -height/2 + i * stepHeight, width, stepHeight + 1);
        }
        
        // Horizon glow band
        const horizonY = height * 0.35 - height/2;
        for (let i = 0; i < 8; i++) {
          const glowOpacity = (8 - i) / 25;
          p.fill(hue, 40, 35, glowOpacity);
          p.rect(-width/2, horizonY + i * 8, width, 10);
        }
        
        p.pop();
      };

      const drawGroundPlane = (p: p5, hue: number, fold: number) => {
        const opacity = 1 - fold * 2;
        if (opacity <= 0) return;

        p.push();
        
        // Position floor plane below cubes
        const floorY = cubeSize * 4.5;
        p.translate(0, floorY, 0);
        
        // Rotate to make it horizontal
        p.rotateX(p.HALF_PI);
        
        // Draw expanding floor rings with fade
        const maxRings = 18;
        const baseSize = cubeSize * 10;
        
        for (let ring = maxRings; ring >= 0; ring--) {
          const ringProgress = ring / maxRings;
          const size = baseSize + ring * cubeSize * 2.5;
          
          // Floor color with fade toward edges
          const brightness = 12 - ringProgress * 8;
          const saturation = 30 - ringProgress * 15;
          const alpha = opacity * (1 - ringProgress * 0.7);
          
          p.fill(hue, saturation, brightness, alpha);
          p.noStroke();
          
          // Draw as quad for better perspective
          p.beginShape();
          p.vertex(-size/2, -size/2);
          p.vertex(size/2, -size/2);
          p.vertex(size/2, size/2);
          p.vertex(-size/2, size/2);
          p.endShape(p.CLOSE);
        }
        
        // Draw grid lines on the floor
        if (showHorizonGrid) {
          p.stroke(hue, 20, 25, opacity * 0.4);
          p.strokeWeight(1);
          
          const gridExtent = cubeSize * 14;
          const gridStep = cubeSize * 1.5;
          
          for (let i = -gridExtent; i <= gridExtent; i += gridStep) {
            // Fade lines toward edges
            const distFromCenter = Math.abs(i) / gridExtent;
            const lineOpacity = opacity * 0.35 * (1 - distFromCenter * 0.7);
            p.stroke(hue, 15, 30, lineOpacity);
            
            // X lines
            p.line(i, -gridExtent, i, gridExtent);
            // Y lines  
            p.line(-gridExtent, i, gridExtent, i);
          }
        }
        
        // Draw ground shadows under cube positions
        p.noStroke();
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const state = getCubeState(row, col);
            if (state.isVisited || state.isSelected) {
              const iso = gridToIsometric(row, col);
              // Shadow ellipse
              const shadowOpacity = state.isSelected ? 0.25 : 0.15;
              p.fill(0, 0, 0, shadowOpacity * opacity);
              p.ellipse(iso.x, iso.y * 0.5, cubeSize * 0.9, cubeSize * 0.5);
            }
          }
        }
        
        p.pop();
      };

      const drawCube = (p: p5, state: CubeState, fold: number, hue: number) => {
        const { row, col, isVisited, isSelected, isAccessible, ring, density, stepNumber } = state;
        const pos = getInterpolatedPosition(row, col, fold, density);
        
        // Calculate depth fog
        const fogAmount = showDepthFog ? getDepthFog(row, col) : 0;
        
        // Elevation for selected/visited cubes - sitting ON the ground
        let elevation = 0;
        if (isSelected) elevation = cubeSize * 0.5;
        else if (isVisited) elevation = cubeSize * 0.15 + density * cubeSize * 0.08;

        const isHovered = hoverTile?.row === row && hoverTile?.col === col;
        if (isHovered && isAccessible) elevation += cubeSize * 0.12;

        p.push();
        // Position cube so base sits on ground plane
        p.translate(pos.x, pos.y - elevation - cubeSize * 0.4, pos.z);

        // Scale based on fold progress for torus view
        const scale = 1 - fold * 0.3;
        p.scale(scale);

        const size = cubeSize * 0.82;
        const halfSize = size / 2;

        // Determine colors based on state
        let topH: number, topS: number, topB: number;
        let frontH: number, frontS: number, frontB: number;
        let sideH: number, sideS: number, sideB: number;
        let strokeAlpha: number;

        if (!isAccessible) {
          // Locked - very faint, foggy
          topH = hue; topS = 10; topB = 15 - fogAmount * 10;
          frontH = hue; frontS = 8; frontB = 12 - fogAmount * 8;
          sideH = hue; sideS = 6; sideB = 10 - fogAmount * 6;
          strokeAlpha = 0.2;
        } else if (isSelected) {
          // Selected - bright glow, less affected by fog
          topH = hue; topS = 60; topB = 85 - fogAmount * 15;
          frontH = hue; frontS = 70; frontB = 70 - fogAmount * 10;
          sideH = hue; sideS = 75; sideB = 55 - fogAmount * 8;
          strokeAlpha = 0.9;
          
          // Pulsing glow effect
          const pulse = Math.sin(p.frameCount * 0.1) * 0.2 + 0.8;
          p.push();
          p.noFill();
          p.stroke(hue, 50, 90, 0.4 * pulse);
          p.strokeWeight(3);
          p.box(size * 1.15);
          p.pop();
        } else if (isVisited) {
          // Visited - solid fill with fog
          const ringDarken = (ring - 1) * 8;
          topH = hue; topS = 55; topB = 65 - ringDarken - fogAmount * 20;
          frontH = hue; frontS = 60; frontB = 50 - ringDarken - fogAmount * 15;
          sideH = hue; sideS = 65; sideB = 40 - ringDarken - fogAmount * 12;
          strokeAlpha = 0.6 - fogAmount * 0.3;
        } else {
          // Accessible but not visited - wireframe/transparent with fog
          topH = hue; topS = 15; topB = 25 - fogAmount * 15;
          frontH = hue; frontS = 12; frontB = 20 - fogAmount * 12;
          sideH = hue; sideS = 10; sideB = 18 - fogAmount * 10;
          strokeAlpha = 0.35 - fogAmount * 0.2;
        }

        // Apply fog to colors (blend toward background)
        const fogBlend = fogAmount * 0.5;
        topB = topB * (1 - fogBlend) + 10 * fogBlend;
        frontB = frontB * (1 - fogBlend) + 8 * fogBlend;
        sideB = sideB * (1 - fogBlend) + 6 * fogBlend;

        // Draw cube faces
        p.strokeWeight(isSelected ? 2 : 1);
        p.stroke(hue, 30, 50, strokeAlpha);

        // Top face (brightest)
        p.fill(topH, topS, topB, isAccessible ? 0.95 : 0.4);
        p.beginShape();
        p.vertex(-halfSize, -halfSize, halfSize);
        p.vertex(halfSize, -halfSize, halfSize);
        p.vertex(halfSize, halfSize, halfSize);
        p.vertex(-halfSize, halfSize, halfSize);
        p.endShape(p.CLOSE);

        // Front face (medium)
        p.fill(frontH, frontS, frontB, isAccessible ? 0.9 : 0.35);
        p.beginShape();
        p.vertex(-halfSize, halfSize, halfSize);
        p.vertex(halfSize, halfSize, halfSize);
        p.vertex(halfSize, halfSize, -halfSize);
        p.vertex(-halfSize, halfSize, -halfSize);
        p.endShape(p.CLOSE);

        // Right side face (darkest)
        p.fill(sideH, sideS, sideB, isAccessible ? 0.85 : 0.3);
        p.beginShape();
        p.vertex(halfSize, -halfSize, halfSize);
        p.vertex(halfSize, halfSize, halfSize);
        p.vertex(halfSize, halfSize, -halfSize);
        p.vertex(halfSize, -halfSize, -halfSize);
        p.endShape(p.CLOSE);

        // Left side face (for depth)
        p.fill(sideH, sideS + 5, sideB - 5, isAccessible ? 0.8 : 0.25);
        p.beginShape();
        p.vertex(-halfSize, -halfSize, halfSize);
        p.vertex(-halfSize, halfSize, halfSize);
        p.vertex(-halfSize, halfSize, -halfSize);
        p.vertex(-halfSize, -halfSize, -halfSize);
        p.endShape(p.CLOSE);

        // Bottom face (for grounding)
        p.fill(sideH, sideS, sideB - 8, isAccessible ? 0.7 : 0.2);
        p.beginShape();
        p.vertex(-halfSize, -halfSize, -halfSize);
        p.vertex(halfSize, -halfSize, -halfSize);
        p.vertex(halfSize, halfSize, -halfSize);
        p.vertex(-halfSize, halfSize, -halfSize);
        p.endShape(p.CLOSE);

        // Draw tile acronym on top face
        if (isAccessible && fold < 0.7) {
          const acronym = getTileAcronym(row, col);
          const textOpacity = (1 - fold) * (1 - fogAmount * 0.6);
          p.push();
          p.translate(0, 0, halfSize + 1);
          p.rotateX(-Math.PI / 2);
          p.colorMode(p.RGB, 255);
          p.fill(255, 255, 255, textOpacity * 255);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(size * 0.24);
          p.text(acronym, 0, 0);
          
          // Step number badge
          if (stepNumber !== undefined) {
            p.fill(255, 220, 100, textOpacity * 255);
            p.textSize(size * 0.18);
            p.text(`#${stepNumber}`, 0, size * 0.24);
          }
          p.colorMode(p.HSB, 360, 100, 100, 1);
          p.pop();
        }

        p.pop();
      };

      const drawJourneyPath = (p: p5, fold: number) => {
        if (journeyPath.length < 2) return;

        p.push();
        p.strokeWeight(2.5);
        p.noFill();

        // Draw connecting lines between visited tiles
        for (let i = 0; i < journeyPath.length - 1; i++) {
          const from = journeyPath[i];
          const to = journeyPath[i + 1];
          
          const fromPos = getInterpolatedPosition(from.row, from.col, fold);
          const toPos = getInterpolatedPosition(to.row, to.col, fold);

          // Offset Y to sit above ground
          const fromY = fromPos.y - cubeSize * 0.5;
          const toY = toPos.y - cubeSize * 0.5;

          // Gradient color along path
          const progress = i / (journeyPath.length - 1);
          const pathHue = p.lerp(200, 40, progress); // Blue to gold
          const pathBrightness = 70 - getDepthFog(from.row, from.col) * 30;
          
          p.stroke(pathHue, 60, pathBrightness, 0.7);

          // Animated dashed line
          const dashOffset = (p.frameCount * 0.05) % 1;
          const segments = 10;
          for (let j = 0; j < segments; j++) {
            const t1 = (j + dashOffset) / segments;
            const t2 = (j + 0.5 + dashOffset) / segments;
            if (t2 > 1) continue;

            const x1 = fromPos.x + (toPos.x - fromPos.x) * t1;
            const y1 = fromY + (toY - fromY) * t1;
            const z1 = fromPos.z + (toPos.z - fromPos.z) * t1;
            const x2 = fromPos.x + (toPos.x - fromPos.x) * Math.min(t2, 1);
            const y2 = fromY + (toY - fromY) * Math.min(t2, 1);
            const z2 = fromPos.z + (toPos.z - fromPos.z) * Math.min(t2, 1);

            p.line(x1, y1, z1, x2, y2, z2);
          }
        }

        p.pop();
      };

      const drawAxisLabels = (p: p5, fold: number) => {
        const opacity = 1 - fold * 2;
        if (opacity <= 0) return;

        p.push();
        p.colorMode(p.RGB, 255);
        
        // Column labels (LONGEVITY HORIZON) - along bottom edge
        const colLabels = ['C', 'H', 'O', 'R', 'D', 'S', 'M', 'Σ'];
        p.fill(150, 180, 200, opacity * 255);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);

        for (let col = 0; col < 8; col++) {
          // Labels below the matrix at row -1
          const pos = gridToIsometric(-1, col);
          p.push();
          p.translate(pos.x, pos.y + cubeSize * 0.5, 0);
          p.text(colLabels[col], 0, 0);
          p.pop();
        }

        // Row labels (VELOCITY) - along left edge
        // FIXED: Labels now match visual order with origin at bottom-left
        const rowLabels = ['M', 'A', 'G', 'I', 'C', 'N', 'S', 'P']; // Row 0 = M (Mindsets)
        for (let row = 0; row < 8; row++) {
          const pos = gridToIsometric(row, -1);
          p.push();
          p.translate(pos.x - cubeSize * 0.5, pos.y, 0);
          p.text(rowLabels[row], 0, 0);
          p.pop();
        }

        // Origin label - Mindsets × Chances at bottom-left
        const originPos = gridToIsometric(0, 0);
        p.fill(255, 220, 100, opacity * 200);
        p.textSize(10);
        p.push();
        p.translate(originPos.x - cubeSize * 1.5, originPos.y + cubeSize * 0.8, 0);
        p.text('ORIGIN', 0, 0);
        p.text('(0,0)', 0, 12);
        p.pop();

        // Axis arrows
        p.stroke(100, 130, 160, opacity * 200);
        p.strokeWeight(2);

        // Longevity arrow (horizontal, pointing right along cols)
        const longevityStart = gridToIsometric(-0.5, -0.5);
        const longevityEnd = gridToIsometric(-0.5, 8.5);
        p.line(longevityStart.x, longevityStart.y, 0, longevityEnd.x, longevityEnd.y, 0);
        // Arrow head
        p.push();
        p.translate(longevityEnd.x, longevityEnd.y, 0);
        p.fill(100, 130, 160, opacity * 200);
        p.noStroke();
        p.rotate(-ISO_ANGLE);
        p.triangle(0, 0, -12, -5, -12, 5);
        p.pop();

        // Velocity arrow (vertical, pointing up along rows)
        const velocityStart = gridToIsometric(-0.5, -0.5);
        const velocityEnd = gridToIsometric(8.5, -0.5);
        p.line(velocityStart.x, velocityStart.y, 0, velocityEnd.x, velocityEnd.y, 0);
        // Arrow head
        p.push();
        p.translate(velocityEnd.x, velocityEnd.y, 0);
        p.fill(100, 130, 160, opacity * 200);
        p.noStroke();
        p.rotate(ISO_ANGLE + Math.PI);
        p.triangle(0, 0, -12, -5, -12, 5);
        p.pop();

        // Axis labels
        p.fill(120, 150, 180, opacity * 200);
        p.textSize(10);
        p.push();
        p.translate(longevityEnd.x + 15, longevityEnd.y - 5, 0);
        p.text('LONGEVITY →', 0, 0);
        p.pop();

        p.push();
        p.translate(velocityEnd.x - 15, velocityEnd.y - 10, 0);
        p.text('↑ VELOCITY', 0, 0);
        p.pop();

        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.pop();
      };

      const drawMinimap = (p: p5, hue: number) => {
        // Minimap configuration
        const minimapSize = 90;
        const padding = 12;
        const cellSize = minimapSize / 8;
        
        // Position in bottom-right corner
        const minimapX = width/2 - minimapSize - padding - 15;
        const minimapY = height/2 - minimapSize - padding - 50;
        
        // Get season colors for visited tiles
        const seasonHex = SEASON_HEX_COLORS[season];
        const seasonR = (seasonHex >> 16) & 255;
        const seasonG = (seasonHex >> 8) & 255;
        const seasonB = seasonHex & 255;
        
        // Background panel
        p.fill(0, 0, 0, 180);
        p.stroke(60, 70, 90, 200);
        p.strokeWeight(1);
        p.rect(minimapX - padding, minimapY - padding - 18, 
               minimapSize + padding * 2, minimapSize + padding * 2 + 48, 8);
        
        // Title
        p.fill(180, 190, 200, 200);
        p.noStroke();
        p.textSize(9);
        p.textAlign(p.LEFT, p.TOP);
        p.text('MINIMAP', minimapX - padding + 8, minimapY - padding - 12);
        
        // Draw 8x8 grid cells (row 0 at bottom, matching main view)
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const state = getCubeState(row, col);
            // Row 0 at bottom, row 7 at top
            const x = minimapX + col * cellSize;
            const y = minimapY + (7 - row) * cellSize;
            
            // Color based on state
            if (state.isSelected) {
              p.fill(255, 220, 100, 255);  // Gold for selected
            } else if (state.isVisited) {
              p.fill(seasonR, seasonG, seasonB, 220); // Season color
            } else if (state.isAccessible) {
              p.fill(70, 80, 100, 150);   // Dim for accessible
            } else {
              p.fill(35, 40, 50, 100);    // Very dim for locked
            }
            
            p.noStroke();
            p.rect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, 1);
          }
        }
        
        // Grid border
        p.noFill();
        p.stroke(100, 110, 130, 180);
        p.strokeWeight(1);
        p.rect(minimapX, minimapY, minimapSize, minimapSize);
        
        // Draw grid lines
        p.stroke(70, 80, 100, 100);
        p.strokeWeight(0.5);
        for (let i = 1; i < 8; i++) {
          // Vertical lines
          p.line(minimapX + i * cellSize, minimapY, 
                 minimapX + i * cellSize, minimapY + minimapSize);
          // Horizontal lines
          p.line(minimapX, minimapY + i * cellSize,
                 minimapX + minimapSize, minimapY + i * cellSize);
        }
        
        // Camera direction indicator
        const centerX = minimapX + minimapSize / 2;
        const centerY = minimapY + minimapSize / 2;
        const cameraDistance = minimapSize * 0.58;
        const cameraAngle = rotationRef.current.y;
        
        // Camera eye position (orbiting around center)
        const eyeX = centerX + Math.sin(cameraAngle) * cameraDistance;
        const eyeY = centerY - Math.cos(cameraAngle) * cameraDistance * 0.7;
        
        // Draw view cone from camera to grid
        p.fill(255, 255, 255, 35);
        p.noStroke();
        const coneAngle = 0.4; // Field of view half-angle
        p.beginShape();
        p.vertex(eyeX, eyeY);
        // Two edges of the cone toward the center
        const coneReach = minimapSize * 0.65;
        p.vertex(centerX + Math.sin(cameraAngle + coneAngle) * coneReach * 0.3,
                 centerY - Math.cos(cameraAngle + coneAngle) * coneReach * 0.3);
        p.vertex(centerX + Math.sin(cameraAngle - coneAngle) * coneReach * 0.3,
                 centerY - Math.cos(cameraAngle - coneAngle) * coneReach * 0.3);
        p.endShape(p.CLOSE);
        
        // View direction line
        p.stroke(255, 255, 255, 80);
        p.strokeWeight(1);
        p.line(eyeX, eyeY, centerX, centerY);
        
        // Camera eye icon (outer)
        p.fill(30, 40, 60, 230);
        p.stroke(180, 190, 210, 200);
        p.strokeWeight(1.5);
        p.ellipse(eyeX, eyeY, 14, 10);
        // Pupil
        p.fill(seasonR, seasonG, seasonB, 255);
        p.noStroke();
        p.ellipse(eyeX, eyeY, 6, 5);
        
        // Pan offset indicator (crosshair that moves with pan)
        const panScale = 0.04;
        const panOffsetX = Math.max(-20, Math.min(20, panRef.current.x * panScale));
        const panOffsetY = Math.max(-20, Math.min(20, panRef.current.y * panScale));
        const crossX = centerX + panOffsetX;
        const crossY = centerY + panOffsetY;
        
        p.stroke(255, 200, 100, 180);
        p.strokeWeight(1);
        p.line(crossX - 6, crossY, crossX + 6, crossY);
        p.line(crossX, crossY - 6, crossX, crossY + 6);
        // Small circle at center
        p.noFill();
        p.ellipse(crossX, crossY, 4, 4);
        
        // Axis labels
        p.fill(150, 160, 180, 200);
        p.noStroke();
        p.textSize(8);
        p.textAlign(p.CENTER, p.BOTTOM);
        // M (Mindsets) at bottom-left origin
        p.text('M', minimapX - 6, minimapY + minimapSize + 2);
        // P (Protocols) at top-left
        p.textAlign(p.CENTER, p.TOP);
        p.text('P', minimapX - 6, minimapY - 4);
        // Σ (Systems) at bottom-right
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('Σ', minimapX + minimapSize + 6, minimapY + minimapSize + 2);
        
        // Zoom level bar
        const zoomBarWidth = 60;
        const zoomBarHeight = 5;
        const zoomBarX = minimapX + (minimapSize - zoomBarWidth) / 2;
        const zoomBarY = minimapY + minimapSize + 14;
        
        // Background bar
        p.fill(30, 35, 45, 200);
        p.noStroke();
        p.rect(zoomBarX, zoomBarY, zoomBarWidth, zoomBarHeight, 3);
        
        // Filled portion based on zoom (0.3 to 3.0 range)
        const zoomNormalized = (zoomRef.current - 0.3) / (3 - 0.3);
        p.fill(seasonR, seasonG, seasonB, 200);
        p.rect(zoomBarX, zoomBarY, zoomBarWidth * zoomNormalized, zoomBarHeight, 3);
        
        // Zoom text
        p.fill(180, 185, 195, 200);
        p.textSize(8);
        p.textAlign(p.CENTER, p.TOP);
        p.text(`${zoomRef.current.toFixed(1)}x zoom`, minimapX + minimapSize/2, zoomBarY + 8);
        
        // Current tile indicator in minimap
        if (selectedTile) {
          const selX = minimapX + selectedTile.col * cellSize + cellSize / 2;
          const selY = minimapY + (7 - selectedTile.row) * cellSize + cellSize / 2;
          p.noFill();
          p.stroke(255, 220, 100, 200);
          p.strokeWeight(2);
          p.ellipse(selX, selY, cellSize + 2, cellSize + 2);
        }
      };

      const draw2DOverlay = (p: p5, hue: number) => {
        // Reset to 2D for overlay
        p.push();
        p.resetMatrix();
        p.camera();
        p.colorMode(p.RGB, 255);

        // View mode indicator with subtle background
        p.fill(0, 0, 0, 120);
        p.noStroke();
        p.rect(-width/2 + 10, -height/2 + 10, 160, 60, 6);
        
        p.fill(255, 255, 255, 200);
        p.textSize(11);
        p.textAlign(p.LEFT, p.TOP);
        const modeText = viewMode === 'torus' ? 'TORUS VIEW' : 
                        viewMode === 'transitioning' ? 'TRANSITIONING...' : 
                        'HORIZON VIEW';
        p.text(modeText, -width/2 + 18, -height/2 + 16);

        // Season indicator
        const seasonHex = SEASON_HEX_COLORS[season];
        p.fill((seasonHex >> 16) & 255, (seasonHex >> 8) & 255, seasonHex & 255, 220);
        p.text(season, -width/2 + 18, -height/2 + 32);
        
        // Controls hint
        p.fill(180, 180, 180, 180);
        p.textSize(9);
        p.text('Drag: Rotate | Shift+Drag: Pan', -width/2 + 18, -height/2 + 48);
        p.text('Scroll: Zoom | Dbl-click: Reset', -width/2 + 18, -height/2 + 58);

        // Draw minimap in bottom-right
        drawMinimap(p, hue);

        // Hover info
        if (hoverTile) {
          const state = getCubeState(hoverTile.row, hoverTile.col);
          const acronym = getTileAcronym(hoverTile.row, hoverTile.col);
          const statusText = state.isVisited ? '✓ Visited' : 
                            state.isAccessible ? 'Available' : 
                            '🔒 Locked';
          
          p.fill(0, 0, 0, 150);
          p.rect(-width/2 + 10, height/2 - 45, 200, 35, 6);
          
          p.fill(255, 255, 255, 240);
          p.textSize(12);
          p.text(`${acronym} (R${hoverTile.row}, C${hoverTile.col}) - ${statusText}`, 
                 -width/2 + 18, height/2 - 35);
        }

        p.pop();
      };

      // Mouse interaction
      p.mousePressed = () => {
        if (p.mouseX > 0 && p.mouseX < width && p.mouseY > 0 && p.mouseY < height) {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseReleased = () => {
        if (isDraggingRef.current && 
            Math.abs(p.mouseX - lastMouseRef.current.x) < 5 && 
            Math.abs(p.mouseY - lastMouseRef.current.y) < 5) {
          // It was a click, not a drag - find clicked tile
          handleTileClick(p.mouseX, p.mouseY);
        }
        isDraggingRef.current = false;
      };

      // ENHANCED: Full 360° rotation + pan with shift
      p.mouseDragged = () => {
        if (isDraggingRef.current) {
          const dx = p.mouseX - lastMouseRef.current.x;
          const dy = p.mouseY - lastMouseRef.current.y;
          
          if (p.keyIsDown(p.SHIFT)) {
            // Pan mode when shift is held
            panRef.current.x += dx;
            panRef.current.y += dy;
          } else {
            // Rotate mode - full 360° allowed
            rotationRef.current.y += dx * 0.008;
            rotationRef.current.x += dy * 0.008;
            
            // Wrap Y rotation for continuous spinning
            if (rotationRef.current.y > Math.PI * 2) rotationRef.current.y -= Math.PI * 2;
            if (rotationRef.current.y < -Math.PI * 2) rotationRef.current.y += Math.PI * 2;
            
            // No clamping on X - allow full vertical rotation
          }
          
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      // ENHANCED: Zoom with mouse wheel
      p.mouseWheel = (event: WheelEvent) => {
        if (p.mouseX > 0 && p.mouseX < width && p.mouseY > 0 && p.mouseY < height) {
          const delta = event.deltaY > 0 ? 0.92 : 1.08;
          zoomRef.current *= delta;
          zoomRef.current = Math.max(0.3, Math.min(3, zoomRef.current));
          return false; // Prevent page scroll
        }
      };

      // ENHANCED: Double-click to reset view
      p.doubleClicked = () => {
        if (p.mouseX > 0 && p.mouseX < width && p.mouseY > 0 && p.mouseY < height) {
          rotationRef.current = { x: -0.5, y: -0.4 };
          panRef.current = { x: 0, y: 0 };
          zoomRef.current = 1;
        }
      };

      p.mouseMoved = () => {
        // Approximate hover detection with fixed orientation
        const centerX = width / 2 + panRef.current.x;
        const centerY = height / 2 + panRef.current.y;
        const relX = (p.mouseX - centerX) / zoomRef.current;
        const relY = (p.mouseY - centerY) / zoomRef.current;

        // Reverse isometric projection (accounting for flipped rows)
        const isoScale = cubeSize * COS_ISO;
        const isoSinScale = cubeSize * SIN_ISO;
        
        // Adjust for offset
        const adjX = relX + cubeSize * 3;
        const adjY = relY - cubeSize * 2;
        
        const flippedRow = Math.round((adjY / isoSinScale - adjX / isoScale) / 2);
        const col = Math.round((adjX / isoScale + adjY / isoSinScale) / 2);
        const row = 7 - flippedRow; // Un-flip to get actual row

        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
          setHoverTile({ row, col });
        } else {
          setHoverTile(null);
        }
      };

      const handleTileClick = (mouseX: number, mouseY: number) => {
        if (!onTileClick || foldProgress > 0.5) return;

        const centerX = width / 2 + panRef.current.x;
        const centerY = height / 2 + panRef.current.y;
        const relX = (mouseX - centerX) / zoomRef.current;
        const relY = (mouseY - centerY) / zoomRef.current;

        // Reverse isometric projection (accounting for flipped rows)
        const isoScale = cubeSize * COS_ISO;
        const isoSinScale = cubeSize * SIN_ISO;
        
        // Adjust for offset
        const adjX = relX + cubeSize * 3;
        const adjY = relY - cubeSize * 2;
        
        const flippedRow = Math.round((adjY / isoSinScale - adjX / isoScale) / 2);
        const col = Math.round((adjX / isoScale + adjY / isoSinScale) / 2);
        const row = 7 - flippedRow; // Un-flip to get actual row

        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
          const state = getCubeState(row, col);
          if (state.isAccessible) {
            onTileClick(row, col);
          }
        }
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, [
    selectedTile, season, visitedTiles, journeyPath, currentUnlockedRing,
    onTileClick, densityMap, viewMode, showHorizonGrid, showDepthFog,
    cubeSize, isAnimating, getCubeState, getInterpolatedPosition, 
    gridToIsometric, getSeasonColor, getSeasonHue, getDepthFog, foldProgress, hoverTile
  ]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-background rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ minHeight: '450px' }}
    />
  );
}
