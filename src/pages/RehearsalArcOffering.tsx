import { useParams, Link, Navigate } from "react-router-dom";
import { rehearsalOfferingBySlug } from "@/data/rehearsalArcProgram";
import {
  STATE_META,
  STATE_ORDER,
  JOURNEY_META,
  TIER_META,
  type CalmMagicState,
} from "@/data/rehearsalArcMeta";
import { usePageSeo } from "@/hooks/usePageSeo";
import { courseSchema } from "@/lib/structuredData";
import { ArrowLeft, Clock, Users } from "lucide-react";
import Footer from "@/components/Footer";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import EditorialCTA from "@/components/editorial/EditorialCTA";
import EditorialPullQuote from "@/components/editorial/EditorialPullQuote";
import GatedDownloadButton from "@/components/rehearsal/GatedDownloadButton";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

export default function RehearsalArcOffering() {
  const { slug = "" } = useParams();
  const offering = rehearsalOfferingBySlug(slug);
  if (!offering) return <Navigate to="/programs/rehearsal-arc" replace />;

  const tier = TIER_META[offering.tier];
  const tone = tier.tone;
  const styles = editorialTone[tone];

  usePageSeo({
    title: `${offering.title} — Rehearsal Arc | Paracosm`,
    description: offering.tagline,
    path: `/programs/rehearsal-arc/${offering.slug}`,
    ogType: "article",
    jsonLd: courseSchema({
      name: offering.title,
      description: offering.tagline,
      url: `/programs/rehearsal-arc/${offering.slug}`,
      about: tier.phase,
      syllabus: STATE_ORDER.map((s) => ({
        name: `${STATE_META[s].label} — ${STATE_META[s].role}`,
        description: offering.states[s].intent,
      })),
    }),
  });

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      {/* Hero */}
      <section className={cn("relative", styles.section)}>
        <div className="container max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between border-b border-current/10">
          <Link
            to="/programs/rehearsal-arc"
            className={cn(editorialType.cta, "inline-flex items-center gap-2 opacity-70 hover:opacity-100")}
          >
            <ArrowLeft className="w-4 h-4" /> The Rehearsal Arc
          </Link>
          <EditorialCTA href="mailto:jbelisle@helloarchitekt.com" tone={tone} className="!py-2 !px-4 text-[10px]">
            Enroll
          </EditorialCTA>
        </div>

        <div className="container max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-9 space-y-6">
            <p className={cn(editorialType.eyebrow, styles.kicker)}>
              {tier.label} · {tier.phase}
            </p>
            <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight")}>
              {offering.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-80 max-w-3xl leading-snug">
              {offering.tagline}
            </p>
            <div className="inline-flex items-center gap-2 text-sm opacity-70">
              <Clock className="w-4 h-4" /> {offering.duration}
            </div>
          </div>
        </div>
      </section>

      {/* Three journeys */}
      <EditorialSection tone={tone === "night" ? "paper" : "night"}>
        <EditorialChapterHeader
          numeral="I"
          kicker="Three simultaneous journeys"
          subtitle="What you'll remember, what you'll learn, who you'll become."
          tone={tone === "night" ? "paper" : "night"}
        />
        <div className="grid md:grid-cols-3 gap-8">
          <JourneyCol label="Narrative" text={offering.narrativePremise} />
          <JourneyCol label="Cognitive" text={offering.cognitiveModel} />
          <JourneyCol label="Identity" text={offering.identityShift} />
        </div>
      </EditorialSection>

      {/* 5-state walkthrough */}
      {STATE_ORDER.map((s, idx) => {
        const meta = STATE_META[s];
        const chapter = offering.states[s];
        const sTone = idx % 2 === 0 ? tone : (tone === "night" ? "warm" : "paper");
        const sStyles = editorialTone[sTone];
        return (
          <section key={s} className={cn("py-20 md:py-28 px-6", sStyles.section)}>
            <div className="container max-w-7xl mx-auto">
              <div className="flex items-baseline gap-6 mb-10 border-b border-current/10 pb-6">
                <span
                  className={cn(editorialType.serif, "text-6xl md:text-8xl leading-none")}
                  style={{ color: meta.accent }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className={editorialType.kicker}>State {idx + 1} · {meta.label}</p>
                  <p className={cn(editorialType.serif, "italic text-2xl md:text-3xl mt-1")}>
                    {meta.role}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-10">
                <div className="md:col-span-4 space-y-6">
                  <p className="text-lg leading-relaxed opacity-90">{chapter.intent}</p>
                  <EditorialPullQuote tone={sTone}>{chapter.promptQuestion}</EditorialPullQuote>
                  <div className={cn("rounded-xl border p-5 space-y-3", sStyles.calloutBox)}>
                    <p className={editorialType.caption}>Three journeys, this state</p>
                    {(Object.keys(chapter.journeys) as Array<keyof typeof chapter.journeys>).map((k) => (
                      <div key={k}>
                        <p className={cn(editorialType.eyebrow)}>{JOURNEY_META[k].label}</p>
                        <p className="text-sm mt-1 opacity-80">{chapter.journeys[k]}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm opacity-70">
                    <span className={editorialType.caption}>Artifact — </span>
                    {chapter.artifact}
                  </p>
                </div>

                <div className="md:col-span-8 space-y-4">
                  {chapter.exercises.map((e, i) => (
                    <div
                      key={i}
                      className={cn("rounded-2xl border p-6 transition-colors", sStyles.calloutBox)}
                    >
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <h4 className={cn(editorialType.serif, "text-xl md:text-2xl")}>
                          {String(i + 1).padStart(2, "0")}. {e.name}
                        </h4>
                        <span className="text-xs opacity-60 shrink-0">{e.timingMin} min</span>
                      </div>
                      <p className={cn(editorialType.caption, "mb-1")}>Intent</p>
                      <p className="text-sm mb-3 opacity-90">{e.intent}</p>
                      <p className={cn(editorialType.caption, "mb-1")}>Prompt</p>
                      <p className="text-sm mb-3 italic opacity-90">"{e.prompt}"</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className={editorialType.caption}>Materials</p>
                          <p className="opacity-80 mt-1">{e.materials}</p>
                        </div>
                        <div>
                          <p className={editorialType.caption}>Debrief</p>
                          <p className="opacity-80 mt-1">{e.debrief}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Roadmap */}
      <EditorialSection tone={tone === "clay" ? "paper" : "clay"}>
        <EditorialChapterHeader
          numeral="VI"
          kicker="Roadmap"
          subtitle="How the arc unfolds."
          tone={tone === "clay" ? "paper" : "clay"}
        />
        <ol className="space-y-3 max-w-4xl">
          {offering.roadmap.map((r, i) => {
            const meta = STATE_META[r.focus];
            return (
              <li key={i}>
                <Link
                  to={`/trainings/${offering.slug}/modules/${i + 1}`}
                  className="group flex items-start gap-6 rounded-2xl border border-border bg-muted/40 p-6 hover:bg-muted transition-colors"
                >
                  <div className={cn(editorialType.serif, "text-3xl opacity-50 w-12 shrink-0")}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className={cn(editorialType.caption, "flex items-center gap-3")}>
                      <span>{r.when}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] font-semibold text-white"
                        style={{ background: meta.accent }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div className={cn(editorialType.serif, "text-lg mt-1")}>{r.label}</div>
                    <p className="text-sm opacity-70 mt-1">{r.outcome}</p>
                  </div>
                  <span className="text-xs opacity-60 self-center group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    Open module →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </EditorialSection>

      {/* Commitment contract */}
      <EditorialSection tone={tone}>
        <EditorialChapterHeader
          numeral="VII"
          kicker="Commitment contract"
          subtitle="The smallest brave promise you'll make."
          tone={tone}
        />
        <div className={cn("rounded-2xl border p-8 max-w-3xl", styles.calloutBox)}>
          <p className={cn(editorialType.serif, "italic text-2xl leading-snug mb-6")}>
            {offering.commitmentContract.prompt}
          </p>
          <p className="text-sm opacity-80 whitespace-pre-line mb-6">
            {offering.commitmentContract.template}
          </p>
          <p className={editorialType.caption}>
            <Users className="w-3 h-3 inline mr-2" />
            Witness — {offering.commitmentContract.witness}
          </p>
        </div>

        <div className="mt-14 flex justify-center">
          <EditorialCTA href="mailto:jbelisle@helloarchitekt.com" tone={tone}>
            Begin this arc
          </EditorialCTA>
        </div>
      </EditorialSection>

      <EditorialSection tone={tone === "night" ? "paper" : "night"}>
        <EditorialChapterHeader
          numeral="VIII"
          kicker="Take it with you"
          subtitle="Full facilitator materials — free with an account."
          tone={tone === "night" ? "paper" : "night"}
        />
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
          <GatedDownloadButton
            href="/downloads/rehearsal-arc-facilitator-deck.pdf"
            filename="rehearsal-arc-facilitator-deck.pdf"
            label="Facilitator deck (PDF)"
            sublabel="Full 32-slide deck across all 9 offerings"
            offeringSlug={offering.slug}
          />
          <GatedDownloadButton
            href="/downloads/rehearsal-arc-workbook.pdf"
            filename="rehearsal-arc-workbook.pdf"
            label="Facilitator workbook (PDF)"
            sublabel="All exercises, roadmaps and commitment contracts"
            offeringSlug={offering.slug}
          />
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
}

function JourneyCol({ label, text }: { label: string; text: string }) {
  return (
    <div className="border border-current/15 bg-current/5 rounded-2xl p-8">
      <p className={editorialType.eyebrow}>{label}</p>
      <p className={cn(editorialType.serif, "italic text-xl mt-3 leading-snug")}>
        {text}
      </p>
    </div>
  );
}
