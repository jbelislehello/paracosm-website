import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Compass, Brain, Users, Zap, Sparkles, BookOpen, Target, Building } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE_KEY = 'paracosm-onboarding-completed';
const PROFILE_KEY = 'paracosm-onboarding-profile';

interface OnboardingProfile {
  need: string;
  maturity: string;
  capability: string;
}

interface Recommendation {
  offering: string;
  description: string;
  startingPoint: string;
  route: string;
  caseStudyRoute: string;
  ctaLabel: string;
  ctaHref: string;
}

const needs = [
  { id: 'clarity', label: 'I need clarity on a stuck decision', icon: Target, description: 'You have a specific decision or situation causing confusion' },
  { id: 'learning-org', label: 'I want to build a learning organization', icon: Building, description: 'Transform your organization into one that continuously evolves' },
  { id: 'ai-strategy', label: 'I need AI strategy & governance', icon: Brain, description: 'Navigate AI transformation with clear strategic frameworks' },
  { id: 'relational', label: 'I want to develop relational intelligence', icon: Users, description: 'Strengthen team dynamics and interpersonal capacity' },
];

const maturities = [
  { id: 'exploring', label: 'Exploring', icon: Compass, description: 'New to AI and transformation — seeking orientation' },
  { id: 'practicing', label: 'Practicing', icon: BookOpen, description: 'Some experience — seeking structure and methodology' },
  { id: 'leading', label: 'Leading', icon: Sparkles, description: 'Experienced — seeking advanced tools and frameworks' },
];

const capabilities = [
  { id: 'solo', label: 'Solo Practitioner', description: 'Freelancer or independent professional' },
  { id: 'small-team', label: 'Small Team (2-10)', description: 'Startup or small business team' },
  { id: 'organization', label: 'Organization (10+)', description: 'Mid-size company or department' },
  { id: 'enterprise', label: 'Enterprise', description: 'Large-scale organization' },
];

function getRecommendation(profile: OnboardingProfile): Recommendation {
  const { need, maturity, capability } = profile;

  if (need === 'clarity') {
    if (maturity === 'exploring' || capability === 'solo') {
      return {
        offering: 'Clarity Reset — 7 Days',
        description: 'A focused sprint to move from confusion to a clear, executable decision.',
        startingPoint: 'Spring 2026 Offer',
        route: '/calm-magic-assistant#spring-offer',
        caseStudyRoute: '/case-studies',
        ctaLabel: 'Book Clarity Reset',
        ctaHref: 'mailto:jbelisle@helloarchitekt.com?subject=Clarity%20Reset%20—%20Spring%202026&body=I%20need%20clarity%20on%20a%20stuck%20decision.',
      };
    }
    return {
      offering: 'Decision Sprint — 14 Days',
      description: 'AI-augmented analysis with accountability loop for complex decisions.',
      startingPoint: 'Spring 2026 Offer',
      route: '/calm-magic-assistant#spring-offer',
      caseStudyRoute: '/case-studies',
      ctaLabel: 'Book Decision Sprint',
      ctaHref: 'mailto:jbelisle@helloarchitekt.com?subject=Decision%20Sprint%20—%20Spring%202026&body=I%20need%20help%20making%20a%20complex%20decision.',
    };
  }

  if (need === 'ai-strategy') {
    return {
      offering: maturity === 'leading' ? 'Strategic Intervention — Retainer' : 'AI Leadership Coaching',
      description: maturity === 'leading'
        ? 'Full Calm Magic Board access with ongoing strategic support for AI transformation.'
        : 'Navigate AI adoption with clear strategy, governance, and human-centered design.',
      startingPoint: maturity === 'leading' ? 'Spring 2026 Offer' : 'AI Leadership',
      route: maturity === 'leading' ? '/calm-magic-assistant#spring-offer' : '/agentic-ux',
      caseStudyRoute: '/case-studies',
      ctaLabel: 'Get Started',
      ctaHref: 'mailto:jbelisle@helloarchitekt.com?subject=AI%20Strategy%20Inquiry&body=I%20need%20AI%20strategy%20and%20governance%20support.',
    };
  }

  if (need === 'learning-org') {
    return {
      offering: capability === 'enterprise' ? 'Strategic Intervention — Retainer' : 'Intention Design Pipeline',
      description: 'Transform your organization into a learning system that continuously reconfigures itself.',
      startingPoint: 'Intention Design',
      route: '/',
      caseStudyRoute: '/case-studies',
      ctaLabel: 'Explore Intention Design',
      ctaHref: 'mailto:jbelisle@helloarchitekt.com?subject=Learning%20Organization&body=I%20want%20to%20build%20a%20learning%20organization.',
    };
  }

  return {
    offering: 'Team Coaching — Relational Intelligence',
    description: 'Develop your team\'s capacity for authentic relating, creative tension, and co-creation.',
    startingPoint: 'Team Coaching',
    route: '/calm-magic-assistant',
    caseStudyRoute: '/case-studies',
    ctaLabel: 'Start Team Coaching',
    ctaHref: 'mailto:jbelisle@helloarchitekt.com?subject=Team%20Coaching%20Inquiry&body=I%20want%20to%20develop%20relational%20intelligence%20in%20my%20team.',
  };
}

