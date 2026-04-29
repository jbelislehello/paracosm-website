import { motion } from "framer-motion";
import { useState } from "react";
import { SEASON_DEFINITIONS, SeasonId } from "@/data/seasonDefinitions";

const SEASON_COLORS: Record<SeasonId, { from: string; to: string; ring: string }> = {
  POLLENS: { from: "from-rose-400", to: "to-pink-500", ring: "ring-rose-400/40" },
  NOEMS: { from: "from-purple-400", to: "to-fuchsia-500", ring: "ring-purple-400/40" },
  POEMS: { from: "from-blue-400", to: "to-indigo-500", ring: "ring-blue-400/40" },
  TOTEMS: { from: "from-emerald-400", to: "to-teal-500", ring: "ring-emerald-400/40" },
  ANTHEMS: { from: "from-amber-400", to: "to-orange-500", ring: "ring-amber-400/40" },
};

const ORDER: SeasonId[] = ["POLLENS", "NOEMS", "POEMS", "TOTEMS", "ANTHEMS"];

const SeasonsStepper = () => {
  const [active, setActive] = useState<SeasonId>("POLLENS");
  const def = SEASON_DEFINITIONS[active];
  const palette = SEASON_COLORS[active];

  return (
    <section className="relative bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">02 · The Seasons</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Five seasons. One product nervous system.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Each season is a layer of the PRD — relational, then conceptual, then experiential, then technical, then narrative. Tap any season to read what unlocks.
          </p>
        </div>

        {/* Stepper */}
        <div className="relative mx-auto mb-10 flex max-w-4xl items-center justify-between">
          <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
          {ORDER.map((id) => {
            const c = SEASON_COLORS[id];
            const isActive = id === active;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`relative flex flex-col items-center gap-2 transition-transform ${
                  isActive ? "scale-110" : "hover:scale-105"
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${c.from} ${c.to} text-sm font-bold text-white shadow-lg transition-all ${
                    isActive ? `ring-4 ${c.ring}` : ""
                  }`}
                >
                  {id[0]}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider transition-colors md:text-xs ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {id}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active season detail */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 shadow-xl md:p-12`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${palette.from} ${palette.to} text-sm font-bold text-white`}
            >
              {active[0]}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Season {ORDER.indexOf(active) + 1} of 5
              </p>
              <h3 className="text-2xl font-bold text-foreground">{def.label}</h3>
            </div>
          </div>

          <p className="mt-5 text-base font-medium text-foreground">{def.shortDescription}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{def.fullDescription}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {def.focus.map((f) => (
              <span
                key={f}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground"
              >
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SeasonsStepper;
