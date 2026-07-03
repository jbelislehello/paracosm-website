import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialChapterHeader,
  editorialTone,
  editorialType,
} from "@/components/editorial";
import { cn } from "@/lib/utils";
import { agenticResidencies } from "@/data/agenticResidencies";

const principles = [
  {
    n: "01",
    title: "Agents as relations, not features",
    body:
      "Agentic UX is not a chatbot bolted onto a product — it is the interface a network of AI actors uses to relate to a human and to each other. We design the relationship first, then the surface.",
  },
  {
    n: "02",
    title: "Consent as the primary interaction",
    body:
      "The TOTEM consent framework treats every escalation, delegation and data pull as an explicit act. Users stay sovereign; agents earn trust through legible, revocable authority.",
  },
  {
    n: "03",
    title: "Compensating for cognitive bias",
    body:
      "The ecosystem surfaces the biases each agent is designed to counter. Users see why a suggestion was made — not just what it recommends.",
  },
  {
    n: "04",
    title: "Living orchestration",
    body:
      "Agents coordinate through a shared ontology. Handoffs are narrated. The system thinks out loud so teams can audit, adjust and take over.",
  },
];

const Index = () => {
  usePageSeo({
    title: "Agentic UX — A Paracosm resource on multi-agent interface design",
    description:
      "Agentic UX is Paracosm's resource on designing multi-agent interfaces — consent-first orchestration, bias-aware handoffs, and residencies that ship working evidence.",
    path: "/agentic-ux",
  });

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      <EditorialPageHero
        tone="warm"
        numeral="00"
        kicker="Resource · Agentic UX"
        title={
          <>
            Designing the surface where <em className="italic font-light">agents relate</em>.
          </>
        }
        subtitle="Agentic UX is Paracosm's working resource for teams building with multiple AI agents. Consent-first, bias-aware, and rehearsed with your people before it ships."
      />

      <EditorialSection tone="paper" id="principles">
        <EditorialChapterHeader
          numeral="01"
          kicker="Four working principles"
          subtitle="How we approach agentic surfaces before writing a line of code."
          tone="paper"
        />
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-10">
          {principles.map((p) => (
            <article key={p.n} className="border-t-2 border-current/70 pt-5">
              <div className="flex items-baseline justify-between mb-3">
                <span className={cn(editorialType.serif, "text-3xl", editorialTone.paper.numeral)}>{p.n}</span>
                <span className={editorialType.caption}>Principle</span>
              </div>
              <h3 className={cn(editorialType.serif, "text-2xl leading-tight mb-3")}>{p.title}</h3>
              <p className="opacity-80 leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection tone="warm">
        <EditorialChapterHeader
          numeral="02"
          kicker="See it in motion"
          subtitle="A live walk-through of the ecosystem thinking out loud."
          tone="warm"
        />
        <div className="mt-10 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8 space-y-5">
            <p className={cn(editorialType.serif, "text-3xl md:text-4xl leading-tight")}>
              Pick a scenario. Step through the reasoning. Read the biases the ecosystem is compensating for.
            </p>
            <p className="opacity-80 max-w-2xl">
              The Agentic Demo is a rehearsal room, not a marketing reel. It shows the seams — where agents disagree,
              defer, and hand off.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              to="/agentic-demo"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold hover:opacity-90"
            >
              Open the demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection tone="night" id="residencies">
        <EditorialChapterHeader
          numeral="03"
          kicker="Prototype Residencies · Forecast"
          subtitle="Three ways to work with Paracosm on your agentic surface."
          tone="night"
        />
        <div className="mt-12 divide-y divide-current/20 border-t-2 border-current/60">
          {residencies.map((r) => (
            <article key={r.n} className="grid grid-cols-[auto_1fr_auto] gap-6 md:gap-10 py-8 items-baseline">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl w-14 md:w-16", editorialTone.night.numeral)}>
                {r.n}
              </span>
              <div>
                <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-2")}>
                  {r.title}
                </h3>
                <p className="italic font-light opacity-80 max-w-2xl leading-relaxed">{r.body}</p>
              </div>
              <span className={cn(editorialType.caption, "hidden md:block")}>{r.duration}</span>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <p className={cn(editorialType.serif, "text-2xl md:text-3xl max-w-xl leading-tight")}>
            Ready to rehearse the future before you build it?
          </p>
          <Link
            to="/contact"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold self-start md:self-auto",
              editorialTone.night.ctaPrimary,
            )}
          >
            Begin a conversation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
};

export default Index;
