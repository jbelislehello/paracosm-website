import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/hooks/usePageSeo";
import { cn } from "@/lib/utils";

import {
  MATURITY_LABEL,
  PARACOSM_PRODUCTS,
  type ParacosmProduct,
} from "@/data/paracosmProducts";

const MATURITY_STYLE: Record<ParacosmProduct["maturity"], string> = {
  live: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  "in-flight": "bg-amber-500/15 text-amber-600 border-amber-500/30",
  seeded: "bg-muted text-muted-foreground border-border",
};

export default function Products() {
  usePageSeo({
    title: "Paracosm Portfolio — 8 Products Emerging from Calm Magic",
    description:
      "The eight commercial surfaces of the Paracosm ecosystem: readiness platform, deck, book, agents, certification, retreats, music, and consulting.",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-14">
        <header className="mb-14 max-w-3xl">
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Portfolio · Paracosm
          </div>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl">
            Eight products, one ontology.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Every surface below emerges from the same substrate: the Calm Magic framework. Each is
            positioned to stand on its own commercially — and to compound with the others as
            partnerships, licensing, or acquisition become available.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/readiness">
                <Sparkles className="mr-2 h-4 w-4" />
                Start the Readiness Assessment
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/lineage">Read the lineage story</Link>
            </Button>
          </div>
        </header>

        <ul className="grid gap-5 md:grid-cols-2">
          {PARACOSM_PRODUCTS.map((p) => (
            <li
              key={p.slug}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 shadow-sm transition-all hover:border-foreground/40"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ backgroundColor: p.color }}
              />
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span style={{ color: p.color }}>{p.category}</span>
                <span className="opacity-40">·</span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 tracking-wider",
                    MATURITY_STYLE[p.maturity],
                  )}
                >
                  {MATURITY_LABEL[p.maturity]}
                </span>
              </div>

              <h2 className="mt-3 font-serif text-2xl leading-tight">{p.name}</h2>
              <p className="mt-0.5 text-sm italic text-muted-foreground">{p.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">{p.description}</p>

              <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Moat
                  </dt>
                  <dd className="mt-1 text-foreground/85">{p.moat}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Exit thesis
                  </dt>
                  <dd className="mt-1 text-foreground/85">{p.exitThesis}</dd>
                </div>
              </dl>

              {p.href && (
                <div className="mt-5">
                  <Link
                    to={p.href}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
                    style={{ color: p.color }}
                  >
                    Explore
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>

        <section className="mt-16 rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
          <h2 className="font-serif text-2xl">Why they compound</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The Readiness Platform generates the diagnostic corpus. The Agents refine it into
            interaction data. The Book, Deck, and Certification distribute the vocabulary. Retreats
            and Music anchor the brand. Consulting monetizes the highest-margin edge. Each product
            makes the next more defensible.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
