import { useState } from "react";
import { EditorialSiteHeader } from "@/components/editorial";
import DemoHero from "@/components/calm-magic-demo/DemoHero";
import ProblemSection from "@/components/calm-magic-demo/ProblemSection";
import BoardAnatomy from "@/components/calm-magic-demo/BoardAnatomy";
import SeasonsStepper from "@/components/calm-magic-demo/SeasonsStepper";
import ToleranceZones from "@/components/calm-magic-demo/ToleranceZones";
import TileFlipShowcase from "@/components/calm-magic-demo/TileFlipShowcase";
import ConstellationTeaser from "@/components/calm-magic-demo/ConstellationTeaser";
import PrdLayersStack from "@/components/calm-magic-demo/PrdLayersStack";
import BenefitsTriad from "@/components/calm-magic-demo/BenefitsTriad";
import DemoCTA from "@/components/calm-magic-demo/DemoCTA";
import GetDemoDialog from "@/components/GetDemoDialog";
import GradientDivider from "@/components/GradientDivider";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import WhyItWorksRecap from "@/components/resonance/WhyItWorksRecap";
import { productSchema } from "@/lib/structuredData";

const CalmMagicDemo = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  usePageSeo({
    title: "Calm Magic — A Relational Intelligence Methodology | Paracosm",
    description:
      "Calm Magic is a relational intelligence methodology for organizational transformation — an 8×8 board that turns conversation into a living product nervous system.",
    path: "/calm-magic-demo",
    jsonLd: [
      productSchema({
        name: "Calm Magic",
        description:
          "An 8×8 board methodology that turns conversation into a living product nervous system — five seasons across LOVE, MAGIC, CALM, OPEN, FREE.",
        url: "/calm-magic-demo",
        category: "Relational Intelligence Methodology",
      }),
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />

      <main>
        <DemoHero onDemo={() => setDemoOpen(true)} />
        <WhyItWorksRecap lens="board" />
        <GradientDivider />
        <ProblemSection />
        <BoardAnatomy />
        <GradientDivider />
        <div id="seasons">
          <SeasonsStepper />
        </div>
        <ToleranceZones />
        <GradientDivider />
        <TileFlipShowcase />
        <ConstellationTeaser />
        <GradientDivider />
        <PrdLayersStack />
        <div id="benefits">
          <BenefitsTriad />
        </div>
        <DemoCTA onDemo={() => setDemoOpen(true)} />
      </main>

      <Footer />
      <GetDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
};

export default CalmMagicDemo;
