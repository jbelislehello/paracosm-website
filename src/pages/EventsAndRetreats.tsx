import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import ParacosmEventsSection from "@/components/ParacosmEventsSection";
import CaseStudiesSection from "@/components/case-studies/CaseStudiesSection";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialCTA,
} from "@/components/editorial";
import { editorialType, editorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { webPageSchema } from "@/lib/structuredData";
import { residencies } from "@/data/residencies";
import {
  residencyImage,
  residencyImageCaption,
  residencyImageCredit,
  formatCredit,
} from "@/assets/retreats";

const EventsAndRetreats = () => {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';

  usePageSeo({
    title: isFr ? "Événements et retraites — Paracosm" : "Events & Retreats — Paracosm",
    description: isFr
      ? "Programmation en direct, retraites et études de cas terrain de Paracosm — où dirigeant·e·s et innovateur·rice·s pratiquent la maîtrise des systèmes IA et l'intelligence relationnelle."
      : "Live programming, retreats, and field-tested case studies from Paracosm — where executives and innovators practice AI systems mastery and relational intelligence.",
    path: "/events-and-retreats",
    jsonLd: [
      webPageSchema({
        type: "CollectionPage",
        title: isFr ? "Événements et retraites — Paracosm" : "Events & Retreats — Paracosm",
        description: isFr
          ? "Programmation en direct, retraites et études de cas de l'écosystème Paracosm."
          : "Live programming, retreats, and case studies from the Paracosm ecosystem.",
        url: "/events-and-retreats",
      }),
    ],
  });

  const warm = editorialTone.warm;
  const clay = editorialTone.clay;
  const night = editorialTone.night;

  return (
    <div className="min-h-screen bg-[hsl(35_45%_96%)] text-foreground">
      <EditorialSiteHeader />

      {/* Editorial hero */}
      <EditorialPageHero
        numeral="07"
        kicker={isFr ? "Volume 07 · Programmation en direct et notes de terrain" : "Volume 07 · Live Programming & Field Notes"}
        title={isFr
          ? (<>Événements <em className="italic font-light">&amp;</em> retraites.</>)
          : (<>Events <em className="italic font-light">&amp;</em> Retreats.</>)}
        subtitle={isFr
          ? "Où la méthodologie rencontre la salle. Sessions en direct, retraites immersives et études de cas des engagements Paracosm."
          : "Where the methodology meets the room. Live sessions, immersive retreats, and case studies from Paracosm engagements."}
        tone="warm"
      />

      {/* Upcoming events */}
      <EditorialSection tone="warm" id="events">
        <div className="flex items-baseline gap-6 mb-8">
          <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", warm.numeral)}>01</span>
          <p className={cn(editorialType.kicker, warm.kicker)}>{t("landing.section_events")}</p>
        </div>
        <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight max-w-3xl mb-6")}>
          {isFr
            ? (<>Événements d'<em className="italic font-light">apprentissage</em> à venir.</>)
            : (<>Upcoming <em className="italic font-light">learning</em> events.</>)}
        </h2>
        <p className="text-base md:text-lg opacity-80 max-w-2xl mb-12">
          {t("landing.section_events_sub")}
        </p>
        <ParacosmEventsSection tone="warm" />
        <div className="mt-12">
          <EditorialCTA to="/paracosm-retreat" tone="warm" variant="ghost">
            {isFr ? 'Retraite Açores 2026' : 'Azores 2026 Retreat'}
          </EditorialCTA>
        </div>
      </EditorialSection>

      {/* Yutori Nights */}
      <EditorialSection tone="clay" id="yutori">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-8">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", clay.numeral)}>02</span>
              <p className={cn(editorialType.kicker, clay.kicker)}>{isFr ? 'Série de soirées' : 'Evening series'}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6")}>
              Yutori <em className="italic font-light">Nights.</em>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed opacity-85 mb-4 max-w-2xl">
              {isFr
                ? "Une série de soirées d'écoute et de danse conçues autour de la cognition hybride et de la somatique créative — un événement privé où l'IA rencontre plaisirs sensoriels, musique et audiovisuel."
                : "A series of listening & dance parties designed around hybrid cognition and creative somatics — a private event where AI meets sensory pleasures, music, and audio-visuals."}
            </p>
            <p className={cn(editorialType.caption, "opacity-70")}>
              {isFr ? 'Sur invitation · dates annoncées par ville' : 'By invitation · dates announced per city'}
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <EditorialCTA
              href="mailto:jbelisle@helloarchitekt.com?subject=Yutori%20Nights%20—%20save%20my%20chair"
              tone="clay"
            >
              {isFr ? 'Réservez ma place' : 'Save my chair'}
            </EditorialCTA>
          </div>
        </div>
      </EditorialSection>

      {/* Think Like a Forest */}
      <EditorialSection tone="night" id="think-like-a-forest">
        {(() => {
          const forest = residencies.find((r) => r.id === "forest")!;
          const credit = formatCredit(residencyImageCredit.forest);
          return (
            <>
              <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end mb-16">
                <div className="md:col-span-8">
                  <div className="flex items-baseline gap-6 mb-6">
                    <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", night.numeral)}>03</span>
                    <p className={cn(editorialType.kicker, night.kicker)}>{isFr ? 'Retraite phare' : 'Flagship retreat'}</p>
                  </div>
                  <h2 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6")}>
                    Think Like a <em className="italic font-light">Forest.</em>
                  </h2>
                  <p className="text-lg md:text-xl leading-relaxed opacity-85 mb-4 max-w-2xl">
                    {isFr
                      ? (<>En collaboration avec <em className="italic">Les Hédonistes</em> et <em className="italic">Create Yourself</em>, Paracosm organise cette retraite semestrielle de plusieurs jours pour dirigeant·e·s et visionnaires afin de sentir le système entier avant d'y intervenir. Mycélium, racines, canopée, sous-bois — une leçon incarnée de complexité.</>)
                      : (<>In collaboration with <em className="italic">Les Hédonistes</em> and <em className="italic">Create Yourself</em>, Paracosm holds this bi-annual multi-day retreat for leaders and visionaries to sense the whole system before intervening in it. Mycelium, roots, canopy, understory — an embodied lesson in complexity.</>)}
                  </p>
                  <p className={cn(editorialType.caption, "opacity-70")}>
                    {forest.tagline} · {isFr ? 'Dates et lieu — à venir' : 'Dates & location — TBA'}
                  </p>
                </div>
                <div className="md:col-span-4 md:text-right">
                  <p className={cn(editorialType.kicker, night.kicker, "mb-2")}>{isFr ? 'Pour les dirigeant·e·s' : 'For leaders'}</p>
                  <p className="text-sm md:text-base opacity-80 leading-relaxed">{forest.forLeaders}</p>
                </div>
              </div>

              {/* Editorial image */}
              <figure className="mb-16">
                <img
                  src={residencyImage.forest}
                  alt={isFr ? "Cercle de cohorte sous la canopée forestière d'une retraite Paracosm" : "Cohort circle under the forest canopy at a Paracosm retreat"}
                  className="w-full h-auto object-cover aspect-[16/9] md:aspect-[21/9]"
                  loading="lazy"
                />
                <figcaption className={cn(editorialType.caption, "mt-3 opacity-70 flex flex-wrap gap-x-4 gap-y-1")}>
                  <span className="italic">{residencyImageCaption.forest}</span>
                  {credit && <span className="opacity-70">{credit}</span>}
                </figcaption>
              </figure>

              {/* Manifesto */}
              <div className="mb-16 max-w-4xl">
                <p className={cn(editorialType.kicker, night.kicker, "mb-6")}>{isFr ? 'Manifeste' : 'Manifesto'}</p>
                <div className="divide-y divide-foreground/15">
                  {forest.manifesto.map((line, i) => (
                    <p
                      key={i}
                      className={cn(editorialType.serif, "text-2xl md:text-3xl leading-snug italic font-light py-6")}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Meta strip */}
              <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16 border-t border-foreground/20 pt-8">
                {[
                  { label: isFr ? 'Enseignant·e' : 'Teacher', value: forest.teacher },
                  { label: isFr ? 'Durée' : 'Duration', value: forest.duration },
                  { label: isFr ? 'Format' : 'Format', value: forest.format },
                ].map((meta) => (
                  <div key={meta.label}>
                    <p className={cn(editorialType.kicker, night.kicker, "mb-2")}>{meta.label}</p>
                    <p className="text-sm md:text-base opacity-85 leading-relaxed">{meta.value}</p>
                  </div>
                ))}
              </div>

              {/* Practices */}
              <div className="mb-16">
                <div className="flex items-baseline gap-6 mb-8">
                  <p className={cn(editorialType.kicker, night.kicker)}>{isFr ? 'Pratiques' : 'Practices'}</p>
                  <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl italic font-light")}>
                    {isFr ? 'Ce que nous faisons ensemble.' : 'What we do together.'}
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                  {forest.practices.map((p) => (
                    <div key={p.name} className="border-t border-foreground/25 pt-5">
                      <h4 className={cn(editorialType.serif, "text-xl md:text-2xl leading-tight mb-3")}>{p.name}</h4>
                      <p className="text-sm md:text-base opacity-80 leading-relaxed">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold + Artifact */}
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-16">
                <div>
                  <p className={cn(editorialType.kicker, night.kicker, "mb-3")}>{isFr ? 'Le seuil' : 'The threshold'}</p>
                  <p className={cn(editorialType.serif, "text-xl md:text-2xl leading-snug italic font-light")}>
                    {forest.threshold}
                  </p>
                </div>
                <div>
                  <p className={cn(editorialType.kicker, night.kicker, "mb-3")}>{isFr ? 'Ce que vous emportez' : 'What you leave with'}</p>
                  <p className="text-base md:text-lg opacity-85 leading-relaxed">{forest.artifact}</p>
                </div>
              </div>

              {/* CTA row */}
              <div className="flex flex-wrap gap-6 items-center border-t border-foreground/20 pt-8">
                <EditorialCTA
                  href="mailto:jbelisle@helloarchitekt.com?subject=Think%20Like%20a%20Forest%20—%20invitation"
                  tone="night"
                >
                  {isFr ? "Lire l'invitation" : 'Read the invitation'}
                </EditorialCTA>
                <EditorialCTA to="/residencies/forest" tone="night" variant="ghost">
                  {isFr ? 'Explorer la résidence complète' : 'Explore the full residency'}
                </EditorialCTA>
              </div>
            </>
          );
        })()}
      </EditorialSection>


      {/* Case Studies */}
      <EditorialSection tone="paper" id="case-studies" containerClassName="max-w-6xl">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <div className="flex items-baseline gap-6">
            <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none text-primary")}>04</span>
            <div>
              <p className={cn(editorialType.kicker, "text-primary")}>{isFr ? 'Notes de terrain' : 'Field notes'}</p>
              <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight mt-2")}>
                {isFr ? (<>Études <em className="italic font-light">de cas.</em></>) : (<>Case <em className="italic font-light">studies.</em></>)}
              </h2>
            </div>
          </div>
          <Link to="/case-studies" className={cn(editorialType.cta, "inline-flex items-center gap-1.5 border-b border-primary text-primary pb-1 hover:translate-x-0.5 transition-transform")}>
            {isFr ? 'Voir toutes' : 'View all'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <CaseStudiesSection />
      </EditorialSection>

      <Footer />
    </div>
  );
};

export default EventsAndRetreats;
