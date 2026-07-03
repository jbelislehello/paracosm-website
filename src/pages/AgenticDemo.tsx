import { Link } from "react-router-dom";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import AgenticEcosystemDemo from "@/components/AgenticEcosystemDemo";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";

const AgenticDemo = () => {
  usePageSeo({
    title: "Live Agentic UX Demo — Paracosm",
    description:
      "Explore the live agentic ecosystem demo — a walk-through of Paracosm's relational, multi-agent orchestration in motion.",
    path: "/agentic-demo",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="h-8 w-8 rounded-lg bg-white p-1 object-contain"
            />
            <span className="text-sm font-bold">Paracosm</span>
          </Link>
        </div>
      </header>
      <main>
        <AgenticEcosystemDemo />
      </main>
      <Footer />
    </div>
  );
};

export default AgenticDemo;
