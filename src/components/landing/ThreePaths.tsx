import { ArrowRight, Briefcase, Wrench, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const paths = [
  {
    key: "lead",
    icon: Briefcase,
    label: "Lead",
    audience: "Executives & boards",
    title: "Govern AI without losing your soul",
    body: "AI Leadership: agentic ecosystems, governance, and intentional architecture. For CAIOs, founders, and transformation leads.",
    href: "/agentic-ux",
    accent: "from-blue-600 to-indigo-700",
  },
  {
    key: "make",
    icon: Wrench,
    label: "Make",
    audience: "Designers & inventors",
    title: "Invent with the Calm Magic board",
    body: "The board, the PRD system, the foundational prompt compiler. For product teams who want to ship meaningful software fast.",
    href: "/calm-magic-demo",
    accent: "from-fuchsia-600 to-purple-700",
  },
  {
    key: "heal",
    icon: Heart,
    label: "Heal",
    audience: "Teams & cultures",
    title: "Coach the human stakes",
    body: "Relational coaching, somatic regulation, GL!TCH facilitation. For teams expanding their window of tolerance through change.",
    href: "/calm-magic-assistant",
    accent: "from-rose-600 to-pink-700",
  },
];

export default function ThreePaths() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Three paths into the framework
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Lead · Make · Heal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto pt-2">
            Same framework, three doors. Pick the one that matches the question
            you're sitting with.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {paths.map((p) => (
            <Link
              key={p.key}
              to={p.href}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${p.accent} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center mb-4`}
                >
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {p.label} · {p.audience}
                </p>
                <h3 className="font-bold text-lg mt-1 mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {p.body}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Enter this path
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
