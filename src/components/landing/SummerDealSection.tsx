import { useRef, useState } from "react";
import { Check, Loader2, Clock, DollarSign, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    website: "",
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
      className="scroll-mt-24 relative overflow-hidden px-4 py-20 md:py-28 bg-[hsl(35_45%_96%)] text-foreground"
    >
      {/* Editorial texture */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[hsl(15_75%_55%)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[hsl(15_75%_55%)]/10 blur-3xl" />

      <div className="container relative mx-auto max-w-6xl">
        {/* Masthead */}
        <div className="mb-12 border-b border-current/20 pb-8">
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-5xl italic text-[hsl(15_75%_55%)] md:text-6xl">03</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] opacity-70">
              Chapter 03 · {t("summer_deal.section.eyebrow")}
            </span>
          </div>
          <h2 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            {t("summer_deal.section.title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
            {t("summer_deal.section.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Stat icon={<DollarSign className="h-4 w-4" />} label={t("summer_deal.section.price_label")} value="$8,500" />
            <Stat icon={<Clock className="h-4 w-4" />} label={t("summer_deal.section.duration_label")} value="14 days" />
            <Stat icon={<Target className="h-4 w-4" />} label={t("summer_deal.section.scope_label")} value="MVP" />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Includes / audience */}
          <div className="border border-current/15 bg-background/40 p-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">
              The Package
            </span>
            <h3 className="mt-2 font-serif text-2xl md:text-3xl">
              {t("summer_deal.section.includes_title")}
            </h3>
            <ul className="mt-6 space-y-3 text-base">
              {includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 border-b border-current/10 pb-3 last:border-b-0">
                  <span className="mt-1 font-serif text-sm text-[hsl(15_75%_55%)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="opacity-90">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-current/20 pt-6">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">
                {t("summer_deal.section.for_title")}
              </h4>
              <p className="mt-3 font-serif text-lg italic leading-relaxed">
                {t("summer_deal.section.for")}
              </p>
            </div>

            <div className="mt-6 border-l-2 border-[hsl(15_75%_55%)] bg-[hsl(15_75%_55%)]/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(15_75%_35%)]">
              {t("summer_deal.section.slots")}
            </div>
          </div>

          {/* Form */}
          <div className="border border-current/15 bg-background/60 p-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">
              Reservation
            </span>
            <h3 className="mt-2 font-serif text-2xl md:text-3xl">
              {t("summer_deal.section.form_title")}
            </h3>
            <p className="mt-2 text-sm opacity-70">{t("summer_deal.section.form_note")}</p>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="sd_name" className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">
                    {t("summer_deal.form.name")}
                  </Label>
                  <Input
                    id="sd_name"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-2 rounded-none border-0 border-b border-current/30 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-[hsl(15_75%_55%)]"
                  />
                </div>
                <div>
                  <Label htmlFor="sd_email" className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">
                    {t("summer_deal.form.email")}
                  </Label>
                  <Input
                    id="sd_email"
                    type="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 rounded-none border-0 border-b border-current/30 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-[hsl(15_75%_55%)]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sd_company" className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">
                  {t("summer_deal.form.company")}
                </Label>
                <Input
                  id="sd_company"
                  maxLength={200}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="mt-2 rounded-none border-0 border-b border-current/30 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-[hsl(15_75%_55%)]"
                />
              </div>

              <div>
                <Label htmlFor="sd_idea" className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">
                  {t("summer_deal.form.project_idea")}
                </Label>
                <Textarea
                  id="sd_idea"
                  required
                  rows={4}
                  maxLength={2000}
                  value={form.project_idea}
                  onChange={(e) => setForm({ ...form, project_idea: e.target.value })}
                  className="mt-2 rounded-none border border-current/30 bg-transparent focus-visible:ring-0 focus-visible:border-[hsl(15_75%_55%)]"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-none bg-foreground text-background font-semibold uppercase tracking-[0.2em] hover:bg-foreground/90 h-12"
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
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[hsl(15_75%_55%)]">{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-60">{label}</span>
      <span className="font-serif text-lg italic">{value}</span>
    </div>
  );
}
