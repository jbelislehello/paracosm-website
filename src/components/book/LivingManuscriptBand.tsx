import { useEffect, useState } from "react";
import { BookOpen, FileStack, FileUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function LivingManuscriptBand() {
  const [stats, setStats] = useState({ chapters: 0, drafts: 0, sources: 0 });

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
    <section className="relative overflow-hidden border-y border-[hsl(var(--bloom-magenta)/0.25)] bg-[hsl(var(--bloom-ink)/0.6)] px-6 py-14">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--bloom-magenta))] to-transparent" />
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <div className="mb-2 font-vhs text-xs uppercase tracking-[0.4em] text-[hsl(var(--bloom-amber))]">
            ▶ live transmission
          </div>
          <h2 className="font-display text-2xl leading-tight text-[hsl(var(--bloom-cream))] md:text-4xl">
            This book is being written from the work happening on this site.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-tight text-sm text-white/60">
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
    <Card className="flex items-center gap-3 border-[hsl(var(--bloom-magenta)/0.25)] bg-[hsl(var(--bloom-violet)/0.18)] p-4 backdrop-blur-sm">
      <Icon className="h-5 w-5 text-[hsl(var(--bloom-amber))]" />
      <div>
        <div className="font-display text-3xl leading-none text-[hsl(var(--bloom-cream))]">{value}</div>
        <div className="mt-1 font-vhs text-xs uppercase tracking-[0.3em] text-white/55">
          {label}
        </div>
      </div>
    </Card>
  );
}
