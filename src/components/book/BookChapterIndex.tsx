import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useReaderProgress } from "@/hooks/useReaderProgress";
import ReaderProgressBar from "./ReaderProgressBar";
import { cn } from "@/lib/utils";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";

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
  OPEN: "Open",
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
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});
  const { readSlugs, lastSlug } = useReaderProgress();
  const t = editorialTone.warm;

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ data: chs }, { data: srcs }] = await Promise.all([
        supabase
          .from("book_chapters")
          .select("id, slug, order_index, title, phase, summary, status, is_free_sample")
          .order("order_index", { ascending: true }),
        supabase
          .from("book_sources")
          .select("chapter_id")
          .eq("included", true),
      ]);
      if (!mounted) return;
      setChapters((chs as Chapter[]) ?? []);
      const counts: Record<string, number> = {};
      (srcs ?? []).forEach((s: { chapter_id: string }) => {
        counts[s.chapter_id] = (counts[s.chapter_id] ?? 0) + 1;
      });
      setSourceCounts(counts);
      setLoading(false);
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
    <section id="chapters" className={cn("px-6 py-20 md:py-32", t.section)}>
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", t.numeral)}>02</span>
              <p className={cn(editorialType.kicker, t.kicker)}>Living manuscript</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-2xl")}>
              Chapters in <em className="italic font-light">motion.</em>
            </h2>
            <p className="mt-4 max-w-2xl text-base opacity-80 leading-relaxed">
              Each chapter is being assembled from the work happening on this site —
              essays, PRDs, drift entries, retreat field notes, and uploaded
              manuscript material. Open any published chapter; the rest unlock as
              drafts are approved.
            </p>
          </div>
          {continueChapter && (
            <Link
              to={`/book/chapter/${continueChapter.slug}`}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-3 rounded-full transition-transform hover:-translate-y-0.5",
                editorialType.cta,
                t.ctaPrimary,
              )}
            >
              Continue: {continueChapter.title}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <ReaderProgressBar className="mb-8" />

        {!loading && Object.keys(sourceCounts).length > 0 && (
          <div className="mb-8 border-t border-b border-current/15 py-4">
            <div className={cn(editorialType.caption, "mb-3 opacity-70")}>
              Sources mapped per chapter
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {visible.map((c) => (
                <span key={c.id} className={cn("inline-flex items-baseline gap-1.5", editorialType.caption)}>
                  <span className="opacity-80">{PHASE_LABEL[c.phase] ?? c.phase}</span>
                  <span className={cn("tabular-nums", t.kicker)}>{sourceCounts[c.id] ?? 0}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <ol className="space-y-0">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <li
                  key={i}
                  className="h-24 animate-pulse border-t border-current/15"
                />
              ))
            : visible.map((c) => (
                <ChapterRow
                  key={c.slug}
                  chapter={c}
                  hasRead={readSlugs.includes(c.slug)}
                  sourceCount={sourceCounts[c.id] ?? 0}
                  toneKicker={t.kicker}
                  toneAccentBorder={t.accentBorder}
                />
              ))}
        </ol>
      </div>
    </section>
  );
}

function ChapterRow({
  chapter,
  hasRead,
  sourceCount,
  toneKicker,
  toneAccentBorder,
}: {
  chapter: Chapter;
  hasRead: boolean;
  sourceCount: number;
  toneKicker: string;
  toneAccentBorder: string;
}) {
  const isPublished = chapter.status === "published";
  const isReadable = isPublished;

  const Inner = (
    <article
      className={cn(
        "group flex items-baseline justify-between gap-6 border-t border-current/20 py-6 transition-colors",
        isReadable && "hover:border-current/60",
      )}
    >
      <div className="flex items-baseline gap-6 min-w-0">
        <div className={cn(
          editorialType.serif,
          "text-3xl md:text-4xl leading-none tabular-nums flex-none w-14",
          hasRead ? toneKicker : "opacity-40",
        )}>
          {hasRead ? <Check className="h-6 w-6" /> : String(chapter.order_index).padStart(2, "0")}
        </div>
        <div className="min-w-0 flex-1">
          <div className={cn("flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2", editorialType.caption)}>
            <span className={cn(toneKicker)}>{PHASE_LABEL[chapter.phase] ?? chapter.phase}</span>
            <span className="opacity-60">{STATUS_LABEL[chapter.status] ?? chapter.status}</span>
            {chapter.is_free_sample && isPublished && (
              <span className={cn("opacity-90 border-b", toneAccentBorder)}>Free sample</span>
            )}
            {hasRead && <span className={cn("opacity-90", toneKicker)}>Read</span>}
          </div>
          <h3 className="font-serif text-xl md:text-2xl leading-tight tracking-tight truncate">
            {chapter.title}
          </h3>
          {chapter.summary && (
            <p className="mt-2 text-sm opacity-70 leading-relaxed line-clamp-2 max-w-2xl">
              {chapter.summary}
            </p>
          )}
        </div>
      </div>
      {isReadable ? (
        <span className={cn(
          "flex flex-none items-center gap-1.5 transition-transform group-hover:translate-x-0.5",
          editorialType.cta,
          toneKicker,
        )}>
          <BookOpen className="h-3.5 w-3.5" />
          {hasRead ? "Re-read" : "Read"}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      ) : (
        <span className={cn("flex flex-none flex-col items-end gap-0.5 opacity-50", editorialType.caption)}>
          <span>{chapter.status === "drafting" ? "Draft in motion" : "Coming soon"}</span>
          {sourceCount > 0 && (
            <span className={toneKicker}>
              {sourceCount} source{sourceCount === 1 ? "" : "s"}
            </span>
          )}
        </span>
      )}
    </article>
  );

  if (isReadable) {
    return <li><Link to={`/book/chapter/${chapter.slug}`}>{Inner}</Link></li>;
  }
  return <li>{Inner}</li>;
}

const FALLBACK_OUTLINE: Chapter[] = [
  { id: "1", slug: "naming-the-friction", order_index: 1, title: "Naming the Friction", phase: "GLITCH", summary: "Why the future arrives as a glitch first.", status: "outline", is_free_sample: false },
  { id: "2", slug: "pattern-exploration", order_index: 2, title: "Pattern Exploration", phase: "DRIFT", summary: "Wandering with discipline.", status: "outline", is_free_sample: false },
  { id: "3", slug: "intentional-commitment", order_index: 3, title: "Intentional Commitment", phase: "TUNE", summary: "Velocity = speed × direction.", status: "outline", is_free_sample: false },
  { id: "4", slug: "relational-infrastructure", order_index: 4, title: "Relational Infrastructure", phase: "LOVE", summary: "Trust, conflict, repair.", status: "outline", is_free_sample: false },
  { id: "5", slug: "pragmatic-imagination", order_index: 5, title: "Pragmatic Imagination", phase: "MAGIC", summary: "Worldbuilding as leadership skill.", status: "outline", is_free_sample: false },
  { id: "6", slug: "designing-the-system", order_index: 6, title: "Designing the System", phase: "CALM", summary: "From insight to ontology.", status: "outline", is_free_sample: false },
  { id: "7", slug: "living-the-ontology", order_index: 7, title: "Living the Ontology", phase: "OPEN", summary: "Where the designed system meets real workflow — ontology, graph, and the adjustment plan that keeps the org tunable.", status: "outline", is_free_sample: false },
  { id: "8", slug: "operating-in-flow", order_index: 8, title: "Operating in Flow", phase: "FREE", summary: "Continuous reconfiguration.", status: "outline", is_free_sample: false },
];
