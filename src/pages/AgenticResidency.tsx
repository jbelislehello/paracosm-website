import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialChapterHeader,
  EditorialCTA,
  editorialTone,
  editorialType,
} from "@/components/editorial";
import { cn } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { agenticResidencyBySlug } from "@/data/agenticResidencies";
import { useLanguage } from "@/contexts/LanguageContext";

const AgenticResidency = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const { slug = "" } = useParams<{ slug: string }>();
  const residency = agenticResidencyBySlug(slug);

  usePageSeo({
    title: residency
      ? `${residency.title} — Agentic UX Residency · Paracosm`
      : "Agentic UX Residency — Paracosm",
    description: residency
      ? residency.tagline
      : "Three ways to work with Paracosm on multi-agent surfaces.",
    path: `/agentic-ux/residencies/${slug}`,
  });

  if (!residency) {
    return <Navigate to="/agentic-ux#residencies" replace />;
  }

  const {
    numeral,
    title,
    duration,
    tagline,
    overview,
    outcomes,
    arc,
    whoItsFor,
    whatWeNeed,
    investment,
    next,
  } = residency;


  const mailto = `mailto:jbelisle@helloarchitekt.com?subject=${encodeURIComponent(
    `${title} — inquiry`,
  )}`;

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      <EditorialPageHero
        tone="warm"
        numeral={numeral}
        kicker={`${isFr ? 'Résidence' : 'Residency'} · Agentic UX · ${duration}`}
        title={<>{title}.</>}
        subtitle={tagline}
      />


      <EditorialSection tone="paper" id="overview">
        <EditorialChapterHeader
          numeral="01"
          kicker="Overview"
          subtitle="What this residency is, and what it isn't."
          tone="paper"
        />
        <div className="mt-10 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7 space-y-5">
            {overview.map((p, i) => (
              <p key={i} className={cn(editorialType.serif, "text-xl md:text-2xl leading-snug")}>
                {p}
              </p>
            ))}
          </div>
          <aside className="md:col-span-5 md:pl-8 md:border-l border-current/20">
            <p className={cn(editorialType.caption, "mb-4")}>What you leave with</p>
            <ul className="space-y-3">
              {outcomes.map((o, i) => (
                <li key={i} className="flex gap-3 leading-relaxed opacity-90">
                  <span className={cn(editorialType.serif, "opacity-60")}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </EditorialSection>

      <EditorialSection tone="warm" id="arc">
        <EditorialChapterHeader
          numeral="02"
          kicker="The arc"
          subtitle="How the weeks unfold."
          tone="warm"
        />
        <div className="mt-12 divide-y divide-current/20 border-t-2 border-current/60">
          {arc.map((phase, i) => (
            <article
              key={i}
              className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-8 items-baseline"
            >
              <span
                className={cn(
                  editorialType.serif,
                  "text-4xl md:text-5xl w-14 md:w-16",
                  editorialTone.warm.numeral,
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className={cn(editorialType.caption, "mb-2")}>{phase.label}</p>
                <p className={cn(editorialType.serif, "text-xl md:text-2xl leading-snug italic font-light opacity-90 max-w-2xl")}>
                  {phase.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection tone="paper" id="fit">
        <EditorialChapterHeader
          numeral="03"
          kicker="Who it's for"
          subtitle="The fit that makes this residency worth its weeks."
          tone="paper"
        />
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <p className={cn(editorialType.caption, "mb-4")}>Right fit</p>
            <ul className="space-y-4">
              {whoItsFor.map((item, i) => (
                <li key={i} className="border-t border-current/30 pt-3 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={cn(editorialType.caption, "mb-4")}>What we need from you</p>
            <ul className="space-y-4">
              {whatWeNeed.map((item, i) => (
                <li key={i} className="border-t border-current/30 pt-3 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 max-w-3xl opacity-80 italic leading-relaxed">{investment}</p>
      </EditorialSection>

      <EditorialSection tone="night" id="next">
        <EditorialChapterHeader
          numeral="04"
          kicker="Next step"
          subtitle="A conversation, not a proposal deck."
          tone="night"
        />
        <div className="mt-12 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8 space-y-5">
            <p className={cn(editorialType.serif, "text-3xl md:text-4xl leading-tight")}>
              Tell us what you're trying to move, and who it's for. We'll tell you honestly whether {title} is the right shape.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right flex flex-col gap-3 md:items-end">
            <EditorialCTA href={mailto} tone="night" variant="primary">
              Begin a conversation
            </EditorialCTA>
            <EditorialCTA
              to={`/agentic-ux/residencies/${next.slug}`}
              tone="night"
              variant="ghost"
            >
              Next: {next.title}
            </EditorialCTA>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-current/20">
          <Link
            to="/agentic-ux#residencies"
            className={cn(editorialType.caption, "inline-flex items-center gap-2 opacity-70 hover:opacity-100")}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Agentic UX residencies
          </Link>
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
};

export default AgenticResidency;
