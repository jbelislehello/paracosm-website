import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, Calendar, Compass, Mail, CheckCircle, BookOpen, Play, Music, Headphones, FileText } from "lucide-react";
import { energeticAxes } from "@/data/gardens";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { driftMonthlyDiscoveries, driftLibraryExtras, driftLibraryArtefacts, getMonthName, axisColors } from "@/data/driftMonthlyDiscoveries";

const DriftLanding = () => {
  const [email, setEmail] = useState("");
  
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const subject = encodeURIComponent("Drift Newsletter - New Subscriber");
    const body = encodeURIComponent(`New Drift newsletter subscriber:\n\nEmail: ${email}`);
    window.location.href = `mailto:jbelisle@helloarchitekt.com?subject=${subject}&body=${body}`;

    toast({
      title: "Welcome to the drift!",
      description: "You'll receive your first update soon.",
    });
    setEmail("");
  };

  const dashboardSections = [
    // LOVE
    { axis: energeticAxes[0], type: "Tangible Play", description: "Physical interaction as a gateway to learning and creative discovery" },
    { axis: energeticAxes[0], type: "Embodied Cognition", description: "Thinking through the body — where movement meets understanding" },
    { axis: energeticAxes[0], type: "Wearables", description: "Technology worn close — extending human sensing and expression" },
    // MAGIC
    { axis: energeticAxes[1], type: "Sensory Rooms", description: "Immersive environments designed to shift perception and presence" },
    { axis: energeticAxes[1], type: "21c Parenting", description: "Raising humans in an era of complexity, screens, and possibility" },
    { axis: energeticAxes[1], type: "Narratives", description: "Storytelling as sense-making — how we frame what matters" },
    // CALM
    { axis: energeticAxes[2], type: "Workflows", description: "Process and tools for conscious, intentional daily practice" },
    { axis: energeticAxes[2], type: "Inquiry and Practices", description: "Questions and rituals that open new understanding" },
    { axis: energeticAxes[2], type: "Playgrounds", description: "Experiments, prototypes, and bold attempts at transformation" },
    // OPEN
    { axis: energeticAxes[3], type: "Human Dynamics & System Thinking", description: "How humans and systems interact, emerge, and evolve together" },
    { axis: energeticAxes[3], type: "Connected Life", description: "Living in networks — relationships between people, data, and place" },
    { axis: energeticAxes[3], type: "Telling Stories (Narratives)", description: "The craft of shaping experience into shareable meaning" },
    // FREE
    { axis: energeticAxes[4], type: "WorldBuilders", description: "Designing entire realities — games, fiction, futures, and beyond" },
    { axis: energeticAxes[4], type: "Post-Broadcast", description: "Media after the monologue — participatory, emergent, alive" },
    { axis: energeticAxes[4], type: "Connected Life", description: "Digital and physical worlds merging into continuous experience" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <Badge variant="outline" className="px-6 py-2 text-lg font-medium bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              Monthly Newsletter
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 dark:from-slate-200 dark:via-purple-400 dark:to-blue-400">
              Drift
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Where intentional wandering meets<br />
              the compass of calm magic
            </p>
            
            <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto">
              A monthly conversation with the currents of change,<br />
              navigating what emerges with intention
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button size="lg" className="px-8 py-3 text-lg" onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}>
              <Mail className="w-5 h-5 mr-2" />
              Subscribe to the Drift
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg" onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}>
              <Compass className="w-5 h-5 mr-2" />
              Explore Topics
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Issue Section */}
      <section id="latest" className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/30">
              Latest Issue
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Monthly Drift
            </h2>
          </div>

          {/* Featured YouTube Episode */}
          <Card className="overflow-hidden border-2 border-primary/20 bg-background/50 backdrop-blur-sm mb-12">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/o1ya-7hIVww"
                title="Tu veux être payé pour tes idées? 3 pros t'expliquent."
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  <Mic className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
                <span className="text-sm text-muted-foreground">monExpansion • 2h 30min</span>
              </div>
              <h3 className="text-2xl font-bold">Tu veux être payé pour tes idées? 3 pros t'expliquent.</h3>
              <p className="text-muted-foreground leading-relaxed">
                Une conversation profonde avec 3 professionnels sur la monétisation des idées créatives, 
                l'entrepreneuriat conscient et la création de valeur authentique.
              </p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => window.open('https://youtu.be/o1ya-7hIVww', '_blank')}
              >
                Watch on YouTube
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            A monthly newsletter exploring the five forces of the Calm Magic compass — how these energies shape our work, relationships, and creative evolution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {energeticAxes.map((axis) => (
              <Card key={axis.key} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      style={{ backgroundColor: `${axis.color}15`, color: axis.color, borderColor: `${axis.color}30` }}
                      className="font-semibold"
                    >
                      {axis.name}
                    </Badge>
                    <Compass className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold">{axis.subtitle}</h3>
                  <p className="text-muted-foreground leading-relaxed">{axis.description}</p>
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
              Discovery Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each issue organizes discoveries across the five dimensions of the Calm Magic compass. Five lenses for navigating complexity with grace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      {section.axis.subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Archive Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-secondary/5 to-accent/5">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Monthly Review
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each month, a curated list of books, videos, apps and curious discoveries mapped to the Calm Magic compass.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {driftMonthlyDiscoveries.map((entry) => {
              const allAxes = [
                ...entry.books.map(b => b.axis),
                ...(entry.videos || []).map(v => v.axis),
                ...(entry.songs || []).map(s => s.axis),
                ...(entry.podcasts || []).map(p => p.axis),
                ...(entry.articles || []).map(a => a.axis),
              ];
              const uniqueAxes = [...new Set(allAxes)];
              const hasBooks = entry.books.length > 0;
              const hasVideos = (entry.videos || []).length > 0;
              const hasSongs = (entry.songs || []).length > 0;
              const hasPodcasts = (entry.podcasts || []).length > 0;
              const hasArticles = (entry.articles || []).length > 0;
              const hasAnyContent = hasBooks || hasVideos || hasSongs || hasPodcasts || hasArticles;

              return (
                <Link
                  key={`${entry.year}-${entry.month}`}
                  to={`/drift/${entry.year}/${String(entry.month).padStart(2, '0')}`}
                >
                  <Card className={`group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 h-full ${!hasAnyContent ? 'opacity-50' : ''}`}>
                    <CardContent className="p-4 space-y-2 text-center">
                      <div className="flex justify-center gap-1.5">
                        {hasBooks && <BookOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                        {hasVideos && <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                        {hasSongs && <Music className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                        {hasPodcasts && <Headphones className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                        {hasArticles && <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                        {!hasAnyContent && <BookOpen className="w-4 h-4 text-muted-foreground/40" />}
                      </div>
                      <p className="font-bold text-sm">{getMonthName(entry.month)}</p>
                      <p className="text-xs text-muted-foreground">{entry.year}</p>
                      <div className="flex justify-center gap-1 flex-wrap">
                        {uniqueAxes.map(axis => (
                          <span
                            key={axis}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: axisColors[axis] }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resource Libraries by Axis */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Resource Libraries
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore all curated resources organized by the five Calm Magic forces.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {energeticAxes.map((axis) => {
              const bookCount = driftMonthlyDiscoveries.reduce((sum, entry) => sum + entry.books.filter(b => b.axis === axis.key).length, 0);
              const extraBookCount = driftLibraryExtras.filter(b => b.axis === axis.key).length;
              const videoCount = driftMonthlyDiscoveries.reduce((sum, entry) => sum + (entry.videos || []).filter(v => v.axis === axis.key).length, 0);
              const monthlyArtefactCount = driftMonthlyDiscoveries.reduce((sum, entry) => sum + (entry.artefacts || []).filter(a => a.axis === axis.key).length, 0);
              const libraryArtefactCount = driftLibraryArtefacts.filter(a => a.axis === axis.key).length;
              const totalCount = bookCount + extraBookCount + videoCount + monthlyArtefactCount + libraryArtefactCount;

              return (
                <Link key={axis.key} to={`/drift/library/${axis.key}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-2 h-full" style={{ borderColor: `${axis.color}30` }}>
                    <CardContent className="p-6 space-y-3 text-center">
                      <div className="w-10 h-10 rounded-full mx-auto" style={{ backgroundColor: `${axis.color}20` }}>
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: axis.color }} />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: axis.color }}>{axis.name}</h3>
                      <p className="text-sm text-muted-foreground">{axis.subtitle}</p>
                      <p className="text-xs text-muted-foreground">{totalCount} resources</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
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
                  Receive the monthly Drift newsletter — discoveries, tools, and stories organized through the Calm Magic compass.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="space-y-4">
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DriftLanding;