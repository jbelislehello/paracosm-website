import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Layers, Eye, Compass, Music2, Frame } from "lucide-react";

const ROW_LETTERS = ["M", "A", "G", "L", "E", "S", "M", "A"];
const COL_LETTERS = ["C", "H", "O", "R", "D", "S", "P", "S"];

type Region = {
  rows: [number, number];
  cols: [number, number];
};

type Module = {
  id: string;
  step: string;
  title: string;
  short: string;
  body: string;
  takeaway: string;
  icon: typeof Layers;
  region: Region;
  rowHighlights?: number[];
  colHighlights?: number[];
  // Extended fields powering the synced explanation panel
  principle: string;
  mechanic: string[];
  inPractice: string;
  connects: string[];
};

const MODULES: Module[] = [
  {
    id: "agendas",
    step: "01",
    title: "AGENDAS — the inner foundation",
    short: "Mindsets · Agilities · Goals",
    body:
      "The first three rows hold what every transformation actually starts with: the inner stance of the people doing the work. Mindsets shape what's thinkable, Agilities shape how movement happens, Goals synthesize both into intent.",
    takeaway:
      "If a roadmap doesn't sit on top of grounded mindsets, it will be silently rejected by the body of the team.",
    icon: Layers,
    region: { rows: [0, 2], cols: [0, 7] },
    rowHighlights: [0, 1, 2],
    principle:
      "Transformation begins in the body, not the slide deck. Calm Magic refuses to start with execution.",
    mechanic: [
      "Row 1 · Mindsets — what is currently thinkable for this team",
      "Row 2 · Agilities — how movement actually happens here",
      "Row 3 · Goals — the synthesis of mindset + agility into intent",
    ],
    inPractice:
      "A leader maps three felt mindsets, three lived agilities — then watches Goals emerge instead of being declared.",
    connects: ["Held by MAPS", "Feeds the POLLENS season"],
  },
  {
    id: "lens",
    step: "02",
    title: "LENS — consciousness expansion",
    short: "Landscape · Energy · Synergies",
    body:
      "Rows 4–6 are where MAGIC fully deploys. Intuitions live inside Landscape, Compasses live inside Energy, and Synergies marks the moment the system moves above its fully-deployed state into integrated action.",
    takeaway:
      "This is where the board stops describing the org and starts revealing what the org could become.",
    icon: Eye,
    region: { rows: [3, 5], cols: [0, 7] },
    rowHighlights: [3, 4, 5],
    principle:
      "Once the inner ground is held, perception widens. LENS rows let the system see itself.",
    mechanic: [
      "Row 4 · Landscape — terrain & Intuitions (the I of MAGIC)",
      "Row 5 · Energy — flow & Compasses (the C of MAGIC)",
      "Row 6 · Synergies — moving above fully-deployed MAGIC into integration",
    ],
    inPractice:
      "Tiles in this band light up when teams report 'I can suddenly see what we're actually doing.' That signal feeds the agentic compass.",
    connects: ["Builds on AGENDAS", "Unlocks NOEMS & POEMS"],
  },
  {
    id: "chords",
    step: "03",
    title: "CHORDS — relational dimensions",
    short: "Chances · Heart · Observer · Reversal · Design · Seeds",
    body:
      "Six columns turn every row into a relational chord. A tile isn't just 'a goal' — it's a goal seen through Heart, or a mindset seen through Reversal. The intersections are where the methodology breathes.",
    takeaway:
      "Six dimensions × eight rows = forty-eight ways to look at any single moment.",
    icon: Music2,
    region: { rows: [0, 7], cols: [0, 5] },
    colHighlights: [0, 1, 2, 3, 4, 5],
    principle:
      "A tile is never single-voiced. CHORDS make every cell harmonic — readable through six relational lenses at once.",
    mechanic: [
      "C · Chances — what risk is being taken",
      "H · Heart — what is loved or grieved",
      "O · Observer — what is being noticed",
      "R · Reversal — what could flip or renew",
      "D · Design — what is being shaped",
      "S · Seeds — what is being planted forward",
    ],
    inPractice:
      "Stuck on a goal? Re-read it through Heart, then through Reversal. The block usually lives in the column you've been avoiding.",
    connects: ["Cross-cuts every row", "Drives the Constellation view"],
  },
  {
    id: "maps",
    step: "04",
    title: "MAPS — the boundary frame",
    short: "Methodology · Architecture · Protocols · Systems",
    body:
      "MAPS isn't a layer on top of the work. It surrounds it. Methodology and Architecture form the bottom rows. Protocols and Systems form the right columns. The corners are where all four converge into governance.",
    takeaway:
      "The execution frame holds the relational interior — never the other way around.",
    icon: Frame,
    region: { rows: [6, 7], cols: [6, 7] },
    rowHighlights: [6, 7],
    colHighlights: [6, 7],
    principle:
      "Execution is a container, not a verdict. MAPS frames the interior so it can stay relational under pressure.",
    mechanic: [
      "Row 7 · Methodology — how the work becomes repeatable",
      "Row 8 · Architecture — how the work becomes structurable",
      "Col 7 · Protocols — agreements that govern interaction",
      "Col 8 · Systems — the technical & operational substrate",
    ],
    inPractice:
      "The four corner tiles are governance hot-spots — where Methodology × Systems collide. They're where the AI Observatory plugs in.",
    connects: ["Wraps AGENDAS, LENS & CHORDS", "Outputs to TOTEMS & ANTHEMS"],
  },
  {
    id: "intersection",
    step: "05",
    title: "The tile — where it all meets",
    short: "Every tile is an ontological coordinate",
    body:
      "A single tile is the intersection of an inner agenda (its row), a relational dimension (its column), a felt state, an archetypal pattern, and a piece of captured knowledge. Click any tile on the live board and the full ontology opens beneath it.",
    takeaway:
      "The board doesn't store information — it stores relationships between information.",
    icon: Compass,
    region: { rows: [4, 4], cols: [4, 4] },
    rowHighlights: [4],
    colHighlights: [4],
    principle:
      "Every tile is the smallest unit of relational intelligence — a coordinate where four ontologies meet.",
    mechanic: [
      "Row coordinate — which inner agenda",
      "Column coordinate — which relational dimension",
      "Felt state — polyvagal check-in",
      "Archetypal pattern — I Ching hexagram lens",
      "Knowledge fragment — the captured insight",
    ],
    inPractice:
      "Open one tile and you get a four-faced card: felt state, hexagram, fragment, and an agentic prompt — the whole methodology in 64 pixels.",
    connects: ["Composes the entire 8×8 board", "Feeds the PRD compiler 1:1"],
  },
];

