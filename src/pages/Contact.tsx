import { Link } from "react-router-dom";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import {
  EditorialPageHero,
  EditorialSection,
  EditorialChapterHeader,
} from "@/components/editorial";

const Contact = () => {
  usePageSeo({
    title: "Contact — Paracosm",
    description:
      "Book a Gl!tch, Drift, or Tune session with Paracosm. Contact us to explore relational intelligence, agentic UX, and organizational transformation.",
    path: "/contact",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="h-8 w-8 rounded-lg bg-white p-1 object-contain"
            />
            <span className="font-serif text-base tracking-tight">Paracosm</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] opacity-70">
            <Link to="/home" className="hover:opacity-100">Site</Link>
            <Link to="/trainings" className="hover:opacity-100">Trainings</Link>
            <Link to="/events-and-retreats" className="hover:opacity-100">Retreats</Link>
          </nav>
        </div>
      </header>

      <main>
        <EditorialPageHero
          tone="warm"
          numeral="00"
          kicker="Contact · Open a session"
          title={
            <>
              Start a <em className="italic font-light">conversation</em> with Paracosm.
            </>
          }
          subtitle="Three doors in: Gl!tch for deep discovery, Drift for relational exploration, Tune for focused action. Pick one, or write and we'll route you."
        />

        <EditorialSection tone="paper" id="contact">
          <EditorialChapterHeader
            numeral="01"
            kicker="Book a session"
            subtitle="Everything routes to a single inbox — jbelisle@helloarchitekt.com."
            tone="paper"
          />
          <div className="mt-12">
            <ContactSection />
          </div>
        </EditorialSection>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
