import React from "react";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { orgSchema, webPageSchema } from "@/lib/structuredData";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import EditorialPullQuote from "@/components/editorial/EditorialPullQuote";
import EditorialCTA from "@/components/editorial/EditorialCTA";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

const AboutUs = () => {
  const { t } = useLanguage();

  usePageSeo({
    title: t("page_titles.about_us"),
    description:
      "Meet Paracosm — a coaching practice for executives and innovators building Learning Organizations through AI systems mastery and relational intelligence.",
    path: "/about-us",
    jsonLd: [
      orgSchema(),
      webPageSchema({
        type: "AboutPage",
        title: "About Paracosm",
        description:
          "Meet Paracosm — a coaching practice for executives and innovators building Learning Organizations through AI systems mastery and relational intelligence.",
        url: "/about-us",
      }),
    ],
  });

  const timelineEvents = [
    { year: "1997-2003", titleKey: "about.timeline.1997_2003.title", descriptionKey: "about.timeline.1997_2003.description", caseStudy: null },
    { year: "2004-2010", titleKey: "about.timeline.2004_2010.title", descriptionKey: "about.timeline.2004_2010.description", caseStudy: null },
    { year: "2010-2015", titleKey: "about.timeline.2010_2015.title", descriptionKey: "about.timeline.2010_2015.description", caseStudy: { id: "wuxia-the-fox", title: "Wuxia the Fox" } },
    { year: "2012-2017", titleKey: "about.timeline.2012_2017.title", descriptionKey: "about.timeline.2012_2017.description", caseStudy: { id: "banff-residence", title: "Banff Emergence Lab" } },
    { year: "2014-2016", titleKey: "about.timeline.2014_2016.title", descriptionKey: "about.timeline.2014_2016.description", caseStudy: { id: "simulateur-genial", title: "Simulateur Génial!" } },
    { year: "2017-2019", titleKey: "about.timeline.2017_2019.title", descriptionKey: "about.timeline.2017_2019.description", caseStudy: { id: "machine-bienveillance", title: "La Machine à bienveillance" } },
    { year: "2019-2021", titleKey: "about.timeline.2019_2021.title", descriptionKey: "about.timeline.2019_2021.description", caseStudy: null },
    { year: "2021-2024", titleKey: "about.timeline.2021_2024.title", descriptionKey: "about.timeline.2021_2024.description", caseStudy: { id: "oaciq-elise", title: "Élise — OACIQ" } },
    { year: "2024-Present", titleKey: "about.timeline.2024_present.title", descriptionKey: "about.timeline.2024_present.description", caseStudy: { id: "codemagic-methodology", title: "CodeMagic Methodology" } },
  ];

  const paraKeys = [
    "about.intro_p1",
    "about.intro_p2",
    "about.intro_p3",
    "about.intro_p4",
    "about.intro_p5",
    "about.intro_p6",
    "about.intro_p7",
  ];

  return (
    <main className="bg-background text-foreground">
      {/* Masthead */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[hsl(35_45%_96%/0.85)] dark:bg-[hsl(25_15%_12%/0.85)] border-b border-current/10">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className={cn(editorialType.cta, "inline-flex items-center gap-1 opacity-70 hover:opacity-100")}>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoParacosm} alt="Paracosm" className="w-8 h-8 rounded-md bg-white p-1 object-contain" />
              <span className={cn(editorialType.serif, "text-base")}>Paracosm</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/trainings" className={cn(editorialType.cta, "opacity-70 hover:opacity-100")}>
              Trainings
            </Link>
            <Link to="/events-and-retreats" className={cn(editorialType.cta, "opacity-70 hover:opacity-100")}>
              Retreats
            </Link>
            <Link to="/case-studies" className={cn(editorialType.cta, "opacity-70 hover:opacity-100")}>
              Case studies
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </div>

      {/* Hero */}
      <EditorialSection tone="warm" className="pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-9 space-y-6">
            <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>
              Volume I · About
            </p>
            <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight")}>
              {t("about.page_title")}
            </h1>
            <p className="text-xl md:text-2xl opacity-80 max-w-3xl leading-snug">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </EditorialSection>

      {/* Long-form intro — magazine two-column */}
      <EditorialSection tone="paper">
        <EditorialChapterHeader numeral="I" kicker="The story so far" tone="paper" />
        <div className="grid md:grid-cols-12 gap-10 max-w-6xl">
          <div className="md:col-span-7 space-y-5 text-[17px] leading-relaxed opacity-90">
            {paraKeys.slice(0, 4).map((k) => (
              <p key={k}>{t(k)}</p>
            ))}
          </div>
          <div className="md:col-span-5 space-y-5 text-[17px] leading-relaxed opacity-90">
            {paraKeys.slice(4).map((k) => (
              <p key={k}>{t(k)}</p>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-4xl">
          <EditorialPullQuote tone="paper">{t("about.conclusion")}</EditorialPullQuote>
        </div>
      </EditorialSection>

      {/* Timeline as chapter II */}
      <EditorialSection tone="night">
        <EditorialChapterHeader
          numeral="II"
          kicker="Journey"
          subtitle={t("about.journey_title")}
          tone="night"
        />
        <p className="max-w-2xl mb-14 opacity-80 text-lg">{t("about.journey_subtitle")}</p>

        <ol className="relative border-l border-white/15 pl-8 space-y-12 max-w-4xl">
          {timelineEvents.map((event, index) => (
            <li key={index} className="relative">
              <span className="absolute -left-[37px] top-2 w-3 h-3 rounded-full bg-[hsl(45_90%_65%)]" />
              <p className={cn(editorialType.caption, "text-[hsl(45_90%_65%)] mb-2")}>
                {event.year}
              </p>
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight mb-3")}>
                {t(event.titleKey)}
              </h3>
              <p className="opacity-80 leading-relaxed max-w-2xl">{t(event.descriptionKey)}</p>
              {event.caseStudy && (
                <Link
                  to={`/case-studies#${event.caseStudy.id}`}
                  className={cn(editorialType.cta, "inline-flex items-center gap-2 mt-3 text-[hsl(45_90%_65%)] hover:opacity-80")}
                >
                  {t("case_studies.view_details")}: {event.caseStudy.title}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* CTA */}
      <EditorialSection tone="clay">
        <div className="max-w-3xl">
          <p className={cn(editorialType.eyebrow, editorialTone.clay.kicker)}>Continue</p>
          <h2 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[1.02] tracking-tight mt-4")}>
            {t("about.cta_title")}
          </h2>
          <p className="text-lg md:text-xl opacity-80 mt-6 max-w-2xl leading-relaxed">
            {t("about.cta_description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <EditorialCTA to="/agentic-ux#contact" tone="clay" variant="primary">
              {t("about.cta_professional")}
            </EditorialCTA>
            <EditorialCTA to="/calm-magic-assistant" tone="clay" variant="ghost">
              {t("about.cta_calm_magic")}
              <ArrowRight className="w-4 h-4" />
            </EditorialCTA>
          </div>
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
};

export default AboutUs;
