import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, Calendar, Compass, Mail, CheckCircle } from "lucide-react";
import { energeticAxes } from "@/data/gardens";
import { useToast } from "@/hooks/use-toast";

const DriftLanding = () => {
  const [email, setEmail] = useState("");
  const [subscriptionType, setSubscriptionType] = useState<"both" | "podcast" | "dashboard">("both");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    toast({
      title: "Welcome to the drift!",
      description: "You'll receive your first update soon.",
    });
    setEmail("");
  };

  const dashboardSections = [
    { axis: energeticAxes[0], type: "Tools", description: "Practical instruments for daily aliveness" },
    { axis: energeticAxes[1], type: "Ideas", description: "Emerging thoughts and spacious possibilities" },
    { axis: energeticAxes[2], type: "Culture", description: "Systems that ground and regenerate communities" },
    { axis: energeticAxes[3], type: "Experiments", description: "Bold attempts at transformation and change" },
    { axis: energeticAxes[4], type: "Interactions", description: "Integrative moments of neurogenesis and growth" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <Badge variant="outline" className="px-6 py-2 text-lg font-medium bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              Monthly Podcast + Weekly Dashboard
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">
              Drift
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Where intentional wandering meets<br />
              the compass of calm magic
            </p>
            
            <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto">
              A monthly conversation with the currents of change,<br />
              and a weekly board for navigating what emerges
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button size="lg" className="px-8 py-3 text-lg" onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}>
              <Mail className="w-5 h-5 mr-2" />
              Join the Drift
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg" onClick={() => document.getElementById('podcast')?.scrollIntoView({ behavior: 'smooth' })}>
              <Mic className="w-5 h-5 mr-2" />
              Explore Episodes
            </Button>
          </div>
        </div>
      </section>

      {/* Podcast Drift Section */}
      <section id="podcast" className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Podcast Drift
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A monthly ritual of deep listening. Each episode drifts through one of the five forces of the Calm Magic compass, exploring how these energies shape our work, relationships, and creative evolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {energeticAxes.map((axis, index) => (
              <Card key={axis.key} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      style={{ backgroundColor: `${axis.color}15`, color: axis.color, borderColor: `${axis.color}30` }}
                      className="font-semibold"
                    >
                      {axis.name}
                    </Badge>
                    <Mic className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold">{axis.subtitle}</h3>
                  <p className="text-muted-foreground leading-relaxed">{axis.description}</p>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Episode {index + 1} • Coming Soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Dashboard Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
              Weekly Dashboard
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A living board that updates weekly, organizing insights and discoveries across the five dimensions of the Calm Magic compass. Each section offers fresh perspectives for navigating complexity with grace.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dashboardSections.map((section, index) => (
              <Card key={section.axis.key} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary/20">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge 
                        style={{ backgroundColor: `${section.axis.color}15`, color: section.axis.color, borderColor: `${section.axis.color}30` }}
                        className="font-semibold text-lg px-4 py-2"
                      >
                        {section.axis.name}
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground">{section.type}</h3>
                    </div>
                    <Calendar className="w-6 h-6 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">{section.description}</p>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">
                      {section.axis.subtitle} • Updated Weekly
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="container max-w-4xl mx-auto">
          <Card className="border-2 border-primary/10 bg-background/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center space-y-8">
              <Compass className="w-16 h-16 mx-auto text-primary/60" />
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Compass of Calm Magic
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  In a world accelerating toward complexity, we need new forms of navigation. 
                  Calm Magic offers a compass—not for finding our way back to familiar ground, 
                  but for drifting intentionally through the unknown.
                </p>
                
                <p>
                  Each force—<span className="font-semibold text-red-500">Love</span>, <span className="font-semibold text-purple-500">Magic</span>, <span className="font-semibold text-cyan-500">Calm</span>, <span className="font-semibold text-emerald-500">Open</span>, and <span className="font-semibold text-amber-500">Free</span>—
                  represents a different quality of attention, a unique way of engaging with 
                  what emerges when we stop trying to control the current.
                </p>
                
                <p>
                  Drift is both practice and invitation: to let these forces guide our conversations, 
                  shape our tools, and inform our experiments in living more consciously 
                  at the edge of change.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Subscription Section */}
      <section id="subscribe" className="py-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8 space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Join the Current
                </h2>
                <p className="text-lg text-muted-foreground">
                  Receive monthly podcast episodes and weekly dashboard updates. 
                  Choose your rhythm of engagement.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Subscription Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: "both", label: "Both", desc: "Monthly + Weekly" },
                        { value: "podcast", label: "Podcast Only", desc: "Monthly Episodes" },
                        { value: "dashboard", label: "Dashboard Only", desc: "Weekly Updates" }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={subscriptionType === option.value ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-center space-y-1"
                          onClick={() => setSubscriptionType(option.value as any)}
                        >
                          <span className="font-semibold">{option.label}</span>
                          <span className="text-xs opacity-80">{option.desc}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-lg"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-12 text-lg font-semibold"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Begin the Drift
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                No spam, just intentional signals. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DriftLanding;