import { useEffect, useState } from "react";

interface Props {
  label?: string;
  className?: string;
}

/** REC dot + live timestamp in VT323 — sticks to its parent corner. */
export default function VHSBadge({ label = "REC", className = "" }: Props) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const stamp = time.toISOString().slice(0, 19).replace("T", " ");
  return (
    <div className={`pointer-events-none flex items-center gap-2 font-vhs text-xs uppercase tracking-widest ${className}`}>
      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[hsl(var(--bloom-magenta))] shadow-[0_0_10px_hsl(var(--bloom-magenta))]" />
      <span>{label}</span>
      <span className="opacity-70">{stamp}</span>
    </div>
  );
}
