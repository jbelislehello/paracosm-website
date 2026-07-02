import { Quote } from "lucide-react";

export default function RelationalPlaceQuote() {
  return (
    <section
      id="relational-place-quote"
      className="py-16 md:py-24 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      <div className="container max-w-4xl mx-auto relative">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <Quote className="w-5 h-5 text-white/80" />
          </div>
        </div>

        <blockquote className="text-center space-y-6">
          <p className="text-2xl md:text-4xl font-light leading-tight tracking-tight">
            <span className="block">Most organizations don't lack ideas.</span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-white to-blue-300 font-normal">
              They lack a relational place to hold them.
            </span>
          </p>

          <div className="w-16 h-px bg-white/30 mx-auto" />

          <p className="text-lg md:text-2xl font-light leading-relaxed text-white/90 max-w-3xl mx-auto">
            An innovative enterprise in the{" "}
            <span className="italic text-white">Agentic Era</span> will win if it
            deeply connects to its{" "}
            <span className="font-medium text-fuchsia-200">Relational Intelligence</span>{" "}
            and learns how to properly{" "}
            <span className="font-medium text-blue-200">design intentions</span>.
          </p>

          <footer className="pt-4 text-xs uppercase tracking-[0.3em] text-white/50">
            — Jonathan Bélisle · Paracosm
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
