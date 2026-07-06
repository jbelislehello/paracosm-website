import { lazy, Suspense } from "react";
import EditorialHero from "@/components/editorial/EditorialHero";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import TriadChapter from "@/components/editorial/TriadChapter";
import PartnerInnovationPlaysSection from "@/components/editorial/PartnerInnovationPlaysSection";
import EditorialDispatchesSection from "@/components/editorial/EditorialDispatchesSection";
import EditorialClosing from "@/components/editorial/EditorialClosing";
import EditorialBulletinsSection from "@/components/editorial/EditorialBulletinsSection";
import { usePageSeo } from "@/hooks/usePageSeo";
import { orgSchema, websiteSchema, webPageSchema } from "@/lib/structuredData";
import { useLanguage } from "@/contexts/LanguageContext";

import atelier from "@/assets/retreats/atelier-circle.jpg";
import mountain from "@/assets/retreats/mountain-summit.jpg";
import forest from "@/assets/retreats/forest-circle.jpg";

const NavigatorPositioningSection = lazy(
  () => import("@/components/landing/NavigatorPositioningSection"),
);

export default function EditorialHome() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  usePageSeo({
    title: isFr
      ? "Paracosm — L'imagination comme infrastructure"
      : "Paracosm — Imagination as Infrastructure",
    description: isFr
      ? "Une porte d'entrée éditoriale à la pratique de Paracosm : Foreplay (Formations), Foresight (Retraites de vision) et Forecast (Résidences prototype) — tissés avec le cadre Calm Magic."
      : "An editorial front door to Paracosm's practice: Foreplay (Trainings), Foresight (Vision Retreats), and Forecast (Prototype Residencies) — woven with the Calm Magic framework.",
    path: "/",
    jsonLd: [
      orgSchema(),
      websiteSchema(),
      webPageSchema({
        title: isFr
          ? "Paracosm — L'imagination comme infrastructure"
          : "Paracosm — Imagination as Infrastructure",
        description: isFr
          ? "Trois façons de répéter le futur avant de le construire : formations, retraites, résidences."
          : "Three ways to rehearse the future before you build it: trainings, retreats, residencies.",
        url: "/",
      }),
    ],
  });

  const chapter1 = isFr
    ? {
        kicker: "Foreplay",
        offering: "Formations",
        headline: "Répétez les gestes avant que les enjeux ne deviennent réels.",
        pullQuote: "L'imagination est une compétence. Les formations font partager le muscle inventif.",
        body: [
          "Foreplay, c'est là où la curiosité prend structure. Des programmes en cohorte et des modules autonomes qui apprennent aux fondateur·rice·s de PME, dirigeant·e·s et équipes créatives à penser avec l'IA sans déléguer leur jugement — la moitié inventive de la pratique, avant qu'elle ne devienne produit expressif.",
          "La Formation Crewdle × Paracosm est le vaisseau amiral : 65 heures couvrant fondations, art du prompt, agents, admin et conformité Loi 25 — pensée pour que la pratique dure après la dernière session.",
        ],
        cta: "Explorer les formations",
        imageAlt: "Cercle de studio — une cohorte de formation à l'œuvre",
      }
    : {
        kicker: "Foreplay",
        offering: "Trainings",
        headline: "Rehearse the moves before the stakes get real.",
        pullQuote: "Imagination is a skill. Trainings make the inventive muscle shared.",
        body: [
          "Foreplay is where curiosity gets structured. Cohort-based programs and self-paced modules that teach SMB founders, executives, and creative teams to think alongside AI without outsourcing judgment — the inventive half of the practice, before it becomes expressive product.",
          "The Crewdle × Paracosm Formation is the flagship: 65 hours across foundations, prompt art, agents, admin, and Loi 25 compliance — designed so the practice sticks after the last session.",
        ],
        cta: "Explore trainings",
        imageAlt: "Studio circle — a training cohort at work",
      };

  const chapter2 = isFr
    ? {
        kicker: "Foresight",
        offering: "Retraites de vision",
        headline: "Ralentir assez longtemps pour voir ce qui veut arriver.",
        pullQuote: "Un lieu relationnel pour tenir les idées inventives que votre agenda écrase.",
        body: [
          "Foresight, c'est là où le leadership sort de la machine pour sentir ce que la machine demande vraiment. Des retraites de plusieurs jours conçues pour fondateur·rice·s, dirigeant·e·s, PME en croissance et partenaires créatif·ve·s qui ont besoin d'une remise à zéro stratégique — pas d'un atelier.",
          "Le cadre Calm Magic est l'instrument : une boussole à 5 axes (Love · Magic · Calm · Open · Free) qui transforme l'intuition en carte lisible à partager avec votre équipe lundi.",
        ],
        wovenTitle: "Calm Magic — Instrument Foresight",
        wovenPoints: [
          "Évaluation à 5 axes : Love, Magic, Calm, Open, Free",
          "Jardin d'intelligence — patterns cognitifs et angles morts",
          "Jardin systémique — dynamiques organisationnelles et tensions",
          "Reconnaissance des patterns émotionnels pour décisions authentiques",
          "Concevoir des relations créatives plutôt que subir",
          "Leadership depuis la présence, pas l'autorité positionnelle",
        ],
        cta: "Voir les prochaines retraites",
        imageAlt: "Sommet de montagne — un point de vue de retraite",
      }
    : {
        kicker: "Foresight",
        offering: "Vision Retreats",
        headline: "Slow down long enough to see what wants to happen.",
        pullQuote: "A relational place to hold the inventive ideas your calendar is squeezing out.",
        body: [
          "Foresight is where leadership steps out of the machine to sense what the machine is actually asking for. Multi-day retreats designed for founders, executives, growing SMBs, and creative partners who need a strategic reset — not a workshop.",
          "The Calm Magic framework is the instrument: a 5-axis compass (Love · Magic · Calm · Open · Free) that turns intuition into a legible map you can share with your team on Monday.",
        ],
        wovenTitle: "Calm Magic — Foresight instrument",
        wovenPoints: [
          "5-axis assessment: Love, Magic, Calm, Open, Free",
          "Intelligence Garden — cognitive patterns & blind spots",
          "Systems Garden — organizational dynamics & tensions",
          "Emotional pattern recognition for authentic decisions",
          "Design creative relationships instead of defaulting",
          "Leadership from presence, not positional authority",
        ],
        cta: "See upcoming retreats",
        imageAlt: "Mountain summit — a retreat vantage point",
      };

  const chapter3 = isFr
    ? {
        kicker: "Forecast",
        offering: "Résidences prototype",
        headline: "Transformez la vision en preuves mesurables et fonctionnelles.",
        pullQuote: "Là où l'intention inventive devient infrastructure expressive — ni slideware, ni vibes.",
        body: [
          "Forecast, c'est là où l'imagination devient infrastructure expressive. Des résidences de plusieurs semaines où Paracosm s'intègre à votre équipe pour construire le prototype qui prouve — ou casse — l'hypothèse.",
          "Chaque résidence utilise le Jardin des Prototypes : des scénarios de foresight structurés, connectés à de vraies données, de vrai·e·s utilisateur·rice·s et une vraie thèse de ROI. Vous repartez avec un artefact fonctionnel et la pratique pour continuer à construire sans nous.",
        ],
        wovenTitle: "Calm Magic — Rigueur Forecast",
        wovenPoints: [
          "Jardin des Prototypes — futurs tangibles, pas stratégie abstraite",
          "Réduit le taux d'échec de 60 à 80 % des transformations",
          "Rétention accrue grâce à un leadership psychologiquement sûr",
          "Accélération de l'innovation via prototypes diégétiques",
          "Alignement entre vision exécutive, tech et équipe",
          "Passation reproductible — qualité qui survit à notre départ",
        ],
        cta: "Commencer une résidence",
        imageAlt: "Cercle en forêt — une résidence à l'œuvre",
      }
    : {
        kicker: "Forecast",
        offering: "Prototype Residencies",
        headline: "Turn the vision into measurable, working evidence.",
        pullQuote: "Where inventive intent becomes expressive infrastructure — not slideware, not vibes.",
        body: [
          "Forecast is where imagination becomes expressive infrastructure. Multi-week residencies where Paracosm embeds with your team to build the prototype that proves — or breaks — the hypothesis.",
          "Every residency uses the Prototypes Garden: structured foresight scenarios wired to real data, real users, and a real ROI thesis. You leave with a working artifact and the practice to keep building without us.",
        ],
        wovenTitle: "Calm Magic — Forecast rigor",
        wovenPoints: [
          "Prototypes Garden — tangible futures, not abstract strategy",
          "Reduces the 60–80% transformation failure rate",
          "Reduced turnover through psychologically safe leadership",
          "Innovation acceleration via diegetic prototypes",
          "Alignment across executive vision, tech, and team",
          "Reproducible handoff — quality that survives the exit",
        ],
        cta: "Begin a residency",
        imageAlt: "Forest circle — a residency at work",
      };

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />
      <EditorialHero />

      <TriadChapter
        numeral="01"
        kicker={chapter1.kicker}
        offering={chapter1.offering}
        headline={chapter1.headline}
        pullQuote={chapter1.pullQuote}
        body={chapter1.body}
        image={atelier}
        imageAlt={chapter1.imageAlt}
        cta={{ label: chapter1.cta, href: "/trainings", eventName: "editorial_chapter_cta_click" }}
        tone="warm"
      />

      <TriadChapter
        numeral="02"
        kicker={chapter2.kicker}
        offering={chapter2.offering}
        headline={chapter2.headline}
        pullQuote={chapter2.pullQuote}
        body={chapter2.body}
        woven={{ title: chapter2.wovenTitle, points: chapter2.wovenPoints }}
        image={mountain}
        imageAlt={chapter2.imageAlt}
        cta={{ label: chapter2.cta, href: "/events-and-retreats", eventName: "editorial_chapter_cta_click" }}
        reverse
        tone="night"
      />

      <TriadChapter
        numeral="03"
        kicker={chapter3.kicker}
        offering={chapter3.offering}
        headline={chapter3.headline}
        pullQuote={chapter3.pullQuote}
        body={chapter3.body}
        woven={{ title: chapter3.wovenTitle, points: chapter3.wovenPoints }}
        image={forest}
        imageAlt={chapter3.imageAlt}
        cta={{ label: chapter3.cta, href: "/agentic-ux#residencies", eventName: "editorial_chapter_cta_click" }}
        tone="clay"
      />

      {/* Ecosystem positioning — reused block */}
      <Suspense fallback={null}>
        <NavigatorPositioningSection />
      </Suspense>

      <PartnerInnovationPlaysSection />

      <EditorialBulletinsSection />

      <EditorialDispatchesSection />

      <EditorialClosing />
    </main>
  );
}
