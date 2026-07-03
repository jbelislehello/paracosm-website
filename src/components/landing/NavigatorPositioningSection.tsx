import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, Sparkles, Flame, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Magazine-style editorial positioning: Jonathan / Paracosm as a practitioner
 * inside the AI ecosystem (Crewdle / Lovable / Base44), with Calm Magic as
 * the inner navigation system.
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
      season: "Noems — MAGIC",
      seasonDesc: fr
        ? "l'espace du possible, du non-linéaire"
        : "the space of the possible, the non-linear",
      icon: Sparkles,
    },
    {
      name: "Lovable + Powerbase",
      energy: fr
        ? "Prototype rapide, hypothèse, tester une intuition"
        : "Rapid prototype, hypothesis, testing an intuition",
      season: "Pollens — LOVE",
      seasonDesc: fr
        ? "les graines, l'exploration, ce qui cherche à émerger"
        : "the seeds, exploration, what wants to emerge",
      icon: Flower2,
    },
    {
      name: "Crewdle",
      energy: fr
        ? "Systèmes autonomes, déploiement, production réelle"
        : "Autonomous systems, deployment, real production",
      season: "Totems + Anthems — OPEN / FREE",
      seasonDesc: fr
        ? "ce qui tient, ce qui opère dans le monde"
        : "what holds, what operates in the world",
      icon: Flame,
    },
  ];

  return (
    <section
      id="navigator-positioning"
      className="relative py-20 md:py-32 px-6 bg-[hsl(35_45%_96%)] text-foreground border-b border-current/10 overflow-hidden"
    >
      {/* editorial texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-[hsl(15_75%_55%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-[hsl(15_75%_45%)] blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Chapter header */}
        <div className="flex items-baseline gap-6 mb-12 md:mb-16 pb-6 border-b border-current/15">
          <span className="font-serif text-6xl md:text-8xl leading-none text-[hsl(15_75%_55%)]">
            02
          </span>
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold text-[hsl(15_75%_45%)]">
              Chapter 02 · {fr ? "Positionnement" : "Positioning"}
            </p>
            <p className="font-serif italic text-2xl md:text-3xl mt-1">
              {fr ? "La boussole intérieure" : "The inner compass"}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-8 space-y-8">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight">
              {fr ? (
                <>
                  La plupart ont des outils puissants.{" "}
                  <em className="italic font-light">
                    Peu ont une{" "}
                    <span className="underline decoration-[hsl(15_75%_55%)] decoration-4 underline-offset-[10px]">
                      boussole intérieure
                    </span>
                    .
                  </em>
                </>
              ) : (
                <>
                  Most people have powerful tools.{" "}
                  <em className="italic font-light">
                    Few have an{" "}
                    <span className="underline decoration-[hsl(15_75%_55%)] decoration-4 underline-offset-[10px]">
                      inner compass
                    </span>
                    .
                  </em>
                </>
              )}
            </h2>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl opacity-80">
              {fr
                ? "Je ne suis pas un penseur qui parle de Calm Magic en théorie. Je suis un praticien qui vit à l'intérieur de l'écosystème — et Calm Magic est le système de navigation qui décide quoi construire, avec quel outil, et pourquoi."
                : "I'm not a thinker talking about Calm Magic in theory. I'm a practitioner living inside the ecosystem — and Calm Magic is the navigation system that decides what to build, with which tool, and why."}
            </p>
          </div>

          <aside className="lg:col-span-4 lg:border-l lg:border-current/20 lg:pl-8 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[hsl(15_75%_45%)]">
              {fr ? "Dans ce chapitre" : "In this chapter"}
            </p>
            <ol className="space-y-3 text-sm">
              {[
                ["I.", fr ? "Trois outils, trois saisons" : "Three tools, three seasons"],
                ["II.", fr ? "Note du praticien" : "Practitioner's note"],
                ["III.", fr ? "La position rare" : "The rare position"],
              ].map(([n, t]) => (
                <li key={n} className="flex gap-3">
                  <span className="font-serif text-[hsl(15_75%_55%)]">{n}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        {/* Tools grid — editorial plates */}
        <div className="grid md:grid-cols-3 gap-0 mb-20 border-t border-current/15">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.name}
                className={`p-8 border-b border-current/15 ${
                  i > 0 ? "md:border-l md:border-current/15" : ""
                }`}
              >
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-serif text-[hsl(15_75%_55%)] text-2xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="w-4 h-4 text-[hsl(15_75%_45%)]" />
                </div>
                <h3 className="font-serif text-3xl mb-3 leading-tight">{tool.name}</h3>
                <p className="text-sm leading-relaxed opacity-80 mb-6">{tool.energy}</p>
                <div className="pt-4 border-t border-current/15">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[hsl(15_75%_45%)] font-bold mb-2">
                    {fr ? "Saison Calm Magic" : "Calm Magic season"}
                  </div>
                  <div className="font-serif italic text-lg">{tool.season}</div>
                  <div className="text-xs opacity-70 mt-1">{tool.seasonDesc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pull quote */}
        <blockquote className="max-w-4xl mx-auto mb-20 border-l-2 border-[hsl(15_75%_55%)] pl-8">
          <p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[hsl(15_75%_45%)] mb-4">
            {fr ? "Note du praticien" : "Practitioner's note"}
          </p>
          <p className="font-serif italic text-2xl md:text-4xl leading-[1.2]">
            {fr
              ? "« Je construis des agents autonomes sur Crewdle, je prototype sur Lovable, je joue avec Base44. Et Calm Magic est ce qui décide pourquoi je construis chaque chose, dans quel ordre, pour qui, et ce que ça doit ressentir dans le monde. »"
              : "\u201CI build autonomous agents on Crewdle, prototype on Lovable, and play with Base44. Calm Magic is what decides why I build each thing, in what order, for whom, and what it should feel like in the world.\u201D"}
          </p>
          <footer className="mt-6 text-[10px] uppercase tracking-[0.3em] opacity-70">
            — Jonathan Belisle
          </footer>
        </blockquote>

        {/* The rare position */}
        <div className="grid md:grid-cols-3 gap-0 mb-16 border-t border-current/15">
          {[
            {
              tag: fr ? "Ni ceci" : "Not this",
              body: fr
                ? "Un expert technique qui découvre la philosophie."
                : "A technical expert discovering philosophy.",
              highlight: false,
            },
            {
              tag: fr ? "Ni cela" : "Not that",
              body: fr
                ? "Un philosophe qui parle d'IA sans savoir builder."
                : "A philosopher talking about AI without knowing how to build.",
              highlight: false,
            },
            {
              tag: fr ? "Les deux — reliés" : "Both — bridged",
              body: fr
                ? "Intelligence relationnelle + intelligence technique. Calm Magic est le pont."
                : "Relational intelligence + technical intelligence. Calm Magic is the bridge.",
              highlight: true,
            },
          ].map((item, i) => (
            <div
              key={item.tag}
              className={`p-8 border-b border-current/15 ${
                i > 0 ? "md:border-l md:border-current/15" : ""
              } ${item.highlight ? "bg-current/5" : ""}`}
            >
              <div
                className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-3 ${
                  item.highlight ? "text-[hsl(15_75%_45%)]" : "opacity-60"
                }`}
              >
                {item.tag}
              </div>
              <p
                className={`font-serif text-lg leading-snug ${
                  item.highlight ? "italic" : "opacity-80"
                }`}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:jbelisle@helloarchitekt.com?subject=Navigation%20Session%20—%20Calm%20Magic">
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-none text-xs uppercase tracking-[0.2em] font-semibold"
            >
              <Compass className="w-4 h-4" />
              {fr ? "Réserver une session de navigation" : "Book a navigation session"}
            </Button>
          </a>
          <a href="/calm-magic-board">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border border-current/40 bg-transparent hover:bg-current/10 rounded-none text-xs uppercase tracking-[0.2em] font-semibold"
            >
              {fr ? "Voir le Board Calm Magic" : "See the Calm Magic Board"}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
