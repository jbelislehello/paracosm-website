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

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Zap, Heart, ChevronDown, Users, Menu, Grid3x3, Sparkles, Brain, Lightbulb, FileText, Compass, ArrowRight } from 'lucide-react';
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
    const element = document.getElementById('leadership-roles');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEvents = () => {
    const element = document.getElementById('events');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRetreats = () => {
    const element = document.getElementById('partners');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="bg-white rounded-lg p-1 w-8 h-8 object-contain" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">Paracosm</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-4 xl:gap-6">
            <Link to="/agentic-ux" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">AI Leadership</Link>
            <Link to="/calm-magic-assistant" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Team Coaching</Link>
            <Link to="/calm-magic-board" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Calm Magic</Link>
            <Link to="/drift" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Drift</Link>
            <Link to="/tonalli" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Tonalli</Link>
            <Link to="/tarot" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Tarot</Link>
            <a href="#events" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Events</a>
            <a href="#contact" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          
          {/* Right-side actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <LanguageSwitcher />
            {/* Mobile Menu */}
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
                  <Link to="/drift" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Drift</Link>
                  <Link to="/tonalli" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Tonalli</Link>
                  <Link to="/tarot" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Tarot
                  </Link>
                  <a href="#events" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Events</a>
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Contact</a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Calm Magic Assistant */}
      <CalmMagicAssistant onStartJourney={handleStartCoaching} isOpen={isCalmMagicAssistantOpen} onOpenChange={setIsCalmMagicAssistantOpen} />
      
      {/* Hero Section - Clear Value Proposition */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4 overflow-hidden">
        <div className="container relative py-8 sm:py-12 md:py-24" style={{ zIndex: 10 }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 relative z-20">
              {/* Clear Value Proposition */}
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 animate-gradient-x mb-4 sm:mb-6">
                Building Learning Organizations
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-gray-700 dark:text-gray-200 px-2 font-medium">
                Bridge the gap between vision and execution through specialized coaching that aligns technical innovation with human intelligence
              </p>
              
              <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 px-2">
                We help leaders and organizations create breakthrough innovations by developing the specific capabilities needed for each stage of transformation: visionary leadership, technical excellence, and learning-oriented culture.
              </p>
              
              {/* Clear Service Pathways */}
              <div className="flex flex-col gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
                <Link to="/agentic-ux" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-center leading-tight">AI Leadership & Technical Strategy</span>
                  </Button>
                </Link>
                <Link to="/calm-magic-assistant" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-center leading-tight">Relational Intelligence & Team Coaching</span>
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
                  Find Your Path
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 px-2">
                Choose your pathway to expansive leadership through proven methodologies that create lasting change
              </p>

              {/* Lead Generation CTA */}
              <div className="flex flex-col items-center gap-2">
                <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt" target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-slate-600 hover:text-purple-600 bg-white/70 hover:bg-white/90"
                  >
                    Book Free Discovery Call
                  </Button>
                </a>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={scrollToMore}
                  className="animate-bounce text-slate-600 hover:text-purple-600"
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Onboarding Guide */}
      <OnboardingGuide triggerOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />

      {/* Spring 2026 Featured Offer */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 md:p-10 shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Limited to 5 slots / month</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Spring 2026 — From Idea to Software</h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              When you're stuck, I cut through it fast. I help people make the decisions they're avoiding when things get complex.
            </p>

            {/* Core Engine */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs font-semibold">
              {['Clarity', 'Decision', 'Alignment', 'Action'].map((step, i) => (
                <span key={step} className="flex items-center gap-1">
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary">{step}</span>
                  {i < 3 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                </span>
              ))}
            </div>

            {/* 3 Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { name: 'Clarity Reset', duration: '7 days', price: '$800', desc: 'From confusion to a clear, executable decision' },
                { name: 'Decision Sprint', duration: '14 days', price: '$1,500', desc: 'AI-augmented analysis with accountability loop' },
                { name: 'Strategic Intervention', duration: 'Monthly', price: '$2,800', desc: 'Full Board access + ongoing strategic support' },
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
                  <Zap className="w-4 h-4" /> View Full Offer
                </Button>
              </Link>
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Spring%202026%20—%20From%20Idea%20to%20Software">
                <Button variant="outline" className="gap-2">Get Started</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intention Design Philosophy Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-5xl">
          {/* Part 1 — Philosophy Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              From Tool Selection to Intention Design
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Organizations don't need more tools. They need to design their collective intelligence.
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              With AI agents and orchestrators, "which software should we buy?" becomes obsolete. The real question: what organizational intelligence do we want to activate?
            </p>
          </div>

          {/* Part 2 — 5-Step Pipeline */}
          <div className="relative space-y-6">
            {/* Connecting line */}
            <div className="absolute left-6 md:left-8 top-12 bottom-12 w-px bg-gradient-to-b from-purple-400 via-blue-400 to-amber-400 opacity-30 hidden md:block" />

            {/* Step 1 — Paracosm */}
            <div className="relative flex gap-4 md:gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white z-10">
                <Brain className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 bg-card border rounded-xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Step 1</span>
                <h3 className="text-lg font-bold mt-1">Paracosm — Define Collective Intention</h3>
                <p className="text-sm text-muted-foreground mt-1">Coaching CEOs and teams to become learning organizations that reconfigure themselves.</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500" />Identify organizational tensions & cognitive load</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500" />Shift from task execution to system design</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500" />Orchestrate humans, agents, and decision processes</li>
                </ul>
              </div>
            </div>

            {/* Step 2 — Calm Magic Living PRD (with matrix) */}
            <div className="relative flex gap-4 md:gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white z-10">
                <FileText className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 bg-card border rounded-xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Step 2</span>
                    <h3 className="text-lg font-bold mt-1">Calm Magic — Transform Intention into Living Infrastructure</h3>
                    <p className="text-sm text-muted-foreground mt-1">Structured conversation becomes operational infrastructure through the 5-layer PRD engine.</p>
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500" />Collective dialogue surfaces real tensions</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500" />Intentions emerge as living requirements</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500" />PRD becomes an organism linking strategy, experience, operations & learning</li>
                    </ul>
                  </div>
                  {/* 8x8 Matrix Visualization */}
                  <div className="flex-shrink-0 self-center">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
                      <div className="grid grid-cols-8 gap-0.5">
                        {Array.from({ length: 64 }).map((_, i) => {
                          const row = Math.floor(i / 8);
                          const col = i % 8;
                          const isInner = row >= 2 && row <= 5 && col >= 2 && col <= 5;
                          const isStretch = !isInner && row >= 1 && row <= 6 && col >= 1 && col <= 6;
                          return (
                            <div
                              key={i}
                              className={`w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all duration-300 ${
                                isInner ? 'bg-gradient-to-br from-blue-400 to-purple-400 opacity-90' :
                                isStretch ? 'bg-gradient-to-br from-purple-400 to-indigo-400 opacity-60' :
                                'bg-gradient-to-br from-indigo-400 to-slate-400 opacity-30'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-center gap-2 mt-2 text-[9px] text-muted-foreground">
                        {['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'].map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 — UX Engineering */}
            <div className="relative flex gap-4 md:gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white z-10">
                <Users className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 bg-card border rounded-xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Step 3</span>
                <h3 className="text-lg font-bold mt-1">UX Engineering — Design Human-Agent Behaviors</h3>
                <p className="text-sm text-muted-foreground mt-1">Define agent roles as virtual employees before any technology is deployed.</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-teal-500" />Mission, authority, inputs & outputs for each agent</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-teal-500" />Trust, responsibility & human-AI collaboration design</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-teal-500" />Agent Opportunity Map from cognitive friction points</li>
                </ul>
              </div>
            </div>

            {/* Step 4 — Orchestration */}
            <div className="relative flex gap-4 md:gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white z-10">
                <Zap className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 bg-card border rounded-xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Step 4</span>
                <h3 className="text-lg font-bold mt-1">Orchestration — Execute via Agent Coordination</h3>
                <p className="text-sm text-muted-foreground mt-1">Progressive automation: human executes → agent assists → agent executes → human supervises → human designs.</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-500" />Observational agents first, then assistance, then execution</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-500" />Secure information routing & task delegation</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-500" />Never automate before understanding</li>
                </ul>
              </div>
            </div>

            {/* Step 5 — Learning Organization */}
            <div className="relative flex gap-4 md:gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white z-10">
                <Lightbulb className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 bg-card border rounded-xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Step 5</span>
                <h3 className="text-lg font-bold mt-1">Learning Organization — Learn & Evolve Continuously</h3>
                <p className="text-sm text-muted-foreground mt-1">Every quarter: What agent is no longer useful? What decision can disappear? What human time was freed?</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-500" />Managers become organizational UX Engineers</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-500" />Teams design the systems that execute</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-500" />Organization becomes self-evolving</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Part 3 — Transformation Trap Callout */}
          <div className="mt-12 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 dark:text-amber-300">The Major Transformation Trap</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
                  Every organization makes the same mistake: they say they want to transform, then immediately start comparing platforms, running technical POCs, and selecting tools. Result: <strong>automation of existing chaos.</strong>
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-2 font-medium">
                  Our first rule: no tool is selected during the initial phase.
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/auth?mode=professional">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white">
                <Grid3x3 className="mr-2 h-4 w-4" />
                Start Free Journey
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Services Showcase */}
      <ServicesShowcase />

      {/* Paracosm Universe Section - Wuxia the Fox & Creative Projects */}
      <section id="universe">
        <ParacosmUniverseSection />
      </section>
      
      {/* Paracosm Events Section */}
      <section id="events">
        <ParacosmEventsSection />
      </section>
      
      {/* Coaching Approach */}
      <section id="coaching-approach">
        <CoachingApproachSection />
      </section>

      {/* Social Proof */}
      <SocialProofSection />
      
      {/* Transformation Journey */}
      <section id="transformation">
        <TransformationJourney />
      </section>
      
      {/* Partner Tools Section */}
      <section id="partners">
        <PartnerToolsSection />
      </section>
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Contact Section */}
      <section id="contact">
        <ContactSection />
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
