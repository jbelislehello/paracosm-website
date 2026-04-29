import { motion } from "framer-motion";
import { User, Users, Building2 } from "lucide-react";

const COLS = [
  {
    icon: User,
    audience: "For the leader",
    headline: "Move from forcing to facilitating.",
    points: [
      "See your own nervous system in the work",
      "Stop drafting roadmaps that no one inhabits",
      "Get an agentic compass, not another framework",
    ],
  },
  {
    icon: Users,
    audience: "For the team",
    headline: "A shared map nobody is hiding from.",
    points: [
      "Emotional check-ins on every tile",
      "Knowledge fragments captured in flow",
      "Patterns surface before they become crises",
    ],
  },
  {
    icon: Building2,
    audience: "For the org",
    headline: "Culture, knowledge and product as one system.",
    points: [
      "PRDs grounded in lived reality",
      "Branchable, mergeable transformation history",
      "OECD AI–aligned governance from day one",
    ],
  },
];

const BenefitsTriad = () => (
  <section className="relative py-20 md:py-32">
    <div className="container mx-auto max-w-7xl px-6">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">07 · Benefits</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          What it gives back.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {COLS.map((c, i) => (
          <motion.div
            key={c.audience}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-3xl border border-border bg-card p-8 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {c.audience}
            </p>
            <h3 className="mt-2 text-xl font-bold text-foreground">{c.headline}</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              {c.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsTriad;
