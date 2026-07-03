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

import atelier from "@/assets/retreats/atelier-circle.jpg";
import mountain from "@/assets/retreats/mountain-summit.jpg";
import forest from "@/assets/retreats/forest-circle.jpg";

const NavigatorPositioningSection = lazy(
  () => import("@/components/landing/NavigatorPositioningSection"),
);

export default function EditorialHome() {
  usePageSeo({
    title: "Paracosm — Imagination as Infrastructure",
    description:
      "An editorial front door to Paracosm's practice: Foreplay (Trainings), Foresight (Vision Retreats), and Forecast (Prototype Residencies) — woven with the Calm Magic framework.",
    path: "/",
    jsonLd: [
      orgSchema(),
      websiteSchema(),
      webPageSchema({
        title: "Paracosm — Imagination as Infrastructure",
        description:
          "Three ways to rehearse the future before you build it: trainings, retreats, residencies.",
        url: "/",
      }),
    ],
  });

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />
      <EditorialHero />

      <TriadChapter
        numeral="01"
        kicker="Foreplay"
        offering="Trainings"
        headline="Rehearse the moves before the stakes get real."
        pullQuote="Imagination is a skill. Trainings make it a shared muscle."
        body={[
          "Foreplay is where curiosity gets structured. Cohort-based programs and self-paced modules that teach entrepreneurs, executives, and creative teams to think alongside AI without outsourcing judgment.",
          "The Crewdle × Paracosm Formation is the flagship: 65 hours across foundations, prompt art, agents, admin, and Loi 25 compliance — designed so the practice sticks after the last session.",
        ]}
        image={atelier}
        imageAlt="Studio circle — a training cohort at work"
        cta={{
          label: "Explore trainings",
          href: "/trainings",
          eventName: "editorial_chapter_cta_click",
        }}
        tone="warm"
      />

      <TriadChapter
        numeral="02"
        kicker="Foresight"
        offering="Vision Retreats"
        headline="Slow down long enough to see what wants to happen."
        pullQuote="A relational place to hold the ideas your calendar is squeezing out."
        body={[
          "Foresight is where leadership steps out of the machine to sense what the machine is actually asking for. Multi-day retreats designed for founders, executives, and creative partners who need a strategic reset — not a workshop.",
          "The Calm Magic framework is the instrument: a 5-axis compass (Love · Magic · Calm · Open · Free) that turns intuition into a legible map you can share with your team on Monday.",
        ]}
        woven={{
          title: "Calm Magic — Foresight instrument",
          points: [
            "5-axis assessment: Love, Magic, Calm, Open, Free",
            "Intelligence Garden — cognitive patterns & blind spots",
            "Systems Garden — organizational dynamics & tensions",
            "Emotional pattern recognition for authentic decisions",
            "Design creative relationships instead of defaulting",
            "Leadership from presence, not positional authority",
          ],
        }}
        image={mountain}
        imageAlt="Mountain summit — a retreat vantage point"
        cta={{
          label: "See upcoming retreats",
          href: "/events-and-retreats",
          eventName: "editorial_chapter_cta_click",
        }}
        reverse
        tone="night"
      />

      <TriadChapter
        numeral="03"
        kicker="Forecast"
        offering="Prototype Residencies"
        headline="Turn the vision into measurable, working evidence."
        pullQuote="Engineering-grade transformation. Not slideware, not vibes — shipped surfaces."
        body={[
          "Forecast is where imagination becomes infrastructure. Multi-week residencies where Paracosm embeds with your team to build the prototype that proves — or breaks — the hypothesis.",
          "Every residency uses the Prototypes Garden: structured foresight scenarios wired to real data, real users, and a real ROI thesis. You leave with a working artifact and the practice to keep building without us.",
        ]}
        woven={{
          title: "Calm Magic — Forecast rigor",
          points: [
            "Prototypes Garden — tangible futures, not abstract strategy",
            "Reduces the 60–80% transformation failure rate",
            "Reduced turnover through psychologically safe leadership",
            "Innovation acceleration via diegetic prototypes",
            "Alignment across executive vision, tech, and team",
            "Reproducible handoff — quality that survives the exit",
          ],
        }}
        image={forest}
        imageAlt="Forest circle — a residency at work"
        cta={{
          label: "Begin a residency",
          href: "/agentic-ux#residencies",
          eventName: "editorial_chapter_cta_click",
        }}
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
