import { useBreathingPulse } from "@/hooks/useBreathingPulse";
import { GraphPaperDefs } from "@/components/calm-magic/geometry/GraphPaper";

/**
 * Ambient differential-geometry layer: a hand-inked breathing torus silhouette
 * with a slowly rotating tangent. Decorative only — pointer-events disabled.
 */
export default function LivingGeometryAmbient() {
  const breath = useBreathingPulse();
  const angle = (performance.now() / 9000) % (Math.PI * 2);
  const cx = 600;
  const cy = 320;
  const R = 220;
  const rx = R + breath * 8;
  const ry = rx * 0.42;
  const tx = cx + Math.cos(angle) * rx;
  const ty = cy + Math.sin(angle) * ry;

  return (
    <svg
      viewBox="0 0 1200 640"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.32] dark:opacity-[0.18]"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <GraphPaperDefs id="ambient-gp" />
      <rect width="100%" height="100%" fill="url(#ambient-gp-grid-bold)" />

      {/* Nested torus skins */}
      {[0.55, 0.75, 0.95, 1.15].map((k, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx * k}
          ry={ry * k}
          fill="none"
          stroke="hsl(var(--ink-indigo))"
          strokeWidth={i === 2 ? 1.2 : 0.7}
          opacity={0.35 + breath * 0.25}
          filter="url(#ambient-gp-ink)"
        />
      ))}

      {/* Inner red flow */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx * 0.35}
        ry={ry * 0.35}
        fill="none"
        stroke="hsl(var(--ink-red))"
        strokeWidth="0.9"
        opacity={0.4 + breath * 0.4}
        filter="url(#ambient-gp-ink)"
      />

      {/* Tangent point */}
      <circle cx={tx} cy={ty} r="3.5" fill="hsl(var(--ink-red))" opacity="0.7" />
      <line
        x1={tx}
        y1={ty}
        x2={tx + Math.cos(angle + Math.PI / 2) * 36}
        y2={ty + Math.sin(angle + Math.PI / 2) * 36}
        stroke="hsl(var(--ink-indigo))"
        strokeWidth="1"
        opacity="0.7"
      />

      <text
        x={cx + rx + 18}
        y={cy + 4}
        fontSize="11"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fill="hsl(var(--ink-indigo))"
        opacity="0.55"
      >
        a learning organism, breathing
      </text>
    </svg>
  );
}
