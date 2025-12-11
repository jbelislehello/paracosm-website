import { useEffect, useState } from "react";

import CoachingApproachSection from "@/components/CoachingApproachSection";
import TransformationJourney from "@/components/TransformationJourney";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import ParacosmEventsSection from "@/components/ParacosmEventsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import RetreatAnnouncementPopup from "@/components/RetreatAnnouncementPopup";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Zap, Heart, ChevronDown, Users, Menu, Grid3x3, Sparkles } from 'lucide-react';
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingPage = () => {
  const [isCalmMagicAssistantOpen, setIsCalmMagicAssistantOpen] = useState(false);
  const [isRetreatAnnouncementOpen, setIsRetreatAnnouncementOpen] = useState(false);
  const [hasUserEngaged, setHasUserEngaged] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t("page_titles.choose_coaching_path");
    
    // Show retreat announcement only after user has engaged with the site
    const showRetreatPopup = () => {
      const lastShown = localStorage.getItem('lastRetreatAnnouncementShown');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (!lastShown || (now - parseInt(lastShown) > oneDay)) {
        // Only show after user has scrolled or clicked something
        if (hasUserEngaged) {
          setTimeout(() => {
            setIsRetreatAnnouncementOpen(true);
          }, 3000); // 3 second delay after engagement
        }
      }
    };

    // Track user engagement
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setHasUserEngaged(true);
      }
    };

    const handleClick = () => {
      setHasUserEngaged(true);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);

    if (hasUserEngaged) {
      showRetreatPopup();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, [t, hasUserEngaged]);

  const handleStartCoaching = () => {
    setIsCalmMagicAssistantOpen(true);
  };

  const handleCloseRetreatAnnouncement = () => {
    setIsRetreatAnnouncementOpen(false);
    localStorage.setItem('lastRetreatAnnouncementShown', Date.now().toString());
  };

  const handleShowRetreatPopup = () => {
    setIsRetreatAnnouncementOpen(true);
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
      {/* Retreat Announcement Popup */}
      <RetreatAnnouncementPopup 
        isOpen={isRetreatAnnouncementOpen} 
        onClose={handleCloseRetreatAnnouncement} 
      />
      
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-lg">Paracosm</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-4 xl:gap-6">
            <a href="#leadership-roles" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Services</a>
            <Link to="/agentic-ux" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">AI Leadership</Link>
            <Link to="/calm-magic-assistant" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Team Coaching</Link>
            <Link to="/drift" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Drift</Link>
            <Link to="/calm-magic-board" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Calm Magic Board</Link>
            <a href="#events" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Events</a>
            <a href="#contact" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <a href="#leadership-roles" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Services</a>
                <Link to="/agentic-ux" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">AI Leadership</Link>
                <Link to="/calm-magic-assistant" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Team Coaching</Link>
                <Link to="/drift" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Drift</Link>
                <Link to="/calm-magic-board" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  Calm Magic Board
                </Link>
                <a href="#events" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Events</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-purple-600 transition-colors">Contact</a>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Mobile & Desktop Actions */}
          <div className="hidden lg:flex items-center gap-1 sm:gap-2 md:gap-4">
            <LanguageSwitcher />
            <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="hidden md:inline-flex text-xs">
                Book Call
              </Button>
            </a>
            <Button onClick={handleStartCoaching} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300" size="sm">
              <span className="hidden lg:inline text-sm">Get Started</span>
              <span className="lg:hidden text-xs">Start</span>
            </Button>
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
                Expansive Leadership Coaching
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
      
      {/* Calm Magic Board Feature Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AI-Powered Innovation Tool</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Transform Tensions into Innovation
              </h2>
              <p className="text-lg text-muted-foreground">
                A 260-tile AI conversation engine that transforms "something feels off" moments into Living PRDs. Each tile sparks contextual AI dialogue, guiding you from raw tensions to actionable product specifications.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Grid3x3 className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">260-Tile AI Conversation Engine</h3>
                    <p className="text-sm text-muted-foreground">Each tile sparks contextual dialogue through GL!TCH → DRIFT → TUNE phases</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">5-Layer Living PRD Generator</h3>
                    <p className="text-sm text-muted-foreground">POLLENS → NOEMS → POEMS → TOTEMS → ANTHEMS auto-generated from your journey</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Multi-Platform Prompt Compiler</h3>
                    <p className="text-sm text-muted-foreground">Export to Lovable, Base44, Claude, or Supabase Edge Functions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Window of Tolerance Tracker</h3>
                    <p className="text-sm text-muted-foreground">Track your nervous system capacity and emotional states through the journey</p>
                  </div>
                </div>
              </div>
              
              {/* Subscription Tiers Preview */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">Free: 1 project</span>
                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">Growth: C-Suite Dashboard</span>
                <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">Scale: AI Prompt Compiler</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
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
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                {/* 5 Season Progress Indicator */}
                <div className="flex justify-between mb-4 px-2">
                  {['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'].map((season, i) => (
                    <div key={season} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-rose-500 text-white' :
                        i === 1 ? 'bg-purple-500 text-white' :
                        i === 2 ? 'bg-blue-500 text-white' :
                        i === 3 ? 'bg-green-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-[8px] mt-1 text-muted-foreground">{season}</span>
                    </div>
                  ))}
                </div>
                
                {/* 8x8 Tile Matrix */}
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isInner = row >= 2 && row <= 5 && col >= 2 && col <= 5;
                    const isStretch = !isInner && row >= 1 && row <= 6 && col >= 1 && col <= 6;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded transition-all duration-300 hover:scale-110 cursor-pointer ${
                          isInner ? 'bg-gradient-to-br from-rose-400 to-purple-400 opacity-90' :
                          isStretch ? 'bg-gradient-to-br from-purple-400 to-blue-400 opacity-70' :
                          'bg-gradient-to-br from-blue-400 to-indigo-400 opacity-50'
                        }`}
                      />
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-br from-rose-400 to-purple-400" />
                    Inner
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-400 to-blue-400" />
                    Stretch
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-400 to-indigo-400" />
                    Edge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Paracosm Events Section */}
      <section id="events">
        <ParacosmEventsSection />
      </section>
      
      {/* Coaching Approach */}
      <section id="coaching-approach">
        <CoachingApproachSection />
      </section>
      
      {/* Transformation Journey */}
      <section id="transformation">
        <TransformationJourney />
      </section>
      
      {/* Partner Tools Section */}
      <section id="partners">
        <PartnerToolsSection />
      </section>
      
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
