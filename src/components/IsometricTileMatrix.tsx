import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import p5 from 'p5';
import { CycleNumber } from '@/types/journal-expansion';
import { DetectedPattern, getPatternColor } from '@/utils/patternDetection';
import { 
  getTileRing, 
  canAccessTile, 
  RingLevel 
} from '@/utils/ringToleranceSystem';
import { interpolateIsometricToTorus, ManifoldSeason } from '@/utils/torusManifoldMath';

type BoardType = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
type MatrixViewMode = 'isometric' | 'torus';

interface IsometricTileMatrixProps {
  board?: BoardType;
  selectedTile?: { row: number; col: number } | null;
  visitedTiles?: Set<string>;
  journeyPath?: Array<{ row: number; col: number }>;
  onTileClick?: (row: number, col: number) => void;
  cycleNumber?: CycleNumber;
  completedSeasons?: string[];
  highlightedPattern?: DetectedPattern | null;
  showPatternOverlay?: boolean;
  unlockedRing?: RingLevel;
  viewMode?: MatrixViewMode;
  onViewModeChange?: (mode: MatrixViewMode) => void;
  showHorizonGrid?: boolean;
  showDepthFog?: boolean;
  cubeSize?: number;
  densityMap?: Map<string, number>;
}

interface CubeState {
  row: number;
  col: number;
  isVisited: boolean;
  isSelected: boolean;
  isAccessible: boolean;
  ringLevel: RingLevel;
  density: number;
  stepNumber: number | null;
  isPatternTile: boolean;
}

const GRID_SIZE = 8;

const getBoardHSL = (board: BoardType): { h: number; s: number; l: number } => {
  switch (board) {
    case 'LOVE': return { h: 347, s: 77, l: 50 };
    case 'MAGIC': return { h: 258, s: 90, l: 66 };
    case 'CALM': return { h: 217, s: 91, l: 60 };
    case 'OPEN': return { h: 142, s: 71, l: 45 };
    case 'FREE': return { h: 38, s: 92, l: 50 };
    default: return { h: 215, s: 16, l: 47 };
  }
};

const COL_LABELS = ['C', 'H', 'O', 'R', 'D', 'S', 'M', 'S'];
const ROW_LABELS = ['M', 'A', 'G', 'I', 'C', 'N', 'S', 'P'];

