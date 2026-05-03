import { GraduationCap, Lightbulb, Network } from "lucide-react";

const gaps = [
  {
    icon: GraduationCap,
    title: "The Learning Gap",
    body: "AI moves faster than your organization can absorb it. Training decks go stale before the next model release.",
    accent: "from-blue-500 to-indigo-600",
  },
  {
    icon: Lightbulb,
    title: "The Invention Gap",
    body: "Roadmaps kill emergence. Teams ship the obvious instead of discovering what only AI + humans together could invent.",
    accent: "from-fuchsia-500 to-purple-600",
  },
  {
    icon: Network,
    title: "The Coherence Gap",
    body: "Tools without an ontology automate chaos. Without shared meaning, every team builds a different reality.",
    accent: "from-amber-500 to-orange-600",
  },
];

export default function EnterpriseGaps() {
  return (
    <section className="py-16 px-4 bg-muted/20">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Why enterprises need a framework
          </p>
          <h2 className="text-2xl md:text-3xl font-bold">
            Three gaps stop most organizations from learning &amp; inventing with AI.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {gaps.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.accent} flex items-center justify-center mb-4`}
              >
                <g.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-base mb-2">{g.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {g.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
