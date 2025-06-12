
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import EnhancedInnovationJournal from "@/components/EnhancedInnovationJournal";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import { features } from "@/data/featureData";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { Link } from "react-router-dom";

const Index = () => {
  const [isCalmMagicAssistantOpen, setIsCalmMagicAssistantOpen] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "Paracosm - Product Development Framework";
  }, []);

  const handleStartJourney = () => {
    // Open the Calm Magic assistant
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
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-lg">Paracosm</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium hover:text-purple-600 transition-colors">Features</a>
            <a href="#framework" className="text-sm font-medium hover:text-purple-600 transition-colors">Framework</a>
            <a href="#showcase" className="text-sm font-medium hover:text-purple-600 transition-colors">Showcase</a>
            <Link to="/case-studies" className="text-sm font-medium hover:text-purple-600 transition-colors">Case Studies</Link>
            <a href="#partners" className="text-sm font-medium hover:text-purple-600 transition-colors">Partners</a>
            <a href="#contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          <Button onClick={handleDiscoverFramework} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
            Get Started
          </Button>
        </div>
      </header>
      
      {/* Calm Magic Assistant - Draggable Window */}
      <CalmMagicAssistant onStartJourney={handleStartJourney} isOpen={isCalmMagicAssistantOpen} onOpenChange={setIsCalmMagicAssistantOpen} />
      
      {/* Hero Section */}
      <HeroSection onDiscoverFramework={handleDiscoverFramework} />
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Bridge Ideas to Products</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Navigate from "good idea" to "working product" using our structured framework that prevents the common gap between creative vision and technical implementation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                title={feature.title} 
                description={feature.description} 
                icon={feature.icon} 
                color={feature.color} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced Product Development Framework */}
      <section id="framework" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              🚀 Imagineering to Engineering
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg mb-8">
              This is a <strong>product development framework</strong> that bridges creative ideation with technical implementation. 
              Here's what it actually means:
            </p>
          </div>

          {/* Two Phase Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Calm Magic Assistant Info Panel */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Calm Magic Assistant</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                An integrated tool for personal and professional growth that develops your innovation leadership capacity
                through interactive emotional landscapes. Navigate your journey from self-awareness to team transformation.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  • <strong>Personal Development:</strong> Explore how authentic connection enhances creativity
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  • <strong>Professional Growth:</strong> Develop leadership competencies through interactive landscapes
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  • <strong>Coherence Building:</strong> Align your inner development with external leadership capacity
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  • <strong>Innovation Leadership:</strong> Cultivate the skills needed to lead creative teams
                </div>
              </div>
              <Button 
                onClick={handleDiscoverFramework}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
              >
                Open Innovation Leadership Tool
              </Button>
            </div>

            {/* Framework Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Understand Phase</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Research stakeholders, analyze problems, and prototype solutions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-xs font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Create Phase</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Build architecture, develop features, and ensure quality</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-xs font-bold text-green-600">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Ship Working Product</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Deploy, launch, and scale with confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Matters Section */}
          
          
          <EnhancedInnovationJournal />
        </div>
      </section>
      
      {/* Network Visualization */}
      <section id="showcase" className="py-16 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Visualize Your Development Process</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            See how ideas flow through the framework from stakeholder research to working products, with clear visibility into each phase of the development process.
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
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold text-lg text-white">Paracosm</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Bridging the gap between creative vision and technical implementation through structured product development frameworks.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/calm-magic-assistant" className="text-sm hover:text-purple-600">Calm Magic Assistant</Link></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Implementation Examples</a></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">Case Studies</Link></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Best Practices</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-purple-600">About Us</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Contact Us</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 Paracosm. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white">GitHub</a>
              <a href="#" className="text-slate-400 hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
