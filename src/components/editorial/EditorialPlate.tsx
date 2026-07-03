import { cn } from "@/lib/utils";

interface EditorialPlateProps {
  numeral?: string;
  image: string;
  alt: string;
  caption?: string;
  className?: string;
  sticky?: boolean;
}

export default function EditorialPlate({
  numeral,
  image,
  alt,
  caption,
  className,
  sticky = true,
}: EditorialPlateProps) {
  return (
    <figure className={cn(sticky && "md:sticky md:top-24", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
        <img src={image} alt={alt} loading="lazy" className="w-full h-full object-cover" />
        {(numeral || caption) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            {numeral && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">
                Plate {numeral}
              </p>
            )}
            <p className="text-white text-sm">{caption ?? alt}</p>
          </div>
        )}
      </div>
    </figure>
  );
}
