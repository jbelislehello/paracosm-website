import React from "react";

interface FrenetFrameProps {
  /** point on the curve */
  x: number;
  y: number;
  /** unit tangent direction (radians) */
  angle: number;
  scale?: number;
  /** when true, scale and opacity are boosted to highlight the frame */
  emphasis?: boolean;
}

/**
 * Tangent (T, indigo), Normal (N, red), Binormal (B, green) — projected to 2D.
 * Binormal is shown as a small dot to suggest "out of page."
 */
export const FrenetFrame: React.FC<FrenetFrameProps> = ({
  x,
  y,
  angle,
  scale = 22,
  emphasis = false,
}) => {
  const s = emphasis ? scale * 1.4 : scale;
  const tx = Math.cos(angle) * s;
  const ty = Math.sin(angle) * s;
  const nx = -Math.sin(angle) * s * 0.85;
  const ny = Math.cos(angle) * s * 0.85;
  const op = emphasis ? 1 : 0.85;
  const sw = emphasis ? 2 : 1.4;

  return (
    <g style={{ pointerEvents: "none", opacity: op, transition: "opacity 220ms ease-out" }}>
      {/* Tangent */}
      <line
        x1={x}
        y1={y}
        x2={x + tx}
        y2={y + ty}
        stroke="hsl(var(--ink-indigo))"
        strokeWidth={sw}
        markerEnd="url(#frenet-arrow-indigo)"
      />
      <text
        x={x + tx + 3}
        y={y + ty + 3}
        fontSize="9"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fill="hsl(var(--ink-indigo))"
      >
        T
      </text>
      {/* Normal */}
      <line
        x1={x}
        y1={y}
        x2={x + nx}
        y2={y + ny}
        stroke="hsl(var(--ink-red))"
        strokeWidth={sw}
        markerEnd="url(#frenet-arrow-red)"
      />
      <text
        x={x + nx + 3}
        y={y + ny - 2}
        fontSize="9"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fill="hsl(var(--ink-red))"
      >
        N
      </text>
      {/* Binormal */}
      <circle
        cx={x}
        cy={y}
        r="3"
        fill="none"
        stroke="hsl(var(--ink-green))"
        strokeWidth="1"
      />
      <circle cx={x} cy={y} r="1" fill="hsl(var(--ink-green))" />
    </g>
  );
};

export const FrenetMarkers: React.FC = () => (
  <defs>
    <marker
      id="frenet-arrow-indigo"
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="5"
      markerHeight="5"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--ink-indigo))" />
    </marker>
    <marker
      id="frenet-arrow-red"
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="5"
      markerHeight="5"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--ink-red))" />
    </marker>
  </defs>
);
