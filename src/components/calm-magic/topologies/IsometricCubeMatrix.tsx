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
  const rotationRef = useRef({ x: -0.4, y: 0.2 });
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
  const gridToIsometric = useCallback((row: number, col: number, elevation: number = 0): { x: number; y: number } => {
    const x = (col - row) * cubeSize * COS_ISO;
    const y = (col + row) * cubeSize * SIN_ISO - elevation;
    return { x, y };
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
  const getDepthFog = useCallback((row: number, col: number): number => {
    // Tiles further from camera (higher row, lower col) are more fogged
    const distanceFromCamera = row * 0.8 + (7 - col) * 0.4;
    const normalizedDistance = distanceFromCamera / 10;
    return Math.min(0.65, normalizedDistance * 0.45);
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
        
        // Apply rotation for 3D view - adjusted for horizon perspective
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
        const cubesWithDepth: Array<{ row: number; col: number; depth: number }> = [];
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            // Depth based on position - further cubes rendered first
            const depth = row + col;
            cubesWithDepth.push({ row, col, depth });
          }
        }
        // Sort by depth (back to front)
        cubesWithDepth.sort((a, b) => a.depth - b.depth);
        
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
        
        // Column labels (LONGEVITY HORIZON)
        const colLabels = ['C', 'H', 'O', 'R', 'D', 'S', 'M', 'Σ'];
        p.fill(150, 180, 200, opacity * 255);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);

        for (let col = 0; col < 8; col++) {
          const pos = gridToIsometric(-1.5, col);
          p.push();
          p.translate(pos.x, pos.y - cubeSize * 1.2, 0);
          p.text(colLabels[col], 0, 0);
          p.pop();
        }

        // Row labels (VELOCITY)
        const rowLabels = ['M', 'A', 'G', 'I', 'C', 'N', 'S', 'P'];
        for (let row = 0; row < 8; row++) {
          const pos = gridToIsometric(row, -1.5);
          p.push();
          p.translate(pos.x - cubeSize * 0.8, pos.y - cubeSize * 0.4, 0);
          p.text(rowLabels[row], 0, 0);
          p.pop();
        }

        // Axis arrows
        p.stroke(100, 130, 160, opacity * 200);
        p.strokeWeight(2);

        // Longevity arrow (horizontal)
        const longevityStart = gridToIsometric(-1, -1);
        const longevityEnd = gridToIsometric(-1, 9);
        p.line(longevityStart.x, longevityStart.y - cubeSize * 0.5, 0, longevityEnd.x, longevityEnd.y - cubeSize * 0.5, 0);
        p.push();
        p.translate(longevityEnd.x, longevityEnd.y - cubeSize * 0.5, 0);
        p.fill(100, 130, 160, opacity * 200);
        p.noStroke();
        p.triangle(0, 0, -10, -5, -10, 5);
        p.pop();

        // Velocity arrow (vertical)
        const velocityStart = gridToIsometric(-1, -1);
        const velocityEnd = gridToIsometric(9, -1);
        p.line(velocityStart.x, velocityStart.y - cubeSize * 0.5, 0, velocityEnd.x, velocityEnd.y - cubeSize * 0.5, 0);
        p.push();
        p.translate(velocityEnd.x, velocityEnd.y - cubeSize * 0.5, 0);
        p.fill(100, 130, 160, opacity * 200);
        p.noStroke();
        p.triangle(0, 0, -5, -10, 5, -10);
        p.pop();

        // Axis labels
        p.fill(120, 150, 180, opacity * 200);
        p.textSize(10);
        p.push();
        p.translate(longevityEnd.x + 25, longevityEnd.y - cubeSize * 0.5, 0);
        p.text('LONGEVITY →', 0, 0);
        p.pop();

        p.push();
        p.translate(velocityEnd.x, velocityEnd.y - cubeSize * 0.3 + 20, 0);
        p.text('↓ VELOCITY', 0, 0);
        p.pop();

        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.pop();
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
        p.rect(-width/2 + 10, -height/2 + 10, 130, 45, 6);
        
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
        p.text(season, -width/2 + 18, -height/2 + 34);

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

      p.mouseDragged = () => {
        if (isDraggingRef.current) {
          const dx = p.mouseX - lastMouseRef.current.x;
          const dy = p.mouseY - lastMouseRef.current.y;
          rotationRef.current.y += dx * 0.005;
          rotationRef.current.x += dy * 0.005;
          rotationRef.current.x = Math.max(-Math.PI/2, Math.min(Math.PI/4, rotationRef.current.x));
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseMoved = () => {
        // Approximate hover detection
        const centerX = width / 2;
        const centerY = height / 2;
        const relX = p.mouseX - centerX;
        const relY = p.mouseY - centerY;

        // Reverse isometric projection (approximate)
        const isoScale = cubeSize * COS_ISO;
        const col = Math.round((relX / isoScale + relY / (cubeSize * SIN_ISO)) / 2);
        const row = Math.round((relY / (cubeSize * SIN_ISO) - relX / isoScale) / 2);

        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
          setHoverTile({ row, col });
        } else {
          setHoverTile(null);
        }
      };

      const handleTileClick = (mouseX: number, mouseY: number) => {
        if (!onTileClick || foldProgress > 0.5) return;

        const centerX = width / 2;
        const centerY = height / 2;
        const relX = mouseX - centerX;
        const relY = mouseY - centerY;

        // Reverse isometric projection
        const isoScale = cubeSize * COS_ISO;
        const col = Math.round((relX / isoScale + relY / (cubeSize * SIN_ISO)) / 2);
        const row = Math.round((relY / (cubeSize * SIN_ISO) - relX / isoScale) / 2);

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
