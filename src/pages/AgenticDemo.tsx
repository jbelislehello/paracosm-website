import { Link } from "react-router-dom";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import AgenticEcosystemDemo from "@/components/AgenticEcosystemDemo";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import {
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
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="h-8 w-8 rounded-lg bg-white p-1 object-contain"
            />
            <span className="font-serif text-base tracking-tight">Paracosm</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] opacity-70">
            <Link to="/agentic-ux" className="hover:opacity-100">Agentic UX</Link>
            <Link to="/contact" className="hover:opacity-100">Contact</Link>
          </nav>
        </div>
      </header>

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
            title="Agents, scenarios, transitions"
            subtitle="Pick a scenario, step through the reasoning, and read the biases the ecosystem is compensating for."
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
