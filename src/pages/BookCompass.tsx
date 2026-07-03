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
      <header className="fixed z-50 w-full border-b border-current/10 bg-[hsl(15_35%_92%)]/85 dark:bg-[hsl(15_15%_14%)]/85 backdrop-blur-md">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="h-8 w-8 rounded-lg bg-white p-1 object-contain" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">Paracosm</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/book/compasses" className="flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] opacity-70 hover:opacity-100">
              <ArrowLeft className="h-3 w-3" /> All compasses
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="h-6 w-6 animate-spin opacity-40" />
          </div>
        ) : !item ? (
          <div className="container mx-auto max-w-xl px-6 py-24 text-center">
            <h1 className="font-serif text-2xl">Compass not yet published</h1>
            <Link to="/book/compasses" className="mt-6 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] opacity-70 hover:opacity-100">
              <ArrowLeft className="h-3 w-3" /> Back to compasses
            </Link>
          </div>
        ) : (
          <article className="container mx-auto max-w-3xl px-6 py-16">
            <div className="mb-4 flex items-center gap-2 text-[hsl(345_65%_45%)]">
              <Compass className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-[0.35em] font-semibold">Compass</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.05]">
              {item.name}
            </h1>
            {item.description && (
              <p className="mt-5 text-lg opacity-75 font-serif italic">{item.description}</p>
            )}

            {item.quote && (
              <blockquote className="my-10 border-l-2 border-[hsl(345_65%_45%)]/50 pl-5 font-serif italic text-lg opacity-80">
                "{item.quote}"
                {item.quote_attribution && (
                  <span className="not-italic block mt-2 text-[10px] uppercase tracking-[0.3em] opacity-60">
                    — {item.quote_attribution}
                  </span>
                )}
              </blockquote>
            )}

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {item.timing && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-[0.3em] opacity-50">When</div>
                  <p className="text-sm opacity-80">{item.timing}</p>
                </div>
              )}
              {item.phase_affinity.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-[0.3em] opacity-50">Phases</div>
                  <div className="flex flex-wrap gap-1">
                    {item.phase_affinity.map((p) => (
                      <Badge key={p} variant="outline" className="border-current/20 bg-transparent text-[10px] uppercase tracking-[0.2em]">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {item.tools.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-[0.3em] opacity-50">Tools / prototypes</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm opacity-80">
                    {item.tools.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}
              {item.practices.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-[0.3em] opacity-50">Practices</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm opacity-80">
                    {item.practices.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {chapters.length > 0 && (
              <section className="mt-14 border-t border-current/10 pt-8">
                <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.35em] opacity-60">
                  Appears alongside chapters
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {chapters.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/book/chapter/${c.slug}`}
                      className="group rounded-sm border border-current/15 bg-background/40 p-4 transition-colors hover:border-[hsl(345_65%_45%)]/50"
                    >
                      <div className="text-[10px] uppercase tracking-[0.3em] opacity-50">{c.phase}</div>
                      <div className="mt-1 font-serif text-base group-hover:text-[hsl(345_65%_38%)]">{c.title}</div>
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
