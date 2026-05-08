import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Share2, Check } from "lucide-react";
import { getResidency, residencies } from "@/data/residencies";
import { residencyImage, residencyImageCaption } from "@/assets/retreats";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

const ResidencyDetail: React.FC = () => {
  const { archetype } = useParams<{ archetype: string }>();
  const residency = archetype ? getResidency(archetype) : undefined;

  useEffect(() => {
    if (residency) {
      document.title = `${residency.name} — Paracosm Residencies`;
      window.scrollTo(0, 0);
    }
  }, [residency]);

  if (!residency) {
    return <Navigate to="/index#residencies" replace />;
  }

  const r = residency;
  const idx = residencies.findIndex((x) => x.id === r.id);
  const prev = residencies[(idx - 1 + residencies.length) % residencies.length];
  const next = residencies[(idx + 1) % residencies.length];
  const pairs = r.pairsWith
    .map((id) => residencies.find((x) => x.id === id))
    .filter(Boolean) as typeof residencies;

  const tint = (alpha: number) =>
    `linear-gradient(135deg, hsl(${r.hueFrom} / ${alpha}), hsl(${r.hueTo} / ${alpha * 0.6}))`;

  const mailtoSubject = encodeURIComponent(`Residency inquiry: ${r.shortName}`);

  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = `${window.location.origin}/residencies/${r.id}`;
    const shareData = {
      title: `${r.name} — Paracosm Residencies`,
      text: r.tagline,
      url,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section
        className="relative pt-24 md:pt-32 pb-20 md:pb-28 px-4 overflow-hidden"
        style={{ background: tint(0.18) }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background: `radial-gradient(ellipse at 70% 20%, hsl(${r.hueTo} / 0.35), transparent 60%)`,
          }}
        />
        <div className="container max-w-5xl mx-auto relative">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/#residencies">Residencies</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{r.shortName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full border-border/60 bg-background/40 backdrop-blur-sm hover:bg-background/70"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> Share
                </>
              )}
            </Button>
          </div>

          <Link
            to="/#residencies"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All residencies
          </Link>

          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl md:text-6xl" aria-hidden>{r.glyph}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                  Expansive Leadership Residency
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-6 text-foreground">
                {r.name}.
              </h1>
              <p className="text-xl md:text-2xl italic text-foreground/75 mb-10 max-w-2xl">
                {r.tagline}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-1">Teacher</p>
                  <p className="text-foreground/85">{r.teacher}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-1">Duration</p>
                  <p className="text-foreground/85">{r.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-1">Format</p>
                  <p className="text-foreground/85">{r.format}</p>
                </div>
              </div>
            </div>

            {residencyImage[r.id] && (
              <figure className="md:col-span-5 relative">
                <div
                  className="relative overflow-hidden rounded-2xl aspect-[4/5] shadow-[0_40px_70px_-40px_hsl(220_30%_15%/0.5)]"
                  style={{ boxShadow: `0 40px 70px -40px hsl(${r.hueFrom} / 0.55)` }}
                >
                  <img
                    src={residencyImage[r.id]}
                    alt={residencyImageCaption[r.id]}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 mix-blend-multiply opacity-30"
                    style={{
                      background: `linear-gradient(135deg, hsl(${r.hueFrom} / 0.9), transparent 65%)`,
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 ring-1 ring-inset rounded-2xl"
                    style={{ boxShadow: `inset 0 0 0 1px hsl(${r.hueTo} / 0.35)` }}
                  />
                </div>
                <figcaption className="mt-3 text-[11px] uppercase tracking-[0.2em] text-foreground/55">
                  {residencyImageCaption[r.id]}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">Manifesto</p>
          <div className="space-y-6 md:space-y-8">
            {r.manifesto.map((line, i) => (
              <p key={i} className="text-2xl md:text-3xl font-light leading-snug text-foreground">
                <span
                  className="text-foreground/30 mr-2 font-mono text-base align-top"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* For leaders + Gesture */}
      <section className="py-12 md:py-16 px-4 border-y border-border/40">
        <div className="container max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              For leaders facing
            </p>
            <p className="text-lg text-foreground/85 leading-relaxed">{r.forLeaders}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Gesture trained
            </p>
            <p className="text-lg text-foreground/85 leading-relaxed">{r.gesture}</p>
          </div>
        </div>
      </section>

      {/* Practices */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Core practices
          </p>
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-foreground max-w-2xl">
            What you actually do across the residency.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {r.practices.map((p, i) => (
              <div
                key={p.name}
                className="rounded-2xl border border-border/50 p-6 md:p-7"
                style={{ background: tint(0.05) }}
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-2">
                  Practice {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-xl font-medium mb-3 text-foreground">{p.name}</h3>
                <p className="text-sm text-foreground/75 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
            From the field
          </p>
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-foreground">
            What this looks like in real organizations.
          </h2>
          <div className="space-y-6">
            {r.examples.map((ex, i) => (
              <div
                key={i}
                className="grid md:grid-cols-12 gap-4 md:gap-8 p-6 md:p-8 rounded-2xl bg-card border border-border/50"
              >
                <div className="md:col-span-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-2">
                    Context
                  </p>
                  <p className="text-base text-foreground/80 leading-relaxed">{ex.context}</p>
                </div>
                <div className="md:col-span-7">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-2">
                    Shift
                  </p>
                  <p className="text-base text-foreground leading-relaxed">{ex.shift}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Threshold + Artifact */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="rounded-2xl p-8" style={{ background: tint(0.08) }}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-3">
              Threshold crossed
            </p>
            <p className="text-xl md:text-2xl font-light italic text-foreground leading-snug">
              {r.threshold}
            </p>
          </div>
          <div className="rounded-2xl p-8 border border-border/50">
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-3">
              Artifact you carry back
            </p>
            <p className="text-xl md:text-2xl font-light text-foreground leading-snug">
              {r.artifact}
            </p>
          </div>
        </div>
      </section>

      {/* Pairs with */}
      {pairs.length > 0 && (
        <section className="py-12 md:py-16 px-4 border-t border-border/40">
          <div className="container max-w-5xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Pairs naturally with
            </p>
            <div className="flex flex-wrap gap-4">
              {pairs.map((p) => (
                <Link
                  key={p.id}
                  to={`/residencies/${p.id}`}
                  className="group inline-flex items-center gap-3 px-5 py-3 rounded-full border border-border/60 hover:border-foreground/40 transition-colors"
                  style={{ background: `linear-gradient(135deg, hsl(${p.hueFrom} / 0.06), hsl(${p.hueTo} / 0.03))` }}
                >
                  <span className="text-xl" aria-hidden>{p.glyph}</span>
                  <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground">
                    {p.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-28 px-4" style={{ background: tint(0.12) }}>
        <div className="container max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-5">
            Begin
          </p>
          <h2 className="text-3xl md:text-5xl font-light mb-6 text-foreground leading-tight">
            Apprentice yourself to the {r.shortName.toLowerCase()}.
          </h2>
          <p className="text-base md:text-lg text-foreground/75 mb-10 max-w-xl mx-auto">
            Residencies open in small cohorts. Tell me where you are, what season you're in, and
            we'll see if this is the right teacher for now.
          </p>
          <a href={`mailto:jbelisle@helloarchitekt.com?subject=${mailtoSubject}`}>
            <Button className="rounded-full bg-foreground text-background hover:bg-foreground/85 px-7 py-6 text-base">
              Request an invitation
            </Button>
          </a>
        </div>
      </section>

      {/* Prev / Next */}
      <nav className="border-t border-border/40">
        <div className="container max-w-5xl mx-auto grid grid-cols-2">
          <Link
            to={`/residencies/${prev.id}`}
            className="group flex items-center gap-3 px-6 md:px-8 py-8 hover:bg-muted/40 transition-colors border-r border-border/40"
          >
            <ArrowLeft className="w-4 h-4 text-foreground/50 group-hover:text-foreground/80" />
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">Previous</p>
              <p className="text-sm md:text-base font-medium text-foreground/85 group-hover:text-foreground">
                {prev.glyph} {prev.shortName}
              </p>
            </div>
          </Link>
          <Link
            to={`/residencies/${next.id}`}
            className="group flex items-center justify-end gap-3 px-6 md:px-8 py-8 hover:bg-muted/40 transition-colors text-right"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">Next</p>
              <p className="text-sm md:text-base font-medium text-foreground/85 group-hover:text-foreground">
                {next.shortName} {next.glyph}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-foreground/50 group-hover:text-foreground/80" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default ResidencyDetail;
