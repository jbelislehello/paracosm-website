
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';

const ParacosmEventsSection = () => {
  const events = [
    {
      name: "Drift avec Marc Kandalaft",
      description: "An immersive journey exploring creative leadership through collaborative storytelling and artistic expression.",
      date: "Coming Soon",
      location: "Montreal, QC",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Gl!tch",
      description: "A digital transformation workshop bridging human creativity with technological innovation.",
      date: "Coming Soon", 
      location: "Toronto, ON",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Nest",
      description: "A regenerative leadership retreat focused on building sustainable organizational ecosystems.",
      date: "Coming Soon",
      location: "Vancouver, BC", 
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section id="events" className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Paracosm Events 2025
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join us for transformative experiences that blend creativity, technology, and leadership development across Canada.
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

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 px-8 py-3"
            size="lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Subscribe for Event Updates
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ParacosmEventsSection;
