import React, { useState, useMemo } from 'react';
import { 
  ManifoldSeason,
  SEASON_COLORS,
  SEASON_INDEX,
  columnToTheta,
  rowSeasonToPhi,
  TORUS_MAJOR_RADIUS,
  TORUS_BASE_MINOR_RADIUS
} from '@/utils/torusManifoldMath';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface UnfoldedChartProjectionProps {
  selectedTile?: { row: number; col: number };
  season: ManifoldSeason;
  journeyPath: Array<{ row: number; col: number }>;
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  onTileClick?: (row: number, col: number) => void;
}

export function UnfoldedChartProjection({
  selectedTile,
  season,
  journeyPath,
  visitedTiles,
  densityMap,
  onTileClick
}: UnfoldedChartProjectionProps) {
  const [morphProgress, setMorphProgress] = useState(0);

  // Flat rectangle dimensions
  const flatWidth = 320;
  const flatHeight = 160;
  const flatOffsetX = 40;
  const flatOffsetY = 40;

  // Torus projection center and size
  const torusCenterX = 200;
  const torusCenterY = 200;
  const torusR = 80;
  const torusr = 30;

  // Calculate tile position interpolated between flat and torus
  const getTilePosition = (row: number, col: number): { x: number; y: number } => {
    // Flat position
    const flatX = flatOffsetX + (col / 7) * flatWidth;
    const flatY = flatOffsetY + (row / 7) * flatHeight;
    
    // Torus position (top-down projection)
    const theta = (col / 8) * 2 * Math.PI;
    const phi = (row / 8) * Math.PI;
    const radius = torusR + torusr * Math.cos(phi);
    const torusX = torusCenterX + radius * Math.cos(theta);
    const torusY = torusCenterY + radius * Math.sin(theta);
    
    // Interpolate
    return {
      x: flatX + (torusX - flatX) * morphProgress,
      y: flatY + (torusY - flatY) * morphProgress
    };
  };

  // Generate all tile positions
  const tilePositions = useMemo(() => {
    const positions: Array<{
      row: number;
      col: number;
      x: number;
      y: number;
      density: number;
      isVisited: boolean;
      isSelected: boolean;
    }> = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = getTilePosition(row, col);
        const key = `${row}-${col}`;
        positions.push({
          row,
          col,
          ...pos,
          density: densityMap.get(key) || 0,
          isVisited: visitedTiles.has(key),
          isSelected: selectedTile?.row === row && selectedTile?.col === col
        });
      }
    }

    return positions;
  }, [morphProgress, selectedTile, visitedTiles, densityMap]);

  // Generate journey path line points
  const journeyLinePoints = useMemo(() => {
    return journeyPath.map(p => getTilePosition(p.row, p.col));
  }, [journeyPath, morphProgress]);

  const journeyPathD = useMemo(() => {
    if (journeyLinePoints.length === 0) return '';
    return `M ${journeyLinePoints[0].x} ${journeyLinePoints[0].y} ` +
      journeyLinePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }, [journeyLinePoints]);

  // Grid lines that morph
  const gridLines = useMemo(() => {
    const lines: Array<{ d: string; type: 'theta' | 'phi' }> = [];
    
    // Horizontal lines (phi = const)
    for (let row = 0; row <= 8; row++) {
      const points: Array<{ x: number; y: number }> = [];
      for (let col = 0; col <= 16; col++) {
        const c = col / 2;
        const flatX = flatOffsetX + (c / 8) * flatWidth;
        const flatY = flatOffsetY + (row / 8) * flatHeight;
        
        const theta = (c / 8) * 2 * Math.PI;
        const phi = (row / 8) * Math.PI;
        const radius = torusR + torusr * Math.cos(phi);
        const torusX = torusCenterX + radius * Math.cos(theta);
        const torusY = torusCenterY + radius * Math.sin(theta);
        
        points.push({
          x: flatX + (torusX - flatX) * morphProgress,
          y: flatY + (torusY - flatY) * morphProgress
        });
      }
      
      const d = `M ${points[0].x} ${points[0].y} ` +
        points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      lines.push({ d, type: 'phi' });
    }
    
    // Vertical lines (theta = const)
    for (let col = 0; col <= 8; col++) {
      const points: Array<{ x: number; y: number }> = [];
      for (let row = 0; row <= 16; row++) {
        const r = row / 2;
        const flatX = flatOffsetX + (col / 8) * flatWidth;
        const flatY = flatOffsetY + (r / 8) * flatHeight;
        
        const theta = (col / 8) * 2 * Math.PI;
        const phi = (r / 8) * Math.PI;
        const radius = torusR + torusr * Math.cos(phi);
        const torusX = torusCenterX + radius * Math.cos(theta);
        const torusY = torusCenterY + radius * Math.sin(theta);
        
        points.push({
          x: flatX + (torusX - flatX) * morphProgress,
          y: flatY + (torusY - flatY) * morphProgress
        });
      }
      
      const d = `M ${points[0].x} ${points[0].y} ` +
        points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      lines.push({ d, type: 'theta' });
    }
    
    return lines;
  }, [morphProgress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4 overflow-auto">
      <div className="flex flex-col gap-6 items-center">
        {/* Morph Control */}
        <div className="flex items-center gap-4 w-full max-w-md px-4">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Flat (θ,φ)</span>
          <Slider
            value={[morphProgress]}
            onValueChange={([v]) => setMorphProgress(v)}
            min={0}
            max={1}
            step={0.01}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">Torus (T²)</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Visualization */}
          <div className="relative">
            <svg width="400" height="400" className="overflow-visible">
              <defs>
                <linearGradient id="morphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={SEASON_COLORS[season]} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={SEASON_COLORS[season]} stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Background */}
              <rect x="0" y="0" width="400" height="400" fill="url(#morphGrad)" rx="8" />

              {/* Grid lines */}
              {gridLines.map((line, i) => (
                <path
                  key={i}
                  d={line.d}
                  fill="none"
                  stroke={line.type === 'theta' ? 'hsl(var(--chart-1) / 0.3)' : 'hsl(var(--chart-2) / 0.3)'}
                  strokeWidth="1"
                />
              ))}

              {/* Journey path */}
              {journeyPathD && (
                <path
                  d={journeyPathD}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Tile markers */}
              {tilePositions.map(tile => (
                <g key={`${tile.row}-${tile.col}`}>
                  <circle
                    cx={tile.x}
                    cy={tile.y}
                    r={tile.isSelected ? 10 : (tile.isVisited ? 7 : 5)}
                    fill={tile.isVisited ? SEASON_COLORS[season] : 'hsl(var(--muted))'}
                    stroke={tile.isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                    strokeWidth={tile.isSelected ? 2 : 1}
                    opacity={tile.isVisited ? 0.9 : 0.4}
                    className="cursor-pointer transition-all duration-200 hover:opacity-100"
                    onClick={() => onTileClick?.(tile.row, tile.col)}
                  />
                  {tile.density > 0 && (
                    <circle
                      cx={tile.x}
                      cy={tile.y}
                      r={3 + tile.density}
                      fill={SEASON_COLORS[season]}
                      opacity={0.3}
                    />
                  )}
                </g>
              ))}

              {/* Axis labels (only when flat) */}
              {morphProgress < 0.3 && (
                <g opacity={1 - morphProgress * 3}>
                  {/* Column labels */}
                  {['C', 'H', 'O', 'R', 'D', 'S', 'M', 'Σ'].map((letter, i) => (
                    <text
                      key={letter}
                      x={flatOffsetX + (i / 7) * flatWidth}
                      y={flatOffsetY - 10}
                      textAnchor="middle"
                      className="text-[10px] fill-muted-foreground font-bold"
                    >
                      {letter}
                    </text>
                  ))}
                  {/* Row labels */}
                  {['M', 'A', 'G', 'I', 'C', 'N', 'S', 'P'].map((letter, i) => (
                    <text
                      key={`row-${i}`}
                      x={flatOffsetX - 15}
                      y={flatOffsetY + (i / 7) * flatHeight + 4}
                      textAnchor="middle"
                      className="text-[10px] fill-muted-foreground font-bold"
                    >
                      {letter}
                    </text>
                  ))}
                  <text x={flatOffsetX + flatWidth / 2} y={flatOffsetY + flatHeight + 25} textAnchor="middle" className="text-xs fill-muted-foreground">
                    θ (CHORDS) →
                  </text>
                  <text x={flatOffsetX - 30} y={flatOffsetY + flatHeight / 2} textAnchor="middle" className="text-xs fill-muted-foreground" transform={`rotate(-90, ${flatOffsetX - 30}, ${flatOffsetY + flatHeight / 2})`}>
                    φ (AGENDAS) →
                  </text>
                </g>
              )}

              {/* Title */}
              <text x={200} y={380} textAnchor="middle" className="text-xs fill-foreground font-medium">
                {morphProgress < 0.5 ? 'Unfolded Chart (θ, φ) → ' : '→ '}Torus Surface T²
              </text>
            </svg>
          </div>

          {/* Info Panel */}
          <div className="flex flex-col gap-4 p-4 bg-card/50 rounded-lg border border-border min-w-[240px]">
            <h3 className="text-sm font-semibold text-foreground">Chart Projection</h3>

            {/* Morphing State */}
            <div className="p-3 bg-muted/30 rounded-md">
              <p className="text-xs font-medium text-foreground mb-1">Morph Progress</p>
              <p className="text-2xl font-mono font-bold text-primary">
                {Math.round(morphProgress * 100)}%
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {morphProgress < 0.3 ? 'Flat Euclidean view' :
                 morphProgress < 0.7 ? 'Intermediate projection' :
                 'Torus surface view'}
              </p>
            </div>

            {/* Coordinate System */}
            <div className="p-3 bg-primary/10 rounded-md space-y-1">
              <p className="text-xs font-medium text-foreground">Coordinate Mapping</p>
              <div className="font-mono text-xs space-y-1 text-muted-foreground">
                <p>f: [0,2π] × [0,2π] → T²</p>
                <p className="pl-2">θ → toroidal angle</p>
                <p className="pl-2">φ → poloidal angle</p>
              </div>
            </div>

            {/* Topology Note */}
            <div className="p-3 border border-dashed border-border rounded-md">
              <p className="text-xs font-medium text-foreground mb-1">Topological Note</p>
              <p className="text-[10px] text-muted-foreground">
                The flat rectangle has identified edges: left≡right (θ=0≡2π), 
                top≡bottom (φ=0≡2π). This quotient space ℝ²/ℤ² ≅ T².
              </p>
            </div>

            {/* Grid Legend */}
            <div className="space-y-1 text-xs">
              <p className="font-medium text-muted-foreground">Grid Lines</p>
              <p className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-chart-1/50" /> θ = const (columns)
              </p>
              <p className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-chart-2/50" /> φ = const (rows)
              </p>
            </div>

            {/* Season */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <span 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: SEASON_COLORS[season] }}
              />
              <span className="text-xs text-muted-foreground">{season}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
