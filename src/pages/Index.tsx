import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import EnhancedInnovationJournal from "@/components/EnhancedInnovationJournal";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import ProductDevelopmentAssistant from "@/components/ProductDevelopmentAssistant";
import { features } from "@/data/featureData";
import { Button } from "@/components/ui/button";
import { Heart, Search, Lightbulb, Users, Handshake, Sparkles, ArrowRight } from 'lucide-react';
const Index = () => {
  const [isProductAssistantOpen, setIsProductAssistantOpen] = useState(false);
  useEffect(() => {
    // Set page title
    document.title = "Paracosm - Product Development Framework";
  }, []);
  const handleStartJourney = () => {
    // Open the Product Development assistant
    setIsProductAssistantOpen(true);
  };
  const handleDiscoverFramework = () => {
    setIsProductAssistantOpen(true);
  };
  const healingSteps = [{
    icon: <Heart className="w-4 h-4" />,
    name: 'Inner Landscape Exploration',
    phase: 'Awareness'
  }, {
    icon: <Search className="w-4 h-4" />,
    name: 'Relational Pattern Mapping',
    phase: 'Awareness'
  }, {
    icon: <Lightbulb className="w-4 h-4" />,
    name: 'Healing Story Creation',
    phase: 'Awareness'
  }, {
    icon: <Users className="w-4 h-4" />,
    name: 'Integration Practices',
    phase: 'Transformation'
  }, {
    icon: <Handshake className="w-4 h-4" />,
    name: 'Transformation Anchoring',
    phase: 'Transformation'
  }];
  const bridgeElements = [{
    name: 'Inner-Outer Integration',
    description: 'Bridge your inner work with relational transformation that feels authentic'
  }, {
    name: 'Relational Intelligence',
    description: 'Healing practices that preserve your emotional truth while creating safety'
  }, {
    name: 'Transformation Anchoring',
    description: 'Integration that helps you embody change, not just understand it intellectually'
  }];
  return <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
            <a href="#healing" className="text-sm font-medium hover:text-purple-600 transition-colors">Healing</a>
            <a href="#showcase" className="text-sm font-medium hover:text-purple-600 transition-colors">Showcase</a>
            <a href="#partners" className="text-sm font-medium hover:text-purple-600 transition-colors">Partners</a>
            <a href="#contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          <Button onClick={handleDiscoverFramework} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
            Get Started
          </Button>
        </div>
      </header>
      
      {/* Product Development Framework Assistant - Modal */}
      <ProductDevelopmentAssistant onStartJourney={handleStartJourney} isOpen={isProductAssistantOpen} onOpenChange={setIsProductAssistantOpen} />
      
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
            {features.map((feature, index) => <FeatureCard key={index} title={feature.title} description={feature.description} icon={feature.icon} color={feature.color} />)}
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
            

            
          </div>

          {/* Why This Matters Section */}
          
          
          <EnhancedInnovationJournal />
        </div>
      </section>

      {/* Calm Magic Healing Framework */}
      <section id="healing" className="py-20 px-4 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              💫 Calm Magic Healing Framework
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg mb-8">
              A structured approach to move from "I want to heal" to "here's exactly how I'm growing and why it creates lasting freedom." 
              Bridge inner work to outer relationships with authentic transformation.
            </p>
          </div>

          {/* Healing Framework Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">
                Phase 1: Building Awareness (Steps 1-3)
              </h3>
              <div className="space-y-3 text-purple-700 dark:text-purple-300">
                <p><strong>What you do:</strong></p>
                <div className="space-y-3">
                  {healingSteps.slice(0, 3).map((step, index) => <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="text-purple-600">{step.icon}</div>
                      <span><strong>{index + 1}.</strong> {step.name}</span>
                    </div>)}
                </div>
                <p className="text-sm font-semibold bg-purple-100 dark:bg-purple-900 p-3 rounded">
                  <strong>Key output:</strong> Deep understanding of your emotional landscape and relational patterns
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                Phase 2: Creating Transformation (Steps 4-7)
              </h3>
              <div className="space-y-3 text-blue-700 dark:text-blue-300">
                <p><strong>What you do:</strong></p>
                <div className="space-y-3">
                  {healingSteps.slice(3, 5).map((step, index) => <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="text-blue-600">{step.icon}</div>
                      <span><strong>{index + 4}.</strong> {step.name}</span>
                    </div>)}
                  <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    + Shadow Integration & Freedom Compass Tracking
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge Elements */}
          <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-bold mb-4">The Healing Bridge Elements</h3>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Why healing often stagnates: there's a gap between "healing insight" and "integrated transformation." These elements create a bridge:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {bridgeElements.map((element, index) => <div key={index} className="bg-white dark:bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">{element.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{element.description}</p>
                </div>)}
            </div>

            <p className="text-slate-700 dark:text-slate-300 mb-4">
              The framework prevents the common pattern where healing work stays intellectual without relational integration, 
              or where surface-level changes don't address core patterns.
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 p-4 rounded-lg">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                <strong>Freedom Movement:</strong> This framework tracks your movement through Love→Magic→Calm→Open, 
                ensuring healing creates expanding freedom rather than spiritual bypassing or emotional overwhelm.
              </p>
            </div>
          </div>

          {/* Why Both Frameworks Matter */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-cyan-950/30 p-8 rounded-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Complementary Transformation</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6 max-w-4xl mx-auto">
                The Product Development Framework transforms how you create in the world. 
                The Calm Magic Framework transforms how you relate to yourself and others. 
                Together, they bridge both your creative vision and personal evolution.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleDiscoverFramework} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explore Product Framework
                </Button>
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                  Begin Healing Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
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
                <li><a href="/calm-magic-assistant" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-purple-600">Calm Magic Assistant</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Implementation Examples</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Case Studies</a></li>
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
    </div>;
};
export default Index;