import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import ParacosmEventsSection from "@/components/ParacosmEventsSection";
import CaseStudiesSection from "@/components/case-studies/CaseStudiesSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { webPageSchema } from "@/lib/structuredData";

const EventsAndRetreats = () => {
  const { t } = useLanguage();

  usePageSeo({
    title: "Events & Retreats — Paracosm",
    description:
      "Live programming, retreats, and field-tested case studies from Paracosm — where executives and innovators practice AI systems mastery and relational intelligence.",
    path: "/events-and-retreats",
    jsonLd: [
      webPageSchema({
        type: "CollectionPage",
        title: "Events & Retreats — Paracosm",
        description:
          "Live programming, retreats, and case studies from the Paracosm ecosystem.",
        url: "/events-and-retreats",
      }),
    ],
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--bloom-ink))] text-white relative overflow-hidden">
      <div className="bloom-scanlines pointer-events-none fixed inset-0 opacity-[0.12] z-[5]" />
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[hsl(var(--bloom-magenta)/0.35)] blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-40 w-[520px] h-[520px] rounded-full bg-[hsl(var(--bloom-amber)/0.25)] blur-3xl" />

      {/* Navigation */}
      <header className="fixed w-full z-50 bg-[hsl(var(--bloom-ink)/0.85)] backdrop-blur-md border-b border-[hsl(var(--bloom-magenta)/0.3)]">
        <div className="container flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white hover:text-[hsl(var(--bloom-amber))]">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoParacosm} alt="Paracosm" className="bg-white rounded-lg p-1 w-8 h-8 object-contain" />
              <span className="font-display text-base bloom-chroma-static">Paracosm</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/case-studies" className="text-xs font-vhs uppercase tracking-[0.18em] hover:text-[hsl(var(--bloom-amber))] transition-colors">Case Studies</Link>
            <Link to="/paracosm-retreat" className="text-xs font-vhs uppercase tracking-[0.18em] hover:text-[hsl(var(--bloom-amber))] transition-colors">Azores 2026</Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-12 px-4 text-center z-10">
        <div className="container max-w-4xl mx-auto">
          <p className="font-vhs uppercase tracking-[0.4em] text-xs text-[hsl(var(--bloom-amber))] mb-4">// Live Programming · Field Notes</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-7 h-7 text-[hsl(var(--bloom-amber))]" />
            <h1 className="text-4xl md:text-6xl font-display bloom-chroma-static text-white leading-[1.05]">
              Events &amp; Retreats
            </h1>
            <Sparkles className="w-7 h-7 text-[hsl(var(--bloom-amber))]" />
          </div>
          <p className="text-lg md:text-xl font-redacted italic text-white/80 max-w-3xl mx-auto">
            Where the methodology meets the room. Live sessions, immersive retreats, and case studies from Paracosm engagements.
          </p>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="relative z-10 px-4 pb-12 scroll-mt-24">
        <div className="container max-w-6xl mx-auto rounded-2xl border border-[hsl(var(--bloom-magenta)/0.35)] bg-[hsl(var(--bloom-ink)/0.6)] backdrop-blur p-6 md:p-10 relative overflow-hidden">
          <div className="bloom-scanlines absolute inset-0 opacity-[0.15] pointer-events-none" />
          <div className="relative">
            <p className="font-vhs uppercase tracking-[0.35em] text-xs text-[hsl(var(--bloom-amber))]">// Upcoming</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl bloom-chroma-static text-white">{t("landing.section_events")}</h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base font-redacted italic text-white/80">{t("landing.section_events_sub")}</p>
            <div className="mt-6">
              <ParacosmEventsSection />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/paracosm-retreat">
                <Button className="bg-[hsl(var(--bloom-magenta))] text-white hover:bg-[hsl(var(--bloom-amber))] hover:text-[hsl(var(--bloom-ink))] font-vhs uppercase tracking-widest text-xs">
                  Azores 2026 Retreat <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies preview */}
      <section id="case-studies" className="relative z-10 pb-16 scroll-mt-24">
        <div className="container max-w-6xl mx-auto px-4 mb-4 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-vhs uppercase tracking-[0.35em] text-xs text-[hsl(var(--bloom-amber))]">// Field Notes</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl bloom-chroma-static text-white">Case Studies</h2>
          </div>
          <Link to="/case-studies" className="text-xs font-vhs uppercase tracking-[0.2em] text-[hsl(var(--bloom-amber))] hover:text-white transition-colors inline-flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <CaseStudiesSection />
      </section>

      <Footer />
    </div>
  );
};

export default EventsAndRetreats;
