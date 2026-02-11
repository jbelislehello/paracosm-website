import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ExternalLink, Wifi, BookOpen, Globe, Building, Radio } from 'lucide-react';

const categories = [
  { name: "All", color: "from-slate-500 to-slate-600", icon: Users },
  { name: "Connected Life", color: "from-cyan-500 to-teal-500", icon: Wifi, mediumTag: "connected-life" },
  { name: "Telling Stories", color: "from-pink-500 to-rose-500", icon: BookOpen, mediumTag: "telling-stories" },
  { name: "Worldbuilders", color: "from-purple-500 to-violet-500", icon: Globe, mediumTag: "worldbuilders" },
  { name: "Learning Enterprises", color: "from-blue-500 to-indigo-500", icon: Building, mediumTag: "learning-enterprises" },
  { name: "Post-Broadcast", color: "from-orange-500 to-amber-500", icon: Radio, mediumTag: "post-broadcast" },
];

const events = [
  {
    name: "GL!TCH Session: Maîtriser X Détourner",
    description: "An immersive Gl!tch session at the E-AI 2026 Annual Conference exploring the intersection of mastery and creative subversion in AI-augmented transformation.",
    date: "February 18-19, 2026",
    location: "Montreal Convention Centre",
    category: "Connected Life",
    color: "from-cyan-500 to-teal-500",
    cta: "Get Tickets",
    link: "https://my.weezevent.com/e-ai-2026"
  },
  {
    name: "AI & Municipalités — GL!TCH Summit",
    description: "A hands-on summit for municipal leaders and technical executives to build frameworks for AI governance and strategic implementation in public services.",
    date: "April 22-23, 2026",
    location: "Cantons-de-l'Est, QC",
    category: "Learning Enterprises",
    color: "from-blue-500 to-indigo-500",
    cta: "Join Waitlist"
  },
  {
    name: "Transformation Design Lab",
    description: "Learn to create diegetic prototypes and bridge the gap between vision and implementation through our proven methodology.",
    date: "Summer 2026",
    location: "Montreal, QC",
    category: "Worldbuilders",
    color: "from-purple-500 to-violet-500",
    cta: "Early Access"
  },
  {
    name: "GL!TCH - Relational Intelligence Summit",
    description: "Advanced coaching techniques for creating coherent, learning-oriented cultures that drive innovation and engagement.",
    date: "Autumn 2026",
    location: "Madeira, Portugal",
    category: "Telling Stories",
    color: "from-pink-500 to-rose-500",
    cta: "Get Notified"
  }
];

const ParacosmEventsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? events : events.filter(e => e.category === activeCategory);

  const getCategoryMeta = (name: string) => categories.find(c => c.name === name);

  return (
    <section id="events" className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Upcoming Learning Events
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join exclusive workshops and intensives designed to accelerate your transformation journey through hands-on learning and expert guidance.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-md scale-105`
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtered.map((event, index) => {
            const catMeta = getCategoryMeta(event.category);
            const CatIcon = catMeta?.icon || Users;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  {/* Category badge */}
                  <a
                    href={catMeta?.mediumTag ? `https://medium.com/futurographer/tagged/${catMeta.mediumTag}` : 'https://medium.com/futurographer'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${event.color} w-fit mb-3 hover:opacity-90 transition-opacity`}
                  >
                    <CatIcon className="w-3 h-3" />
                    {event.category}
                  </a>
                  <CardTitle className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                    {event.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <a href={event.link || "https://app.reclaim.ai/m/jonathan-helloarchitekt"} target="_blank" rel="noopener noreferrer">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {event.cta}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold mb-4">Ready to Transform Your Leadership?</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Don't wait for the next event. Start your transformation journey today with a personalized discovery call to explore how our proven methodologies can accelerate your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt" target="_blank" rel="noopener noreferrer">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 px-8 py-3"
                  size="lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Your Free Discovery Call
                </Button>
              </a>
              <a href="#contact">
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-3"
                >
                  Learn More About Our Services
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParacosmEventsSection;
