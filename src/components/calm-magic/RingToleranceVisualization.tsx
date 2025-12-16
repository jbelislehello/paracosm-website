import React from 'react';
import { RING_DEFINITIONS, RingLevel, RingState } from '@/utils/ringToleranceSystem';

interface RingToleranceVisualizationProps {
  ringStates: RingState[];
  currentUnlockedRing: RingLevel;
  totalSize: number;
  tileSize: number;
  gap: number;
}

// Philosophical messaging for each ring
export const RING_PHILOSOPHY = {
  1: {
    secure: "Your foundation is secure",
    invitation: "Ground yourself in familiar patterns",
    locked: "Begin your journey here"
  },
  2: {
    secure: "Curiosity extends your reach",
    invitation: "Stretch into new territory",
    locked: "Expand your inner core to reach here"
  },
  3: {
    secure: "Courage lives at the edge",
    invitation: "Growth awaits at boundaries",
    locked: "Master the stretch zone first"
  },
  4: {
    secure: "Integration anchors transcendence",
    invitation: "The corners anchor infinite possibility",
    locked: "Explore the edges to unlock integration"
  }
};

export const RingToleranceVisualization: React.FC<RingToleranceVisualizationProps> = ({
  ringStates,
  currentUnlockedRing,
  totalSize,
  tileSize,
  gap
}) => {
  // Calculate ring insets (pixels from edge)
  const ringInsets = {
    1: 2 * (tileSize + gap), // Inner core starts 2 tiles in
    2: 1 * (tileSize + gap), // Stretch zone starts 1 tile in
    3: 0,                     // Edge zone is at boundary
    4: 0                      // Integrators are at corners
  };

  const getPhilosophy = (ring: RingLevel, state: RingState) => {
    const messages = RING_PHILOSOPHY[ring];
    if (state.patternDetected || state.status === 'unlocked') return messages.secure;
    if (state.status === 'in-progress') return messages.invitation;
    return messages.locked;
  };

  return (
    <svg 
      className="absolute inset-0 pointer-events-none overflow-visible"
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
    >
      <defs>
        {/* Breathing animation filter */}
        <filter id="ring-glow-1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="hsl(142 71% 45%)" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <filter id="ring-glow-2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="hsl(217 91% 60%)" floodOpacity="0.5" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <filter id="ring-glow-3" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feFlood floodColor="hsl(38 92% 50%)" floodOpacity="0.4" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <filter id="ring-glow-4" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feFlood floodColor="hsl(280 70% 50%)" floodOpacity="0.5" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial gradients for each ring */}
        <radialGradient id="ring-gradient-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity="0.3" />
          <stop offset="70%" stopColor="hsl(142 71% 45%)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity="0" />
        </radialGradient>
        
        <radialGradient id="ring-gradient-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.25" />
          <stop offset="70%" stopColor="hsl(217 91% 60%)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
        </radialGradient>
        
        <radialGradient id="ring-gradient-3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity="0.2" />
          <stop offset="70%" stopColor="hsl(38 92% 50%)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ring 3 - Edge Zone (amber) - Outermost */}
      {renderRing(3, ringStates, currentUnlockedRing, totalSize, ringInsets[3])}
      
      {/* Ring 2 - Stretch Zone (blue) */}
      {renderRing(2, ringStates, currentUnlockedRing, totalSize, ringInsets[2])}
      
      {/* Ring 1 - Inner Core (green) - Innermost */}
      {renderRing(1, ringStates, currentUnlockedRing, totalSize, ringInsets[1])}
      
      {/* Ring 4 - Integrators (purple corners) */}
      {renderCornerIntegrators(ringStates, currentUnlockedRing, totalSize, tileSize)}
      
      {/* Invitation pulses for next unlockable ring */}
      {renderInvitationPulses(currentUnlockedRing, totalSize, ringInsets, tileSize, gap)}
    </svg>
  );
};

// Render a single ring with glow and breathing effects
function renderRing(
  ring: RingLevel,
  ringStates: RingState[],
  currentUnlockedRing: RingLevel,
  totalSize: number,
  inset: number
) {
  const state = ringStates.find(s => s.ring === ring);
  const ringDef = RING_DEFINITIONS.find(r => r.ring === ring);
  if (!state || !ringDef) return null;

  const size = totalSize - 2 * inset;
  const isUnlocked = state.patternDetected || state.status === 'unlocked';
  const isInProgress = state.status === 'in-progress';
  const isLocked = state.status === 'locked';
  
  // Calculate opacity based on state
  const baseOpacity = isUnlocked ? 0.9 : isInProgress ? 0.6 : 0.25;
  const strokeWidth = isUnlocked ? 3 : isInProgress ? 2.5 : 1.5;
  
  return (
    <g key={`ring-${ring}`}>
      {/* Fill gradient for unlocked rings */}
      {(isUnlocked || isInProgress) && (
        <rect
          x={inset}
          y={inset}
          width={size}
          height={size}
          fill={`url(#ring-gradient-${ring})`}
          className={isUnlocked ? 'animate-ring-breathe' : ''}
        />
      )}
      
      {/* Main ring border with glow */}
      <rect
        x={inset}
        y={inset}
        width={size}
        height={size}
        fill="none"
        stroke={ringDef.color}
        strokeWidth={strokeWidth}
        strokeDasharray={isLocked ? '6,4' : isInProgress ? '10,5' : 'none'}
        opacity={baseOpacity}
        filter={isUnlocked ? `url(#ring-glow-${ring})` : undefined}
        className={isUnlocked ? 'animate-ring-breathe' : isInProgress ? 'animate-ring-pulse' : ''}
        rx="4"
      />
      
      {/* Progress indicator arc */}
      {isInProgress && (
        <rect
          x={inset}
          y={inset}
          width={size * (state.progress / 100)}
          height={4}
          fill={ringDef.color}
          opacity={0.7}
          rx="2"
        />
      )}
      
      {/* Ring icon and label */}
      <g transform={`translate(${inset + 8}, ${inset + 8})`}>
        <circle
          r="10"
          cx="10"
          cy="10"
          fill={isUnlocked ? ringDef.color : 'transparent'}
          stroke={ringDef.color}
          strokeWidth="1.5"
          opacity={baseOpacity}
        />
        <text
          x="10"
          y="14"
          textAnchor="middle"
          fontSize="10"
          fill={isUnlocked ? 'white' : ringDef.color}
          opacity={baseOpacity}
        >
          {ringDef.icon}
        </text>
      </g>
    </g>
  );
}