interface OnboardingGuideProps {
  triggerOpen?: boolean;
  onClose?: () => void;
}

const OnboardingGuide = ({ triggerOpen, onClose }: OnboardingGuideProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>({ need: '', maturity: '', capability: '' });

  useEffect(() => {
    if (triggerOpen) {
      setOpen(true);
      setStep(0);
      setProfile({ need: '', maturity: '', capability: '' });
    }
  }, [triggerOpen]);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed && !triggerOpen) {
      const timer = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [triggerOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  };

  const recommendation = step === 3 ? getRecommendation(profile) : null;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            {step < 3 ? 'Find Your Path' : 'Your Recommended Path'}
          </DialogTitle>
          <DialogDescription>
            {step === 0 && 'What brings you here today?'}
            {step === 1 && 'What\'s your experience level with AI & transformation?'}
            {step === 2 && 'What\'s your organizational context?'}
            {step === 3 && 'Based on your answers, here\'s where to start.'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="flex gap-1 mb-2">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {/* Step 0 — Need */}
        {step === 0 && (
          <div className="space-y-2">
            {needs.map((n) => (
              <button
                key={n.id}
                onClick={() => { setProfile({ ...profile, need: n.id }); setStep(1); }}
                className={`w-full text-left p-3 rounded-lg border transition-all hover:border-primary hover:bg-accent/50 flex items-start gap-3 ${profile.need === n.id ? 'border-primary bg-accent/50' : 'border-border'}`}
              >
                <n.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{n.label}</div>
                  <div className="text-xs text-muted-foreground">{n.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1 — Maturity */}
        {step === 1 && (
          <div className="space-y-2">
            {maturities.map((m) => (
              <button
                key={m.id}
                onClick={() => { setProfile({ ...profile, maturity: m.id }); setStep(2); }}
                className={`w-full text-left p-3 rounded-lg border transition-all hover:border-primary hover:bg-accent/50 flex items-start gap-3 ${profile.maturity === m.id ? 'border-primary bg-accent/50' : 'border-border'}`}
              >
                <m.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Capability */}
        {step === 2 && (
          <div className="space-y-2">
            {capabilities.map((c) => (
              <button
                key={c.id}
                onClick={() => { setProfile({ ...profile, capability: c.id }); setStep(3); handleComplete(); }}
                className={`w-full text-left p-3 rounded-lg border transition-all hover:border-primary hover:bg-accent/50 ${profile.capability === c.id ? 'border-primary bg-accent/50' : 'border-border'}`}
              >
                <div className="font-medium text-sm">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.description}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3 — Recommendation */}
        {step === 3 && recommendation && (
          <Card className="border-primary/30 bg-accent/20">
            <CardContent className="p-4 space-y-3">
              <Badge variant="secondary" className="text-xs">{recommendation.startingPoint}</Badge>
              <h3 className="font-bold text-lg">{recommendation.offering}</h3>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              <div className="flex flex-col gap-2 pt-2">
                <a href={recommendation.ctaHref}>
                  <Button className="w-full gap-2">
                    <Zap className="w-4 h-4" />
                    {recommendation.ctaLabel}
                  </Button>
                </a>
                <Link to={recommendation.route} onClick={handleClose}>
                  <Button variant="outline" className="w-full gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to={recommendation.caseStudyRoute} onClick={handleClose}>
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          {step > 0 && step < 3 ? (
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : <div />}
          {step === 3 && (
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingGuide;
