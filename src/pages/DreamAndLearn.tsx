// useEffect no longer needed — SEO handled by usePageSeo hook
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Hammer,
  FlaskConical,
  Network,
  Sparkles,
  ExternalLink,
  Compass,
  Users,
  Lightbulb,
  ShieldCheck,
  Workflow,
  Layers,
  CircleCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";

/**
 * DreamAndLearn
 *
 * Standalone landing page for the Crewdle "Dream & Learn" module.
 * Explains how visitors can BUILD, EXPERIMENT, and ORCHESTRATE an
 * agentic ecosystem, and routes them to the live demo on the home
 * page (/#agentic-demo), to Crewdle, the April Drift article, and
 * to the booking flow.
 *
 * All colors come from design tokens (no hex). Dream = accent,
 * Learn = primary, Orchestrator/chrome = foreground/muted.
 */

const verbs = [
  {
    verb: "Build",
    icon: Hammer,
    tagline: "Compose your roster of Dream & Learn agents.",
    bullets: [
      "Pick the divergent (Dream) and convergent (Learn) agents your work needs.",
      "Define their roles, voice, and access in plain language — no code.",
      "Bind them to your shared context (briefs, PRDs, Calm Magic board).",
    ],
  },
  {
    verb: "Experiment",
    icon: FlaskConical,
    tagline: "Run the loop and watch the ecosystem think.",
    bullets: [
      "Trigger scenarios: speculate, audit a policy, onboard a client, run a Glitch session.",
      "Bias the loop toward Dream or Learn — see the routing change in real time.",
      "Disable an agent and watch the Orchestrator reroute around the gap.",
    ],
  },
  {
    verb: "Orchestrate",
    icon: Network,
    tagline: "Ship coordinated outcomes — invent and integrate in the same loop.",
    bullets: [
      "Promote winning patterns into reusable playbooks.",
      "Hand off artifacts to your team with provenance preserved end-to-end.",
      "Close the loop into the Calm Magic PRD so learning compounds.",
    ],
  },
];

const steps = [
  { n: 1, title: "Frame the brief", axis: "LOVE", body: "Open the shared context. State the intent in one sentence — what changes if this loop succeeds?" },
  { n: 2, title: "Compose Dream agents", axis: "MAGIC", body: "Vision, Storyteller, Speculator, Mythographer, Composer — the divergent half. Pick the ones the work needs." },
  { n: 3, title: "Compose Learn agents", axis: "CALM", body: "Researcher, Pattern, Critic, Curator, Tutor — the convergent half. They keep the Dream honest." },
  { n: 4, title: "Orchestrate the loop", axis: "OPEN", body: "The Orchestrator routes attention between the two halves. Bias toward Dream to invent, toward Learn to integrate." },
  { n: 5, title: "Ship & measure", axis: "FREE", body: "Promote artifacts, archive evidence, fold the learning back into the PRD. The ecosystem gets sharper every loop." },
];

const dreamAgents = [
  { name: "Vision", role: "imagines preferable futures" },
  { name: "Storyteller", role: "frames the narrative" },
  { name: "Speculator", role: "explores what-ifs" },
  { name: "Mythographer", role: "weaves symbols" },
  { name: "Composer", role: "arranges the form" },
];

const learnAgents = [
  { name: "Researcher", role: "gathers evidence" },
  { name: "Pattern", role: "detects structure" },
  { name: "Critic", role: "stress-tests claims" },
  { name: "Curator", role: "selects what stays" },
  { name: "Tutor", role: "teaches the team" },
];

const useCases = [
  { title: "Onboard a new client", body: "Balanced loop. Frame ambition with Dream while Learn audits the landscape and prepares evidence." },
  { title: "Generate a speculative scenario", body: "Dream-leaning. Vision and Storyteller dominate; Critic keeps the futures honest." },
  { title: "Audit an AI policy", body: "Learn-leaning. Researcher and Critic carry the load; Vision contributes futures framing." },
  { title: "Run a Glitch session", body: "Rapid 25-minute cycles between Dream sparks and Learn integration." },
];

const faq = [
  {
    q: "Do I need to know how to code?",
    a: "No. Dream & Learn is composed in plain language. You describe agents and intents; the orchestration layer handles wiring, routing, and provenance.",
  },
  {
    q: "Where does my data live?",
    a: "On Crewdle's distributed edge-AI fabric. Agents execute close to your data, with consent and provenance preserved end-to-end. No central data lake required.",
  },
  {
    q: "How does this connect to the Calm Magic board and PRD?",
    a: "Each loop folds back into the Calm Magic PRD — outcomes, artifacts, and learnings become part of your living ontology, not a side document.",
  },
  {
    q: "How do we start?",
    a: "Book a discovery call. We map your first scenario, compose the Dream & Learn roster, and run a live loop together within the first session.",
  },
];

