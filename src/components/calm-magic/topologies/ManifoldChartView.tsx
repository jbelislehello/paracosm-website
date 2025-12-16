import React, { useMemo } from 'react';
import { 
  ManifoldSeason, 
  SEASON_COLORS, 
  columnToTheta, 
  rowSeasonToPhi,
  TORUS_MAJOR_RADIUS,
  TORUS_BASE_MINOR_RADIUS
} from '@/utils/torusManifoldMath';
import { cn } from '@/lib/utils';

interface ChartRegion {
  row: number;
  col: number;
  season: ManifoldSeason;
  theta: number;
  phi: number;
  u: number; // Local chart u coordinate
  v: number; // Local chart v coordinate
  density: number;
}

interface ManifoldChartViewProps {
  selectedTile?: { row: number; col: number };
  season: ManifoldSeason;
  visitedTiles: Set<string>;
  densityMap: Map<string, number>;
  onTileClick?: (row: number, col: number) => void;
}

export function ManifoldChartView({
  selectedTile,
  season,
  visitedTiles,
  densityMap,
  onTileClick
}: ManifoldChartViewProps) {
  // Generate chart regions for all tiles
  const chartRegions = useMemo(() => {
    const regions: ChartRegion[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const theta = columnToTheta(col);
        const phi = rowSeasonToPhi(row, season);
        const key = `${row}-${col}`;
        const density = densityMap.get(key) || 0;
        
        // Local chart coordinates (u, v) ∈ [0,1]²
        const u = col / 7;
        const v = row / 7;
        
        regions.push({ row, col, season, theta, phi, u, v, density });
      }
    }
    
    return regions;
  }, [season, densityMap]);

  // Calculate chart boundaries and overlapping regions
  const chartBoundaries = useMemo(() => {
    // Generate boundary lines showing how charts tile
    const boundaries: Array<{ x1: number; y1: number; x2: number; y2: number; type: 'theta' | 'phi' }> = [];
    
    // Vertical boundaries (θ transitions)
    for (let col = 0; col <= 8; col++) {
      boundaries.push({
        x1: col * 50,
        y1: 0,
        x2: col * 50,
        y2: 400,
        type: 'theta'
      });
    }
    
    // Horizontal boundaries (φ transitions)
    for (let row = 0; row <= 8; row++) {
      boundaries.push({
        x1: 0,
        y1: row * 50,
        x2: 400,
        y2: row * 50,
        type: 'phi'
      });
    }
    
    return boundaries;
  }, []);

  // Transition function indicators
  const transitionArrows = useMemo(() => {
    const arrows: Array<{ x: number; y: number; direction: 'h' | 'v' }> = [];
    
    // Show transition functions between adjacent charts
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 7; col++) {
        arrows.push({ x: (col + 1) * 50, y: row * 50 + 25, direction: 'h' });
      }
    }
    
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 8; col++) {
        arrows.push({ x: col * 50 + 25, y: (row + 1) * 50, direction: 'v' });
      }
    }
    
    return arrows;
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Chart Atlas Visualization */}
        <div className="relative">
          <svg width="420" height="420" className="overflow-visible">
            {/* Background gradient */}
            <defs>
              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
              </linearGradient>
              <pattern id="gridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            
            <rect x="10" y="10" width="400" height="400" fill="url(#chartGrad)" rx="8" />
            <rect x="10" y="10" width="400" height="400" fill="url(#gridPattern)" rx="8" />
            
            {/* Chart Regions */}
            {chartRegions.map((region) => {
              const x = 10 + region.col * 50;
              const y = 10 + region.row * 50;
              const isSelected = selectedTile?.row === region.row && selectedTile?.col === region.col;
              const isVisited = visitedTiles.has(`${region.row}-${region.col}`);
              const opacity = 0.3 + (region.density / 10) * 0.5;
              
              return (
                <g key={`${region.row}-${region.col}`}>
                  {/* Chart region fill */}
                  <rect
                    x={x + 2}
                    y={y + 2}
                    width={46}
                    height={46}
                    fill={SEASON_COLORS[season]}
                    opacity={isVisited ? opacity : 0.1}
                    rx={4}
                    className={cn(
                      "transition-all duration-200 cursor-pointer",
                      isSelected && "stroke-primary stroke-2"
                    )}
                    onClick={() => onTileClick?.(region.row, region.col)}
                  />
                  
                  {/* Local coordinates label */}
                  <text
                    x={x + 25}
                    y={y + 20}
                    textAnchor="middle"
                    className="text-[8px] fill-muted-foreground/70 font-mono"
                  >
                    φ{region.row}
                  </text>
                  <text
                    x={x + 25}
                    y={y + 35}
                    textAnchor="middle"
                    className="text-[8px] fill-muted-foreground/70 font-mono"
                  >
                    θ{region.col}
                  </text>
                  
                  {/* Density indicator */}
                  {region.density > 0 && (
                    <circle
                      cx={x + 40}
                      cy={y + 10}
                      r={3 + region.density}
                      fill="hsl(var(--primary))"
                      opacity={0.7}
                    />
                  )}
                  
                  {/* Selected highlight */}
                  {isSelected && (
                    <rect
                      x={x + 1}
                      y={y + 1}
                      width={48}
                      height={48}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      rx={4}
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
            
            {/* Axis Labels */}
            <text x="210" y="430" textAnchor="middle" className="text-xs fill-muted-foreground font-medium">
              θ (Toroidal) → CHORDS
            </text>
            <text x="-200" y="0" textAnchor="middle" className="text-xs fill-muted-foreground font-medium" transform="rotate(-90)">
              φ (Poloidal) → AGENDAS
            </text>
            
            {/* Column headers */}
            {['C', 'H', 'O', 'R', 'D', 'S', 'M', 'Σ'].map((letter, i) => (
              <text
                key={letter}
                x={35 + i * 50}
                y={6}
                textAnchor="middle"
                className="text-[10px] fill-foreground font-bold"
              >
                {letter}
              </text>
            ))}
            
            {/* Row headers */}
            {['M', 'A', 'G', 'I', 'C', 'N', 'S', 'P'].map((letter, i) => (
              <text
                key={`row-${i}`}
                x={4}
                y={38 + i * 50}
                textAnchor="middle"
                className="text-[10px] fill-foreground font-bold"
              >
                {letter}
              </text>
            ))}
          </svg>
        </div>
        
        {/* Chart Info Panel */}
        <div className="flex flex-col gap-4 p-4 bg-card/50 rounded-lg border border-border min-w-[280px]">
          <h3 className="text-sm font-semibold text-foreground">Manifold Atlas Structure</h3>
          
          {/* Coordinate System Explanation */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary/50" />
              Each tile = local chart (U<sub>i</sub>)
            </p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-border" />
              Grid lines = transition functions
            </p>
          </div>
          
          {/* Mathematical Info */}
          <div className="p-3 bg-muted/30 rounded-md font-mono text-xs space-y-1">
            <p className="text-muted-foreground">
              <span className="text-foreground">θ</span> = (col + 0.5) × π/4
            </p>
            <p className="text-muted-foreground">
              <span className="text-foreground">φ</span> = (season × 8 + row) × π/20
            </p>
            <p className="text-muted-foreground mt-2">
              <span className="text-foreground">Chart mapping:</span>
            </p>
            <p className="text-muted-foreground pl-2">
              φ<sub>i</sub>: U<sub>i</sub> → ℝ²
            </p>
          </div>
          
          {/* Selected Tile Info */}
          {selectedTile && (
            <div className="p-3 bg-primary/10 rounded-md space-y-1">
              <p className="text-xs font-medium text-foreground">Selected Chart</p>
              <p className="text-xs text-muted-foreground font-mono">
                Row: {selectedTile.row} | Col: {selectedTile.col}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                θ = {columnToTheta(selectedTile.col).toFixed(3)} rad
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                φ = {rowSeasonToPhi(selectedTile.row, season).toFixed(3)} rad
              </p>
            </div>
          )}
          
          {/* Torus Parameters */}
          <div className="p-3 border border-dashed border-border rounded-md">
            <p className="text-xs font-medium text-foreground mb-1">Torus Parameters</p>
            <p className="text-xs text-muted-foreground font-mono">R = {TORUS_MAJOR_RADIUS} (major)</p>
            <p className="text-xs text-muted-foreground font-mono">r = {TORUS_BASE_MINOR_RADIUS} (minor)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
