import { ArrowRight, Compass, Grid3x3, FileText, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    n: "01",
    label: "Ask",
    icon: Compass,
    title: "Drop your real question",
    body: "Skip the roadmap. Bring the question your team is actually sitting with — strategic, technical, or human.",
    href: "/resonance",
    cta: "Try Resonance",
  },
  {
    n: "02",
    label: "Map",
    icon: Grid3x3,
    title: "Land it on the Calm Magic board",
    body: "The board reveals where your question lives across the five axes — Magic, Love, Calm, Open, Free.",
    href: "/calm-magic-demo",
    cta: "Open the board",
  },
  {
    n: "03",
    label: "Invent",
    icon: FileText,
    title: "Compile a PRD with the ontology",
    body: "Turn the mapped question into a Product Requirements Document grounded in shared meaning, not assumptions.",
    href: "/calm-magic-board/prds",
    cta: "See the PRD system",
  },
  {
    n: "04",
    label: "Ship",
    icon: Rocket,
    title: "Generate a foundational prompt",
    body: "Compile the PRD into agentic prompts and tech-stack JSON — ready to hand to your AI builders.",
    href: "/design-system",
    cta: "See why it works",
  },
];

export default function MethodSteps() {
  return (
    <section id="method-steps" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            The Agentic Era UX Design Method
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Ask · Map · Invent · Ship
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto pt-2">
            Four moves that turn a question into shipped software — without
            losing the meaning along the way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className="relative rounded-2xl border border-border bg-card p-5 flex flex-col hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {s.n}
                </span>
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                {s.label}
              </p>
              <h3 className="font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                {s.body}
              </p>
              <Link
                to={s.href}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
              >
                {s.cta}
                <ArrowRight className="w-3 h-3" />
              </Link>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
