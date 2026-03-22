import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Palette, Type, Layers, Map, Brain, Zap, Eye, Telescope, Wrench, Rocket } from "lucide-react";
import { offeringModels, journeyStages, designSystemColors } from "@/data/offeringModels";

const tierColors = {
  magic: 'bg-purple-500/10 text-purple-700 border-purple-300 dark:text-purple-300',
  calm: 'bg-teal-500/10 text-teal-700 border-teal-300 dark:text-teal-300',
  free: 'bg-slate-500/10 text-slate-700 border-slate-300 dark:text-slate-300',
};

const tierLabels = { magic: 'MAGIC — Strategic', calm: 'CALM — Experience', free: 'FREE — Infrastructure' };

const stageIcons = { discover: Eye, engage: Zap, build: Wrench, observe: Telescope, evolve: Rocket };

const DesignSystemShowcase = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="font-bold text-sm">Paracosm Design System</h1>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Page Title */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">Design System & Journey Map</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the architecture behind Paracosm and Calm Magic — the design tokens, mental models, task flows, and system touchpoints that power our offerings.
          </p>
        </div>

        <Tabs defaultValue="design-system" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="design-system" className="text-xs sm:text-sm gap-1"><Palette className="w-3 h-3" /> Design System</TabsTrigger>
            <TabsTrigger value="mental-models" className="text-xs sm:text-sm gap-1"><Brain className="w-3 h-3" /> Mental Models</TabsTrigger>
            <TabsTrigger value="journey-map" className="text-xs sm:text-sm gap-1"><Map className="w-3 h-3" /> Journey Map</TabsTrigger>
          </TabsList>

          {/* Tab A — Design System */}
          <TabsContent value="design-system" className="space-y-8 mt-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Color Palette</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {designSystemColors.map((c) => (
                  <div key={c.variable} className="space-y-1">
                    <div className="h-16 rounded-lg border" style={{ backgroundColor: `hsl(var(${c.variable}))` }} />
                    <p className="text-xs font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.variable}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Type className="w-5 h-5" /> Typography</h2>
              <div className="space-y-3 bg-card border rounded-xl p-6">
                <p className="text-4xl font-bold">Heading 1 — Bold Vision</p>
                <p className="text-2xl font-semibold">Heading 2 — Section Title</p>
                <p className="text-lg font-medium">Heading 3 — Subsection</p>
                <p className="text-base">Body text — Clear, readable content at standard size.</p>
                <p className="text-sm text-muted-foreground">Small — Supporting information and metadata</p>
                <p className="text-xs text-muted-foreground">Extra small — Labels and captions</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Layers className="w-5 h-5" /> Component Library</h2>
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
                        <p className="text-xs text-muted-foreground">Nested card example — used for offering tiers, PRD sections, and observatory layers.</p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Tab B — Mental Models */}
          <TabsContent value="mental-models" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offeringModels.map((offering) => (
                <Card key={offering.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={offering.tier === 'spring' ? 'default' : 'secondary'} className="text-xs">
                        {offering.tier === 'spring' ? 'Spring 2026' : 'Deep Program'}
                      </Badge>
                      {offering.price && <span className="text-xs font-semibold text-muted-foreground">{offering.price}</span>}
                    </div>
                    <CardTitle className="text-base mt-1">{offering.name}</CardTitle>
                    <CardDescription className="text-xs">{offering.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mental Model */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Mental Model</p>
                      <div className="flex flex-wrap items-center gap-1">
                        {offering.mentalModel.stages.map((stage, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs whitespace-nowrap">{stage}</Badge>
                            {i < offering.mentalModel.stages.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{offering.mentalModel.description}</p>
                    </div>

                    {/* Task Model */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Task Model</p>
                      <div className="space-y-1.5">
                        {offering.taskModel.map((task, i) => (
                          <div key={task.id} className="flex items-start gap-2 text-xs">
                            <span className="font-semibold text-primary w-4 flex-shrink-0">{i + 1}.</span>
                            <div className="flex-1">
                              <span className="font-medium">{task.label}</span>
                              {task.duration && <span className="text-muted-foreground ml-1">({task.duration})</span>}
                              <p className="text-muted-foreground">{task.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Observatory Tiers */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Observatory Alignment</p>
                      <div className="space-y-1">
                        {(['magic', 'calm', 'free'] as const).map((tier) => (
                          <div key={tier} className={`text-xs px-2 py-1 rounded border ${tierColors[tier]}`}>
                            <span className="font-semibold">{tier.toUpperCase()}:</span> {offering.observatoryTiers[tier]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab C — Journey Map */}
          <TabsContent value="journey-map" className="space-y-6 mt-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">System Journey Map</h2>
              <p className="text-sm text-muted-foreground">Every touchpoint across the Paracosm ecosystem, colored by Observatory tier.</p>
            </div>

            {/* Swimlane Legend */}
            <div className="flex justify-center gap-4 flex-wrap">
              {(['magic', 'calm', 'free'] as const).map((tier) => (
                <Badge key={tier} variant="outline" className={`text-xs ${tierColors[tier]}`}>
                  {tierLabels[tier]}
                </Badge>
              ))}
            </div>

            {/* Journey Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {journeyStages.map((stage, idx) => {
                const Icon = stageIcons[stage.id as keyof typeof stageIcons] || Zap;
                return (
                  <Card key={stage.id} className={`relative overflow-hidden border-t-4 ${
                    stage.tier === 'magic' ? 'border-t-purple-500' :
                    stage.tier === 'calm' ? 'border-t-teal-500' : 'border-t-slate-500'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          stage.tier === 'magic' ? 'bg-purple-500/10 text-purple-600' :
                          stage.tier === 'calm' ? 'bg-teal-500/10 text-teal-600' : 'bg-slate-500/10 text-slate-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Stage {idx + 1}</p>
                          <CardTitle className="text-sm">{stage.label}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      {stage.touchpoints.map((tp, i) => (
                        <Link
                          key={i}
                          to={tp.route.startsWith('mailto') ? '#' : tp.route}
                          onClick={(e) => {
                            if (tp.route.startsWith('mailto')) {
                              e.preventDefault();
                              window.location.href = tp.route;
                            }
                          }}
                          className="block text-xs px-2 py-1.5 rounded bg-accent/50 hover:bg-accent transition-colors"
                        >
                          {tp.label}
                        </Link>
                      ))}
                    </CardContent>
                    {/* Connector arrow */}
                    {idx < journeyStages.length - 1 && (
                      <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
