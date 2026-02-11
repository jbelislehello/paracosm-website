import { useEffect, useState } from "react";
import CoachingServices from "@/components/calm-magic/CoachingServices";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import BoardEntryGate from "@/components/calm-magic/BoardEntryGate";

const RelationalHealing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showBoardGate, setShowBoardGate] = useState(false);

  useEffect(() => {
    document.title = t("page_titles.relational_intelligence");
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20">
      {/* Navigation */}
      <header className="fixed w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-600 to-purple-600 rounded-md flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Calm Magic Assistant</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link to="/case-studies" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.case_studies")}</Link>
            <Link to="/about-us" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.about")}</Link>
            <a href="#coaching-services" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.services")}</a>
            <LanguageSwitcher />
          </nav>
          <Button
            onClick={() => setShowBoardGate(true)}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600"
          >
            {t("calm_magic.open_calm_magic")}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="container relative md:py-12 py-[41px] px-[14px]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl px-8 border border-white/20 py-[28px]">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 animate-gradient-x mb-6">
                {t("calm_magic.title")}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200">
                {t("calm_magic.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  onClick={() => setShowBoardGate(true)}
                  className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Launch Calm Magic Board
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/flexible-quick-meeting" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="flex items-center gap-2">
                    {t("hero.book_discovery")}
                  </Button>
                </a>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("calm_magic.tools_description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Services Section */}
      <section id="coaching-services" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <CoachingServices />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Board Entry Gate Modal */}
      <BoardEntryGate
        isOpen={showBoardGate}
        onClose={() => setShowBoardGate(false)}
        sourceContext="relational"
        preselectedMode="personal"
      />
    </div>
  );
};
export default RelationalHealing;
