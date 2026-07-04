import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { REHEARSAL_ARC_PROGRAM, rehearsalOfferingsByTier } from "@/data/rehearsalArcProgram";
import { STATE_META, STATE_ORDER, TIER_META, type CalmMagicState, type ArcTier } from "@/data/rehearsalArcMeta";
import { usePageSeo } from "@/hooks/usePageSeo";
import Footer from "@/components/Footer";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import { editorialType, editorialTone } from "@/components/editorial/editorialTokens";
import GatedDownloadButton from "@/components/rehearsal/GatedDownloadButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ProgressRow = {
  playbook_id: string;
  completed_steps: string[] | null;
  updated_at: string | null;
};

const playbookId = (slug: string) => `rehearsal-arc:${slug}`;

export default function MyRehearsalArc() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, Set<CalmMagicState>>>({});
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  usePageSeo({
    title: "My Rehearsal Arc — Trainings, Retreats & Residencies | Paracosm",
    description: "Your personal dashboard for the Rehearsal Arc — enrollments, roadmaps, playbooks and learning tracks.",
    path: "/dashboard/rehearsal-arc",
  });

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth?redirect=/dashboard/rehearsal-arc");
        return;
      }
      setUserId(session.user.id);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) navigate("/auth?redirect=/dashboard/rehearsal-arc");
      else setUserId(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const ids = REHEARSAL_ARC_PROGRAM.map((o) => playbookId(o.slug));
      const { data, error } = await supabase
        .from("playbook_progress")
        .select("playbook_id, completed_steps, updated_at")
        .eq("user_id", userId)
        .in("playbook_id", ids);
      if (error) return;
      const map: Record<string, Set<CalmMagicState>> = {};
      (data as ProgressRow[] | null)?.forEach((row) => {
        const slug = row.playbook_id.replace("rehearsal-arc:", "");
        map[slug] = new Set((row.completed_steps ?? []) as CalmMagicState[]);
      });
      setProgress(map);
    })();
  }, [userId]);

  const toggleState = async (slug: string, state: CalmMagicState) => {
    if (!userId) return;
    setSavingSlug(slug);
    const current = new Set(progress[slug] ?? []);
    if (current.has(state)) current.delete(state);
    else current.add(state);
    const nextArr = STATE_ORDER.filter((s) => current.has(s));

    // Upsert row keyed on (user_id, playbook_id). The table has no unique
    // constraint on that pair, so do a manual "select → insert or update".
    const pid = playbookId(slug);
    const { data: existing } = await supabase
      .from("playbook_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("playbook_id", pid)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from("playbook_progress")
        .update({
          completed_steps: nextArr,
          current_step_index: nextArr.length,
          updated_at: new Date().toISOString(),
          ...(nextArr.length === STATE_ORDER.length ? { completed_at: new Date().toISOString() } : {}),
        })
        .eq("id", existing.id);
      if (error) toast.error("Could not save progress");
    } else {
      const { error } = await supabase.from("playbook_progress").insert({
        user_id: userId,
        playbook_id: pid,
        garden: "rehearsal-arc",
        mode: "arc",
        completed_steps: nextArr,
        current_step_index: nextArr.length,
        started_at: new Date().toISOString(),
      });
      if (error) toast.error("Could not save progress");
    }
    setProgress((p) => ({ ...p, [slug]: current }));
    setSavingSlug(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-6 h-6 animate-spin opacity-60" />
      </div>
    );
  }

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      <EditorialSection tone="warm" className="pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-4xl space-y-5">
          <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>Your dashboard</p>
          <h1 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[1] tracking-tight")}>
            My Rehearsal Arc
          </h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            Your trainings, retreats and residencies — each one a roadmap through
            the five cognitive states. Tick a state as you rehearse it; your progress
            is saved to your account.
          </p>
        </div>
      </EditorialSection>

      <EditorialSection tone="paper">
        <EditorialChapterHeader
          numeral="I"
          kicker="Downloads"
          subtitle="Print-ready facilitator materials — full program."
          tone="paper"
        />
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
          <GatedDownloadButton
            href="/downloads/rehearsal-arc-facilitator-deck.pdf"
            filename="rehearsal-arc-facilitator-deck.pdf"
            label="Facilitator deck"
            sublabel="32 slides · state-scored · read-aloud cues"
          />
          <GatedDownloadButton
            href="/downloads/rehearsal-arc-workbook.pdf"
            filename="rehearsal-arc-workbook.pdf"
            label="Facilitator workbook"
            sublabel="Full 9-offering workbook · exercises, roadmaps, contracts"
          />
        </div>
      </EditorialSection>

      {(Object.keys(TIER_META) as ArcTier[]).map((tierKey, tIdx) => {
        const tier = TIER_META[tierKey];
        const offerings = rehearsalOfferingsByTier(tierKey);
        const t = editorialTone[tier.tone];
        return (
          <section key={tierKey} className={cn("py-16 md:py-24 px-6", t.section)}>
            <div className="container max-w-7xl mx-auto">
              <EditorialChapterHeader
                numeral={`0${tIdx + 2}`}
                kicker={`${tier.label} · ${tier.phase}`}
                subtitle={tier.blurb}
                tone={tier.tone}
              />
              <div className="grid md:grid-cols-1 gap-6">
                {offerings.map((o) => {
                  const done = progress[o.slug] ?? new Set<CalmMagicState>();
                  const pct = Math.round((done.size / STATE_ORDER.length) * 100);
                  return (
                    <div
                      key={o.slug}
                      className={cn("rounded-2xl border p-6 md:p-8", t.calloutBox)}
                    >
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 mb-4">
                        <div>
                          <p className={editorialType.caption}>{tier.kicker}</p>
                          <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl mt-1")}>
                            {o.title}
                          </h3>
                          <p className="text-sm opacity-75 mt-1">{o.tagline}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-[0.25em] opacity-60">
                            Progress
                          </div>
                          <div className={cn(editorialType.serif, "text-3xl")}>{pct}%</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2 mb-5">
                        {STATE_ORDER.map((s) => {
                          const meta = STATE_META[s];
                          const isDone = done.has(s);
                          return (
                            <button
                              key={s}
                              onClick={() => toggleState(o.slug, s)}
                              disabled={savingSlug === o.slug}
                              className={cn(
                                "group text-left rounded-xl border p-3 transition-all",
                                isDone
                                  ? "border-current/40 bg-current/10"
                                  : "border-current/15 hover:border-current/30",
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ background: meta.accent }}
                                />
                                {isDone && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div className={cn(editorialType.eyebrow, "!text-[9px]")}>
                                {meta.label}
                              </div>
                              <div className="text-[11px] opacity-70 mt-0.5 line-clamp-1">
                                {meta.role}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-3 items-center">
                        <Button asChild size="sm" variant="secondary">
                          <Link to={`/programs/rehearsal-arc/${o.slug}`}>
                            Open playbook <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </Link>
                        </Button>
                        <span className="text-xs opacity-60">{o.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <EditorialSection tone="warm">
        <div className="max-w-3xl space-y-4">
          <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>Learning tracks</p>
          <h2 className={cn(editorialType.serif, "text-3xl md:text-4xl")}>
            Where to go next
          </h2>
          <p className="opacity-80 text-sm">
            Explore the full trainings library to layer additional skills onto
            your Rehearsal Arc.
          </p>
          <Button asChild variant="outline">
            <Link to="/trainings">Browse all trainings</Link>
          </Button>
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
}
