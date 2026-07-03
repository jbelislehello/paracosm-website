import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Compass, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import ChromaText from "@/components/aesthetic/ChromaText";
import ReflectionNodes from "@/components/book/ReflectionNodes";

interface CompassDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  quote: string | null;
  quote_attribution: string | null;
  timing: string | null;
  tools: string[];
  practices: string[];
  phase_affinity: string[];
}

interface ChapterRef {
  slug: string;
  title: string;
  phase: string;
}

export default function BookCompass() {
  const { slug } = useParams();
  const [item, setItem] = useState<CompassDetail | null>(null);
  const [chapters, setChapters] = useState<ChapterRef[]>([]);
  const [loading, setLoading] = useState(true);

  usePageSeo({
    title: item ? `${item.name} — Compass — Calm Magic` : "Compass — Calm Magic",
    description: item?.description ?? "A compass from the Calm Magic book.",
    path: `/book/compasses/${slug ?? ""}`,
  });

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("book_compasses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!alive) return;
      const c = data as CompassDetail | null;
      setItem(c);
      if (c?.phase_affinity?.length) {
        const { data: chs } = await supabase
          .from("book_chapters")
          .select("slug, title, phase")
          .eq("status", "published")
          .in("phase", c.phase_affinity)
          .order("order_index");
        if (alive) setChapters((chs as ChapterRef[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(15_35%_92%)] dark:bg-[hsl(15_15%_14%)] text-foreground">
      <header className="fixed z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="h-8 w-8 rounded-lg bg-white p-1 object-contain" />
            <span className="font-display text-sm">Paracosm</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/book/compasses" className="flex items-center gap-1 text-xs uppercase tracking-widest text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> All compasses
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="h-6 w-6 animate-spin text-white/40" />
          </div>
        ) : !item ? (
          <div className="container mx-auto max-w-xl px-6 py-24 text-center">
            <h1 className="text-2xl font-bold">Compass not yet published</h1>
            <Link to="/book/compasses" className="mt-6 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to compasses
            </Link>
          </div>
        ) : (
          <article className="container mx-auto max-w-2xl px-6 py-12">
            <div className="mb-3 flex items-center gap-2 text-cyan-300">
              <Compass className="h-4 w-4" />
              <span className="text-xs uppercase tracking-widest">Compass</span>
            </div>
            <ChromaText as="h1" animated={false} className="font-display text-4xl leading-[0.95] md:text-5xl">
              {item.name}
            </ChromaText>
            {item.description && (
              <p className="mt-4 text-lg text-white/75">{item.description}</p>
            )}

            {item.quote && (
              <blockquote className="my-8 border-l-2 border-cyan-300/50 pl-4 italic text-white/70">
                "{item.quote}"
                {item.quote_attribution && (
                  <span className="not-italic block text-xs uppercase tracking-wider text-white/50">
                    — {item.quote_attribution}
                  </span>
                )}
              </blockquote>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {item.timing && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-white/40">When</div>
                  <p className="text-sm text-white/80">{item.timing}</p>
                </div>
              )}
              {item.phase_affinity.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-white/40">Phases</div>
                  <div className="flex flex-wrap gap-1">
                    {item.phase_affinity.map((p) => (
                      <Badge key={p} variant="outline" className="border-white/15 bg-white/5 text-[10px] uppercase tracking-wider">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {item.tools.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-white/40">Tools / prototypes</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-white/80">
                    {item.tools.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}
              {item.practices.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-white/40">Practices</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-white/80">
                    {item.practices.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {chapters.length > 0 && (
              <section className="mt-12 border-t border-white/10 pt-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
                  Appears alongside chapters
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {chapters.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/book/chapter/${c.slug}`}
                      className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                    >
                      <div className="text-[10px] uppercase tracking-wider text-white/40">{c.phase}</div>
                      <div className="mt-1 text-sm font-semibold text-white group-hover:text-cyan-200">{c.title}</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <ReflectionNodes compassSlug={item.slug} />
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
