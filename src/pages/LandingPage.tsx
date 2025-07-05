import { useEffect, useState } from "react";
import LeadershipRolesSection from "@/components/LeadershipRolesSection";
import CoachingApproachSection from "@/components/CoachingApproachSection";
import TransformationJourney from "@/components/TransformationJourney";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import ParacosmEventsSection from "@/components/ParacosmEventsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import RetreatAnnouncementPopup from "@/components/RetreatAnnouncementPopup";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Zap, Heart, ChevronDown, Film, Music, Palette } from 'lucide-react';
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingPage = () => {
  const [isCalmMagicAssistantOpen, setIsCalmMagicAssistantOpen] = useState(false);
  const [isRetreatAnnouncementOpen, setIsRetreatAnnouncementOpen] = useState(false);
  const [hasUserEngaged, setHasUserEngaged] = useState(false);
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
            <a href="#residencies" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Residencies</a>
            <Link to="/agentic-ux" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Agentic Ecosystems</Link>
            <button onClick={scrollToEvents} className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Events</button>
            <button onClick={scrollToRetreats} className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Retreats</button>
            <a href="#coaching-approach" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Approach</a>
            <a href="#transformation" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Transformation</a>
          </nav>
          
          {/* Mobile & Desktop Actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <LanguageSwitcher />
            <Button onClick={handleShowRetreatPopup} variant="outline" size="sm" className="hidden md:inline-flex text-xs">
              Retreat
            </Button>
            <Button onClick={handleStartCoaching} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300" size="sm">
              <span className="hidden lg:inline text-sm">Start Journey</span>
              <span className="lg:hidden text-xs">Start</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Calm Magic Assistant */}
      <CalmMagicAssistant onStartJourney={handleStartCoaching} isOpen={isCalmMagicAssistantOpen} onOpenChange={setIsCalmMagicAssistantOpen} />
      
      {/* Hero Section - Visionary Storytelling */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4 overflow-hidden">
        <div className="container relative py-8 sm:py-12 md:py-24" style={{ zIndex: 10 }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 relative z-20">
              {/* Visionary Identity */}
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <Film className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <Music className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 animate-gradient-x mb-4 sm:mb-6">
                Visionary Storyteller & Experience Architect
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-gray-700 dark:text-gray-200 px-2 font-medium">
                Creating diegetic prototypes and interactive multimodal stories to prepare minds to feel the future while helping bodies stay present
              </p>
              
              <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 px-2">
                Through films, stories, music, events, performances, and software, I create artefacts required for emergence. 
                As an experience architecture and transformational design consultancy, we enable new ways of seeing, thinking, learning, and doing.
              </p>
              
              {/* Dual Pathway Navigation */}
              <div className="flex flex-col gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
                <Link to="/agentic-ux" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-center leading-tight">AI Systems & Technical Leadership</span>
                  </Button>
                </Link>
                <Link to="/calm-magic-assistant" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-center leading-tight">Relational Intelligence & Inner Work</span>
                  </Button>
                </Link>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 px-2">
                Choose your pathway for transformational leadership through specialized coaching that bridges creative vision with technical implementation
              </p>

              {/* Scroll indicator */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">Discover our immersive experiences</p>
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
      
      {/* Three Residence Levels Section */}
      <section id="residencies">
        <LeadershipRolesSection />
      </section>
      
      {/* Paracosm Events Section */}
      <ParacosmEventsSection />
      
      {/* Coaching Approach */}
      <CoachingApproachSection />
      
      {/* Transformation Journey */}
      <TransformationJourney />
      
      {/* Partner Tools Section */}
      <section id="partners">
        <PartnerToolsSection />
      </section>
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold text-lg text-white">Paracosm</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Visionary storytelling and experience architecture that creates artefacts for emergence, enabling new ways of seeing, thinking, learning, and doing through transformational leadership coaching.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/agentic-ux" className="text-sm hover:text-purple-600">AI Leadership</Link></li>
                <li><Link to="/agentic-ux" className="text-sm hover:text-purple-600">Technical Leadership</Link></li>
                <li><Link to="/calm-magic-assistant" className="text-sm hover:text-purple-600">Relational Innovation</Link></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">Case Studies</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-sm hover:text-purple-600">About Jonathan</Link></li>
                <li><a href="#events" className="text-sm hover:text-purple-600">Events</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Methodology</a></li>
                <li><a href="#contact" className="text-sm hover:text-purple-600">Contact</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 Paracosm. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white">Medium</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
