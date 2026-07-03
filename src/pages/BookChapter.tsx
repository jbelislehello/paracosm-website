import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { articleSchema, CANONICAL_HOST } from "@/lib/structuredData";
import { useReaderProgress } from "@/hooks/useReaderProgress";
import { trackEvent } from "@/lib/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import BookLeadCaptureForm from "@/components/book/BookLeadCaptureForm";
import ReaderProgressBar from "@/components/book/ReaderProgressBar";

import ChapterCompasses from "@/components/book/ChapterCompasses";
import ReflectionNodes from "@/components/book/ReflectionNodes";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";


interface Chapter {
  id: string;
  slug: string;
  order_index: number;
  title: string;
  phase: string;
  summary: string | null;
  status: string;
  is_free_sample: boolean;
  published_excerpt: string | null;
  og_image_url: string | null;
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

// Tiny markdown → JSX renderer (headings, paragraphs, simple emphasis).
function renderMarkdown(md: string): JSX.Element[] {
  const blocks = md.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith("### ")) {
      return <h3 key={i} className={cn(editorialType.serif, "mt-10 text-xl md:text-2xl leading-tight tracking-tight")}>{inline(trimmed.slice(4))}</h3>;
    }
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className={cn(editorialType.serif, "mt-12 text-2xl md:text-3xl leading-tight tracking-tight")}>{inline(trimmed.slice(3))}</h2>;
    }
    if (trimmed.startsWith("# ")) {
      return <h1 key={i} className={cn(editorialType.serif, "mt-12 text-3xl md:text-4xl leading-tight tracking-tight")}>{inline(trimmed.slice(2))}</h1>;
    }
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote
          key={i}
          className={cn(
            editorialType.serif,
            "my-8 border-l-2 pl-6 italic text-xl md:text-2xl leading-snug opacity-90",
            editorialTone.warm.quoteBorder,
          )}
        >
          {inline(trimmed.slice(2))}
        </blockquote>
      );
    }
    if (/^[-*]\s/.test(trimmed)) {
      const items = trimmed.split(/\n/).map((l) => l.replace(/^[-*]\s/, ""));
      return (
        <ul key={i} className="my-5 list-disc space-y-1.5 pl-5 opacity-85">
          {items.map((it, j) => <li key={j}>{inline(it)}</li>)}
        </ul>
      );
    }
    return (
      <p key={i} className="my-5 text-[17px] md:text-lg leading-[1.75] opacity-90">
        {inline(trimmed)}
      </p>
    );
  });
}

function inline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else parts.push(<em key={key++} className="italic">{tok.slice(1, -1)}</em>);
    lastIdx = m.index + tok.length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

interface NavChapter {
  slug: string;
  title: string;
  phase: string;
  order_index: number;
}

