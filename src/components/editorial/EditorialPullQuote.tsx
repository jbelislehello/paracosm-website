import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { editorialTone, editorialType, type EditorialTone } from "./editorialTokens";

interface EditorialPullQuoteProps {
  children: ReactNode;
  tone?: EditorialTone;
  className?: string;
}

export default function EditorialPullQuote({
  children,
  tone = "warm",
  className,
}: EditorialPullQuoteProps) {
  const t = editorialTone[tone];
  return (
    <blockquote
      className={cn(
        editorialType.serif,
        "border-l-4 pl-5 py-2 italic text-xl md:text-2xl leading-snug",
        t.quoteBorder,
        className,
      )}
    >
      “{children}”
    </blockquote>
  );
}