const IsometricTileMatrix: React.FC<IsometricTileMatrixProps> = ({
  board = 'LOVE',
  selectedTile,
  visitedTiles = new Set(),
  journeyPath = [],
  onTileClick,
  cycleNumber = 1,
  completedSeasons = [],
  highlightedPattern = null,
  showPatternOverlay = true,
  unlockedRing = 1,
  viewMode = 'isometric',
  onViewModeChange,
  showHorizonGrid = true,
  showDepthFog = true,
  cubeSize: propCubeSize = 40,
  densityMap = new Map(),
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [foldProgress, setFoldProgress] = useState(0);
  const [hoverTile, setHoverTile] = useState<{ row: number; col: number } | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const patternTiles = useMemo(() => {
    if (!highlightedPattern || !showPatternOverlay) return new Set<string>();
    return new Set(highlightedPattern.tiles);
  }, [highlightedPattern, showPatternOverlay]);

  const getCubeState = useCallback((row: number, col: number): CubeState => {
    const tileKey = `${row}-${col}`;
    const isVisited = visitedTiles.has(tileKey);
    const isSelected = selectedTile?.row === row && selectedTile?.col === col;
    const isAccessible = canAccessTile(row, col, unlockedRing);
    const ringLevel = getTileRing(row, col);
    const density = densityMap.get(tileKey) || 0;
    const stepIndex = journeyPath.findIndex(t => t.row === row && t.col === col);
    const stepNumber = stepIndex >= 0 ? stepIndex + 1 : null;
    const isPatternTile = patternTiles.has(tileKey);
    
    return { row, col, isVisited, isSelected, isAccessible, ringLevel, density, stepNumber, isPatternTile };
  }, [visitedTiles, selectedTile, unlockedRing, densityMap, journeyPath, patternTiles]);

  const gridToIsometric = useCallback((row: number, col: number, cubeSize: number): [number, number, number] => {
    const x = (col - row) * cubeSize * 0.866;
    const y = (col + row) * cubeSize * 0.5;
    const z = 0;
    return [x, y, z];
  }, []);

  const getSeasonColor = useCallback((p: p5, ringLevel: RingLevel): [number, number, number] => {
    const baseHSL = getBoardHSL(board);
    const darkenFactor = 1 - (ringLevel - 1) * 0.15;
    return [baseHSL.h, baseHSL.s, baseHSL.l * darkenFactor];
  }, [board]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let cubeSize = propCubeSize;
      const particles: Array<{
        segment: number;
        progress: number;
        speed: number;
        size: number;
        life: number;
        maxLife: number;
        trail: Array<{ x: number; y: number; z: number }>;
      }> = [];
      
      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current?.clientWidth || 800,
          containerRef.current?.clientHeight || 600,
          p.WEBGL
        );
        canvas.parent(containerRef.current!);
        p.colorMode(p.HSL, 360, 100, 100, 1);
        p.textFont('Arial');
        p.textAlign(p.CENTER, p.CENTER);
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.clientWidth, containerRef.current.clientHeight);
        }
      };

      const drawCube = (
        x: number, y: number, z: number, 
        size: number, 
        state: CubeState,
        progress: number
      ) => {
        p.push();
        
        // Interpolate position for torus fold
        const season: ManifoldSeason = board.toLowerCase() as ManifoldSeason;
        const torusPos = interpolateIsometricToTorus(state.row, state.col, season, progress, size, state.density);
        p.translate(torusPos[0], torusPos[1], torusPos[2]);
        
        // Calculate elevation based on density and state
        let elevation = 0;
        if (state.isSelected) elevation += size * 0.5;
        if (state.isVisited) {
          elevation += size * 0.2;
          elevation += state.density * size * 0.15;
        }
        p.translate(0, -elevation, 0);
        
        const [h, s, l] = getSeasonColor(p, state.ringLevel);
        
        // Cube styling based on state
        if (state.isSelected) {
          // Selected: bright glow
          p.fill(h, s, l + 20, 1);
          p.stroke(h, s, 90, 1);
          p.strokeWeight(3);
        } else if (state.isPatternTile) {
          // Pattern tile: special highlight
          const patternHue = highlightedPattern ? 280 : h;
          p.fill(patternHue, 80, 60, 0.9);
          p.stroke(patternHue, 90, 80, 1);
          p.strokeWeight(2);
        } else if (state.isVisited) {
          // Visited: solid fill
          p.fill(h, s, l, 0.9);
          p.stroke(h, s, l + 20, 0.8);
          p.strokeWeight(1.5);
        } else if (state.isAccessible) {
          // Accessible: semi-transparent
          p.fill(h, s * 0.5, l, 0.4);
          p.stroke(h, s * 0.3, l, 0.5);
          p.strokeWeight(1);
        } else {
          // Locked: wireframe only
          p.noFill();
          p.stroke(0, 0, 40, 0.3);
          p.strokeWeight(0.5);
        }
        
        // Apply depth fog
        if (showDepthFog && progress < 0.5) {
          const distFromCenter = Math.sqrt(
            Math.pow(state.row - 3.5, 2) + Math.pow(state.col - 3.5, 2)
          );
          const fogFactor = Math.min(distFromCenter / 6, 0.5);
          p.fill(h, s * (1 - fogFactor), l * (1 - fogFactor * 0.3), p.alpha(p.fill as any) * (1 - fogFactor * 0.3));
        }
        
        p.box(size * 0.9);
        
        // Draw step number on visited tiles
        if (state.stepNumber !== null && state.isVisited) {
          p.push();
          p.translate(0, -size * 0.5, 0);
          p.rotateX(-Math.PI / 4);
          p.fill(0, 0, 100);
          p.noStroke();
          p.textSize(size * 0.3);
          p.text(state.stepNumber.toString(), 0, 0);
          p.pop();
        }
        
        // Draw tile acronym on top face
        p.push();
        p.translate(0, -size * 0.45, 0);
        p.rotateX(-Math.PI / 2);
        p.fill(0, 0, state.isVisited ? 100 : 60);
        p.noStroke();
        p.textSize(size * 0.25);
        const acronym = `${ROW_LABELS[state.row]}${COL_LABELS[state.col]}`;
        p.text(acronym, 0, 0);
        p.pop();
        
        // Draw elevation pillar for elevated cubes
        if (elevation > 5) {
          p.push();
          p.stroke(h, s * 0.5, l * 0.7, 0.4);
          p.strokeWeight(1);
          for (let i = 0; i < elevation; i += size * 0.2) {
            const lineY = -elevation + i;
            p.line(0, lineY, 0, 0, lineY + size * 0.1, 0);
          }
          p.pop();
        }
        
        p.pop();
      };

      const drawHorizonGrid = (cubeSize: number, progress: number) => {
        if (!showHorizonGrid || progress > 0.5) return;
        
        p.push();
        const gridExtent = cubeSize * GRID_SIZE * 1.5;
        p.stroke(0, 0, 40, 0.2);
        p.strokeWeight(0.5);
        
        // Draw grid lines
        for (let i = -10; i <= 10; i++) {
          const lineOffset = i * cubeSize;
          // X-direction lines
          p.line(-gridExtent, cubeSize * GRID_SIZE * 0.5, lineOffset, gridExtent, cubeSize * GRID_SIZE * 0.5, lineOffset);
          // Z-direction lines
          p.line(lineOffset, cubeSize * GRID_SIZE * 0.5, -gridExtent, lineOffset, cubeSize * GRID_SIZE * 0.5, gridExtent);
        }
        p.pop();
      };

      const drawJourneyPath = (cubeSize: number, progress: number) => {
        if (journeyPath.length < 2) return;
        
        p.push();
        const baseHSL = getBoardHSL(board);
        p.stroke(baseHSL.h, baseHSL.s, baseHSL.l + 10, 0.8);
        p.strokeWeight(3);
        p.noFill();
        
        p.beginShape();
        journeyPath.forEach((tile) => {
          const state = getCubeState(tile.row, tile.col);
          const season: ManifoldSeason = board.toLowerCase() as ManifoldSeason;
          const pos = interpolateIsometricToTorus(tile.row, tile.col, season, progress, cubeSize, state.density);
          
          // Elevation based on state
          let elevation = cubeSize * 0.2;
          if (state.density > 0) elevation += state.density * cubeSize * 0.15;
          
          p.vertex(pos[0], pos[1] - elevation, pos[2]);
        });
        p.endShape();
        p.pop();
      };

      const spawnParticle = () => {
        if (journeyPath.length < 2 || particles.length >= 50) return;
        
        particles.push({
          segment: 0,
          progress: 0,
          speed: 0.015 + Math.random() * 0.015,
          size: 4 + Math.random() * 4,
          life: 1,
          maxLife: 1,
          trail: []
        });
      };

      const updateAndDrawParticles = (cubeSize: number, progress: number) => {
        if (journeyPath.length < 2) return;
        
        // Spawn new particles periodically
        if (p.frameCount % 8 === 0) spawnParticle();
        
        const baseHSL = getBoardHSL(board);
        
        for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i];
          
          // Update particle position
          particle.progress += particle.speed;
          
          // Move to next segment if needed
          if (particle.progress >= 1) {
            particle.segment++;
            particle.progress = 0;
            
            if (particle.segment >= journeyPath.length - 1) {
              particles.splice(i, 1);
              continue;
            }
          }
          
          // Calculate current position along path
          const fromTile = journeyPath[particle.segment];
          const toTile = journeyPath[particle.segment + 1];
          
          const fromState = getCubeState(fromTile.row, fromTile.col);
          const toState = getCubeState(toTile.row, toTile.col);
          const season: ManifoldSeason = board.toLowerCase() as ManifoldSeason;
          
          const fromPos = interpolateIsometricToTorus(fromTile.row, fromTile.col, season, progress, cubeSize, fromState.density);
          const toPos = interpolateIsometricToTorus(toTile.row, toTile.col, season, progress, cubeSize, toState.density);
          
          // Interpolate position with easing
          const t = particle.progress;
          const easeT = t * t * (3 - 2 * t); // Smoothstep
          
          const currentPos = {
            x: fromPos[0] + (toPos[0] - fromPos[0]) * easeT,
            y: fromPos[1] + (toPos[1] - fromPos[1]) * easeT - cubeSize * 0.3,
            z: fromPos[2] + (toPos[2] - fromPos[2]) * easeT
          };
          
          // Add to trail
          particle.trail.push({ ...currentPos });
          if (particle.trail.length > 8) particle.trail.shift();
          
          // Draw trail
          p.push();
          p.noFill();
          particle.trail.forEach((pos, idx) => {
            const alpha = (idx / particle.trail.length) * 0.5;
            p.stroke(baseHSL.h, baseHSL.s, 70, alpha);
            p.strokeWeight(particle.size * (idx / particle.trail.length));
            if (idx > 0) {
              const prev = particle.trail[idx - 1];
              p.line(prev.x, prev.y, prev.z, pos.x, pos.y, pos.z);
            }
          });
          p.pop();
          
          // Draw particle core
          p.push();
          p.translate(currentPos.x, currentPos.y, currentPos.z);
          p.noStroke();
          p.fill(baseHSL.h, baseHSL.s, 80, 0.9);
          p.sphere(particle.size * 0.5);
          
          // Glow effect
          p.fill(baseHSL.h, baseHSL.s, 90, 0.3);
          p.sphere(particle.size);
          p.pop();
        }
      };

      const drawAxisLabels = (cubeSize: number, progress: number) => {
        if (progress > 0.3) return;
        
        p.push();
        
        // Longevity axis label (columns - horizontal)
        const longevityX = cubeSize * GRID_SIZE * 0.5;
        const longevityY = cubeSize * GRID_SIZE * 0.55 + cubeSize;
        p.push();
        p.translate(longevityX, longevityY, 0);
        p.rotateX(-Math.PI / 4);
        p.fill(0, 0, 70);
        p.noStroke();
        p.textSize(14);
        p.text('LONGEVITY →', 0, 0);
        p.pop();
        
        // Velocity axis label (rows - vertical)
        const velocityX = -cubeSize * 1.5;
        const velocityY = cubeSize * GRID_SIZE * 0.3;
        p.push();
        p.translate(velocityX, velocityY, 0);
        p.rotateX(-Math.PI / 4);
        p.rotateZ(-Math.PI / 2);
        p.fill(0, 0, 70);
        p.noStroke();
        p.textSize(14);
        p.text('↑ VELOCITY', 0, 0);
        p.pop();
        
        // Column labels at bottom
        for (let col = 0; col < GRID_SIZE; col++) {
          const [x, y] = gridToIsometric(GRID_SIZE, col, cubeSize);
          p.push();
          p.translate(x, y + cubeSize * 0.8, 0);
          p.rotateX(-Math.PI / 4);
          p.fill(0, 0, 60);
          p.noStroke();
          p.textSize(12);
          p.text(COL_LABELS[col], 0, 0);
          p.pop();
        }
        
        // Row labels on left
        for (let row = 0; row < GRID_SIZE; row++) {
          const [x, y] = gridToIsometric(row, -1, cubeSize);
          p.push();
          p.translate(x - cubeSize * 0.3, y, 0);
          p.rotateX(-Math.PI / 4);
          p.fill(0, 0, 60);
          p.noStroke();
          p.textSize(12);
          p.text(ROW_LABELS[row], 0, 0);
          p.pop();
        }
        
        p.pop();
      };

      p.draw = () => {
        p.background(0, 0, 10);
        
        // Update fold progress
        const targetProgress = viewMode === 'torus' ? 1 : 0;
        const currentProgress = foldProgress;
        const newProgress = p.lerp(currentProgress, targetProgress, 0.05);
        if (Math.abs(newProgress - currentProgress) > 0.001) {
          setFoldProgress(newProgress);
        }
        
        // Camera setup
        p.rotateX(Math.PI / 6 + rotationRef.current.y * 0.01);
        p.rotateY(rotationRef.current.x * 0.01);
        
        // Center the grid
        const gridOffset = cubeSize * GRID_SIZE * 0.5;
        p.translate(-gridOffset * 0.5, -gridOffset * 0.3, 0);
        
        // Ambient lighting
        p.ambientLight(60);
        p.directionalLight(255, 255, 255, 0.5, 1, -0.5);
        p.pointLight(255, 255, 255, 0, -200, 200);
        
        // Draw horizon grid
        drawHorizonGrid(cubeSize, currentProgress);
        
        // Draw all cubes
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const state = getCubeState(row, col);
            const [x, y, z] = gridToIsometric(row, col, cubeSize);
            drawCube(x, y, z, cubeSize, state, currentProgress);
          }
        }
        
        // Draw journey path
        drawJourneyPath(cubeSize, currentProgress);
        
        // Draw energy particles
        updateAndDrawParticles(cubeSize, currentProgress);
        
        // Draw axis labels
        drawAxisLabels(cubeSize, currentProgress);
        
        // Draw 2D overlay
        p.push();
        p.resetMatrix();
        p.fill(0, 0, 80);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT, p.TOP);
        const modeText = currentProgress > 0.5 ? 'Torus Manifold' : 'Isometric 2.5D';
        p.text(modeText, -p.width / 2 + 20, -p.height / 2 + 20);
        p.text(`${board} Season`, -p.width / 2 + 20, -p.height / 2 + 40);
        p.text(`${visitedTiles.size}/64 tiles`, -p.width / 2 + 20, -p.height / 2 + 60);
        
        if (hoverTile) {
          const state = getCubeState(hoverTile.row, hoverTile.col);
          p.text(
            `${ROW_LABELS[hoverTile.row]}${COL_LABELS[hoverTile.col]} - Ring ${state.ringLevel}`,
            -p.width / 2 + 20, -p.height / 2 + 80
          );
        }
        p.pop();
      };

      // Mouse interaction
      p.mousePressed = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseReleased = () => {
        if (!isDraggingRef.current) {
          // Handle click - find clicked tile
          handleTileClick(p);
        }
        isDraggingRef.current = false;
      };

      p.mouseDragged = () => {
        if (isDraggingRef.current) {
          const dx = p.mouseX - lastMouseRef.current.x;
          const dy = p.mouseY - lastMouseRef.current.y;
          rotationRef.current.x += dx;
          rotationRef.current.y += dy;
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseMoved = () => {
        // Simple hover detection (approximate)
        const normalizedX = (p.mouseX - p.width / 2) / (cubeSize * 2);
        const normalizedY = (p.mouseY - p.height / 2) / (cubeSize * 2);
        
        const approxCol = Math.floor((normalizedX + normalizedY + GRID_SIZE) / 2);
        const approxRow = Math.floor((-normalizedX + normalizedY + GRID_SIZE) / 2);
        
        if (approxRow >= 0 && approxRow < GRID_SIZE && approxCol >= 0 && approxCol < GRID_SIZE) {
          setHoverTile({ row: approxRow, col: approxCol });
        } else {
          setHoverTile(null);
        }
      };

      const handleTileClick = (p: p5) => {
        if (!onTileClick) return;
        
        // Convert screen coordinates to grid (approximate)
        const normalizedX = (p.mouseX - p.width / 2) / (cubeSize * 2);
        const normalizedY = (p.mouseY - p.height / 2) / (cubeSize * 2);
        
        const approxCol = Math.floor((normalizedX + normalizedY + GRID_SIZE) / 2);
        const approxRow = Math.floor((-normalizedX + normalizedY + GRID_SIZE) / 2);
        
        if (approxRow >= 0 && approxRow < GRID_SIZE && approxCol >= 0 && approxCol < GRID_SIZE) {
          const state = getCubeState(approxRow, approxCol);
          if (state.isAccessible) {
            onTileClick(approxRow, approxCol);
          }
        }
      };

      p.mouseWheel = (event: any) => {
        cubeSize = Math.max(20, Math.min(60, cubeSize - event.delta * 0.05));
        return false;
      };
    };

    p5Ref.current = new p5(sketch);

    return () => {
      p5Ref.current?.remove();
    };
  }, [
    board, selectedTile, visitedTiles, journeyPath, onTileClick, unlockedRing,
    viewMode, showHorizonGrid, showDepthFog, propCubeSize, densityMap,
    getCubeState, gridToIsometric, getSeasonColor, highlightedPattern, foldProgress
  ]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[500px] bg-background rounded-lg overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};

export default IsometricTileMatrix;
