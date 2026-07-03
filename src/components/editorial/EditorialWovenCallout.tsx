import { cn } from "@/lib/utils";
import { editorialTone, editorialType, type EditorialTone } from "./editorialTokens";

interface EditorialWovenCalloutProps {
  eyebrow?: string;
  title: string;
  points: string[];
  tone?: EditorialTone;
  className?: string;
}

export default function EditorialWovenCallout({
  eyebrow = "Woven in",
  title,
  points,
  tone = "warm",
  className,
}: EditorialWovenCalloutProps) {
  const t = editorialTone[tone];
  return (
    <div className={cn("rounded-2xl p-6 border", t.calloutBox, className)}>
      <p className={cn(editorialType.caption, "mb-2")}>{eyebrow}</p>
      <p className={cn(editorialType.serif, "text-lg mb-3")}>{title}</p>
      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm opacity-90">
        {points.map((pt) => (
          <li key={pt} className="flex gap-2">
            <span className="opacity-50">→</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
