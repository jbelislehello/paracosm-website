import { useRef, useEffect, useState } from 'react';
import { MysteryZone as MysteryZoneType } from '@/hooks/useMysteryZones';
import { MysteryZone } from './MysteryZone';

interface MysteryZoneOverlayProps {
  zones: MysteryZoneType[];
  loadingZoneId: string | null;
  onRevealZone: (zoneId: string) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function MysteryZoneOverlay({ 
  zones, 
  loadingZoneId, 
  onRevealZone,
  containerRef 
}: MysteryZoneOverlayProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const overlayRef = useRef<SVGSVGElement>(null);

  // Track container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef?.current || overlayRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    const container = containerRef?.current || overlayRef.current?.parentElement;
    if (container) {
      resizeObserver.observe(container);
    }
    
    return () => resizeObserver.disconnect();
  }, [containerRef]);

  if (zones.length === 0 || dimensions.width === 0) {
    return null;
  }

  return (
    <svg
      ref={overlayRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Glow filter for mystery zones */}
        <filter id="mystery-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Pulse animation gradient */}
        <radialGradient id="pulse-gradient">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Render zones with pointer-events enabled */}
      <g className="pointer-events-auto">
        {zones.map(zone => (
          <MysteryZone
            key={zone.id}
            zone={zone}
            isLoading={loadingZoneId === zone.id}
            onReveal={() => onRevealZone(zone.id)}
          />
        ))}
      </g>
      
      {/* Legend in corner */}
      <g transform={`translate(${dimensions.width - 140}, ${dimensions.height - 50})`}>
        <rect
          x={0}
          y={0}
          width={130}
          height={40}
          rx={6}
          fill="hsl(var(--background))"
          opacity={0.85}
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />
        <text
          x={10}
          y={18}
          fontSize={10}
          fill="hsl(var(--muted-foreground))"
        >
          Mystery Zones
        </text>
        <text
          x={10}
          y={32}
          fontSize={10}
          fill="hsl(var(--foreground))"
        >
          {zones.filter(z => z.isRevealed).length} / {zones.length} revealed
        </text>
      </g>
    </svg>
  );
}
