import { Mic, Eye, ExternalLink, Lightbulb, Box, Palette } from "lucide-react";
import logoTonalli from "@/assets/logo-tonalli.jpeg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import FoxRunningSketch from "@/components/tonalli/FoxRunningSketch";
import { usePageSeo } from "@/hooks/usePageSeo";
import { productSchema } from "@/lib/structuredData";

const Tonalli = () => {
  usePageSeo({
    title: "Tonalli — A Creative OS with Voice and Spatial branches | Paracosm",
    description: "Tonalli is Paracosm's Creative Operating System — voice computing and spatial interfaces for relational, consent-aware experiences.",
    path: "/tonalli",
    jsonLd: [
      productSchema({
        name: "Tonalli",
        description:
          "Paracosm's Creative Operating System — voice computing and spatial interfaces for relational, consent-aware experiences.",
        url: "/tonalli",
        category: "Creative Operating System",
      }),
    ],
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <img src={logoTonalli} alt="Tonalli" className="h-8 w-auto rounded-md object-contain" />
            <span className="text-amber-400">Tonalli</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/glitch-methodology" className="text-sm text-white/60 hover:text-white transition-colors">
              GL!TCH Method
            </Link>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Tonalli Initiative Inquiry">Get in Touch</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-12 text-center">
        <a
          href="https://medium.com/noemtoys"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6 hover:bg-amber-500/20 transition-colors"
        >
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-amber-300">R&D Branch of Paracosm</span>
          <ExternalLink className="h-3 w-3 text-amber-400/60" />
        </a>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-amber-400">Tonalli</span> Initiative
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Expression becomes the interface — voice and presence become the controller for learning, ideation, and generative storytelling.
        </p>
      </section>

      {/* Two Branches */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Tonalli Voice */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-violet-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-slate-900/80 border border-rose-500/30 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-rose-500/20">
                  <Mic className="h-6 w-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-rose-400">Tonalli Voice</h3>
                  <span className="text-sm text-white/50">Audio-first interactive medium</span>
                </div>
              </div>
              <p className="text-white/70 mb-4">
                People read aloud, speak prompts, or recite poetry — the system responds with soundscapes, scenes, and generative variations. Voice = agency.
              </p>
              <div className="space-y-2 text-sm">
                {["Brainstorming & ideation", "Writing / story prototyping", "Workshops & group creativity", "Learning-by-speaking (presence + recall)"].map((use) => (
                  <div key={use} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-white/60">{use}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tonalli Spatial */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-teal-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/20">
                  <Eye className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-400">Tonalli Spatial</h3>
                  <span className="text-sm text-white/50">Camera-vision + projection lamp</span>
                </div>
              </div>
              <p className="text-white/70 mb-4">
                A physical device that sees the space and projects back into it. Movement and presence become inputs for interactive stories and installations.
              </p>
              <div className="space-y-2 text-sm">
                {["Interactive storytelling in a room", "Playful learning environments", "Museum & school installations", '"Walkable" scenes — explore by moving'].map((use) => (
                  <div key={use} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-white/60">{use}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Design Platforms */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-semibold mb-8 text-white/80">Educational Design Platforms</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <a
              href="https://medium.com/noemtoys/tagged/sensory-rooms"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/50 border border-white/10 rounded-xl p-5 text-center hover:border-amber-500/30 transition-colors group"
            >
              <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                <Lightbulb className="h-6 w-6 text-amber-400" />
              </div>
              <h4 className="font-semibold mb-1">Sensory Rooms</h4>
              <p className="text-sm text-white/50">Immersive spatial experiences for sensory learning</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-amber-400/60 group-hover:text-amber-400 transition-colors">
                Read more <ExternalLink className="h-3 w-3" />
              </span>
            </a>
            <a
              href="https://medium.com/noemtoys/tagged/tangible-play"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/50 border border-white/10 rounded-xl p-5 text-center hover:border-cyan-500/30 transition-colors group"
            >
              <div className="mx-auto w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3">
                <Box className="h-6 w-6 text-cyan-400" />
              </div>
              <h4 className="font-semibold mb-1">Cognitive Toys</h4>
              <p className="text-sm text-white/50">Tangible computing toys for embodied cognition</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-400/60 group-hover:text-cyan-400 transition-colors">
                Read more <ExternalLink className="h-3 w-3" />
              </span>
            </a>
            <a
              href="https://medium.com/noemtoys/tagged/embodied-cognition"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/50 border border-white/10 rounded-xl p-5 text-center hover:border-rose-500/30 transition-colors group"
            >
              <div className="mx-auto w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-3">
                <Palette className="h-6 w-6 text-rose-400" />
              </div>
              <h4 className="font-semibold mb-1">Expressivity</h4>
              <p className="text-sm text-white/50">Wearables and embodied interaction for creative expression</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-rose-400/60 group-hover:text-rose-400 transition-colors">
                Read more <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          </div>

          <div className="text-center">
            <a
              href="https://medium.com/noemtoys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-amber-400 transition-colors"
            >
              Read our research on Medium <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Interested in Tonalli?</h2>
          <p className="text-white/60 mb-8">
            Whether you're an educator, museum curator, or creative technologist — let's explore what expression-first interfaces can do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950">
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Tonalli Initiative">Get in Touch</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
              <a href="https://medium.com/noemtoys" target="_blank" rel="noopener noreferrer">Read Research</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tonalli;
