
import { useEffect, useState } from "react";

import CoachingApproachSection from "@/components/CoachingApproachSection";
import TransformationJourney from "@/components/TransformationJourney";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import ParacosmEventsSection from "@/components/ParacosmEventsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import RetreatAnnouncementPopup from "@/components/RetreatAnnouncementPopup";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Zap, Heart, ChevronDown, Users } from 'lucide-react';
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
            <a href="#leadership-roles" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Services</a>
            <Link to="/agentic-ux" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">AI Leadership</Link>
            <Link to="/calm-magic-assistant" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Team Coaching</Link>
            <Link to="/drift" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Drift</Link>
            <a href="#events" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Events</a>
            <a href="#contact" className="text-xs xl:text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          
          {/* Mobile & Desktop Actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <LanguageSwitcher />
            <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
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
                Transformational Leadership Coaching
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
                Choose your pathway to transformational leadership through proven methodologies that create lasting change
              </p>

              {/* Lead Generation CTA */}
              <div className="flex flex-col items-center gap-2">
                <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
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
                Transformational leadership coaching that bridges vision and execution through proven methodologies for AI leadership and team development.
              </p>
              <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-slate-900">
                  Book Discovery Call
                </Button>
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/agentic-ux" className="text-sm hover:text-purple-600">AI Leadership & Strategy</Link></li>
                <li><Link to="/calm-magic-assistant" className="text-sm hover:text-purple-600">Team Coaching & Culture</Link></li>
                <li><a href="#leadership-roles" className="text-sm hover:text-purple-600">Executive Development</a></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">Case Studies</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-sm hover:text-purple-600">About Jonathan</Link></li>
                <li><a href="#events" className="text-sm hover:text-purple-600">Upcoming Events</a></li>
                <li><a href="#coaching-approach" className="text-sm hover:text-purple-600">Our Methodology</a></li>
                <li><a href="#contact" className="text-sm hover:text-purple-600">Contact Us</a></li>
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
