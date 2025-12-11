import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Compass, Settings, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SESSION_TYPES = [
  {
    name: 'Gl!tch Session',
    description: 'Deep exploration of tensions',
    duration: '45-60 min',
    icon: Zap,
    link: 'https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting',
    gradient: 'from-rose-500 to-rose-600'
  },
  {
    name: 'Drift Session',
    description: 'Relational exploration',
    duration: '30 min',
    icon: Compass,
    link: 'https://app.reclaim.ai/m/jonathan-helloarchitekt/flexible-quick-meeting',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Tune Session',
    description: 'Quick tactical check-ins',
    duration: '15 min',
    icon: Settings,
    link: 'https://app.reclaim.ai/m/jonathan-helloarchitekt/quick-meeting',
    gradient: 'from-blue-500 to-blue-600'
  }
];

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Session Types CTA Section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">Book a Session</h3>
            <p className="text-slate-400 text-sm">Choose the session type that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {SESSION_TYPES.map((session) => {
              const Icon = session.icon;
              return (
                <a
                  key={session.name}
                  href={session.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all duration-200 border border-slate-700 hover:border-slate-600"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${session.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-white text-sm">{session.name}</span>
                  <span className="text-xs text-slate-400 mb-1">{session.duration}</span>
                  <span className="text-xs text-slate-500">{session.description}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-lg text-white">Paracosm</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              {t("footer.paracosm_description")}
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
          
          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.services_title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/agentic-ux" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  AI Leadership & Strategy
                </Link>
              </li>
              <li>
                <Link to="/calm-magic-assistant" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Team Coaching & Culture
                </Link>
              </li>
              <li>
                <Link to="/calm-magic-board" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Calm Magic Board
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  {t("navigation.case_studies")}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.company_title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  {t("footer.about_jonathan")}
                </Link>
              </li>
              <li>
                <Link to="/drift" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Drift Podcast
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">
                  {t("navigation.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold text-white mb-4">Get Started</h3>
            <div className="space-y-3">
              <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-white border-slate-600 hover:bg-slate-800 hover:border-purple-500"
                >
                  Book Discovery Call
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
          <p className="text-sm text-slate-400">© 2025 Paracosm. {t("footer.rights_reserved")}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
            <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Medium</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
