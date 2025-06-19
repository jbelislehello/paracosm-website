
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CaseStudiesSection from '@/components/case-studies/CaseStudiesSection';

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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-lg">Paracosm</span>
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
                <li><Link to="/calm-magic-assistant" className="text-sm hover:text-purple-600">{t("navigation.relational_innovation")}</Link></li>
                <li><Link to="/" className="text-sm hover:text-purple-600">{t("footer.leadership_coaching")}</Link></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">{t("navigation.case_studies")}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">{t("footer.company_title")}</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-sm hover:text-purple-600">{t("footer.about_jonathan")}</Link></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">{t("navigation.case_studies")}</Link></li>
                <li><Link to="/agentic-ux#contact" className="text-sm hover:text-purple-600">{t("navigation.contact")}</Link></li>
                <li><a href="#" className="text-sm hover:text-purple-600">{t("footer.privacy")}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 Paracosm. {t("footer.rights_reserved")}</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudies;
