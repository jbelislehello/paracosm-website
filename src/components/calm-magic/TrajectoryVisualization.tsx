import React, { useMemo } from 'react';
import { QuadrantPosition, TrajectoryEvent, QUADRANT_LABELS } from '@/types/trajectory';

interface TrajectoryVisualizationProps {
  shadowPosition: QuadrantPosition;
  higherSelfPosition: QuadrantPosition | null;
  trajectoryLog: TrajectoryEvent[];
  onQuadrantClick?: (position: QuadrantPosition) => void;
  interactive?: boolean;
}

export const TrajectoryVisualization: React.FC<TrajectoryVisualizationProps> = ({
  shadowPosition,
  higherSelfPosition,
  trajectoryLog,
  onQuadrantClick,
  interactive = false,
}) => {
  // Convert position (-1 to 1) to SVG coordinates (0 to 100)
  const toSvgCoord = (pos: QuadrantPosition) => ({
    x: 50 + pos.x * 40,
    y: 50 - pos.y * 40, // Invert Y for SVG
  });

  const shadowCoord = toSvgCoord(shadowPosition);
  const higherSelfCoord = higherSelfPosition ? toSvgCoord(higherSelfPosition) : null;

  // Build trajectory path from log
  const trajectoryPath = useMemo(() => {
    if (trajectoryLog.length < 2) return null;
    
    const points = trajectoryLog.map(event => toSvgCoord(event.shadow_position));
    const pathData = points.reduce((acc, point, idx) => {
      if (idx === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');
    
    return pathData;
  }, [trajectoryLog]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onQuadrantClick) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Convert SVG coords to position
    const posX = (x - 50) / 40;
    const posY = (50 - y) / 40;
    
    onQuadrantClick({ 
      x: Math.max(-1, Math.min(1, posX)), 
      y: Math.max(-1, Math.min(1, posY)) 
    });
  };

  return (
    <div className="relative w-full aspect-square max-w-[300px] mx-auto">
      <svg 
        viewBox="0 0 100 100" 
        className={`absolute inset-0 w-full h-full ${interactive ? 'cursor-crosshair' : ''}`}
        onClick={handleClick}
      >
        {/* Quadrant backgrounds with gradients */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Quadrant backgrounds */}
        <rect x="50" y="0" width="50" height="50" fill="hsl(var(--chart-1) / 0.08)" />
        <rect x="0" y="0" width="50" height="50" fill="hsl(var(--chart-2) / 0.08)" />
        <rect x="0" y="50" width="50" height="50" fill="hsl(var(--chart-3) / 0.08)" />
        <rect x="50" y="50" width="50" height="50" fill="hsl(var(--chart-4) / 0.08)" />
        
        {/* Center glow */}
        <circle cx="50" cy="50" r="30" fill="url(#centerGlow)" />
        
        {/* Grid lines */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
        
        {/* Axis arrows */}
        <path d="M 50 8 L 48 12 L 52 12 Z" fill="hsl(var(--foreground))" opacity="0.5" />
        <path d="M 92 50 L 88 48 L 88 52 Z" fill="hsl(var(--foreground))" opacity="0.5" />
        
        {/* Trajectory path */}
        {trajectoryPath && (
          <path
            d={trajectoryPath}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="0.5"
            strokeDasharray="2,1"
            opacity="0.5"
          />
        )}
        
        {/* Higher Self target (star) */}
        {higherSelfCoord && (
          <g className="animate-pulse">
            <circle 
              cx={higherSelfCoord.x} 
              cy={higherSelfCoord.y} 
              r="6" 
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeDasharray="2,1"
            />
            <text 
              x={higherSelfCoord.x} 
              y={higherSelfCoord.y + 1} 
              textAnchor="middle" 
              fontSize="8" 
              fill="hsl(var(--primary))"
            >
              ★
            </text>
          </g>
        )}
        
        {/* Shadow Self marker (hexagon) */}
        <g>
          <circle 
            cx={shadowCoord.x} 
            cy={shadowCoord.y} 
            r="5" 
            fill="hsl(var(--foreground))"
            className="transition-all duration-500"
          />
          <circle 
            cx={shadowCoord.x} 
            cy={shadowCoord.y} 
            r="7" 
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
            opacity="0.3"
            className="transition-all duration-500"
          />
        </g>
        
        {/* Connection line between shadow and higher self */}
        {higherSelfCoord && (
          <line
            x1={shadowCoord.x}
            y1={shadowCoord.y}
            x2={higherSelfCoord.x}
            y2={higherSelfCoord.y}
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            strokeDasharray="3,2"
            opacity="0.6"
          />
        )}
      </svg>

      {/* Axis Labels */}
      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">
        ↑ SOVEREIGNTY
      </span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">
        ↓ INTIMACY
      </span>
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium writing-mode-vertical">
        ← MEMORY
      </span>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium writing-mode-vertical">
        NOVELTY →
      </span>

      {/* Quadrant Labels */}
      <span className="absolute top-6 right-3 text-[9px] text-muted-foreground/70">SN</span>
      <span className="absolute top-6 left-3 text-[9px] text-muted-foreground/70">SM</span>
      <span className="absolute bottom-6 left-3 text-[9px] text-muted-foreground/70">IM</span>
      <span className="absolute bottom-6 right-3 text-[9px] text-muted-foreground/70">IN</span>

      {/* Legend */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-foreground" /> Shadow
        </span>
        {higherSelfPosition && (
          <span className="flex items-center gap-1">
            <span className="text-primary">★</span> Higher Self
          </span>
        )}
      </div>
    </div>
  );
};

export default TrajectoryVisualization;
