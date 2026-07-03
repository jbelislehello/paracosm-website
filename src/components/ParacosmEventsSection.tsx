import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ExternalLink, BookOpen, Globe, Building } from 'lucide-react';

const categories = [
  { name: "All", icon: Users },
  { name: "Relational Intelligence", icon: Users },
  { name: "Learning Organizations", icon: Building },
  { name: "Retreats", icon: Globe },
  { name: "Events", icon: Calendar },
];

const events = [
  {
    name: "GL!TCH Session: Maîtriser X Détourner",
    description: "An immersive Gl!tch session at the E-AI 2026 Annual Conference exploring the intersection of mastery and creative subversion in AI-augmented transformation.",
    date: "February 18-19, 2026",
    location: "Montreal Convention Centre",
    category: "Learning Organizations",
    cta: "View Presentation",
    link: "https://www.beautiful.ai/player/-OmpqZeoUAksIU7UF7lT",
    secondaryCta: "Read Newsletter Article",
    secondaryLink: "https://www.linkedin.com/pulse/b%25C3%25A2tir-une-entreprise-apprenante-%25C3%25A0-l%25C3%25A8re-de-lia-jonathan-belisle-xxyue"
  },
  {
    name: "AI & Municipalités — GL!TCH Summit",
    description: "A hands-on summit for municipal leaders and technical executives to build frameworks for AI governance and strategic implementation in public services.",
    date: "April 22-23, 2026",
    location: "Cantons-de-l'Est, QC",
    category: "Learning Organizations",
    cta: "Join Waitlist"
  },
  {
    name: "GL!TCH — The Imagination of Women",
    description: "A structured creative lab using narrative rupture to reveal suppressed feminine and queer imaginaries. Participants leave with a Glitch Map, a working prototype, and a shared vocabulary for sustaining transformation. Accepted at the Sustainability, Temporalities and Futures conference.",
    date: "June 9-10, 2026",
    location: "Turku, Finland",
    category: "Events",
    cta: "Learn More",
    link: "https://futuresconference2026.com/"
  },
  {
    name: "Transformation Design Lab",
    description: "Learn to create diegetic prototypes and bridge the gap between vision and implementation through our proven methodology.",
    date: "Summer 2026",
    location: "Montreal, QC",
    category: "Retreats",
    cta: "Early Access"
  },
  {
    name: "Paracosm Retreat — Relational Intelligence",
    description: "A 3-day immersive retreat integrating the Entrepreneurial Tarot, relational intelligence frameworks, and leadership reflection at a stunning island venue.",
    date: "August 25-27, 2026",
    location: "Botanico House, Azores Island",
    category: "Retreats",
    cta: "Request Invitation",
    link: "/paracosm-retreat"
  },
  {
    name: "GL!TCH - Relational Intelligence Summit",
    description: "Advanced coaching techniques for creating coherent, learning-oriented cultures that drive innovation and engagement.",
    date: "Autumn 2026",
    location: "Madeira, Portugal",
    category: "Relational Intelligence",
    cta: "Get Notified"
  }
];

const ParacosmEventsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? events : events.filter(e => e.category === activeCategory);
  const getCategoryMeta = (name: string) => categories.find(c => c.name === name);

  return (
    <div className="relative">
      {/* Category filter tabs — bloom style */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-vhs uppercase tracking-[0.18em] text-[10px] transition-all duration-200 border ${
                isActive
                  ? 'bg-[hsl(var(--bloom-amber))] text-[hsl(var(--bloom-ink))] border-[hsl(var(--bloom-amber))] shadow-[0_0_16px_hsl(var(--bloom-amber)/0.4)]'
                  : 'bg-[hsl(var(--bloom-ink)/0.5)] text-white/70 border-[hsl(var(--bloom-magenta)/0.35)] hover:text-[hsl(var(--bloom-amber))] hover:border-[hsl(var(--bloom-amber)/0.5)]'
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((event, index) => {
          const catMeta = getCategoryMeta(event.category);
          const CatIcon = catMeta?.icon || Users;
          return (
            <Card
              key={index}
              className="group relative overflow-hidden rounded-xl border border-[hsl(var(--bloom-magenta)/0.3)] bg-[hsl(var(--bloom-ink)/0.55)] backdrop-blur-sm hover:border-[hsl(var(--bloom-amber)/0.6)] transition-all duration-300"
            >
              <div className="bloom-scanlines pointer-events-none absolute inset-0 opacity-[0.08]" />
              <CardHeader className="pb-3 relative">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-vhs uppercase tracking-[0.18em] text-[hsl(var(--bloom-amber))] border border-[hsl(var(--bloom-amber)/0.4)] bg-[hsl(var(--bloom-amber)/0.08)] w-fit mb-3">
                  <CatIcon className="w-3 h-3" />
                  {event.category}
                </span>
                <CardTitle className="font-display text-xl leading-tight text-white group-hover:text-[hsl(var(--bloom-amber))] transition-colors">
                  {event.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <p className="text-sm font-redacted italic text-white/85 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-1.5 pt-1 border-t border-[hsl(var(--bloom-magenta)/0.2)]">
                  <div className="flex items-center gap-2 text-xs font-vhs uppercase tracking-[0.15em] text-white/60 pt-2">
                    <Calendar className="w-3.5 h-3.5 text-[hsl(var(--bloom-amber))]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-vhs uppercase tracking-[0.15em] text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-[hsl(var(--bloom-magenta))]" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {event.link?.startsWith('/') ? (
                  <Link to={event.link}>
                    <Button
                      size="sm"
                      className="w-full bg-[hsl(var(--bloom-magenta))] text-white hover:bg-[hsl(var(--bloom-amber))] hover:text-[hsl(var(--bloom-ink))] font-vhs uppercase tracking-widest text-[10px] transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-2" />
                      {event.cta}
                    </Button>
                  </Link>
                ) : (
                  <a href={event.link || "https://app.reclaim.ai/m/jonathan-helloarchitekt"} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="sm"
                      className="w-full bg-[hsl(var(--bloom-magenta))] text-white hover:bg-[hsl(var(--bloom-amber))] hover:text-[hsl(var(--bloom-ink))] font-vhs uppercase tracking-widest text-[10px] transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-2" />
                      {event.cta}
                    </Button>
                  </a>
                )}

                {event.secondaryLink && (
                  <a href={event.secondaryLink} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-[hsl(var(--bloom-magenta)/0.4)] text-white/80 hover:bg-[hsl(var(--bloom-ink)/0.6)] hover:text-[hsl(var(--bloom-amber))] hover:border-[hsl(var(--bloom-amber)/0.5)] font-vhs uppercase tracking-widest text-[10px] transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-2" />
                      {event.secondaryCta}
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Closing CTA — bloom style */}
      <div className="mt-12 rounded-xl border border-[hsl(var(--bloom-amber)/0.35)] bg-gradient-to-br from-[hsl(var(--bloom-ink)/0.7)] to-[hsl(var(--bloom-magenta)/0.15)] p-8 text-center relative overflow-hidden">
        <div className="bloom-scanlines pointer-events-none absolute inset-0 opacity-[0.1]" />
        <div className="relative">
          <p className="font-vhs uppercase tracking-[0.35em] text-xs text-[hsl(var(--bloom-amber))]">// Next step</p>
          <h3 className="mt-2 font-display text-2xl md:text-3xl bloom-chroma-static text-white">Ready to transform your leadership?</h3>
          <p className="mt-3 text-sm md:text-base font-redacted italic text-white/80 max-w-2xl mx-auto">
            Don't wait for the next event. Start your transformation journey today with a personalized discovery call.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[hsl(var(--bloom-amber))] text-[hsl(var(--bloom-ink))] hover:bg-white font-vhs uppercase tracking-widest text-xs px-6">
                <Calendar className="w-4 h-4 mr-2" />
                Book a discovery call
              </Button>
            </a>
            <a href="#contact">
              <Button
                variant="outline"
                className="bg-transparent border-[hsl(var(--bloom-magenta)/0.5)] text-white hover:bg-[hsl(var(--bloom-magenta)/0.2)] hover:text-white font-vhs uppercase tracking-widest text-xs px-6"
              >
                Learn more
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParacosmEventsSection;
