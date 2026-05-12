import { ElementType, ReactNode } from "react";

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** animated chromatic-aberration vs static */
  animated?: boolean;
}

export default function ChromaText({
  as: Tag = "span",
  children,
  className = "",
  animated = true,
}: Props) {
  return (
    <Tag className={`${animated ? "bloom-chroma" : "bloom-chroma-static"} ${className}`}>
      {children}
    </Tag>
  );
}
