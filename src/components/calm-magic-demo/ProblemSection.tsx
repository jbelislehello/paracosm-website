import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Map } from "lucide-react";

const problems = [
  {
    icon: RefreshCw,
    title: "Loops, not spirals",
    body: "Transformation programs cycle through the same workshops, the same frameworks, the same fatigue — without ever leaving the room they started in.",
  },
  {
    icon: AlertTriangle,
    title: "Forced roadmaps",
    body: "Top-down plans collide with the lived reality of teams. What looked clean on a slide turns into anxiety, attrition and shadow work.",
  },
  {
    icon: Map,
    title: "Missing relational map",
    body: "There's no shared place where culture, ideas, design, infrastructure and story can be held together as one living system.",
  },
];

const ProblemSection = () => (
  <section className="relative bg-muted/30 py-20 md:py-28">
    <div className="container mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          The problem
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Most organizations don't lack ideas.
          <br />
          They lack a <em className="not-italic text-primary">relational</em> place to hold them.
        </h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-7 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-foreground">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
