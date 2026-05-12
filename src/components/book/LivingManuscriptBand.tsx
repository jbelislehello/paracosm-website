import { useEffect, useState } from "react";
import { BookOpen, FileStack, FileUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function LivingManuscriptBand() {
  const [stats, setStats] = useState({ chapters: 0, drafts: 0, sources: 0 });

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ count: drafts }, { count: chapters }, { count: sources }] =
        await Promise.all([
          supabase
            .from("book_chapters")
            .select("*", { count: "exact", head: true })
            .neq("status", "outline"),
          supabase
            .from("book_chapters")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("book_sources")
            .select("*", { count: "exact", head: true }),
        ]);
      if (alive) {
        setStats({
          chapters: chapters ?? 7,
          drafts: drafts ?? 0,
          sources: sources ?? 0,
        });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="border-y border-white/5 bg-white/[0.02] px-6 py-12">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold md:text-2xl">
            This book is being written from the work happening on this site.
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/55">
            Essays, PRDs, drift entries, retreat field notes, and uploaded
            manuscript material are mapped to chapters and synthesized into
            drafts. You see the living index — not a finished artifact pretending
            to be inevitable.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
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
    <Card className="flex items-center gap-3 border-white/10 bg-white/[0.03] p-4">
      <Icon className="h-5 w-5 text-fuchsia-300" />
      <div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="mt-1 text-[11px] uppercase tracking-wider text-white/50">
          {label}
        </div>
      </div>
    </Card>
  );
}
