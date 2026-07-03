import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import CaseStudiesSection from "@/components/case-studies/CaseStudiesSection";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { webPageSchema, itemListSchema } from "@/lib/structuredData";
import { caseStudies } from "@/data/caseStudies";


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
      <EditorialSiteHeader />


      <CaseStudiesSection />

      <Footer />
    </div>
  );
};

export default CaseStudies;
