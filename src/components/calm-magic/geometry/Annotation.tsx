import React from "react";

interface AnnotationProps {
  /** anchor point on the diagram */
  x: number;
  y: number;
  /** label position */
  lx: number;
  ly: number;
  label: string;
  sub?: string;
  align?: "start" | "end" | "middle";
  color?: string;
}

/**
 * Textbook-style leader-line callout: a small dot on the geometry,
 * a thin connector, and a serif label.
 */
export const Annotation: React.FC<AnnotationProps> = ({
  x,
  y,
  lx,
  ly,
  label,
  sub,
  align = "start",
  color = "hsl(var(--ink-indigo))",
}) => {
  return (
    <g style={{ pointerEvents: "none" }}>
      <circle cx={x} cy={y} r="2" fill={color} />
      <line
        x1={x}
        y1={y}
        x2={lx}
        y2={ly}
        stroke={color}
        strokeWidth="0.6"
        strokeDasharray="2 2"
        opacity="0.7"
      />
      <text
        x={lx}
        y={ly}
        fontSize="9"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fill={color}
        textAnchor={align}
      >
        {label}
      </text>
      {sub && (
        <text
          x={lx}
          y={ly + 11}
          fontSize="7.5"
          fontFamily="Georgia, serif"
          fill={color}
          opacity="0.65"
          textAnchor={align}
        >
          {sub}
        </text>
      )}
    </g>
  );
};
