
import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import InnovationJournal from "@/components/InnovationJournal";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import { features } from "@/data/featureData";
import { Button } from "@/components/ui/button";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "Paracosm - Innovation Journal";
  }, []);

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
            <a href="#showcase" className="text-sm font-medium hover:text-purple-600 transition-colors">Showcase</a>
            <a href="#journal" className="text-sm font-medium hover:text-purple-600 transition-colors">Journal</a>
            <a href="#partners" className="text-sm font-medium hover:text-purple-600 transition-colors">Partners</a>
            <a href="#contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
            Get Started
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Build Powerful Innovation Ecosystems</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Navigate the three gardens of exploration using the Calm Magic Framework to unlock organizational potential and transform how teams think, collaborate, and innovate.
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Visualize Your Innovation Network</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            See how ideas flow between the three gardens and track the emotional landscape of your innovation journey in real-time.
          </p>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 md:p-6 overflow-hidden">
            <NetworkVisualization />
          </div>
        </div>
      </section>
      
      {/* Innovation Journal */}
      <section id="journal" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">🌱 Innovation Journal</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Navigate the Gardens of Exploration using the Calm Magic Framework. Map your internal territory and capture insights as they emerge.
          </p>
          
          <InnovationJournal />
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
                Exploring interconnected worlds and pushing the boundaries of imagination through the Calm Magic Framework.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-purple-600">Documentation</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Framework Guide</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Examples</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Blog</a></li>
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
