import React from 'react';

interface TorusMarkerProps {
  cx: number;
  cy: number;
  size?: number;
  type: 'shadow' | 'higherSelf' | 'inferred';
  animated?: boolean;
  variant?: 'solid' | 'outline';
  label?: string;
}

/**
 * TorusMarker - Renders a torus/donut manifold shape in SVG
 * Represents Shadow (where we are) and Higher Self (prophesied destination)
 * as manifold shapes emanating from the quadrant space
 */
export const TorusMarker: React.FC<TorusMarkerProps> = ({
  cx,
  cy,
  size = 8,
  type,
  animated = true,
  variant = 'solid',
  label,
}) => {
  const isShadow = type === 'shadow';
  const isInferred = type === 'inferred';
  const isOutline = variant === 'outline';
  
  // Torus dimensions
  const outerRx = size;
  const outerRy = size * 0.4; // Flattened perspective
  const innerRx = size * 0.4;
  const innerRy = size * 0.15;
  
  // Color based on type
  let primaryColor: string;
  let glowColor: string;
  let innerGlow: string;
  
  if (isInferred) {
    primaryColor = 'hsl(var(--chart-2))'; // Distinct color for inferred
    glowColor = 'hsl(var(--chart-2) / 0.3)';
    innerGlow = 'hsl(var(--chart-2) / 0.5)';
  } else if (isShadow) {
    primaryColor = 'hsl(var(--foreground))';
    glowColor = 'hsl(var(--foreground) / 0.3)';
    innerGlow = 'hsl(var(--foreground) / 0.6)';
  } else {
    primaryColor = 'hsl(var(--primary))';
    glowColor = 'hsl(var(--primary) / 0.4)';
    innerGlow = 'hsl(var(--primary) / 0.7)';
  }
  
  // Outline variant uses lower opacity
  const fillOpacity = isOutline ? 0.2 : 1;
  
  const uniqueId = `torus-${type}-${cx}-${cy}`;
  
  // Animation class based on type
  const animationClass = animated 
    ? (isInferred ? '' : (isShadow ? 'animate-torus-breathe' : 'animate-torus-pulse')) 
    : '';
  
  // Display label
  const displayLabel = label || (isShadow ? 'shadow' : isInferred ? 'inferred' : 'higher self');

  return (
    <g className={animationClass} style={{ opacity: isOutline ? 0.6 : 1 }}>
      {/* Glow effect */}
      <defs>
        <radialGradient id={`${uniqueId}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity={isOutline ? 0.4 : 0.8} />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uniqueId}-surface`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.9" />
          <stop offset="50%" stopColor={primaryColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id={`${uniqueId}-inner`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      
      {/* Outer glow */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={outerRx + 4}
        ry={outerRy + 2}
        fill={`url(#${uniqueId}-glow)`}
      />
      
      {/* Bottom half of torus (back) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={outerRx}
        ry={outerRy}
        fill={`url(#${uniqueId}-surface)`}
        stroke={primaryColor}
        strokeWidth="0.5"
      />
      
      {/* Inner hole (creates donut shape) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={innerRx}
        ry={innerRy}
        fill={`url(#${uniqueId}-inner)`}
        stroke={primaryColor}
        strokeWidth="0.3"
        strokeOpacity="0.6"
      />
      
      {/* Top highlight ring */}
      <ellipse
        cx={cx}
        cy={cy - outerRy * 0.3}
        rx={outerRx * 0.85}
        ry={outerRy * 0.3}
        fill="none"
        stroke={primaryColor}
        strokeWidth="0.8"
        strokeOpacity="0.7"
      />
      
      {/* Flow lines (a, b, c loops like the reference image) */}
      {/* Meridian loop */}
      <path
        d={`M ${cx - outerRx * 0.5} ${cy} 
            Q ${cx - outerRx * 0.5} ${cy - outerRy * 1.5} ${cx} ${cy - outerRy * 0.8}
            Q ${cx + outerRx * 0.5} ${cy - outerRy * 1.5} ${cx + outerRx * 0.5} ${cy}`}
        fill="none"
        stroke={innerGlow}
        strokeWidth="0.5"
        strokeDasharray="1,1"
      />
      
      {/* Longitudinal loop hint */}
      <path
        d={`M ${cx} ${cy - outerRy} 
            C ${cx + outerRx * 0.3} ${cy - outerRy * 0.5} ${cx + outerRx * 0.3} ${cy + outerRy * 0.5} ${cx} ${cy + outerRy}`}
        fill="none"
        stroke={innerGlow}
        strokeWidth="0.4"
        strokeDasharray="1,1.5"
        strokeOpacity="0.5"
      />
      
      {/* Center energy point */}
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.12}
        fill={primaryColor}
        fillOpacity="0.8"
      />
      
      {/* Label below */}
      <text
        x={cx}
        y={cy + outerRy + 4}
        textAnchor="middle"
        fontSize="3"
        fill={primaryColor}
        fillOpacity="0.7"
        className="font-medium"
      >
        {displayLabel}
      </text>
    </g>
  );
};

export default TorusMarker;
