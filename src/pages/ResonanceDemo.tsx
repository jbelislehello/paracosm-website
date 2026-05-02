import QuestionResonancePanel from "@/components/resonance/QuestionResonancePanel";

export default function ResonanceDemo() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-12">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Calm Magic · Learn
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Where does your question resonate?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask anything. We map it onto the five axes of the Calm Magic
            board — Magic, Love, Calm, Open, Free — and show which tiles
            it lights up.
          </p>
        </header>
        <QuestionResonancePanel />
      </div>
    </main>
  );
}
