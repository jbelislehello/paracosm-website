import { useState } from "react";

import logoParacosm from "@/assets/logo-paracosm.jpeg";
import CoachingApproachSection from "@/components/CoachingApproachSection";
import TransformationJourney from "@/components/TransformationJourney";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import ParacosmEventsSection from "@/components/ParacosmEventsSection";
import ParacosmUniverseSection from "@/components/ParacosmUniverseSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import ServicesShowcase from "@/components/ServicesShowcase";
import SocialProofSection from "@/components/SocialProofSection";
import OnboardingGuide from "@/components/OnboardingGuide";
import CollapsibleSection from "@/components/CollapsibleSection";


import AgenticEcosystemHero from "@/components/AgenticEcosystemHero";
import AgenticEcosystemDemo from "@/components/AgenticEcosystemDemo";
import { lazy, Suspense } from "react";
const D3GallerySection = lazy(() => import("@/components/d3/D3GallerySection"));
import FrameworkHero from "@/components/landing/FrameworkHero";
import EnterpriseGaps from "@/components/landing/EnterpriseGaps";
import MethodSteps from "@/components/landing/MethodSteps";
import ThreePaths from "@/components/landing/ThreePaths";
import OfferingTriadSection from "@/components/landing/OfferingTriadSection";
import RelationalPlaceQuote from "@/components/landing/RelationalPlaceQuote";
import NavigatorPositioningSection from "@/components/landing/NavigatorPositioningSection";
import SummerDealBanner from "@/components/landing/SummerDealBanner";
import SummerDealSection from "@/components/landing/SummerDealSection";
import CaseStudiesSection from "@/components/case-studies/CaseStudiesSection";
import WhyItWorksRecap from "@/components/resonance/WhyItWorksRecap";
import AxisLegend from "@/components/AxisLegend";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Zap, Heart, ChevronDown, Users, Menu, Grid3x3, Sparkles, Brain, Lightbulb, FileText, Compass, ArrowRight, Briefcase, Globe, MessageSquare, GraduationCap, Handshake, HelpCircle, BookOpen } from 'lucide-react';
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { orgSchema, websiteSchema, webPageSchema } from "@/lib/structuredData";

