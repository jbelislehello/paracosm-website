import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Announcement section (replaces the previous Partner Tools grid).
 *
 * Surfaces Jonathan Bélisle's current role — Principal Systems Auteur
 * & Fractional Chief Design Officer — alongside the hero positioning
 * line ("Building Learning Organizations"). All curated partner tools
 * have been moved into the April 2026 edition of Drift.
 */
const PartnerToolsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="container max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/80 backdrop-blur-sm shadow-xl p-8 md:p-12">
          {/* Ambient backdrop */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative space-y-6 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge className="gap-1 border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">
                <Sparkles className="h-3 w-3" />
                Now in residence
              </Badge>
              <Badge variant="outline" className="border-accent/40 text-accent">
                Jonathan Bélisle
              </Badge>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Principal Systems Auteur
              </span>
              <span className="block text-foreground/90 mt-1">
                &amp; Fractional Chief Design Officer
              </span>
            </h2>

            <p className="text-lg md:text-xl text-foreground/80 font-medium max-w-3xl">
              {t('landing.hero_headline')}
            </p>

            <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
              {t('landing.hero_description')}
            </p>

            <p className="text-sm md:text-base text-muted-foreground/90 max-w-3xl">
              {t('landing.hero_long_description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 pt-2">
              <a
                href="https://app.reclaim.ai/m/jonathan-helloarchitekt"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="group gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95"
                >
                  Book a discovery call
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <Link to="/drift/2026/04">
                <Button size="lg" variant="outline" className="gap-2">
                  <Compass className="h-4 w-4" />
                  See April Drift — partner toolkit
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              The full partner-tools toolkit now lives inside the{' '}
              <Link to="/drift/2026/04" className="text-primary underline-offset-4 hover:underline">
                April 2026 edition of Drift — "Relationship Model"
              </Link>
              , organized across the five Calm Magic axes (Love, Magic, Calm, Open, Free).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerToolsSection;