// Render corner integrators with constellation effect
function renderCornerIntegrators(
  ringStates: RingState[],
  currentUnlockedRing: RingLevel,
  totalSize: number,
  tileSize: number
) {
  const state = ringStates.find(s => s.ring === 4);
  const ringDef = RING_DEFINITIONS.find(r => r.ring === 4);
  if (!state || !ringDef) return null;

  const isUnlocked = state.patternDetected || state.status === 'unlocked';
  const isInProgress = state.status === 'in-progress';
  const opacity = isUnlocked ? 0.9 : isInProgress ? 0.6 : 0.3;

  const corners = [
    { x: tileSize / 2, y: tileSize / 2 },
    { x: totalSize - tileSize / 2, y: tileSize / 2 },
    { x: tileSize / 2, y: totalSize - tileSize / 2 },
    { x: totalSize - tileSize / 2, y: totalSize - tileSize / 2 },
  ];

  return (
    <g>
      {/* Constellation lines connecting corners */}
      {(isUnlocked || isInProgress) && (
        <>
          <line
            x1={corners[0].x} y1={corners[0].y}
            x2={corners[3].x} y2={corners[3].y}
            stroke={ringDef.color}
            strokeWidth="1.5"
            strokeDasharray={isUnlocked ? 'none' : '4,4'}
            opacity={opacity * 0.6}
            className={isUnlocked ? 'animate-constellation-draw' : ''}
          />
          <line
            x1={corners[1].x} y1={corners[1].y}
            x2={corners[2].x} y2={corners[2].y}
            stroke={ringDef.color}
            strokeWidth="1.5"
            strokeDasharray={isUnlocked ? 'none' : '4,4'}
            opacity={opacity * 0.6}
            className={isUnlocked ? 'animate-constellation-draw' : ''}
          />
        </>
      )}
      
      {/* Corner circles */}
      {corners.map((pos, idx) => (
        <g key={`integrator-${idx}`}>
          {/* Outer glow ring */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r={tileSize / 2 + 8}
            fill="none"
            stroke={ringDef.color}
            strokeWidth="2"
            strokeDasharray={isUnlocked ? 'none' : '4,3'}
            opacity={opacity * 0.5}
            filter={isUnlocked ? 'url(#ring-glow-4)' : undefined}
            className={isUnlocked ? 'animate-ring-breathe' : isInProgress ? 'animate-ring-pulse' : ''}
          />
          
          {/* Star icon */}
          <text
            x={pos.x}
            y={pos.y + 4}
            textAnchor="middle"
            fontSize="14"
            fill={ringDef.color}
            opacity={opacity}
            className={isUnlocked ? 'animate-star-twinkle' : ''}
          >
            ✧
          </text>
        </g>
      ))}
    </g>
  );
}

// Render animated invitation pulses for the next ring
function renderInvitationPulses(
  currentUnlockedRing: RingLevel,
  totalSize: number,
  ringInsets: Record<number, number>,
  tileSize: number,
  gap: number
) {
  const nextRing = Math.min(currentUnlockedRing + 1, 4) as RingLevel;
  if (nextRing === currentUnlockedRing) return null; // All unlocked
  
  const ringDef = RING_DEFINITIONS.find(r => r.ring === nextRing);
  if (!ringDef) return null;

  if (nextRing === 4) {
    // Pulse from center toward corners
    const corners = [
      { x: tileSize / 2, y: tileSize / 2 },
      { x: totalSize - tileSize / 2, y: tileSize / 2 },
      { x: tileSize / 2, y: totalSize - tileSize / 2 },
      { x: totalSize - tileSize / 2, y: totalSize - tileSize / 2 },
    ];
    
    return (
      <g>
        {corners.map((pos, idx) => (
          <circle
            key={`pulse-corner-${idx}`}
            cx={pos.x}
            cy={pos.y}
            r={tileSize / 2 + 4}
            fill="none"
            stroke={ringDef.color}
            strokeWidth="2"
            opacity="0"
            className="animate-invitation-pulse"
            style={{ animationDelay: `${idx * 0.3}s` }}
          />
        ))}
      </g>
    );
  }
  
  // Rectangular pulse for rings 1-3
  const inset = ringInsets[nextRing];
  const size = totalSize - 2 * inset;
  
  return (
    <g>
      {/* Multiple concentric pulse waves */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`pulse-${i}`}
          x={inset - 4 - i * 4}
          y={inset - 4 - i * 4}
          width={size + 8 + i * 8}
          height={size + 8 + i * 8}
          fill="none"
          stroke={ringDef.color}
          strokeWidth="1.5"
          opacity="0"
          rx="6"
          className="animate-invitation-pulse"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </g>
  );
}

export default RingToleranceVisualization;
