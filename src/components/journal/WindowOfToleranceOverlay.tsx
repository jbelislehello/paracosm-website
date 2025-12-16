import React from 'react';
import { 
  getCycleExpansionZone, 
  CycleNumber 
} from '@/types/journal-expansion';
import { 
  RING_DEFINITIONS, 
  RING_PHILOSOPHY,
  RingLevel 
} from '@/utils/ringToleranceSystem';

interface WindowOfToleranceOverlayProps {
  cycleNumber?: CycleNumber;
  currentTile?: { row: number; col: number };
  onZoneChange?: (zone: 'safe' | 'stretch' | 'edge' | 'unexplored') => void;
}

export const WindowOfToleranceOverlay: React.FC<WindowOfToleranceOverlayProps> = ({
  cycleNumber = 1,
  currentTile,
  onZoneChange
}) => {
  const gridSize = 8;
  const cellSize = 100 / gridSize;
  const center = 50;

  const cycles: CycleNumber[] = [1, 2, 3, 4];
  
  const currentZone = currentTile 
    ? getCycleExpansionZone(currentTile.row, currentTile.col, cycleNumber)
    : 'safe';

  React.useEffect(() => {
    if (currentTile && onZoneChange) {
      onZoneChange(currentZone);
    }
  }, [currentTile, currentZone, onZoneChange]);

  // Map cycle to ring for philosophy access
  const cycleToRing = (cycle: CycleNumber): RingLevel => {
    switch (cycle) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 3;
      case 4: return 4;
    }
  };

  // Get ring colors from RING_DEFINITIONS
  const getRingColor = (cycle: CycleNumber) => {
    const ring = cycleToRing(cycle);
    const ringDef = RING_DEFINITIONS.find(r => r.ring === ring);
    return ringDef?.color || 'hsl(215 16% 47%)';
  };

  const getZoneColor = (cycle: CycleNumber, isCurrentCycle: boolean) => {
    if (cycle > cycleNumber) return 'hsl(var(--muted) / 0.05)';
    
    const baseOpacity = isCurrentCycle ? 0.25 : 0.15;
    const ringDef = RING_DEFINITIONS.find(r => r.ring === cycleToRing(cycle));
    if (!ringDef) return `hsl(var(--muted) / ${baseOpacity})`;
    
    // Extract HSL components and apply opacity - more visible fills
    return ringDef.color.replace(')', ` / ${baseOpacity})`).replace('hsl(', 'hsla(');
  };

  const getZoneBorderColor = (cycle: CycleNumber) => {
    if (cycle > cycleNumber) return 'hsl(var(--muted-foreground) / 0.15)';
    
    const ringDef = RING_DEFINITIONS.find(r => r.ring === cycleToRing(cycle));
    if (!ringDef) return 'hsl(var(--muted-foreground) / 0.3)';
    
    // More prominent borders
    const opacity = cycle === cycleNumber ? 0.9 : 0.6;
    return ringDef.color.replace(')', ` / ${opacity})`).replace('hsl(', 'hsla(');
  };

  const getRingLabel = (cycle: CycleNumber) => {
    const ring = cycleToRing(cycle);
    const ringDef = RING_DEFINITIONS.find(r => r.ring === ring);
    return ringDef?.icon || `R${ring}`;
  };

  const getPhilosophy = (cycle: CycleNumber) => {
    const ring = cycleToRing(cycle);
    const philosophy = RING_PHILOSOPHY[ring];
    if (cycle > cycleNumber) return philosophy.locked;
    if (cycle === cycleNumber) return philosophy.invitation;
    return philosophy.secure;
  };

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Breathing glow filters for each ring */}
        {cycles.map(cycle => {
          const ringDef = RING_DEFINITIONS.find(r => r.ring === cycleToRing(cycle));
          if (!ringDef) return null;
          return (
            <filter key={`glow-${cycle}`} id={`glow-filter-${cycle}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={cycle <= cycleNumber ? "2" : "0.5"} result="blur" />
              <feFlood floodColor={ringDef.color} floodOpacity={cycle <= cycleNumber ? "0.4" : "0.1"} />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          );
        })}
      </defs>

      {/* Draw cycles from outer to inner (4 to 1) */}
      {[...cycles].reverse().map((cycle) => {
        const size = cycle * cellSize * 2;
        const isCurrentCycle = cycle === cycleNumber;
        const isUnlocked = cycle <= cycleNumber;
        const isNextRing = cycle === cycleNumber + 1;

        return (
          <g key={cycle}>
            {/* Filled background with gradient */}
            <rect
              x={center - size / 2}
              y={center - size / 2}
              width={size}
              height={size}
              fill={getZoneColor(cycle, isCurrentCycle)}
              rx="1"
              className={isCurrentCycle ? 'animate-ring-breathe' : ''}
            />
            
            {/* Ring border with glow - more prominent */}
            <rect
              x={center - size / 2}
              y={center - size / 2}
              width={size}
              height={size}
              fill="none"
              stroke={getZoneBorderColor(cycle)}
              strokeWidth={isCurrentCycle ? 1.2 : 0.7}
              strokeDasharray={isUnlocked ? 'none' : '2,2'}
              rx="1"
              filter={isUnlocked ? `url(#glow-filter-${cycle})` : undefined}
              className={isCurrentCycle ? 'animate-ring-breathe' : isNextRing ? 'animate-invitation-pulse' : ''}
            />
            
            {/* Ring label on right side */}
            {isUnlocked && (
              <text
                x={center + size / 2 + 2}
                y={center - size / 2 + 3}
                fontSize="2"
                fill={getRingColor(cycle)}
                opacity="0.8"
                fontWeight="500"
              >
                {RING_DEFINITIONS.find(r => r.ring === cycleToRing(cycle))?.name || ''}
              </text>
            )}
            
            {/* Ring icon and label in corner */}
            <g transform={`translate(${center - size / 2 + 1.5}, ${center - size / 2 + 1.5})`}>
              <circle
                r="2.5"
                cx="2.5"
                cy="2.5"
                fill={isUnlocked ? getRingColor(cycle) : 'transparent'}
                stroke={getRingColor(cycle)}
                strokeWidth="0.3"
                opacity={isCurrentCycle ? 1 : isUnlocked ? 0.8 : 0.4}
              />
              <text
                x="2.5"
                y="3.3"
                textAnchor="middle"
                fontSize="2.5"
                fill={isUnlocked ? 'white' : getRingColor(cycle)}
                opacity={isCurrentCycle ? 1 : isUnlocked ? 0.8 : 0.4}
              >
                {getRingLabel(cycle)}
              </text>
            </g>
          </g>
        );
      })}

      {/* Diagonal fan lines from corners - subtle invitation paths */}
      <g opacity="0.15">
        <line x1="0" y1="0" x2={center} y2={center} stroke="hsl(280 70% 50%)" strokeWidth="0.2" />
        <line x1="100" y1="0" x2={center} y2={center} stroke="hsl(280 70% 50%)" strokeWidth="0.2" />
        <line x1="0" y1="100" x2={center} y2={center} stroke="hsl(280 70% 50%)" strokeWidth="0.2" />
        <line x1="100" y1="100" x2={center} y2={center} stroke="hsl(280 70% 50%)" strokeWidth="0.2" />
      </g>

      {/* Current position indicator with enhanced glow */}
      {currentTile && (
        <g>
          {/* Outer glow ring */}
          <circle
            cx={(currentTile.col + 0.5) * cellSize}
            cy={(7 - currentTile.row + 0.5) * cellSize}
            r="2.5"
            fill="none"
            stroke={getRingColor(cycleNumber)}
            strokeWidth="0.3"
            opacity="0.5"
            className="animate-ring-pulse"
          />
          {/* Inner marker */}
          <circle
            cx={(currentTile.col + 0.5) * cellSize}
            cy={(7 - currentTile.row + 0.5) * cellSize}
            r="1.5"
            fill="white"
            stroke={getRingColor(cycleNumber)}
            strokeWidth="0.5"
            className="animate-pulse"
          />
        </g>
      )}

      {/* Center marker - the origin of security */}
      <circle
        cx={center}
        cy={center}
        r="1.2"
        fill="hsl(142 71% 45%)"
        opacity="0.6"
        className="animate-ring-breathe"
      />

      {/* Philosophy message for current zone */}
      {currentTile && (
        <text
          x="5"
          y="96"
          fontSize="1.8"
          fill={getRingColor(cycleNumber)}
          opacity="0.9"
          fontWeight="500"
        >
          {getPhilosophy(cycleNumber)}
        </text>
      )}
    </svg>
  );
};

export default WindowOfToleranceOverlay;
