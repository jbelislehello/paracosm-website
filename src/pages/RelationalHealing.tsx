
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import InnovationJournal from "@/components/InnovationJournal";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Users, Sparkles, Calendar, Palette, Music, BookOpen, MapPin } from "lucide-react";

const RelationalHealing = () => {
  const [isCalmMagicOpen, setIsCalmMagicOpen] = useState(false);
  const { toast } = useToast();

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

  const handleRetreatSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Retreat Interest Submitted",
      description: "Thank you for your interest! We'll send you retreat details and early-bird pricing soon.",
      duration: 5000,
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
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

  const upcomingEvents = [
    {
      name: "DRIFT",
      subtitle: "Spring Emotional Flow Retreat",
      date: "March 21-23, 2025",
      description: "A three-day immersive journey exploring emotional currents and creative expression through guided movement, art therapy, and relational healing circles.",
      icon: Palette,
      color: "from-green-400 to-emerald-500",
      early_bird: "Early Bird: $450 (until Feb 15)"
    },
    {
      name: "GL!TCH",
      subtitle: "Summer Digital Detox & Healing",
      date: "June 20-22, 2025",
      description: "Disconnect from digital overwhelm and reconnect with authentic emotional expression through analog creativity, nature immersion, and intentional relationship building.",
      icon: Music,
      color: "from-orange-400 to-red-500",
      early_bird: "Early Bird: $475 (until May 15)"
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
              Next Retreat: DRIFT - March 2025
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
      
      {/* Upcoming Retreats Section */}
      <section id="retreats" className="py-20 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Seasonal Healing Retreats</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Join our quarterly emotional creativity retreats designed to provide ongoing support for your healing journey through the seasons of transformation.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className={`h-32 bg-gradient-to-r ${event.color} flex items-center justify-center`}>
                  <event.icon className="w-12 h-12 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                  <h4 className="text-lg text-purple-600 dark:text-purple-400 mb-2">{event.subtitle}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{event.description}</p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">{event.early_bird}</p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 transition-all duration-300"
                  >
                    Reserve Your Spot
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 md:p-6 overflow-hidden">
            <h3 className="text-2xl font-bold text-center mb-4">Visualize Your Healing Journey</h3>
            <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-8">
              See how emotional healing flows through our retreat experience from initial awareness to transformed relationships, with clear support at each phase of your healing process.
            </p>
            <NetworkVisualization />
          </div>
        </div>
      </section>
      
      {/* Healing Community & Resources Section */}
      <section id="community" className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Healing Community & Resources</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Connect with our ecosystem of healing practitioners, creative therapists, and supportive resources to enhance your emotional transformation journey.
          </p>
          
          <PartnerToolsSection />
        </div>
      </section>
      
      {/* Contact & Retreat Inquiry Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Ready to Begin Your Healing Journey?</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Join our community of healing seekers and reserve your spot in our next emotional creativity retreat. Start your transformation today.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Retreat Interest Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Reserve Your Retreat Spot</h3>
              
              <form onSubmit={handleRetreatSignup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                    <Input id="name" name="name" required />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="retreat" className="block text-sm font-medium mb-1">Preferred Retreat</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="retreat" name="retreat" required>
                    <option value="">Select a retreat</option>
                    <option value="drift-march">DRIFT - March 21-23, 2025</option>
                    <option value="glitch-june">GL!TCH - June 20-22, 2025</option>
                    <option value="both">Both retreats</option>
                    <option value="future">Future retreats</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="healing-goals" className="block text-sm font-medium mb-1">What are you hoping to heal or transform?</label>
                  <Textarea id="healing-goals" name="healing-goals" rows={4} placeholder="Share what brought you here and what you're seeking to heal in your relationships..." />
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium mb-1">Previous healing or retreat experience</label>
                  <Textarea id="experience" name="experience" rows={3} placeholder="Tell us about any previous healing work, therapy, or retreat experiences..." />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 transition-all duration-300"
                >
                  Submit Retreat Interest
                </Button>
              </form>
            </div>
            
            {/* Right Column - Healing Info */}
            <div className="flex flex-col gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Why Choose Calm Magic Retreats</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-rose-600/20 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Holistic Healing Approach</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Integrate mind, body, and spirit through creative expression and conscious relationship practices.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Expert-Led Sessions</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Learn from certified trauma-informed therapists, creative arts practitioners, and relationship coaches.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Small Group Intimacy</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Limited to 12 participants for deep connection and personalized attention throughout your journey.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-600/20 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Ongoing Support</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Access to integration sessions and community support for 90 days after each retreat.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Email Us
                  </h4>
                  <a href="mailto:healing@calmmagic.com" className="text-rose-600 hover:underline text-sm">
                    healing@calmmagic.com
                  </a>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Retreat Location
                  </h4>
                  <div className="text-slate-600 dark:text-slate-300 text-sm">
                    <p>Mountain Sanctuary</p>
                    <p>Blue Ridge, NC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
                <li><a href="#" className="text-sm hover:text-purple-600">Integration Support</a></li>
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
