import { useEffect, useState, useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import AgentInteractionDemo from "@/components/AgentInteractionDemo";
import ProductDevelopmentAssistant from "@/components/ProductDevelopmentAssistant";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import MobileSectionNav from "@/components/MobileSectionNav";
import GradientDivider from "@/components/GradientDivider";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Bot, Brain, TrendingUp, Target, Cog, Compass, Zap, Heart, Users, Menu, X, Mic, Eye } from 'lucide-react';
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const MOBILE_NAV_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "ai-leadership", label: "AI Leadership" },
  { id: "living-prd", label: "Living PRD" },
  { id: "relational", label: "Relational Innovation" },
  { id: "contact", label: "Contact" },
];

const Index = () => {
  const [showAgentDemo, setShowAgentDemo] = useState(false);
  const [showFrameworkPanel, setShowFrameworkPanel] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { t } = useLanguage();
  const aiLeadershipReveal = useScrollReveal();
  const livingPrdReveal = useScrollReveal();
  const relationalReveal = useScrollReveal();
  const tonalliReveal = useScrollReveal();
  const contactReveal = useScrollReveal();

  // Smart header hide/show on scroll
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY.current;
    
    // Only hide/show after scrolling past header height (60px)
    if (currentScrollY > 60) {
      if (scrollDelta > 5) {
        // Scrolling down - hide header
        setHeaderVisible(false);
      } else if (scrollDelta < -5) {
        // Scrolling up - show header
        setHeaderVisible(true);
      }
    } else {
      // At top - always show header
      setHeaderVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    document.title = "Paracosm - AI Leadership & Innovation";
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleDiscoverFramework = () => {
    setShowAgentDemo(true);
    setShowFrameworkPanel(true);
  };

  const navLinks = [
    { href: "#ai-leadership", label: t("navigation.ai_leadership") },
    { href: "/calm-magic-assistant", label: t("navigation.relational_innovation"), isLink: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header 
        className={`fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container flex items-center justify-between py-3 px-4 md:py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-base md:text-lg">Paracosm</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#ai-leadership" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.ai_leadership")}</a>
            <Link to="/calm-magic-assistant" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.relational_innovation")}</Link>
            <Link to="/glitch-methodology" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.glitch_methodology")}</Link>
            <LanguageSwitcher />
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                Explore Coaching
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <a 
                    href="#ai-leadership" 
                    className="text-lg font-medium hover:text-purple-600 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("navigation.ai_leadership")}
                  </a>
                  <Link 
                    to="/calm-magic-assistant" 
                    className="text-lg font-medium hover:text-purple-600 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("navigation.relational_innovation")}
                  </Link>
                  <Link 
                    to="/glitch-methodology" 
                    className="text-lg font-medium hover:text-purple-600 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("navigation.glitch_methodology")}
                  </Link>
                  <div className="h-px bg-border my-2" />
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                      Explore Coaching
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Product Development Assistant - Framework Panel */}
      <ProductDevelopmentAssistant 
        onStartJourney={handleDiscoverFramework} 
        isOpen={showFrameworkPanel} 
        onOpenChange={setShowFrameworkPanel} 
      />
      {/* Mobile Section Navigation Dots */}
      <MobileSectionNav sections={MOBILE_NAV_SECTIONS} />
      
      {/* Hero Section - Paracosm Focus */}
      <section id="hero">
        <HeroSection onDiscoverFramework={handleDiscoverFramework} />
      </section>

      <GradientDivider />
      
      {/* AI Leadership Section */}
      <section id="ai-leadership" ref={aiLeadershipReveal.ref} className={`py-12 md:py-20 px-4 bg-gradient-to-r from-blue-50 via-purple-50 to-slate-50 dark:from-blue-950/20 dark:via-purple-950/20 opacity-0 ${aiLeadershipReveal.isVisible ? 'animate-scroll-fade-up' : ''}`}>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              AI Leadership Excellence
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-2">
              Master the integration of AI systems and technical leadership through our comprehensive framework 
              that bridges creative vision with engineering implementation.
            </p>
          </div>

          {/* Framework Overview */}
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              {t("framework.imagineering_to_engineering")}
            </h3>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed text-center mb-8 md:mb-12 px-2">
              Bridge the gap between creative vision and technical implementation with our comprehensive 
              two-phase framework that preserves innovation through the entire development lifecycle.
            </p>

            {/* Phase Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
              {/* Phase 1 Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-blue-200 dark:border-blue-800 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Phase 1</h3>
                      <p className="text-blue-100">Understanding the Problem</p>
                    </div>
                  </div>
                  <div className="text-sm bg-blue-600/30 rounded-lg p-3">
                    <strong>Steps 1-3:</strong> Research, Ideation, Prototyping
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-200">What You Do:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Compass className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Study how people actually work and what frustrates them</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Talk to stakeholders about their real needs and pain points</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Build a working demo that tells a story about how things could work better</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                      <strong>Key Output:</strong> A diegetic prototype that shows the vision in action, not just describes it
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase 2 Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-purple-200 dark:border-purple-800 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Cog className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Phase 2</h3>
                      <p className="text-purple-100">Making It Real</p>
                    </div>
                  </div>
                  <div className="text-sm bg-purple-600/30 rounded-lg p-3">
                    <strong>Steps 4-7:</strong> Documentation, Handover, Development
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h4 className="font-semibold text-lg text-purple-800 dark:text-purple-200">What You Do:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Turn the demo into clear technical requirements</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Bot className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Document exactly what needs to be built and how it should work</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Hand everything over to engineers with context intact</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Cog className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Begin actual development with preserved vision</span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                      <strong>Key Output:</strong> Engineering teams understand not just what to build, but why
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Framework Benefits */}
            <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                  Why This Framework Prevents Project Failure
                </h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-2">
                  Most projects fail because there's a gap between "good idea" and "working product." 
                  Our framework creates a bridge that preserves innovation through implementation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Diegetic Prototype</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A demo that feels real and tells a complete story</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Systems Intelligence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Technical specs that preserve the original vision</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ArrowRight className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Handover Ritual</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Engineers understand not just what to build, but why</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8 md:mt-12">
              <Button onClick={handleDiscoverFramework} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 w-full sm:w-auto">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore the Framework
              </Button>
            </div>
          </div>

          {/* Agent Interaction Demo */}
          {showAgentDemo && (
            <div className="mb-12 md:mb-16">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">Experience Agentic Intelligence</h3>
              <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-10 md:mb-16 px-2 text-sm md:text-base">
                Interact with specialized AI agents that collaborate to solve complex problems. 
                Watch how they coordinate, learn, and adapt to create innovative solutions.
              </p>
              
              <AgentInteractionDemo />
            </div>
          )}
          
          {/* Network Visualization - Agentic Context */}
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">Visualize Your Agentic Network</h3>
            <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-10 md:mb-16 px-2 text-sm md:text-base">
              See how AI agents interconnect, share knowledge, and collaborate to create emergent intelligence 
              that goes beyond individual capabilities.
            </p>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 md:p-6 overflow-hidden">
              <NetworkVisualization />
            </div>
          </div>
          
          {/* Key Features */}
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10 md:mb-16">Agentic UX Capabilities</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              <FeatureCard 
                title="Multi-Agent Orchestration"
                description="Coordinate multiple specialized AI agents to tackle complex, multi-faceted challenges"
                icon={Bot}
                color="from-blue-500 to-blue-600"
              />
              <FeatureCard 
                title="Emergent Intelligence"
                description="Watch as agent interactions create solutions beyond individual agent capabilities"
                icon={Brain}
                color="from-purple-500 to-purple-600"
              />
              <FeatureCard 
                title="Adaptive Learning"
                description="Agents continuously learn from interactions and improve their collaborative performance"
                icon={TrendingUp}
                color="from-green-500 to-green-600"
              />
            </div>
          </div>

          {/* Partner Tools Section */}
          <PartnerToolsSection />
        </div>
      </section>

      <GradientDivider />

      {/* Living PRD Section */}
      <section id="living-prd" ref={livingPrdReveal.ref} className={`py-12 md:py-16 px-4 bg-gradient-to-r from-blue-50 via-purple-50 to-rose-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-rose-950/20 opacity-0 ${livingPrdReveal.isVisible ? 'animate-scroll-slide-up' : ''}`}>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600">
              From Vision to Living PRD
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-4 max-w-3xl mx-auto px-2">
              The Calm Magic Board transforms your Imagineering insights into actionable Living PRDs 
              that evolve with your product journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-center mb-2">GL!TCH → POLLENS</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Capture tensions and signals that inform your product direction
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-center mb-2">DRIFT → POEMS</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Explore narratives and possibilities that shape your vision
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-rose-200 dark:border-rose-800">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Cog className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-center mb-2">TUNE → TOTEMS</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Crystallize requirements into actionable specifications
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link to="/calm-magic-board?mode=professional">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 w-full sm:w-auto">
                <Sparkles className="w-5 h-5 mr-2" />
                Open Calm Magic Board
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* Relational Innovation Bridge Section */}
      <section id="relational" ref={relationalReveal.ref} className={`py-12 md:py-16 px-4 bg-gradient-to-r from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20 opacity-0 ${relationalReveal.isVisible ? 'animate-scroll-fade-up' : ''}`}>
        <div className="container max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-purple-600">
            Bridge to Relational Innovation
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 md:mb-8 max-w-3xl mx-auto px-2">
            Technical excellence requires human excellence. Discover how individual coaching and team learning 
            skills amplify your AI leadership capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link to="/calm-magic-assistant" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center justify-center gap-2 py-5">
                <Heart className="w-4 h-4" />
                Explore Relational Innovation
              </Button>
            </Link>
            <Link to="/calm-magic-board?mode=personal" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 py-5">
                <Compass className="w-4 h-4" />
                Personal Expansion Journal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* Tonalli Initiative */}
      <section ref={tonalliReveal.ref} className={`py-12 md:py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-950 opacity-0 ${tonalliReveal.isVisible ? 'animate-scroll-slide-up' : ''}`}>
        <div className="container max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.08),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-amber-100">
                Tonalli Initiative
              </h2>
              <p className="text-amber-200/70 mb-8 max-w-2xl text-base md:text-lg">
                Object-based interaction art — a companion IO platform exploring consent-first voice and spatial design.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 bg-amber-500/5 rounded-lg p-4 border border-amber-500/10">
                  <Mic className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-100 text-sm">Voice Branch</h3>
                    <p className="text-xs text-amber-200/50">Dignity-first consent interaction</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-amber-500/5 rounded-lg p-4 border border-amber-500/10">
                  <Eye className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-100 text-sm">Spatial Branch</h3>
                    <p className="text-xs text-amber-200/50">Educational design platforms</p>
                  </div>
                </div>
              </div>
              <Link to="/tonalli">
                <Button className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-5">
                  Discover Tonalli
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* Contact Section */}
      <section id="contact" ref={contactReveal.ref} className={`opacity-0 ${contactReveal.isVisible ? 'animate-scroll-fade-up' : ''}`}>
        <ContactSection />
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
