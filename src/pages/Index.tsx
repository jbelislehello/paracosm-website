import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import AgentInteractionDemo from "@/components/AgentInteractionDemo";
import ProductDevelopmentAssistant from "@/components/ProductDevelopmentAssistant";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Bot, Brain, TrendingUp, Target, Cog, Compass, Zap } from 'lucide-react';
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
            <a href="#framework" className="text-sm font-medium hover:text-purple-600 transition-colors">Framework</a>
            <a href="#agent-demo" className="text-sm font-medium hover:text-purple-600 transition-colors">Agent Demo</a>
            <a href="#visualization" className="text-sm font-medium hover:text-purple-600 transition-colors">Visualization</a>
            <a href="#partners" className="text-sm font-medium hover:text-purple-600 transition-colors">Partners</a>
            <Link to="/" className="text-sm font-medium hover:text-purple-600 transition-colors">Leadership Coaching</Link>
            <Link to="/calm-magic-assistant" className="text-sm font-medium hover:text-purple-600 transition-colors">Relational Healing</Link>
            <Link to="/case-studies" className="text-sm font-medium hover:text-purple-600 transition-colors">Case Studies</Link>
            <a href="#contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
              Explore Coaching
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section - Agentic UX Focus */}
      <HeroSection onDiscoverFramework={handleDiscoverFramework} />
      
      {/* Imagineering to Engineering Framework */}
      <section id="framework" className="py-20 px-4 bg-gradient-to-r from-blue-50 via-purple-50 to-slate-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-slate-950/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              From Imagineering to Engineering
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Bridge the gap between creative vision and technical implementation with our comprehensive 
              two-phase framework that preserves innovation through the entire development lifecycle.
            </p>
          </div>

          {/* Phase Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Phase 1 Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Phase 1</h3>
                    <p className="text-blue-100">Understanding the Problem</p>
                  </div>
                </div>
                <div className="text-sm bg-blue-600/30 rounded-lg p-3">
                  <strong>Steps 1-3:</strong> Research, Ideation, Prototyping
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-200">What You Do:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Compass className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Study how people actually work and what frustrates them</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Talk to stakeholders about their real needs and pain points</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Build a working demo that tells a story about how things could work better</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    <strong>Key Output:</strong> A diegetic prototype that shows the vision in action, not just describes it
                  </p>
                </div>
              </div>
            </div>

            {/* Phase 2 Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Cog className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Phase 2</h3>
                    <p className="text-purple-100">Making It Real</p>
                  </div>
                </div>
                <div className="text-sm bg-purple-600/30 rounded-lg p-3">
                  <strong>Steps 4-7:</strong> Documentation, Handover, Development
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h4 className="font-semibold text-lg text-purple-800 dark:text-purple-200">What You Do:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Turn the demo into clear technical requirements</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Document exactly what needs to be built and how it should work</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Hand everything over to engineers with context intact</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cog className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Begin actual development with preserved vision</span>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                    <strong>Key Output:</strong> Engineering teams understand not just what to build, but why
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Framework Benefits */}
          <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Why This Framework Prevents Project Failure
              </h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Most projects fail because there's a gap between "good idea" and "working product." 
                Our framework creates a bridge that preserves innovation through implementation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Diegetic Prototype</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">A demo that feels real and tells a complete story</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Systems Intelligence</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Technical specs that preserve the original vision</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Handover Ritual</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Engineers understand not just what to build, but why</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button onClick={handleDiscoverFramework} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore the Framework in Detail
            </Button>
          </div>
        </div>
      </section>

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
              icon={Bot}
              color="from-blue-500 to-blue-600"
            />
            <FeatureCard 
              title="Emergent Intelligence"
              description="Watch as agent interactions create solutions beyond individual agent capabilities"
              icon={Brain}
              color="from-purple-500 to-purple-600"
            />
            <FeatureCard 
              title="Adaptive Learning"
              description="Agents continuously learn from interactions and improve their collaborative performance"
              icon={TrendingUp}
              color="from-green-500 to-green-600"
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
            <Link to="/">
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
                <li><Link to="/" className="text-sm hover:text-purple-600">Leadership Coaching</Link></li>
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
