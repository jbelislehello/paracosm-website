import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  retreatImages,
  retreatImageCredits,
  residencyImage,
  residencyImageCredit,
  residencyImageCaption,
  formatCredit,
} from "@/assets/retreats";
import { residencies } from "@/data/residencies";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CreditRow: React.FC<{
  src: string;
  fileName: string;
  photographer: string;
  location?: string;
  year?: string;
  event?: string;
  alt: string;
}> = ({ src, fileName, photographer, location, year, event, alt }) => (
  <li className="flex gap-5 py-5 border-b border-border/40 last:border-b-0">
    <div className="shrink-0 w-28 h-28 md:w-32 md:h-32 overflow-hidden rounded-xl bg-muted">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
        {fileName}
      </p>
      <p className="text-base text-foreground font-medium">{photographer}</p>
      {(location || year) && (
        <p className="text-sm text-foreground/70 mt-0.5">
          {[location, year].filter(Boolean).join(" · ")}
        </p>
      )}
      {event && (
        <p className="text-sm italic text-foreground/65 mt-1">{event}</p>
      )}
    </div>
  </li>
);

const Credits: React.FC = () => {
  useEffect(() => {
    document.title = "Image credits & sources — Paracosm";
    window.scrollTo(0, 0);
  }, []);

  // Retreat photos shown in the Somatic Creativity Retreat section
  const retreatSlugs: Array<keyof typeof retreatImages> = [
    "atelierCircle",
    "lakePortrait",
    "forestCircle",
  ];
  // Archetype heroes (one per residency)
  const archetypeOrder = residencies.map((r) => r.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4">
        <div className="container max-w-3xl mx-auto">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Credits</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>

          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Sources
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight text-foreground mb-6">
            Image credits & sources.
          </h1>
          <p className="text-base md:text-lg text-foreground/75 leading-relaxed mb-2 max-w-2xl">
            Photographs across this site come from the Paracosm and Hello Architekt
            archive — retreats, residencies, and field gatherings held between
            2017 and today.
          </p>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-2xl">
            Credits are attributed where known. If you recognize a photographer
            who is missing here, please write to{" "}
            <a
              href="mailto:jbelisle@helloarchitekt.com"
              className="underline underline-offset-2 hover:text-foreground"
            >
              jbelisle@helloarchitekt.com
            </a>{" "}
            and we'll update the record.
          </p>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Retreats — Somatic Creativity
          </h2>
          <ul className="mb-16">
            {retreatSlugs.map((slug) => {
              const c = retreatImageCredits[slug];
              return (
                <CreditRow
                  key={slug}
                  src={retreatImages[slug]}
                  fileName={c.fileName}
                  photographer={c.photographer}
                  location={c.location}
                  year={c.year}
                  event={c.event}
                  alt={c.event ?? c.fileName}
                />
              );
            })}
          </ul>

          <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Residencies — Archetype heroes
          </h2>
          <ul>
            {archetypeOrder.map((id) => {
              const c = residencyImageCredit[id];
              return (
                <CreditRow
                  key={id}
                  src={residencyImage[id]}
                  fileName={c.fileName}
                  photographer={c.photographer}
                  location={c.location}
                  year={c.year}
                  event={c.event ?? residencyImageCaption[id]}
                  alt={residencyImageCaption[id]}
                />
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Credits;