const inRegion = (r: number, c: number, region: Region) =>
  r >= region.rows[0] && r <= region.rows[1] && c >= region.cols[0] && c <= region.cols[1];

const BoardAnatomy = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const userClickRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  // Sync active module with scroll position via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (userClickRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) setActiveIdx(idx);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    moduleRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleStepClick = (idx: number) => {
    setActiveIdx(idx);
    userClickRef.current = true;
    moduleRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);
    // Re-enable scroll-driven sync after the smooth scroll settles
    clickTimeoutRef.current = window.setTimeout(() => {
      userClickRef.current = false;
    }, 900);
  };

  const active = MODULES[activeIdx];
  const ActiveIcon = active.icon;

  return (
    <section id="anatomy" className="relative py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            01 · The Board
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            64 tiles. 3 vertical stages. 2 horizontal alphabets.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Click a module — or scroll — to walk through the anatomy of the
            Calm Magic board. The matrix on the right responds in real time.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
          {/* ── Left: scrollytelling rail ───────────────────────────── */}
          <div className="space-y-4 lg:space-y-6">
            {/* Step pills (sticky on mobile) */}
            <div className="sticky top-16 z-20 -mx-6 flex gap-2 overflow-x-auto bg-background/90 px-6 py-3 backdrop-blur-md lg:static lg:mx-0 lg:flex-wrap lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
              {MODULES.map((m, i) => {
                const isActive = i === activeIdx;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleStepClick(i)}
                    aria-current={isActive ? "step" : undefined}
                    className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span className="opacity-70">{m.step}</span>
                    <span className="mx-1.5 opacity-30">·</span>
                    {m.id.toUpperCase()}
                  </button>
                );
              })}
            </div>

            {/* Module cards */}
            <div className="space-y-6">
              {MODULES.map((m, i) => {
                const isActive = i === activeIdx;
                const Icon = m.icon;
                return (
                  <motion.div
                    key={m.id}
                    ref={(el) => (moduleRefs.current[i] = el)}
                    data-idx={i}
                    onClick={() => handleStepClick(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleStepClick(i);
                      }
                    }}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0.55,
                      scale: isActive ? 1 : 0.985,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`cursor-pointer rounded-3xl border bg-card p-7 shadow-sm transition-colors ${
                      isActive
                        ? "border-primary/60 shadow-xl ring-1 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Module {m.step}
                        </p>
                        <h3 className="text-xl font-bold text-foreground">{m.title}</h3>
                      </div>
                    </div>

                    <p className="mt-4 text-sm font-medium text-foreground/90">{m.short}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {isActive ? "Showing in the panel →" : "Tap to open in the panel →"}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Right: sticky responsive matrix ─────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8">
              {/* Active module banner */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <ActiveIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Now showing · {active.step}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{active.short}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {activeIdx + 1} / {MODULES.length}
                </span>
              </div>

              {/* ── Synced explanation panel ─────────────────────────── */}
              <div className="mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <h3 className="text-lg font-bold leading-tight text-foreground">
                      {active.title}
                    </h3>

                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Principle
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                        {active.principle}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        How it works
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {active.mechanic.map((m) => (
                          <li
                            key={m}
                            className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary/70" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        In practice
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                        {active.inPractice}
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Takeaway
                      </p>
                      <p className="mt-1 text-sm text-foreground">{active.takeaway}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {active.connects.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Column headers */}
              <div className="ml-9 mb-1.5 grid grid-cols-8 gap-1.5">
                {COL_LETTERS.map((letter, i) => {
                  const hi = active.colHighlights?.includes(i) ?? false;
                  return (
                    <div
                      key={i}
                      className={`text-center text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        hi ? "text-primary" : "text-muted-foreground/60"
                      }`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-1.5">
                {/* Row headers */}
                <div className="flex w-7 flex-col gap-1.5">
                  {ROW_LETTERS.map((letter, i) => {
                    const hi = active.rowHighlights?.includes(i) ?? false;
                    return (
                      <div
                        key={i}
                        className={`flex aspect-square items-center justify-center text-[10px] font-bold uppercase transition-colors ${
                          hi ? "text-primary" : "text-muted-foreground/60"
                        }`}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>

                {/* Matrix */}
                <div className="grid flex-1 grid-cols-8 gap-1.5">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const r = Math.floor(i / 8);
                    const c = i % 8;
                    const isActiveCell = inRegion(r, c, active.region);
                    return (
                      <motion.div
                        key={i}
                        initial={false}
                        animate={{
                          opacity: isActiveCell ? 1 : 0.18,
                          scale: isActiveCell ? 1 : 0.94,
                        }}
                        transition={{
                          duration: 0.45,
                          delay: isActiveCell ? (r + c) * 0.012 : 0,
                          ease: "easeOut",
                        }}
                        className="aspect-square rounded-md"
                        style={{
                          background: isActiveCell
                            ? `linear-gradient(135deg, hsl(var(--primary) / 0.7), hsl(var(--accent) / 0.6))`
                            : `hsl(var(--muted-foreground) / 0.18)`,
                          boxShadow: isActiveCell
                            ? "0 4px 14px hsl(var(--primary) / 0.25)"
                            : "none",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <p className="mt-5 text-center text-[11px] text-muted-foreground">
                Highlighted region updates as you click or scroll between modules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardAnatomy;
