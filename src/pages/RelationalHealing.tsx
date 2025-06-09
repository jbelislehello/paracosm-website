
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import InnovationJournal from "@/components/InnovationJournal";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import { Button } from "@/components/ui/button";
import { Heart, Users, Sparkles, Calendar } from "lucide-react";

const RelationalHealing = () => {
  const [isCalmMagicOpen, setIsCalmMagicOpen] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "Calm Magic - Relational Healing & Emotional Creativity Retreats";
  }, []);

  const handleStartJourney = () => {
    // Open the Calm Magic assistant
    setIsCalmMagicOpen(true);
  };

  const handleDiscoverFramework = () => {
    setIsCalmMagicOpen(true);
  };

  const healingFeatures = [
    {
      title: "Relational Healing",
      description: "Transform relationship patterns through guided emotional processing and conscious communication practices.",
      icon: Heart,
      color: "from-rose-500 to-pink-600"
    },
    {
      title: "Emotional Creativity",
      description: "Unlock creative expression as a pathway to healing, using art, movement, and storytelling for transformation.",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Community Healing",
      description: "Experience the power of collective healing in supportive group settings designed for deep connection.",
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Quarterly Retreats",
      description: "Join our seasonal emotional creativity retreats, scheduled every three months for ongoing healing support.",
      icon: Calendar,
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">CM</span>
            </div>
            <span className="font-bold text-lg">Calm Magic</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#healing" className="text-sm font-medium hover:text-purple-600 transition-colors">Healing</a>
            <a href="#framework" className="text-sm font-medium hover:text-purple-600 transition-colors">Framework</a>
            <a href="#retreats" className="text-sm font-medium hover:text-purple-600 transition-colors">Retreats</a>
            <a href="#community" className="text-sm font-medium hover:text-purple-600 transition-colors">Community</a>
            <a href="#contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          <Button 
            onClick={handleDiscoverFramework}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 transition-all duration-300"
          >
            Start Healing
          </Button>
        </div>
      </header>
      
      {/* Calm Magic Assistant - Modal */}
      <CalmMagicAssistant 
        onStartJourney={handleStartJourney} 
        isOpen={isCalmMagicOpen}
        onOpenChange={setIsCalmMagicOpen}
      />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Heal Relationships Through
            <br />
            Emotional Creativity
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Transform your relationships and heal emotional wounds through our quarterly retreats that blend creativity, mindfulness, and the Calm Magic framework for deep relational healing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDiscoverFramework}
              size="lg" 
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 transition-all duration-300"
            >
              Discover Calm Magic Framework
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
            >
              Next Retreat: March 2025
            </Button>
          </div>
        </div>
      </section>
      
      {/* Healing Features Section */}
      <section id="healing" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Pathways to Relational Healing</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Navigate from emotional wounds to healed relationships using our holistic approach that integrates creativity, mindfulness, and proven healing methodologies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healingFeatures.map((feature, index) => (
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
      
      {/* Calm Magic Healing Framework */}
      <section id="framework" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">💫 Calm Magic Healing Framework</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            A structured approach to relational healing that bridges emotional awareness with creative expression. Transform "we need to heal this" into "here's exactly how we heal together and why it creates lasting change."
          </p>
          
          <InnovationJournal />
        </div>
      </section>
      
      {/* Healing Process Visualization */}
      <section id="retreats" className="py-16 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Visualize Your Healing Journey</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            See how emotional healing flows through our retreat experience from initial awareness to transformed relationships, with clear support at each phase of your healing process.
          </p>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 md:p-6 overflow-hidden">
            <NetworkVisualization />
          </div>
        </div>
      </section>
      
      {/* Community Tools Section */}
      <section id="community">
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
                <div className="w-8 h-8 bg-gradient-to-r from-rose-600 to-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">CM</span>
                </div>
                <span className="font-bold text-lg text-white">Calm Magic</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Healing relationships and nurturing emotional creativity through structured frameworks for deep transformation and lasting connection.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Healing Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-purple-600">Retreat Schedule</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Healing Practices</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Community Stories</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Framework Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-purple-600">Join a Retreat</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Facilitator Training</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Healing Support</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 Calm Magic. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white">Instagram</a>
              <a href="#" className="text-slate-400 hover:text-white">YouTube</a>
              <a href="#" className="text-slate-400 hover:text-white">Community</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RelationalHealing;
