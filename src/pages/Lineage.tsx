import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import GradientDivider from "@/components/GradientDivider";
import ComparisonMatrix from "@/components/lineage/ComparisonMatrix";
import { usePageSeo } from "@/hooks/usePageSeo";

const adjacents = [
  {
    name: "Three Horizons",
    by: "Bill Sharpe / IFF",
    note: "A preferable-futures cousin: same insistence on holding present, transitional, and emergent horizons together.",
  },
  {
    name: "Causal Layered Analysis",
    by: "Sohail Inayatullah",
    note: "Depth-of-framing cousin: litany → systemic causes → worldview → myth/metaphor maps onto Calm Magic's GL!TCH → DRIFT → TUNE descent.",
  },
  {
    name: "Wardley Mapping",
    by: "Simon Wardley",
    note: "Strategic clarity cousin. Wardley maps the evolution of components; Calm Magic maps the evolution of intention and relational capacity.",
  },
  {
    name: "Reinventing Organizations / Teal",
    by: "Frédéric Laloux",
    note: "Relational infrastructure cousin: trust as load-bearing wall, not garnish.",
  },
  {
    name: "Sociocracy / Holacracy",
    by: "Various",
    note: "Governance cousin. Calm Magic doesn't prescribe structure — it prescribes readiness for whatever structure fits.",
  },
  {
    name: "Cybernetics (VSM)",
    by: "Stafford Beer",
    note: "Living-systems cousin. Both treat organizations as nervous systems that must sense, regulate, and adapt.",
  },
];

