import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/hooks/usePageSeo";

export default function BookThanks() {
  const [params] = useSearchParams();
  const tier = params.get("tier") ?? "cohort";
  usePageSeo({ title: "Thank you — Calm Magic", description: "Order received.", path: "/book/thanks" });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="fixed z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoParacosm} alt="Paracosm" className="h-8 w-8 rounded-lg bg-white p-1 object-contain" />
            <span className="text-sm font-bold">Paracosm</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pt-20">
        <div className="max-w-md text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
          <h1 className="mt-4 text-3xl font-bold">You're in.</h1>
          <p className="mt-3 text-white/70">
            Thanks for reserving the {tier === "org" ? "org license" : "practitioner cohort"}.
            We'll be in touch from <span className="text-white">jbelisle@helloarchitekt.com</span> with
            next steps, signed-edition shipping, and your cohort welcome.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/book">
              <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                <ArrowLeft className="mr-1 h-3 w-3" /> Back to book
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
