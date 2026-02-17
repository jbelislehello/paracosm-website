import { useMemo } from 'react';
import type { MatrixPosition, TarotSuit } from '@/data/entrepreneurialTarot';
import { suitColors } from '@/data/entrepreneurialTarot';

interface GenerativeCardArtProps {
  matrixPosition: MatrixPosition;
  suit?: TarotSuit;
  dimension?: string;
  className?: string;
  breathing?: boolean;
  reversed?: boolean;
}

// Deterministic pseudo-random from seed
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function GenerativeCardArt({
  matrixPosition,
  suit,
  dimension,
  className = '',
  breathing = true,
  reversed = false,
}: GenerativeCardArtProps) {
  const { row, col } = matrixPosition;

  const suitIdx = suit
    ? ['magic', 'love', 'calm', 'open', 'free', 'weaver'].indexOf(suit) + 1
    : dimension
      ? ['C', 'H', 'O', 'R', 'D', 'S'].indexOf(dimension) + 1
      : 1;

  const accentColor = suit
    ? suitColors[suit]
    : '#8b5cf6';

  const elements = useMemo(() => {
    const seed = (row * 8 + col) * suitIdx;
    const rand = seededRandom(seed);
    const circleCount = row + 2;
    const rotationBase = col * 45;
    const hueOffset = seed % 360;
    const lineDensity = Math.min(row, 8);

    // Generate concentric interference circles
    const circles = Array.from({ length: circleCount }, (_, i) => {
      const r = 15 + i * (35 / circleCount);
      const hue = (hueOffset + i * 30) % 360;
      const opacity = 0.08 + rand() * 0.12;
      return { r, hue, opacity, cx: 50 + (rand() - 0.5) * 10, cy: 50 + (rand() - 0.5) * 10 };
    });

    // Generate organic topology lines
    const lines = Array.from({ length: lineDensity }, (_, i) => {
      const startAngle = rotationBase + i * (360 / lineDensity);
      const r1 = 10 + rand() * 30;
      const r2 = 20 + rand() * 35;
      const cp1x = 50 + r1 * Math.cos((startAngle * Math.PI) / 180);
      const cp1y = 50 + r1 * Math.sin((startAngle * Math.PI) / 180);
      const endAngle = startAngle + 60 + rand() * 120;
      const cp2x = 50 + r2 * Math.cos((endAngle * Math.PI) / 180);
      const cp2y = 50 + r2 * Math.sin((endAngle * Math.PI) / 180);
      const hue = (hueOffset + i * 45) % 360;
      return { cp1x, cp1y, cp2x, cp2y, hue, opacity: 0.15 + rand() * 0.2 };
    });

    // Phase-shifted color field blobs
    const blobs = Array.from({ length: 3 }, (_, i) => {
      const angle = (i * 120 + rotationBase) * (Math.PI / 180);
      const dist = 15 + rand() * 20;
      return {
        cx: 50 + dist * Math.cos(angle),
        cy: 50 + dist * Math.sin(angle),
        r: 18 + rand() * 15,
        hue: (hueOffset + i * 120) % 360,
        opacity: 0.06 + rand() * 0.08,
      };
    });

    return { circles, lines, blobs, hueOffset, rotationBase };
  }, [row, col, suitIdx]);

  const scaleTransform = reversed ? 'scale(0.92)' : 'scale(1)';

  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className} ${breathing ? 'animate-card-breathe' : ''}`}
      style={{ transform: scaleTransform, transition: 'transform 0.6s ease' }}
    >
      <defs>
        {/* Noise texture filter */}
        <filter id={`noise-${row}-${col}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        {/* Glow filter */}
        <filter id={`glow-${row}-${col}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background noise texture */}
      <rect
        width="100" height="100" rx="8"
        fill={`hsla(${elements.hueOffset}, 30%, 8%, 1)`}
      />
      <rect
        width="100" height="100" rx="8"
        opacity="0.04"
        filter={`url(#noise-${row}-${col})`}
        fill="white"
      />

      {/* Phase-shifted color field blobs */}
      {elements.blobs.map((b, i) => (
        <circle
          key={`blob-${i}`}
          cx={b.cx} cy={b.cy} r={b.r}
          fill={`hsla(${b.hue}, 70%, 50%, ${b.opacity})`}
          className={breathing ? 'animate-moire-shift' : ''}
          style={{ animationDelay: `${i * 0.8}s` }}
        />
      ))}

      {/* Interference circles */}
      {elements.circles.map((c, i) => (
        <circle
          key={`circle-${i}`}
          cx={c.cx} cy={c.cy} r={c.r}
          fill="none"
          stroke={`hsla(${c.hue}, 60%, 65%, ${c.opacity})`}
          strokeWidth={0.3 + (i * 0.15)}
          className={breathing ? 'animate-card-breathe' : ''}
          style={{ animationDelay: `${i * 0.3}s`, transformOrigin: 'center' }}
        />
      ))}

      {/* Organic topology lines */}
      {elements.lines.map((l, i) => (
        <path
          key={`line-${i}`}
          d={`M 50 50 Q ${l.cp1x} ${l.cp1y} ${l.cp2x} ${l.cp2y}`}
          fill="none"
          stroke={`hsla(${l.hue}, 50%, 70%, ${l.opacity})`}
          strokeWidth="0.4"
          strokeLinecap="round"
        />
      ))}

      {/* Central accent glow */}
      <circle
        cx="50" cy="50" r="4"
        fill={accentColor}
        opacity="0.25"
        filter={`url(#glow-${row}-${col})`}
      />
    </svg>
  );
}
