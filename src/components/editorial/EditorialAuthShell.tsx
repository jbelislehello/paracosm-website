import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { editorialTone, editorialType, type EditorialTone } from "./editorialTokens";

interface EditorialAuthShellProps {
  numeral: string;
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  tone?: EditorialTone;
  className?: string;
}

/**
 * Editorial shell for auth / status pages (sign in, reset, checkout status, 404).
 * Centered magazine card with numeral, kicker, serif display headline.
 */
export default function EditorialAuthShell({
  numeral,
  kicker,
  title,
  subtitle,
  children,
  footer,
  tone = "warm",
  className,
}: EditorialAuthShellProps) {
  const t = editorialTone[tone];
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-6 py-16",
        t.section,
        className,
      )}
    >
      <div className="w-full max-w-md">
        <div className="flex items-baseline gap-4 mb-6">
          <span
            className={cn(
              editorialType.serif,
              "text-5xl md:text-6xl leading-none",
              t.numeral,
            )}
          >
            {numeral}
          </span>
          <p className={cn(editorialType.kicker, t.kicker)}>{kicker}</p>
        </div>
        <h1
          className={cn(
            editorialType.serif,
            "text-3xl md:text-4xl leading-[1.05] tracking-tight mb-4",
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-base leading-relaxed opacity-75 mb-8">
            {subtitle}
          </p>
        )}
        <div className={cn(
          "border-t border-current/15 pt-8",
        )}>
          {children}
        </div>
        {footer && (
          <div className="mt-8 pt-6 border-t border-current/10 text-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
