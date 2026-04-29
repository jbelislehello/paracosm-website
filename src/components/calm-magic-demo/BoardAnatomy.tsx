import { motion } from "framer-motion";
import { useState } from "react";

const ROWS = [
  { letter: "M", label: "Mindsets", group: "AGENDAS" },
  { letter: "A", label: "Agilities", group: "AGENDAS" },
  { letter: "G", label: "Goals", group: "AGENDAS" },
  { letter: "L", label: "Landscape · Intuitions", group: "LENS" },
  { letter: "E", label: "Energy · Compasses", group: "LENS" },
  { letter: "S", label: "Synergies", group: "LENS" },
  { letter: "M", label: "Methodology", group: "MAPS" },
  { letter: "A", label: "Architecture", group: "MAPS" },
];

const COLS = [
  { letter: "C", label: "Chances" },
  { letter: "H", label: "Heart" },
  { letter: "O", label: "Observer" },
  { letter: "R", label: "Reversal" },
  { letter: "D", label: "Design" },
  { letter: "S", label: "Seeds" },
  { letter: "P", label: "Protocols" },
  { letter: "S", label: "Systems" },
];

const BoardAnatomy = () => {
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);

  return (
    <section id="anatomy" className="relative py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            01 · The Board
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            64 tiles. 3 vertical stages. 2 horizontal alphabets.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            The Calm Magic board is an 8×8 ontological matrix. Every tile is the
            intersection of an inner agenda (rows) and a relational dimension
            (columns) — a coordinate where conversation becomes structure.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          {/* Annotated matrix */}
          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
              {/* Column headers */}
              <div className="ml-10 mb-2 grid grid-cols-8 gap-1.5">
                {COLS.map((c, i) => (
                  <div
                    key={i}
                    className={`text-center text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      hovered?.c === i ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {c.letter}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {/* Row headers */}
                <div className="flex w-8 flex-col gap-1.5">
                  {ROWS.map((r, i) => (
                    <div
                      key={i}
                      className={`flex aspect-square items-center justify-center text-[10px] font-bold uppercase transition-colors ${
                        hovered?.r === i ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {r.letter}
                    </div>
                  ))}
                </div>

                {/* Matrix */}
                <div className="grid flex-1 grid-cols-8 gap-1.5">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const r = Math.floor(i / 8);
                    const c = i % 8;
                    const isAgendas = r < 3;
                    const isLens = r >= 3 && r < 6;
                    const isMaps = r >= 6 || c >= 6;
                    const hi = hovered?.r === r || hovered?.c === c;
                    return (
                      <button
                        key={i}
                        onMouseEnter={() => setHovered({ r, c })}
                        onMouseLeave={() => setHovered(null)}
                        className="aspect-square rounded-md transition-all duration-200"
                        style={{
                          background: isMaps
                            ? `hsl(var(--primary) / ${hi ? 0.6 : 0.25})`
                            : isLens
                            ? `hsl(var(--accent) / ${hi ? 0.55 : 0.28})`
                            : `hsl(var(--primary) / ${hi ? 0.45 : 0.18})`,
                          transform: hi ? "scale(1.08)" : "scale(1)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-primary/30" /> AGENDAS
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-accent/40" /> LENS
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-primary/50" /> MAPS frame
              </span>
            </div>
          </div>

          {/* Annotations */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Rows 1–3 · AGENDAS</p>
              <h3 className="mt-1 text-xl font-semibold">Mindsets · Agilities · Goals</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The inner foundation. What you think, how you move, what you're aiming for.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Rows 4–6 · LENS</p>
              <h3 className="mt-1 text-xl font-semibold">Landscape · Energy · Synergies</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Consciousness expansion. MAGIC fully deploys here — Intuitions live inside Landscape, Compasses inside Energy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Rows 7–8 + Cols 7–8 · MAPS</p>
              <h3 className="mt-1 text-xl font-semibold">Methodology · Architecture · Protocols · Systems</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A boundary frame. MAPS doesn't sit on top of the work — it surrounds and supports it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-6"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Cols 1–6 · CHORDS</p>
              <h3 className="mt-1 text-xl font-semibold">Chances · Heart · Observer · Reversal · Design · Seeds</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Six relational dimensions every tile passes through. Hover the matrix to see how rows and columns intersect.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardAnatomy;
