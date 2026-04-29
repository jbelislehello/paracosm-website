import { Button } from "@/components/ui/button";
import { ArrowRight, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  onDemo: () => void;
}

const DemoCTA = ({ onDemo }: Props) => (
  <section className="relative overflow-hidden border-t border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 py-24 md:py-32">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
    </div>
    <div className="container relative mx-auto max-w-4xl px-6 text-center">
      <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
        Ready to feel the board?
      </h2>
      <p className="mt-5 text-lg text-muted-foreground md:text-xl">
        Book a 30-minute guided walkthrough. We'll map one of your real
        transformation challenges onto the Calm Magic board, live.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          size="lg"
          onClick={onDemo}
          className="group gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95"
        >
          Get a guided demo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Link to="/auth">
          <Button size="lg" variant="outline" className="gap-2">
            <KeyRound className="h-4 w-4" />
            Try the live board
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Public methodology preview · No data collected on this page
      </p>
    </div>
  </section>
);

export default DemoCTA;
