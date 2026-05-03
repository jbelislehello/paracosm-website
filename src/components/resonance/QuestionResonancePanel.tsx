import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import type { ResonanceMapData } from "@/lib/resonance";
import { saveLastResonance } from "@/lib/resonanceStorage";
import ResonanceMap from "./ResonanceMap";
import PathSuggestion from "./PathSuggestion";

const EXAMPLES = [
  "How do we onboard an enterprise client without losing our soul?",
  "What governance fits an autonomous design team?",
  "Where does Calm Magic meet the OECD AI principles?",
];

interface QuestionResonancePanelProps {
  onMapped?: (data: ResonanceMapData) => void;
  onTileClick?: (tileId: number) => void;
  defaultQuestion?: string;
}

export default function QuestionResonancePanel({
  onMapped,
  onTileClick,
  defaultQuestion = "",
}: QuestionResonancePanelProps) {
  const [question, setQuestion] = useState(defaultQuestion);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResonanceMapData | null>(null);

  const submit = async () => {
    const q = question.trim();
    if (q.length < 3) {
      toast.error("Ask a real question first.");
      return;
    }
    setLoading(true);
    const startedAt = performance.now();
    void trackEvent("resonance_question_submitted", { length: q.length });
    try {
      const { data, error } = await supabase.functions.invoke(
        "map-question-to-board",
        { body: { question: q } },
      );
      if (error) throw error;
      if ((data as { error?: string })?.error) {
        throw new Error((data as { error: string }).error);
      }
      const mapped = data as ResonanceMapData;
      setResult(mapped);
      onMapped?.(mapped);
      const top = [...mapped.axes].sort((a, b) => b.score - a.score)[0];
      void trackEvent("resonance_returned", {
        topAxis: top?.axis,
        topScore: top?.score,
        latencyMs: Math.round(performance.now() - startedAt),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Mapping failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Your question
        </label>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask the question your team is sitting with…"
          rows={3}
          className="mt-2 resize-none"
          disabled={loading}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQuestion(ex)}
              disabled={loading}
              className="rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={submit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mapping…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Map to the board
              </>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <>
          <ResonanceMap data={result} onTileClick={onTileClick} />
          <PathSuggestion data={result} />
        </>
      )}
    </div>
  );
}
