import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Building, Calendar, CheckCircle, Mountain, Brain, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { eventSchema } from "@/lib/structuredData";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialCTA,
} from "@/components/editorial";
import { editorialType, editorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

const ParacosmRetreatLanding = () => {
  const { t, language } = useLanguage();
  const isFr = language === 'fr';
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  usePageSeo({
    title: isFr
      ? "Sommet Paracosm — Açores 2026 | Leadership, IA et intelligence relationnelle"
      : "Paracosm Summit — Azores 2026 | Leadership, AI & Relational Intelligence",
    description: isFr
      ? "Notre sommet phare 2026 aux Açores : une expérience immersive pour dirigeant·e·s et innovateur·rice·s intégrant la maîtrise des systèmes IA, la pratique somatique et la méthodologie Calm Magic."
      : "Our 2026 flagship summit in the Azores: an immersive experience for executives and innovators integrating AI systems mastery, somatic practice, and the Calm Magic methodology.",
    path: "/paracosm-retreat",
    jsonLd: [
      eventSchema({
        name: "Paracosm Summit — Azores 2026",
        description:
          "Flagship 2026 summit in the Azores integrating AI systems mastery, somatic practice, and the Calm Magic methodology.",
        url: "/paracosm-retreat",
        startDate: "2026-09-01",
        locationName: "Azores",
        locationAddress: { country: "PT" },
      }),
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error(isFr ? 'Veuillez remplir les deux champs.' : 'Please fill in both fields.');
      return;
    }
    const subject = encodeURIComponent(isFr ? "Sommet Paracosm — Demande d'invitation" : "Paracosm Summit — Invitation Request");
    const body = encodeURIComponent(
      isFr
        ? `Nouvelle demande d'invitation pour le Sommet Paracosm :\n\nNom : ${name}\nCourriel : ${email}`
        : `New invitation request for the Paracosm Summit:\n\nName: ${name}\nEmail: ${email}`,
    );
    window.location.href = `mailto:jbelisle@helloarchitekt.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    toast.success(isFr ? 'Vous avez été ajouté·e à la liste des invité·e·s !' : "You've been added to the invitation list!");
  };

  const highlights = [
    { icon: Mountain, title: t("retreat.highlights.immersive_storytelling"), description: t("retreat.highlights.immersive_storytelling_desc") },
    { icon: Brain, title: t("retreat.highlights.mathematical_creativity"), description: t("retreat.highlights.mathematical_creativity_desc") },
    { icon: Users, title: t("retreat.highlights.calm_magic_framework"), description: t("retreat.highlights.calm_magic_framework_desc") },
  ];

  const days = [{ key: "day_1" }, { key: "day_2" }, { key: "day_3" }];

  const warm = editorialTone.warm;
  const paper = editorialTone.paper;
  const clay = editorialTone.clay;
  const night = editorialTone.night;

  return (
    <div className="min-h-screen bg-[hsl(35_45%_96%)] text-foreground">
      <EditorialSiteHeader />

      <EditorialPageHero
        numeral="09"
        kicker={isFr ? "Volume 09 · Açores · Septembre 2026" : "Volume 09 · Azores · September 2026"}
        title={isFr ? (<>Sommet <em className="italic font-light">Paracosm.</em></>) : (<>Paracosm <em className="italic font-light">Summit.</em></>)}
        subtitle={t("retreat.section_description")}
        tone="warm"
      />

      {/* Coordinates */}
      <EditorialSection tone="warm">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-sm">
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 opacity-60" />
            <span className={cn(editorialType.kicker, warm.kicker)}>{t("retreat.location")}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Building className="w-4 h-4 opacity-60" />
            <span className={cn(editorialType.kicker, warm.kicker)}>{t("retreat.venue")}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Calendar className="w-4 h-4 opacity-60" />
            <span className={cn(editorialType.kicker, warm.kicker)}>{t("retreat.date")}</span>
          </span>
        </div>
      </EditorialSection>

      {/* Highlights */}
      <EditorialSection tone="paper" id="highlights">
        <div className="flex items-baseline gap-6 mb-10">
          <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", paper.numeral)}>01</span>
          <p className={cn(editorialType.kicker, paper.kicker)}>{isFr ? 'Trois fils' : 'Three threads'}</p>
        </div>
        <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight max-w-3xl mb-12")}>
          {isFr ? (<>Ce que ce sommet <em className="italic font-light">tisse.</em></>) : (<>What this summit <em className="italic font-light">weaves.</em></>)}
        </h2>
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {highlights.map((h, i) => (
            <div key={i} className="border-t border-foreground/20 pt-6">
              <h.icon className="w-6 h-6 mb-4 opacity-70" />
              <h3 className={cn(editorialType.serif, "text-xl md:text-2xl leading-tight mb-3")}>{h.title}</h3>
              <p className="text-sm md:text-base opacity-80 leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </EditorialSection>

      {/* Itinerary */}
      <EditorialSection tone="clay" id="itinerary">
        <div className="flex items-baseline gap-6 mb-10">
          <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", clay.numeral)}>02</span>
          <p className={cn(editorialType.kicker, clay.kicker)}>{isFr ? 'Itinéraire' : 'Itinerary'}</p>
        </div>
        <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight max-w-3xl mb-12")}>
          {isFr ? (<>Un <em className="italic font-light">voyage</em> de trois jours.</>) : (<>A three-day <em className="italic font-light">journey.</em></>)}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {days.map((day, i) => (
            <article key={day.key} className="border-t border-foreground/25 pt-6">
              <p className={cn(editorialType.kicker, clay.kicker, "mb-2")}>{isFr ? `Jour 0${i + 1}` : `Day 0${i + 1}`}</p>
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight mb-2")}>{t(`retreat.${day.key}.title`)}</h3>
              <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-4">{t(`retreat.${day.key}.subtitle`)}</p>
              <p className="text-sm md:text-base opacity-85 leading-relaxed mb-6">{t(`retreat.${day.key}.description`)}</p>
              <p className={cn(editorialType.kicker, "opacity-60 mb-2")}>{t("retreat.activities_label")}</p>
              <ul className="space-y-1.5">
                {[0, 1, 2, 3].map((idx) => (
                  <li key={idx} className="text-sm opacity-80 flex gap-2">
                    <span className="opacity-50">—</span>
                    {t(`retreat.${day.key}.activities.${idx}`)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </EditorialSection>

      {/* Audience & Outcomes */}
      <EditorialSection tone="paper" id="audience">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <p className={cn(editorialType.kicker, paper.kicker, "mb-3")}>{isFr ? "Pour qui" : "Who it's for"}</p>
            <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight mb-4")}>{t("retreat.audience.title")}</h3>
            <p className="text-base opacity-80 leading-relaxed mb-6">{t("retreat.audience.description")}</p>
            <ul className="space-y-3">
              {[0, 1, 2].map((idx) => (
                <li key={idx} className="text-sm flex items-start gap-3 opacity-85">
                  <CheckCircle className="w-4 h-4 mt-1 opacity-70 flex-shrink-0" />
                  {t(`retreat.audience.points.${idx}`)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={cn(editorialType.kicker, paper.kicker, "mb-3")}>{isFr ? 'Ce que vous emportez' : 'What you leave with'}</p>
            <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight mb-4")}>{t("retreat.outcomes.title")}</h3>
            <p className="text-base opacity-80 leading-relaxed mb-6">{t("retreat.outcomes.description")}</p>
            <ul className="space-y-3">
              {[0, 1, 2].map((idx) => (
                <li key={idx} className="text-sm flex items-start gap-3 opacity-85">
                  <CheckCircle className="w-4 h-4 mt-1 opacity-70 flex-shrink-0" />
                  {t(`retreat.outcomes.points.${idx}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </EditorialSection>

      {/* Invitation */}
      <EditorialSection tone="night" id="rsvp" containerClassName="max-w-3xl">
        <div className="text-center">
          <p className={cn(editorialType.kicker, night.kicker, "mb-4")}>{isFr ? 'RSVP · Sur invitation' : 'RSVP · By invitation'}</p>
          <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight mb-4")}>
            {t("retreat.invitation.title")}
          </h2>
          <p className="text-base md:text-lg opacity-80 mb-10 max-w-xl mx-auto">{t("retreat.invitation.description")}</p>

          {submitted ? (
            <div className="py-8">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <p className={cn(editorialType.serif, "text-xl")}>{t("retreat.invitation.success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                placeholder={t("retreat.invitation.name_placeholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-foreground/30 h-12"
              />
              <Input
                type="email"
                placeholder={t("retreat.invitation.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-foreground/30 h-12"
              />
              <Button
                type="submit"
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 uppercase tracking-[0.2em] text-xs"
              >
                {t("retreat.invitation.submit")}
              </Button>
            </form>
          )}

          <div className="mt-10">
            <EditorialCTA
              href="https://app.reclaim.ai/m/jonathan-helloarchitekt"
              tone="night"
              variant="ghost"
            >
              {isFr ? 'Réserver une conversation privée' : 'Book a private conversation'}
            </EditorialCTA>
          </div>
        </div>
      </EditorialSection>

      <Footer />
    </div>
  );
};

export default ParacosmRetreatLanding;
