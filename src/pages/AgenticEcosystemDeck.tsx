import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Loader2, CheckCircle2, Sparkles,
  Download, Play, Plus, Trash2, RefreshCw, ExternalLink, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { exportDeckToPptx, type DeckOutline, type DeckSlide } from "@/lib/deck/exportPptx";
import { ALLOWED_HOST, isAllowedSourceUrl } from "@/lib/deck/sourceGuard";
import { trackEvent } from "@/lib/analytics";

type Step = 1 | 2 | 3 | 4;

const AUDIENCES = [
  { value: "founder", label: "Founders & operators" },
  { value: "enterprise", label: "Enterprise leaders" },
  { value: "investor", label: "Investors" },
  { value: "partner", label: "Partners & integrators" },
  { value: "practitioner", label: "Practitioner cohorts" },
];
const TONES = [
  { value: "executive", label: "Executive — direct, ROI-aware" },
  { value: "visionary", label: "Visionary — narrative, future-facing" },
  { value: "practitioner", label: "Practitioner — concrete, methodological" },
];
const LENGTHS = [
  { value: "short", label: "Short (≈8 slides)" },
  { value: "standard", label: "Standard (≈12 slides)" },
  { value: "deep", label: "Deep (≈18 slides)" },
] as const;

const STORAGE_KEY = "agentic-deck-draft";

interface Draft {
  selectedUrls: string[];
  audience: string;
  tone: string;
  length: "short" | "standard" | "deep";
  intent: string;
  outline: DeckOutline | null;
  currentSlideIdx: number;
}

const DEFAULT_DRAFT: Draft = {
  selectedUrls: [],
  audience: "founder",
  tone: "visionary",
  length: "standard",
  intent: "",
  outline: null,
  currentSlideIdx: 0,
};