const Lineage = () => {
  usePageSeo({
    title:
      "Lineage & Comparables — Calm Magic vs. Design Thinking, Theory U, Cynefin, Speculative Design",
    description:
      "Where Calm Magic sits in the lineage of frameworks for futures, design, and complexity — and where it departs. Includes a reflection on Jason Hobbs' Information Architecture Design.",
    path: "/lineage",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the book
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6">
              Lineage &amp; Comparables
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Where Calm Magic sits — and where it doesn't
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Calm Magic is a post–design-thinking, agentic-era framework. It
              shares DNA with several traditions — Design Thinking, Theory U,
              Cynefin, Speculative Design — but it recombines them around a new
              bottleneck: when agents do the doing, humans become responsible
              for the framing, the relational fabric, and the futures worth
              authoring.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/book">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Read the manifesto
                </Button>
              </Link>
              <Link to="/calm-magic-demo">
                <Button size="lg" variant="outline" className="gap-2">
                  See it in practice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <GradientDivider />

        {/* Comparison Matrix */}
        <section className="py-16 md:py-24">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              The matrix
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Six framings, one decision
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Each column is a tradition leaders already know. Each row is a
              dimension that matters when execution is cheap and meaning is the
              bottleneck.
            </p>
          </div>
          <ComparisonMatrix />
        </section>

        <GradientDivider />

        {/* Three short essays */}
        <section className="py-16 md:py-24">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Reading notes
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Three positions, said plainly
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="post-dt">
                <AccordionTrigger className="text-left text-base font-semibold">
                  Post–Design Thinking
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Design Thinking optimized for empathy and prototyping when
                  prototyping was expensive. In the agentic era, the cost of a
                  prototype trends toward zero. The bottleneck moves upstream —
                  to which futures deserve a prototype at all, and which
                  patterns we refuse to repeat. Calm Magic keeps the empathy,
                  drops the prototype-as-finish-line, and adds existential
                  design as a first-class step.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="beyond-u">
                <AccordionTrigger className="text-left text-base font-semibold">
                  Beyond Theory U
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Theory U gave leaders a vocabulary for the inner shift
                  required to perceive emerging futures. It is profound, and
                  often left at the workshop door. Calm Magic translates
                  presencing into playbooks (GL!TCH, Drift, Tune), a maturity
                  model, and an orchestrator (Crewdle.ai) so that the shift
                  travels back into Monday morning operations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="against-vibe">
                <AccordionTrigger className="text-left text-base font-semibold">
                  Against vibe coding
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  "Vibe coding" stacks treat speed as the goal. They produce
                  fast artifacts and shallow adoption because they skip the
                  preparedness audit — the relational and strategic readiness a
                  team actually has. Calm Magic replaces speed-for-speed with
                  <em> informed velocity</em>: speed × direction toward a
                  future that deserves to exist.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <GradientDivider />

        {/* Adjacent traditions */}
        <section className="py-16 md:py-24">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Adjacent traditions
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Cousins worth knowing
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              These don't compete with Calm Magic — they nourish it. Each
              addresses a slice of what an agentic-era practice has to hold.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {adjacents.map((a) => (
              <Card key={a.name} className="bg-card/60 p-5 backdrop-blur-sm">
                <div className="text-sm font-semibold text-foreground">
                  {a.name}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {a.by}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {a.note}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <GradientDivider />

        {/* IAD reflection */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <Badge variant="outline" className="mb-4">
              A note worth its own section
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              On Information Architecture Design (Jason Hobbs)
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              jh-01.com · A design-theoretic framework, currently formalising as
              a structured canon.
            </p>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">What IAD is.</strong>{" "}
                Information Architecture Design treats IA as the structural
                composition of meaning across artefacts, systems, and social
                formations — not navigation, not interface, not sitemaps. It
                asks how meaning <em>holds</em>, persists, and conditions
                action across contexts and over time.
              </p>

              <p>
                <strong className="text-foreground">
                  Its conceptual engine.
                </strong>{" "}
                Three interdependent constructs — Structural Logic (SL),
                Semantic Formation (SF), and Contrived Ontology (CO) — enacted
                through Semantic Mechanics (SM) and Socio-Semantic Mechanics
                (SSM). It is a serious, design-theoretic articulation of how
                meaning is composed and stabilised in the world.
              </p>

              <Card className="border-l-4 border-l-primary bg-card/60 p-6 backdrop-blur-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Why it resonates with Calm Magic
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
                  <li>
                    Both reject the surface reading of their domain. IAD
                    refuses "IA = navigation." Calm Magic refuses "AI = vibe
                    coding."
                  </li>
                  <li>
                    Both treat meaning as something that must be{" "}
                    <em>composed, stabilised, and made operative</em>. Calm
                    Magic's working principle —{" "}
                    <em>"the conversation IS the ontology"</em> — maps cleanly
                    onto IAD's Contrived Ontology.
                  </li>
                  <li>
                    Both operate inside what Hobbs calls a{" "}
                    <em>second intellectual culture</em>: moving past inherited
                    descriptive models toward compositional, design-theoretic
                    practice.
                  </li>
                </ul>
              </Card>

              <Card className="border-l-4 border-l-amber-500 bg-card/60 p-6 backdrop-blur-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Where they differ
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
                  <li>
                    IAD is a <em>theoretical canon</em> under formalisation —
                    modules, glossary, auxiliary notes, canonical artefacts.
                    Calm Magic is a <em>practiced framework + product system</em>{" "}
                    — playbooks, board, orchestrator.
                  </li>
                  <li>
                    IAD's altitude is meta-structural: how meaning holds at
                    all. Calm Magic's altitude is operational: how teams in
                    the agentic era author preferable futures.
                  </li>
                  <li>
                    Calm Magic can be read as an <em>applied instance</em> of
                    IAD's logic in a specific historical moment — a contrived
                    ontology for organisations facing collapsed execution
                    costs.
                  </li>
                </ul>
              </Card>

              <Card className="border-l-4 border-l-emerald-500 bg-card/60 p-6 backdrop-blur-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Our stance — celebrating methodological clarity
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  Calm Magic openly celebrates work like IAD. The industry is
                  saturated with vibes, loose mental models, and frameworks
                  that confuse a slide deck with a discipline. Rigorous,
                  design-theoretic articulation — named constructs, modules,
                  glossaries, canonical artefacts — is exactly the kind of
                  foundation an agentic era needs. Without it, every team
                  re-invents shaky vocabulary every quarter.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  We treat methodological clarity as a public good. Where IAD
                  formalises the grammar of meaning, Calm Magic operationalises
                  a grammar of intention, relational capacity, and preferable
                  futures. Different jobs, same commitment: name the
                  constructs, stabilise the vocabulary, make the practice
                  inspectable.
                </p>
              </Card>

              <p className="text-foreground">
                If Calm Magic is the practice, IAD is part of the deeper
                grammar that makes practices like it legible. They are doing
                different jobs at different altitudes — and that is exactly why
                they're worth reading together. We are better off as an
                industry when serious frameworks exist, are named, and can be
                argued with.
              </p>

              <div>
                <a
                  href="https://jh-01.com/information-architecture-design/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Read the IAD framework on jh-01.com
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <GradientDivider />

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card/60 p-10 text-center backdrop-blur-sm">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Want the practice, not just the lineage?
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              The book unpacks the framework. The board, the playbooks, and the
              orchestrator put it to work.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/book">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Read the manifesto
                </Button>
              </Link>
              <a href="mailto:jbelisle@helloarchitekt.com">
                <Button size="lg" variant="outline">
                  Talk to us
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Lineage;
