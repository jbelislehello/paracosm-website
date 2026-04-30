import { useEffect, useMemo, useRef, useState } from "react";
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
  Workflow,
  ScanSearch,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import transmediaMap from "@/assets/drift/transmediamap.jpg";
import gameplanImage from "@/assets/drift/JonathanBelisle-gameplan.jpg";

const pillars = [
  { icon: Heart, key: "relational" },
  { icon: Lightbulb, key: "imagination" },
  { icon: Sparkles, key: "ideation" },
  { icon: Compass, key: "existential" },
] as const;

const chapters = [1, 2, 3, 4, 5, 6, 7] as const;

const playbookIcons = {
  glitch: ScanSearch,
  drift: Workflow,
  tune: SlidersHorizontal,
} as const;

const authorWorkImages = [
  {
    src: transmediaMap,
    titleKey: "book.author_work_card_1_title",
    descKey: "book.author_work_card_1_desc",
  },
  {
    src: gameplanImage,
    titleKey: "book.author_work_card_2_title",
    descKey: "book.author_work_card_2_desc",
  },
] as const;

const BookLaunch = () => {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  usePageSeo({
    title: t("book.page_title"),
    description: "A new book on building Learning Organizations — combining AI systems mastery and relational intelligence. Reserve your copy.",
    path: "/book",
  });

  const formSchema = useMemo(
    () =>
      z.object({
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
      }),
    [t]
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "", tier: "reader" },
  });

  // Spam protection: honeypot field + min time-on-page
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formMountedAt = useRef<number>(Date.now());

  const playbooks = useMemo(
    () =>
      (["glitch", "drift", "tune"] as const).map((key) => ({
        key,
        icon: playbookIcons[key],
        items: [1, 2, 3].map((n) => t(`book.playbook_${key}_item_${n}`)),
      })),
    [t]
  );

  const comparisonRows = useMemo(
    () => [1, 2, 3, 4].map((n) => ({
      label: t(`book.compare_row_${n}_label`),
      left: t(`book.compare_row_${n}_left`),
      right: t(`book.compare_row_${n}_right`),
    })),
    [t]
  );

  const onSubmit = async (values: FormValues) => {
    // Honeypot: silently drop bot submissions
    if (honeypotRef.current?.value) {
      setSubmitted(true);
      form.reset();
      return;
    }
    // Min time-on-page: humans take >2s to fill form
    if (Date.now() - formMountedAt.current < 2000) {
      setSubmitted(true);
      form.reset();
      return;
    }

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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="fixed z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="h-8 w-8 rounded-lg bg-white p-1 object-contain"
              loading="eager"
            />
            <span className="text-sm font-bold">Paracosm</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" /> {t("book.nav_book")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden px-6 py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15),_transparent_50%)]" />
          <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-rose-600/20 blur-3xl" />

          <div className="relative container mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <Badge className="mb-4 border-white/20 bg-white/10 text-white hover:bg-white/15">
                <Sparkles className="mr-1 h-3 w-3" />
                {t("book.hero_eyebrow")}
              </Badge>
              <h1 className="mb-4 bg-gradient-to-br from-white via-fuchsia-100 to-rose-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                {t("book.hero_title")}
              </h1>
              <p className="mb-6 text-xl font-light text-fuchsia-100/90 md:text-2xl">
                {t("book.hero_subtitle")}
              </p>
              <p className="mb-8 text-base leading-relaxed text-white/70">
                {t("book.hero_description")}
              </p>

              <div className="mb-8 flex flex-wrap gap-3">
                <a href="#waitlist">
                  <Button size="lg" className="gap-2 bg-white font-semibold text-slate-900 hover:bg-white/90">
                    <BookOpen className="h-4 w-4" />
                    {t("book.hero_cta_primary")}
                  </Button>
                </a>
                <a href="#why-now">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    {t("book.hero_cta_secondary")}
                    <ArrowRight className="h-4 w-4" />
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

            <div className="flex justify-center md:justify-end [perspective:1000px]">
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
                  className="w-64 rounded-r-md border-l-4 border-l-slate-800 shadow-[0_50px_100px_-20px_rgba(168,85,247,0.5)] md:w-80"
                  loading="eager"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-r-md"
                  style={{
                    background:
                      "linear-gradient(105deg, rgba(255,255,255,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 px-6 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.thesis_eyebrow")}
              </Badge>
              <h2 className="mb-4 text-3xl font-bold md:text-5xl">{t("book.thesis_title")}</h2>
              <p className="mx-auto max-w-2xl text-base text-white/60 md:text-lg">
                {t("book.thesis_description")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(({ icon: Icon, key }) => (
                <Card key={key} className="border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-rose-500/30">
                      <Icon className="h-6 w-6 text-fuchsia-200" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">{t(`book.pillar_${key}_title`)}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{t(`book.pillar_${key}_desc`)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="why-now" className="px-6 py-20">
          <div className="container mx-auto max-w-3xl">
            <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
              {t("book.why_now_eyebrow")}
            </Badge>
            <h2 className="mb-8 text-3xl font-bold leading-tight md:text-5xl">{t("book.why_now_title")}</h2>
            <div className="space-y-5 text-base leading-relaxed text-white/75 md:text-lg">
              <p>{t("book.why_now_p1")}</p>
              <p>{t("book.why_now_p2")}</p>
              <p className="font-medium text-white/90">{t("book.why_now_p3")}</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 px-6 py-20">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.chapters_eyebrow")}
              </Badge>
              <h2 className="mb-4 text-3xl font-bold md:text-5xl">{t("book.chapters_title")}</h2>
              <p className="mx-auto max-w-2xl text-base text-white/60">{t("book.chapters_description")}</p>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {chapters.map((n) => (
                <AccordionItem
                  key={n}
                  value={`ch-${n}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-4"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center gap-4 text-left">
                      <span className="w-12 text-xs font-mono text-fuchsia-300">0{n}</span>
                      <Badge variant="secondary" className="border-0 bg-fuchsia-500/20 font-mono text-[10px] text-fuchsia-200">
                        {t(`book.chapter_${n}_phase`)}
                      </Badge>
                      <span className="font-semibold text-white">{t(`book.chapter_${n}_title`)}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pl-16 leading-relaxed text-white/70">
                    {t(`book.chapter_${n}_desc`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.playbooks_eyebrow")}
              </Badge>
              <h2 className="mb-4 text-3xl font-bold md:text-5xl">{t("book.playbooks_title")}</h2>
              <p className="mx-auto max-w-3xl text-base text-white/60">{t("book.playbooks_description")}</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {playbooks.map(({ key, icon: Icon, items }) => (
                <Card key={key} className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                        {t(`book.playbook_${key}_label`)}
                      </Badge>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                        <Icon className="h-5 w-5 text-fuchsia-200" />
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">{t(`book.playbook_${key}_title`)}</h3>
                    <p className="mb-5 text-sm leading-relaxed text-white/65">{t(`book.playbook_${key}_desc`)}</p>
                    <ul className="space-y-3 text-sm text-white/80">
                      {items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.bridge_eyebrow")}
              </Badge>
              <h2 className="mb-4 text-3xl font-bold md:text-5xl">{t("book.bridge_title")}</h2>
              <p className="mx-auto max-w-2xl text-base text-white/60">{t("book.bridge_description")}</p>
            </div>

            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
              <Card className="border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-900/40 to-slate-900/40">
                <CardContent className="p-6">
                  <div className="mb-2 text-xs uppercase tracking-wider text-fuchsia-300">{t("book.bridge_left_label")}</div>
                  <h3 className="mb-3 text-2xl font-bold text-white">{t("book.bridge_left_title")}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{t("book.bridge_left_desc")}</p>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-2 text-fuchsia-300 md:flex-col">
                <ArrowRight className="hidden h-8 w-8 md:block" />
                <ArrowRight className="h-6 w-6 md:hidden" />
              </div>

              <Card className="border-rose-500/30 bg-gradient-to-br from-rose-900/40 to-slate-900/40">
                <CardContent className="p-6">
                  <div className="mb-2 text-xs uppercase tracking-wider text-rose-300">{t("book.bridge_right_label")}</div>
                  <h3 className="mb-3 text-2xl font-bold text-white">{t("book.bridge_right_title")}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{t("book.bridge_right_desc")}</p>
                </CardContent>
              </Card>
            </div>

            <p className="mt-8 text-center font-mono text-sm text-white/50">{t("book.bridge_arrow")}</p>
          </div>
        </section>

        <section className="bg-slate-900/50 px-6 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.compare_eyebrow")}
              </Badge>
              <h2 className="text-3xl font-bold md:text-4xl">{t("book.compare_title")}</h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-white/10 bg-white/5 text-sm font-semibold text-white">
                <div className="p-4 text-white/50">&nbsp;</div>
                <div className="p-4">{t("book.compare_left_title")}</div>
                <div className="border-l border-white/10 p-4">{t("book.compare_right_title")}</div>
              </div>
              {comparisonRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-white/10 last:border-b-0">
                  <div className="p-4 text-sm font-medium text-white/70">{row.label}</div>
                  <div className="p-4 text-sm leading-relaxed text-white/55">{row.left}</div>
                  <div className="border-l border-white/10 p-4 text-sm leading-relaxed text-white/85">{row.right}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 px-6 py-20">
          <div className="container mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
              {t("book.author_eyebrow")}
            </Badge>
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">{t("book.author_name")}</h2>
            <p className="mb-6 text-fuchsia-300">{t("book.author_role")}</p>
            <p className="leading-relaxed text-white/70">{t("book.author_bio")}</p>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.author_work_eyebrow")}
              </Badge>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("book.author_work_title")}</h2>
              <p className="mx-auto max-w-3xl text-base text-white/60">{t("book.author_work_description")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {authorWorkImages.map((image, index) => (
                <Card key={image.titleKey} className="overflow-hidden border-white/10 bg-white/5">
                  <img
                    src={image.src}
                    alt={t(image.titleKey)}
                    className="aspect-[16/10] w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <CardContent className="p-5">
                    <h3 className="mb-2 text-xl font-semibold text-white">{t(image.titleKey)}</h3>
                    <p className="text-sm leading-relaxed text-white/65">{t(image.descKey)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="mt-5 text-center text-sm text-white/45">{t("book.author_work_card_note")}</p>
          </div>
        </section>

        <section id="waitlist" className="px-6 py-20">
          <div className="container mx-auto max-w-xl">
            <div className="mb-8 text-center">
              <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
                {t("book.form_eyebrow")}
              </Badge>
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t("book.form_title")}</h2>
              <p className="text-sm text-white/60">{t("book.form_description")}</p>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <div className="py-6 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
                    <h3 className="mb-2 text-xl font-bold">{t("book.form_success_title")}</h3>
                    <p className="text-sm text-white/70">{t("book.form_success_desc")}</p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Honeypot field — hidden from humans, bots will fill it */}
                      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
                        <label htmlFor="website_url">Leave this field empty</label>
                        <input
                          ref={honeypotRef}
                          id="website_url"
                          name="website_url"
                          type="text"
                          autoComplete="off"
                          tabIndex={-1}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">{t("book.form_name_label")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("book.form_name_placeholder")}
                                className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
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
                            <FormLabel className="text-white/80">{t("book.form_email_label")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder={t("book.form_email_placeholder")}
                                className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
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
                            <FormLabel className="text-white/80">{t("book.form_role_label")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("book.form_role_placeholder")}
                                className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
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
                            <FormLabel className="text-white/80">{t("book.form_tier_label")}</FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                              {(["reader", "practitioner", "org"] as const).map((tier) => (
                                <button
                                  key={tier}
                                  type="button"
                                  onClick={() => field.onChange(tier)}
                                  className={`rounded-md border p-3 text-xs transition-all ${
                                    field.value === tier
                                      ? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
                                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                                  }`}
                                >
                                  {t(`book.form_tier_${tier}`)}
                                </button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="w-full gap-2 bg-white font-semibold text-slate-900 hover:bg-white/90"
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t("book.form_submitting")}
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4" />
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

        <section className="bg-slate-900/50 px-6 py-16">
          <div className="container mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-3 border-white/20 text-white/70">
              {t("book.endorsements_eyebrow")}
            </Badge>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">{t("book.endorsements_title")}</h2>
            <p className="text-sm italic text-white/50">{t("book.endorsements_placeholder")}</p>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">{t("book.faq_title")}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {[1, 2, 3, 4].map((n) => (
                <AccordionItem
                  key={n}
                  value={`faq-${n}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-4"
                >
                  <AccordionTrigger className="text-left text-white hover:no-underline">
                    {t(`book.faq_q${n}`)}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-white/70">
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
