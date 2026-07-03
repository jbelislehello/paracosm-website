import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import ParacosmEventsSection from "@/components/ParacosmEventsSection";
import CaseStudiesSection from "@/components/case-studies/CaseStudiesSection";
import {
  EditorialPageHero,
  EditorialSection,
  EditorialCTA,
} from "@/components/editorial";
import { editorialType, editorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";
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

  const warm = editorialTone.warm;
  const clay = editorialTone.clay;
  const night = editorialTone.night;

  return (
    <div className="min-h-screen bg-[hsl(35_45%_96%)] text-foreground">
      {/* Editorial navigation */}
      <header className="fixed w-full z-50 bg-[hsl(35_45%_96%/0.9)] backdrop-blur-md border-b border-current/10">
        <div className="container max-w-6xl flex items-center justify-between py-3 px-6 mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoParacosm} alt="Paracosm" className="bg-white rounded-lg p-1 w-8 h-8 object-contain" />
              <span className={cn(editorialType.serif, "text-lg")}>Paracosm</span>
            </Link>
          </div>
          <nav className={cn("hidden md:flex gap-8 items-center", editorialType.caption)}>
            <Link to="/case-studies" className="hover:opacity-100 opacity-70 transition-opacity">Case Studies</Link>
            <Link to="/paracosm-retreat" className="hover:opacity-100 opacity-70 transition-opacity">Azores 2026</Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Editorial hero */}
      <EditorialPageHero
        numeral="07"
        kicker="Volume 07 · Live Programming & Field Notes"
        title={<>Events <em className="italic font-light">&amp;</em> Retreats.</>}
        subtitle="Where the methodology meets the room. Live sessions, immersive retreats, and case studies from Paracosm engagements."
        tone="warm"
      />

      {/* Upcoming events */}
      <EditorialSection tone="warm" id="events">
        <div className="flex items-baseline gap-6 mb-8">
          <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", warm.numeral)}>01</span>
          <p className={cn(editorialType.kicker, warm.kicker)}>{t("landing.section_events")}</p>
        </div>
        <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight max-w-3xl mb-6")}>
          Upcoming <em className="italic font-light">learning</em> events.
        </h2>
        <p className="text-base md:text-lg opacity-80 max-w-2xl mb-12">
          {t("landing.section_events_sub")}
        </p>
        <ParacosmEventsSection tone="warm" />
        <div className="mt-12">
          <EditorialCTA to="/paracosm-retreat" tone="warm" variant="ghost">
            Azores 2026 Retreat
          </EditorialCTA>
        </div>
      </EditorialSection>

      {/* Yutori Nights */}
      <EditorialSection tone="clay" id="yutori">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-8">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", clay.numeral)}>02</span>
              <p className={cn(editorialType.kicker, clay.kicker)}>Evening series</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6")}>
              Yutori <em className="italic font-light">Nights.</em>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed opacity-85 mb-4 max-w-2xl">
              A series of listening &amp; dance parties designed around hybrid cognition and creative somatics — a private event where AI meets sensory pleasures, music, and audio-visuals.
            </p>
            <p className={cn(editorialType.caption, "opacity-70")}>
              By invitation · dates announced per city
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <EditorialCTA
              href="mailto:jbelisle@helloarchitekt.com?subject=Yutori%20Nights%20—%20save%20my%20chair"
              tone="clay"
            >
              Save my chair
            </EditorialCTA>
          </div>
        </div>
      </EditorialSection>

      {/* Think Like a Forest */}
      <EditorialSection tone="night" id="think-like-a-forest">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-8">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", night.numeral)}>03</span>
              <p className={cn(editorialType.kicker, night.kicker)}>Flagship retreat</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6")}>
              Think Like a <em className="italic font-light">Forest.</em>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed opacity-85 mb-4 max-w-2xl">
              In collaboration with <em className="italic">Les Hédonistes</em> and <em className="italic">Create Yourself</em>, Paracosm holds this bi-annual multi-day retreat for leaders and visionaries to sense the whole system before intervening in it. Mycelium, roots, canopy, understory — an embodied lesson in complexity.
            </p>
            <p className={cn(editorialType.caption, "opacity-70")}>
              Dates &amp; location — TBA
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <EditorialCTA
              href="mailto:jbelisle@helloarchitekt.com?subject=Think%20Like%20a%20Forest%20—%20invitation"
              tone="night"
            >
              Read the invitation
            </EditorialCTA>
          </div>
        </div>
      </EditorialSection>

      {/* Case Studies */}
      <EditorialSection tone="paper" id="case-studies" containerClassName="max-w-6xl">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <div className="flex items-baseline gap-6">
            <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none text-primary")}>04</span>
            <div>
              <p className={cn(editorialType.kicker, "text-primary")}>Field notes</p>
              <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight mt-2")}>
                Case <em className="italic font-light">studies.</em>
              </h2>
            </div>
          </div>
          <Link to="/case-studies" className={cn(editorialType.cta, "inline-flex items-center gap-1.5 border-b border-primary text-primary pb-1 hover:translate-x-0.5 transition-transform")}>
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <CaseStudiesSection />
      </EditorialSection>

      <Footer />
    </div>
  );
};

export default EventsAndRetreats;
