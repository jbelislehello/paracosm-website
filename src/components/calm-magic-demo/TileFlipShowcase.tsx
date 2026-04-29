import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, BookOpen, Compass, Sparkles } from "lucide-react";

const FACES = [
  {
    key: "felt",
    icon: Heart,
    title: "Felt state",
    body: "An emotional check-in anchors the tile in the body — coherent, activated, frozen, or expansive.",
    chip: "Polyvagal-aware",
  },
  {
    key: "hex",
    icon: Compass,
    title: "Hexagram lens",
    body: "An I Ching hexagram reveals the underlying pattern — what's moving, what's still, what's about to change.",
    chip: "I Ching · 64 patterns",
  },
  {
    key: "frag",
    icon: BookOpen,
    title: "Knowledge fragment",
    body: "A fragment of conversation, image, or insight is captured — a piece of the emerging ontology.",
    chip: "Living memory",
  },
  {
    key: "compass",
    icon: Sparkles,
    title: "Compass prompt",
    body: "An AI compass offers a next-best move — never prescriptive, always relational.",
    chip: "Agentic guidance",
  },
];

const TileFlipShowcase = () => {
  const [face, setFace] = useState(0);

  return (
    <section className="relative bg-muted/20 py-20 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              04 · The Tile
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Every tile holds four layers at once.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              A Calm Magic tile is not a sticky note. It's a relational unit
              that holds emotional state, archetypal pattern, captured knowledge
              and an agentic prompt — simultaneously.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {FACES.map((f, i) => (
                <button
                  key={f.key}
                  onClick={() => setFace(i)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    face === i
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      face === i ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <f.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">{f.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flipping tile */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={face}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl border border-border bg-gradient-to-br from-card to-muted/40 p-8 shadow-2xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {FACES[face].chip}
                    </span>
                    <span className="text-xs text-muted-foreground">Tile · L-3 · POEMS</span>
                  </div>

                  <div className="my-auto flex flex-col items-center text-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                      {(() => {
                        const Icon = FACES[face].icon;
                        return <Icon className="h-9 w-9" />;
                      })()}
                    </span>
                    <h3 className="mt-6 text-2xl font-bold text-foreground">
                      {FACES[face].title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {FACES[face].body}
                    </p>
                  </div>

                  <div className="flex justify-center gap-1.5">
                    {FACES.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === face ? "w-8 bg-primary" : "w-1.5 bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TileFlipShowcase;
