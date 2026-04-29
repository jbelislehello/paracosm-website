import { motion } from "framer-motion";

const ToleranceZones = () => {
  const tiles = Array.from({ length: 64 });
  const zoneOf = (i: number) => {
    const r = Math.floor(i / 8);
    const c = i % 8;
    if (r >= 2 && r <= 5 && c >= 2 && c <= 5) return "inner";
    if (r >= 1 && r <= 6 && c >= 1 && c <= 6) return "stretch";
    return "edge";
  };

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              03 · Window of Tolerance
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              A nervous-system-aware container.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Every tile sits in one of three zones — Inner, Stretch, Edge. The
              board reads where your team is regulated, where it's growing,
              and where it's at risk of collapse.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-400" />
                <div>
                  <p className="font-semibold text-foreground">Inner — coherent</p>
                  <p className="text-sm text-muted-foreground">
                    Where you already operate with calm. Anchor zone.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-blue-400" />
                <div>
                  <p className="font-semibold text-foreground">Stretch — emergent</p>
                  <p className="text-sm text-muted-foreground">
                    Where transformation actually happens. Productive discomfort.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                <div>
                  <p className="font-semibold text-foreground">Edge — destabilizing</p>
                  <p className="text-sm text-muted-foreground">
                    Where forced roadmaps push teams. The board signals before burnout.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3">
              <span className="text-3xl font-bold text-primary">260</span>
              <p className="text-sm text-muted-foreground">
                tile-cycle expansion <br />
                <span className="text-xs">— how the window grows over time</span>
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8"
          >
            <div className="grid grid-cols-8 gap-1.5">
              {tiles.map((_, i) => {
                const z = zoneOf(i);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.008 }}
                    className={`aspect-square rounded-md bg-gradient-to-br ${
                      z === "inner"
                        ? "from-rose-400 to-fuchsia-400 opacity-95"
                        : z === "stretch"
                        ? "from-fuchsia-400 to-blue-400 opacity-75"
                        : "from-blue-400 to-indigo-500 opacity-55"
                    }`}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ToleranceZones;