const AgenticEcosystemDeck = () => {
  usePageSeo({
    title: "Generate an Agentic Ecosystem deck — Paracosm",
    description:
      "Guided AI flow that pulls content from paracosm.helloarchitekt.com and generates a presentation tailored to your audience.",
    path: "/agentic-ecosystem-deck",
  });

  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_DRAFT, ...JSON.parse(raw) } : DEFAULT_DRAFT;
    } catch {
      return DEFAULT_DRAFT;
    }
  });

  // Discover
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [discovering, setDiscovering] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  // Generation
  const [generating, setGenerating] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [progressValue, setProgressValue] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    void trackEvent("deck_wizard_viewed", {
      prefill: searchParams.get("prefill") ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchParams.get("prefill") !== "hero") return;
    const hasOutline = !!draft.outline;
    if (hasOutline) {
      toast("You have a draft in progress.", {
        description: "Continue editing or start fresh from the hero prefill.",
        action: {
          label: "Start fresh",
          onClick: () => {
            setDraft({
              ...DEFAULT_DRAFT,
              audience: "founder",
              tone: "visionary",
              length: "standard",
              intent:
                "Introduce our Agentic Ecosystems service: orchestrator + shared context + specialized agents, with observable, human-aligned coordination.",
            });
            setStep(1);
          },
        },
      });
    } else {
      setDraft((d) => ({
        ...d,
        audience: d.audience || "founder",
        tone: d.tone || "visionary",
        length: d.length || "standard",
        intent:
          d.intent && d.intent.trim().length > 0
            ? d.intent
            : "Introduce our Agentic Ecosystems service: orchestrator + shared context + specialized agents, with observable, human-aligned coordination.",
      }));
      toast.success("Prefilled from the Agentic Ecosystem hero");
    }
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [draft]);

  // Step 1: discover pages on mount
  useEffect(() => {
    if (step !== 1 || discoveredUrls.length > 0 || discovering) return;
    void discover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const discover = async () => {
    setDiscovering(true);
    try {
      const { data, error } = await supabase.functions.invoke("discover-paracosm-pages", {
        body: { search: "agentic ecosystem orchestrator calm magic crewdle paracosm" },
      });
      if (error) throw error;
      const urls: string[] = (data?.urls ?? []).filter(isAllowedSourceUrl);
      setDiscoveredUrls(urls);
      // Pre-select up to 6 most relevant
      if (draft.selectedUrls.length === 0 && urls.length > 0) {
        const preferred = urls
          .filter((u) => /agentic|ecosystem|calm-magic|crewdle|drift|paracosm-retreat|about/i.test(u))
          .slice(0, 6);
        const seed = preferred.length > 0 ? preferred : urls.slice(0, 6);
        setDraft((d) => ({ ...d, selectedUrls: seed }));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to discover pages";
      toast.error(msg);
    } finally {
      setDiscovering(false);
    }
  };

  const toggleUrl = (url: string) => {
    setDraft((d) => {
      const has = d.selectedUrls.includes(url);
      if (has) return { ...d, selectedUrls: d.selectedUrls.filter((u) => u !== url) };
      if (d.selectedUrls.length >= 12) {
        toast.error("Maximum 12 source pages.");
        return d;
      }
      return { ...d, selectedUrls: [...d.selectedUrls, url] };
    });
  };

  const addCustomUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    if (!isAllowedSourceUrl(trimmed)) {
      toast.error(`Only ${ALLOWED_HOST} URLs are allowed.`);
      return;
    }
    if (draft.selectedUrls.includes(trimmed)) {
      setCustomUrl("");
      return;
    }
    if (draft.selectedUrls.length >= 12) {
      toast.error("Maximum 12 source pages.");
      return;
    }
    setDraft((d) => ({ ...d, selectedUrls: [...d.selectedUrls, trimmed] }));
    setCustomUrl("");
  };

  const generate = async () => {
    if (draft.selectedUrls.length === 0) {
      toast.error("Pick at least one source page.");
      return;
    }
    setGenerating(true);
    setStep(3);
    setProgressLabel("Reading paracosm.helloarchitekt.com…");
    setProgressValue(15);
    try {
      const scrapeRes = await supabase.functions.invoke("scrape-paracosm-pages", {
        body: { urls: draft.selectedUrls },
      });
      if (scrapeRes.error) throw scrapeRes.error;
      const pages = scrapeRes.data?.pages ?? [];
      if (pages.length === 0) throw new Error("No content could be scraped from the selected pages.");

      setProgressLabel("Composing outline with AI…");
      setProgressValue(50);
      const outlineRes = await supabase.functions.invoke("compose-deck", {
        body: {
          stage: "outline",
          audience: draft.audience,
          tone: draft.tone,
          length: draft.length,
          intent: draft.intent,
          pages,
        },
      });
      if (outlineRes.error) throw outlineRes.error;
      const outline = outlineRes.data?.outline as DeckOutline | undefined;
      if (!outline) throw new Error("AI returned no outline.");

      setProgressLabel("Filling in slide bodies…");
      setProgressValue(80);
      const slidesRes = await supabase.functions.invoke("compose-deck", {
        body: {
          stage: "slides",
          audience: draft.audience,
          tone: draft.tone,
          length: draft.length,
          intent: draft.intent,
          pages,
          outline,
        },
      });
      const finalOutline = (slidesRes.data?.outline as DeckOutline | undefined) ?? outline;

      setDraft((d) => ({ ...d, outline: finalOutline, currentSlideIdx: 0 }));
      setProgressLabel("Done");
      setProgressValue(100);
      setStep(4);
      void trackEvent("deck_wizard_outline_generated", {
        slideCount: finalOutline?.slides?.length ?? 0,
        audience: draft.audience,
        tone: draft.tone,
        length: draft.length,
        sourceCount: draft.selectedUrls.length,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      toast.error(msg);
      setStep(2);
    } finally {
      setGenerating(false);
    }
  };

  const updateSlide = (idx: number, patch: Partial<DeckSlide>) => {
    setDraft((d) => {
      if (!d.outline) return d;
      const slides = d.outline.slides.map((s, i) => (i === idx ? { ...s, ...patch } : s));
      return { ...d, outline: { ...d.outline, slides } };
    });
  };

  const removeSlide = (idx: number) => {
    setDraft((d) => {
      if (!d.outline) return d;
      const slides = d.outline.slides.filter((_, i) => i !== idx);
      return {
        ...d,
        outline: { ...d.outline, slides },
        currentSlideIdx: Math.max(0, Math.min(d.currentSlideIdx, slides.length - 1)),
      };
    });
  };

  const addBlankSlide = () => {
    setDraft((d) => {
      if (!d.outline) return d;
      const newSlide: DeckSlide = {
        id: crypto.randomUUID(),
        type: "bullets",
        title: "New slide",
        bullets: ["Edit this bullet"],
        speakerNotes: "",
        sourceUrls: [],
      };
      const slides = [...d.outline.slides, newSlide];
      return { ...d, outline: { ...d.outline, slides }, currentSlideIdx: slides.length - 1 };
    });
  };

  const startOver = () => {
    if (!confirm("Discard this deck and start fresh?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setDraft(DEFAULT_DRAFT);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Agentic Ecosystem · Deck Generator
          </div>
          <LanguageSwitcher />
        </div>
        <StepBar step={step} />
      </header>

      <main className="container mx-auto px-4 py-10">
        {step === 1 && (
          <div className="mx-auto max-w-3xl space-y-8">
            <QuestionResonancePanel
              defaultQuestion={draft.intent}
              onMapped={(m) =>
                setDraft((d) => ({
                  ...d,
                  intent: d.intent && d.intent.trim().length > 0 ? d.intent : m.question,
                }))
              }
            />
            <StepSource
              discovering={discovering}
              discoveredUrls={discoveredUrls}
              selectedUrls={draft.selectedUrls}
              onToggle={toggleUrl}
              onRefresh={discover}
              customUrl={customUrl}
              setCustomUrl={setCustomUrl}
              onAddCustom={addCustomUrl}
              onContinue={() => setStep(2)}
            />
          </div>
        )}
        {step === 2 && (
          <StepAudience
            draft={draft}
            setDraft={setDraft}
            onBack={() => setStep(1)}
            onGenerate={generate}
            generating={generating}
          />
        )}
        {step === 3 && (
          <GeneratingPanel label={progressLabel} value={progressValue} />
        )}
        {step === 4 && draft.outline && (
          <SlideEditor
            outline={draft.outline}
            currentIdx={draft.currentSlideIdx}
            onSelect={(i) => setDraft((d) => ({ ...d, currentSlideIdx: i }))}
            onUpdate={updateSlide}
            onRemove={removeSlide}
            onAddBlank={addBlankSlide}
            onExport={() => {
              exportDeckToPptx(draft.outline!);
              void trackEvent("deck_exported", {
                slideCount: draft.outline!.slides.length,
                audience: draft.audience,
                tone: draft.tone,
                length: draft.length,
              });
            }}
            onStartOver={startOver}
          />
        )}
      </main>

      {step !== 4 && <Footer />}
    </div>
  );
};

/* ---------------- Step bar ---------------- */
const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Source" },
  { n: 2, label: "Frame" },
  { n: 3, label: "Generate" },
  { n: 4, label: "Edit & Export" },
];
const StepBar = ({ step }: { step: Step }) => (
  <div className="border-t border-border/40">
    <div className="container mx-auto flex items-center gap-2 overflow-x-auto px-4 py-3 text-xs">
      {STEPS.map((s, i) => {
        const active = s.n === step;
        const done = s.n < step;
        return (
          <div key={s.n} className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : done
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.n}
            </div>
            <span className={active ? "font-medium text-foreground" : "text-muted-foreground"}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <span className="px-1 text-muted-foreground">→</span>}
          </div>
        );
      })}
    </div>
  </div>
);

/* ---------------- Step 1 ---------------- */
const StepSource = ({
  discovering, discoveredUrls, selectedUrls, onToggle, onRefresh,
  customUrl, setCustomUrl, onAddCustom, onContinue,
}: {
  discovering: boolean;
  discoveredUrls: string[];
  selectedUrls: string[];
  onToggle: (u: string) => void;
  onRefresh: () => void;
  customUrl: string;
  setCustomUrl: (s: string) => void;
  onAddCustom: () => void;
  onContinue: () => void;
}) => {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Badge variant="outline" className="mb-3">Step 1 — Source</Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Pick the pages we'll learn from
        </h1>
        <p className="mt-3 text-muted-foreground">
          We pull content only from <strong>{ALLOWED_HOST}</strong>. paracosm.life is not used.
          Select up to 12 pages — pre-selection prioritises agentic ecosystem material.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedUrls.length} / 12 selected
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={discovering}>
          {discovering ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
          Re-scan site
        </Button>
      </div>

      {discovering && discoveredUrls.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Discovering pages on {ALLOWED_HOST}…
        </Card>
      ) : discoveredUrls.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">
          <AlertCircle className="mb-2 h-4 w-4 text-amber-500" />
          No pages discovered yet. Add a URL below or re-scan.
        </Card>
      ) : (
        <Card className="divide-y divide-border">
          {discoveredUrls.map((url) => {
            const checked = selectedUrls.includes(url);
            const path = url.replace(`https://${ALLOWED_HOST}`, "") || "/";
            return (
              <label
                key={url}
                className="flex cursor-pointer items-start gap-3 p-3 hover:bg-muted/40"
              >
                <Checkbox checked={checked} onCheckedChange={() => onToggle(url)} className="mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{path}</div>
                  <div className="truncate text-xs text-muted-foreground">{url}</div>
                </div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </label>
            );
          })}
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="custom" className="text-sm">Add a specific URL</Label>
        <div className="flex gap-2">
          <Input
            id="custom"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder={`https://${ALLOWED_HOST}/some-page`}
          />
          <Button variant="outline" onClick={onAddCustom}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={onContinue} disabled={selectedUrls.length === 0}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

/* ---------------- Step 2 ---------------- */
const StepAudience = ({
  draft, setDraft, onBack, onGenerate, generating,
}: {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  onBack: () => void;
  onGenerate: () => void;
  generating: boolean;
}) => (
  <div className="mx-auto max-w-2xl space-y-6">
    <div>
      <Badge variant="outline" className="mb-3">Step 2 — Frame</Badge>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Who is this deck for?
      </h1>
      <p className="mt-3 text-muted-foreground">
        We'll match the tone, depth, and length to the room you're walking into.
      </p>
    </div>

    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Audience</Label>
        <Select value={draft.audience} onValueChange={(v) => setDraft((d) => ({ ...d, audience: v }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {AUDIENCES.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tone</Label>
        <Select value={draft.tone} onValueChange={(v) => setDraft((d) => ({ ...d, tone: v }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {TONES.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Length</Label>
        <Select value={draft.length} onValueChange={(v) => setDraft((d) => ({ ...d, length: v as Draft["length"] }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {LENGTHS.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="intent">What must this deck achieve? (optional)</Label>
        <Textarea
          id="intent"
          value={draft.intent}
          onChange={(e) => setDraft((d) => ({ ...d, intent: e.target.value }))}
          placeholder="e.g. Convince a CTO that an agentic ecosystem reduces orchestration risk."
          rows={3}
          maxLength={500}
        />
      </div>
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} disabled={generating}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button size="lg" onClick={onGenerate} disabled={generating}>
        {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Generate the deck
      </Button>
    </div>
  </div>
);

/* ---------------- Step 3 (Generating) ---------------- */
const GeneratingPanel = ({ label, value }: { label: string; value: number }) => (
  <div className="mx-auto max-w-xl py-20 text-center">
    <Loader2 className="mx-auto mb-6 h-10 w-10 animate-spin text-primary" />
    <h2 className="text-2xl font-semibold tracking-tight">Composing your deck</h2>
    <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    <Progress value={value} className="mt-6" />
    <p className="mt-6 text-xs text-muted-foreground">
      This usually takes 30–60 seconds. Sources are read live from {ALLOWED_HOST}.
    </p>
  </div>
);

/* ---------------- Step 4 (Editor + Present) ---------------- */
const SlideEditor = ({
  outline, currentIdx, onSelect, onUpdate, onRemove, onAddBlank, onExport, onStartOver,
}: {
  outline: DeckOutline;
  currentIdx: number;
  onSelect: (i: number) => void;
  onUpdate: (idx: number, patch: Partial<DeckSlide>) => void;
  onRemove: (idx: number) => void;
  onAddBlank: () => void;
  onExport: () => void;
  onStartOver: () => void;
}) => {
  const slide = outline.slides[currentIdx];
  const [presenting, setPresenting] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Keyboard nav in present mode
  useEffect(() => {
    if (!presenting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPresenting(false);
      if (e.key === "ArrowRight" || e.key === " ") onSelect(Math.min(outline.slides.length - 1, currentIdx + 1));
      if (e.key === "ArrowLeft") onSelect(Math.max(0, currentIdx - 1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [presenting, currentIdx, outline.slides.length, onSelect]);

  const enterPresent = async () => {
    setPresenting(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Slides</h2>
          <Button variant="ghost" size="sm" onClick={onAddBlank}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="max-h-[60vh] space-y-1 overflow-y-auto pr-1">
          {outline.slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              className={`flex w-full items-start gap-2 rounded-md border p-2 text-left text-xs transition-colors ${
                i === currentIdx
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/40"
              }`}
            >
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold">
                {i + 1}
              </span>
              <span className="flex-1 truncate">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <Button className="w-full" onClick={enterPresent}>
            <Play className="mr-2 h-4 w-4" /> Present
          </Button>
          <Button variant="outline" className="w-full" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" /> Export .pptx
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={onStartOver}>
            Start over
          </Button>
        </div>
      </aside>

      {/* Main editor */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="outline" className="capitalize">{slide.type.replace("-", " ")}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(currentIdx)}
              disabled={outline.slides.length <= 1}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete slide
            </Button>
          </div>

          <SlidePreview slide={slide} />

          <div className="mt-6 space-y-4 border-t border-border pt-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={slide.title}
                onChange={(e) => onUpdate(currentIdx, { title: e.target.value })}
              />
            </div>
            {(slide.type === "title" || slide.type === "bullets" || slide.type === "stat" || slide.type === "quote") && (
              <div className="space-y-2">
                <Label>Subtitle / caption</Label>
                <Input
                  value={slide.subtitle || ""}
                  onChange={(e) => onUpdate(currentIdx, { subtitle: e.target.value })}
                />
              </div>
            )}
            {(slide.type === "bullets" || slide.type === "two-column") && (
              <div className="space-y-2">
                <Label>Bullets (one per line)</Label>
                <Textarea
                  rows={6}
                  value={(slide.bullets || []).join("\n")}
                  onChange={(e) =>
                    onUpdate(currentIdx, { bullets: e.target.value.split("\n").filter(Boolean) })
                  }
                />
              </div>
            )}
            {(slide.type === "quote" || slide.type === "stat" || slide.type === "closing-cta") && (
              <div className="space-y-2">
                <Label>Body</Label>
                <Textarea
                  rows={3}
                  value={slide.body || ""}
                  onChange={(e) => onUpdate(currentIdx, { body: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Speaker notes</Label>
              <Textarea
                rows={3}
                value={slide.speakerNotes || ""}
                onChange={(e) => onUpdate(currentIdx, { speakerNotes: e.target.value })}
              />
            </div>
            {(slide.sourceUrls?.length ?? 0) > 0 && (
              <div className="text-xs text-muted-foreground">
                Sources:{" "}
                {slide.sourceUrls!.map((u, i) => (
                  <span key={u}>
                    {i > 0 && ", "}
                    <a href={u} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                      {new URL(u).pathname || "/"}
                    </a>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Present mode overlay */}
      {presenting && (
        <div
          ref={stageRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          onClick={() => onSelect(Math.min(outline.slides.length - 1, currentIdx + 1))}
        >
          <div className="w-full max-w-6xl px-12">
            <SlidePreview slide={slide} large />
          </div>
          <div className="absolute bottom-4 right-4 text-xs text-white/40">
            {currentIdx + 1} / {outline.slides.length} · ESC to exit
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Slide preview (in-app, not the export) ---------------- */
const SlidePreview = ({ slide, large }: { slide: DeckSlide; large?: boolean }) => {
  const dark = slide.type === "title" || slide.type === "closing-cta";
  const baseSize = large ? "text-5xl md:text-7xl" : "text-2xl md:text-4xl";
  return (
    <div
      className={`aspect-[16/9] w-full overflow-hidden rounded-xl p-8 md:p-12 ${
        dark ? "bg-[hsl(229,69%,26%)] text-white" : "bg-[hsl(45,33%,97%)] text-[hsl(0,0%,10%)]"
      }`}
    >
      {slide.type === "title" && (
        <div className="flex h-full flex-col justify-center">
          <div className="mb-6 text-xs font-semibold uppercase tracking-widest text-[hsl(2,93%,68%)]">
            Paracosm · Agentic Ecosystem
          </div>
          <h1 className={`font-serif ${baseSize} font-semibold leading-tight`}>{slide.title}</h1>
          {slide.subtitle && <p className="mt-6 text-base text-white/70 md:text-2xl">{slide.subtitle}</p>}
        </div>
      )}
      {slide.type === "bullets" && (
        <div>
          <h2 className={`font-serif ${baseSize} font-semibold`}>{slide.title}</h2>
          {slide.subtitle && <p className="mt-2 text-sm italic text-muted-foreground md:text-base">{slide.subtitle}</p>}
          <ul className="mt-6 space-y-3">
            {(slide.bullets || []).map((b, i) => (
              <li key={i} className="flex gap-3 text-base leading-relaxed md:text-lg">
                <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(2,93%,68%)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {slide.type === "two-column" && (
        <div>
          <h2 className={`font-serif ${baseSize} font-semibold`}>{slide.title}</h2>
          <div className="mt-6 grid grid-cols-2 gap-6">
            {[0, 1].map((col) => {
              const half = Math.ceil((slide.bullets || []).length / 2);
              const items = col === 0 ? (slide.bullets || []).slice(0, half) : (slide.bullets || []).slice(half);
              return (
                <ul key={col} className="space-y-2 text-sm md:text-base">
                  {items.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(2,93%,68%)]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>
      )}
      {slide.type === "quote" && (
        <div className="flex h-full flex-col justify-center">
          <p className={`font-serif italic ${baseSize}`}>"{slide.body || slide.title}"</p>
          {slide.subtitle && <p className="mt-6 text-sm text-muted-foreground md:text-base">— {slide.subtitle}</p>}
        </div>
      )}
      {slide.type === "stat" && (
        <div className="flex h-full flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-[hsl(2,93%,68%)]">
            {slide.title}
          </div>
          <div className="mt-2 font-serif text-7xl font-bold md:text-9xl">{slide.body || "—"}</div>
          {slide.subtitle && <div className="mt-4 text-base text-muted-foreground md:text-xl">{slide.subtitle}</div>}
        </div>
      )}
      {slide.type === "closing-cta" && (
        <div className="flex h-full flex-col justify-center">
          <h2 className={`font-serif ${baseSize} font-semibold`}>{slide.title}</h2>
          {slide.body && <p className="mt-6 text-base text-white/70 md:text-2xl">{slide.body}</p>}
          <p className="mt-8 text-sm font-semibold text-[hsl(2,93%,68%)] md:text-lg">
            jbelisle@helloarchitekt.com
          </p>
        </div>
      )}
    </div>
  );
};

export default AgenticEcosystemDeck;
