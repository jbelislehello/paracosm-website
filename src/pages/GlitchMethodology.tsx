import { Search, Waves, Sparkles, ArrowRight, Clock, Users, Zap, FileText, Code, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { articleSchema } from "@/lib/structuredData";

const GlitchMethodology = () => {
  usePageSeo({
    title: "GL!TCH Methodology — A 25-minute live cycle for relational intelligence | Paracosm",
    description: "GL!TCH is a 25-minute live facilitation methodology for cultural, interface, and inner script work — grounded in the Calm Magic framework.",
    path: "/glitch-methodology",
    jsonLd: [
      articleSchema({
        title: "GL!TCH Methodology — A 25-minute live cycle for relational intelligence",
        description:
          "GL!TCH is a 25-minute live facilitation methodology for cultural, interface, and inner script work — grounded in the Calm Magic framework.",
        url: "/glitch-methodology",
        datePublished: "2025-01-01",
      }),
    ],
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-rose-400">GL!</span>TCH
          </Link>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <Clock className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-white/70">25-Minute Transformation</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          From <span className="text-rose-400">Conversation</span> to{" "}
          <span className="text-violet-400">Software</span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          A live facilitation methodology that transforms group dialogue into technical specifications
        </p>
      </section>

      {/* The 3 Phases */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-center text-2xl font-semibold mb-12 text-white/80">The Breath Cycle</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* GLITCH */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-red-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-slate-900/80 border border-rose-500/30 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-rose-500/20">
                  <Search className="h-6 w-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-rose-400">GL!TCH</h3>
                  <span className="text-sm text-white/50">7 minutes</span>
                </div>
              </div>
              <p className="text-white/70 mb-4">Sensing & Harvesting</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-white/60">"What tensions are present?"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-white/60">"Where is energy blocked?"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-white/60">"What glitches are surfacing?"</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-xs uppercase tracking-wider text-rose-400/80">Output</span>
                <p className="text-lg font-medium mt-1">POLLEN</p>
                <p className="text-sm text-white/50">Raw signals & context fragments</p>
              </div>
            </div>
          </div>

          {/* DRIFT */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-slate-900/80 border border-violet-500/30 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-violet-500/20">
                  <Waves className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-violet-400">DRIFT</h3>
                  <span className="text-sm text-white/50">10 minutes</span>
                </div>
              </div>
              <p className="text-white/70 mb-4">Exploring & Conceptualizing</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <span className="text-white/60">"What wild guesses emerge?"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <span className="text-white/60">"What connections are forming?"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <span className="text-white/60">"What's the strangest possibility?"</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-xs uppercase tracking-wider text-violet-400/80">Output</span>
                <p className="text-lg font-medium mt-1">NOEMS</p>
                <p className="text-sm text-white/50">Conceptual atoms & mental models</p>
              </div>
            </div>
          </div>

          {/* TUNE */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <Sparkles className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400">TUNE</h3>
                  <span className="text-sm text-white/50">6 minutes</span>
                </div>
              </div>
              <p className="text-white/70 mb-4">Crystallizing & Committing</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white/60">"What's ready to commit to form?"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white/60">"What's one concrete next step?"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white/60">"What pattern crystallized?"</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-xs uppercase tracking-wider text-emerald-400/80">Output</span>
                <p className="text-lg font-medium mt-1">POEMS</p>
                <p className="text-sm text-white/50">Narrative frames & commitments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Pipeline */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-center text-2xl font-semibold mb-4 text-white/80">The 5-Season Pipeline</h2>
        <p className="text-center text-white/50 mb-12 max-w-xl mx-auto">
          How spoken words become structured specifications
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
          {[
            { name: "POLLEN", desc: "Signals", color: "rose" },
            { name: "NOEMS", desc: "Concepts", color: "violet" },
            { name: "POEMS", desc: "Narratives", color: "blue" },
            { name: "TOTEMS", desc: "Architecture", color: "cyan" },
            { name: "ANTHEMS", desc: "Market", color: "amber" },
          ].map((season, i) => (
            <div key={season.name} className="flex items-center gap-4">
              <div className={`text-center px-6 py-4 rounded-xl bg-${season.color}-500/10 border border-${season.color}-500/30`}
                   style={{ 
                     background: `linear-gradient(135deg, ${
                       season.color === 'rose' ? 'rgba(244,63,94,0.1)' :
                       season.color === 'violet' ? 'rgba(139,92,246,0.1)' :
                       season.color === 'blue' ? 'rgba(59,130,246,0.1)' :
                       season.color === 'cyan' ? 'rgba(6,182,212,0.1)' :
                       'rgba(245,158,11,0.1)'
                     }, transparent)`,
                     borderColor: season.color === 'rose' ? 'rgba(244,63,94,0.3)' :
                       season.color === 'violet' ? 'rgba(139,92,246,0.3)' :
                       season.color === 'blue' ? 'rgba(59,130,246,0.3)' :
                       season.color === 'cyan' ? 'rgba(6,182,212,0.3)' :
                       'rgba(245,158,11,0.3)'
                   }}>
                <p className="font-bold text-white">{season.name}</p>
                <p className="text-xs text-white/50">{season.desc}</p>
              </div>
              {i < 4 && <ArrowRight className="h-5 w-5 text-white/30 hidden sm:block" />}
            </div>
          ))}
        </div>
      </section>

      {/* What Gets Generated */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-8 text-center">What Gets Generated</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-xl bg-rose-500/20 flex items-center justify-center mb-3">
                <FileText className="h-7 w-7 text-rose-400" />
              </div>
              <h3 className="font-semibold mb-1">Living PRD</h3>
              <p className="text-sm text-white/50">Auto-structured requirements</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                <Code className="h-7 w-7 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-1">Tech Stack</h3>
              <p className="text-sm text-white/50">Framework recommendations</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3">
                <Zap className="h-7 w-7 text-cyan-400" />
              </div>
              <h3 className="font-semibold mb-1">Agentic Prompts</h3>
              <p className="text-sm text-white/50">8-layer architecture</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                <Megaphone className="h-7 w-7 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-1">Market Anthem</h3>
              <p className="text-sm text-white/50">Brand positioning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Session Formats */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-center text-2xl font-semibold mb-8 text-white/80">Session Formats</h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-white/50" />
              <span className="text-sm text-white/50">5-9 people</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Spark</h3>
            <p className="text-3xl font-bold text-rose-400">25<span className="text-lg">min</span></p>
            <p className="text-sm text-white/50 mt-2">1 full cycle</p>
          </div>
          <div className="bg-slate-800/50 border border-violet-500/30 rounded-xl p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-500 rounded-full text-xs font-medium">
              Popular
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-white/50" />
              <span className="text-sm text-white/50">10-20 people</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Workshop</h3>
            <p className="text-3xl font-bold text-violet-400">90<span className="text-lg">min</span></p>
            <p className="text-sm text-white/50 mt-2">3 cycles + synthesis</p>
          </div>
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-white/50" />
              <span className="text-sm text-white/50">15-50 people</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Immersion</h3>
            <p className="text-3xl font-bold text-emerald-400">3<span className="text-lg">hrs</span></p>
            <p className="text-sm text-white/50 mt-2">Complete PRD generation</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Next Session?</h2>
          <p className="text-white/60 mb-8">
            Book a demo or start your first GL!TCH session today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-rose-500 hover:bg-rose-600">
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Start a GL!TCH Session">Start Free</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
              <a href="mailto:jbelisle@helloarchitekt.com?subject=GL!TCH Methodology Inquiry">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-white/40">
          <span>© 2025 GL!TCH Methodology</span>
          <Link to="/" className="hover:text-white/60">Back to Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default GlitchMethodology;
