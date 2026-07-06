import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import CaseStudiesSection from "@/components/case-studies/CaseStudiesSection";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { webPageSchema, itemListSchema } from "@/lib/structuredData";
import { caseStudies } from "@/data/caseStudies";


const CaseStudies: React.FC = () => {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';

  const seoTitle = isFr
    ? "Études de cas — Organisations apprenantes en pratique | Paracosm"
    : "Case Studies — Learning Organizations in practice | Paracosm";
  const seoDescription = isFr
    ? "Engagements réels où Paracosm a aidé des dirigeant·e·s et des innovateur·rice·s à bâtir des organisations apprenantes à l'aide de systèmes IA et d'intelligence relationnelle."
    : "Real engagements where Paracosm helped executives and innovators build Learning Organizations using AI systems and relational intelligence.";

  usePageSeo({
    title: seoTitle,
    description: seoDescription,
    path: "/case-studies",
    jsonLd: [
      webPageSchema({
        type: "CollectionPage",
        title: seoTitle,
        description: seoDescription,
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
      <EditorialSiteHeader />



      <CaseStudiesSection />

      <Footer />
    </div>
  );
};

export default CaseStudies;
