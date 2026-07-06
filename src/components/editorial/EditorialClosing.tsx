import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EditorialClosing() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  return (
    <section className="py-24 md:py-32 px-6 bg-[hsl(230_35%_10%)] text-[hsl(35_20%_92%)] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] rounded-full bg-[hsl(45_90%_65%)]/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <div className="container max-w-4xl mx-auto relative text-center space-y-10">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-[hsl(45_90%_65%)]">
          {isFr ? "Fin du numéro · Début de la pratique" : "End of issue · Begin the practice"}
        </p>
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
          {isFr ? (
            <>
              L'<em className="italic font-light">imagination</em> n'est pas une phase.
              <br />
              C'est la couche opérationnelle.
            </>
          ) : (
            <>
              <em className="italic font-light">Imagination</em> is not a phase.
              <br />
              It's the operating layer.
            </>
          )}
        </h2>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
          {isFr
            ? "Entrez dans le site pour explorer les formations, retraites, résidences et le cadre Calm Magic — ou ouvrez une conversation et nous choisirons ensemble le point d'entrée."
            : "Step into the site to explore trainings, retreats, residencies, and the Calm Magic framework — or open a conversation and we'll pick the entry point together."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/home"
            onClick={() => trackEvent("editorial_enter_site_click")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[hsl(45_90%_65%)] text-[hsl(230_35%_10%)] text-sm font-semibold uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform"
          >
            {isFr ? "Entrer dans le site" : "Enter the site"} <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`mailto:jbelisle@helloarchitekt.com?subject=${encodeURIComponent(isFr ? "Appel de découverte — Paracosm" : "Discovery call — Paracosm")}`}
            onClick={() => trackEvent("editorial_discovery_call_click")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/30 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
          >
            <Mail className="w-4 h-4" /> {isFr ? "Réserver un appel de découverte" : "Book a discovery call"}
          </a>
        </div>

        <nav className="pt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.25em] opacity-70">
          <Link to="/trainings" className="hover:opacity-100">{isFr ? "Formations" : "Trainings"}</Link>
          <Link to="/events-and-retreats" className="hover:opacity-100">{isFr ? "Retraites" : "Retreats"}</Link>
          <Link to="/agentic-ux#residencies" className="hover:opacity-100">{isFr ? "Résidences" : "Residencies"}</Link>
          <Link to="/calm-magic-demo" className="hover:opacity-100">Calm Magic</Link>
          <Link to="/book" className="hover:opacity-100">{isFr ? "Livre" : "Book"}</Link>
          <Link to="/home" className="hover:opacity-100">{isFr ? "Site complet" : "Full site"}</Link>
        </nav>
      </div>
    </section>
  );
}
