import { Link } from "react-router-dom";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";

const Contact = () => {
  usePageSeo({
    title: "Contact — Paracosm",
    description:
      "Book a Gl!tch, Drift, or Tune session with Paracosm. Contact us to explore relational intelligence, agentic UX, and organizational transformation.",
    path: "/contact",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoParacosm}
              alt="Paracosm"
              className="h-8 w-8 rounded-lg bg-white p-1 object-contain"
            />
            <span className="text-sm font-bold">Paracosm</span>
          </Link>
        </div>
      </header>
      <main>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
