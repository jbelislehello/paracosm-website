import React from 'react';
import logoHA from "@/assets/logo-ha.jpg";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand — HA Labs */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoHA} alt="HA Labs" className="w-8 h-8 rounded-md object-contain" />
              <span className="font-bold text-lg text-white">HA Labs</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Creative technology studio — performance arts, interactive storytelling, AI & IOT software, and innovation frameworks.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              <a 
                href="mailto:jbelisle@helloarchitekt.com" 
                className="text-slate-400 hover:text-purple-400 transition-colors"
              >
                jbelisle@helloarchitekt.com
              </a>
            </div>
          </div>
          
          {/* HA Labs Projects */}
          <div>
            <h3 className="font-semibold text-white mb-4">HA Labs Projects</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/calm-magic-board" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Calm Magic Board
                </Link>
              </li>
              <li>
                <Link to="/wuxia" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Wuxia the Fox
                </Link>
              </li>
              <li>
                <Link to="/tonalli" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Tonalli
                </Link>
              </li>
              <li>
                <span className="text-sm text-slate-500 italic">IoTheatre (Coming Soon)</span>
              </li>
              <li>
                <a href="https://suno.com/@jbelisle" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Satori & Kensho
                </a>
              </li>
            </ul>
          </div>
          
          {/* Paracosm */}
          <div>
            <h3 className="font-semibold text-white mb-4">Paracosm</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/calm-magic-assistant" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Relational Intelligence
                </Link>
              </li>
              <li>
                <span className="text-sm text-slate-400">Learning Organizations</span>
              </li>
              <li>
                <Link to="/glitch-methodology" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Gl!tch Sessions
                </Link>
              </li>
              <li>
                <Link to="/drift" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Drift
                </Link>
              </li>
              <li>
                <Link to="/paracosm-retreat" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Retreats
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold text-white mb-4">Get Started</h3>
            <div className="space-y-3">
              <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-white border-slate-600 hover:bg-slate-800 hover:border-purple-500"
                >
                  Book a Session
                </Button>
              </a>
              <Link to="/auth">
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Start Free Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">© 2026 HA Labs + Paracosm. {t("footer.rights_reserved")}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://www.linkedin.com/newsletters/calm-magic-6884529759464816640/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
            <a href="https://calmmagic.medium.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Medium</a>
            <a href="https://www.youtube.com/watch?v=vK5PlnVQUqo&list=PLPBdUXhaUvYS_Lm7cIIBhikixfSkVB1Dd" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
