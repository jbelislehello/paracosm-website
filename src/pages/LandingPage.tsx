
import { useEffect, useState } from "react";
import LeadershipRolesSection from "@/components/LeadershipRolesSection";
import CoachingApproachSection from "@/components/CoachingApproachSection";
import TransformationJourney from "@/components/TransformationJourney";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import { Button } from "@/components/ui/button";
import { Zap, Heart } from 'lucide-react';
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [isCalmMagicAssistantOpen, setIsCalmMagicAssistantOpen] = useState(false);

  useEffect(() => {
    document.title = "Paracosm - Choose Your Coaching Path";
  }, []);

  const handleStartCoaching = () => {
    setIsCalmMagicAssistantOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-lg">Paracosm</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#leadership-roles" className="text-sm font-medium hover:text-purple-600 transition-colors">Residencies</a>
            <a href="#coaching-approach" className="text-sm font-medium hover:text-purple-600 transition-colors">Coaching Approach</a>
            <a href="#transformation" className="text-sm font-medium hover:text-purple-600 transition-colors">Transformation</a>
          </nav>
          <Button onClick={handleStartCoaching} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
            Start Your Journey
          </Button>
        </div>
      </header>
      
      {/* Calm Magic Assistant */}
      <CalmMagicAssistant onStartJourney={handleStartCoaching} isOpen={isCalmMagicAssistantOpen} onOpenChange={setIsCalmMagicAssistantOpen} />
      
      {/* Hero Section - Choose Your Path */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="container relative px-4 py-12 md:py-24" style={{ zIndex: 10 }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-8 border border-white/20 relative z-20">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 animate-gradient-x mb-6">
                Choose Your Coaching Path
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200">
                Transform your leadership through specialized coaching that aligns with your unique challenges and goals
              </p>
              
              {/* Dual Pathway Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/agentic-ux">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AI Systems & Leadership
                  </Button>
                </Link>
                <Link to="/calm-magic-assistant">
                  <Button className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Relational Intelligence & Innovation
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Strategic AI innovation leadership or deep relational intelligence - choose your pathway to transformation
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Three Residence Levels Section */}
      <LeadershipRolesSection />
      
      {/* Coaching Approach */}
      <CoachingApproachSection />
      
      {/* Transformation Journey */}
      <TransformationJourney />
      
      {/* Partner Tools Section */}
      <section id="partners">
        <PartnerToolsSection />
      </section>
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold text-lg text-white">Paracosm</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Leadership coaching for innovation through alignment of executive courage, technical co-creation, and learning-oriented cultures.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/agentic-ux" className="text-sm hover:text-purple-600">AI Systems & Leadership</Link></li>
                <li><Link to="/agentic-ux" className="text-sm hover:text-purple-600">Technical Leadership Development</Link></li>
                <li><Link to="/calm-magic-assistant" className="text-sm hover:text-purple-600">Relational Intelligence & Innovation</Link></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">Case Studies</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-sm hover:text-purple-600">About Jonathan</Link></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Methodology</a></li>
                <li><a href="#contact" className="text-sm hover:text-purple-600">Contact</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 Paracosm. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white">Medium</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
