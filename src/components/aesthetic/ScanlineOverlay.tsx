/** VHS scanline overlay. Place inside a `relative` parent. */
interface Props { className?: string }
export default function ScanlineOverlay({ className = "" }: Props) {
  return <div className={`bloom-scanlines ${className}`} aria-hidden="true" />;
}
