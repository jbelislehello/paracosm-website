import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { editorialTone, type EditorialTone } from "./editorialTokens";

interface EditorialSectionProps {
  tone?: EditorialTone;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  id?: string;
}

/**
 * Tone-aware editorial section wrapper.
 * Provides consistent vertical rhythm and background tone across pages.
 */
export default function EditorialSection({
  tone = "warm",
  className,
  containerClassName,
  children,
  id,
}: EditorialSectionProps) {
  return (
    <section
      id={id}
      className={cn("py-20 md:py-32 px-6 relative", editorialTone[tone].section, className)}
    >
      <div className={cn("container max-w-7xl mx-auto relative", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
