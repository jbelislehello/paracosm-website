import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Palette, Type, Layers, Map, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { designSystemColors } from "@/data/offeringModels";
import JourneyMapTable from "@/components/design-system/JourneyMapTable";
import MentalModelGrid from "@/components/design-system/MentalModelGrid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

        <Tabs defaultValue="design-system" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="design-system" className="text-xs sm:text-sm gap-1"><Palette className="w-3 h-3" /> Design System</TabsTrigger>
            <TabsTrigger value="mental-models" className="text-xs sm:text-sm gap-1"><Brain className="w-3 h-3" /> Models</TabsTrigger>
            <TabsTrigger value="journey-map" className="text-xs sm:text-sm gap-1"><Map className="w-3 h-3" /> Journey Map</TabsTrigger>
          </TabsList>

          {/* Tab A — Design System with 3 Pillars */}
          <TabsContent value="design-system" className="space-y-8 mt-8">
            {/* Venn Diagram Header */}
            <div className="flex justify-center mb-8">
              <div className="relative w-72 h-48">
                <div className="absolute left-4 top-4 w-32 h-32 rounded-full bg-purple-500/15 border-2 border-purple-300 dark:border-purple-700 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 -translate-x-2">Building<br/>Blocks</span>
                </div>
                <div className="absolute right-4 top-4 w-32 h-32 rounded-full bg-teal-500/15 border-2 border-teal-300 dark:border-teal-700 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 translate-x-2">UI<br/>Patterns</span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-32 h-32 rounded-full bg-amber-500/15 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 translate-y-2">Rules</span>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold text-primary">Design<br/>System</div>
              </div>
            </div>

            <Accordion type="multiple" defaultValue={['blocks', 'patterns', 'rules']} className="space-y-4">
              {/* Building Blocks */}
              <AccordionItem value="blocks" className="border rounded-xl px-4">
                <AccordionTrigger className="font-bold text-sm">
                  <span className="flex items-center gap-2"><Palette className="w-4 h-4 text-purple-500" /> Building Blocks — Style Guide</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pb-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Color Palette</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {designSystemColors.map((c) => (
                        <div key={c.variable} className="space-y-1">
                          <div className="h-16 rounded-lg border" style={{ backgroundColor: `hsl(var(${c.variable}))` }} />
                          <p className="text-xs font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.variable}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Typography Scale</h3>
                    <div className="space-y-2 bg-card border rounded-xl p-4">
                      <p className="text-3xl font-bold">H1 — Bold Vision</p>
                      <p className="text-xl font-semibold">H2 — Section Title</p>
                      <p className="text-lg font-medium">H3 — Subsection</p>
                      <p className="text-base">Body — Standard readable content</p>
                      <p className="text-sm text-muted-foreground">Small — Supporting metadata</p>
                      <p className="text-xs text-muted-foreground">XS — Labels and captions</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* UI Patterns */}
              <AccordionItem value="patterns" className="border rounded-xl px-4">
                <AccordionTrigger className="font-bold text-sm">
                  <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-teal-500" /> UI Patterns — Pattern Guide</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader><CardTitle className="text-sm">Buttons</CardTitle></CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        <Button size="sm">Primary</Button>
                        <Button size="sm" variant="secondary">Secondary</Button>
                        <Button size="sm" variant="outline">Outline</Button>
                        <Button size="sm" variant="ghost">Ghost</Button>
                        <Button size="sm" variant="destructive">Destructive</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle className="text-sm">Badges</CardTitle></CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle className="text-sm">Progress</CardTitle></CardHeader>
                      <CardContent className="space-y-2">
                        <Progress value={25} className="h-2" />
                        <Progress value={60} className="h-2" />
                        <Progress value={90} className="h-2" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle className="text-sm">Cards</CardTitle></CardHeader>
                      <CardContent>
                        <Card className="border-dashed">
                          <CardContent className="p-3">
                            <p className="text-xs text-muted-foreground">Nested card — used for offering tiers, PRD sections, and observatory layers.</p>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Rules */}
              <AccordionItem value="rules" className="border rounded-xl px-4">
                <AccordionTrigger className="font-bold text-sm">
                  <span className="flex items-center gap-2"><Type className="w-4 h-4 text-amber-500" /> Rules — Design Principles</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Clarity Over Complexity', desc: 'Every element must reduce cognitive load. If it doesn\'t clarify, remove it.' },
                      { title: 'Compression First', desc: 'Show the essential. Expand for depth. Never overwhelm on first view.' },
                      { title: 'Relational by Design', desc: 'Every interface mediates a relationship — human-to-self, human-to-human, human-to-system.' },
                      { title: 'Living Systems', desc: 'Components evolve. Designs are organisms, not static artifacts.' },
                      { title: 'Bilingual Natively', desc: 'All text through translation system. Never hardcode language.' },
                      { title: 'Observatory Alignment', desc: 'Every feature maps to MAGIC (strategic), CALM (experiential), or FREE (infrastructure).' },
                    ].map((p) => (
                      <div key={p.title} className="border rounded-lg p-4">
                        <p className="font-bold text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

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
