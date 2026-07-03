import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Flower2, Flame } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const plays = [
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

export default function PartnerInnovationPlaysSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-background">
      <div className="container max-w-7xl mx-auto">
        <header className="mb-14 md:mb-20 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">
            Chapter 04 · Innovation plays
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            The <em className="italic">unique play</em> we run with each partner.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Paracosm doesn't resell tools. We compose them — choosing the right instrument for the
            moment in your arc, and orchestrating the handoff so nothing gets lost between imagination,
            prototype, and production.
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
                  Play
                </span>
              </div>

              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
                {partner}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl mb-6 leading-tight">{play}</h3>

              <dl className="space-y-4 text-sm flex-1">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    Unlocks
                  </dt>
                  <dd className="leading-relaxed">{unlocks}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    Best for
                  </dt>
                  <dd className="leading-relaxed">{audience}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    Outcome
                  </dt>
                  <dd className="leading-relaxed font-medium">{outcome}</dd>
                </div>
              </dl>

              <Link
                to="/agentic-ux"
                onClick={() => trackEvent("editorial_partner_play_click", { partner })}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
              >
                See it in the ecosystem <ArrowUpRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
