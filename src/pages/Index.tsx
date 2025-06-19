
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import LeadershipRolesSection from "@/components/LeadershipRolesSection";
import CoachingApproachSection from "@/components/CoachingApproachSection";
import TransformationJourney from "@/components/TransformationJourney";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Zap } from 'lucide-react';
import { Link } from "react-router-dom";

const Index = () => {
  const [isCalmMagicAssistantOpen, setIsCalmMagicAssistantOpen] = useState(false);

  useEffect(() => {
    document.title = "Jonathan Bélisle - Leadership Coaching for Innovation";
  }, []);

  const handleStartCoaching = () => {
    setIsCalmMagicAssistantOpen(true);
  };

  const handleDiscoverFramework = () => {
    setIsCalmMagicAssistantOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <span className="font-bold text-lg">Jonathan Bélisle</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#leadership-roles" className="text-sm font-medium hover:text-purple-600 transition-colors">Leadership Roles</a>
            <a href="#coaching-approach" className="text-sm font-medium hover:text-purple-600 transition-colors">Coaching Approach</a>
            <a href="#transformation" className="text-sm font-medium hover:text-purple-600 transition-colors">Transformation</a>
            <Link to="/case-studies" className="text-sm font-medium hover:text-purple-600 transition-colors">Case Studies</Link>
            <Link to="/about-us" className="text-sm font-medium hover:text-purple-600 transition-colors">About</Link>
            <a href="#contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          <Button onClick={handleStartCoaching} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
            Start Your Journey
          </Button>
        </div>
      </header>
      
      {/* Calm Magic Assistant */}
      <CalmMagicAssistant onStartJourney={handleStartCoaching} isOpen={isCalmMagicAssistantOpen} onOpenChange={setIsCalmMagicAssistantOpen} />
      
      {/* Hero Section - Leadership Coaching Focus */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="container relative px-4 py-12 md:py-24" style={{ zIndex: 10 }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-8 border border-white/20 relative z-20">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 animate-gradient-x mb-6">
                Leadership Coaching for True Innovation
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200">
                Align three essential leadership roles to unlock your organization's innovation potential through one-on-one coaching
              </p>
              
              {/* Dual Pathway Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  onClick={handleStartCoaching}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Executive & Technical Leadership
                </Button>
                <Link to="/calm-magic-assistant">
                  <Button className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Relational & Emotional Healing
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Choose your pathway: Strategic innovation leadership or deep relational healing
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Three Leadership Roles Section */}
      <LeadershipRolesSection />
      
      {/* Coaching Approach */}
      <CoachingApproachSection />
      
      {/* Transformation Journey */}
      <TransformationJourney />
      
      {/* Network Visualization - Recontextualized */}
      <section id="visualization" className="py-16 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Visualize Leadership Alignment</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            See how the three leadership roles interconnect to create conditions for true innovation, 
            moving beyond traditional goal-setting to systemic transformation.
          </p>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 md:p-6 overflow-hidden">
            <NetworkVisualization />
          </div>
        </div>
      </section>
      
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
                  <span className="text-white font-bold">J</span>
                </div>
                <span className="font-bold text-lg text-white">Jonathan Bélisle</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Leadership coaching for innovation through alignment of executive courage, technical co-creation, and learning-oriented cultures.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-purple-600">Executive Leadership Coaching</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Technical Leadership Development</a></li>
                <li><Link to="/calm-magic-assistant" className="text-sm hover:text-purple-600">Relational Healing</Link></li>
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
            <p className="text-sm text-slate-400">© 2025 Jonathan Bélisle. All rights reserved.</p>
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

export default Index;
