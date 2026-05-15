import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CompassRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  phase_affinity: string[];
}

export default function ChapterCompasses({ phase }: { phase: string }) {
  const [items, setItems] = useState<CompassRow[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("book_compasses")
        .select("id, slug, name, description, phase_affinity")
        .eq("status", "published")
        .contains("phase_affinity", [phase])
        .order("order_index");
      if (!alive) return;
      setItems((data as CompassRow[]) ?? []);
    })();
    return () => {
      alive = false;
    };
  }, [phase]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <div className="mb-6 flex items-center gap-2">
        <Compass className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/70">
          Compasses for this phase
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((c) => (
          <Link
            key={c.id}
            to={`/book/compasses/${c.slug}`}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-cyan-300/40 hover:bg-white/[0.06]"
          >
            <div className="text-sm font-semibold text-white group-hover:text-cyan-200">
              {c.name}
            </div>
            {c.description && (
              <p className="mt-1 text-xs text-white/65">{c.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
