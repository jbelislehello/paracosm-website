import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { editorialTone, editorialType, type EditorialTone } from "./editorialTokens";

interface EditorialCTAProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  tone?: EditorialTone;
  variant?: "primary" | "ghost";
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  showArrow?: boolean;
}

export default function EditorialCTA({
  to,
  href,
  onClick,
  tone = "warm",
  variant = "primary",
  children,
  className,
  target,
  rel,
  showArrow = true,
}: EditorialCTAProps) {
  const t = editorialTone[tone];
  const classes = cn(
    "inline-flex items-center gap-2 px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5",
    editorialType.cta,
    variant === "primary" ? t.ctaPrimary : t.ctaGhost,
    className,
  );

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} target={target} rel={rel} onClick={onClick} className={classes}>
      {content}
    </a>
  );
}
