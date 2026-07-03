import AgenticEcosystemDemo from "@/components/AgenticEcosystemDemo";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialChapterHeader,
} from "@/components/editorial";

const AgenticDemo = () => {
  usePageSeo({
    title: "Live Agentic UX Demo — Paracosm",
    description:
      "Explore the live agentic ecosystem demo — a walk-through of Paracosm's relational, multi-agent orchestration in motion.",
    path: "/agentic-demo",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />

      <main>
        <EditorialPageHero
          tone="warm"
          numeral="00"
          kicker="Live demo · Agentic UX in motion"
          title={
            <>
              Watch the ecosystem <em className="italic font-light">think out loud.</em>
            </>
          }
          subtitle="A walk-through of Paracosm's multi-agent orchestration — scenarios, transitions, and biases surfaced as they unfold."
        />

        <EditorialSection tone="paper" id="agentic-demo">
          <EditorialChapterHeader
            numeral="01"
            kicker="The demo"
            subtitle="Pick a scenario, step through the reasoning, read the biases the ecosystem is compensating for."
            tone="paper"
          />
          <div className="mt-12">
            <AgenticEcosystemDemo />
          </div>
        </EditorialSection>
      </main>

      <Footer />
    </div>
  );
};

export default AgenticDemo;