export default function BookChapter() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const edition = searchParams.get("edition") === "pragmatic" ? "pragmatic" : "visionary";
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [siblings, setSiblings] = useState<NavChapter[]>([]);
  const [pragmaticBody, setPragmaticBody] = useState<string | null>(null);
  const [visionaryBody, setVisionaryBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { markRead } = useReaderProgress();
  const warm = editorialTone.warm;

  const image =
    chapter?.og_image_url?.trim() ||
    (slug ? `https://calm-magic.com/og/book-${slug}.svg` : undefined);

  const chapterTitle = chapter
    ? `${chapter.title} — Calm Magic${edition === "pragmatic" ? " · Operator's Cut" : ""}`
    : "Chapter — Calm Magic";
  const chapterDesc = chapter?.summary ?? "A free chapter from the Calm Magic book.";

  const jsonLd = useMemo(() => {
    if (!chapter) return undefined;
    return {
      ...articleSchema({
        title: chapterTitle,
        description: chapterDesc,
        url: `/book/chapter/${chapter.slug}`,
        image,
      }),
      isPartOf: {
        "@type": "Book",
        name: "Calm Magic",
        url: `${CANONICAL_HOST}/book`,
      },
    };
  }, [chapter, chapterTitle, chapterDesc, image]);

  usePageSeo({
    title: chapterTitle,
    description: chapterDesc,
    path: `/book/chapter/${slug ?? ""}`,
    image,
    ogType: "article",
    jsonLd,
  });




  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      if (!slug) return;
      const [{ data: ch }, { data: sibs }] = await Promise.all([
        supabase.from("book_chapters").select("*").eq("slug", slug).maybeSingle(),
        supabase
          .from("book_chapters")
          .select("slug, title, phase, order_index")
          .eq("status", "published")
          .order("order_index", { ascending: true }),
      ]);
      if (!alive) return;
      setChapter((ch as Chapter) ?? null);
      setSiblings((sibs as NavChapter[]) ?? []);

      if (ch?.id) {
        const { data: drafts } = await supabase
          .from("book_chapter_drafts")
          .select("audience, draft_md")
          .eq("chapter_id", (ch as Chapter).id)
          .in("audience", ["pragmatic", "general", "visionary"])
          .eq("is_current", true);
        if (!alive) return;
        const list = (drafts ?? []) as { audience: string; draft_md: string }[];
        const prag = list.find((d) => d.audience === "pragmatic");
        const vis = list.find((d) => d.audience === "visionary") ?? list.find((d) => d.audience === "general");
        setPragmaticBody(prag?.draft_md ?? null);
        setVisionaryBody(vis && (vis.draft_md?.length ?? 0) > 500 ? vis.draft_md : null);
      } else {
        setPragmaticBody(null);
        setVisionaryBody(null);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  useEffect(() => {
    if (chapter?.status === "published" && chapter.published_excerpt) {
      markRead(chapter.slug, chapter.phase);
      void trackEvent("book_chapter_read", {
        slug: chapter.slug,
        phase: chapter.phase,
        order_index: chapter.order_index,
      });
    }
  }, [chapter, markRead]);

  const idx = chapter ? siblings.findIndex((s) => s.slug === chapter.slug) : -1;
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <div className={cn("flex min-h-screen flex-col", warm.section)}>
      <header className="fixed z-50 w-full border-b border-current/10 bg-[hsl(35_45%_96%/0.9)] backdrop-blur-md">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="h-8 w-8 rounded-lg bg-white p-1 object-contain"
            />
            <span className={cn(editorialType.serif, "text-lg")}>Paracosm</span>
          </Link>
          <div className={cn("flex items-center gap-4", editorialType.caption)}>
            <Link to="/book" className="inline-flex items-center gap-1 opacity-70 transition-opacity hover:opacity-100">
              <ArrowLeft className="h-3 w-3" /> Back to book
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {loading ? (
          <div className="container mx-auto flex max-w-2xl justify-center py-32">
            <Loader2 className="h-6 w-6 animate-spin opacity-40" />
          </div>
        ) : !chapter ? (
          <NotFoundState />
        ) : (
          <article className="container mx-auto max-w-2xl px-6 py-12">
            <ReaderProgressBar compact className="mb-10" />

            <div className="flex items-baseline gap-6 mb-8 border-b border-current/15 pb-6">
              <span className={cn(editorialType.serif, "text-5xl md:text-6xl leading-none tabular-nums", warm.numeral)}>
                {String(chapter.order_index).padStart(2, "0")}
              </span>
              <div className={cn("flex flex-wrap items-baseline gap-x-4 gap-y-1", editorialType.caption)}>
                <span className={warm.kicker}>Chapter {chapter.order_index}</span>
                <span className="opacity-60">{PHASE_LABEL[chapter.phase] ?? chapter.phase}</span>
                {chapter.is_free_sample && (
                  <span className={cn("border-b", warm.accentBorder, warm.kicker)}>Free sample</span>
                )}
              </div>
            </div>

            <h1 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[0.98] tracking-tight")}>
              {chapter.title}
            </h1>
            {chapter.summary && (
              <p className={cn(editorialType.serif, "mt-5 text-xl md:text-2xl italic font-light leading-tight opacity-80")}>
                {chapter.summary}
              </p>
            )}

            {/* Edition switch */}
            <div className={cn("mt-10 inline-flex border border-current/25 rounded-sm overflow-hidden", editorialType.cta)}>
              <button
                type="button"
                onClick={() => { searchParams.delete("edition"); setSearchParams(searchParams, { replace: true }); }}
                className={cn(
                  "px-4 py-2 transition-colors",
                  edition === "visionary" ? warm.ctaPrimary : "opacity-70 hover:opacity-100",
                )}
              >
                Field Guide
              </button>
              <button
                type="button"
                onClick={() => { searchParams.set("edition", "pragmatic"); setSearchParams(searchParams, { replace: true }); }}
                disabled={!pragmaticBody}
                className={cn(
                  "px-4 py-2 border-l border-current/25 transition-colors",
                  edition === "pragmatic" ? warm.ctaPrimary : "opacity-70 hover:opacity-100",
                  !pragmaticBody && "opacity-30 cursor-not-allowed hover:opacity-30",
                )}
                title={pragmaticBody ? "Operator's Cut — 90-minute pragmatic edition" : "Operator's Cut not yet available for this chapter"}
              >
                Operator's Cut
              </button>
            </div>

            <div className="mt-10 border-t border-current/15 pt-10">
              {edition === "pragmatic" && pragmaticBody ? (
                renderMarkdown(pragmaticBody)
              ) : visionaryBody ? (
                renderMarkdown(visionaryBody)
              ) : chapter.status === "published" && chapter.published_excerpt ? (
                renderMarkdown(chapter.published_excerpt)
              ) : (
                <DraftPlaceholder slug={chapter.slug} />
              )}
            </div>

            <ChapterCompasses phase={chapter.phase} />
            <ReflectionNodes chapterSlug={chapter.slug} />

            {(prev || next) && (
              <nav className="mt-16 grid gap-0 border-t border-current/20 sm:grid-cols-2">
                {prev ? (
                  <Link
                    to={`/book/chapter/${prev.slug}`}
                    className="group flex flex-col gap-1 py-6 pr-6 sm:border-r border-current/20 hover:bg-current/[0.04] transition-colors"
                  >
                    <div className={cn("flex items-center gap-1", editorialType.caption, warm.kicker)}>
                      <ArrowLeft className="h-3 w-3" /> Previous · {PHASE_LABEL[prev.phase] ?? prev.phase}
                    </div>
                    <div className={cn(editorialType.serif, "text-lg md:text-xl leading-tight")}>{prev.title}</div>
                  </Link>
                ) : <span />}
                {next ? (
                  <Link
                    to={`/book/chapter/${next.slug}`}
                    className="group flex flex-col gap-1 py-6 pl-6 sm:text-right hover:bg-current/[0.04] transition-colors"
                  >
                    <div className={cn("flex items-center sm:justify-end gap-1", editorialType.caption, warm.kicker)}>
                      Next · {PHASE_LABEL[next.phase] ?? next.phase} <ArrowRight className="h-3 w-3" />
                    </div>
                    <div className={cn(editorialType.serif, "text-lg md:text-xl leading-tight")}>{next.title}</div>
                  </Link>
                ) : <span />}
              </nav>
            )}

            <aside className={cn("mt-16 border p-8", warm.calloutBox)}>
              <p className={cn(editorialType.kicker, warm.kicker, "mb-3 inline-flex items-center gap-2")}>
                <BookOpen className="h-3 w-3" />
                Get the next chapter early
              </p>
              <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight italic font-light")}>
                Send me what's next.
              </h3>
              <p className="mt-3 mb-5 text-sm opacity-75 leading-relaxed">
                Drop your email and we'll send the next published chapter the moment it's ready.
              </p>
              <BookLeadCaptureForm
                source={`book_chapter_${chapter.slug}`}
                interest="waitlist"
                chapterSlug={chapter.slug}
                cta="Send me the next chapter"
              />
            </aside>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="container mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className={cn(editorialType.serif, "text-3xl md:text-4xl leading-tight")}>Chapter not yet available</h1>
      <p className="mt-3 opacity-70">
        This chapter is still being assembled. Join the waitlist and we'll send it
        the moment it's ready.
      </p>
      <div className="mt-6">
        <BookLeadCaptureForm source="book_chapter_not_found" interest="waitlist" />
      </div>
      <Link to="/book" className={cn("mt-8 inline-flex items-center gap-1 opacity-70 hover:opacity-100", editorialType.caption)}>
        <ArrowLeft className="h-3 w-3" /> Back to all chapters
      </Link>
    </div>
  );
}

function DraftPlaceholder({ slug }: { slug: string }) {
  const warm = editorialTone.warm;
  return (
    <div className={cn("border p-6 text-sm opacity-85", warm.calloutBox)}>
      <p>
        This chapter is still being drafted from the site's living archive. We
        publish samples as drafts are reviewed.
      </p>
      <div className="mt-4">
        <BookLeadCaptureForm
          source={`book_chapter_draft_${slug}`}
          interest="waitlist"
          chapterSlug={slug}
          cta="Notify me when it's ready"
        />
      </div>
    </div>
  );
}
