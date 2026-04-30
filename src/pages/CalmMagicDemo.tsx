import { useState } from "react";
import { Link } from "react-router-dom";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
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
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Calm Magic", path: "/calm-magic-demo" },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="h-8 w-8 rounded-lg bg-white p-1 object-contain"
            />
            <span className="text-sm font-bold">Paracosm</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#anatomy" className="text-sm text-muted-foreground hover:text-foreground">
              The Board
            </a>
            <a href="#seasons" className="text-sm text-muted-foreground hover:text-foreground">
              Seasons
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground">
              Benefits
            </a>
            <button
              onClick={() => setDemoOpen(true)}
              className="rounded-md bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              Get a demo
            </button>
          </nav>
        </div>
      </header>

      <main>
        <DemoHero onDemo={() => setDemoOpen(true)} />
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
