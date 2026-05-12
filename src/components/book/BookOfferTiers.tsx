import { useState } from "react";
import { Check, Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BookLeadCaptureForm from "./BookLeadCaptureForm";

export default function BookOfferTiers() {
  const [loadingCohort, setLoadingCohort] = useState(false);

  const startCohortCheckout = async () => {
    setLoadingCohort(true);
    try {
      const { data, error } = await supabase.functions.invoke("book-checkout-cohort", {
        body: {},
      });
      if (error) throw error;
      const url = (data as { url?: string })?.url;
      if (url) window.open(url, "_blank");
    } catch (err) {
      toast.error("Checkout unavailable", { description: (err as Error).message });
    } finally {
      setLoadingCohort(false);
    }
  };

  return (
    <section id="offer" className="px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <Badge className="mb-3 border-white/20 bg-white/10 text-white">
            <Sparkles className="mr-1 h-3 w-3" />
            Three ways in
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Read first. Practice next. Bring your team.</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/60">
            The book is the entry point. The cohort puts the framework in your hands.
            The org license embeds it in your operating system.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Free chapter */}
          <Card className="flex flex-col border-white/10 bg-white/[0.04] p-6">
            <div className="text-xs uppercase tracking-wider text-white/50">Free</div>
            <div className="mt-2 text-2xl font-bold">Sample chapter</div>
            <div className="mt-1 text-sm text-white/60">
              Read the GL!TCH chapter the moment it's ready. We'll email you when it drops.
            </div>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              <Li>One free chapter</Li>
              <Li>Launch updates</Li>
              <Li>No spam, unsubscribe anytime</Li>
            </ul>
            <div className="mt-6 flex-1" />
            <BookLeadCaptureForm
              source="book_offer_tier_free"
              interest="sample"
              cta="Send me the chapter"
              placeholder="you@email.com"
            />
          </Card>

          {/* Cohort */}
          <Card className="relative flex flex-col border-fuchsia-400/30 bg-gradient-to-b from-fuchsia-500/10 to-rose-500/5 p-6 ring-1 ring-fuchsia-300/20">
            <Badge className="absolute -top-3 right-4 bg-white text-slate-900 text-[10px] uppercase tracking-wider">
              Most popular
            </Badge>
            <div className="text-xs uppercase tracking-wider text-fuchsia-200/80">Practitioner</div>
            <div className="mt-2 text-2xl font-bold">Cohort + signed book</div>
            <div className="mt-1 flex items-baseline gap-1 text-sm text-white/60">
              <span className="text-3xl font-bold text-white">$497</span>
              <span>· one-time</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-white/80">
              <Li>Signed hardcover + digital + audiobook</Li>
              <Li>6-week practitioner cohort with Jonathan</Li>
              <Li>GL!TCH, Drift, Tune playbooks (workbook)</Li>
              <Li>Private community of operators</Li>
            </ul>
            <div className="mt-6 flex-1" />
            <Button
              onClick={startCohortCheckout}
              disabled={loadingCohort}
              className="w-full bg-white font-semibold text-slate-900 hover:bg-white/90"
            >
              {loadingCohort ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Reserve my seat"
              )}
            </Button>
          </Card>

          {/* Org */}
          <Card className="flex flex-col border-white/10 bg-white/[0.04] p-6">
            <div className="text-xs uppercase tracking-wider text-white/50">Organization</div>
            <div className="mt-2 text-2xl font-bold">Org license + workshop</div>
            <div className="mt-1 text-sm text-white/60">
              Book pack, internal workshop, and embedded coaching for your leadership team.
            </div>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              <Li>Bulk hardcover + digital licenses</Li>
              <Li>Half-day Calm Magic workshop</Li>
              <Li>Crewdle.ai pilot included</Li>
              <Li>Quarterly executive office hours</Li>
            </ul>
            <div className="mt-6 flex-1" />
            <BookLeadCaptureForm
              source="book_offer_tier_org"
              interest="org"
              cta="Talk to us"
              placeholder="work@company.com"
            />
            <div className="mt-2 flex items-center gap-1 text-[11px] text-white/40">
              <Mail className="h-3 w-3" /> jbelisle@helloarchitekt.com
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="mt-0.5 h-4 w-4 flex-none text-fuchsia-300" />
      <span>{children}</span>
    </li>
  );
}
