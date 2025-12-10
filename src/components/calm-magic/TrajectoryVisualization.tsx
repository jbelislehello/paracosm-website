import React, { useMemo, useState, useEffect, useRef } from 'react';
import { QuadrantPosition, TrajectoryEvent } from '@/types/trajectory';

interface TrajectoryVisualizationProps {
  shadowPosition: QuadrantPosition;
  higherSelfPosition: QuadrantPosition | null;
  trajectoryLog: TrajectoryEvent[];
  onQuadrantClick?: (position: QuadrantPosition) => void;
  interactive?: boolean;
}

// Explicit colors for quadrants (HSL values)
const QUADRANT_COLORS = {
  SN: { bg: 'hsla(346, 77%, 49%, 0.15)', border: 'hsla(346, 77%, 49%, 0.4)' }, // Rose
  SM: { bg: 'hsla(270, 60%, 50%, 0.15)', border: 'hsla(270, 60%, 50%, 0.4)' }, // Purple
  IM: { bg: 'hsla(210, 70%, 50%, 0.15)', border: 'hsla(210, 70%, 50%, 0.4)' }, // Blue
  IN: { bg: 'hsla(142, 71%, 45%, 0.15)', border: 'hsla(142, 71%, 45%, 0.4)' }, // Green
};

export const TrajectoryVisualization: React.FC<TrajectoryVisualizationProps> = ({
  shadowPosition,
  higherSelfPosition,
  trajectoryLog,
  onQuadrantClick,
  interactive = false,
}) => {
  const [previousCoord, setPreviousCoord] = useState<{ x: number; y: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationKeyRef = useRef(0);

  // Convert position (-1 to 1) to SVG coordinates (0 to 100)
  const toSvgCoord = (pos: QuadrantPosition) => ({
    x: 50 + pos.x * 40,
    y: 50 - pos.y * 40, // Invert Y for SVG
  });

  const shadowCoord = toSvgCoord(shadowPosition);
  const higherSelfCoord = higherSelfPosition ? toSvgCoord(higherSelfPosition) : null;

  // Track position changes for animation
  useEffect(() => {
    if (previousCoord && (previousCoord.x !== shadowCoord.x || previousCoord.y !== shadowCoord.y)) {
      setIsAnimating(true);
      animationKeyRef.current += 1;
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPreviousCoord(shadowCoord);
      }, 600);
      
      return () => clearTimeout(timer);
    } else if (!previousCoord) {
      setPreviousCoord(shadowCoord);
    }
  }, [shadowCoord.x, shadowCoord.y]);

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

  // Calculate path length for animation
  const getPathLength = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  return (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto">
      <svg 
        viewBox="0 0 100 100" 
        className={`absolute inset-0 w-full h-full ${interactive ? 'cursor-crosshair' : ''}`}
        onClick={handleClick}
      >
        {/* Quadrant backgrounds */}
        <rect x="50" y="0" width="50" height="50" fill={QUADRANT_COLORS.SN.bg} stroke={QUADRANT_COLORS.SN.border} strokeWidth="0.5" />
        <rect x="0" y="0" width="50" height="50" fill={QUADRANT_COLORS.SM.bg} stroke={QUADRANT_COLORS.SM.border} strokeWidth="0.5" />
        <rect x="0" y="50" width="50" height="50" fill={QUADRANT_COLORS.IM.bg} stroke={QUADRANT_COLORS.IM.border} strokeWidth="0.5" />
        <rect x="50" y="50" width="50" height="50" fill={QUADRANT_COLORS.IN.bg} stroke={QUADRANT_COLORS.IN.border} strokeWidth="0.5" />
        
        {/* Grid lines */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="0.8" strokeDasharray="2,2" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="0.8" strokeDasharray="2,2" />
        
        {/* Axis arrows */}
        <path d="M 50 8 L 48 12 L 52 12 Z" fill="hsl(var(--foreground) / 0.6)" />
        <path d="M 92 50 L 88 48 L 88 52 Z" fill="hsl(var(--foreground) / 0.6)" />
        
        {/* Historical trajectory path */}
        {trajectoryPath && (
          <path
            d={trajectoryPath}
            fill="none"
            stroke="hsl(var(--foreground) / 0.3)"
            strokeWidth="1"
            strokeDasharray="3,2"
          />
        )}

        {/* Animated movement line */}
        {isAnimating && previousCoord && (
          <line
            key={`anim-${animationKeyRef.current}`}
            x1={previousCoord.x}
            y1={previousCoord.y}
            x2={shadowCoord.x}
            y2={shadowCoord.y}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={getPathLength(previousCoord.x, previousCoord.y, shadowCoord.x, shadowCoord.y)}
            className="animate-draw-path"
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
              strokeWidth="1.5"
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
        
        {/* Shadow Self marker */}
        <g>
          {/* Pulse ring on animation */}
          {isAnimating && (
            <circle 
              key={`pulse-${animationKeyRef.current}`}
              cx={shadowCoord.x} 
              cy={shadowCoord.y} 
              r="5" 
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              className="animate-shadow-pulse"
            />
          )}
          <circle 
            cx={shadowCoord.x} 
            cy={shadowCoord.y} 
            r="5" 
            fill="hsl(var(--foreground))"
            className="transition-all duration-500 ease-out"
          />
          <circle 
            cx={shadowCoord.x} 
            cy={shadowCoord.y} 
            r="7" 
            fill="none"
            stroke="hsl(var(--foreground) / 0.4)"
            strokeWidth="1"
            className="transition-all duration-500 ease-out"
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
            strokeWidth="0.8"
            strokeDasharray="3,2"
            opacity="0.7"
          />
        )}
      </svg>

      {/* Axis Labels with background for readability */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-background/80 text-[10px] text-foreground font-semibold">
        ↑ SOVEREIGNTY
      </span>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-background/80 text-[10px] text-foreground font-semibold">
        ↓ INTIMACY
      </span>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-background/80 text-[10px] text-foreground font-semibold">
        ← MEM
      </span>
      <span className="absolute right-0 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-background/80 text-[10px] text-foreground font-semibold">
        NOV →
      </span>

      {/* Quadrant Labels */}
      <span className="absolute top-7 right-4 px-1.5 py-0.5 rounded text-[9px] font-bold bg-background/70 text-foreground">SN</span>
      <span className="absolute top-7 left-4 px-1.5 py-0.5 rounded text-[9px] font-bold bg-background/70 text-foreground">SM</span>
      <span className="absolute bottom-7 left-4 px-1.5 py-0.5 rounded text-[9px] font-bold bg-background/70 text-foreground">IM</span>
      <span className="absolute bottom-7 right-4 px-1.5 py-0.5 rounded text-[9px] font-bold bg-background/70 text-foreground">IN</span>

      {/* Legend */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-4 text-[10px]">
        <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-foreground" /> Shadow
        </span>
        {higherSelfPosition && (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-foreground">
            <span className="text-primary text-sm">★</span> Higher Self
          </span>
        )}
      </div>
    </div>
  );
};

export default TrajectoryVisualization;
