import React, { useMemo, useRef, useEffect, useState } from 'react';
import { 
  ManifoldSeason,
  SEASON_COLORS,
  SEASON_INDEX,
  tileToTorusPoint,
  TORUS_MAJOR_RADIUS,
  TORUS_BASE_MINOR_RADIUS
} from '@/utils/torusManifoldMath';

interface FundamentalCyclesOverlayProps {
  selectedTile?: { row: number; col: number };
  season: ManifoldSeason;
  journeyPath: Array<{ row: number; col: number }>;
  visitedTiles: Set<string>;
  showToroidalCycle?: boolean;
  showPoloidalCycle?: boolean;
  showJourneyDecomposition?: boolean;
}

export function FundamentalCyclesOverlay({
  selectedTile,
  season,
  journeyPath,
  visitedTiles,
  showToroidalCycle = true,
  showPoloidalCycle = true,
  showJourneyDecomposition = true
}: FundamentalCyclesOverlayProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number>();

  // Animate the cycles
  useEffect(() => {
    const animate = () => {
      setAnimationProgress(prev => (prev + 0.005) % 1);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Generate toroidal cycle points (fixed phi, theta varies 0→2π)
  const toroidalCycle = useMemo(() => {
    const points: Array<{ x: number; y: number }> = [];
    const fixedPhi = selectedTile ? (selectedTile.row / 8) : 0.5;
    const R = TORUS_MAJOR_RADIUS;
    const r = TORUS_BASE_MINOR_RADIUS;
    const scale = 50;
    const centerX = 200;
    const centerY = 200;
    
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * 2 * Math.PI;
      // Project 3D torus point to 2D (simplified top-down view)
      const radius = (R + r * Math.cos(fixedPhi * Math.PI)) * scale / R;
      points.push({
        x: centerX + radius * Math.cos(theta),
        y: centerY + radius * Math.sin(theta)
      });
    }
    
    return points;
  }, [selectedTile]);

  // Generate poloidal cycle points (fixed theta, phi varies 0→2π)
  const poloidalCycle = useMemo(() => {
    const points: Array<{ x: number; y: number }> = [];
    const fixedCol = selectedTile?.col ?? 0;
    const theta = (fixedCol / 8) * 2 * Math.PI;
    const R = TORUS_MAJOR_RADIUS;
    const r = TORUS_BASE_MINOR_RADIUS;
    const scale = 50;
    const centerX = 200 + (R * scale / R) * Math.cos(theta);
    const centerY = 200 + (R * scale / R) * Math.sin(theta);
    
    for (let i = 0; i <= 32; i++) {
      const phi = (i / 32) * 2 * Math.PI;
      // Small circle representing tube cross-section
      points.push({
        x: centerX + (r * scale / R) * Math.cos(phi) * Math.cos(theta + Math.PI / 2),
        y: centerY + (r * scale / R) * Math.sin(phi) - (r * scale / R) * Math.cos(phi) * Math.sin(theta + Math.PI / 2) * 0.5
      });
    }
    
    return points;
  }, [selectedTile]);

  // Decompose journey path into fundamental cycle components
  const journeyDecomposition = useMemo(() => {
    if (journeyPath.length < 2) return { toroidal: 0, poloidal: 0, path: [] };
    
    let toroidalWinding = 0;
    let poloidalWinding = 0;
    
    for (let i = 1; i < journeyPath.length; i++) {
      const prev = journeyPath[i - 1];
      const curr = journeyPath[i];
      
      // Horizontal movement contributes to toroidal winding
      const dCol = curr.col - prev.col;
      toroidalWinding += dCol / 8; // Fraction of full cycle
      
      // Vertical movement contributes to poloidal winding
      const dRow = curr.row - prev.row;
      poloidalWinding += dRow / 8; // Fraction within season
    }
    
    return {
      toroidal: toroidalWinding,
      poloidal: poloidalWinding,
      path: journeyPath.map((p, i) => ({
        ...p,
        index: i,
        x: 200 + ((TORUS_MAJOR_RADIUS + TORUS_BASE_MINOR_RADIUS * Math.cos(p.row / 8 * Math.PI)) * 50 / TORUS_MAJOR_RADIUS) * Math.cos(p.col / 8 * 2 * Math.PI),
        y: 200 + ((TORUS_MAJOR_RADIUS + TORUS_BASE_MINOR_RADIUS * Math.cos(p.row / 8 * Math.PI)) * 50 / TORUS_MAJOR_RADIUS) * Math.sin(p.col / 8 * 2 * Math.PI)
      }))
    };
  }, [journeyPath]);

  // Generate path string for SVG
  const toroidalPathD = useMemo(() => {
    if (toroidalCycle.length === 0) return '';
    return `M ${toroidalCycle[0].x} ${toroidalCycle[0].y} ` +
      toroidalCycle.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }, [toroidalCycle]);

  const poloidalPathD = useMemo(() => {
    if (poloidalCycle.length === 0) return '';
    return `M ${poloidalCycle[0].x} ${poloidalCycle[0].y} ` +
      poloidalCycle.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }, [poloidalCycle]);

  const journeyPathD = useMemo(() => {
    if (journeyDecomposition.path.length === 0) return '';
    return `M ${journeyDecomposition.path[0].x} ${journeyDecomposition.path[0].y} ` +
      journeyDecomposition.path.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }, [journeyDecomposition]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Cycle Visualization */}
        <div className="relative">
          <svg width="400" height="400" className="overflow-visible">
            <defs>
              {/* Animated dash offset for cycles */}
              <style>
                {`
                  @keyframes dashAnimation {
                    to { stroke-dashoffset: -50; }
                  }
                  .animated-dash {
                    animation: dashAnimation 2s linear infinite;
                  }
                `}
              </style>
              
              {/* Gradient for torus body */}
              <radialGradient id="torusBodyGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.1" />
              </radialGradient>
              
              {/* Arrow markers */}
              <marker id="toroidalArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 z" fill="hsl(350, 80%, 60%)" />
              </marker>
              <marker id="poloidalArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 z" fill="hsl(220, 70%, 60%)" />
              </marker>
            </defs>
            
            {/* Torus body representation (simplified 2D) */}
            <circle
              cx={200}
              cy={200}
              r={120}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="30"
              opacity="0.3"
            />
            <circle
              cx={200}
              cy={200}
              r={120}
              fill="url(#torusBodyGrad)"
              stroke="none"
            />
            
            {/* Toroidal cycle (a-loop) - goes around the hole */}
            {showToroidalCycle && (
              <g>
                <path
                  d={toroidalPathD}
                  fill="none"
                  stroke="hsl(350, 80%, 60%)"
                  strokeWidth="3"
                  strokeDasharray="10 5"
                  className="animated-dash"
                  opacity="0.8"
                />
                {/* Cycle label */}
                <circle
                  cx={toroidalCycle[Math.floor(animationProgress * 64)]?.x || 200}
                  cy={toroidalCycle[Math.floor(animationProgress * 64)]?.y || 80}
                  r={6}
                  fill="hsl(350, 80%, 60%)"
                />
                <text
                  x={320}
                  y={200}
                  className="text-sm fill-rose-500 font-bold"
                >
                  a
                </text>
              </g>
            )}
            
            {/* Poloidal cycle (b-loop) - goes around the tube */}
            {showPoloidalCycle && (
              <g>
                <ellipse
                  cx={200 + 120 * Math.cos((selectedTile?.col || 0) / 8 * 2 * Math.PI)}
                  cy={200 + 120 * Math.sin((selectedTile?.col || 0) / 8 * 2 * Math.PI)}
                  rx={15}
                  ry={25}
                  fill="none"
                  stroke="hsl(220, 70%, 60%)"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  className="animated-dash"
                  transform={`rotate(${(selectedTile?.col || 0) / 8 * 360}, ${200 + 120 * Math.cos((selectedTile?.col || 0) / 8 * 2 * Math.PI)}, ${200 + 120 * Math.sin((selectedTile?.col || 0) / 8 * 2 * Math.PI)})`}
                />
                <text
                  x={200 + 140 * Math.cos((selectedTile?.col || 0) / 8 * 2 * Math.PI)}
                  y={200 + 140 * Math.sin((selectedTile?.col || 0) / 8 * 2 * Math.PI)}
                  className="text-sm fill-blue-500 font-bold"
                >
                  b
                </text>
              </g>
            )}
            
            {/* Journey path */}
            {showJourneyDecomposition && journeyPathD && (
              <g>
                <path
                  d={journeyPathD}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Path points */}
                {journeyDecomposition.path.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={i === journeyDecomposition.path.length - 1 ? 5 : 3}
                    fill={i === journeyDecomposition.path.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.5)'}
                  />
                ))}
              </g>
            )}
            
            {/* Selected tile indicator */}
            {selectedTile && (
              <circle
                cx={200 + 120 * Math.cos(selectedTile.col / 8 * 2 * Math.PI)}
                cy={200 + 120 * Math.sin(selectedTile.col / 8 * 2 * Math.PI)}
                r={8}
                fill={SEASON_COLORS[season]}
                stroke="hsl(var(--background))"
                strokeWidth="2"
                className="animate-pulse"
              />
            )}
            
            {/* Center hole indicator */}
            <circle
              cx={200}
              cy={200}
              r={5}
              fill="hsl(var(--muted-foreground))"
            />
            
            {/* Axis labels */}
            <text x={200} y={380} textAnchor="middle" className="text-xs fill-muted-foreground">
              Fundamental Cycles on T²
            </text>
          </svg>
        </div>
        
        {/* Homology Info Panel */}
        <div className="flex flex-col gap-4 p-4 bg-card/50 rounded-lg border border-border min-w-[280px]">
          <h3 className="text-sm font-semibold text-foreground">First Homology H₁(T²)</h3>
          
          {/* Cycle Classes */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-md bg-rose-500/10">
              <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold">
                a
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Toroidal Cycle</p>
                <p className="text-xs text-muted-foreground">Fixed φ, θ: 0 → 2π</p>
                <p className="text-xs text-muted-foreground">(Horizontal traverse)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-md bg-blue-500/10">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                b
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Poloidal Cycle</p>
                <p className="text-xs text-muted-foreground">Fixed θ, φ: 0 → 2π</p>
                <p className="text-xs text-muted-foreground">(Vertical traverse)</p>
              </div>
            </div>
          </div>
          
          {/* Homology Relation */}
          <div className="p-3 bg-muted/30 rounded-md font-mono text-xs">
            <p className="text-foreground font-medium">H₁(T²) = ℤ × ℤ</p>
            <p className="text-muted-foreground mt-1">Generated by [a] and [b]</p>
            <p className="text-muted-foreground">Any path = n·[a] + m·[b]</p>
          </div>
          
          {/* Journey Decomposition */}
          {journeyPath.length > 1 && (
            <div className="p-3 bg-primary/10 rounded-md space-y-2">
              <p className="text-xs font-medium text-foreground">Journey Winding Numbers</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-mono">
                    n = {journeyDecomposition.toroidal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-mono">
                    m = {journeyDecomposition.poloidal.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Path ≈ {journeyDecomposition.toroidal.toFixed(1)}·[a] + {journeyDecomposition.poloidal.toFixed(1)}·[b]
              </p>
            </div>
          )}
          
          {/* Cycle Controls */}
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground">Show Cycles</p>
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={showToroidalCycle} 
                  className="rounded border-border"
                  readOnly
                />
                <span className="text-rose-500">a (toroidal)</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={showPoloidalCycle} 
                  className="rounded border-border"
                  readOnly
                />
                <span className="text-blue-500">b (poloidal)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
