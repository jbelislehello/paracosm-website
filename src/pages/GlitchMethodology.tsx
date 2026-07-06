import { Clock, Users, FileText, Code, Zap, Megaphone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { articleSchema } from "@/lib/structuredData";
import Footer from "@/components/Footer";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import EditorialPullQuote from "@/components/editorial/EditorialPullQuote";
import { editorialTone, editorialType, type EditorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

type Phase = {
  numeral: string;
  name: string;
  duration: string;
  role: string;
  prompts: string[];
  output: string;
  outputNote: string;
  tone: EditorialTone;
};

const phasesEn: Phase[] = [
  {
    numeral: "i", name: "GL!TCH", duration: "7 minutes", role: "Sensing & harvesting",
    prompts: ["What tensions are present?", "Where is energy blocked?", "What glitches are surfacing?"],
    output: "POLLEN", outputNote: "Raw signals & context fragments", tone: "warm",
  },
  {
    numeral: "ii", name: "DRIFT", duration: "10 minutes", role: "Exploring & conceptualizing",
    prompts: ["What wild guesses emerge?", "What connections are forming?", "What's the strangest possibility?"],
    output: "NOEMS", outputNote: "Conceptual atoms & mental models", tone: "night",
  },
  {
    numeral: "iii", name: "TUNE", duration: "6 minutes", role: "Crystallizing & committing",
    prompts: ["What's ready to commit to form?", "What's one concrete next step?", "What pattern crystallized?"],
    output: "POEMS", outputNote: "Narrative frames & commitments", tone: "clay",
  },
];

const phasesFr: Phase[] = [
  {
    numeral: "i", name: "GL!TCH", duration: "7 minutes", role: "Ressentir et récolter",
    prompts: ["Quelles tensions sont présentes ?", "Où l'énergie est-elle bloquée ?", "Quels glitches émergent ?"],
    output: "POLLEN", outputNote: "Signaux bruts et fragments de contexte", tone: "warm",
  },
  {
    numeral: "ii", name: "DRIFT", duration: "10 minutes", role: "Explorer et conceptualiser",
    prompts: ["Quelles hypothèses folles émergent ?", "Quelles connexions se forment ?", "Quelle est la possibilité la plus étrange ?"],
    output: "NOEMS", outputNote: "Atomes conceptuels et modèles mentaux", tone: "night",
  },
  {
    numeral: "iii", name: "TUNE", duration: "6 minutes", role: "Cristalliser et s'engager",
    prompts: ["Qu'est-ce qui est prêt à prendre forme ?", "Quel est un prochain pas concret ?", "Quel motif s'est cristallisé ?"],
    output: "POEMS", outputNote: "Cadres narratifs et engagements", tone: "clay",
  },
];

const seasonsEn = [
  { name: "POLLEN", desc: "Signals" },
  { name: "NOEMS", desc: "Concepts" },
  { name: "POEMS", desc: "Narratives" },
  { name: "TOTEMS", desc: "Architecture" },
  { name: "ANTHEMS", desc: "Market" },
];
const seasonsFr = [
  { name: "POLLEN", desc: "Signaux" },
  { name: "NOEMS", desc: "Concepts" },
  { name: "POEMS", desc: "Récits" },
  { name: "TOTEMS", desc: "Architecture" },
  { name: "ANTHEMS", desc: "Marché" },
];

const artifactsEn = [
  { icon: FileText, title: "Living PRD", note: "Auto-structured requirements" },
  { icon: Code, title: "Tech Stack", note: "Framework recommendations" },
  { icon: Zap, title: "Agentic Prompts", note: "8-layer architecture" },
  { icon: Megaphone, title: "Market Anthem", note: "Brand positioning" },
];
const artifactsFr = [
  { icon: FileText, title: "PRD vivant", note: "Exigences auto-structurées" },
  { icon: Code, title: "Stack technique", note: "Recommandations de frameworks" },
  { icon: Zap, title: "Prompts agentiques", note: "Architecture à 8 couches" },
  { icon: Megaphone, title: "Anthem marché", note: "Positionnement de marque" },
];

const formatsEn = [
  { title: "Spark", people: "5–9 people", length: "25 min", detail: "1 full cycle" },
  { title: "Workshop", people: "10–20 people", length: "90 min", detail: "3 cycles + synthesis", featured: true },
  { title: "Immersion", people: "15–50 people", length: "3 hrs", detail: "Complete PRD generation" },
];
const formatsFr = [
  { title: "Spark", people: "5–9 personnes", length: "25 min", detail: "1 cycle complet" },
  { title: "Atelier", people: "10–20 personnes", length: "90 min", detail: "3 cycles + synthèse", featured: true },
  { title: "Immersion", people: "15–50 personnes", length: "3 h", detail: "Génération complète de PRD" },
];

const GlitchMethodology = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const phases = isFr ? phasesFr : phasesEn;
  const seasons = isFr ? seasonsFr : seasonsEn;
  const artifacts = isFr ? artifactsFr : artifactsEn;
  const formats = isFr ? formatsFr : formatsEn;

  usePageSeo({
    title: isFr
      ? "Méthodologie GL!TCH — Un cycle vivant de 25 minutes pour l'intelligence relationnelle | Paracosm"
      : "GL!TCH Methodology — A 25-minute live cycle for relational intelligence | Paracosm",
    description: isFr
      ? "GL!TCH est une méthodologie de facilitation en direct de 25 minutes pour le travail sur les scripts culturels, d'interface et intérieurs — ancrée dans le cadre Calm Magic."
      : "GL!TCH is a 25-minute live facilitation methodology for cultural, interface, and inner script work — grounded in the Calm Magic framework.",
    path: "/glitch-methodology",
    jsonLd: [
      articleSchema({
        title: "GL!TCH Methodology — A 25-minute live cycle for relational intelligence",
        description: "GL!TCH is a 25-minute live facilitation methodology for cultural, interface, and inner script work — grounded in the Calm Magic framework.",
        url: "/glitch-methodology",
        datePublished: "2025-01-01",
      }),
    ],
  });

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      <EditorialSection tone="warm" className="pt-14 pb-16 md:pt-20 md:pb-24">
        <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>
          {isFr ? 'Vol. I · Méthode · GL!TCH' : 'Vol. I · Method · GL!TCH'}
        </p>
        <div className="mt-6 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8 space-y-6">
            <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight")}>
              {isFr ? (
                <>De la <em className="italic font-light">conversation</em> au <em className="italic font-light">logiciel</em>, en 25 minutes.</>
              ) : (
                <>From <em className="italic font-light">conversation</em> to <em className="italic font-light">software</em>, in 25 minutes.</>
              )}
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed">
              {isFr
                ? "GL!TCH est une méthodologie de facilitation en direct qui transforme le dialogue de groupe en spécifications techniques — trois phases, un cycle de respiration, un artefact livré."
                : "GL!TCH is a live facilitation methodology that transforms group dialogue into technical specifications — three phases, one breath cycle, a shipped artifact."}
            </p>
          </div>
          <aside className="md:col-span-4 border-l border-current/20 pl-6 space-y-3">
            <p className={editorialType.caption}>
              <Clock className="inline w-3 h-3 mr-1" /> {isFr ? 'Cycle en direct' : 'Live cycle'}
            </p>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-3"><span className={cn(editorialType.serif, editorialTone.warm.numeral)}>01</span><span>{isFr ? 'Le cycle de respiration' : 'The breath cycle'}</span></li>
              <li className="flex gap-3"><span className={cn(editorialType.serif, editorialTone.warm.numeral)}>02</span><span>{isFr ? 'Le pipeline en 5 saisons' : 'The 5-season pipeline'}</span></li>
              <li className="flex gap-3"><span className={cn(editorialType.serif, editorialTone.warm.numeral)}>03</span><span>{isFr ? 'Formats de session' : 'Session formats'}</span></li>
            </ol>
          </aside>
        </div>
      </EditorialSection>

      <EditorialSection tone="paper" id="breath-cycle">
        <EditorialChapterHeader
          numeral="01"
          kicker={isFr ? 'Le cycle de respiration' : 'The breath cycle'}
          subtitle={isFr ? 'Trois mouvements, vingt-trois minutes d\'attention partagée.' : 'Three movements, twenty-three minutes of shared attention.'}
          tone="paper"
        />
        <EditorialPullQuote tone="paper" className="max-w-3xl mb-12">
          {isFr
            ? "Une pièce qui respire ensemble produit la matière source du logiciel dont elle a besoin."
            : "A room breathing together produces the source material for the software it needs."}
        </EditorialPullQuote>
      </EditorialSection>

      {phases.map((p, i) => {
        const styles = editorialTone[p.tone];
        return (
          <section key={p.name} className={cn("py-20 md:py-28 px-6 relative", styles.section)}>
            <div className="container max-w-7xl mx-auto">
              <EditorialChapterHeader
                numeral={`01·0${i + 1}`}
                kicker={`${isFr ? 'Phase' : 'Phase'} ${p.numeral.toUpperCase()} · ${p.duration}`}
                subtitle={p.role}
                tone={p.tone}
              />
              <div className="grid md:grid-cols-12 gap-10">
                <div className="md:col-span-8 space-y-6">
                  <h2 className={cn(editorialType.serif, "text-5xl md:text-6xl leading-[1.02] tracking-tight")}>
                    {p.name}
                  </h2>
                  <ul className="space-y-3 max-w-xl">
                    {p.prompts.map((q) => (
                      <li key={q} className={cn(editorialType.serif, "italic text-lg md:text-xl opacity-80 border-l-2 pl-4", styles.quoteBorder)}>
                        “{q}”
                      </li>
                    ))}
                  </ul>
                </div>
                <aside className="md:col-span-4">
                  <div className={cn("rounded-2xl border p-6", styles.calloutBox)}>
                    <p className={editorialType.caption}>{isFr ? 'Sortie' : 'Output'}</p>
                    <p className={cn(editorialType.serif, "text-3xl mt-2")}>{p.output}</p>
                    <p className="text-sm opacity-70 mt-1">{p.outputNote}</p>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        );
      })}

      <EditorialSection tone="night" id="pipeline">
        <EditorialChapterHeader
          numeral="02"
          kicker={isFr ? 'Le pipeline en 5 saisons' : 'The 5-season pipeline'}
          subtitle={isFr ? 'Comment les mots parlés deviennent des spécifications structurées.' : 'How spoken words become structured specifications.'}
          tone="night"
        />
        <div className="mt-10 flex flex-wrap items-center gap-3 md:gap-4">
          {seasons.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3 md:gap-4">
              <div className="border border-current/30 px-5 py-3 min-w-[120px]">
                <p className={cn(editorialType.serif, "text-xl leading-none")}>{s.name}</p>
                <p className="text-xs opacity-70 mt-1 uppercase tracking-wider">{s.desc}</p>
              </div>
              {i < seasons.length - 1 && <ArrowRight className="w-4 h-4 opacity-50" />}
            </div>
          ))}
        </div>

        <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-4 gap-6 border-t border-current/20 pt-10">
          {artifacts.map((a) => (
            <div key={a.title} className="space-y-2">
              <a.icon className="w-5 h-5 opacity-70" />
              <p className={cn(editorialType.serif, "text-xl")}>{a.title}</p>
              <p className="text-sm opacity-70">{a.note}</p>
            </div>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection tone="clay" id="formats">
        <EditorialChapterHeader
          numeral="03"
          kicker={isFr ? 'Formats de session' : 'Session formats'}
          subtitle={isFr ? 'Choisissez le vaisseau ; le cycle reste le même.' : 'Pick the vessel; the cycle stays the same.'}
          tone="clay"
        />
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {formats.map((f) => (
            <div key={f.title} className={cn("border p-6 relative", editorialTone.clay.calloutBox, f.featured && "border-current/60")}>
              {f.featured && (
                <span className="absolute -top-3 left-6 px-3 py-1 text-[9px] uppercase tracking-[0.3em] bg-background border border-current/40">
                  {isFr ? 'Le plus réservé' : 'Most booked'}
                </span>
              )}
              <div className={cn(editorialType.caption, "flex items-center gap-2")}>
                <Users className="w-3 h-3" /> {f.people}
              </div>
              <h3 className={cn(editorialType.serif, "text-3xl mt-3")}>{f.title}</h3>
              <p className={cn(editorialType.serif, "text-4xl mt-4")}>{f.length}</p>
              <p className="text-sm opacity-70 mt-2">{f.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-current/20 pt-10 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8 space-y-4">
            <p className={cn(editorialType.serif, "text-3xl md:text-4xl leading-tight")}>
              {isFr ? 'Prêt·e à lancer un cycle avec votre équipe ?' : 'Ready to run a cycle with your team?'}
            </p>
            <p className="opacity-80 max-w-xl">
              {isFr
                ? "Réservez une démo ou lancez une session GL!TCH aujourd'hui. Nous facilitons la première avec vous."
                : "Book a demo or start a GL!TCH session today. We facilitate the first one with you."}
            </p>
          </div>
          <div className="md:col-span-4 md:text-right space-y-3">
            <a
              href="mailto:jbelisle@helloarchitekt.com?subject=Start a GL!TCH Session"
              className={cn("inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold", editorialTone.clay.ctaPrimary)}
            >
              {isFr ? 'Démarrer une session' : 'Start a session'} <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <div>
              <Link to="/contact" className="text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100">
                {isFr ? 'Nous contacter →' : 'Contact us →'}
              </Link>
            </div>
          </div>
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
};

export default GlitchMethodology;
