import { motion } from "framer-motion";

const LAYERS = [
  { name: "POLLEN", subtitle: "Cultural & relational ground", color: "from-rose-400 to-pink-500" },
  { name: "INTENT", subtitle: "Conceptual frame", color: "from-purple-400 to-fuchsia-500" },
  { name: "EXPERIENCE", subtitle: "P.O.E.M.S. design", color: "from-blue-400 to-indigo-500" },
  { name: "SUBSTRATE", subtitle: "Technical totems", color: "from-emerald-400 to-teal-500" },
  { name: "EXECUTION", subtitle: "Anthems, go-to-market", color: "from-amber-400 to-orange-500" },
];

const PrdLayersStack = () => (
  <section className="relative bg-gradient-to-b from-muted/30 via-background to-background py-20 md:py-32">
    <div className="container mx-auto max-w-6xl px-6">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            06 · The Compiler
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            From felt experience → to a foundational prompt.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Calm Magic compiles the five seasons into a structured PRD with 30
            ontological fields — then exports it as agentic prompts, MCP tools,
            and tech-stack JSON. Your board becomes your specification.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-foreground/90">
            <li>· Strict 1:1 mapping — no concatenated entities</li>
            <li>· Versioned, branchable, mergeable</li>
            <li>· Exports to Claude Skills, OECD AI alignment, Service Blueprint</li>
          </ul>
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-md">
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`absolute left-0 right-0 rounded-2xl border border-border bg-gradient-to-br ${l.color} p-5 shadow-xl backdrop-blur-sm`}
              style={{
                top: `${i * 64}px`,
                zIndex: i + 1,
                opacity: 0.92,
              }}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                    Layer {i + 1}
                  </p>
                  <p className="text-lg font-bold">{l.name}</p>
                </div>
                <p className="text-xs opacity-90">{l.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PrdLayersStack;