const DreamAndLearn = () => {
  usePageSeo({
    title: "Dream & Learn — AI orchestration & inventivity · Paracosm × Crewdle",
    description:
      "Build, experiment, and orchestrate an agentic ecosystem with the Crewdle Dream & Learn module. Compose divergent and convergent agents, run live loops, and ship with consent and provenance.",
    path: "/dream-and-learn",
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/20 to-background">
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        </div>

        <div className="container max-w-5xl mx-auto relative">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge className="gap-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0">
              <Sparkles className="h-3 w-3" />
              Powered by Crewdle
            </Badge>
            <Badge variant="outline" className="border-primary/40 text-primary">
              AI orchestration &amp; inventivity
            </Badge>
            <Badge variant="outline" className="border-accent/40 text-accent">
              Paracosm module
            </Badge>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-center"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Dream &amp; Learn
            </span>
            <span className="block text-foreground/90 mt-2 text-2xl md:text-4xl font-semibold">
              Build, experiment, orchestrate your agentic ecosystem.
            </span>
          </motion.h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
            Dream &amp; Learn is the AI orchestration &amp; inventivity module Jonathan
            Bélisle is building inside{" "}
            <a
              href="https://crewdle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline inline-flex items-center gap-1"
            >
              Crewdle's edge-AI platform <ExternalLink className="h-3.5 w-3.5" />
            </a>
            . <em>Dream</em> agents diverge — speculate, story, compose. <em>Learn</em>{" "}
            agents converge — research, critique, curate. The Orchestrator routes
            attention between them so organizations{" "}
            <strong className="text-foreground">invent and integrate in the same loop</strong>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/#agentic-demo">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                Try the live demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://app.reclaim.ai/m/jonathan-helloarchitekt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2">
                Book a discovery call
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* THREE VERBS */}
      <section className="px-4 py-16 md:py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Three verbs, one loop</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Dream &amp; Learn turns "using AI" into a practice you can rehearse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verbs.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.verb}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Card className="h-full border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-2xl">{v.verb}</CardTitle>
                      </div>
                      <CardDescription className="pt-2 text-foreground/80">
                        {v.tagline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {v.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <CircleCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Separator className="opacity-40" />

      {/* HOW IT WORKS */}
      <section className="px-4 py-16 md:py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              <Workflow className="h-3 w-3 mr-1" />
              How it works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">A five-step loop you can rehearse</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Each step maps to one of the five Calm Magic axes — so the loop
              integrates with your existing ontology rather than replacing it.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {s.n}
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    {s.axis}
                  </Badge>
                </div>
                <h3 className="font-semibold text-base mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* DREAM VS LEARN */}
      <section className="px-4 py-16 md:py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Two halves, one orchestrator</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Dream agents diverge. Learn agents converge. The Orchestrator routes
              attention between them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dream */}
            <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  <CardTitle className="text-2xl text-accent">Dream agents</CardTitle>
                </div>
                <CardDescription>Divergent · inventive · generative</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dreamAgents.map((a) => (
                    <li key={a.name} className="flex items-baseline gap-3">
                      <span className="font-semibold text-foreground min-w-[110px]">{a.name}</span>
                      <span className="text-sm text-muted-foreground">{a.role}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Learn */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl text-primary">Learn agents</CardTitle>
                </div>
                <CardDescription>Convergent · integrative · evidentiary</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {learnAgents.map((a) => (
                    <li key={a.name} className="flex items-baseline gap-3">
                      <span className="font-semibold text-foreground min-w-[110px]">{a.name}</span>
                      <span className="text-sm text-muted-foreground">{a.role}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground italic">
              The Orchestrator decides who speaks next, based on the scenario, the
              context, and the bias you set.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CREWDLE */}
      <section className="px-4 py-16 md:py-20 bg-gradient-to-br from-emerald-600/5 via-cyan-600/5 to-primary/5">
        <div className="container max-w-5xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-lg">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="gap-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0">
                <Sparkles className="h-3 w-3" />
                Why Crewdle
              </Badge>
              <Badge variant="outline">Edge-AI fabric</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">A platform built for orchestration</h2>
            <p className="mt-3 text-muted-foreground">
              Dream &amp; Learn runs on Crewdle's distributed edge-AI fabric — agents
              execute close to your data, with consent and provenance preserved
              end-to-end. No central data lake. No vendor lock-in.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Consent & provenance",
                  body: "Every message carries who sent it, on whose behalf, with what permission.",
                },
                {
                  icon: Network,
                  title: "Edge execution",
                  body: "Agents run close to the data — lower latency, smaller blast radius, real privacy.",
                },
                {
                  icon: Users,
                  title: "Distributed by design",
                  body: "No single point of orchestration failure. Compose, swap, retire agents independently.",
                },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <Icon className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-semibold text-sm">{b.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="https://crewdle.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0">
                  Visit crewdle.com
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <p className="text-xs text-muted-foreground self-center">
                Jonathan Bélisle is Fractional Chief Design Officer at Crewdle,
                leading the Dream &amp; Learn module.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="px-4 py-16 md:py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">What you can do with it</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Each scenario is playable in the live demo on the home page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((u) => (
              <Card key={u.title} className="border-border/60 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{u.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{u.body}</p>
                  <Link
                    to="/#agentic-demo"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline underline-offset-4"
                  >
                    See it in the demo <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 md:py-20 bg-muted/30">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">Common questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-20">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to compose your first loop?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Book a discovery call. We map your first scenario, compose the Dream
            &amp; Learn roster, and run a live loop together — in the first session.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://app.reclaim.ai/m/jonathan-helloarchitekt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                Book a discovery call
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link to="/drift/2026/04">
              <Button size="lg" variant="outline" className="gap-2">
                <Compass className="h-4 w-4" />
                Read April Drift — Relationship Model
              </Button>
            </Link>
            <a href="https://crewdle.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="ghost" className="gap-2">
                Visit Crewdle
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DreamAndLearn;
