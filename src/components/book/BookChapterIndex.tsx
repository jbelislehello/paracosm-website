import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useReaderProgress } from "@/hooks/useReaderProgress";
import ReaderProgressBar from "./ReaderProgressBar";

interface Chapter {
  id: string;
  slug: string;
  order_index: number;
  title: string;
  phase: string;
  summary: string | null;
  status: string;
  is_free_sample: boolean;
}

const PHASE_LABEL: Record<string, string> = {
  GLITCH: "GL!TCH",
  DRIFT: "Drift",
  TUNE: "Tune",
  LOVE: "Love",
  MAGIC: "Magic",
  CALM: "Calm",
  FREE: "Free",
};

const STATUS_LABEL: Record<string, string> = {
  outline: "Outline",
  drafting: "Drafting",
  review: "In review",
  published: "Published",
};

export default function BookChapterIndex() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const { readSlugs, lastSlug } = useReaderProgress();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("book_chapters")
        .select("id, slug, order_index, title, phase, summary, status, is_free_sample")
        .order("order_index", { ascending: true });
      if (mounted) {
        setChapters((data as Chapter[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const visible = chapters.length > 0 ? chapters : FALLBACK_OUTLINE;
  const continueChapter = lastSlug
    ? visible.find((c) => c.slug === lastSlug && c.status === "published")
    : null;

  return (
    <section id="chapters" className="px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge className="mb-3 border-[hsl(var(--bloom-magenta)/0.4)] bg-[hsl(var(--bloom-magenta)/0.15)] font-vhs text-sm uppercase tracking-widest text-[hsl(var(--bloom-cream))]">
              <Sparkles className="mr-1 h-3 w-3" />
              Living manuscript
            </Badge>
            <h2 className="font-display text-3xl leading-tight text-[hsl(var(--bloom-cream))] md:text-5xl bloom-chroma-static">
              Chapters in motion
            </h2>
            <p className="mt-3 max-w-2xl font-tight text-sm text-white/60">
              Each chapter is being assembled from the work happening on this site —
              essays, PRDs, drift entries, retreat field notes, and uploaded
              manuscript material. Open any published chapter; the rest unlock as
              drafts are approved.
            </p>
          </div>
          {continueChapter && (
            <Link
              to={`/book/chapter/${continueChapter.slug}`}
              className="inline-flex items-center gap-2 rounded-md bg-[hsl(var(--bloom-amber))] px-4 py-2 font-vhs text-sm uppercase tracking-widest text-[hsl(var(--bloom-ink))] shadow-[var(--shadow-bloom)] hover:brightness-110"
            >
              ▶ Continue: {continueChapter.title}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <ReaderProgressBar className="mb-6" />

        <div className="grid gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-white/5 bg-white/5"
                />
              ))
            : visible.map((c) => (
                <ChapterRow
                  key={c.slug}
                  chapter={c}
                  hasRead={readSlugs.includes(c.slug)}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

function ChapterRow({ chapter, hasRead }: { chapter: Chapter; hasRead: boolean }) {
  const isPublished = chapter.status === "published";
  const isReadable = isPublished;

  const Inner = (
    <Card
      className={`group flex items-center justify-between gap-4 border-white/10 bg-white/[0.04] p-5 transition-colors ${
        isReadable ? "hover:border-white/20 hover:bg-white/[0.07]" : ""
      } ${hasRead ? "border-fuchsia-400/30 bg-fuchsia-500/[0.04]" : ""}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg text-sm font-semibold ${
            hasRead
              ? "bg-gradient-to-br from-fuchsia-400 to-rose-400 text-slate-900"
              : "bg-gradient-to-br from-fuchsia-500/30 to-rose-500/20"
          }`}
        >
          {hasRead ? <Check className="h-5 w-5" /> : chapter.order_index}
        </div>
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-white/15 bg-white/5 text-[10px] uppercase tracking-wider text-white/70">
              {PHASE_LABEL[chapter.phase] ?? chapter.phase}
            </Badge>
            <Badge
              variant="outline"
              className={`border-white/15 text-[10px] uppercase tracking-wider ${
                isPublished
                  ? "bg-emerald-500/15 text-emerald-200"
                  : chapter.status === "review"
                    ? "bg-amber-500/15 text-amber-200"
                    : chapter.status === "drafting"
                      ? "bg-fuchsia-500/15 text-fuchsia-200"
                      : "bg-white/5 text-white/60"
              }`}
            >
              {STATUS_LABEL[chapter.status] ?? chapter.status}
            </Badge>
            {chapter.is_free_sample && isPublished && (
              <Badge className="bg-white text-slate-900 hover:bg-white/90 text-[10px] uppercase tracking-wider">
                Free sample
              </Badge>
            )}
            {hasRead && (
              <Badge className="bg-fuchsia-400/20 text-fuchsia-100 text-[10px] uppercase tracking-wider">
                Read
              </Badge>
            )}
          </div>
          <h3 className="truncate text-base font-semibold text-white">
            {chapter.title}
          </h3>
          {chapter.summary && (
            <p className="mt-1 line-clamp-2 text-xs text-white/55">
              {chapter.summary}
            </p>
          )}
        </div>
      </div>
      {isReadable ? (
        <span className="flex flex-none items-center gap-1 rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-white transition-colors group-hover:bg-white/20">
          <BookOpen className="h-3.5 w-3.5" />
          {hasRead ? "Re-read" : "Read"}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      ) : (
        <span className="flex-none text-xs text-white/40">Coming soon</span>
      )}
    </Card>
  );

  if (isReadable) {
    return <Link to={`/book/chapter/${chapter.slug}`}>{Inner}</Link>;
  }
  return Inner;
}

const FALLBACK_OUTLINE: Chapter[] = [
  { id: "1", slug: "naming-the-friction", order_index: 1, title: "Naming the Friction", phase: "GLITCH", summary: "Why the future arrives as a glitch first.", status: "outline", is_free_sample: false },
  { id: "2", slug: "pattern-exploration", order_index: 2, title: "Pattern Exploration", phase: "DRIFT", summary: "Wandering with discipline.", status: "outline", is_free_sample: false },
  { id: "3", slug: "intentional-commitment", order_index: 3, title: "Intentional Commitment", phase: "TUNE", summary: "Velocity = speed × direction.", status: "outline", is_free_sample: false },
  { id: "4", slug: "relational-infrastructure", order_index: 4, title: "Relational Infrastructure", phase: "LOVE", summary: "Trust, conflict, repair.", status: "outline", is_free_sample: false },
  { id: "5", slug: "pragmatic-imagination", order_index: 5, title: "Pragmatic Imagination", phase: "MAGIC", summary: "Worldbuilding as leadership skill.", status: "outline", is_free_sample: false },
  { id: "6", slug: "designing-the-system", order_index: 6, title: "Designing the System", phase: "CALM", summary: "From insight to ontology.", status: "outline", is_free_sample: false },
  { id: "7", slug: "operating-in-flow", order_index: 7, title: "Operating in Flow", phase: "FREE", summary: "Continuous reconfiguration.", status: "outline", is_free_sample: false },
];
