import { useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BookLeadCaptureForm from "./BookLeadCaptureForm";
import { cn } from "@/lib/utils";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";

export default function BookOfferTiers() {
  const [loadingCohort, setLoadingCohort] = useState(false);
  const t = editorialTone.night;

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
    <section id="offer" className={cn("px-6 py-20 md:py-32", t.section)}>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-14">
          <div className="flex items-baseline gap-6 mb-6">
            <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", t.numeral)}>03</span>
            <p className={cn(editorialType.kicker, t.kicker)}>Three ways in</p>
          </div>
          <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-[1.1] tracking-tight max-w-3xl")}>
            Read first. Practice next. <em className="italic font-light">Bring your team.</em>
          </h2>
          <p className="mt-4 max-w-2xl text-base md:text-lg opacity-80 leading-relaxed">
            The book is the entry point. The cohort puts the framework in your hands.
            The org license embeds it in your operating system.
          </p>
        </div>

        <div className="grid gap-0 md:grid-cols-3 border-t border-white/20">
          {/* Free */}
          <TierColumn
            index="i"
            label="Free"
            title="Sample chapter"
            description="Read the GL!TCH chapter the moment it's ready. We'll email you when it drops."
            items={["One free chapter", "Launch updates", "No spam, unsubscribe anytime"]}
            tone={t}
          >
            <BookLeadCaptureForm
              source="book_offer_tier_free"
              interest="sample"
              cta="Send me the chapter"
              placeholder="you@email.com"
            />
          </TierColumn>

          {/* Cohort */}
          <TierColumn
            index="ii"
            label="Practitioner · most chosen"
            title="Cohort + signed book"
            description={<><span className={cn(editorialType.serif, "text-4xl md:text-5xl", t.kicker)}>$497</span> <span className={cn(editorialType.caption, "opacity-70")}>one-time</span></>}
            items={[
              "Signed hardcover + digital + audiobook",
              "6-week practitioner cohort with Jonathan",
              "GL!TCH, Drift, Tune playbooks (workbook)",
              "Private community of operators",
            ]}
            tone={t}
            emphasized
          >
            <button
              onClick={startCohortCheckout}
              disabled={loadingCohort}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-50",
                editorialType.cta,
                t.ctaPrimary,
              )}
            >
              {loadingCohort ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reserve my seat"}
            </button>
          </TierColumn>

          {/* Org */}
          <TierColumn
            index="iii"
            label="Organization"
            title="Org license + workshop"
            description="Book pack, internal workshop, and embedded coaching for your leadership team."
            items={[
              "Bulk hardcover + digital licenses",
              "Half-day Calm Magic workshop",
              "Crewdle.ai pilot included",
              "Quarterly executive office hours",
            ]}
            tone={t}
          >
            <BookLeadCaptureForm
              source="book_offer_tier_org"
              interest="org"
              cta="Talk to us"
              placeholder="work@company.com"
            />
            <div className={cn("mt-3 flex items-center gap-1.5 opacity-50", editorialType.caption)}>
              <Mail className="h-3 w-3" /> jbelisle@helloarchitekt.com
            </div>
          </TierColumn>
        </div>
      </div>
    </section>
  );
}

function TierColumn({
  index,
  label,
  title,
  description,
  items,
  tone,
  emphasized,
  children,
}: {
  index: string;
  label: string;
  title: string;
  description: React.ReactNode;
  items: string[];
  tone: typeof editorialTone.night;
  emphasized?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col p-8 md:p-10 border-b md:border-b-0 md:border-r last:border-r-0 border-white/15",
        emphasized && "bg-white/[0.04]",
      )}
    >
      <div className={cn("flex items-baseline gap-4 mb-6", editorialType.caption)}>
        <span className={cn(editorialType.serif, "text-xl", tone.kicker)}>{index}.</span>
        <span className={cn(tone.kicker)}>{label}</span>
      </div>
      <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-3")}>
        {title}
      </h3>
      <div className="text-base opacity-80 leading-relaxed mb-6 min-h-[3rem]">
        {description}
      </div>
      <ul className="space-y-3 text-sm opacity-90 mb-8">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check className={cn("mt-0.5 h-4 w-4 flex-none", tone.kicker)} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto">{children}</div>
    </div>
  );
}
