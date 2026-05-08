import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Check, X, Loader2 } from "lucide-react";
import {
  retreatImages,
  retreatImageCredits,
  residencyImage,
  residencyImageCaption,
} from "@/assets/retreats";
import { residencies } from "@/data/residencies";
import { useImageCredits, type CreditPatch } from "@/hooks/useImageCredits";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Slug = keyof typeof retreatImages;

const CreditRow: React.FC<{
  slug: Slug;
  src: string;
  alt: string;
  fallbackEvent?: string;
}> = ({ slug, src, alt, fallbackEvent }) => {
  const { getCredit, upsertCredit, isAdmin } = useImageCredits();
  const { toast } = useToast();
  const c = getCredit(slug);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<CreditPatch>({
    photographer: c.photographer ?? "",
    location: c.location ?? "",
    year: c.year ?? "",
    event: c.event ?? fallbackEvent ?? "",
  });

  const startEdit = () => {
    setDraft({
      photographer: c.photographer ?? "",
      location: c.location ?? "",
      year: c.year ?? "",
      event: c.event ?? fallbackEvent ?? "",
    });
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await upsertCredit(slug, {
        photographer: (draft.photographer || "").trim() || null,
        location: (draft.location || "").trim() || null,
        year: (draft.year || "").trim() || null,
        event: (draft.event || "").trim() || null,
      });
      toast({ title: "Credit updated", description: c.fileName });
      setEditing(false);
    } catch (e: any) {
      toast({
        title: "Couldn't save",
        description: e?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="flex gap-5 py-5 border-b border-border/40 last:border-b-0">
      <div className="shrink-0 w-28 h-28 md:w-32 md:h-32 overflow-hidden rounded-xl bg-muted">
        <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
      </div>

      {editing ? (
        <div className="flex-1 min-w-0 grid gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {c.fileName}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-muted-foreground">Photographer</Label>
              <Input
                value={draft.photographer ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, photographer: e.target.value }))}
                maxLength={120}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">Year</Label>
              <Input
                value={draft.year ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value }))}
                maxLength={20}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">Location</Label>
              <Input
                value={draft.location ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                maxLength={160}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">Event</Label>
              <Input
                value={draft.event ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, event: e.target.value }))}
                maxLength={200}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-foreground text-background hover:bg-foreground/85 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted/50"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              {c.fileName}
            </p>
            {isAdmin && (
              <button
                onClick={startEdit}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Edit credit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-base text-foreground font-medium">{c.photographer}</p>
          {(c.location || c.year) && (
            <p className="text-sm text-foreground/70 mt-0.5">
              {[c.location, c.year].filter(Boolean).join(" · ")}
            </p>
          )}
          {(c.event ?? fallbackEvent) && (
            <p className="text-sm italic text-foreground/65 mt-1">{c.event ?? fallbackEvent}</p>
          )}
        </div>
      )}
    </li>
  );
};

const Credits: React.FC = () => {
  useEffect(() => {
    document.title = "Image credits & sources — Paracosm";
    window.scrollTo(0, 0);
  }, []);

  const retreatSlugs: Slug[] = ["atelierCircle", "lakePortrait", "forestCircle"];
  const archetypeOrder = residencies.map((r) => r.id);

  // Map archetype → slug (mirrors residencyImageCredit composition)
  const archetypeSlug: Record<(typeof archetypeOrder)[number], Slug> = {
    forest: "forestCircle",
    river: "riverPanel",
    lake: "lakePortrait",
    mountain: "mountainSummit",
    ocean: "oceanGathering",
    storm: "stormKeynote",
    sun: "sunAmphitheater",
  };

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
              const base = retreatImageCredits[slug];
              return (
                <CreditRow
                  key={slug}
                  slug={slug}
                  src={retreatImages[slug]}
                  alt={base.event ?? base.fileName}
                  fallbackEvent={base.event}
                />
              );
            })}
          </ul>

          <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Residencies — Archetype heroes
          </h2>
          <ul>
            {archetypeOrder.map((id) => {
              const slug = archetypeSlug[id];
              return (
                <CreditRow
                  key={id}
                  slug={slug}
                  src={residencyImage[id]}
                  alt={residencyImageCaption[id]}
                  fallbackEvent={residencyImageCaption[id]}
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
