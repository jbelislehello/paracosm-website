import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** Adds a colored tape strip on top. */
  tape?: boolean;
  /** Slight rotation in deg for collage feel. */
  rotate?: number;
}

export default function TornCard({ children, className = "", tape = true, rotate = 0 }: Props) {
  return (
    <div
      className={`relative ${className}`}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      {tape && (
        <span className="bloom-tape left-1/2 top-[-12px] h-5 w-24 -translate-x-1/2 rounded-[2px]" aria-hidden="true" />
      )}
      <div className="bloom-torn p-6 shadow-[var(--shadow-bloom)]">
        {children}
      </div>
    </div>
  );
}
