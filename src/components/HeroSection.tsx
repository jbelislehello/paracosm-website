
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import HeroCanvas from "./hero/HeroCanvas";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  onDiscoverFramework?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onDiscoverFramework }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* White background canvas with agent dynamics */}
      <HeroCanvas />
      
      {/* Content with higher z-index */}
      <div className="container relative px-4 py-12 md:py-24" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline with backdrop protection */}
          <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-8 border border-white/20 relative z-20">
            {/* Agentic Framework CTA Button - Top Left Corner */}
            <Button 
              onClick={onDiscoverFramework}
              className="absolute -top-2 -left-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 z-30 rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">{t("framework.agentic_framework")}</span>
              <span className="sm:hidden">{t("framework.framework")}</span>
            </Button>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-agent-blue via-agent-purple to-agent-pink animate-gradient-x mb-6">
              {t("hero.build_agentic_ecosystem")}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200">
              {t("hero.design_deploy_manage")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
