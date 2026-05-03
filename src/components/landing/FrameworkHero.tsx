import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuestionResonancePanel from "@/components/resonance/QuestionResonancePanel";
import LivingGeometryAmbient from "@/components/landing/LivingGeometryAmbient";

interface FrameworkHeroProps {
  onScrollToMethod: () => void;
}

export default function FrameworkHero({ onScrollToMethod }: FrameworkHeroProps) {
  return (
    <section
      id="framework-hero"
      className="relative pt-24 pb-12 px-4 overflow-hidden bg-gradient-to-b from-background via-background to-muted/30"
    >
      <LivingGeometryAmbient />
      <div className="container max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          {/* Left: Promise */}
          <div className="space-y-6 lg:pt-8">
            <Badge
              variant="secondary"
              className="gap-1.5 text-[11px] uppercase tracking-wider"
            >
              <Sparkles className="w-3 h-3" />
              The Calm Magic Framework
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Turn your enterprise into a{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-600">
                Learning &amp; Inventive Organization.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Calm Magic is the framework that helps enterprises{" "}
              <strong className="text-foreground">educate and invent with AI</strong>{" "}
              — by mapping your real questions onto a living ontology instead of
              forcing them through a roadmap.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={onScrollToMethod} size="lg" className="gap-2">
                See how the method works
                <ArrowRight className="w-4 h-4" />
              </Button>
              <a href="mailto:jbelisle@helloarchitekt.com?subject=Calm%20Magic%20—%20Clarity%20Sprint">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Book a Clarity Sprint
                </Button>
              </a>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              Used by executives, designers and inventive teams — from boardroom to
              prototype.
            </p>
          </div>

          {/* Right: Live Resonance prompt — the framework in action */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-primary/20 bg-card/90 backdrop-blur-sm p-4 md:p-5 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Try the framework now
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Live · powered by the board
                </span>
              </div>
              <QuestionResonancePanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
