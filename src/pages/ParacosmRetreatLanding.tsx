import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mountain, Brain, Users, Sparkles, MapPin, Building, Calendar, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { drawCards, suitGradients, suitColors, TarotCard, MajorArcanaCard, MinorArcanaCard } from "@/data/entrepreneurialTarot";
import { usePageSeo } from "@/hooks/usePageSeo";
import { eventSchema, breadcrumbSchema } from "@/lib/structuredData";

// ─── Mini Tarot Preview for Retreat ───
const TarotPreviewSection = ({ t }: { t: (key: string) => string }) => {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const labels = [t("retreat.tarot.past_label"), t("retreat.tarot.present_label"), t("retreat.tarot.future_label")];

  const handleDraw = useCallback(() => {
    setCards(drawCards(3));
    setFlipped(new Set());
  }, []);

  const flipCard = (idx: number) => {
    setFlipped((prev) => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  };

  return (
    <section className="pb-16 px-4">
      <div className="container max-w-5xl mx-auto text-center">
        <Sparkles className="w-7 h-7 text-amber-500 mx-auto mb-3" />
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("retreat.tarot.title")}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
          {t("retreat.tarot.description")}
        </p>

        {cards.length === 0 ? (
          <Button onClick={handleDraw} className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-amber-600 hover:to-purple-600 text-white">
            {t("retreat.tarot.draw_prompt")}
          </Button>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {cards.map((card, idx) => {
              const isMajor = card.arcana === 'major';
              const gradient = isMajor ? suitGradients[(card as MajorArcanaCard).suit] : 'from-slate-600 to-slate-800';
              return (
                <div key={card.id + idx} className="flex flex-col items-center gap-1">
                  <p className="text-[10px] text-slate-500 font-medium">{labels[idx]}</p>
                  <div
                    className="w-36 h-52 cursor-pointer"
                    style={{ perspective: '800px' }}
                    onClick={() => flipCard(idx)}
                  >
                    <div
                      className="relative w-full h-full transition-transform duration-700"
                      style={{ transformStyle: 'preserve-3d', transform: flipped.has(idx) ? 'rotateY(180deg)' : '' }}
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                        <Sparkles className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${gradient} p-3 text-white flex flex-col justify-between`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <div>
                          <p className="text-2xl font-bold">{isMajor ? (card as MajorArcanaCard).letter : (card as MinorArcanaCard).dimension}</p>
                          <p className="text-[10px] font-semibold">{card.name}</p>
                        </div>
                        <p className="text-[8px] italic opacity-90 leading-snug">"{card.question}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Link to="/tarot">
          <Button variant="outline" className="mt-4 border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            {t("retreat.tarot.explore_deck")} →
          </Button>
        </Link>
      </div>
    </section>
  );
};

const ParacosmRetreatLanding = () => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  usePageSeo({
    title: "Paracosm Retreat — Azores 2026 | Leadership, AI & Relational Intelligence",
    description: "Our 2026 flagship retreat in the Azores: an immersive experience for executives and innovators integrating AI systems mastery, somatic practice, and the Calm Magic methodology.",
    path: "/paracosm-retreat",
    jsonLd: [
      eventSchema({
        name: "Paracosm Retreat — Azores 2026",
        description:
          "Flagship 2026 retreat in the Azores integrating AI systems mastery, somatic practice, and the Calm Magic methodology for executives and innovators.",
        url: "/paracosm-retreat",
        startDate: "2026-09-01",
        locationName: "Azores",
        locationAddress: { country: "PT" },
      }),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Paracosm Retreat", path: "/paracosm-retreat" },
      ]),
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }

    const subject = encodeURIComponent("Paracosm Retreat - Invitation Request");
    const body = encodeURIComponent(
      `New invitation request for the Paracosm Retreat:\n\nName: ${name}\nEmail: ${email}`
    );
    window.location.href = `mailto:jbelisle@helloarchitekt.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
    toast.success("You've been added to the invitation list!");
  };

  const highlights = [
    {
      icon: Mountain,
      title: t("retreat.highlights.immersive_storytelling"),
      description: t("retreat.highlights.immersive_storytelling_desc"),
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Brain,
      title: t("retreat.highlights.mathematical_creativity"),
      description: t("retreat.highlights.mathematical_creativity_desc"),
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Users,
      title: t("retreat.highlights.calm_magic_framework"),
      description: t("retreat.highlights.calm_magic_framework_desc"),
      color: "from-purple-500 to-rose-600",
    },
  ];

  const days = [
    { key: "day_1", color: "from-green-500 to-emerald-600" },
    { key: "day_2", color: "from-blue-500 to-purple-600" },
    { key: "day_3", color: "from-purple-500 to-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-purple-100 dark:border-purple-900/30">
        <div className="container flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Paracosm
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 text-center">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              {t("retreat.section_title")}
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            {t("retreat.section_description")}
          </p>

          {/* Location / Venue / Date */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-700 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-600" />
              {t("retreat.location")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building className="w-4 h-4 text-purple-600" />
              {t("retreat.venue")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" />
              {t("retreat.date")}
            </span>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="pb-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <Card key={i} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="text-center pb-3">
                  <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-r ${h.color} flex items-center justify-center mb-3`}>
                    <h.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-lg">{h.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300 text-center">{h.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Day Journey */}
      <section className="pb-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">3-Day Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {days.map((day, i) => (
              <div key={day.key} className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-6 shadow-md">
                <div className={`w-10 h-10 bg-gradient-to-r ${day.color} rounded-full flex items-center justify-center mb-3`}>
                  <span className="text-white font-bold">{i + 1}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{t(`retreat.${day.key}.title`)}</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-2">{t(`retreat.${day.key}.subtitle`)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{t(`retreat.${day.key}.description`)}</p>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{t("retreat.activities_label")}</h4>
                <ul className="space-y-1">
                  {[0, 1, 2, 3].map((idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-purple-500 mt-0.5">•</span>
                      {t(`retreat.${day.key}.activities.${idx}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entrepreneurial Tarot Section */}
      <TarotPreviewSection t={t} />

      {/* Audience & Outcomes */}
      <section className="pb-16 px-4">
        <div className="container max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold mb-2">{t("retreat.audience.title")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{t("retreat.audience.description")}</p>
            <ul className="space-y-2">
              {[0, 1, 2].map((idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {t(`retreat.audience.points.${idx}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold mb-2">{t("retreat.outcomes.title")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{t("retreat.outcomes.description")}</p>
            <ul className="space-y-2">
              {[0, 1, 2].map((idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  {t(`retreat.outcomes.points.${idx}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Invitation Form */}
      <section className="pb-24 px-4">
        <div className="container max-w-lg mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold text-center mb-2">{t("retreat.invitation.title")}</h2>
            <p className="text-sm text-center text-slate-600 dark:text-slate-300 mb-6">{t("retreat.invitation.description")}</p>

            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="font-semibold text-lg">{t("retreat.invitation.success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder={t("retreat.invitation.name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder={t("retreat.invitation.email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white">
                  {t("retreat.invitation.submit")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ParacosmRetreatLanding;
