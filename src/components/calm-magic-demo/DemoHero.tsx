import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

interface Props {
  onDemo: () => void;
}

const tiles = Array.from({ length: 64 });

const DemoHero = ({ onDemo }: Props) => {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Badge className="w-fit gap-1 border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">
            <Sparkles className="h-3 w-3" />
            Methodology · Calm Magic
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            A relational intelligence{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              operating system
            </span>{" "}
            for organizations.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
          >
            Calm Magic turns the messy work of transformation into a living 8×8
            board where culture, knowledge and product co-emerge — one tile,
            one season, one preferable future at a time.
          </motion.p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={onDemo}
              className="group gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95"
            >
              Get a guided demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <a href="#anatomy">
              <Button size="lg" variant="outline" className="gap-2">
                <Compass className="h-4 w-4" />
                Tour the board
              </Button>
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No login required · Public methodology preview
          </p>
        </div>

        {/* Animated tile bloom */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-3xl border border-border bg-card/60 p-4 shadow-2xl backdrop-blur-sm">
            <div className="grid h-full w-full grid-cols-8 gap-1.5">
              {tiles.map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const dist = Math.sqrt((row - 3.5) ** 2 + (col - 3.5) ** 2);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.3 + dist * 0.05,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className="rounded-md"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--primary) / ${
                        0.15 + (1 - dist / 6) * 0.45
                      }), hsl(var(--accent) / ${0.1 + (1 - dist / 6) * 0.4}))`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoHero;
