import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import BoardEntryGate from "@/components/calm-magic/BoardEntryGate";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialChapterHeader,
  editorialTone,
  editorialType,
} from "@/components/editorial";
import { cn } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";

const services = [
  {
    numeral: "01",
    name: "Clarity Reset",
    duration: "7 days",
    price: "$800",
    tagline: "From confusion to a clear, executable decision.",
    features: [
      "45-min diagnostic call",
      "Situation deconstruction",
      "1–3 clear decisions delivered",
      "Async support + 1 follow-up",
    ],
    subject: "Spring 2026 — Clarity Reset",
  },
  {
    numeral: "02",
    name: "Decision Sprint",
    duration: "14 days",
    price: "$1,500",
    tagline: "AI-augmented pattern analysis with full accountability.",
    features: [
      "Everything in Clarity Reset",
      "Pattern analysis & scenario generation",
      "2 additional coaching calls",
      "Execution accountability loop",
    ],
    subject: "Spring 2026 — Decision Sprint",
  },
  {
    numeral: "03",
    name: "Founder Companion",
    duration: "3 months",
    price: "$4,500",
    tagline: "Ongoing thinking partner for pivotal seasons.",
    features: [
      "Weekly working sessions",
      "Async support between calls",
      "Full Calm Magic Board access",
      "Quarterly strategic review",
    ],
    subject: "Spring 2026 — Founder Companion",
  },
];

const RelationalHealing = () => {
  const [showBoardGate, setShowBoardGate] = useState(false);

  usePageSeo({
    title: "Calm Magic Assistant — A relational coaching companion | Paracosm",
    description:
      "The Calm Magic Assistant is a relational coaching companion for leaders navigating pivotal decisions — grounded in the 5-axis compass of Love, Magic, Calm, Open, Free.",
    path: "/calm-magic-assistant",
  });

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      <EditorialPageHero
        tone="warm"
        numeral="00"
        kicker="Resource · Coaching companion"
        title={
          <>
            A relational coaching <em className="italic font-light">companion</em>.
          </>
        }
        subtitle="The Calm Magic Assistant helps leaders move through pivotal decisions with a 5-axis compass — Love, Magic, Calm, Open, Free — and a working method that turns confusion into a clear next step."
      />

      <EditorialSection tone="paper" id="services">
        <EditorialChapterHeader
          numeral="01"
          kicker="Working with the assistant"
          subtitle="Three ways in. Each ends with something you can act on."
          tone="paper"
        />

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {services.map((s) => (
            <article
              key={s.name}
              className="border-t-2 border-current/70 pt-6 flex flex-col"
            >
              <div className="flex items-baseline justify-between mb-4">
                <span className={cn(editorialType.serif, "text-4xl", editorialTone.paper.numeral)}>
                  {s.numeral}
                </span>
                <span className={editorialType.caption}>{s.duration}</span>
              </div>
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-2")}>
                {s.name}
              </h3>
              <p className="italic font-light opacity-80 mb-5">{s.tagline}</p>
              <ul className="space-y-2 text-sm opacity-80 mb-6 flex-1">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="opacity-40">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-current/15 pt-4">
                <span className={cn(editorialType.serif, "text-xl")}>{s.price}</span>
                <a
                  href={`mailto:jbelisle@helloarchitekt.com?subject=${encodeURIComponent(s.subject)}`}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold hover:opacity-70"
                >
                  Request <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t-2 border-current/60 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <p className={cn(editorialType.caption, "mb-3")}>Try the working surface</p>
            <p className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight")}>
              The Calm Magic Board is where the assistant does its thinking. Open it and see the 5-axis compass live.
            </p>
          </div>
          <button
            onClick={() => setShowBoardGate(true)}
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold hover:opacity-90 self-start md:self-auto"
          >
            Launch the Board <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-6 text-xs opacity-60">
          Prefer a conversation first?{" "}
          <Link to="/contact" className="underline hover:opacity-100">
            Book a discovery call
          </Link>
          .
        </div>
      </EditorialSection>

      <Footer />

      <BoardEntryGate
        isOpen={showBoardGate}
        onClose={() => setShowBoardGate(false)}
        sourceContext="relational"
        preselectedMode="personal"
      />
    </main>
  );
};

export default RelationalHealing;
