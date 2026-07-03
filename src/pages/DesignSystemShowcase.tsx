import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Brain } from "lucide-react";
import JourneyMapTable from "@/components/design-system/JourneyMapTable";
import MentalModelGrid from "@/components/design-system/MentalModelGrid";
import QuestionResonancePanel from "@/components/resonance/QuestionResonancePanel";
import WhyItWorksRecap from "@/components/resonance/WhyItWorksRecap";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import Footer from "@/components/Footer";
import { editorialType, editorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

const DesignSystemShowcase = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />

      {/* Masthead */}
      <EditorialSection tone="warm" className="pt-14 pb-12 md:pt-20 md:pb-16">
        <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>
          Vol. I · Resource · How It Works
        </p>
        <div className="mt-6 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8 space-y-5">
            <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight")}>
              How it <em className="italic font-light">works</em>.
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed">
              The architecture behind Paracosm and Calm Magic — the mental models, task flows, and
              system touchpoints that turn a question into shipped software.
            </p>
          </div>
          <aside className="md:col-span-4 border-l border-current/20 pl-6 space-y-3">
            <p className={editorialType.caption}>In this dispatch</p>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-3"><span className={cn(editorialType.serif, editorialTone.warm.numeral)}>01</span><span>Situate your question</span></li>
              <li className="flex gap-3"><span className={cn(editorialType.serif, editorialTone.warm.numeral)}>02</span><span>Mental & task models</span></li>
              <li className="flex gap-3"><span className={cn(editorialType.serif, editorialTone.warm.numeral)}>03</span><span>System journey map</span></li>
            </ol>
          </aside>
        </div>
      </EditorialSection>

      <WhyItWorksRecap lens="design-system" homeHash="#framework-hero" />

      {/* Chapter 01 — Situate your question */}
      <EditorialSection tone="paper" id="situate">
        <EditorialChapterHeader
          numeral="01"
          kicker="Situate your question"
          subtitle="Ask the real question your team is sitting with."
          tone="paper"
        />
        <p className="mt-6 max-w-3xl text-lg opacity-80">
          The five axes — Magic, Love, Calm, Open, Free — structure every model and journey on this
          page. We map your question onto the Calm Magic board and point to the path that fits.
        </p>
        <div className="mt-10">
          <QuestionResonancePanel />
        </div>
      </EditorialSection>

      {/* Chapters 02 + 03 */}
      <EditorialSection tone="clay" id="architecture">
        <EditorialChapterHeader
          numeral="02"
          kicker="The architecture"
          subtitle="Mental models on one side, the full system journey on the other."
          tone="clay"
        />

        <Tabs defaultValue="mental-models" className="w-full mt-10">
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
            <TabsTrigger value="mental-models" className="text-xs sm:text-sm gap-1">
              <Brain className="w-3 h-3" /> Models
            </TabsTrigger>
            <TabsTrigger value="journey-map" className="text-xs sm:text-sm gap-1">
              <Map className="w-3 h-3" /> Journey Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mental-models" className="mt-8">
            <MentalModelGrid />
          </TabsContent>

          <TabsContent value="journey-map" className="space-y-6 mt-8">
            <div className="text-center mb-4">
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl")}>System Journey Map</h3>
              <p className="text-sm opacity-70 mt-1">
                Every touchpoint across the Paracosm ecosystem — activities, goals, experience, and technology.
              </p>
            </div>
            <JourneyMapTable />
          </TabsContent>
        </Tabs>
      </EditorialSection>

      <Footer />
    </main>
  );
};

export default DesignSystemShowcase;
