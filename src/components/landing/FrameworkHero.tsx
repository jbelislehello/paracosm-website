import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionResonancePanel from "@/components/resonance/QuestionResonancePanel";

interface FrameworkHeroProps {
  onScrollToMethod: () => void;
}

export default function FrameworkHero({ onScrollToMethod }: FrameworkHeroProps) {
  return (
    <section
      id="framework-hero"
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-6 bg-[hsl(35_45%_96%)] text-foreground border-b border-current/10 overflow-hidden"
    >
      {/* editorial texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-[hsl(15_75%_55%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-[hsl(15_75%_45%)] blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Masthead line */}
        <div className="flex items-baseline gap-6 mb-8 pb-6 border-b border-current/15">
          <span className="font-serif text-5xl md:text-6xl leading-none text-[hsl(15_75%_55%)]">
            01
          </span>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold text-[hsl(15_75%_45%)]">
            The Calm Magic Framework · Chapter One
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left: Editorial promise */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
              Turn your enterprise into a{" "}
              <em className="italic font-light">
                learning &amp; inventive
              </em>{" "}
              <span className="underline decoration-[hsl(15_75%_55%)] decoration-4 underline-offset-[10px]">
                organization
              </span>
              .
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl opacity-80">
              Calm Magic is the framework that helps enterprises{" "}
              <b className="text-foreground">educate and invent with AI</b>
              {" "}— by mapping your real questions onto a living ontology
              instead of forcing them through a roadmap.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Discovery%20Call%20—%20Paracosm">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-none text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Discovery Call
                </Button>
              </a>
              <Button
                onClick={onScrollToMethod}
                size="lg"
                variant="outline"
                className="gap-2 border border-current/40 bg-transparent hover:bg-current/10 rounded-none text-xs uppercase tracking-[0.2em] font-semibold"
              >
                See how the method works
                <ArrowRight className="w-4 h-4" />
              </Button>
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Calm%20Magic%20—%20Clarity%20Sprint">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border border-current/40 bg-transparent hover:bg-current/10 rounded-none text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  Book a Clarity Sprint
                </Button>
              </a>
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 pt-4">
              Used by executives, designers &amp; inventive teams — boardroom
              to prototype.
            </p>
          </div>

          {/* Right: Sidebar dossier — the framework in action */}
          <aside className="lg:col-span-5 lg:border-l lg:border-current/20 lg:pl-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[hsl(15_75%_45%)]">
                Field Instrument
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] opacity-60">
                Live · powered by the board
              </span>
            </div>
            <p className="font-serif italic text-2xl md:text-3xl leading-[1.15]">
              Try the framework — with a question you're carrying right now.
            </p>
            <div className="border-t border-current/15 pt-4">
              <QuestionResonancePanel />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
