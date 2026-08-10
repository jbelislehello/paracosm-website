import { Link } from "react-router-dom";
import { ArrowRight, Compass, HeartHandshake } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useLanguage } from "@/contexts/LanguageContext";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import Footer from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";

export default function ReadinessChooser() {
  const { language } = useLanguage();
  const fr = language === "fr";

  usePageSeo({
    title: fr ? "Évaluations | Paracosm" : "Assessments | Paracosm",
    description: fr
      ? "Choisissez entre l'évaluation d'intelligence relationnelle (12 min, pour les leaders et coachs) et l'évaluation Calm Magic Readiness (approfondie, 5 saisons)."
      : "Choose between the Relational Intelligence assessment (12 min, for leaders and coaches) and the Calm Magic Readiness assessment (in-depth, 5 seasons).",
    path: "/readiness",
  });

  const cards = [
    {
      to: "/readiness/relational",
      variant: "relational",
      icon: HeartHandshake,
      eyebrow: fr ? "12 minutes · 30 énoncés" : "12 minutes · 30 statements",
      title: fr ? "Intelligence relationnelle" : "Relational Intelligence",
      forWho: fr
        ? "Pour les leaders d'équipe, gestionnaires et coachs"
        : "For team leaders, managers, and coaches",
      body: fr
        ? "Cartographiez comment vous et votre équipe gérez le lien, la pression et le conflit à travers cinq dimensions : conscience de soi, attunement, co-régulation, réparation et limites. Langage clair, aucun jargon requis."
        : "Map how you and your team handle connection, pressure, and conflict across five dimensions: self-awareness, attunement, co-regulation, repair, and boundaries. Plain language, no jargon required.",
      cta: fr ? "Commencer" : "Start here",
      primary: true,
    },
    {
      to: "/readiness/calm-magic",
      variant: "calm_magic",
      icon: Compass,
      eyebrow: fr ? "Approfondi · 5 saisons" : "In-depth · 5 seasons",
      title: fr ? "Calm Magic Readiness" : "Calm Magic Readiness",
      forWho: fr
        ? "Pour les praticiens familiers avec le cadre Calm Magic"
        : "For practitioners already fluent in the Calm Magic framework",
      body: fr
        ? "Le diagnostic complet à 320 tuiles qui met en regard la maturité personnelle et organisationnelle à travers Pollens, Noems, Poems, Totems et Anthems."
        : "The full 320-tile diagnostic mapping personal readiness against organizational maturity across Pollens, Noems, Poems, Totems, and Anthems.",
      cta: fr ? "Ouvrir le diagnostic" : "Open the diagnostic",
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <EditorialSiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {fr ? "Évaluations" : "Assessments"}
          </span>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            {fr ? "Par où voulez-vous commencer ?" : "Where do you want to begin?"}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {fr
              ? "Deux chemins vers la même carte. Le premier est écrit en langage courant pour les équipes. Le second suppose une familiarité avec notre cadre."
              : "Two paths into the same map. The first is written in everyday language for teams. The second assumes fluency with our framework."}
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.to}
                to={c.to}
                onClick={() => void trackEvent("readiness_variant_selected", { variant: c.variant })}
                className={`group flex flex-col rounded-3xl border p-7 transition-colors ${
                  c.primary
                    ? "border-primary/40 bg-primary/[0.04] hover:border-primary"
                    : "border-border bg-card/40 hover:border-foreground/30"
                }`}
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="mt-5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {c.eyebrow}
                </span>
                <h2 className="mt-2 font-serif text-2xl">{c.title}</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {c.forWho}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                  {c.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
