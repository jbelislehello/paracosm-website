import React from 'react';
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CaseStudiesSection from '@/components/case-studies/CaseStudiesSection';
import Footer from '@/components/Footer';

const CaseStudies: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoParacosm} alt="Paracosm" className="bg-white rounded-lg p-1 w-8 h-8 object-contain" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">Paracosm</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link to="/agentic-ux" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.ai_leadership")}</Link>
            <Link to="/calm-magic-assistant" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.relational_innovation")}</Link>
            <Link to="/about-us" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.about")}</Link>
            <LanguageSwitcher />
          </nav>
          <Link to="/agentic-ux">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
              {t("navigation.ai_leadership")}
            </Button>
          </Link>
        </div>
      </header>

      <div className="pt-16">
        <CaseStudiesSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CaseStudies;
