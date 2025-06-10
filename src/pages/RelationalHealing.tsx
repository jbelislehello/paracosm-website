import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import NetworkVisualization from "@/components/NetworkVisualization";
import FeatureCard from "@/components/FeatureCard";
import HealingJournal from "@/components/HealingJournal";
import ContactSection from "@/components/ContactSection";
import PartnerToolsSection from "@/components/PartnerToolsSection";
import CalmMagicAssistant from "@/components/calm-magic/CalmMagicAssistant";
import CalmMagicCompass from "@/components/calm-magic/CalmMagicCompass";
import CoachingServices from "@/components/calm-magic/CoachingServices";
import MomentumManifestation from "@/components/hero/MomentumManifestation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Sparkles, Calendar, Palette, Music, BookOpen, MapPin, Clock, Video } from "lucide-react";

const RelationalHealing = () => {
  const [isCalmMagicOpen, setIsCalmMagicOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set page title
    document.title = "Calm Magic - Personal Coaching for Inner Life & Creative Relationships";
  }, []);

  const handleStartJourney = () => {
    // Open the Calm Magic assistant
    setIsCalmMagicOpen(true);
  };

  const handleDiscoverFramework = () => {
    setIsCalmMagicOpen(true);
  };

  const handleCoachingConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create form data for submission
    const formData = new FormData(e.target as HTMLFormElement);
    const consultationData = {
      name: formData.get('name'),
      email: formData.get('email'),
      interest: formData.get('coaching-interest'),
      challenges: formData.get('current-challenges'),
      experience: formData.get('coaching-experience'),
      recipientEmail: 'jbelisle@helloarchitekt.com'
    };
    
    console.log('Coaching consultation request:', consultationData);
    
    toast({
      title: "Coaching Consultation Requested",
      description: "Thank you for your interest! I'll reach out within 24 hours to schedule your free discovery call.",
      duration: 5000,
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  const coachingApproaches = [
    {
      title: "Inner Life Exploration",
      description: "Deep personal coaching to explore your emotional landscape, patterns, and authentic self using the Calm Magic framework.",
      icon: Heart,
      color: "from-rose-500 to-pink-600"
    },
    {
      title: "Creative Relationship Design", 
      description: "Innovative approaches to building playful, meaningful connections through creative expression and conscious communication.",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Freedom Compass Navigation",
      description: "Track your growth through the four forces (Love→Magic→Calm→Open) as your freedom arrow expands over time.",
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Congruence Coaching",
      description: "Align your Connessor and Magnesor tendencies to create authentic, sustainable personal transformation.",
      icon: Calendar,
      color: "from-green-500 to-emerald-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      program: "Inner Life Exploration",
      quote: "Working with the Calm Magic framework transformed how I understand my relationships. The freedom compass helped me see exactly where I was stuck and how to move forward.",
      result: "Increased freedom score from 40% to 85% in 6 weeks"
    },
    {
      name: "David K.",
      program: "Creative Relationship Design", 
      quote: "The creative approaches opened up entirely new ways of connecting. My relationships became more playful and authentic than I ever thought possible.",
      result: "Designed 3 new relationship rituals that brought lasting joy"
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
            <a href="#coaching" className="text-sm font-medium hover:text-purple-600 transition-colors">Coaching</a>
            <a href="#framework" className="text-sm font-medium hover:text-purple-600 transition-colors">Framework</a>
            <a href="#compass" className="text-sm font-medium hover:text-purple-600 transition-colors">Freedom Compass</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-purple-600 transition-colors">Stories</a>
            <a href="#contact" className="text-sm font-medium hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          <Button 
            onClick={handleDiscoverFramework}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 transition-all duration-300"
          >
            Book Discovery Call
          </Button>
        </div>
      </header>
      
      {/* Calm Magic Assistant - Modal */}
      <CalmMagicAssistant 
        onStartJourney={handleStartJourney} 
        isOpen={isCalmMagicOpen}
        onOpenChange={setIsCalmMagicOpen}
      />
      
      {/* Hero Section with Momentum Manifestation */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Explore Your Inner Life &
            <br />
            Create Magical Relationships
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-4">
            One-on-one coaching using the Calm Magic framework to help you navigate your emotional landscape, 
            develop innovative relationships, and track your freedom as you move through Love → Magic → Calm → Open.
          </p>
          
          {/* Momentum Manifestation Animation */}
          <div className="mb-8">
            <MomentumManifestation />
          </div>
          
          <div className="bg-gradient-to-r from-rose-100 to-purple-100 dark:from-rose-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-8 max-w-2xl mx-auto">
            <p className="text-base font-medium text-rose-800 dark:text-rose-200">
              🎯 Designed specifically for <strong>Coaches, Community Builders, and Self-Discovery</strong>
            </p>
            <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">
              The Calm Magic Assistant is a specialized tool for those guiding others or exploring their own inner transformation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDiscoverFramework}
              size="lg" 
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 transition-all duration-300"
            >
              Start Your Coaching Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
              onClick={() => document.getElementById('compass')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Freedom Compass Demo
            </Button>
          </div>
        </div>
      </section>
      
      {/* Coaching Approaches Section */}
      <section id="coaching" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Personalized Coaching Approaches</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-8">
            Work one-on-one to explore your inner life and develop creative, innovative relationships 
            using the unique Calm Magic framework that tracks your evolution through the four forces.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-16 max-w-3xl mx-auto text-center">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              Perfect for <strong>Coaches</strong> expanding their toolkit, <strong>Community Builders</strong> creating deeper connections, 
              and individuals on a <strong>Self-Discovery</strong> journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coachingApproaches.map((approach, index) => (
              <FeatureCard 
                key={index}
                title={approach.title} 
                description={approach.description} 
                icon={approach.icon}
                color={approach.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Freedom Compass Demo */}
      <section id="compass" className="py-20 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">The Freedom Compass</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Experience how your freedom grows as you move clockwise through the Calm Magic forces. 
            Watch the arrow lengthen as your Connessor and Magnesor tendencies evolve, tracking both congruent and non-congruent states.
          </p>
          
          <CalmMagicCompass />
          
          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
              In our coaching sessions, we'll use this compass to track your real-time progress through the forces, 
              helping you understand exactly where you are in your journey and how to expand your freedom further.
            </p>
            <Button 
              onClick={handleDiscoverFramework}
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600"
            >
              Experience This in Coaching
            </Button>
          </div>
        </div>
      </section>
      
      {/* Coaching Services */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <CoachingServices />
        </div>
      </section>
      
      {/* Calm Magic Healing Framework */}
      <section id="framework" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">💫 Calm Magic Coaching Framework</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-8">
            A structured approach to personal transformation and relationship healing. Experience how we move from 
            "I want to change" to "here's exactly how I'm growing and why it creates lasting freedom."
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-16 max-w-4xl mx-auto text-center">
            <p className="text-amber-800 dark:text-amber-200 font-medium">
              🧭 <strong>For Coaches:</strong> Add this framework to your practice. 
              <strong> For Community Builders:</strong> Create deeper group connections. 
              <strong> For Self-Discovery:</strong> Navigate your personal transformation journey.
            </p>
          </div>
          
          <HealingJournal />
        </div>
      </section>

      {/* Client Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-slate-100 dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Client Transformation Stories</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Real stories from people who've used the Calm Magic framework to transform their inner lives and relationships.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-purple-600">{testimonial.program}</p>
                    </div>
                  </div>
                  <blockquote className="text-slate-600 dark:text-slate-300 italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      Result: {testimonial.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Community & Resources Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Coaching Community & Resources</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Connect with our community of Calm Magic practitioners and access additional resources to support your coaching journey.
          </p>
          
          <PartnerToolsSection />
        </div>
      </section>
      
      {/* Contact & Coaching Consultation Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Ready to Begin Your Coaching Journey?</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Book a free discovery call to explore how Calm Magic coaching can help you develop your inner life and create innovative, joyful relationships.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Coaching Consultation Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Book Your Free Discovery Call</h3>
              
              <form onSubmit={handleCoachingConsultation} className="space-y-6">
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
                  <label htmlFor="coaching-interest" className="block text-sm font-medium mb-1">What interests you most?</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="coaching-interest" name="coaching-interest" required>
                    <option value="">Select your focus area</option>
                    <option value="inner-life">Inner Life Exploration</option>
                    <option value="creative-relationships">Creative Relationship Design</option>
                    <option value="calm-magic-intensive">Calm Magic Intensive</option>
                    <option value="not-sure">Not sure yet - want to explore</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="current-challenges" className="block text-sm font-medium mb-1">What are you hoping to explore or transform?</label>
                  <Textarea id="current-challenges" name="current-challenges" rows={4} placeholder="Share what's bringing you to coaching and what you'd like to create in your life..." />
                </div>
                
                <div>
                  <label htmlFor="coaching-experience" className="block text-sm font-medium mb-1">Previous coaching or personal development experience</label>
                  <Textarea id="coaching-experience" name="coaching-experience" rows={3} placeholder="Tell me about any previous coaching, therapy, or personal growth work you've done..." />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 transition-all duration-300"
                >
                  Request Discovery Call
                </Button>
              </form>
            </div>
            
            {/* Right Column - Coaching Info */}
            <div className="flex flex-col gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Why Choose Calm Magic Coaching</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-rose-600/20 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Unique Framework</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        The only coaching approach that uses the four forces and freedom compass to track authentic growth.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Creative & Innovative</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Move beyond traditional therapy with playful, creative approaches to relationship building.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Measurable Progress</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Track your evolution through the compass and see your freedom expand week by week.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-600/20 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Personal & Relational</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Work on yourself while simultaneously creating more beautiful relationships with others.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Virtual Sessions
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Online coaching via secure video platform
                  </p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Flexible Timing
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Sessions that work with your schedule and time zone
                  </p>
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
                Personal coaching using the Calm Magic framework to explore your inner life and create innovative, joyful relationships.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Coaching Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-purple-600">Inner Life Exploration</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Creative Relationship Design</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Calm Magic Intensive</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Freedom Compass Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-purple-600">Book Discovery Call</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Coaching Community</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Resources</a></li>
                <li><a href="#" className="text-sm hover:text-purple-600">Contact</a></li>
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

}
