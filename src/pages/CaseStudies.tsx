import React from 'react';
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CaseStudiesSection from '@/components/case-studies/CaseStudiesSection';
import Footer from '@/components/Footer';
import { usePageSeo } from '@/hooks/usePageSeo';
import { webPageSchema, itemListSchema } from '@/lib/structuredData';
import { caseStudies } from '@/data/caseStudies';

const CaseStudies: React.FC = () => {
  const { t } = useLanguage();

  usePageSeo({
    title: "Case Studies — Learning Organizations in practice | Paracosm",
    description: "Real engagements where Paracosm helped executives and innovators build Learning Organizations using AI systems and relational intelligence.",
    path: "/case-studies",
    jsonLd: [
      webPageSchema({
        type: "CollectionPage",
        title: "Case Studies — Learning Organizations in practice | Paracosm",
        description:
          "Real engagements where Paracosm helped executives and innovators build Learning Organizations using AI systems and relational intelligence.",
        url: "/case-studies",
      }),
      itemListSchema({
        name: "Paracosm Case Studies",
        url: "/case-studies",
        items: (Array.isArray(caseStudies) ? caseStudies : []).map((cs: any) => ({
          name: cs?.title ?? cs?.name ?? "Case Study",
          description: cs?.summary ?? cs?.description,
          url: cs?.slug ? `/case-studies#${cs.slug}` : undefined,
        })),
      }),
    ],
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--bloom-ink))] text-white relative">
      <div className="bloom-scanlines pointer-events-none fixed inset-0 opacity-[0.12] z-[5]" />
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-[hsl(var(--bloom-ink)/0.85)] backdrop-blur-md border-b border-[hsl(var(--bloom-magenta)/0.3)]">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white hover:text-[hsl(var(--bloom-amber))]">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoParacosm} alt="Paracosm" className="bg-white rounded-lg p-1 w-8 h-8 object-contain" />
              <span className="font-display text-base bloom-chroma-static">Paracosm</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/agentic-ux" className="text-xs font-vhs uppercase tracking-[0.18em] hover:text-[hsl(var(--bloom-amber))] transition-colors">{t("navigation.ai_leadership")}</Link>
            <Link to="/calm-magic-assistant" className="text-xs font-vhs uppercase tracking-[0.18em] hover:text-[hsl(var(--bloom-amber))] transition-colors">{t("navigation.relational_innovation")}</Link>
            <Link to="/about-us" className="text-xs font-vhs uppercase tracking-[0.18em] hover:text-[hsl(var(--bloom-amber))] transition-colors">{t("navigation.about")}</Link>
            <LanguageSwitcher />
          </nav>
          <Link to="/agentic-ux">
            <Button className="bg-[hsl(var(--bloom-magenta))] text-white hover:bg-[hsl(var(--bloom-amber))] hover:text-[hsl(var(--bloom-ink))] font-vhs uppercase tracking-widest text-xs">
              {t("navigation.ai_leadership")}
            </Button>
          </Link>
        </div>
      </header>

      <div className="pt-16 relative z-10">
        <CaseStudiesSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CaseStudies;
