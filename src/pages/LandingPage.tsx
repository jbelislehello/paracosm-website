import { useEffect, useState } from "react";

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
import BookAnnouncementBanner from "@/components/BookAnnouncementBanner";
import CrewdleAnnouncementBanner from "@/components/CrewdleAnnouncementBanner";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Zap, Heart, ChevronDown, Users, Menu, Grid3x3, Sparkles, Brain, Lightbulb, FileText, Compass, ArrowRight, Briefcase, Globe, MessageSquare, GraduationCap, Handshake, HelpCircle, BookOpen } from 'lucide-react';
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingPage = () => {
  const [isCalmMagicAssistantOpen, setIsCalmMagicAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t("page_titles.choose_coaching_path");
  }, [t]);

  const handleStartCoaching = () => {
    setIsCalmMagicAssistantOpen(true);
  };

  const scrollToMore = () => {
    const element = document.getElementById('spring-offer-home');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CrewdleAnnouncementBanner />
      <BookAnnouncementBanner />
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="bg-white rounded-lg p-1 w-8 h-8 object-contain" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">Paracosm</span>
          </div>
          
          <nav className="hidden lg:flex gap-4 xl:gap-6">
            <Link to="/agentic-ux" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">AI Leadership</Link>
            <Link to="/calm-magic-assistant" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Team Coaching</Link>
            <Link to="/calm-magic-board" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Calm Magic</Link>
            <Link to="/design-system" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Why It Works</Link>
            <Link to="/drift" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Drift</Link>
            <Link to="/tonalli" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Tonalli</Link>
            <a href="#events" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Events</a>
            <a href="#contact" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
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
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/agentic-ux" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">AI Leadership</Link>
                  <Link to="/calm-magic-assistant" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Team Coaching</Link>
                  <Link to="/calm-magic-board" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4" />
                    Calm Magic
                  </Link>
                  <Link to="/design-system" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Why It Works
                  </Link>
                  <Link to="/drift" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Drift</Link>
                  <Link to="/tonalli" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Tonalli</Link>
                  <a href="#events" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Events</a>
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Contact</a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <CalmMagicAssistant onStartJourney={handleStartCoaching} isOpen={isCalmMagicAssistantOpen} onOpenChange={setIsCalmMagicAssistantOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4 overflow-hidden">
        <div className="container relative py-8 sm:py-12 md:py-24" style={{ zIndex: 10 }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 relative z-20">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 animate-gradient-x mb-4 sm:mb-6">
                {t('landing.hero_headline')}
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-gray-700 dark:text-gray-200 px-2 font-medium">
                {t('landing.hero_description')}
              </p>
              
              <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 px-2">
                {t('landing.hero_long_description')}
              </p>
              
              <div className="flex flex-col gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
                <Link to="/agentic-ux" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-center leading-tight">{t('landing.ai_leadership')}</span>
                  </Button>
                </Link>
                <Link to="/calm-magic-assistant" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-center leading-tight">{t('landing.relational_coaching')}</span>
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOnboardingOpen(true)}
                  className="gap-2 text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Compass className="w-4 h-4" />
                  {t('landing.find_your_path')}
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 px-2">
                {t('landing.pathway_tagline')}
              </p>

              <div className="flex flex-col items-center gap-2">
                <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="text-slate-600 hover:text-purple-600 bg-white/70 hover:bg-white/90">
                    {t('landing.book_discovery')}
                  </Button>
                </a>
                <Button variant="ghost" size="sm" onClick={scrollToMore} className="animate-bounce text-slate-600 hover:text-purple-600">
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OnboardingGuide triggerOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />

      {/* NEW BOOK Promo — between Hero and Spring 2026 */}
      <section className="py-10 px-4 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto max-w-5xl">
          <Link to="/book" className="block group">
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-900/40 to-slate-900 p-6 md:p-8 hover:border-purple-400/50 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

              <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
                <div className="flex justify-center md:justify-start">
                  <div className="w-20 md:w-28 aspect-[3/4] rounded-md bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 border border-purple-400/30 shadow-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-purple-200" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <Badge className="mb-2 bg-white/10 text-white border-white/20 hover:bg-white/15">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t('book.banner_label')}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {t('book.hero_title')}
                  </h2>
                  <p className="text-purple-100/80 text-sm md:text-base mb-2">
                    {t('book.hero_subtitle')}
                  </p>
                  <p className="text-xs md:text-sm text-white/60">
                    {t('book.section_book_summary')}
                  </p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Button className="bg-white text-slate-900 hover:bg-white/90 font-semibold gap-2">
                    {t('book.banner_cta')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Spring 2026 Featured Offer — Always expanded */}
      <section id="spring-offer-home" className="py-12 px-4 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 md:p-10 shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">{t('landing.spring_badge')}</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('landing.spring_headline')}</h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {t('landing.spring_description')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs font-semibold">
              {[t('landing.spring_clarity'), t('landing.spring_decision'), t('landing.spring_alignment'), t('landing.spring_action')].map((step, i) => (
                <span key={step} className="flex items-center gap-1">
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary">{step}</span>
                  {i < 3 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { name: t('landing.spring_clarity_reset'), duration: t('landing.spring_clarity_reset_duration'), price: '$800', desc: t('landing.spring_clarity_reset_desc') },
                { name: t('landing.spring_decision_sprint'), duration: t('landing.spring_decision_sprint_duration'), price: '$1,500', desc: t('landing.spring_decision_sprint_desc') },
                { name: t('landing.spring_strategic'), duration: t('landing.spring_strategic_duration'), price: '$2,800', desc: t('landing.spring_strategic_desc') },
              ].map((tier) => (
                <div key={tier.name} className="border rounded-xl p-4 bg-accent/30 hover:bg-accent/50 transition-colors text-center">
                  <p className="font-bold text-sm">{tier.name}</p>
                  <p className="text-xs text-muted-foreground">{tier.duration}</p>
                  <p className="text-lg font-bold text-primary mt-1">{tier.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tier.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/calm-magic-assistant#spring-offer">
                <Button className="gap-2">
                  <Zap className="w-4 h-4" /> {t('landing.spring_view_offer')}
                </Button>
              </Link>
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Spring%202026%20—%20From%20Idea%20to%20Software">
                <Button variant="outline" className="gap-2">{t('landing.spring_get_started')}</Button>
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
              <div className="absolute left-6 md:left-8 top-12 bottom-12 w-px bg-gradient-to-b from-purple-400 via-blue-400 to-amber-400 opacity-30 hidden md:block" />

              {[
                { label: t('landing.step1_label'), title: t('landing.step1_title'), desc: t('landing.step1_desc'), items: [t('landing.step1_item1'), t('landing.step1_item2'), t('landing.step1_item3')], icon: Brain, gradient: 'from-purple-500 to-indigo-600', dotColor: 'bg-purple-500', labelColor: 'text-purple-600 dark:text-purple-400' },
                { label: t('landing.step2_label'), title: t('landing.step2_title'), desc: t('landing.step2_desc'), items: [t('landing.step2_item1'), t('landing.step2_item2'), t('landing.step2_item3')], icon: FileText, gradient: 'from-blue-500 to-purple-600', dotColor: 'bg-blue-500', labelColor: 'text-blue-600 dark:text-blue-400' },
                { label: t('landing.step3_label'), title: t('landing.step3_title'), desc: t('landing.step3_desc'), items: [t('landing.step3_item1'), t('landing.step3_item2'), t('landing.step3_item3')], icon: Users, gradient: 'from-teal-500 to-blue-600', dotColor: 'bg-teal-500', labelColor: 'text-teal-600 dark:text-teal-400' },
                { label: t('landing.step4_label'), title: t('landing.step4_title'), desc: t('landing.step4_desc'), items: [t('landing.step4_item1'), t('landing.step4_item2'), t('landing.step4_item3')], icon: Zap, gradient: 'from-amber-500 to-orange-600', dotColor: 'bg-amber-500', labelColor: 'text-amber-600 dark:text-amber-400' },
                { label: t('landing.step5_label'), title: t('landing.step5_title'), desc: t('landing.step5_desc'), items: [t('landing.step5_item1'), t('landing.step5_item2'), t('landing.step5_item3')], icon: Lightbulb, gradient: 'from-emerald-500 to-teal-600', dotColor: 'bg-emerald-500', labelColor: 'text-emerald-600 dark:text-emerald-400' },
              ].map((step) => (
                <div key={step.label} className="relative flex gap-4 md:gap-6 items-start">
                  <div className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white z-10`}>
                    <step.icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="flex-1 bg-card border rounded-xl p-5 shadow-sm">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${step.labelColor}`}>{step.label}</span>
                    <h3 className="text-lg font-bold mt-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {step.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className={`w-1 h-1 rounded-full ${step.dotColor}`} />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Transformation Trap */}
            <div className="mt-12 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-300">{t('landing.trap_title')}</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
                    {t('landing.trap_desc')} <strong>{t('landing.trap_result')}</strong>
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-2 font-medium">
                    {t('landing.trap_rule')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to="/auth?mode=professional">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white">
                  <Grid3x3 className="mr-2 h-4 w-4" />
                  {t('landing.start_journey')}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline">
                  {t('landing.view_pricing')}
                </Button>
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

        <CollapsibleSection
          title={t('landing.section_events')}
          subtitle={t('landing.section_events_sub')}
          icon={<Sparkles className="w-5 h-5" />}
          id="events"
        >
          <ParacosmEventsSection />
        </CollapsibleSection>

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
