import React from "react";
import logoHA from "@/assets/logo-ha.jpg";
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { editorialType } from "@/components/editorial/editorialTokens";
import EditorialCTA from "@/components/editorial/EditorialCTA";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden bg-[hsl(230_35%_10%)] text-[hsl(35_20%_92%)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(45_90%_65%)] to-transparent" />
      <div className="relative container mx-auto px-6 py-16 md:py-20">
        {/* Colophon */}
        <div className="mb-14 pb-10 border-b border-white/10 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <p className={editorialType.eyebrow + " text-[hsl(45_90%_65%)]"}>
              Colophon
            </p>
            <p
              className={
                editorialType.serif + " text-3xl md:text-5xl leading-[1.05] mt-3 max-w-2xl"
              }
            >
              <em className="italic font-light">Imagination as</em> infrastructure —
              published continuously by HA Labs & Paracosm.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <EditorialCTA
              tone="night"
              href="mailto:jbelisle@helloarchitekt.com?subject=Discovery%20call%20—%20Paracosm"
              variant="primary"
            >
              <Mail className="w-4 h-4" /> Book a discovery call
            </EditorialCTA>
          </div>
        </div>

        {/* Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoHA} alt="HA Labs" className="w-8 h-8 rounded-md object-contain" />
              <span className={editorialType.serif + " text-lg"}>HA Labs</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-4">
              Creative technology studio — performance arts, interactive storytelling, AI
              & IoT software, and innovation frameworks.
            </p>
            <a
              href="mailto:jbelisle@helloarchitekt.com"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              <Mail className="w-4 h-4" /> jbelisle@helloarchitekt.com
            </a>
          </div>

          <div>
            <h3 className={editorialType.caption + " mb-4"}>HA Labs Projects</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/calm-magic-board" className="opacity-80 hover:opacity-100">
                  Calm Magic Board
                </Link>
              </li>
              <li>
                <Link to="/wuxia" className="opacity-80 hover:opacity-100">
                  Wuxia the Fox
                </Link>
              </li>
              <li>
                <Link to="/tonalli" className="opacity-80 hover:opacity-100">
                  Tonalli
                </Link>
              </li>
              <li>
                <span className="opacity-50 italic">IoTheatre — coming soon</span>
              </li>
              <li>
                <a
                  href="https://suno.com/@jbelisle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 inline-flex items-center gap-1"
                >
                  Satori & Kensho <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={editorialType.caption + " mb-4"}>Paracosm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/trainings" className="opacity-80 hover:opacity-100">
                  Trainings — Foreplay
                </Link>
              </li>
              <li>
                <Link to="/events-and-retreats" className="opacity-80 hover:opacity-100">
                  Retreats — Foresight
                </Link>
              </li>
              <li>
                <Link to="/agentic-ux#residencies" className="opacity-80 hover:opacity-100">
                  Residencies — Forecast
                </Link>
              </li>
              <li>
                <Link to="/calm-magic-assistant" className="opacity-80 hover:opacity-100">
                  Calm Magic
                </Link>
              </li>
              <li>
                <Link to="/drift" className="opacity-80 hover:opacity-100">
                  Drift
                </Link>
              </li>
              <li>
                <Link to="/glitch-methodology" className="opacity-80 hover:opacity-100">
                  Gl!tch Sessions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={editorialType.caption + " mb-4"}>Elsewhere</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about-us" className="opacity-80 hover:opacity-100">
                  About
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="opacity-80 hover:opacity-100">
                  Case studies
                </Link>
              </li>
              <li>
                <Link to="/book" className="opacity-80 hover:opacity-100">
                  Book
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/newsletters/calm-magic-6884529759464816640/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 inline-flex items-center gap-1"
                >
                  LinkedIn <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://calmmagic.medium.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 inline-flex items-center gap-1"
                >
                  Medium <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/watch?v=vK5PlnVQUqo&list=PLPBdUXhaUvYS_Lm7cIIBhikixfSkVB1Dd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 inline-flex items-center gap-1"
                >
                  YouTube <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className={editorialType.caption}>
            © 2026 HA Labs + Paracosm · {t("footer.rights_reserved")}
          </p>
          <div className="flex gap-6">
            <Link to="/origins" className={editorialType.caption + " hover:opacity-100"}>
              Origins
            </Link>
            <Link to="/credits" className={editorialType.caption + " hover:opacity-100"}>
              Credits
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
