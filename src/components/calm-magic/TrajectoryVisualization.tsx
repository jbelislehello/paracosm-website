import React, { useMemo, useState, useEffect, useRef } from 'react';
import { QuadrantPosition, TrajectoryEvent } from '@/types/trajectory';
import { TorusMarker } from './TorusMarker';

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

// Ring colors matching RING_DEFINITIONS from ringToleranceSystem.ts
const RING_COLORS = {
  1: { stroke: 'hsla(142, 71%, 45%, 0.6)', fill: 'hsla(142, 71%, 45%, 0.08)', label: 'Inner Core' },    // Green
  2: { stroke: 'hsla(217, 91%, 60%, 0.6)', fill: 'hsla(217, 91%, 60%, 0.08)', label: 'Stretch' },       // Blue
  3: { stroke: 'hsla(38, 92%, 50%, 0.6)', fill: 'hsla(38, 92%, 50%, 0.08)', label: 'Edge' },            // Amber
  4: { stroke: 'hsla(280, 70%, 50%, 0.6)', fill: 'hsla(280, 70%, 50%, 0.08)', label: 'Integrator' },    // Purple
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

  // Build spiral connection path between shadow and higher self
  const spiralPath = useMemo(() => {
    if (!higherSelfCoord) return null;
    
    const dx = higherSelfCoord.x - shadowCoord.x;
    const dy = higherSelfCoord.y - shadowCoord.y;
    const midX = (shadowCoord.x + higherSelfCoord.x) / 2;
    const midY = (shadowCoord.y + higherSelfCoord.y) / 2;
    
    // Control points for a subtle S-curve
    const cp1x = shadowCoord.x + dx * 0.3 - dy * 0.2;
    const cp1y = shadowCoord.y + dy * 0.3 + dx * 0.2;
    const cp2x = higherSelfCoord.x - dx * 0.3 + dy * 0.2;
    const cp2y = higherSelfCoord.y - dy * 0.3 - dx * 0.2;
    
    return `M ${shadowCoord.x} ${shadowCoord.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${higherSelfCoord.x} ${higherSelfCoord.y}`;
  }, [shadowCoord, higherSelfCoord]);

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
        <defs>
          {/* Gradients for ring fills */}
          <radialGradient id="ring1-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsla(142, 71%, 45%, 0.15)" />
            <stop offset="100%" stopColor="hsla(142, 71%, 45%, 0.03)" />
          </radialGradient>
          <radialGradient id="ring2-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsla(217, 91%, 60%, 0.12)" />
            <stop offset="100%" stopColor="hsla(217, 91%, 60%, 0.02)" />
          </radialGradient>
          <radialGradient id="ring3-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsla(38, 92%, 50%, 0.10)" />
            <stop offset="100%" stopColor="hsla(38, 92%, 50%, 0.02)" />
          </radialGradient>
          <radialGradient id="ring4-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsla(280, 70%, 50%, 0.08)" />
            <stop offset="100%" stopColor="hsla(280, 70%, 50%, 0.01)" />
          </radialGradient>
        </defs>

        {/* Expansion Ring Overlays - from outer to inner */}
        {[4, 3, 2, 1].map((ring) => {
          const ringConfig = RING_COLORS[ring as keyof typeof RING_COLORS];
          // Ring sizes: 1=25%, 2=50%, 3=75%, 4=100%
          const size = ring * 22;
          const offset = (100 - size) / 2;
          
          return (
            <g key={ring} className="animate-ring-breathe" style={{ animationDelay: `${ring * 0.2}s` }}>
              <rect
                x={offset}
                y={offset}
                width={size}
                height={size}
                fill={`url(#ring${ring}-gradient)`}
                stroke={ringConfig.stroke}
                strokeWidth={ring === 1 ? 1.5 : 0.8}
                strokeDasharray={ring === 1 ? 'none' : '4,2'}
                rx="3"
              />
            </g>
          );
        })}
        
        {/* Quadrant backgrounds (semi-transparent over rings) */}
        <rect x="50" y="0" width="50" height="50" fill={QUADRANT_COLORS.SN.bg} stroke={QUADRANT_COLORS.SN.border} strokeWidth="0.3" />
        <rect x="0" y="0" width="50" height="50" fill={QUADRANT_COLORS.SM.bg} stroke={QUADRANT_COLORS.SM.border} strokeWidth="0.3" />
        <rect x="0" y="50" width="50" height="50" fill={QUADRANT_COLORS.IM.bg} stroke={QUADRANT_COLORS.IM.border} strokeWidth="0.3" />
        <rect x="50" y="50" width="50" height="50" fill={QUADRANT_COLORS.IN.bg} stroke={QUADRANT_COLORS.IN.border} strokeWidth="0.3" />
        
        {/* Grid lines */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="hsl(var(--foreground) / 0.15)" strokeWidth="0.8" strokeDasharray="2,2" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="hsl(var(--foreground) / 0.15)" strokeWidth="0.8" strokeDasharray="2,2" />
        
        {/* Axis arrows */}
        <path d="M 50 8 L 48 12 L 52 12 Z" fill="hsl(var(--foreground) / 0.5)" />
        <path d="M 92 50 L 88 48 L 88 52 Z" fill="hsl(var(--foreground) / 0.5)" />
        
        {/* Historical trajectory path */}
        {trajectoryPath && (
          <path
            d={trajectoryPath}
            fill="none"
            stroke="hsl(var(--foreground) / 0.25)"
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
        
        {/* Spiral connection between Shadow and Higher Self */}
        {spiralPath && (
          <path
            d={spiralPath}
            fill="none"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        )}
        
        {/* Higher Self Torus Manifold */}
        {higherSelfCoord && (
          <TorusMarker
            cx={higherSelfCoord.x}
            cy={higherSelfCoord.y}
            size={7}
            type="higherSelf"
            animated={true}
          />
        )}
        
        {/* Shadow Torus Manifold */}
        <g>
          {/* Pulse ring on animation */}
          {isAnimating && (
            <circle 
              key={`pulse-${animationKeyRef.current}`}
              cx={shadowCoord.x} 
              cy={shadowCoord.y} 
              r="10" 
              fill="none"
              stroke="hsl(var(--foreground) / 0.5)"
              strokeWidth="1"
              className="animate-shadow-pulse"
            />
          )}
          <TorusMarker
            cx={shadowCoord.x}
            cy={shadowCoord.y}
            size={6}
            type="shadow"
            animated={true}
          />
        </g>
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

      {/* Ring Legend */}
      <div className="absolute -bottom-14 left-0 right-0 flex flex-wrap justify-center gap-2 text-[8px]">
        {Object.entries(RING_COLORS).map(([ring, config]) => (
          <span 
            key={ring} 
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/80"
          >
            <span 
              className="w-2 h-2 rounded-sm" 
              style={{ backgroundColor: config.stroke.replace('0.6', '1') }}
            />
            <span className="text-muted-foreground">{config.label}</span>
          </span>
        ))}
      </div>

      {/* Manifold Legend */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-4 text-[10px]">
        <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-foreground">
          <span className="w-3 h-1.5 rounded-full bg-foreground opacity-80" /> Shadow
        </span>
        {higherSelfPosition && (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-foreground">
            <span className="w-3 h-1.5 rounded-full bg-primary opacity-80" /> Higher Self
          </span>
        )}
      </div>
    </div>
  );
};

export default TrajectoryVisualization;
