import { useMemo, useRef, useState } from "react";
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
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";

import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import bookCoverAsset from "@/assets/calm-magic-cover-v2.jpeg.asset.json";
const bookCover = bookCoverAsset.url;
import LivingManuscriptBand from "@/components/book/LivingManuscriptBand";
import BookChapterIndex from "@/components/book/BookChapterIndex";
import BookOfferTiers from "@/components/book/BookOfferTiers";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import transmediaMap from "@/assets/drift/transmediamap.jpg";
import gameplanImage from "@/assets/drift/JonathanBelisle-gameplan.jpg";
import { usePageSeo } from "@/hooks/usePageSeo";
import { bookSchema } from "@/lib/structuredData";
import {
  EditorialSection,
  EditorialCTA,
} from "@/components/editorial";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

const pillars = [
  { icon: Heart, key: "relational" },
  { icon: Lightbulb, key: "imagination" },
  { icon: Sparkles, key: "ideation" },
  { icon: Compass, key: "existential" },
] as const;

const chapters = [1, 2, 3, 4, 5, 6, 7, 8] as const;

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
    jsonLd: [
      bookSchema({
        name: "Building Learning Organizations",
        description:
          "A new book on building Learning Organizations — combining AI systems mastery and relational intelligence.",
        url: "/book",
        inLanguage: language === "fr" ? "fr" : "en",
      }),
    ],
  });

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, { message: t("book.form_name_required") }).max(100),
        email: z.string().trim().email({ message: t("book.form_invalid_email") }).max(255),
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
    if (honeypotRef.current?.value) {
      setSubmitted(true);
      form.reset();
      return;
    }
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

  const warm = editorialTone.warm;
  const paper = editorialTone.paper;
  const clay = editorialTone.clay;
  const night = editorialTone.night;

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(35_45%_96%)] text-foreground">
      <EditorialSiteHeader />

      <main className="flex-1">

        {/* Editorial hero */}
        <section className={cn("relative overflow-hidden px-6 pt-20 pb-24 md:pt-32 md:pb-32 border-b border-current/10", warm.section)}>
          <div className="container mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="flex items-baseline gap-6 mb-8">
                <span className={cn(editorialType.serif, "text-5xl md:text-7xl leading-none", warm.numeral)}>01</span>
                <p className={cn(editorialType.kicker, warm.kicker)}>
                  Volume 01 · {t("book.hero_eyebrow")}
                </p>
              </div>
              <h1 className={cn(editorialType.serif, "mb-6 text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight")}>
                {t("book.hero_title")}
              </h1>
              <p className={cn(editorialType.serif, "mb-6 text-xl md:text-3xl leading-tight italic font-light opacity-80")}>
                {t("book.hero_subtitle")}
              </p>
              <p className="mb-10 text-base md:text-lg leading-relaxed opacity-80 max-w-xl">
                {t("book.hero_description")}
              </p>

              <div className="mb-10 flex flex-wrap gap-3">
                <EditorialCTA href="#chapters" tone="warm">
                  <BookOpen className="h-4 w-4" />
                  Read the free chapter
                </EditorialCTA>
                <EditorialCTA href="#offer" tone="warm" variant="ghost">
                  See the cohort
                </EditorialCTA>
              </div>

              <div className={cn("flex flex-wrap gap-x-6 gap-y-2 opacity-60", editorialType.caption)}>
                <span>{t("book.hero_meta_format")}</span>
                <span>·</span>
                <span>{t("book.hero_meta_pages")}</span>
                <span>·</span>
                <span>{t("book.hero_meta_release")}</span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div
                className="relative"
                style={{
                  transform: "rotate(-2deg)",
                }}
              >
                <img
                  src={bookCover}
                  alt={t("book.hero_title")}
                  className="w-64 md:w-80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <LivingManuscriptBand />
        <BookChapterIndex />

        {/* Edition picker */}
        <EditorialSection tone="clay" containerClassName="max-w-5xl">
          <div className="mb-12">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", clay.numeral)}>04</span>
              <p className={cn(editorialType.kicker, clay.kicker)}>Two editions, one ontology</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-3xl")}>
              Choose how you want to <em className="italic font-light">read it.</em>
            </h2>
            <p className="mt-4 max-w-2xl text-base md:text-lg opacity-80">
              Same source corpus, two voices. Pick the one that matches the next 90 minutes of your life.
            </p>
          </div>
          <div className="grid gap-0 md:grid-cols-2 border-t border-current/20">
            <Link
              to="/book/chapter/naming-the-friction"
              className="group flex flex-col p-8 md:p-10 md:border-r border-b md:border-b-0 border-current/20 hover:bg-current/[0.04] transition-colors"
            >
              <div className={cn(editorialType.caption, clay.kicker, "mb-4")}>The Field Guide</div>
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-4")}>
                Visionary <em className="italic font-light">edition.</em>
              </h3>
              <p className="text-base opacity-80 leading-relaxed">
                Essayistic, mythic, slow. For practitioners and the curious general reader who
                want the full literary spine — 4–6k words per chapter, reflection prompts, the
                Paracosm vocabulary woven in.
              </p>
              <div className={cn("mt-8 inline-flex items-center gap-1.5 border-b w-fit pb-1 transition-transform group-hover:translate-x-0.5", editorialType.cta, clay.accentBorder, clay.kicker)}>
                Start reading <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
            <Link
              to="/book/operators-index"
              className="group flex flex-col p-8 md:p-10 hover:bg-current/[0.04] transition-colors"
            >
              <div className={cn(editorialType.caption, clay.kicker, "mb-4")}>The Operator's Cut</div>
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-4")}>
                Pragmatic <em className="italic font-light">reader.</em>
              </h3>
              <p className="text-base opacity-80 leading-relaxed">
                90 minutes on a flight. For founders, COOs, and transformation leads who need
                vocabulary, one Monday move, and a 3-question diagnostic per chapter. ≤1800 words.
              </p>
              <div className={cn("mt-8 inline-flex items-center gap-1.5 border-b w-fit pb-1 transition-transform group-hover:translate-x-0.5", editorialType.cta, clay.accentBorder, clay.kicker)}>
                Open the Symptom Index <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </div>
        </EditorialSection>

        <BookOfferTiers />

        {/* Thesis / pillars */}
        <EditorialSection tone="paper">
          <div className="mb-14">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none text-primary")}>05</span>
              <p className={cn(editorialType.kicker, "text-primary")}>{t("book.thesis_eyebrow")}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-3xl")}>
              {t("book.thesis_title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base md:text-lg opacity-80">
              {t("book.thesis_description")}
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 border-t border-current/15 pt-10">
            {pillars.map(({ icon: Icon, key }, i) => (
              <div key={key} className="flex flex-col gap-3">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className={cn(editorialType.serif, "text-2xl text-primary tabular-nums")}>{String(i + 1).padStart(2, "0")}</span>
                  <Icon className="h-4 w-4 opacity-60" />
                </div>
                <h3 className={cn(editorialType.serif, "text-xl md:text-2xl leading-tight tracking-tight")}>
                  {t(`book.pillar_${key}_title`)}
                </h3>
                <p className="text-sm leading-relaxed opacity-75">{t(`book.pillar_${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Why now */}
        <EditorialSection tone="warm" id="why-now" containerClassName="max-w-3xl">
          <div className="flex items-baseline gap-6 mb-6">
            <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", warm.numeral)}>06</span>
            <p className={cn(editorialType.kicker, warm.kicker)}>{t("book.why_now_eyebrow")}</p>
          </div>
          <h2 className={cn(editorialType.serif, "mb-10 text-3xl md:text-5xl leading-[1.1] tracking-tight")}>
            {t("book.why_now_title")}
          </h2>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed opacity-85">
            <p>{t("book.why_now_p1")}</p>
            <p>{t("book.why_now_p2")}</p>
            <p className={cn(editorialType.serif, "text-2xl italic font-light")}>{t("book.why_now_p3")}</p>
          </div>
        </EditorialSection>

        {/* Chapters accordion */}
        <EditorialSection tone="clay" containerClassName="max-w-4xl">
          <div className="mb-12">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", clay.numeral)}>07</span>
              <p className={cn(editorialType.kicker, clay.kicker)}>{t("book.chapters_eyebrow")}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-2xl")}>
              {t("book.chapters_title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base md:text-lg opacity-80">{t("book.chapters_description")}</p>
          </div>

          <Accordion type="single" collapsible className="border-t border-current/20">
            {chapters.map((n) => (
              <AccordionItem
                key={n}
                value={`ch-${n}`}
                className="border-b border-current/20"
              >
                <AccordionTrigger className="py-6 hover:no-underline">
                  <div className="flex items-baseline gap-6 text-left flex-1 min-w-0">
                    <span className={cn(editorialType.serif, "text-2xl tabular-nums w-10 flex-none", clay.numeral)}>
                      0{n}
                    </span>
                    <span className={cn(editorialType.caption, clay.kicker, "w-24 flex-none")}>
                      {t(`book.chapter_${n}_phase`)}
                    </span>
                    <span className={cn(editorialType.serif, "text-lg md:text-xl leading-tight truncate flex-1")}>
                      {t(`book.chapter_${n}_title`)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-16 text-base leading-relaxed opacity-80">
                  {t(`book.chapter_${n}_desc`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </EditorialSection>

        {/* Playbooks */}
        <EditorialSection tone="night">
          <div className="mb-12">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", night.numeral)}>08</span>
              <p className={cn(editorialType.kicker, night.kicker)}>{t("book.playbooks_eyebrow")}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-3xl")}>
              {t("book.playbooks_title")}
            </h2>
            <p className="mt-4 max-w-3xl text-base md:text-lg opacity-80">{t("book.playbooks_description")}</p>
          </div>

          <div className="grid gap-0 lg:grid-cols-3 border-t border-white/20">
            {playbooks.map(({ key, icon: Icon, items }, i) => (
              <div
                key={key}
                className="flex flex-col p-8 md:p-10 border-b lg:border-b-0 lg:border-r last:border-r-0 border-white/15"
              >
                <div className={cn("flex items-baseline gap-4 mb-6", editorialType.caption)}>
                  <span className={cn(editorialType.serif, "text-xl", night.kicker)}>{String(i + 1).padStart(2, "0")}</span>
                  <Icon className="h-4 w-4 opacity-70" />
                  <span className={cn(night.kicker)}>{t(`book.playbook_${key}_label`)}</span>
                </div>
                <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-4")}>
                  {t(`book.playbook_${key}_title`)}
                </h3>
                <p className="text-base leading-relaxed opacity-80 mb-6">{t(`book.playbook_${key}_desc`)}</p>
                <ul className="space-y-3 text-sm opacity-90">
                  {items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className={cn("mt-2 h-1 w-4 flex-none", night.accentBorder, "border-t")} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </EditorialSection>

        {/* Bridge */}
        <EditorialSection tone="warm" containerClassName="max-w-5xl">
          <div className="mb-12">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", warm.numeral)}>09</span>
              <p className={cn(editorialType.kicker, warm.kicker)}>{t("book.bridge_eyebrow")}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-2xl")}>
              {t("book.bridge_title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base md:text-lg opacity-80">{t("book.bridge_description")}</p>
          </div>

          <div className="grid items-stretch gap-0 md:grid-cols-[1fr_auto_1fr] border-t border-current/20">
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-current/20">
              <div className={cn(editorialType.caption, warm.kicker, "mb-4")}>{t("book.bridge_left_label")}</div>
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-4")}>
                {t("book.bridge_left_title")}
              </h3>
              <p className="text-base leading-relaxed opacity-80">{t("book.bridge_left_desc")}</p>
            </div>

            <div className={cn("flex items-center justify-center p-6", warm.kicker)}>
              <ArrowRight className="hidden h-8 w-8 md:block" />
              <ArrowRight className="h-6 w-6 md:hidden" />
            </div>

            <div className="p-8 md:p-10">
              <div className={cn(editorialType.caption, warm.kicker, "mb-4")}>{t("book.bridge_right_label")}</div>
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-4")}>
                {t("book.bridge_right_title")}
              </h3>
              <p className="text-base leading-relaxed opacity-80">{t("book.bridge_right_desc")}</p>
            </div>
          </div>

          <p className={cn("mt-8 text-center opacity-60", editorialType.caption)}>
            {t("book.bridge_arrow")}
          </p>
        </EditorialSection>

        {/* Comparison */}
        <EditorialSection tone="paper" containerClassName="max-w-6xl">
          <div className="mb-12">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none text-primary")}>10</span>
              <p className={cn(editorialType.kicker, "text-primary")}>{t("book.compare_eyebrow")}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-2xl")}>
              {t("book.compare_title")}
            </h2>
          </div>

          <div className="border-t-2 border-b border-current/30">
            <div className={cn("grid grid-cols-[0.8fr_1fr_1fr] py-4 border-b border-current/15", editorialType.caption)}>
              <div />
              <div className="text-primary">{t("book.compare_left_title")}</div>
              <div className={cn("border-l border-current/15 pl-4 text-primary")}>{t("book.compare_right_title")}</div>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[0.8fr_1fr_1fr] py-5 border-b border-current/10 last:border-b-0 gap-4">
                <div className={cn("font-serif text-sm md:text-base font-medium")}>{row.label}</div>
                <div className="text-sm md:text-base leading-relaxed opacity-70 pr-4">{row.left}</div>
                <div className="border-l border-current/15 pl-4 text-sm md:text-base leading-relaxed">{row.right}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/lineage"
              className={cn("inline-flex items-center gap-1.5 border-b pb-1 text-primary transition-transform hover:translate-x-0.5", editorialType.cta, "border-primary")}
            >
              See the full lineage matrix — Calm Magic vs. Design Thinking, Theory U, Cynefin, Speculative Design
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </EditorialSection>

        {/* Author */}
        <EditorialSection tone="clay" containerClassName="max-w-3xl">
          <div className="flex items-baseline gap-6 mb-8">
            <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", clay.numeral)}>11</span>
            <p className={cn(editorialType.kicker, clay.kicker)}>{t("book.author_eyebrow")}</p>
          </div>
          <h2 className={cn(editorialType.serif, "mb-2 text-3xl md:text-5xl leading-[1.1] tracking-tight")}>
            {t("book.author_name")}
          </h2>
          <p className={cn("mb-8", editorialType.caption, clay.kicker)}>{t("book.author_role")}</p>
          <p className="text-lg leading-relaxed opacity-85">{t("book.author_bio")}</p>
        </EditorialSection>

        {/* Author work */}
        <EditorialSection tone="warm">
          <div className="mb-12">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", warm.numeral)}>12</span>
              <p className={cn(editorialType.kicker, warm.kicker)}>{t("book.author_work_eyebrow")}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-3xl")}>
              {t("book.author_work_title")}
            </h2>
            <p className="mt-4 max-w-3xl text-base md:text-lg opacity-80">{t("book.author_work_description")}</p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {authorWorkImages.map((image, index) => (
              <figure key={image.titleKey} className="flex flex-col">
                <img
                  src={image.src}
                  alt={t(image.titleKey)}
                  className="aspect-[16/10] w-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <figcaption className="pt-5">
                  <h3 className={cn(editorialType.serif, "text-xl md:text-2xl leading-tight tracking-tight mb-2")}>
                    {t(image.titleKey)}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed opacity-75">{t(image.descKey)}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className={cn("mt-8", editorialType.caption, "opacity-60")}>{t("book.author_work_card_note")}</p>
        </EditorialSection>

        {/* Waitlist form */}
        <EditorialSection tone="night" id="waitlist" containerClassName="max-w-2xl">
          <div className="mb-10">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", night.numeral)}>13</span>
              <p className={cn(editorialType.kicker, night.kicker)}>{t("book.form_eyebrow")}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight mb-4")}>
              {t("book.form_title")}
            </h2>
            <p className="text-base opacity-80">{t("book.form_description")}</p>
          </div>

          <div className="border-t border-white/20 pt-10">
            {submitted ? (
              <div className="py-6 text-center">
                <CheckCircle2 className={cn("mx-auto mb-4 h-10 w-10", night.kicker)} />
                <h3 className={cn(editorialType.serif, "mb-2 text-2xl")}>{t("book.form_success_title")}</h3>
                <p className="text-sm opacity-80">{t("book.form_success_desc")}</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                        <FormLabel className={cn(editorialType.caption, "opacity-80")}>{t("book.form_name_label")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("book.form_name_placeholder")}
                            className="border-white/20 bg-white/5 text-current placeholder:text-current/40 rounded-none border-0 border-b focus-visible:ring-0 px-0"
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
                        <FormLabel className={cn(editorialType.caption, "opacity-80")}>{t("book.form_email_label")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder={t("book.form_email_placeholder")}
                            className="border-white/20 bg-white/5 text-current placeholder:text-current/40 rounded-none border-0 border-b focus-visible:ring-0 px-0"
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
                        <FormLabel className={cn(editorialType.caption, "opacity-80")}>{t("book.form_role_label")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("book.form_role_placeholder")}
                            className="border-white/20 bg-white/5 text-current placeholder:text-current/40 rounded-none border-0 border-b focus-visible:ring-0 px-0"
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
                        <FormLabel className={cn(editorialType.caption, "opacity-80")}>{t("book.form_tier_label")}</FormLabel>
                        <div className="grid grid-cols-3 gap-0 border-t border-white/15 border-b">
                          {(["reader", "practitioner", "org"] as const).map((tier, i) => (
                            <button
                              key={tier}
                              type="button"
                              onClick={() => field.onChange(tier)}
                              className={cn(
                                "py-4 transition-colors border-white/15",
                                i > 0 && "border-l",
                                editorialType.cta,
                                field.value === tier
                                  ? cn(night.ctaPrimary)
                                  : "opacity-60 hover:opacity-100",
                              )}
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
                    className={cn(
                      "w-full mt-4 rounded-full",
                      editorialType.cta,
                      night.ctaPrimary,
                    )}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {t("book.form_submitting")}
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        {t("book.form_submit")}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </EditorialSection>

        {/* Endorsements */}
        <EditorialSection tone="paper" containerClassName="max-w-3xl">
          <div className="flex items-baseline gap-6 mb-6">
            <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none text-primary")}>14</span>
            <p className={cn(editorialType.kicker, "text-primary")}>{t("book.endorsements_eyebrow")}</p>
          </div>
          <h2 className={cn(editorialType.serif, "mb-4 text-3xl md:text-4xl leading-tight tracking-tight")}>
            {t("book.endorsements_title")}
          </h2>
          <p className={cn(editorialType.serif, "text-xl italic font-light opacity-60")}>{t("book.endorsements_placeholder")}</p>
        </EditorialSection>

        {/* FAQ */}
        <EditorialSection tone="warm" containerClassName="max-w-3xl">
          <div className="flex items-baseline gap-6 mb-10">
            <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", warm.numeral)}>15</span>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight")}>
              {t("book.faq_title")}
            </h2>
          </div>
          <Accordion type="single" collapsible className="border-t border-current/20">
            {[1, 2, 3, 4].map((n) => (
              <AccordionItem
                key={n}
                value={`faq-${n}`}
                className="border-b border-current/20"
              >
                <AccordionTrigger className={cn("py-6 text-left hover:no-underline", editorialType.serif, "text-lg md:text-xl leading-tight")}>
                  {t(`book.faq_q${n}`)}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed opacity-80">
                  {t(`book.faq_a${n}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </EditorialSection>
      </main>

      <Footer />
    </div>
  );
};

export default BookLaunch;
