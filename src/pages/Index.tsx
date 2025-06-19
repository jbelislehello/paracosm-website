
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import AgentInteractionDemo from "@/components/AgentInteractionDemo";
import ProductDevelopmentAssistant from "@/components/ProductDevelopmentAssistant";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from "react-router-dom";

const Index = () => {
  const [showAgentDemo, setShowAgentDemo] = useState(false);

  useEffect(() => {
    document.title = "Agentic UX - Build Your AI Ecosystem";
  }, []);

  const handleDiscoverFramework = () => {
    setShowAgentDemo(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-lg">Agentic UX</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#agent-demo" className="text-sm font-medium hover:text-purple-600 transition-colors">Agent Demo</a>
            <a href="#visualization" className="text-sm font-medium hover:text-purple-600 transition-colors">Visualization</a>
            <a href="#partners" className="text-sm font-medium hover:text-purple-600 transition-colors">Partners</a>
            <Link to="/landing-page" className="text-sm font-medium hover:text-purple-600 transition-colors">Leadership Coaching</Link>
            <Link to="/calm-magic-assistant" className="text-sm font-medium hover:text-purple-600 transition-colors">Relational Healing</Link>
            <Link to="/case-studies" className="text-sm font-medium hover:text-purple-600 transition-colors">Case Studies</Link>
            <a href="#contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          <Link to="/landing-page">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
              Explore Coaching
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section - Agentic UX Focus */}
      <HeroSection onDiscoverFramework={handleDiscoverFramework} />
      
      {/* Agent Interaction Demo */}
      {showAgentDemo && (
        <section id="agent-demo" className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Experience Agentic Intelligence</h2>
            <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
              Interact with specialized AI agents that collaborate to solve complex problems. 
              Watch how they coordinate, learn, and adapt to create innovative solutions.
            </p>
            
            <AgentInteractionDemo />
          </div>
        </section>
      )}
      
      {/* Product Development Assistant */}
      <section className="py-16 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">From Imagineering to Engineering</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Bridge the gap between creative vision and technical implementation with our comprehensive product development framework.
          </p>
          
          <ProductDevelopmentAssistant />
        </div>
      </section>
      
      {/* Network Visualization - Agentic Context */}
      <section id="visualization" className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Visualize Your Agentic Network</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            See how AI agents interconnect, share knowledge, and collaborate to create emergent intelligence 
            that goes beyond individual capabilities.
          </p>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 md:p-6 overflow-hidden">
            <NetworkVisualization />
          </div>
        </div>
      </section>
      
      {/* Key Features */}
      <section className="py-16 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Agentic UX Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Multi-Agent Orchestration"
              description="Coordinate multiple specialized AI agents to tackle complex, multi-faceted challenges"
              icon="🤖"
            />
            <FeatureCard 
              title="Emergent Intelligence"
              description="Watch as agent interactions create solutions beyond individual agent capabilities"
              icon="🧠"
            />
            <FeatureCard 
              title="Adaptive Learning"
              description="Agents continuously learn from interactions and improve their collaborative performance"
              icon="📈"
            />
          </div>
        </div>
      </section>
      
      {/* Partner Tools Section */}
      <section id="partners">
        <PartnerToolsSection />
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Agentic Ecosystem?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Transform your business with AI agents that think, collaborate, and innovate together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleDiscoverFramework} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Try Agent Demo
            </Button>
            <Link to="/landing-page">
              <Button variant="outline" className="flex items-center gap-2">
                Explore Leadership Coaching
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
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
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="font-bold text-lg text-white">Agentic UX</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Building the future of human-AI collaboration through intelligent agent ecosystems and innovative user experiences.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-purple-600">AI Agent Development</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Digital Transformation</a></li>
                <li><Link to="/landing-page" className="text-sm hover:text-purple-600">Leadership Coaching</Link></li>
                <li><Link to="/calm-magic-assistant" className="text-sm hover:text-purple-600">Relational Healing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-sm hover:text-purple-600">About Us</Link></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">Case Studies</Link></li>
                <li><a href="#contact" className="text-sm hover:text-purple-600">Contact</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 Agentic UX. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
