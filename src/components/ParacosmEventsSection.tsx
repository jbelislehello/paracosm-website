import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowUpRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { editorialTone, editorialType, type EditorialTone } from '@/components/editorial/editorialTokens';

const categories = [
  "All",
  "Relational Intelligence",
  "Learning Organizations",
  "Retreats",
  "Events",
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

interface ParacosmEventsSectionProps {
  tone?: EditorialTone;
}

const ParacosmEventsSection: React.FC<ParacosmEventsSectionProps> = ({ tone = "warm" }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const t = editorialTone[tone];

  const filtered = activeCategory === "All" ? events : events.filter(e => e.category === activeCategory);

  return (
    <div className="relative">
      {/* Editorial filter — inline typographic index */}
      <div className={cn("flex flex-wrap items-baseline gap-x-6 gap-y-2 pb-6 mb-10 border-b border-current/15", editorialType.caption)}>
        <span className="opacity-60">Index —</span>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "transition-opacity",
                isActive
                  ? cn("opacity-100 border-b pb-0.5", t.accentBorder, t.kicker)
                  : "opacity-60 hover:opacity-100"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Editorial index-card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {filtered.map((event, index) => {
          const primaryHref = event.link?.startsWith('/') ? undefined : (event.link || "https://app.reclaim.ai/m/jonathan-helloarchitekt");
          const primaryTo = event.link?.startsWith('/') ? event.link : undefined;

          return (
            <article key={index} className="group flex flex-col border-t border-current/20 pt-6">
              <div className={cn("flex items-baseline justify-between mb-4", editorialType.caption)}>
                <span className={cn("opacity-80", t.kicker)}>{event.category}</span>
                <span className="opacity-50 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              </div>

              <h3 className={cn(editorialType.serif, "text-2xl md:text-[26px] leading-[1.15] tracking-tight mb-4")}>
                {event.name}
              </h3>

              <p className="text-[15px] leading-relaxed opacity-85 mb-6 flex-1">
                {event.description}
              </p>

              <dl className={cn("space-y-1.5 mb-6", editorialType.caption)}>
                <div className="flex items-center gap-2 opacity-70">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="normal-case tracking-normal text-xs">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 opacity-70">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="normal-case tracking-normal text-xs">{event.location}</span>
                </div>
              </dl>

              <div className="mt-auto space-y-2">
                {primaryTo ? (
                  <Link
                    to={primaryTo}
                    className={cn(
                      "inline-flex items-center gap-1.5 border-b pb-1 transition-transform group-hover:translate-x-0.5",
                      editorialType.cta,
                      t.accentBorder,
                      t.kicker,
                    )}
                  >
                    {event.cta}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a
                    href={primaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 border-b pb-1 transition-transform group-hover:translate-x-0.5",
                      editorialType.cta,
                      t.accentBorder,
                      t.kicker,
                    )}
                  >
                    {event.cta}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {event.secondaryLink && (
                  <div>
                    <a
                      href={event.secondaryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity",
                        editorialType.caption,
                      )}
                    >
                      <BookOpen className="w-3 h-3" />
                      {event.secondaryCta}
                    </a>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Closing editorial CTA */}
      <div className="mt-20 pt-10 border-t-2 border-current/30 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <p className={cn(editorialType.kicker, t.kicker)}>Next step</p>
          <h3 className={cn(editorialType.serif, "text-3xl md:text-4xl leading-tight mt-2")}>
            Ready to transform your leadership?
          </h3>
          <p className="mt-3 text-base opacity-80">
            Don't wait for the next event. Start your transformation journey today with a personalized discovery call.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href="https://app.reclaim.ai/m/jonathan-helloarchitekt"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5",
              editorialType.cta,
              t.ctaPrimary,
            )}
          >
            <Calendar className="w-4 h-4" />
            Book a discovery call
          </a>
          <a
            href="#contact"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5",
              editorialType.cta,
              t.ctaGhost,
            )}
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default ParacosmEventsSection;
