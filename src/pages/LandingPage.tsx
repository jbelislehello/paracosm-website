
import { useEffect, useState } from "react";
import LeadershipRolesSection from "@/components/LeadershipRolesSection";
import CoachingApproachSection from "@/components/CoachingApproachSection";
import TransformationJourney from "@/components/TransformationJourney";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import RetreatAnnouncementPopup from "@/components/RetreatAnnouncementPopup";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Zap, Heart, ChevronDown } from 'lucide-react';
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Retreat Announcement Popup */}
      <RetreatAnnouncementPopup 
        isOpen={isRetreatAnnouncementOpen} 
        onClose={handleCloseRetreatAnnouncement} 
      />
      
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-lg">Paracosm</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#leadership-roles" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.residencies")}</a>
            <a href="#coaching-approach" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.coaching_approach")}</a>
            <a href="#transformation" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.transformation")}</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <Button onClick={handleShowRetreatPopup} variant="outline" size="sm" className="hidden sm:inline-flex">
              Retreat
            </Button>
            <Button onClick={handleStartCoaching} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300" size="sm">
              <span className="hidden sm:inline">{t("hero.start_journey")}</span>
              <span className="sm:hidden">Start</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Calm Magic Assistant */}
      <CalmMagicAssistant onStartJourney={handleStartCoaching} isOpen={isCalmMagicAssistantOpen} onOpenChange={setIsCalmMagicAssistantOpen} />
      
      {/* Hero Section - Choose Your Path */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="container relative px-4 py-12 md:py-24" style={{ zIndex: 10 }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-6 sm:p-8 border border-white/20 relative z-20">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 animate-gradient-x mb-6">
                {t("hero.choose_path")}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200">
                {t("hero.transform_leadership")}
              </p>
              
              {/* Dual Pathway Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link to="/agentic-ux" className="w-full sm:w-auto">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <Zap className="w-4 h-4" />
                    <span className="text-center">{t("hero.ai_systems_leadership")}</span>
                  </Button>
                </Link>
                <Link to="/calm-magic-assistant" className="w-full sm:w-auto">
                  <Button className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <Heart className="w-4 h-4" />
                    <span className="text-center">{t("hero.relational_intelligence")}</span>
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                {t("hero.pathway_description")}
              </p>

              {/* Scroll indicator */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">Learn more about our approach</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={scrollToMore}
                  className="animate-bounce text-slate-600 hover:text-purple-600"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Three Residence Levels Section */}
      <LeadershipRolesSection />
      
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
                {t("footer.paracosm_description")}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">{t("footer.services_title")}</h3>
              <ul className="space-y-2">
                <li><Link to="/agentic-ux" className="text-sm hover:text-purple-600">{t("navigation.ai_leadership")}</Link></li>
                <li><Link to="/agentic-ux" className="text-sm hover:text-purple-600">{t("footer.technical_leadership")}</Link></li>
                <li><Link to="/calm-magic-assistant" className="text-sm hover:text-purple-600">{t("navigation.relational_innovation")}</Link></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">{t("navigation.case_studies")}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">{t("footer.company_title")}</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-sm hover:text-purple-600">{t("footer.about_jonathan")}</Link></li>
                <li><a href="#" className="text-sm hover:text-purple-600">{t("footer.methodology")}</a></li>
                <li><a href="#contact" className="text-sm hover:text-purple-600">{t("navigation.contact")}</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">{t("footer.privacy")}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 Paracosm. {t("footer.rights_reserved")}</p>
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
