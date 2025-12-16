import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import p5 from 'p5';
import { CycleNumber } from '@/types/journal-expansion';
import { DetectedPattern } from '@/utils/patternDetection';
import { 
  getTileRing, 
  canAccessTile, 
  RingLevel 
} from '@/utils/ringToleranceSystem';

type BoardType = 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';

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
  showHorizonGrid = true,
  showDepthFog = true,
  cubeSize: propCubeSize = 40,
  densityMap = new Map(),
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [hoverTile, setHoverTile] = useState<{ row: number; col: number } | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const cubeSizeRef = useRef(propCubeSize);

  // Update ref when prop changes
  useEffect(() => {
    cubeSizeRef.current = propCubeSize;
  }, [propCubeSize]);

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

  const getSeasonColor = useCallback((ringLevel: RingLevel): { h: number; s: number; l: number } => {
    const baseHSL = getBoardHSL(board);
    const darkenFactor = 1 - (ringLevel - 1) * 0.15;
    return { h: baseHSL.h, s: baseHSL.s, l: baseHSL.l * darkenFactor };
  }, [board]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const particles: Array<{
        segment: number;
        progress: number;
        speed: number;
        size: number;
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
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.clientWidth, containerRef.current.clientHeight);
        }
      };

      const drawCube = (
        x: number, y: number, z: number, 
        size: number, 
        state: CubeState
      ) => {
        p.push();
        p.translate(x, y, z);
        
        // Calculate elevation based on density and state
        let elevation = 0;
        if (state.isSelected) elevation += size * 0.6;
        if (state.isVisited) {
          elevation += size * 0.15;
          // Density-based elevation (0-10 scale → additional height)
          elevation += state.density * size * 0.2;
        }
        p.translate(0, -elevation, 0);
        
        const color = getSeasonColor(state.ringLevel);
        
        // Apply depth fog factor
        let fogAlpha = 1;
        if (showDepthFog) {
          const distFromCenter = Math.sqrt(
            Math.pow(state.row - 3.5, 2) + Math.pow(state.col - 3.5, 2)
          );
          fogAlpha = Math.max(0.4, 1 - distFromCenter * 0.08);
        }
        
        // Cube styling based on state
        if (state.isSelected) {
          p.fill(color.h, color.s, Math.min(color.l + 25, 85), fogAlpha);
          p.stroke(color.h, color.s, 90, 1);
          p.strokeWeight(3);
        } else if (state.isPatternTile) {
          p.fill(280, 80, 60, fogAlpha * 0.9);
          p.stroke(280, 90, 80, 1);
          p.strokeWeight(2);
        } else if (state.isVisited) {
          // Denser tiles are more saturated and brighter
          const densityBoost = Math.min(state.density * 3, 20);
          p.fill(color.h, Math.min(color.s + densityBoost, 100), Math.min(color.l + densityBoost * 0.5, 75), fogAlpha * 0.95);
          p.stroke(color.h, color.s, color.l + 20, fogAlpha * 0.8);
          p.strokeWeight(1.5);
        } else if (state.isAccessible) {
          p.fill(color.h, color.s * 0.4, color.l * 0.8, fogAlpha * 0.35);
          p.stroke(color.h, color.s * 0.3, color.l, fogAlpha * 0.4);
          p.strokeWeight(1);
        } else {
          p.noFill();
          p.stroke(0, 0, 35, fogAlpha * 0.25);
          p.strokeWeight(0.5);
        }
        
        p.box(size * 0.88);
        
        // Draw density indicator ring on top of dense tiles
        if (state.isVisited && state.density > 0) {
          p.push();
          p.translate(0, -size * 0.45, 0);
          p.rotateX(p.HALF_PI);
          p.noFill();
          const ringIntensity = Math.min(state.density / 5, 1);
          p.stroke(color.h, 90, 70, ringIntensity * 0.9);
          p.strokeWeight(2 + state.density * 0.5);
          p.ellipse(0, 0, size * 0.6 * (0.5 + ringIntensity * 0.5), size * 0.6 * (0.5 + ringIntensity * 0.5));
          
          // Inner glow for high density
          if (state.density >= 3) {
            p.stroke(color.h, 100, 80, ringIntensity * 0.5);
            p.strokeWeight(1);
            p.ellipse(0, 0, size * 0.4, size * 0.4);
          }
          p.pop();
        }
        
        // Draw step number on visited tiles
        if (state.stepNumber !== null && state.isVisited) {
          p.push();
          p.translate(0, -size * 0.5, size * 0.3);
          p.fill(0, 0, 100);
          p.noStroke();
          p.textSize(size * 0.28);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(state.stepNumber.toString(), 0, 0);
          p.pop();
        }
        
        // Draw tile acronym on top face
        p.push();
        p.translate(0, -size * 0.46, 0);
        p.rotateX(-p.HALF_PI);
        p.fill(0, 0, state.isVisited ? 100 : 55);
        p.noStroke();
        p.textSize(size * 0.22);
        p.textAlign(p.CENTER, p.CENTER);
        const acronym = `${ROW_LABELS[state.row]}${COL_LABELS[state.col]}`;
        p.text(acronym, 0, 0);
        p.pop();
        
        // Draw density bar/pillar for elevated cubes
        if (elevation > size * 0.2) {
          p.push();
          p.stroke(color.h, color.s * 0.6, color.l * 0.6, 0.5);
          p.strokeWeight(2);
          p.line(0, 0, 0, 0, elevation, 0);
          
          // Ground shadow ring
          p.translate(0, elevation + 1, 0);
          p.rotateX(p.HALF_PI);
          p.noStroke();
          p.fill(0, 0, 0, 0.15);
          p.ellipse(0, 0, size * 0.7, size * 0.4);
          p.pop();
        }
        
        p.pop();
      };

      const drawHorizonGrid = (cubeSize: number) => {
        if (!showHorizonGrid) return;
        
        p.push();
        const gridExtent = cubeSize * GRID_SIZE * 1.2;
        const gridY = cubeSize * GRID_SIZE * 0.52;
        
        p.stroke(0, 0, 30, 0.15);
        p.strokeWeight(0.5);
        
        for (let i = -8; i <= 8; i++) {
          const lineOffset = i * cubeSize * 0.866;
          p.line(-gridExtent, gridY, lineOffset, gridExtent, gridY, lineOffset);
          p.line(lineOffset, gridY, -gridExtent, lineOffset, gridY, gridExtent);
        }
        p.pop();
      };

      const drawJourneyPath = (cubeSize: number) => {
        if (journeyPath.length < 2) return;
        
        p.push();
        const baseHSL = getBoardHSL(board);
        p.stroke(baseHSL.h, baseHSL.s, baseHSL.l + 15, 0.85);
        p.strokeWeight(3);
        p.noFill();
        
        p.beginShape();
        journeyPath.forEach((tile) => {
          const state = getCubeState(tile.row, tile.col);
          const [px, py, pz] = gridToIsometric(tile.row, tile.col, cubeSize);
          
          let elevation = cubeSize * 0.15;
          if (state.density > 0) elevation += state.density * cubeSize * 0.2;
          
          p.vertex(px, py - elevation - cubeSize * 0.5, pz);
        });
        p.endShape();
        p.pop();
      };

      const spawnParticle = () => {
        if (journeyPath.length < 2 || particles.length >= 40) return;
        
        particles.push({
          segment: 0,
          progress: 0,
          speed: 0.012 + Math.random() * 0.012,
          size: 3 + Math.random() * 3,
          trail: []
        });
      };

      const updateAndDrawParticles = (cubeSize: number) => {
        if (journeyPath.length < 2) return;
        
        if (p.frameCount % 10 === 0) spawnParticle();
        
        const baseHSL = getBoardHSL(board);
        
        for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i];
          
          particle.progress += particle.speed;
          
          if (particle.progress >= 1) {
            particle.segment++;
            particle.progress = 0;
            
            if (particle.segment >= journeyPath.length - 1) {
              particles.splice(i, 1);
              continue;
            }
          }
          
          const fromTile = journeyPath[particle.segment];
          const toTile = journeyPath[particle.segment + 1];
          
          const fromState = getCubeState(fromTile.row, fromTile.col);
          const toState = getCubeState(toTile.row, toTile.col);
          
          const [fx, fy] = gridToIsometric(fromTile.row, fromTile.col, cubeSize);
          const [tx, ty] = gridToIsometric(toTile.row, toTile.col, cubeSize);
          
          const fromElev = cubeSize * 0.15 + fromState.density * cubeSize * 0.2 + cubeSize * 0.5;
          const toElev = cubeSize * 0.15 + toState.density * cubeSize * 0.2 + cubeSize * 0.5;
          
          const t = particle.progress;
          const easeT = t * t * (3 - 2 * t);
          
          const currentPos = {
            x: fx + (tx - fx) * easeT,
            y: fy - fromElev + ((ty - toElev) - (fy - fromElev)) * easeT,
            z: 0
          };
          
          particle.trail.push({ ...currentPos });
          if (particle.trail.length > 6) particle.trail.shift();
          
          // Draw trail
          p.push();
          p.noFill();
          for (let j = 1; j < particle.trail.length; j++) {
            const alpha = (j / particle.trail.length) * 0.6;
            p.stroke(baseHSL.h, baseHSL.s, 75, alpha);
            p.strokeWeight(particle.size * (j / particle.trail.length));
            const prev = particle.trail[j - 1];
            const curr = particle.trail[j];
            p.line(prev.x, prev.y, prev.z, curr.x, curr.y, curr.z);
          }
          p.pop();
          
          // Draw particle
          p.push();
          p.translate(currentPos.x, currentPos.y, currentPos.z);
          p.noStroke();
          p.fill(baseHSL.h, baseHSL.s, 85, 0.95);
          p.sphere(particle.size * 0.4);
          p.fill(baseHSL.h, baseHSL.s, 95, 0.35);
          p.sphere(particle.size * 0.8);
          p.pop();
        }
      };

      const drawAxisLabels = (cubeSize: number) => {
        p.push();
        
        // Longevity label
        p.push();
        p.translate(cubeSize * GRID_SIZE * 0.4, cubeSize * GRID_SIZE * 0.6, 0);
        p.fill(0, 0, 65);
        p.noStroke();
        p.textSize(13);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('LONGEVITY →', 0, 0);
        p.pop();
        
        // Velocity label
        p.push();
        p.translate(-cubeSize * 1.8, cubeSize * GRID_SIZE * 0.25, 0);
        p.fill(0, 0, 65);
        p.noStroke();
        p.textSize(13);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('↑ VELOCITY', 0, 0);
        p.pop();
        
        // Column labels
        for (let col = 0; col < GRID_SIZE; col++) {
          const [x, y] = gridToIsometric(GRID_SIZE, col, cubeSize);
          p.push();
          p.translate(x, y + cubeSize * 0.7, 0);
          p.fill(0, 0, 55);
          p.noStroke();
          p.textSize(11);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(COL_LABELS[col], 0, 0);
          p.pop();
        }
        
        // Row labels
        for (let row = 0; row < GRID_SIZE; row++) {
          const [x, y] = gridToIsometric(row, -1, cubeSize);
          p.push();
          p.translate(x - cubeSize * 0.4, y, 0);
          p.fill(0, 0, 55);
          p.noStroke();
          p.textSize(11);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(ROW_LABELS[row], 0, 0);
          p.pop();
        }
        
        p.pop();
      };

      const drawDensityLegend = (cubeSize: number) => {
        p.push();
        p.resetMatrix();
        
        // Legend background
        p.fill(0, 0, 15, 0.85);
        p.noStroke();
        p.rect(p.width / 2 - 110, -p.height / 2 + 10, 100, 70, 6);
        
        p.fill(0, 0, 75);
        p.textSize(10);
        p.textAlign(p.LEFT, p.TOP);
        p.text('Density Legend', -p.width / 2 + 20, -p.height / 2 + 18);
        
        const baseHSL = getBoardHSL(board);
        
        // Low density
        p.fill(baseHSL.h, baseHSL.s * 0.6, baseHSL.l * 0.8);
        p.rect(-p.width / 2 + 20, -p.height / 2 + 35, 12, 12, 2);
        p.fill(0, 0, 65);
        p.text('Low', -p.width / 2 + 38, -p.height / 2 + 36);
        
        // High density
        p.fill(baseHSL.h, Math.min(baseHSL.s + 15, 100), Math.min(baseHSL.l + 15, 75));
        p.rect(-p.width / 2 + 20, -p.height / 2 + 52, 12, 12, 2);
        p.fill(0, 0, 65);
        p.text('High (elevated)', -p.width / 2 + 38, -p.height / 2 + 53);
        
        p.pop();
      };

      p.draw = () => {
        p.background(0, 0, 8);
        
        const cubeSize = cubeSizeRef.current;
        
        // Camera
        p.rotateX(p.PI / 6 + rotationRef.current.y * 0.008);
        p.rotateY(rotationRef.current.x * 0.008);
        
        // Center
        const gridOffset = cubeSize * GRID_SIZE * 0.5;
        p.translate(-gridOffset * 0.4, -gridOffset * 0.2, 0);
        
        // Lighting
        p.ambientLight(55);
        p.directionalLight(255, 255, 255, 0.4, 0.8, -0.5);
        p.pointLight(255, 255, 255, 0, -250, 250);
        
        drawHorizonGrid(cubeSize);
        
        // Draw cubes back-to-front for proper depth
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const state = getCubeState(row, col);
            const [x, y, z] = gridToIsometric(row, col, cubeSize);
            drawCube(x, y, z, cubeSize, state);
          }
        }
        
        drawJourneyPath(cubeSize);
        updateAndDrawParticles(cubeSize);
        drawAxisLabels(cubeSize);
        
        // 2D overlay info
        p.push();
        p.resetMatrix();
        p.fill(0, 0, 75);
        p.noStroke();
        p.textSize(11);
        p.textAlign(p.LEFT, p.TOP);
        p.text('Isometric 2.5D', -p.width / 2 + 16, -p.height / 2 + 16);
        p.text(`${board} Season`, -p.width / 2 + 16, -p.height / 2 + 32);
        p.text(`${visitedTiles.size}/64 tiles`, -p.width / 2 + 16, -p.height / 2 + 48);
        
        if (hoverTile) {
          const state = getCubeState(hoverTile.row, hoverTile.col);
          p.text(
            `${ROW_LABELS[hoverTile.row]}${COL_LABELS[hoverTile.col]} - Ring ${state.ringLevel}${state.density > 0 ? ` - Density: ${state.density}` : ''}`,
            -p.width / 2 + 16, -p.height / 2 + 64
          );
        }
        p.pop();
        
        drawDensityLegend(cubeSize);
      };

      p.mousePressed = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseReleased = () => {
        if (!isDraggingRef.current) {
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
        const cubeSize = cubeSizeRef.current;
        const normalizedX = (p.mouseX - p.width / 2) / (cubeSize * 1.8);
        const normalizedY = (p.mouseY - p.height / 2) / (cubeSize * 1.8);
        
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
        
        const cubeSize = cubeSizeRef.current;
        const normalizedX = (p.mouseX - p.width / 2) / (cubeSize * 1.8);
        const normalizedY = (p.mouseY - p.height / 2) / (cubeSize * 1.8);
        
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
        cubeSizeRef.current = Math.max(25, Math.min(55, cubeSizeRef.current - event.delta * 0.04));
        return false;
      };
    };

    p5Ref.current = new p5(sketch);

    return () => {
      p5Ref.current?.remove();
    };
  }, [
    board, selectedTile, visitedTiles, journeyPath, onTileClick, unlockedRing,
    showHorizonGrid, showDepthFog, densityMap,
    getCubeState, gridToIsometric, getSeasonColor, highlightedPattern
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
