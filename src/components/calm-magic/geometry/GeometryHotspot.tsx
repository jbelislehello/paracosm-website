import React, { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface GeometryHotspotProps {
  /** Absolute positioning style relative to a `relative` parent. */
  style: React.CSSProperties;
  /** Short heading inside the tooltip. */
  label: string;
  /** Plain-language explanation. */
  body: string;
  /** Optional symbol shown in italic serif before the label (e.g. "T", "κ"). */
  symbol?: string;
  /** Affordance shape: dashed circle (default) or rectangle. */
  shape?: "circle" | "rect";
  /** Forward activation to parent. `keyboard: true` when triggered via Enter/Space. */
  onActivate?: (opts?: { keyboard?: boolean }) => void;
  /** Tooltip side. */
  side?: "top" | "bottom" | "left" | "right";
  /** Optional extra className for the trigger. */
  className?: string;
  /** Notifies parent when hotspot becomes active (hover, focus, or tap). */
  onActiveChange?: (active: boolean) => void;
  children?: React.ReactNode;
}

/**
 * Invisible-by-default hotspot overlaid on a geometric figure.
 * Hovering reveals a dashed affordance + plain-language tooltip.
 * Tapping (touch) opens the tooltip for ~4s.
 */
export const GeometryHotspot: React.FC<GeometryHotspotProps> = ({
  style,
  label,
  body,
  symbol,
  shape = "circle",
  onActivate,
  side = "top",
  className = "",
  onActiveChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const setActive = (a: boolean) => onActiveChange?.(a);

  const handleTap = (
    e: React.MouseEvent | React.TouchEvent,
    opts?: { keyboard?: boolean }
  ) => {
    e.stopPropagation();
    setOpen(true);
    setActive(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    // Keyboard activations latch via the parent; skip the auto-close timer.
    if (!opts?.keyboard) {
      timerRef.current = window.setTimeout(() => {
        setOpen(false);
        setActive(false);
      }, 4000);
    }
    onActivate?.(opts);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={open} onOpenChange={(o) => { setOpen(o); if (!o) setActive(false); }}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            onClick={(e) => handleTap(e, { keyboard: e.detail === 0 })}
            onTouchStart={(e) => handleTap(e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTap(e as unknown as React.MouseEvent, { keyboard: true });
              }
            }}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            className={`absolute group cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ink-indigo)/0.4)] ${className}`}
            style={{
              ...style,
              border: "none",
              background: "transparent",
              padding: 0,
            }}
          >
            <span
              aria-hidden
              className={`block w-full h-full transition-opacity duration-200 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 ${
                shape === "circle" ? "rounded-full" : "rounded-sm"
              }`}
              style={{
                border: "1px dashed hsl(var(--ink-indigo))",
              }}
            />
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="max-w-[240px] bg-[hsl(var(--paper))] text-[hsl(var(--ink-indigo))] border border-[hsl(var(--ink-indigo)/0.25)] shadow-md"
        >
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              {symbol && (
                <span className="font-serif italic text-base leading-none">
                  {symbol}
                </span>
              )}
              <span className="font-serif italic text-sm">{label}</span>
            </div>
            <p className="text-xs leading-snug text-[hsl(var(--ink-indigo)/0.85)]">
              {body}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GeometryHotspot;
