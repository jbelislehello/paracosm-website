import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import GradientDivider from "@/components/GradientDivider";
import { usePageSeo } from "@/hooks/usePageSeo";
import { ORIGIN_METHODS } from "@/data/origins";

const Origins = () => {
  usePageSeo({
    title: "Origins — The methods that became Calm Magic (2013–2018)",
    description:
      "Ten original methods sketched between 2013 and 2018 by Jonathan Bélisle — the methodological lineage that became Calm Magic, GL!TCH, Drift, and the Paracosm Retreat.",
    path: "/origins",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link
            to="/lineage"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lineage
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 gap-1.5">
              <Sparkles className="h-3 w-3" />
              Origins
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              The methods that became Calm Magic
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Calm Magic didn't appear in 2024. These ten methods, sketched by
              Jonathan Bélisle between 2013 and 2018, are its bones. Each one
              names a piece of the grammar that the live system now uses every
              day — relational intelligence, programmable environments, the
              five-season descent, the consciousness manifold.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              A 13-year continuum, drawn by hand, then made operational.
            </p>
          </div>
        </section>

        <GradientDivider />

        {/* Timeline */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-5xl space-y-10">
            {ORIGIN_METHODS.map((m, i) => (
              <Card
                key={m.slug}
                className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm"
              >
                <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  {/* Image */}
                  <figure
                    className={`relative bg-muted ${
                      i % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    <img
                      src={m.image}
                      alt={`${m.title} — original sketch by Jonathan Bélisle, ${m.year}`}
                      loading="lazy"
                      className="h-full max-h-[480px] w-full object-cover object-center"
                    />
                    <figcaption className="absolute bottom-2 right-2 rounded-full bg-background/85 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
                      Sketch — Jonathan Bélisle, {m.year}
                    </figcaption>
                  </figure>

                  {/* Body */}
                  <div className="flex flex-col gap-5 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{m.year}</Badge>
                      <Badge variant="outline" className="text-[10px]">
                        Original language: {m.language}
                      </Badge>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {m.title}
                      </h2>
                      {m.subtitle && (
                        <p className="mt-1 text-sm italic text-muted-foreground">
                          {m.subtitle}
                        </p>
                      )}
                    </div>

                    <p className="text-base leading-relaxed text-muted-foreground">
                      {m.blurb}
                    </p>

                    {m.vocabulary.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.vocabulary.map((v) => (
                          <span
                            key={v}
                            className="rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-border/60 pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Became →
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {m.became.map((b) => (
                          <Link
                            key={b.to + b.label}
                            to={b.to}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                          >
                            {b.label}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <GradientDivider />

        {/* Closing */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              See where this goes
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Origins shows the internal lineage. Lineage shows where Calm Magic
              sits next to the frameworks you already know. The board shows it
              running.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/lineage">
                <Button size="lg" variant="outline" className="gap-2">
                  External lineage
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/calm-magic-board">
                <Button size="lg" className="gap-2">
                  The live system
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Origins;
