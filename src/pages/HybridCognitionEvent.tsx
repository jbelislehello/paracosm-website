import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

const EVENT_DATE_ISO = "2026-07-24";

export default function HybridCognitionEvent() {
  const { language, t } = useLanguage();
  const isFr = language === "fr";
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const copy = isFr
    ? {
        tag: "Événement gratuit · 24 juillet 2026",
        title1: "Une journée pour activer votre",
        titleAccent: "cognition hybride",
        subtitle:
          "Un espace vivant pour entrepreneurs et créatifs qui veulent penser, créer et décider avec l'IA — sans perdre leur voix.",
        bullets: [
          "Pourquoi vos prompts ne suffisent pas (et ce qui les remplace)",
          "Comment construire un contexte que vos agents peuvent lire et utiliser",
          "Démo live du Calm Magic Board — votre second cerveau relationnel",
        ],
        reserve: "Réservez votre place",
        details: "En ligne · 12h–15h (HE) · Gratuit",
        first_name: "Prénom",
        email: "Email",
        phone: "Téléphone (optionnel)",
        submit: "S'inscrire gratuitement",
        submitting: "Inscription…",
        consent:
          "J'accepte de recevoir les informations de l'événement et les emails de Paracosm. Désinscription en 1 clic à tout moment.",
        replay:
          "Inscrivez-vous pour recevoir le replay si vous ne pouvez pas être là en direct.",
        success_title: "Vous êtes inscrit·e ✨",
        success_body:
          "Un email de confirmation arrivera bientôt. On se retrouve le 24 juillet 2026.",
        back: "Retour à l'accueil",
        host: "Par Jean-François Bélisle · Paracosm",
        host_sub: "Guide en intelligence relationnelle & hybride",
      }
    : {
        tag: "Free event · July 24, 2026",
        title1: "One day to activate your",
        titleAccent: "hybrid cognition",
        subtitle:
          "A living space for entrepreneurs and creatives who want to think, build and decide with AI — without losing their voice.",
        bullets: [
          "Why prompts alone don't work (and what replaces them)",
          "How to build a context your agents can read and use",
          "Live demo of the Calm Magic Board — your relational second brain",
        ],
        reserve: "Reserve your seat",
        details: "Online · 12–3 PM (ET) · Free",
        first_name: "First name",
        email: "Email",
        phone: "Phone (optional)",
        submit: "Sign up for free",
        submitting: "Signing up…",
        consent:
          "I agree to receive event info and emails from Paracosm. One-click unsubscribe anytime.",
        replay: "Sign up to receive the replay if you can't attend live.",
        success_title: "You're in ✨",
        success_body:
          "A confirmation will land in your inbox. See you on July 24, 2026.",
        back: "Back to home",
        host: "Hosted by Jean-François Bélisle · Paracosm",
        host_sub: "Guide in relational & hybrid intelligence",
      };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!firstName.trim() || !email.trim()) {
      toast.error(isFr ? "Nom et email requis" : "Name and email required");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("hybrid_cognition_signups")
        .insert({
          first_name: firstName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          language: isFr ? "fr" : "en",
          consent,
          source: "landing_page",
        });
      if (error) throw error;
      trackEvent("hybrid_cognition_signup", { language: isFr ? "fr" : "en" });
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      toast.error(
        isFr
          ? "Une erreur est survenue. Réessayez."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900">
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> {copy.back}
        </Link>
      </div>

      <div className="container mx-auto grid gap-10 px-4 pb-20 pt-6 lg:grid-cols-2 lg:gap-16">
        {/* Left: content */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            {copy.tag}
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            {copy.title1}
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
              {copy.titleAccent}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            {copy.subtitle}
          </p>

          <ul className="mt-8 space-y-3">
            {copy.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-indigo-600" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{copy.host}</p>
              <p className="text-sm text-slate-600">{copy.host_sub}</p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:pl-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-100/50 sm:p-8">
            {submitted ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold">{copy.success_title}</h2>
                <p className="mt-3 text-slate-600">{copy.success_body}</p>
                <time
                  className="mt-6 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  dateTime={EVENT_DATE_ISO}
                >
                  24.07.2026
                </time>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900">
                  {copy.reserve}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{copy.details}</p>
                <form onSubmit={onSubmit} className="mt-6 space-y-3">
                  <input
                    type="text"
                    required
                    maxLength={120}
                    placeholder={copy.first_name}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  />
                  <input
                    type="email"
                    required
                    maxLength={254}
                    placeholder={copy.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  />
                  <input
                    type="tel"
                    maxLength={40}
                    placeholder={copy.phone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-base font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60"
                  >
                    {submitting ? copy.submitting : copy.submit}
                  </button>
                  <label className="mt-3 flex items-start gap-2 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{copy.consent}</span>
                  </label>
                  <p className="pt-2 text-center text-xs text-slate-400">
                    {copy.replay}
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
