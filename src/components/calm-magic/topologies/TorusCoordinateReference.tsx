import React, { useMemo } from 'react';
import { 
  ManifoldSeason,
  SEASON_COLORS,
  SEASON_INDEX,
  columnToTheta,
  rowSeasonToPhi,
  tileToTorusPoint,
  TORUS_MAJOR_RADIUS,
  TORUS_BASE_MINOR_RADIUS,
  gaussianCurvature,
  calculateLocalRadius
} from '@/utils/torusManifoldMath';
import { cn } from '@/lib/utils';

interface TorusCoordinateReferenceProps {
  selectedTile?: { row: number; col: number };
  season: ManifoldSeason;
  densityMap: Map<string, number>;
}

export function TorusCoordinateReference({
  selectedTile,
  season,
  densityMap
}: TorusCoordinateReferenceProps) {
  // Calculate coordinates for selected tile
  const tileCoords = useMemo(() => {
    if (!selectedTile) return null;
    
    const { row, col } = selectedTile;
    const theta = columnToTheta(col);
    const phi = rowSeasonToPhi(row, season);
    const key = `${row}-${col}`;
    const density = densityMap.get(key) || 0;
    const [x, y, z] = tileToTorusPoint(row, col, season, density);
    const localRadius = calculateLocalRadius(density);
    const K = gaussianCurvature(phi, localRadius);
    
    return { theta, phi, x, y, z, density, localRadius, curvature: K };
  }, [selectedTile, season, densityMap]);

  // Generate cross-section points for visualization
  const crossSectionPoints = useMemo(() => {
    const points: Array<{ x: number; y: number; label?: string }> = [];
    const R = TORUS_MAJOR_RADIUS;
    const r = TORUS_BASE_MINOR_RADIUS;
    const scale = 40;
    const centerX = 150;
    const centerY = 120;
    
    // Main circle (tube cross-section)
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * 2 * Math.PI;
      points.push({
        x: centerX + r * Math.cos(angle) * scale,
        y: centerY + r * Math.sin(angle) * scale
      });
    }
    
    return { points, centerX, centerY, scale, R, r };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cross-Section Diagram */}
        <div className="relative">
          <svg width="320" height="280" className="overflow-visible">
            <defs>
              <linearGradient id="tubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
              </linearGradient>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            
            {/* Center axis line */}
            <line
              x1={20}
              y1={crossSectionPoints.centerY}
              x2={280}
              y2={crossSectionPoints.centerY}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            
            {/* Torus center point */}
            <circle
              cx={20}
              cy={crossSectionPoints.centerY}
              r={4}
              fill="hsl(var(--muted-foreground))"
            />
            <text x={20} y={crossSectionPoints.centerY + 20} textAnchor="middle" className="text-[9px] fill-muted-foreground">
              Center
            </text>
            
            {/* Major radius R indicator */}
            <line
              x1={20}
              y1={crossSectionPoints.centerY - 5}
              x2={crossSectionPoints.centerX}
              y2={crossSectionPoints.centerY - 5}
              stroke="hsl(var(--chart-1))"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <text x={85} y={crossSectionPoints.centerY - 12} textAnchor="middle" className="text-[10px] fill-chart-1 font-bold">
              R = {TORUS_MAJOR_RADIUS}
            </text>
            
            {/* Tube cross-section circle */}
            <circle
              cx={crossSectionPoints.centerX}
              cy={crossSectionPoints.centerY}
              r={TORUS_BASE_MINOR_RADIUS * crossSectionPoints.scale}
              fill="url(#tubeGrad)"
              stroke={SEASON_COLORS[season]}
              strokeWidth="2"
            />
            
            {/* Tube center */}
            <circle
              cx={crossSectionPoints.centerX}
              cy={crossSectionPoints.centerY}
              r={3}
              fill={SEASON_COLORS[season]}
            />
            
            {/* Minor radius r indicator */}
            <line
              x1={crossSectionPoints.centerX}
              y1={crossSectionPoints.centerY}
              x2={crossSectionPoints.centerX + TORUS_BASE_MINOR_RADIUS * crossSectionPoints.scale}
              y2={crossSectionPoints.centerY}
              stroke="hsl(var(--chart-2))"
              strokeWidth="2"
            />
            <text 
              x={crossSectionPoints.centerX + TORUS_BASE_MINOR_RADIUS * crossSectionPoints.scale / 2} 
              y={crossSectionPoints.centerY - 8} 
              textAnchor="middle" 
              className="text-[10px] fill-chart-2 font-bold"
            >
              r = {TORUS_BASE_MINOR_RADIUS}
            </text>
            
            {/* Phi angle arc */}
            {tileCoords && (
              <>
                <path
                  d={`M ${crossSectionPoints.centerX + 20} ${crossSectionPoints.centerY} A 20 20 0 0 1 ${
                    crossSectionPoints.centerX + 20 * Math.cos(tileCoords.phi)
                  } ${crossSectionPoints.centerY - 20 * Math.sin(tileCoords.phi)}`}
                  fill="none"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth="2"
                />
                <text 
                  x={crossSectionPoints.centerX + 30} 
                  y={crossSectionPoints.centerY - 10} 
                  className="text-[10px] fill-chart-3 font-bold"
                >
                  φ
                </text>
                
                {/* Point on surface */}
                <circle
                  cx={crossSectionPoints.centerX + TORUS_BASE_MINOR_RADIUS * crossSectionPoints.scale * Math.cos(tileCoords.phi)}
                  cy={crossSectionPoints.centerY - TORUS_BASE_MINOR_RADIUS * crossSectionPoints.scale * Math.sin(tileCoords.phi)}
                  r={6}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </>
            )}
            
            {/* Labels */}
            <text x={160} y={260} textAnchor="middle" className="text-xs fill-foreground font-medium">
              Poloidal Cross-Section (φ plane)
            </text>
            
            {/* Season ring indicator */}
            <g transform={`translate(260, 50)`}>
              {(['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'] as ManifoldSeason[]).map((s, i) => (
                <g key={s} transform={`translate(0, ${i * 18})`}>
                  <circle
                    cx={0}
                    cy={0}
                    r={6}
                    fill={SEASON_COLORS[s]}
                    opacity={s === season ? 1 : 0.3}
                    stroke={s === season ? 'hsl(var(--foreground))' : 'none'}
                    strokeWidth="2"
                  />
                  <text x={12} y={4} className={cn("text-[9px]", s === season ? "fill-foreground font-bold" : "fill-muted-foreground")}>
                    {s}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
        
        {/* Top-Down Diagram (showing theta) */}
        <div className="relative">
          <svg width="220" height="220" className="overflow-visible">
            <defs>
              <linearGradient id="torusTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={SEASON_COLORS[season]} stopOpacity="0.2" />
                <stop offset="100%" stopColor={SEASON_COLORS[season]} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Outer ring */}
            <circle
              cx={110}
              cy={110}
              r={90}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            
            {/* Torus cross-section (ring) */}
            <circle
              cx={110}
              cy={110}
              r={70}
              fill="url(#torusTopGrad)"
              stroke={SEASON_COLORS[season]}
              strokeWidth="2"
            />
            <circle
              cx={110}
              cy={110}
              r={50}
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            
            {/* Column sectors */}
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * 2 * Math.PI - Math.PI / 2;
              const x1 = 110 + 50 * Math.cos(angle);
              const y1 = 110 + 50 * Math.sin(angle);
              const x2 = 110 + 70 * Math.cos(angle);
              const y2 = 110 + 70 * Math.sin(angle);
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity="0.5"
                />
              );
            })}
            
            {/* Column labels */}
            {['C', 'H', 'O', 'R', 'D', 'S', 'M', 'Σ'].map((letter, i) => {
              const angle = ((i + 0.5) / 8) * 2 * Math.PI - Math.PI / 2;
              const x = 110 + 80 * Math.cos(angle);
              const y = 110 + 80 * Math.sin(angle);
              
              return (
                <text
                  key={letter}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] fill-muted-foreground font-bold"
                >
                  {letter}
                </text>
              );
            })}
            
            {/* Current theta indicator */}
            {tileCoords && (
              <>
                <line
                  x1={110}
                  y1={110}
                  x2={110 + 60 * Math.cos(tileCoords.theta - Math.PI / 2)}
                  y2={110 + 60 * Math.sin(tileCoords.theta - Math.PI / 2)}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />
                <circle
                  cx={110 + 60 * Math.cos(tileCoords.theta - Math.PI / 2)}
                  cy={110 + 60 * Math.sin(tileCoords.theta - Math.PI / 2)}
                  r={5}
                  fill="hsl(var(--primary))"
                  className="animate-pulse"
                />
              </>
            )}
            
            <text x={110} y={205} textAnchor="middle" className="text-xs fill-foreground font-medium">
              Top View (θ angle)
            </text>
          </svg>
        </div>
        
        {/* Coordinate Info Panel */}
        <div className="flex flex-col gap-4 p-4 bg-card/50 rounded-lg border border-border min-w-[240px]">
          <h3 className="text-sm font-semibold text-foreground">Torus Coordinates</h3>
          
          {/* Parametric Equations */}
          <div className="p-3 bg-muted/30 rounded-md font-mono text-xs space-y-1">
            <p className="text-muted-foreground">
              x = (R + r·cos φ) · cos θ
            </p>
            <p className="text-muted-foreground">
              y = (R + r·cos φ) · sin θ
            </p>
            <p className="text-muted-foreground">
              z = r · sin φ
            </p>
          </div>
          
          {/* Current Position */}
          {tileCoords && selectedTile && (
            <div className="p-3 bg-primary/10 rounded-md space-y-2">
              <p className="text-xs font-medium text-foreground">Current Position</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <span className="text-muted-foreground">θ:</span>
                <span className="text-foreground">{tileCoords.theta.toFixed(4)} rad</span>
                <span className="text-muted-foreground">φ:</span>
                <span className="text-foreground">{tileCoords.phi.toFixed(4)} rad</span>
                <span className="text-muted-foreground">x:</span>
                <span className="text-foreground">{tileCoords.x.toFixed(3)}</span>
                <span className="text-muted-foreground">y:</span>
                <span className="text-foreground">{tileCoords.y.toFixed(3)}</span>
                <span className="text-muted-foreground">z:</span>
                <span className="text-foreground">{tileCoords.z.toFixed(3)}</span>
              </div>
            </div>
          )}
          
          {/* Curvature Info */}
          {tileCoords && (
            <div className="p-3 border border-dashed border-border rounded-md space-y-1">
              <p className="text-xs font-medium text-foreground">Gaussian Curvature</p>
              <p className={cn(
                "text-lg font-mono font-bold",
                tileCoords.curvature > 0 ? "text-chart-1" : "text-chart-2"
              )}>
                K = {tileCoords.curvature.toFixed(4)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {tileCoords.curvature > 0 ? '(Convex - outer edge)' : '(Saddle - inner edge)'}
              </p>
            </div>
          )}
          
          {/* Legend */}
          <div className="space-y-1 text-xs">
            <p className="font-medium text-foreground">Legend</p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-chart-1" /> R (major radius)
            </p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-chart-2" /> r (minor radius)
            </p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-chart-3" /> φ (poloidal angle)
            </p>
            <p className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-primary" /> θ (toroidal angle)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
