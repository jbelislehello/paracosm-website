import { useRef, useState } from "react";
import { Check, Loader2, Sparkles, Clock, DollarSign, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SummerDealSection() {
  const { t, language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    project_idea: "",
    website: "", // honeypot
  });
  const startedAt = useRef<number>(Date.now());

  const includes: string[] = language === "fr"
    ? [
        "Appel de découverte + spécification MVP cadrée",
        "Système de design sur mesure aligné à votre marque",
        "Application web fonctionnelle (React + Supabase)",
        "Déploiement, domaine personnalisé et transfert",
        "1 semaine de support post-lancement et ajustements",
        "Enregistrements de sessions et documentation",
      ]
    : [
        "Discovery call + scoped MVP spec",
        "Custom design system aligned with your brand",
        "Working web app (React + Supabase, or Next-equivalent)",
        "Deployment, custom domain & handoff",
        "1 week of post-launch support & tweaks",
        "Session recordings & documentation",
      ];


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-summer-deal-lead", {
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          project_idea: form.project_idea.trim(),
          language,
          source: "landing_summer_deal",
          website: form.website,
          elapsedMs: Date.now() - startedAt.current,
        },
      });
      if (error) throw error;
      const payload = data as { success?: boolean; error?: string };
      if (payload?.success === false) throw new Error(payload.error || "Unknown error");
      toast.success(t("summer_deal.section.success"));
      setForm({ name: "", email: "", company: "", project_idea: "", website: "" });
    } catch (err) {
      toast.error(t("summer_deal.section.error"), {
        description: (err as Error).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="summer-deal"
      className="scroll-mt-24 px-4 py-16 md:py-24 bg-gradient-to-b from-[hsl(var(--bloom-ink))] via-[hsl(var(--bloom-ink))] to-[hsl(var(--bloom-ink)/0.95)] text-white relative overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[hsl(var(--bloom-magenta)/0.25)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[hsl(var(--bloom-amber)/0.2)] blur-3xl" />

      <div className="container relative mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <Badge className="mb-4 border-[hsl(var(--bloom-magenta)/0.5)] bg-[hsl(var(--bloom-magenta)/0.15)] font-vhs text-xs uppercase tracking-widest text-white">
            <Sparkles className="mr-1 h-3 w-3" />
            {t("summer_deal.section.eyebrow")}
          </Badge>
          <h2 className="mx-auto max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            {t("summer_deal.section.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
            {t("summer_deal.section.subtitle")}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Stat icon={<DollarSign className="h-4 w-4" />} label={t("summer_deal.section.price_label")} value="$8,500" />
            <Stat icon={<Clock className="h-4 w-4" />} label={t("summer_deal.section.duration_label")} value="14 days" />
            <Stat icon={<Target className="h-4 w-4" />} label={t("summer_deal.section.scope_label")} value="MVP" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Includes / audience */}
          <Card className="border-white/10 bg-white/[0.04] p-6 md:p-8 backdrop-blur">
            <h3 className="font-display text-xl text-white">{t("summer_deal.section.includes_title")}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/85">
              {includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-[hsl(var(--bloom-amber))]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-white/10 pt-5">
              <h4 className="font-display text-sm uppercase tracking-widest text-white/60">
                {t("summer_deal.section.for_title")}
              </h4>
              <p className="mt-2 text-sm text-white/75">{t("summer_deal.section.for")}</p>
            </div>

            <div className="mt-5 rounded-md border border-[hsl(var(--bloom-amber)/0.4)] bg-[hsl(var(--bloom-amber)/0.1)] px-3 py-2 text-xs font-vhs uppercase tracking-wider text-[hsl(var(--bloom-amber))]">
              {t("summer_deal.section.slots")}
            </div>
          </Card>

          {/* Form */}
          <Card className="border-fuchsia-400/30 bg-gradient-to-b from-fuchsia-500/10 to-rose-500/5 p-6 md:p-8 ring-1 ring-fuchsia-300/20 backdrop-blur">
            <h3 className="font-display text-xl text-white">{t("summer_deal.section.form_title")}</h3>
            <p className="mt-1 text-xs text-white/60">{t("summer_deal.section.form_note")}</p>

            <form onSubmit={submit} className="mt-5 space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="sd_name" className="text-white/80">{t("summer_deal.form.name")}</Label>
                  <Input
                    id="sd_name"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Label htmlFor="sd_email" className="text-white/80">{t("summer_deal.form.email")}</Label>
                  <Input
                    id="sd_email"
                    type="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sd_company" className="text-white/80">{t("summer_deal.form.company")}</Label>
                <Input
                  id="sd_company"
                  maxLength={200}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="mt-1 border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <Label htmlFor="sd_idea" className="text-white/80">{t("summer_deal.form.project_idea")}</Label>
                <Textarea
                  id="sd_idea"
                  required
                  rows={4}
                  maxLength={2000}
                  value={form.project_idea}
                  onChange={(e) => setForm({ ...form, project_idea: e.target.value })}
                  className="mt-1 border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-white font-semibold text-slate-900 hover:bg-white/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("summer_deal.form.submitting")}
                  </>
                ) : (
                  t("summer_deal.form.submit")
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
      <span className="text-[hsl(var(--bloom-amber))]">{icon}</span>
      <span className="text-white/60 text-xs uppercase tracking-wider">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
