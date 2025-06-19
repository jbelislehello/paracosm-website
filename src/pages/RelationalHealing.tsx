
import { useEffect, useState } from "react";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import CoachingServices from "@/components/calm-magic/CoachingServices";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from "react-router-dom";

const RelationalHealing = () => {
  const [isCalmMagicOpen, setIsCalmMagicOpen] = useState(true); // Open by default

  useEffect(() => {
    document.title = "Calm Magic Assistant - Relational & Emotional Healing";
  }, []);

  const handleStartJourney = () => {
    setIsCalmMagicOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20">
      {/* Navigation */}
      <header className="fixed w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-600 to-purple-600 rounded-md flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Calm Magic Assistant</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link to="/case-studies" className="text-sm font-medium hover:text-purple-600 transition-colors">Case Studies</Link>
            <Link to="/about-us" className="text-sm font-medium hover:text-purple-600 transition-colors">About</Link>
            <a href="#coaching-services" className="text-sm font-medium hover:text-purple-600 transition-colors">Services</a>
          </nav>
          <Button onClick={handleStartJourney} className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600">
            Open Calm Magic
          </Button>
        </div>
      </header>

      {/* Calm Magic Assistant - Opens automatically */}
      <CalmMagicAssistant 
        onStartJourney={handleStartJourney} 
        isOpen={isCalmMagicOpen} 
        onOpenChange={setIsCalmMagicOpen} 
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="container relative px-4 py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-8 border border-white/20">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 animate-gradient-x mb-6">
                Calm Magic Framework
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200">
                Transform your inner life and relationships through the four forces of personal freedom
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button onClick={handleStartJourney} className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Explore Your Inner Landscape
                </Button>
                <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="flex items-center gap-2">
                    Book Discovery Call
                  </Button>
                </a>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Experience interactive tools for emotional awareness, creative relationship design, and personal transformation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Services Section */}
      <section id="coaching-services" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <CoachingServices />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-600 to-purple-600 rounded-md flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">Calm Magic</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Transform your inner life and relationships through personalized coaching and innovative tools for emotional awareness and creative connection.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#coaching-services" className="text-sm hover:text-purple-600">Individual Coaching</a></li>
                <li><a href="#coaching-services" className="text-sm hover:text-purple-600">Relationship Design</a></li>
                <li><a href="#coaching-services" className="text-sm hover:text-purple-600">Transformation Programs</a></li>
                <li><Link to="/case-studies" className="text-sm hover:text-purple-600">Case Studies</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-sm hover:text-purple-600">About Jonathan</Link></li>
                <li><Link to="/" className="text-sm hover:text-purple-600">Leadership Coaching</Link></li>
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

export default RelationalHealing;