const LandingPage = () => {
  const [isCalmMagicAssistantOpen, setIsCalmMagicAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const { t } = useLanguage();

  usePageSeo({
    title: t("page_titles.choose_coaching_path"),
    description:
      "Paracosm: Trainings (Foreplay), Vision Retreats (Foresight), and Prototype Residencies (Forecast) — one arc that turns AI questions into built evidence.",
    path: "/",
    jsonLd: [
      orgSchema(),
      websiteSchema(),
      webPageSchema({
        title: "Paracosm | Foreplay · Foresight · Forecast",
        description:
          "Trainings, vision retreats, and prototype residencies — one continuous practice for learning and inventive organizations.",
        url: "/",
      }),
      
    ],
  });

  const handleStartCoaching = () => {
    setIsCalmMagicAssistantOpen(true);
  };




  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      
      <div className="fixed top-0 left-0 right-0 z-50">
        <SummerDealBanner />
        {/* Navigation — editorial masthead */}
        <header className="w-full bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="container max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center gap-3">
            <img src={logoParacosm} alt="Paracosm" className="bg-white rounded-md p-1 w-8 h-8 object-contain" />
            <span className="font-serif text-base tracking-tight">Paracosm</span>
          </div>

          <nav className="hidden lg:flex gap-4 xl:gap-6 text-base font-bold tracking-tight">
            <Link to="/" className="hover:opacity-60 transition-opacity">Editorial</Link>
            <Link to="/agentic-ux" className="hover:opacity-60 transition-opacity">AI Leadership</Link>
            <Link to="/calm-magic-assistant" className="hover:opacity-60 transition-opacity">Team Coaching</Link>
            <Link to="/calm-magic-demo" className="hover:opacity-60 transition-opacity">Calm Magic</Link>
            <Link to="/trainings" className="hover:opacity-60 transition-opacity">Trainings</Link>
            <Link to="/design-system" className="hover:opacity-60 transition-opacity">Why It Works</Link>
            <Link to="/drift" className="hover:opacity-60 transition-opacity">Drift</Link>
            <Link to="/tonalli" className="hover:opacity-60 transition-opacity">Tonalli</Link>
            <Link to="/events-and-retreats" className="hover:opacity-60 transition-opacity">Events &amp; Retreats</Link>
            <Link to="/book" className="hover:opacity-60 transition-opacity">Book</Link>
            <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
          </nav>


          <div className="flex items-center gap-2 flex-shrink-0">
            <LanguageSwitcher />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8 text-sm uppercase tracking-[0.18em] font-semibold">
                  <Link to="/agentic-ux" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity">AI Leadership</Link>
                  <Link to="/calm-magic-assistant" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity">Team Coaching</Link>
                  <Link to="/calm-magic-demo" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4" />
                    Calm Magic
                  </Link>
                  <Link to="/trainings" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Trainings
                  </Link>
                  <Link to="/design-system" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Why It Works
                  </Link>
                  <Link to="/drift" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity">Drift</Link>
                  <Link to="/tonalli" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity">Tonalli</Link>
                  <Link to="/events-and-retreats" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity">Events &amp; Retreats</Link>
                  <Link to="/book" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Book
                  </Link>
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity">Contact</a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      </div>


      
      <CalmMagicAssistant onStartJourney={handleStartCoaching} isOpen={isCalmMagicAssistantOpen} onOpenChange={setIsCalmMagicAssistantOpen} />
      
      <FrameworkHero onScrollToMethod={() => document.getElementById('method-steps')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* Anchor statement */}
      <RelationalPlaceQuote />

      {/* Practitioner positioning: Calm Magic as navigator across Crewdle / Lovable / Base44 */}
      <NavigatorPositioningSection />

      {/* Triad: Foreplay (Trainings) → Foresight (Retreats) → Forecast (Residencies) */}
      <OfferingTriadSection />

      {/* Summer Deal offer */}
      <SummerDealSection />

      {/* Field proof: case studies excerpt */}
      <section id="case-studies-excerpt" className="py-16 px-4 bg-background">
        <div className="container max-w-6xl mx-auto mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">// Field notes</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold">Case studies from the arc.</h2>
          </div>
          <Link
            to="/case-studies"
            className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 inline-flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <CaseStudiesSection />
      </section>

      <OnboardingGuide triggerOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />

      <EnterpriseGaps />

      <section className="py-16 px-4">
        <div className="container max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">The five axes</p>
            <h2 className="text-2xl md:text-3xl font-bold">Every question, team, and product lives on these five.</h2>
          </div>
          <AxisLegend intro="The Calm Magic board uses five axes to give your organization shared meaning — so AI doesn't just automate, it helps you learn and invent." />
        </div>
      </section>

      <MethodSteps />

      <WhyItWorksRecap lens="method" />

      

      <Suspense fallback={null}>
        <D3GallerySection />
      </Suspense>

      {/* NEW BOOK Promo — editorial dispatch (paper) */}
      <section className="py-16 px-6 bg-[hsl(35_45%_96%)] text-foreground border-y border-current/10">
        <div className="container mx-auto max-w-5xl">
          <Link to="/book" className="block group">
            <div className="relative border border-current/15 bg-background/60 p-8 md:p-12 hover:-translate-y-1 transition-transform">
              <div className="grid md:grid-cols-[auto_1fr_auto] gap-8 md:gap-12 items-center">
                <div className="flex justify-center md:justify-start">
                  <div className="w-24 md:w-32 aspect-[3/4] border border-[hsl(15_75%_55%)]/40 bg-background flex items-center justify-center">
                    <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-[hsl(15_75%_45%)]" />
                  </div>
                </div>
                <div className="text-center md:text-left space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[hsl(15_75%_45%)] inline-flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    {t('book.banner_label')}
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl leading-tight italic">
                    {t('book.hero_title')}
                  </h2>
                  <p className="text-sm md:text-base opacity-85">
                    {t('book.hero_subtitle')}
                  </p>
                  <p className="text-xs md:text-sm opacity-60">
                    {t('book.section_book_summary')}
                  </p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-xs font-semibold uppercase tracking-[0.2em]">
                    {t('book.banner_cta')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>


      {/* Spring 2026 Featured Offer — editorial column */}
      <section id="spring-offer-home" className="py-20 px-6 bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)]">
        <div className="container mx-auto max-w-4xl">
          <div className="border-t-2 border-current/30 pt-10">
            <p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[hsl(15_75%_45%)]">{t('landing.spring_badge')}</p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight mt-3">{t('landing.spring_headline')}</h2>
            <p className="mt-4 text-base opacity-80 max-w-2xl">
              {t('landing.spring_description')}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-8 mb-10 text-[10px] uppercase tracking-[0.3em] font-semibold">
              {[t('landing.spring_clarity'), t('landing.spring_decision'), t('landing.spring_alignment'), t('landing.spring_action')].map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 border border-current/30">{step}</span>
                  {i < 3 && <ArrowRight className="w-3 h-3 opacity-50" />}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { name: t('landing.spring_clarity_reset'), duration: t('landing.spring_clarity_reset_duration'), price: '$800', desc: t('landing.spring_clarity_reset_desc') },
                { name: t('landing.spring_decision_sprint'), duration: t('landing.spring_decision_sprint_duration'), price: '$1,500', desc: t('landing.spring_decision_sprint_desc') },
                { name: t('landing.spring_strategic'), duration: t('landing.spring_strategic_duration'), price: '$2,800', desc: t('landing.spring_strategic_desc') },
              ].map((tier, i) => (
                <div key={tier.name} className="border-t border-current/20 pt-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 tabular-nums">0{i + 1}</p>
                  <p className="font-serif text-xl leading-tight mt-2">{tier.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 mt-1">{tier.duration}</p>
                  <p className="font-serif text-3xl mt-3 text-[hsl(15_75%_45%)]">{tier.price}</p>
                  <p className="text-sm opacity-75 mt-2">{tier.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link to="/calm-magic-assistant#spring-offer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-xs font-semibold uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform">
                <Zap className="w-4 h-4" /> {t('landing.spring_view_offer')}
              </Link>
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Spring%202026%20—%20From%20Idea%20to%20Software" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-current/40 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-current/10 transition-colors">
                {t('landing.spring_get_started')}
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Collapsible Sections */}
      <div className="container mx-auto max-w-5xl px-4 py-8 space-y-2">
        
        {/* Intention Design */}
        <CollapsibleSection
          title={t('landing.intention_title')}
          subtitle={t('landing.intention_subtitle')}
          icon={<Brain className="w-5 h-5" />}
          id="leadership-roles"
        >
          <div className="py-8 space-y-6">
            <p className="text-sm text-muted-foreground max-w-xl mx-auto text-center">
              {t('landing.intention_description')}
            </p>

            <div className="relative space-y-6">
              <div className="absolute left-6 md:left-8 top-12 bottom-12 w-px bg-current/20 hidden md:block" />

              {[
                { label: t('landing.step1_label'), title: t('landing.step1_title'), desc: t('landing.step1_desc'), items: [t('landing.step1_item1'), t('landing.step1_item2'), t('landing.step1_item3')], icon: Brain },
                { label: t('landing.step2_label'), title: t('landing.step2_title'), desc: t('landing.step2_desc'), items: [t('landing.step2_item1'), t('landing.step2_item2'), t('landing.step2_item3')], icon: FileText },
                { label: t('landing.step3_label'), title: t('landing.step3_title'), desc: t('landing.step3_desc'), items: [t('landing.step3_item1'), t('landing.step3_item2'), t('landing.step3_item3')], icon: Users },
                { label: t('landing.step4_label'), title: t('landing.step4_title'), desc: t('landing.step4_desc'), items: [t('landing.step4_item1'), t('landing.step4_item2'), t('landing.step4_item3')], icon: Zap },
                { label: t('landing.step5_label'), title: t('landing.step5_title'), desc: t('landing.step5_desc'), items: [t('landing.step5_item1'), t('landing.step5_item2'), t('landing.step5_item3')], icon: Lightbulb },
              ].map((step, idx) => (
                <div key={step.label} className="relative flex gap-4 md:gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 border border-current/30 bg-background flex items-center justify-center z-10">
                    <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 border-t border-current/20 pt-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 tabular-nums">Step 0{idx + 1}</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[hsl(15_75%_45%)] mt-1">{step.label}</p>
                    <h3 className="font-serif text-xl md:text-2xl leading-tight mt-2">{step.title}</h3>
                    <p className="text-sm opacity-75 mt-2">{step.desc}</p>
                    <ul className="mt-3 space-y-1 text-sm opacity-75">
                      {step.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-current opacity-50" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Transformation Trap */}
            <div className="mt-12 border-l-2 border-[hsl(15_75%_55%)] pl-6 py-2">
              <p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[hsl(15_75%_45%)]">{t('landing.trap_title')}</p>
              <p className="font-serif text-lg italic mt-2 leading-snug">
                {t('landing.trap_desc')} <strong className="not-italic">{t('landing.trap_result')}</strong>
              </p>
              <p className="text-sm opacity-75 mt-3">
                {t('landing.trap_rule')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link to="/auth?mode=professional" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-xs font-semibold uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform">
                <Grid3x3 className="h-4 w-4" />
                {t('landing.start_journey')}
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-current/40 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-current/10 transition-colors">
                {t('landing.view_pricing')}
              </Link>
            </div>
          </div>
        </CollapsibleSection>

        
        <CollapsibleSection
          title={t('landing.section_services')}
          subtitle={t('landing.section_services_sub')}
          icon={<Briefcase className="w-5 h-5" />}
        >
          <ServicesShowcase />
        </CollapsibleSection>

        <CollapsibleSection
          title={t('landing.section_universe')}
          subtitle={t('landing.section_universe_sub')}
          icon={<Globe className="w-5 h-5" />}
          id="universe"
        >
          <ParacosmUniverseSection />
        </CollapsibleSection>

        <section id="events" className="relative scroll-mt-24 my-12 border border-current/15 bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)] text-foreground overflow-hidden">
          <div className="relative px-6 md:px-10 pt-12 pb-6 border-b border-current/15">
            <p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[hsl(15_75%_45%)]">Live Programming</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl leading-tight">
              {t('landing.section_events')}
            </h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base italic opacity-80 font-serif">
              {t('landing.section_events_sub')}
            </p>
          </div>
          <div className="relative px-6 md:px-10 py-10">
            <ParacosmEventsSection />
          </div>
        </section>

        <CollapsibleSection
          title={t('landing.section_coaching')}
          subtitle={t('landing.section_coaching_sub')}
          icon={<MessageSquare className="w-5 h-5" />}
          id="coaching-approach"
        >
          <CoachingApproachSection />
        </CollapsibleSection>

        <CollapsibleSection
          title={t('landing.section_social_proof')}
          subtitle={t('landing.section_social_proof_sub')}
          icon={<GraduationCap className="w-5 h-5" />}
        >
          <SocialProofSection />
        </CollapsibleSection>

        <CollapsibleSection
          title={t('landing.section_transformation')}
          subtitle={t('landing.section_transformation_sub')}
          icon={<ArrowRight className="w-5 h-5" />}
          id="transformation"
        >
          <TransformationJourney />
        </CollapsibleSection>

        <CollapsibleSection
          title={t('landing.section_partners')}
          subtitle={t('landing.section_partners_sub')}
          icon={<Handshake className="w-5 h-5" />}
          id="partners"
        >
          <PartnerToolsSection />
        </CollapsibleSection>

        <CollapsibleSection
          title={t('landing.section_faq')}
          subtitle={t('landing.section_faq_sub')}
          icon={<HelpCircle className="w-5 h-5" />}
        >
          <FAQSection />
        </CollapsibleSection>
      </div>
      
      {/* Contact Section */}
      <section id="contact">
        <ContactSection />
      </section>
      
      <div className="text-center py-4 border-t border-border/50">
        <Link to="/design-system" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          {t('landing.view_design_system')}
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
