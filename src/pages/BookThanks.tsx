import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { EditorialCTA } from "@/components/editorial";
import { usePageSeo } from "@/hooks/usePageSeo";

export default function BookThanks() {
  const [params] = useSearchParams();
  const tier = params.get("tier") ?? "cohort";
  usePageSeo({ title: "Thank you — Calm Magic", description: "Order received.", path: "/book/thanks" });

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(230_35%_10%)] text-[hsl(35_20%_92%)]">
      <header className="fixed z-50 w-full border-b border-white/10 bg-[hsl(230_35%_10%)]/80 backdrop-blur-md">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="h-8 w-8 rounded-lg bg-white p-1 object-contain" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">Paracosm</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pt-20">
        <div className="max-w-xl text-center space-y-6">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[hsl(45_90%_65%)]" />
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold text-[hsl(45_90%_65%)]">
            Colophon · Confirmation
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight">
            You&rsquo;re in.
          </h1>
          <p className="text-base md:text-lg opacity-80 leading-relaxed">
            Thanks for reserving the {tier === "org" ? "org license" : "practitioner cohort"}.
            We&rsquo;ll be in touch from <span className="text-[hsl(45_90%_65%)]">jbelisle@helloarchitekt.com</span> with
            next steps, signed-edition shipping, and your cohort welcome.
          </p>
          <div className="pt-4 flex justify-center">
            <EditorialCTA to="/book" tone="night" variant="ghost" showArrow={false}>
              <ArrowLeft className="w-4 h-4" /> Back to book
            </EditorialCTA>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
