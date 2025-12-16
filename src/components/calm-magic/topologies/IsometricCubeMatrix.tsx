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
  const rotationRef = useRef({ x: -0.5, y: 0.3 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let width = containerRef.current?.clientWidth || 800;
      let height = containerRef.current?.clientHeight || 600;

      p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        p.textFont('monospace');
      };

      p.windowResized = () => {
        width = containerRef.current?.clientWidth || 800;
        height = containerRef.current?.clientHeight || 600;
        p.resizeCanvas(width, height);
      };

      p.draw = () => {
        // Background with subtle gradient
        p.background(15, 18, 25);

        // Camera/view rotation
        if (isAnimating && viewMode === 'torus') {
          rotationRef.current.y += 0.003;
        }

        p.push();
        
        // Apply rotation for 3D view
        p.rotateX(rotationRef.current.x);
        p.rotateY(rotationRef.current.y);

        // Calculate fold progress for animation
        const targetFold = viewMode === 'torus' ? 1 : viewMode === 'isometric' ? 0 : foldProgress;
        const currentFold = foldProgress + (targetFold - foldProgress) * 0.05;
        setFoldProgress(currentFold);

        // Draw horizon grid
        if (showHorizonGrid && currentFold < 0.5) {
          drawHorizonGrid(p, currentFold);
        }

        // Draw all 64 cubes
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const state = getCubeState(row, col);
            drawCube(p, state, currentFold);
          }
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
        draw2DOverlay(p);
      };

      const drawHorizonGrid = (p: p5, fold: number) => {
        const opacity = 255 * (1 - fold * 2);
        if (opacity <= 0) return;

        p.push();
        p.stroke(40, 50, 60, opacity);
        p.strokeWeight(0.5);
        p.noFill();

        // Ground plane grid
        const gridSize = cubeSize * 12;
        const gridStep = cubeSize;

        for (let i = -gridSize; i <= gridSize; i += gridStep) {
          // Lines along longevity (X) axis
          p.line(i, gridSize * 0.7, 0, i, -gridSize * 0.3, 0);
          // Lines along velocity (Y) axis
          p.line(-gridSize * 0.5, i * 0.5, 0, gridSize * 0.5, i * 0.5, 0);
        }

        // Horizon fade effect
        if (showDepthFog) {
          p.noStroke();
          for (let i = 0; i < 5; i++) {
            const fogOpacity = 20 * (1 - fold) * (5 - i) / 5;
            p.fill(15, 18, 25, fogOpacity);
            const y = -gridSize * 0.3 - i * 30;
            p.rect(-gridSize, y, gridSize * 2, 30);
          }
        }

        p.pop();
      };

      const drawCube = (p: p5, state: CubeState, fold: number) => {
        const { row, col, isVisited, isSelected, isAccessible, ring, density, stepNumber } = state;
        const pos = getInterpolatedPosition(row, col, fold, density);
        
        // Elevation for selected/visited cubes
        let elevation = 0;
        if (isSelected) elevation = cubeSize * 0.4;
        else if (isVisited) elevation = cubeSize * 0.1 + density * cubeSize * 0.05;

        const isHovered = hoverTile?.row === row && hoverTile?.col === col;
        if (isHovered && isAccessible) elevation += cubeSize * 0.1;

        p.push();
        p.translate(pos.x, pos.y - elevation, pos.z);

        // Scale based on fold progress for torus view
        const scale = 1 - fold * 0.3;
        p.scale(scale);

        const size = cubeSize * 0.85;
        const halfSize = size / 2;

        // Determine colors based on state
        let topColor: p5.Color;
        let frontColor: p5.Color;
        let sideColor: p5.Color;
        let strokeColor: p5.Color;

        if (!isAccessible) {
          // Locked - very faint
          topColor = p.color(30, 35, 45, 100);
          frontColor = p.color(25, 30, 40, 100);
          sideColor = p.color(20, 25, 35, 100);
          strokeColor = p.color(50, 55, 65, 80);
        } else if (isSelected) {
          // Selected - bright glow
          const baseColor = getSeasonColor(p, ring);
          topColor = p.lerpColor(baseColor, p.color(255), 0.3);
          frontColor = p.lerpColor(baseColor, p.color(200), 0.1);
          sideColor = baseColor;
          strokeColor = p.color(255, 255, 255, 200);
          
          // Pulsing glow effect
          const pulse = Math.sin(p.frameCount * 0.1) * 0.2 + 0.8;
          p.push();
          p.noFill();
          p.stroke(255, 255, 255, 100 * pulse);
          p.strokeWeight(3);
          p.box(size * 1.1);
          p.pop();
        } else if (isVisited) {
          // Visited - solid fill
          const baseColor = getSeasonColor(p, ring);
          topColor = p.lerpColor(baseColor, p.color(255), 0.2);
          frontColor = baseColor;
          sideColor = p.lerpColor(baseColor, p.color(0), 0.2);
          strokeColor = p.lerpColor(baseColor, p.color(255), 0.4);
        } else {
          // Accessible but not visited - wireframe
          topColor = p.color(40, 50, 60, 150);
          frontColor = p.color(35, 45, 55, 150);
          sideColor = p.color(30, 40, 50, 150);
          strokeColor = p.color(80, 100, 120, 150);
        }

        // Draw cube faces
        p.strokeWeight(isSelected ? 2 : 1);
        p.stroke(strokeColor);

        // Top face
        p.fill(topColor);
        p.beginShape();
        p.vertex(-halfSize, -halfSize, halfSize);
        p.vertex(halfSize, -halfSize, halfSize);
        p.vertex(halfSize, halfSize, halfSize);
        p.vertex(-halfSize, halfSize, halfSize);
        p.endShape(p.CLOSE);

        // Front face (visible in isometric)
        p.fill(frontColor);
        p.beginShape();
        p.vertex(-halfSize, halfSize, halfSize);
        p.vertex(halfSize, halfSize, halfSize);
        p.vertex(halfSize, halfSize, -halfSize);
        p.vertex(-halfSize, halfSize, -halfSize);
        p.endShape(p.CLOSE);

        // Right side face
        p.fill(sideColor);
        p.beginShape();
        p.vertex(halfSize, -halfSize, halfSize);
        p.vertex(halfSize, halfSize, halfSize);
        p.vertex(halfSize, halfSize, -halfSize);
        p.vertex(halfSize, -halfSize, -halfSize);
        p.endShape(p.CLOSE);

        // Draw tile acronym on top face
        if (isAccessible && fold < 0.7) {
          const acronym = getTileAcronym(row, col);
          const textOpacity = 255 * (1 - fold);
          p.push();
          p.translate(0, 0, halfSize + 1);
          p.rotateX(-Math.PI / 2);
          p.fill(255, 255, 255, textOpacity);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(size * 0.25);
          p.text(acronym, 0, 0);
          
          // Step number badge
          if (stepNumber !== undefined) {
            p.fill(255, 200, 50, textOpacity);
            p.textSize(size * 0.2);
            p.text(`#${stepNumber}`, 0, size * 0.25);
          }
          p.pop();
        }

        p.pop();
      };

      const drawJourneyPath = (p: p5, fold: number) => {
        if (journeyPath.length < 2) return;

        p.push();
        p.strokeWeight(2);
        p.noFill();

        // Draw connecting lines between visited tiles
        for (let i = 0; i < journeyPath.length - 1; i++) {
          const from = journeyPath[i];
          const to = journeyPath[i + 1];
          
          const fromPos = getInterpolatedPosition(from.row, from.col, fold);
          const toPos = getInterpolatedPosition(to.row, to.col, fold);

          // Gradient color along path
          const progress = i / (journeyPath.length - 1);
          const pathColor = p.lerpColor(
            p.color(100, 150, 255, 180),
            p.color(255, 200, 100, 180),
            progress
          );
          p.stroke(pathColor);

          // Animated dashed line
          const dashOffset = (p.frameCount * 0.05) % 1;
          const segments = 8;
          for (let j = 0; j < segments; j++) {
            const t1 = (j + dashOffset) / segments;
            const t2 = (j + 0.5 + dashOffset) / segments;
            if (t2 > 1) continue;

            const x1 = fromPos.x + (toPos.x - fromPos.x) * t1;
            const y1 = fromPos.y + (toPos.y - fromPos.y) * t1;
            const z1 = fromPos.z + (toPos.z - fromPos.z) * t1;
            const x2 = fromPos.x + (toPos.x - fromPos.x) * Math.min(t2, 1);
            const y2 = fromPos.y + (toPos.y - fromPos.y) * Math.min(t2, 1);
            const z2 = fromPos.z + (toPos.z - fromPos.z) * Math.min(t2, 1);

            p.line(x1, y1, z1, x2, y2, z2);
          }
        }

        p.pop();
      };

      const drawAxisLabels = (p: p5, fold: number) => {
        const opacity = 255 * (1 - fold * 2);
        if (opacity <= 0) return;

        p.push();
        
        // Column labels (LONGEVITY HORIZON)
        const colLabels = ['C', 'H', 'O', 'R', 'D', 'S', 'M', 'Σ'];
        p.fill(150, 180, 200, opacity);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);

        for (let col = 0; col < 8; col++) {
          const pos = gridToIsometric(-1.5, col);
          p.push();
          p.translate(pos.x, pos.y - cubeSize, 0);
          p.text(colLabels[col], 0, 0);
          p.pop();
        }

        // Row labels (VELOCITY)
        const rowLabels = ['M', 'A', 'G', 'I', 'C', 'N', 'S', 'P'];
        for (let row = 0; row < 8; row++) {
          const pos = gridToIsometric(row, -1.5);
          p.push();
          p.translate(pos.x - cubeSize, pos.y, 0);
          p.text(rowLabels[row], 0, 0);
          p.pop();
        }

        // Axis arrows
        p.stroke(100, 130, 160, opacity);
        p.strokeWeight(2);

        // Longevity arrow (horizontal)
        const longevityStart = gridToIsometric(-1, -1);
        const longevityEnd = gridToIsometric(-1, 9);
        p.line(longevityStart.x, longevityStart.y, 0, longevityEnd.x, longevityEnd.y, 0);
        p.push();
        p.translate(longevityEnd.x, longevityEnd.y, 0);
        p.fill(100, 130, 160, opacity);
        p.noStroke();
        p.triangle(0, 0, -10, -5, -10, 5);
        p.pop();

        // Velocity arrow (vertical)
        const velocityStart = gridToIsometric(-1, -1);
        const velocityEnd = gridToIsometric(9, -1);
        p.line(velocityStart.x, velocityStart.y, 0, velocityEnd.x, velocityEnd.y, 0);
        p.push();
        p.translate(velocityEnd.x, velocityEnd.y, 0);
        p.fill(100, 130, 160, opacity);
        p.noStroke();
        p.triangle(0, 0, -5, -10, 5, -10);
        p.pop();

        // Axis labels
        p.fill(120, 150, 180, opacity);
        p.textSize(10);
        p.push();
        p.translate(longevityEnd.x + 20, longevityEnd.y, 0);
        p.text('LONGEVITY →', 0, 0);
        p.pop();

        p.push();
        p.translate(velocityEnd.x, velocityEnd.y + 20, 0);
        p.text('↓ VELOCITY', 0, 0);
        p.pop();

        p.pop();
      };

      const draw2DOverlay = (p: p5) => {
        // Reset to 2D for overlay
        p.push();
        p.resetMatrix();
        p.camera();

        // View mode indicator
        p.fill(255, 255, 255, 180);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT, p.TOP);
        const modeText = viewMode === 'torus' ? 'TORUS VIEW' : 
                        viewMode === 'transitioning' ? 'TRANSITIONING...' : 
                        'ISOMETRIC VIEW';
        p.text(modeText, -width/2 + 15, -height/2 + 15);

        // Season indicator
        p.fill(SEASON_HEX_COLORS[season] >> 16 & 255, 
               SEASON_HEX_COLORS[season] >> 8 & 255, 
               SEASON_HEX_COLORS[season] & 255, 200);
        p.text(season, -width/2 + 15, -height/2 + 32);

        // Hover info
        if (hoverTile) {
          const state = getCubeState(hoverTile.row, hoverTile.col);
          const acronym = getTileAcronym(hoverTile.row, hoverTile.col);
          const statusText = state.isVisited ? '✓ Visited' : 
                            state.isAccessible ? 'Available' : 
                            '🔒 Locked';
          
          p.fill(255, 255, 255, 220);
          p.text(`${acronym} (R${hoverTile.row}, C${hoverTile.col}) - ${statusText}`, 
                 -width/2 + 15, height/2 - 30);
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
    gridToIsometric, getSeasonColor, foldProgress, hoverTile
  ]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-background rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ minHeight: '450px' }}
    />
  );
}
