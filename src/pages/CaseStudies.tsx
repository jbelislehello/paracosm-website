import React from "react";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CaseStudiesSection from "@/components/case-studies/CaseStudiesSection";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { webPageSchema, itemListSchema } from "@/lib/structuredData";
import { caseStudies } from "@/data/caseStudies";
import { editorialType } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

const CaseStudies: React.FC = () => {
  const { t } = useLanguage();

  usePageSeo({
    title: "Case Studies — Learning Organizations in practice | Paracosm",
    description:
      "Real engagements where Paracosm helped executives and innovators build Learning Organizations using AI systems and relational intelligence.",
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Editorial masthead */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={cn(editorialType.cta, "inline-flex items-center gap-1 opacity-70 hover:opacity-100")}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logoParacosm}
                alt="Paracosm"
                className="w-8 h-8 rounded-md bg-white p-1 object-contain"
              />
              <span className={cn(editorialType.serif, "text-base")}>Paracosm</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/trainings" className={cn(editorialType.cta, "opacity-70 hover:opacity-100")}>
              Trainings
            </Link>
            <Link to="/events-and-retreats" className={cn(editorialType.cta, "opacity-70 hover:opacity-100")}>
              Retreats
            </Link>
            <Link to="/about-us" className={cn(editorialType.cta, "opacity-70 hover:opacity-100")}>
              About
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <CaseStudiesSection />

      <Footer />
    </div>
  );
};

export default CaseStudies;
