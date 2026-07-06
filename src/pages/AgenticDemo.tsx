import AgenticEcosystemDemo from "@/components/AgenticEcosystemDemo";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialChapterHeader,
} from "@/components/editorial";

const AgenticDemo = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  usePageSeo({
    title: isFr
      ? "Démo UX agentique en direct — Paracosm"
      : "Live Agentic UX Demo — Paracosm",
    description: isFr
      ? "Explorez la démo vivante de l'écosystème agentique — une traversée de l'orchestration multi-agents et relationnelle de Paracosm."
      : "Explore the live agentic ecosystem demo — a walk-through of Paracosm's relational, multi-agent orchestration in motion.",
    path: "/agentic-demo",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />

      <main>
        <EditorialPageHero
          tone="warm"
          numeral="00"
          kicker={isFr ? "Démo · UX agentique en mouvement" : "Live demo · Agentic UX in motion"}
          title={
            isFr ? (
              <>
                Regardez l'écosystème <em className="italic font-light">penser à voix haute.</em>
              </>
            ) : (
              <>
                Watch the ecosystem <em className="italic font-light">think out loud.</em>
              </>
            )
          }
          subtitle={
            isFr
              ? "Une traversée de l'orchestration multi-agents de Paracosm — scénarios, transitions et biais mis à nu au fil du déroulement."
              : "A walk-through of Paracosm's multi-agent orchestration — scenarios, transitions, and biases surfaced as they unfold."
          }
        />

        <EditorialSection tone="paper" id="agentic-demo">
          <EditorialChapterHeader
            numeral="01"
            kicker={isFr ? "La démo" : "The demo"}
            subtitle={
              isFr
                ? "Choisissez un scénario, suivez le raisonnement, lisez les biais que l'écosystème compense."
                : "Pick a scenario, step through the reasoning, read the biases the ecosystem is compensating for."
            }
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
