import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Flower2, Flame } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/contexts/LanguageContext";

type Play = {
  partner: string;
  icon: typeof Sparkles;
  play: string;
  unlocks: string;
  audience: string;
  outcome: string;
  accent: string;
};

const playsEn: Play[] = [
  {
    partner: "Base44",
    icon: Sparkles,
    play: "Imagination Lab",
    unlocks: "Speculative worlds, diegetic prototypes, audio-visual scenes that let leadership feel a future.",
    audience: "Founders and product leads who need a story before a spec.",
    outcome: "A shareable universe that gets the room aligned on what to build first.",
    accent: "from-fuchsia-500/20 to-purple-500/5",
  },
  {
    partner: "Lovable + Powerbase",
    icon: Flower2,
    play: "Hypothesis Sprint",
    unlocks: "Working prototypes in days, wired to real data and real users, without a full engineering team.",
    audience: "Teams sitting on a decision they've been avoiding.",
    outcome: "Evidence, not opinions — a shipped surface you can react to.",
    accent: "from-pink-500/20 to-rose-500/5",
  },
  {
    partner: "Crewdle",
    icon: Flame,
    play: "Agentic Production",
    unlocks: "Compliant, sovereign agent infrastructure — the leap from prototype to live operations.",
    audience: "Organizations turning experiments into governed practice.",
    outcome: "Agents that run inside your org, on your terms, with human oversight designed in.",
    accent: "from-amber-500/20 to-orange-500/5",
  },
];

const playsFr: Play[] = [
  {
    partner: "Base44",
    icon: Sparkles,
    play: "Laboratoire d'imagination",
    unlocks: "Mondes spéculatifs, prototypes diégétiques, scènes audio-visuelles qui permettent au leadership de ressentir un futur.",
    audience: "Fondateur·rice·s et responsables produit qui ont besoin d'un récit avant d'écrire une spec.",
    outcome: "Un univers partageable qui aligne la salle sur ce qu'il faut construire en premier.",
    accent: "from-fuchsia-500/20 to-purple-500/5",
  },
  {
    partner: "Lovable + Powerbase",
    icon: Flower2,
    play: "Sprint d'hypothèse",
    unlocks: "Prototypes fonctionnels en quelques jours, connectés à de vraies données et de vrai·e·s utilisateur·rice·s, sans équipe d'ingénierie complète.",
    audience: "Équipes bloquées sur une décision qu'elles évitent.",
    outcome: "Des preuves, pas des opinions — une surface livrée à laquelle réagir.",
    accent: "from-pink-500/20 to-rose-500/5",
  },
  {
    partner: "Crewdle",
    icon: Flame,
    play: "Production agentique",
    unlocks: "Infrastructure d'agents conforme et souveraine — le saut du prototype aux opérations en production.",
    audience: "Organisations qui transforment leurs expérimentations en pratique gouvernée.",
    outcome: "Des agents qui tournent dans votre organisation, à vos conditions, avec supervision humaine intégrée.",
    accent: "from-amber-500/20 to-orange-500/5",
  },
];

export default function PartnerInnovationPlaysSection() {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const plays = isFr ? playsFr : playsEn;

  return (
    <section className="py-20 md:py-28 px-6 bg-background">
      <div className="container max-w-7xl mx-auto">
        <header className="mb-14 md:mb-20 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
            {isFr ? "Chapitre 04 · Stratégies d'innovation" : "Chapter 04 · Innovation plays"}
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            {isFr ? (
              <>La <em className="italic">stratégie unique</em> que nous menons avec chaque partenaire.</>
            ) : (
              <>The <em className="italic">unique play</em> we run with each partner.</>
            )}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            {isFr
              ? "Paracosm ne revend pas d'outils. Nous les composons — en choisissant l'instrument juste pour le moment de votre arc, et en orchestrant la passation pour que rien ne se perde entre imagination, prototype et production."
              : "Paracosm doesn't resell tools. We compose them — choosing the right instrument for the moment in your arc, and orchestrating the handoff so nothing gets lost between imagination, prototype, and production."}
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {plays.map(({ partner, icon: Icon, play, unlocks, audience, outcome, accent }) => (
            <article
              key={partner}
              className={`group relative rounded-2xl border border-border bg-gradient-to-br ${accent} p-8 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-xl`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-foreground/5 border border-border flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {isFr ? "Stratégie" : "Play"}
                </span>
              </div>

              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                {partner}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl mb-6 leading-tight">{play}</h3>

              <dl className="space-y-4 text-sm flex-1">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    {isFr ? "Débloque" : "Unlocks"}
                  </dt>
                  <dd className="leading-relaxed">{unlocks}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    {isFr ? "Idéal pour" : "Best for"}
                  </dt>
                  <dd className="leading-relaxed">{audience}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    {isFr ? "Résultat" : "Outcome"}
                  </dt>
                  <dd className="leading-relaxed font-medium">{outcome}</dd>
                </div>
              </dl>

              <Link
                to="/agentic-ux"
                onClick={() => trackEvent("editorial_partner_play_click", { partner })}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
              >
                {isFr ? "Voir dans l'écosystème" : "See it in the ecosystem"} <ArrowUpRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
