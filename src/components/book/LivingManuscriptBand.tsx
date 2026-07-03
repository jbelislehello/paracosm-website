import { useEffect, useState } from "react";
import { BookOpen, FileStack, FileUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";

export default function LivingManuscriptBand() {
  const [stats, setStats] = useState({ chapters: 0, drafts: 0, sources: 0 });
  const t = editorialTone.paper;

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.rpc("get_book_stats");
      const row = Array.isArray(data) ? data[0] : data;
      if (alive && row) {
        setStats({
          chapters: row.chapters ?? 0,
          drafts: row.drafts ?? 0,
          sources: row.sources ?? 0,
        });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className={cn("border-y border-current/15 px-6 py-16 md:py-20", t.section)}>
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-baseline gap-6 mb-6">
          <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", t.numeral)}>§</span>
          <p className={cn(editorialType.kicker, t.kicker)}>Live transmission</p>
        </div>
        <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-3xl")}>
          This book is being written <em className="italic font-light">from the work</em> happening on this site.
        </h2>
        <p className="mt-4 max-w-2xl text-base opacity-75 leading-relaxed">
          Essays, PRDs, drift entries, retreat field notes, and uploaded manuscript
          material are mapped to chapters and synthesized into drafts. You see the
          living index — not a finished artifact pretending to be inevitable.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-6 md:gap-10 border-t border-current/15 pt-8">
          <Stat icon={BookOpen} label="Chapters" value={stats.chapters} />
          <Stat icon={FileStack} label="Drafts in motion" value={stats.drafts} />
          <Stat icon={FileUp} label="Sources mapped" value={stats.sources} />
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Icon className="h-4 w-4 opacity-60" />
      <div className={cn(editorialType.serif, "text-4xl md:text-6xl leading-none tabular-nums")}>{value}</div>
      <div className={cn(editorialType.caption, "opacity-70")}>{label}</div>
    </div>
  );
}
