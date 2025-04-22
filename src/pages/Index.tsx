
import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import AgentInteractionDemo from "@/components/AgentInteractionDemo";
import ContactSection from "@/components/ContactSection";
import { features } from "@/data/featureData";
import { Button } from "@/components/ui/button";
import { Database, Layers, Code, Users } from "lucide-react";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "AgenticVerse - Build Powerful Agent Ecosystems";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-agent-blue to-agent-purple rounded-md flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-lg">AgenticVerse</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium hover:text-agent-purple transition-colors">Features</a>
            <a href="#showcase" className="text-sm font-medium hover:text-agent-purple transition-colors">Showcase</a>
            <a href="#demo" className="text-sm font-medium hover:text-agent-purple transition-colors">Demo</a>
            <a href="#contact" className="text-sm font-medium hover:text-agent-purple transition-colors">Contact</a>
          </nav>
          <Button className="bg-gradient-to-r from-agent-blue to-agent-purple hover:from-agent-purple hover:to-agent-blue transition-all duration-300">
            Get Started
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Build Powerful Agent Ecosystems</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Create interconnected AI systems that work together, communicate, and solve complex problems with our comprehensive toolset.
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
      
      {/* Network Visualization */}
      <section id="showcase" className="py-16 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Visualize Your Agent Network</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            See how agents communicate, share information, and collaborate in real-time with our interactive visualizations.
          </p>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 md:p-6 overflow-hidden">
            <NetworkVisualization />
          </div>
        </div>
      </section>
      
      {/* Interactive Demo */}
      <section id="demo" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Experience Agent Interaction</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Try our interactive demo to see how agents can process information, learn, and collaborate.
          </p>
          
          <AgentInteractionDemo />
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
                <div className="w-8 h-8 bg-gradient-to-r from-agent-blue to-agent-purple rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="font-bold text-lg text-white">AgenticVerse</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Building the future of interconnected AI systems and agent ecosystems.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-agent-purple">Documentation</a></li>
                <li><a href="#" className="text-sm hover:text-agent-purple">API Reference</a></li>
                <li><a href="#" className="text-sm hover:text-agent-purple">Examples</a></li>
                <li><a href="#" className="text-sm hover:text-agent-purple">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-agent-purple">About Us</a></li>
                <li><a href="#" className="text-sm hover:text-agent-purple">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-agent-purple">Contact Us</a></li>
                <li><a href="#" className="text-sm hover:text-agent-purple">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 AgenticVerse. All rights reserved.</p>
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
