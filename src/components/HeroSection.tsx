
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import HeroCanvas from "./hero/HeroCanvas";
import OracleTeaser from "./hero/OracleTeaser";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  onDiscoverFramework?: () => void;
}

const ROTATING_KEYS = ["design", "deploy", "scale", "govern"] as const;

const HeroSection: React.FC<HeroSectionProps> = ({ onDiscoverFramework }) => {
  const { t } = useLanguage();
  const [wordIndex, setWordIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_KEYS.length);
        setAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-16 md:pt-20 overflow-hidden">
      {/* White background canvas with agent dynamics */}
      <HeroCanvas />
      
      {/* Content with higher z-index */}
      <div className="container relative px-4 py-8 md:py-12 lg:py-24" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline with backdrop protection */}
          <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/20 relative z-20">
            {/* Agentic Framework CTA Button - Top Left Corner */}
            <Button 
              onClick={onDiscoverFramework}
              className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-white px-3 md:px-4 py-2 text-xs md:text-sm font-semibold shadow-lg hover:shadow-xl flex items-center gap-1.5 md:gap-2 z-30 rounded-lg animate-pulse-glow"
            >
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{t("framework.agentic_framework")}</span>
              <span className="sm:hidden">{t("framework.framework")}</span>
            </Button>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 leading-[0.95] text-foreground bloom-chroma-static">
              <span className="inline-block overflow-hidden h-[1.1em] align-bottom relative w-[4ch] sm:w-[5ch] text-[hsl(var(--bloom-magenta))]">
                <span
                  className={`inline-block transition-all duration-300 ${
                    animating
                      ? "-translate-y-full opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  {t(`hero.rotating_words.${ROTATING_KEYS[wordIndex]}`)}
                </span>
              </span>{" "}
              <span className="bloom-marker">{t("hero.your_agentic_ecosystem")}</span>
            </h1>
            <p className="font-redacted italic text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-foreground/80 leading-relaxed">
              {t("hero.design_deploy_manage")}
            </p>
            <OracleTeaser />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
