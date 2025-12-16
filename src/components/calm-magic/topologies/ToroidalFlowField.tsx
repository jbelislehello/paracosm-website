import React, { useMemo, useRef, useEffect, useState } from 'react';
import { 
  ManifoldSeason,
  SEASON_COLORS,
  columnToTheta,
  rowSeasonToPhi,
  TORUS_MAJOR_RADIUS,
  TORUS_BASE_MINOR_RADIUS
} from '@/utils/torusManifoldMath';

interface FlowVector {
  x: number;
  y: number;
  dx: number;
  dy: number;
  magnitude: number;
  type: 'journey' | 'semantic' | 'density';
}

interface ToroidalFlowFieldProps {
  selectedTile?: { row: number; col: number };
  season: ManifoldSeason;
  journeyPath: Array<{ row: number; col: number }>;
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  onTileClick?: (row: number, col: number) => void;
}

export function ToroidalFlowField({
  selectedTile,
  season,
  journeyPath,
  visitedTiles,
  densityMap,
  onTileClick
}: ToroidalFlowFieldProps) {
  const [animationTime, setAnimationTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Convert tile coordinates to display coordinates
  const tileToDisplay = (row: number, col: number): { x: number; y: number } => {
    const R = 150; // Display major radius
    const r = 40;  // Display minor radius
    const theta = (col / 8) * 2 * Math.PI;
    const phi = (row / 8) * Math.PI; // Use half phi range for 2D projection
    
    const radius = R + r * Math.cos(phi);
    return {
      x: 200 + radius * Math.cos(theta),
      y: 200 + radius * Math.sin(theta)
    };
  };

  // Generate flow vectors based on journey path
  const flowVectors = useMemo(() => {
    const vectors: FlowVector[] = [];
    
    // Journey flow vectors (showing direction of movement)
    for (let i = 1; i < journeyPath.length; i++) {
      const prev = journeyPath[i - 1];
      const curr = journeyPath[i];
      const prevPos = tileToDisplay(prev.row, prev.col);
      const currPos = tileToDisplay(curr.row, curr.col);
      
      const dx = currPos.x - prevPos.x;
      const dy = currPos.y - prevPos.y;
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      
      if (magnitude > 0) {
        vectors.push({
          x: prevPos.x,
          y: prevPos.y,
          dx: dx / magnitude,
          dy: dy / magnitude,
          magnitude,
          type: 'journey'
        });
      }
    }
    
    // Density gradient vectors (pointing toward high-density regions)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const key = `${row}-${col}`;
        const density = densityMap.get(key) || 0;
        if (density === 0) continue;
        
        const pos = tileToDisplay(row, col);
        
        // Calculate gradient from neighbors
        let gradX = 0;
        let gradY = 0;
        
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = (row + dr + 8) % 8;
            const nc = (col + dc + 8) % 8;
            const nKey = `${nr}-${nc}`;
            const nDensity = densityMap.get(nKey) || 0;
            const nPos = tileToDisplay(nr, nc);
            
            const diff = density - nDensity;
            const dist = Math.sqrt((nPos.x - pos.x) ** 2 + (nPos.y - pos.y) ** 2);
            if (dist > 0) {
              gradX += (nPos.x - pos.x) / dist * diff;
              gradY += (nPos.y - pos.y) / dist * diff;
            }
          }
        }
        
        const gradMag = Math.sqrt(gradX * gradX + gradY * gradY);
        if (gradMag > 0.1) {
          vectors.push({
            x: pos.x,
            y: pos.y,
            dx: -gradX / gradMag, // Point toward high density
            dy: -gradY / gradMag,
            magnitude: gradMag * 10,
            type: 'density'
          });
        }
      }
    }
    
    return vectors;
  }, [journeyPath, densityMap]);

  // Animation loop for flowing particles
  useEffect(() => {
    const animate = () => {
      setAnimationTime(t => (t + 0.02) % 100);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Canvas rendering for smooth flow visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 400, 400);
    
    // Draw torus outline
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(200, 200, 150, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(200, 200, 110, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw flow vectors
    flowVectors.forEach(vector => {
      const arrowLength = Math.min(vector.magnitude * 0.5, 30);
      
      ctx.strokeStyle = vector.type === 'journey' 
        ? 'hsl(var(--primary))' 
        : 'hsl(var(--chart-2))';
      ctx.lineWidth = vector.type === 'journey' ? 2 : 1;
      ctx.globalAlpha = vector.type === 'journey' ? 0.8 : 0.4;
      
      // Animated offset
      const offset = (animationTime * 20) % arrowLength;
      
      ctx.beginPath();
      ctx.moveTo(
        vector.x + vector.dx * offset,
        vector.y + vector.dy * offset
      );
      ctx.lineTo(
        vector.x + vector.dx * (arrowLength + offset),
        vector.y + vector.dy * (arrowLength + offset)
      );
      ctx.stroke();
      
      // Arrow head
      const headX = vector.x + vector.dx * (arrowLength + offset);
      const headY = vector.y + vector.dy * (arrowLength + offset);
      const angle = Math.atan2(vector.dy, vector.dx);
      
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(
        headX - 6 * Math.cos(angle - 0.5),
        headY - 6 * Math.sin(angle - 0.5)
      );
      ctx.lineTo(
        headX - 6 * Math.cos(angle + 0.5),
        headY - 6 * Math.sin(angle + 0.5)
      );
      ctx.closePath();
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;
  }, [flowVectors, animationTime]);

  // Generate tile positions for SVG overlay
  const tilePositions = useMemo(() => {
    const positions: Array<{ row: number; col: number; x: number; y: number; density: number }> = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = tileToDisplay(row, col);
        const key = `${row}-${col}`;
        positions.push({
          row,
          col,
          ...pos,
          density: densityMap.get(key) || 0
        });
      }
    }
    
    return positions;
  }, [densityMap]);

  // Identify convergence and divergence points
  const criticalPoints = useMemo(() => {
    const points: Array<{ x: number; y: number; type: 'source' | 'sink' | 'saddle'; strength: number }> = [];
    
    // Find tiles with high density (sinks/attractors)
    tilePositions.forEach(tile => {
      if (tile.density > 3) {
        points.push({
          x: tile.x,
          y: tile.y,
          type: 'sink',
          strength: tile.density
        });
      }
    });
    
    // Journey endpoints
    if (journeyPath.length > 0) {
      const start = tileToDisplay(journeyPath[0].row, journeyPath[0].col);
      const end = tileToDisplay(
        journeyPath[journeyPath.length - 1].row,
        journeyPath[journeyPath.length - 1].col
      );
      
      points.push({ ...start, type: 'source', strength: 5 });
      points.push({ ...end, type: 'sink', strength: 5 });
    }
    
    return points;
  }, [tilePositions, journeyPath]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Flow Visualization */}
        <div className="relative">
          {/* Canvas for animated flow */}
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="absolute inset-0"
          />
          
          {/* SVG overlay for tiles and critical points */}
          <svg width="400" height="400" className="relative z-10">
            {/* Tile markers */}
            {tilePositions.map(tile => {
              const isSelected = selectedTile?.row === tile.row && selectedTile?.col === tile.col;
              const isVisited = visitedTiles.has(`${tile.row}-${tile.col}`);
              
              return (
                <g key={`${tile.row}-${tile.col}`}>
                  <circle
                    cx={tile.x}
                    cy={tile.y}
                    r={isSelected ? 8 : (isVisited ? 6 : 4)}
                    fill={isVisited ? SEASON_COLORS[season] : 'hsl(var(--muted))'}
                    stroke={isSelected ? 'hsl(var(--primary))' : 'none'}
                    strokeWidth={2}
                    opacity={isVisited ? 0.9 : 0.3}
                    className="cursor-pointer transition-all duration-200 hover:opacity-100"
                    onClick={() => onTileClick?.(tile.row, tile.col)}
                  />
                  {tile.density > 0 && (
                    <circle
                      cx={tile.x}
                      cy={tile.y}
                      r={4 + tile.density * 2}
                      fill="none"
                      stroke={SEASON_COLORS[season]}
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  )}
                </g>
              );
            })}
            
            {/* Critical points markers */}
            {criticalPoints.map((point, i) => (
              <g key={`critical-${i}`}>
                {point.type === 'source' && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={10}
                    fill="none"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />
                )}
                {point.type === 'sink' && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={8 + point.strength}
                    fill="hsl(var(--chart-2) / 0.2)"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth="1"
                  />
                )}
              </g>
            ))}
            
            {/* Labels */}
            <text x={200} y={380} textAnchor="middle" className="text-xs fill-muted-foreground">
              Flow Field on Torus Surface
            </text>
          </svg>
        </div>
        
        {/* Flow Info Panel */}
        <div className="flex flex-col gap-4 p-4 bg-card/50 rounded-lg border border-border min-w-[260px]">
          <h3 className="text-sm font-semibold text-foreground">Vector Field Analysis</h3>
          
          {/* Flow Types */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10">
              <div className="w-6 h-1 bg-primary rounded" />
              <span className="text-xs text-foreground">Journey Flow</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-chart-2/10">
              <div className="w-6 h-1 bg-chart-2 rounded" />
              <span className="text-xs text-foreground">Density Gradient</span>
            </div>
          </div>
          
          {/* Critical Points */}
          <div className="p-3 bg-muted/30 rounded-md space-y-2">
            <p className="text-xs font-medium text-foreground">Critical Points</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-full border-2 border-dashed border-chart-1" />
              <span>Source (start)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-chart-2/30 border border-chart-2" />
              <span>Sink (attractor)</span>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="p-3 border border-dashed border-border rounded-md space-y-1">
            <p className="text-xs font-medium text-foreground">Flow Statistics</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-muted-foreground">Vectors:</span>
              <span className="text-foreground font-mono">{flowVectors.length}</span>
              <span className="text-muted-foreground">Critical pts:</span>
              <span className="text-foreground font-mono">{criticalPoints.length}</span>
              <span className="text-muted-foreground">Journey len:</span>
              <span className="text-foreground font-mono">{journeyPath.length}</span>
            </div>
          </div>
          
          {/* Divergence/Convergence */}
          {criticalPoints.length > 0 && (
            <div className="p-3 bg-primary/10 rounded-md">
              <p className="text-xs font-medium text-foreground mb-2">High-Activity Regions</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {criticalPoints.filter(p => p.type === 'sink').slice(0, 3).map((p, i) => (
                  <p key={i}>• Attractor at ({Math.round(p.x)}, {Math.round(p.y)})</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
