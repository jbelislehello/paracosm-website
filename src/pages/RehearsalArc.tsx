import { REHEARSAL_ARC_PROGRAM, rehearsalOfferingsByTier } from "@/data/rehearsalArcProgram";
import { STATE_META, STATE_ORDER, JOURNEY_META, TIER_META } from "@/data/rehearsalArcMeta";
import { usePageSeo } from "@/hooks/usePageSeo";
import { itemListSchema } from "@/lib/structuredData";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import EditorialCTA from "@/components/editorial/EditorialCTA";
import GatedDownloadButton from "@/components/rehearsal/GatedDownloadButton";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

export default function RehearsalArc() {
  usePageSeo({
    title: "The Rehearsal Arc — Trainings, Retreats & Residencies | Paracosm",
    description:
      "One coherent program mapped through the Calm Magic ontology (LOVE · MAGIC · CALM · OPEN · FREE) and three simultaneous journeys — Narrative, Cognitive, Identity.",
    path: "/programs/rehearsal-arc",
    jsonLd: itemListSchema({
      url: "/programs/rehearsal-arc",
      name: "The Rehearsal Arc",
      items: REHEARSAL_ARC_PROGRAM.map((o) => ({
        name: o.title,
        url: `/programs/rehearsal-arc/${o.slug}`,
        description: o.tagline,
      })),
    }),
  });

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      {/* Masthead */}
      <EditorialSection tone="warm" className="pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-9 space-y-6">
            <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>
              Volume II · The Rehearsal Arc
            </p>
            <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight")}>
              A program shaped like <em className="italic font-light">attention itself</em>.
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed">
              Nine offerings — three trainings, three retreats, three residencies —
              scored through the same two coordinates: five cognitive states, and
              three simultaneous journeys.
            </p>
          </div>
          <aside className="md:col-span-3 border-l border-current/20 pl-6 space-y-2 text-sm">
            <p className={editorialType.caption}>In this volume</p>
            <ol className="space-y-2">
              {(Object.keys(TIER_META) as Array<keyof typeof TIER_META>).map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className={cn(editorialType.serif, editorialTone.warm.numeral)}>
                    0{i + 1}
                  </span>
                  <span>{TIER_META[t].label} — {TIER_META[t].phase}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </EditorialSection>

      {/* 5-state ontology */}
      <EditorialSection tone="paper">
        <EditorialChapterHeader
          numeral="I"
          kicker="The five states"
          subtitle="Every session moves through the same arc."
          tone="paper"
        />
        <div className="grid md:grid-cols-5 gap-6">
          {STATE_ORDER.map((s, i) => {
            const meta = STATE_META[s];
            return (
              <div key={s} className="border border-border rounded-2xl p-6 bg-muted/40">
                <div
                  className={cn(editorialType.serif, "text-4xl mb-3")}
                  style={{ color: meta.accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className={editorialType.eyebrow}>{meta.label}</p>
                <p className={cn(editorialType.serif, "italic text-lg mt-1 mb-3")}>
                  {meta.role}
                </p>
                <p className="text-sm opacity-80 leading-relaxed">{meta.intent}</p>
              </div>
            );
          })}
        </div>
      </EditorialSection>

      {/* 3 journeys */}
      <EditorialSection tone="night">
        <EditorialChapterHeader
          numeral="II"
          kicker="Three simultaneous journeys"
          subtitle="Every session runs three tracks at once."
          tone="night"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {(Object.keys(JOURNEY_META) as Array<keyof typeof JOURNEY_META>).map((j) => {
            const meta = JOURNEY_META[j];
            return (
              <div key={j} className="border border-white/15 bg-white/5 rounded-2xl p-8">
                <p className={editorialType.eyebrow}>{meta.label}</p>
                <p className={cn(editorialType.serif, "italic text-2xl mt-3 mb-4 leading-tight")}>
                  {meta.question}
                </p>
                <p className="text-sm opacity-80">
                  <span className={editorialType.caption}>Artefact — </span>
                  {meta.artefact}
                </p>
              </div>
            );
          })}
        </div>
      </EditorialSection>

      {/* Tier chapters */}
      {(Object.keys(TIER_META) as Array<keyof typeof TIER_META>).map((tierKey, tIdx) => {
        const tier = TIER_META[tierKey];
        const offerings = rehearsalOfferingsByTier(tierKey);
        const t = editorialTone[tier.tone];
        return (
          <section key={tierKey} className={cn("py-20 md:py-28 px-6", t.section)}>
            <div className="container max-w-7xl mx-auto">
              <EditorialChapterHeader
                numeral={`0${tIdx + 3}`}
                kicker={`${tier.label} · ${tier.phase}`}
                subtitle={tier.blurb}
                tone={tier.tone}
              />
              <div className="grid md:grid-cols-3 gap-8">
                {offerings.map((o) => (
                  <Link
                    key={o.slug}
                    to={`/programs/rehearsal-arc/${o.slug}`}
                    className={cn(
                      "group flex flex-col rounded-2xl border p-8 transition-transform hover:-translate-y-1",
                      t.calloutBox,
                    )}
                  >
                    <p className={editorialType.caption}>{tier.kicker}</p>
                    <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl mt-3 leading-tight")}>
                      {o.title}
                    </h3>
                    <p className="mt-3 text-sm opacity-80 leading-relaxed flex-1">
                      {o.tagline}
                    </p>
                    <div className="mt-6 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 opacity-70">
                        <Clock className="w-3.5 h-3.5" /> {o.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-transform">
                        Read the chapter <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <EditorialSection tone="paper">
        <EditorialChapterHeader
          numeral="VI"
          kicker="Downloads"
          subtitle="Each offering ships its own roadmap, facilitator playbook and program doc — free with an account."
          tone="paper"
        />
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl">
          {REHEARSAL_ARC_PROGRAM.map((o) => (
            <div key={o.slug} className="rounded-2xl border border-border bg-muted/40 p-6 space-y-3">
              <p className={editorialType.caption}>{TIER_META[o.tier].label}</p>
              <p className={cn(editorialType.serif, "text-lg leading-tight")}>{o.title}</p>
              <div className="space-y-1.5 pt-2">
                <GatedDownloadButton
                  href={`/downloads/${o.slug}-roadmap.pdf`}
                  filename={`${o.slug}-roadmap.pdf`}
                  label="Roadmap"
                  sublabel="1-page state arc"
                  offeringSlug={o.slug}
                />
                <GatedDownloadButton
                  href={`/downloads/${o.slug}-facilitator-playbook.pdf`}
                  filename={`${o.slug}-facilitator-playbook.pdf`}
                  label="Facilitator Playbook"
                  sublabel="Full state-by-state deck"
                  offeringSlug={o.slug}
                />
                <GatedDownloadButton
                  href={`/downloads/${o.slug}-program-doc.pdf`}
                  filename={`${o.slug}-program-doc.pdf`}
                  label="Program Doc"
                  sublabel="Curriculum + contract"
                  offeringSlug={o.slug}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs opacity-60 mt-6 max-w-2xl">
          Free with any Paracosm account. The same login unlocks the Calm Magic
          Board and your personal Rehearsal Arc dashboard.
        </p>
      </EditorialSection>

      <EditorialSection tone="warm">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>Begin the arc</p>
          <h2 className={cn(editorialType.serif, "text-4xl md:text-5xl leading-tight")}>
            Not sure where to start? We'll help you place yourself on the arc.
          </h2>
          <EditorialCTA href="mailto:jbelisle@helloarchitekt.com" tone="warm">
            Talk to us
          </EditorialCTA>
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
}
