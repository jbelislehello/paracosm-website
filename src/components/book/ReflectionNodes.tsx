import { useEffect, useState } from "react";
import { Sparkles, Shuffle, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ReflectionNode {
  id: string;
  chapter_slug: string | null;
  compass_slug: string | null;
  kind: string;
  title: string | null;
  body_md: string;
  source_ref: string | null;
  language: string;
  order_index: number;
}

const KIND_LABEL: Record<string, string> = {
  conversation_starter: "Conversation starter",
  reflection: "Reflection",
  fragment: "Fragment",
  bilingual_passage: "Passage",
};

interface Props {
  chapterSlug?: string;
  compassSlug?: string;
}

export default function ReflectionNodes({ chapterSlug, compassSlug }: Props) {
  const [nodes, setNodes] = useState<ReflectionNode[]>([]);
  const [randomIdx, setRandomIdx] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      let q = supabase
        .from("book_reflection_nodes")
        .select("*")
        .eq("status", "published")
        .order("order_index");
      if (chapterSlug) q = q.eq("chapter_slug", chapterSlug);
      if (compassSlug) q = q.eq("compass_slug", compassSlug);
      const { data } = await q;
      if (!alive) return;
      setNodes((data as ReflectionNode[]) ?? []);
    })();
    return () => {
      alive = false;
    };
  }, [chapterSlug, compassSlug]);

  if (nodes.length === 0) return null;

  const pullRandom = () => {
    setRandomIdx(Math.floor(Math.random() * nodes.length));
  };

  const random = randomIdx !== null ? nodes[randomIdx] : null;

  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-fuchsia-300" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/70">
            Reflection nodes
          </h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={pullRandom}
          className="border-white/15 bg-white/5 text-xs text-white/80 hover:bg-white/10"
        >
          <Shuffle className="mr-1 h-3 w-3" /> Pull a card
        </Button>
      </div>

      {random && (
        <article className="mb-6 rounded-2xl border border-fuchsia-300/30 bg-gradient-to-br from-fuchsia-500/10 to-rose-500/5 p-5">
          <NodeBody node={random} />
        </article>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {nodes.map((n) => (
          <article
            key={n.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
          >
            <NodeBody node={n} />
          </article>
        ))}
      </div>
    </section>
  );
}

function NodeBody({ node }: { node: ReflectionNode }) {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-white/15 bg-white/5 text-[10px] uppercase tracking-wider">
          {KIND_LABEL[node.kind] ?? node.kind}
        </Badge>
        {node.language === "fr" && (
          <Badge variant="outline" className="border-white/15 bg-white/5 text-[10px] uppercase tracking-wider">
            <Languages className="mr-1 h-3 w-3" /> FR
          </Badge>
        )}
      </div>
      {node.title && (
        <h3 className="mb-1 text-sm font-semibold text-white">{node.title}</h3>
      )}
      <p className="text-sm leading-relaxed text-white/80">{node.body_md}</p>
      {node.source_ref && (
        <p className="mt-2 text-[10px] uppercase tracking-wider text-white/40">
          {node.source_ref}
        </p>
      )}
    </>
  );
}
