import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Map, Brain } from "lucide-react";
import JourneyMapTable from "@/components/design-system/JourneyMapTable";
import MentalModelGrid from "@/components/design-system/MentalModelGrid";
import QuestionResonancePanel from "@/components/resonance/QuestionResonancePanel";
import WhyItWorksRecap from "@/components/resonance/WhyItWorksRecap";

const DesignSystemShowcase = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="font-bold text-sm">Why It Works</h1>
        </div>
      </header>

      <WhyItWorksRecap lens="design-system" />

      <div className="container max-w-6xl mx-auto px-4 py-12 space-y-16">

        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">Design System & Journey Map</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the architecture behind Paracosm and Calm Magic — the design tokens, mental models, task flows, and system touchpoints that power our offerings.
          </p>
        </div>

        {/* Learn — Resonance: situate your question on the Calm Magic board */}
        <section className="rounded-2xl border bg-card/50 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">Learn · Try it</Badge>
            <h2 className="text-xl md:text-2xl font-bold">Situate your question on the board</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            The five axes below — Magic, Love, Calm, Open, Free — are the
            same axes that structure every model and journey on this page.
            Ask the real question your team is sitting with: we'll map it
            onto the Calm Magic board and point you to the path on the
            homepage that fits.
          </p>
          <QuestionResonancePanel />
        </section>

        <Tabs defaultValue="mental-models" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
            <TabsTrigger value="mental-models" className="text-xs sm:text-sm gap-1"><Brain className="w-3 h-3" /> Models</TabsTrigger>
            <TabsTrigger value="journey-map" className="text-xs sm:text-sm gap-1"><Map className="w-3 h-3" /> Journey Map</TabsTrigger>
          </TabsList>

          {/* Tab B — Mental & Task Models */}
          <TabsContent value="mental-models" className="mt-8">
            <MentalModelGrid />
          </TabsContent>

          {/* Tab C — Journey Map */}
          <TabsContent value="journey-map" className="space-y-6 mt-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">System Journey Map</h2>
              <p className="text-sm text-muted-foreground">Every touchpoint across the Paracosm ecosystem — activities, goals, experience, and technology.</p>
            </div>
            <JourneyMapTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
