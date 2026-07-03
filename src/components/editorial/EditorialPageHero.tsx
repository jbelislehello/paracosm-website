import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { editorialTone, editorialType, type EditorialTone } from "./editorialTokens";

interface EditorialPageHeroProps {
  numeral?: string;
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  tone?: EditorialTone;
  align?: "left" | "center";
  className?: string;
}

/**
 * Editorial hero shell for interior pages.
 * Provides tone-aware background, serif display headline, kicker + numeral.
 */
export default function EditorialPageHero({
  numeral,
  kicker,
  title,
  subtitle,
  meta,
  actions,
  tone = "warm",
  align = "left",
  className,
}: EditorialPageHeroProps) {
  const t = editorialTone[tone];
  const isCenter = align === "center";
  return (
    <section
      className={cn(
        "relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 border-b border-current/10",
        t.section,
        className,
      )}
    >
      <div className={cn("container max-w-6xl mx-auto", isCenter && "text-center")}>
        <div
          className={cn(
            "flex items-baseline gap-6 mb-8",
            isCenter && "justify-center",
          )}
        >
          {numeral && (
            <span
              className={cn(
                editorialType.serif,
                "text-5xl md:text-7xl leading-none",
                t.numeral,
              )}
            >
              {numeral}
            </span>
          )}
          <p className={cn(editorialType.kicker, t.kicker)}>{kicker}</p>
        </div>
        <h1
          className={cn(
            editorialType.serif,
            "text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-4xl",
            isCenter && "mx-auto",
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "mt-6 text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl",
              isCenter && "mx-auto",
            )}
          >
            {subtitle}
          </p>
        )}
        {meta && (
          <div className={cn("mt-6", editorialType.caption)}>{meta}</div>
        )}
        {actions && (
          <div
            className={cn(
              "mt-10 flex flex-wrap gap-3",
              isCenter && "justify-center",
            )}
          >
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
