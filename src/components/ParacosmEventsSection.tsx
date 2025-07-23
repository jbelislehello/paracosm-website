import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';

const ParacosmEventsSection = () => {
  const events = [
    {
      name: "AI Symposium - Brome Misisquoi",
      description: "A hands-on workshop for executives and technical leaders to build frameworks for AI governance and strategic implementation.",
      date: "Autumn 2025",
      location: "Lac Brome, QC",
      color: "from-blue-500 to-cyan-500",
      cta: "Join Waitlist"
    },
    {
      name: "Transformation Design Lab",
      description: "Learn to create diegetic prototypes and bridge the gap between vision and implementation through our proven methodology.",
      date: "Summer 2026", 
      location: "Montreal, QC",
      color: "from-purple-500 to-pink-500",
      cta: "Early Access"
    },
    {
      name: "Relational Intelligence Summit",
      description: "Advanced coaching techniques for creating coherent, learning-oriented cultures that drive innovation and engagement.",
      date: "Autumn 2025",
      location: "Madeira, Portugal", 
      color: "from-green-500 to-emerald-500",
      cta: "Get Notified"
    }
  ];

  return (
    <section id="events" className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Upcoming Learning Events
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join exclusive workshops and intensives designed to accelerate your transformation journey through hands-on learning and expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
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

                <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
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
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold mb-4">Ready to Transform Your Leadership?</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Don't wait for the next event. Start your transformation journey today with a personalized discovery call to explore how our proven methodologies can accelerate your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
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
