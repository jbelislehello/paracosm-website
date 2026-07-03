import { cn } from "@/lib/utils";
import { editorialTone, editorialType, type EditorialTone } from "./editorialTokens";

interface EditorialChapterHeaderProps {
  numeral: string;
  kicker: string;
  subtitle?: string;
  tone?: EditorialTone;
  className?: string;
}

export default function EditorialChapterHeader({
  numeral,
  kicker,
  subtitle,
  tone = "warm",
  className,
}: EditorialChapterHeaderProps) {
  const t = editorialTone[tone];
  return (
    <div
      className={cn(
        "flex items-baseline gap-6 mb-12 md:mb-16 border-b border-current/10 pb-6",
        className,
      )}
    >
      <span className={cn(editorialType.serif, "text-6xl md:text-8xl leading-none", t.numeral)}>
        {numeral}
      </span>
      <div>
        <p className={editorialType.kicker}>
          Chapter {numeral} · {kicker}
        </p>
        {subtitle && (
          <p className={cn(editorialType.serif, "italic text-2xl md:text-3xl mt-1")}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
