import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useReaderProgress } from "@/hooks/useReaderProgress";
import { trackEvent } from "@/lib/analytics";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import BookLeadCaptureForm from "@/components/book/BookLeadCaptureForm";
import ReaderProgressBar from "@/components/book/ReaderProgressBar";
import ChromaText from "@/components/aesthetic/ChromaText";
import ScanlineOverlay from "@/components/aesthetic/ScanlineOverlay";
import ChapterCompasses from "@/components/book/ChapterCompasses";
import ReflectionNodes from "@/components/book/ReflectionNodes";

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
// Avoids pulling in a heavy library for a single page.
function renderMarkdown(md: string): JSX.Element[] {
  const blocks = md.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith("### ")) {
      return <h3 key={i} className="mt-8 text-lg font-semibold text-white">{inline(trimmed.slice(4))}</h3>;
    }
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className="mt-10 text-2xl font-bold text-white">{inline(trimmed.slice(3))}</h2>;
    }
    if (trimmed.startsWith("# ")) {
      return <h1 key={i} className="mt-10 text-3xl font-bold text-white">{inline(trimmed.slice(2))}</h1>;
    }
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote key={i} className="my-6 border-l-2 border-fuchsia-300/50 pl-4 italic text-white/70">
          {inline(trimmed.slice(2))}
        </blockquote>
      );
    }
    if (/^[-*]\s/.test(trimmed)) {
      const items = trimmed.split(/\n/).map((l) => l.replace(/^[-*]\s/, ""));
      return (
        <ul key={i} className="my-4 list-disc space-y-1 pl-5 text-white/80">
          {items.map((it, j) => <li key={j}>{inline(it)}</li>)}
        </ul>
      );
    }
    return (
      <p key={i} className="my-4 leading-relaxed text-white/85">
        {inline(trimmed)}
      </p>
    );
  });
}

function inline(text: string): React.ReactNode {
  // bold then italic
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else parts.push(<em key={key++}>{tok.slice(1, -1)}</em>);
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
  const [loading, setLoading] = useState(true);
  const { markRead } = useReaderProgress();

  usePageSeo({
    title: chapter ? `${chapter.title} — Calm Magic${edition === "pragmatic" ? " · Operator's Cut" : ""}` : "Chapter — Calm Magic",
    description: chapter?.summary ?? "A free chapter from the Calm Magic book.",
    path: `/book/chapter/${slug ?? ""}`,
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

      // Fetch the pragmatic (Operator's Cut) draft if requested
      if (ch?.id) {
        const { data: prag } = await supabase
          .from("book_chapter_drafts")
          .select("draft_md")
          .eq("chapter_id", (ch as Chapter).id)
          .eq("audience", "pragmatic")
          .eq("is_current", true)
          .maybeSingle();
        if (!alive) return;
        setPragmaticBody((prag as { draft_md?: string } | null)?.draft_md ?? null);
      } else {
        setPragmaticBody(null);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  // Mark this chapter as read once it loads as published
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="fixed z-50 w-full overflow-hidden border-b border-[hsl(var(--bloom-magenta)/0.25)] bg-[hsl(var(--bloom-ink)/0.85)] backdrop-blur-md">
        <ScanlineOverlay />
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="h-8 w-8 rounded-lg bg-white p-1 object-contain"
            />
            <span className="font-display text-sm text-[hsl(var(--bloom-cream))]">Paracosm</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/book" className="flex items-center gap-1 font-vhs text-xs uppercase tracking-widest text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to book
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {loading ? (
          <div className="container mx-auto flex max-w-2xl justify-center py-32">
            <Loader2 className="h-6 w-6 animate-spin text-white/40" />
          </div>
        ) : !chapter ? (
          <NotFoundState />
        ) : (
          <article className="container mx-auto max-w-2xl px-6 py-12">
            <ReaderProgressBar compact className="mb-8" />

            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-white/15 bg-white/5 text-[10px] uppercase tracking-wider">
                Chapter {chapter.order_index}
              </Badge>
              <Badge variant="outline" className="border-white/15 bg-white/5 text-[10px] uppercase tracking-wider">
                {PHASE_LABEL[chapter.phase] ?? chapter.phase}
              </Badge>
              {chapter.is_free_sample && (
                <Badge className="bg-white text-slate-900 text-[10px] uppercase tracking-wider">
                  Free sample
                </Badge>
              )}
            </div>
            <ChromaText
              as="h1"
              animated={false}
              className="font-display text-4xl leading-[0.95] tracking-tight text-[hsl(var(--bloom-cream))] md:text-6xl"
            >
              {chapter.title}
            </ChromaText>
            {chapter.summary && (
              <p className="mt-4 font-redacted text-lg italic text-white/70">{chapter.summary}</p>
            )}

            <div className="mt-10 border-t border-white/10 pt-8">
              {chapter.status === "published" && chapter.published_excerpt ? (
                renderMarkdown(chapter.published_excerpt)
              ) : (
                <DraftPlaceholder slug={chapter.slug} />
              )}
            </div>

            <ChapterCompasses phase={chapter.phase} />
            <ReflectionNodes chapterSlug={chapter.slug} />

            {(prev || next) && (
              <nav className="mt-12 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link
                    to={`/book/chapter/${prev.slug}`}
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/40">
                      <ArrowLeft className="h-3 w-3" /> Previous · {PHASE_LABEL[prev.phase] ?? prev.phase}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">{prev.title}</div>
                  </Link>
                ) : <span />}
                {next ? (
                  <Link
                    to={`/book/chapter/${next.slug}`}
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 text-right transition-colors hover:border-white/20 hover:bg-white/[0.06] sm:text-right"
                  >
                    <div className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-white/40">
                      Next · {PHASE_LABEL[next.phase] ?? next.phase} <ArrowRight className="h-3 w-3" />
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">{next.title}</div>
                  </Link>
                ) : <span />}
              </nav>
            )}

            <aside className="mt-12 rounded-2xl border border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-500/10 to-rose-500/5 p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-fuchsia-300" />
                Get the next chapter early
              </div>
              <p className="mb-4 text-sm text-white/70">
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
      <h1 className="text-2xl font-bold">Chapter not yet available</h1>
      <p className="mt-2 text-white/60">
        This chapter is still being assembled. Join the waitlist and we'll send it
        the moment it's ready.
      </p>
      <div className="mt-6">
        <BookLeadCaptureForm source="book_chapter_not_found" interest="waitlist" />
      </div>
      <Link to="/book" className="mt-8 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-3 w-3" /> Back to all chapters
      </Link>
    </div>
  );
}

function DraftPlaceholder({ slug }: { slug: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
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
