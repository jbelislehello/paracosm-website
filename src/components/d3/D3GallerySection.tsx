import { lazy, Suspense, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgentNetworkGraph = lazy(() => import("./AgentNetworkGraph"));
const CompassSunburst = lazy(() => import("./CompassSunburst"));

const Fallback = () => (
  <div className="h-[420px] flex items-center justify-center">
    <p className="font-vhs uppercase tracking-[0.3em] text-xs text-[hsl(var(--bloom-amber))]">
      Loading diagram…
    </p>
  </div>
);

const D3GallerySection = () => {
  const [tab, setTab] = useState("network");

  return (
    <section
      id="living-diagrams"
      className="relative py-16 md:py-24 px-4 bg-[hsl(var(--bloom-ink))] overflow-hidden"
    >
      <div className="bloom-scanlines absolute inset-0 pointer-events-none opacity-60" aria-hidden />
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--bloom-magenta)) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--bloom-teal)) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 space-y-3">
          <p className="font-vhs uppercase tracking-[0.3em] text-xs text-[hsl(var(--bloom-amber))]">
            Living Diagrams · D3
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground bloom-chroma-static">
            The agentic ecosystem, drawn in motion
          </h2>
          <p className="font-redacted italic text-base md:text-lg text-foreground/80 max-w-2xl mx-auto">
            Drag, zoom, and hover to feel how agents and the 64-tile compass
            actually move together. The conversation is the ontology — these
            diagrams are the surface where it breathes.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-[hsl(var(--bloom-ink))] border border-[hsl(var(--bloom-magenta)/0.3)]">
            <TabsTrigger
              value="network"
              className="font-vhs uppercase tracking-[0.18em] text-xs data-[state=active]:bg-[hsl(var(--bloom-magenta)/0.2)] data-[state=active]:text-[hsl(var(--bloom-magenta))]"
            >
              Agent network
            </TabsTrigger>
            <TabsTrigger
              value="sunburst"
              className="font-vhs uppercase tracking-[0.18em] text-xs data-[state=active]:bg-[hsl(var(--bloom-amber)/0.2)] data-[state=active]:text-[hsl(var(--bloom-amber))]"
            >
              64-tile compass
            </TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="mt-8">
            <Suspense fallback={<Fallback />}>
              <AgentNetworkGraph />
            </Suspense>
          </TabsContent>

          <TabsContent value="sunburst" className="mt-8">
            <Suspense fallback={<Fallback />}>
              <CompassSunburst />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default D3GallerySection;
