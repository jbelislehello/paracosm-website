import React from "react";

interface GraphPaperProps {
  id?: string;
  warm?: boolean;
  /** include hand-ink filter definition */
  withInk?: boolean;
  className?: string;
  children?: React.ReactNode;
  viewBox?: string;
}

/**
 * SVG graph-paper backdrop with optional hand-ink filter.
 * Use as a wrapper inside any <svg>.
 */
export const GraphPaperDefs: React.FC<{ id?: string; withInk?: boolean }> = ({
  id = "gp",
  withInk = true,
}) => (
  <defs>
    <pattern
      id={`${id}-grid-fine`}
      width="8"
      height="8"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M 8 0 L 0 0 0 8"
        fill="none"
        stroke="hsl(var(--ink-indigo) / 0.08)"
        strokeWidth="0.5"
      />
    </pattern>
    <pattern
      id={`${id}-grid-bold`}
      width="40"
      height="40"
      patternUnits="userSpaceOnUse"
    >
      <rect width="40" height="40" fill={`url(#${id}-grid-fine)`} />
      <path
        d="M 40 0 L 0 0 0 40"
        fill="none"
        stroke="hsl(var(--ink-indigo) / 0.16)"
        strokeWidth="0.6"
      />
    </pattern>
    {withInk && (
      <filter id={`${id}-ink`} x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
        <feDisplacementMap in="SourceGraphic" scale="0.6" />
      </filter>
    )}
  </defs>
);

export const GraphPaper: React.FC<GraphPaperProps> = ({
  id = "gp",
  warm = true,
  withInk = true,
  className = "",
  children,
  viewBox = "0 0 400 300",
}) => (
  <svg viewBox={viewBox} className={className} xmlns="http://www.w3.org/2000/svg">
    <GraphPaperDefs id={id} withInk={withInk} />
    <rect
      width="100%"
      height="100%"
      fill={warm ? "hsl(var(--paper))" : "hsl(0 0% 100%)"}
    />
    <rect width="100%" height="100%" fill={`url(#${id}-grid-bold)`} />
    {children}
  </svg>
);
