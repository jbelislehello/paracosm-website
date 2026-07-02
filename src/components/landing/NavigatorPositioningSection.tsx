import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, Sparkles, Flame, Leaf, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Positions Jonathan / Paracosm as a practitioner INSIDE the AI ecosystem
 * (Crewdle / Lovable / Base44), with Calm Magic as the inner navigation
 * system that decides what to build, in what order, and why.
 */
export default function NavigatorPositioningSection() {
  const { language } = useLanguage();
  const fr = language === "fr";

  const tools = [
    {
      name: "Base44",
      energy: fr
        ? "Jeu, audio-visuel, immersion, imagination pure"
        : "Play, audio-visual, immersion, pure imagination",
      season: fr ? "Noems — MAGIC" : "Noems — MAGIC",
      seasonDesc: fr
        ? "l'espace du possible, du non-linéaire"
        : "the space of the possible, the non-linear",
      icon: Sparkles,
      gradient: "from-fuchsia-500 to-purple-500",
    },
    {
      name: "Lovable + Powerbase",
      energy: fr
        ? "Prototype rapide, hypothèse, tester une intuition"
        : "Rapid prototype, hypothesis, testing an intuition",
      season: fr ? "Pollens — LOVE" : "Pollens — LOVE",
      seasonDesc: fr
        ? "les graines, l'exploration, ce qui cherche à émerger"
        : "the seeds, exploration, what wants to emerge",
      icon: Flower2,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Crewdle",
      energy: fr
        ? "Systèmes autonomes, déploiement, production réelle"
        : "Autonomous systems, deployment, real production",
      season: fr ? "Totems + Anthems — OPEN / FREE" : "Totems + Anthems — OPEN / FREE",
      seasonDesc: fr
        ? "ce qui tient, ce qui opère dans le monde"
        : "what holds, what operates in the world",
      icon: Flame,
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section
      id="navigator-positioning"
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div className="container max-w-6xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs uppercase tracking-widest text-primary mb-6">
            <Compass className="w-3.5 h-3.5" />
            {fr ? "Positionnement" : "Positioning"}
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
            {fr ? (
              <>
                La plupart ont des outils puissants.{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-600">
                  Peu ont une boussole intérieure.
                </span>
              </>
            ) : (
              <>
                Most people have powerful tools.{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-600">
                  Few have an inner compass.
                </span>
              </>
            )}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {fr
              ? "Je ne suis pas un penseur qui parle de Calm Magic en théorie. Je suis un praticien qui vit à l'intérieur de l'écosystème — et Calm Magic est le système de navigation qui décide quoi construire, avec quel outil, et pourquoi."
              : "I'm not a thinker talking about Calm Magic in theory. I'm a practitioner living inside the ecosystem — and Calm Magic is the navigation system that decides what to build, with which tool, and why."}
          </p>
        </div>

        {/* Tools mapped to seasons */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.name}
                className="relative rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {tool.energy}
                </p>
                <div className="pt-4 border-t border-border/50">
                  <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                    {fr ? "Saison Calm Magic" : "Calm Magic season"}
                  </div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5" />
                    {tool.season}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 italic">
                    {tool.seasonDesc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pull quote */}
        <blockquote className="relative max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-gradient-to-br from-fuchsia-500/5 via-purple-500/5 to-blue-500/5 p-8 md:p-12 mb-12">
          <div className="text-5xl leading-none text-primary/40 mb-4">"</div>
          <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
            {fr
              ? "Je construis des agents autonomes sur Crewdle, je prototype sur Lovable, je joue avec Base44. Et Calm Magic est ce qui décide pourquoi je construis chaque chose, dans quel ordre, pour qui, et ce que ça doit ressentir dans le monde."
              : "I build autonomous agents on Crewdle, prototype on Lovable, and play with Base44. Calm Magic is what decides why I build each thing, in what order, for whom, and what it should feel like in the world."}
          </p>
          <footer className="mt-6 text-sm text-muted-foreground">
            — Jonathan Belisle
          </footer>
        </blockquote>

        {/* The rare position */}
        <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {fr ? "Ni ceci" : "Not this"}
            </div>
            <p className="text-sm">
              {fr
                ? "Un expert technique qui découvre la philosophie."
                : "A technical expert discovering philosophy."}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {fr ? "Ni cela" : "Not that"}
            </div>
            <p className="text-sm">
              {fr
                ? "Un philosophe qui parle d'IA sans savoir builder."
                : "A philosopher talking about AI without knowing how to build."}
            </p>
          </div>
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
            <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
              {fr ? "Les deux — reliés" : "Both — bridged"}
            </div>
            <p className="text-sm font-medium">
              {fr
                ? "Intelligence relationnelle + intelligence technique. Calm Magic est le pont."
                : "Relational intelligence + technical intelligence. Calm Magic is the bridge."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:jbelisle@helloarchitekt.com?subject=Navigation%20Session%20—%20Calm%20Magic">
            <Button size="lg" className="gap-2">
              <Compass className="w-4 h-4" />
              {fr ? "Réserver une session de navigation" : "Book a navigation session"}
            </Button>
          </a>
          <a href="/calm-magic-board">
            <Button size="lg" variant="outline">
              {fr ? "Voir le Board Calm Magic" : "See the Calm Magic Board"}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
