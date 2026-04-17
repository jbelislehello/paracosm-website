import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Heart,
  Sparkles,
  Lightbulb,
  Compass,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import bookCover from "@/assets/calm-magic-book-cover.jpg";
import logoParacosm from "@/assets/logo-paracosm.jpeg";

const pillars = [
  { icon: Heart, key: "relational" },
  { icon: Lightbulb, key: "imagination" },
  { icon: Sparkles, key: "ideation" },
  { icon: Compass, key: "existential" },
] as const;

const chapters = [1, 2, 3, 4, 5, 6, 7] as const;

const BookLaunch = () => {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = t("book.page_title");
  }, [t]);

  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t("book.form_name_required") })
      .max(100),
    email: z
      .string()
      .trim()
      .email({ message: t("book.form_invalid_email") })
      .max(255),
    role: z.string().trim().max(100).optional(),
    tier: z.enum(["reader", "practitioner", "org"]),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "", tier: "reader" },
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("book_preorders").insert({
      name: values.name,
      email: values.email,
      role: values.role || null,
      tier: values.tier,
      language,
      source: "book_launch_page",
    });

    if (error) {
      console.error(error);
      toast.error(t("book.form_error_title"), {
        description: t("book.form_error_desc"),
      });
      return;
    }

    setSubmitted(true);
    toast.success(t("book.form_success_title"), {
      description: t("book.form_success_desc"),
    });
    form.reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="bg-white rounded-lg p-1 w-8 h-8 object-contain"
            />
            <span className="font-bold text-sm">Paracosm</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> {t("book.nav_book")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* HERO */}
        <section className="relative overflow-hidden py-20 md:py-32 px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15),_transparent_50%)]" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />

          <div className="relative container max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/15">
                <Sparkles className="w-3 h-3 mr-1" />
                {t("book.hero_eyebrow")}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-br from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
                {t("book.hero_title")}
              </h1>
              <p className="text-xl md:text-2xl font-light text-purple-100/90 mb-6">
                {t("book.hero_subtitle")}
              </p>
              <p className="text-base text-white/70 mb-8 leading-relaxed">
                {t("book.hero_description")}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <a href="#waitlist">
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-white/90 font-semibold gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    {t("book.hero_cta_primary")}
                  </Button>
                </a>
                <a href="#why-now">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent gap-2"
                  >
                    {t("book.hero_cta_secondary")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
                <span>{t("book.hero_meta_format")}</span>
                <span>·</span>
                <span>{t("book.hero_meta_pages")}</span>
                <span>·</span>
                <span>{t("book.hero_meta_release")}</span>
              </div>
            </div>

            {/* Book cover with 3D tilt */}
            <div className="flex justify-center md:justify-end perspective-1000">
              <div
                className="relative transform-gpu transition-transform duration-700 hover:rotate-y-0"
                style={{
                  transform: "rotateY(-18deg) rotateX(4deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  src={bookCover}
                  alt={t("book.hero_title")}
                  className="w-64 md:w-80 rounded-r-md shadow-[0_50px_100px_-20px_rgba(168,85,247,0.5)] border-l-4 border-l-slate-800"
                />
                <div
                  className="absolute inset-0 rounded-r-md pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, rgba(255,255,255,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* THESIS — 4 PILLARS */}
        <section className="py-20 px-6 bg-slate-900/50">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.thesis_eyebrow")}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("book.thesis_title")}
              </h2>
              <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">
                {t("book.thesis_description")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pillars.map(({ icon: Icon, key }) => (
                <Card
                  key={key}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-purple-200" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">
                      {t(`book.pillar_${key}_title`)}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {t(`book.pillar_${key}_desc`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* WHY NOW */}
        <section id="why-now" className="py-20 px-6">
          <div className="container max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
              {t("book.why_now_eyebrow")}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              {t("book.why_now_title")}
            </h2>
            <div className="space-y-5 text-base md:text-lg text-white/75 leading-relaxed">
              <p>{t("book.why_now_p1")}</p>
              <p>{t("book.why_now_p2")}</p>
              <p className="text-white/90 font-medium">{t("book.why_now_p3")}</p>
            </div>
          </div>
        </section>

        {/* CHAPTERS */}
        <section className="py-20 px-6 bg-slate-900/50">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.chapters_eyebrow")}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("book.chapters_title")}
              </h2>
              <p className="text-base text-white/60 max-w-2xl mx-auto">
                {t("book.chapters_description")}
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {chapters.map((n) => (
                <AccordionItem
                  key={n}
                  value={`ch-${n}`}
                  className="bg-white/5 border-white/10 rounded-lg px-4 border"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <span className="text-xs font-mono text-purple-300 w-12">
                        0{n}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-200 border-0 font-mono text-[10px]"
                      >
                        {t(`book.chapter_${n}_phase`)}
                      </Badge>
                      <span className="font-semibold text-white">
                        {t(`book.chapter_${n}_title`)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 pb-4 pl-16 leading-relaxed">
                    {t(`book.chapter_${n}_desc`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* BRIDGE: Calm Magic → Crewdle.ai */}
        <section className="py-20 px-6">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.bridge_eyebrow")}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("book.bridge_title")}
              </h2>
              <p className="text-base text-white/60 max-w-2xl mx-auto">
                {t("book.bridge_description")}
              </p>
            </div>

            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              <Card className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">
                    {t("book.bridge_left_label")}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {t("book.bridge_left_title")}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {t("book.bridge_left_desc")}
                  </p>
                </CardContent>
              </Card>

              <div className="flex md:flex-col items-center justify-center gap-2 text-purple-300">
                <ArrowRight className="w-8 h-8 md:rotate-0 hidden md:block" />
                <ArrowRight className="w-6 h-6 md:hidden" />
              </div>

              <Card className="bg-gradient-to-br from-pink-900/40 to-slate-900/40 border-pink-500/30">
                <CardContent className="p-6">
                  <div className="text-xs uppercase tracking-wider text-pink-300 mb-2">
                    {t("book.bridge_right_label")}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {t("book.bridge_right_title")}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {t("book.bridge_right_desc")}
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="text-center mt-8 text-sm text-white/50 font-mono">
              {t("book.bridge_arrow")}
            </p>
          </div>
        </section>

        {/* AUTHOR */}
        <section className="py-20 px-6 bg-slate-900/50">
          <div className="container max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
              {t("book.author_eyebrow")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {t("book.author_name")}
            </h2>
            <p className="text-purple-300 mb-6">{t("book.author_role")}</p>
            <p className="text-white/70 leading-relaxed">{t("book.author_bio")}</p>
          </div>
        </section>

        {/* WAITLIST FORM */}
        <section id="waitlist" className="py-20 px-6">
          <div className="container max-w-xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.form_eyebrow")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {t("book.form_title")}
              </h2>
              <p className="text-white/60 text-sm">{t("book.form_description")}</p>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      {t("book.form_success_title")}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {t("book.form_success_desc")}
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">
                              {t("book.form_name_label")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("book.form_name_placeholder")}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">
                              {t("book.form_email_label")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder={t("book.form_email_placeholder")}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">
                              {t("book.form_role_label")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("book.form_role_placeholder")}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">
                              {t("book.form_tier_label")}
                            </FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                              {(["reader", "practitioner", "org"] as const).map(
                                (tier) => (
                                  <button
                                    key={tier}
                                    type="button"
                                    onClick={() => field.onChange(tier)}
                                    className={`text-xs p-3 rounded-md border transition-all ${
                                      field.value === tier
                                        ? "border-purple-400 bg-purple-500/20 text-white"
                                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                                    }`}
                                  >
                                    {t(`book.form_tier_${tier}`)}
                                  </button>
                                )
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="w-full bg-white text-slate-900 hover:bg-white/90 font-semibold gap-2"
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t("book.form_submitting")}
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4" />
                            {t("book.form_submit")}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ENDORSEMENTS PLACEHOLDER */}
        <section className="py-16 px-6 bg-slate-900/50">
          <div className="container max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
              {t("book.endorsements_eyebrow")}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("book.endorsements_title")}
            </h2>
            <p className="text-white/50 italic text-sm">
              {t("book.endorsements_placeholder")}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              {t("book.faq_title")}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {[1, 2, 3, 4].map((n) => (
                <AccordionItem
                  key={n}
                  value={`faq-${n}`}
                  className="bg-white/5 border-white/10 rounded-lg px-4 border"
                >
                  <AccordionTrigger className="hover:no-underline text-left text-white">
                    {t(`book.faq_q${n}`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 leading-relaxed">
                    {t(`book.faq_a${n}`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookLaunch;
