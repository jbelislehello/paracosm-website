import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  Compass,
  Brain,
  Users,
  Zap,
  Sparkles,
  BookOpen,
  Target,
  Building,
  Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "paracosm-onboarding-completed";
const PROFILE_KEY = "paracosm-onboarding-profile";

type MaturityId = "exploring" | "practicing" | "leading";
type ReadinessId = "solo" | "small-team" | "organization" | "enterprise";

interface OnboardingProfile {
  maturity: MaturityId | "";
  readiness: ReadinessId | "";
}

interface Path {
  id: string;
  offering: string;
  needMet: string;
  description: string;
  startingPoint: string;
  route: string;
  ctaLabel: string;
  ctaHref: string;
  icon: typeof BookOpen;
  fits: {
    maturity: MaturityId[];
    readiness: ReadinessId[];
  };
}

const PATHS: Path[] = [
  {
    id: "book",
    offering: "Calm Magic — the Book",
    needMet: "You need a shared vocabulary before you invest in change.",
    description:
      "The framework in long form: how organizations learn and invent with AI without losing their soul.",
    startingPoint: "Foundational reading",
    route: "/book",
    ctaLabel: "Read the free chapter",
    ctaHref: "/book#waitlist",
    icon: BookOpen,
    fits: {
      maturity: ["exploring", "practicing", "leading"],
      readiness: ["solo", "small-team", "organization", "enterprise"],
    },
  },
  {
    id: "clarity-reset",
    offering: "Clarity Reset — 7 Days",
    needMet: "You're stuck on a single decision and need to move this week.",
    description:
      "A focused sprint to move from confusion to a clear, executable decision.",
    startingPoint: "Spring 2026 Offer",
    route: "/calm-magic-assistant#spring-offer",
    ctaLabel: "Book Clarity Reset",
    ctaHref:
      "mailto:jbelisle@helloarchitekt.com?subject=Clarity%20Reset%20—%20Spring%202026&body=I%20need%20clarity%20on%20a%20stuck%20decision.",
    icon: Target,
    fits: {
      maturity: ["exploring", "practicing"],
      readiness: ["solo", "small-team"],
    },
  },
  {
    id: "decision-sprint",
    offering: "Decision Sprint — 14 Days",
    needMet:
      "You have a complex, multi-stakeholder decision that needs structured analysis.",
    description:
      "AI-augmented analysis with an accountability loop for complex decisions.",
    startingPoint: "Spring 2026 Offer",
    route: "/calm-magic-assistant#spring-offer",
    ctaLabel: "Book Decision Sprint",
    ctaHref:
      "mailto:jbelisle@helloarchitekt.com?subject=Decision%20Sprint%20—%20Spring%202026&body=I%20need%20help%20making%20a%20complex%20decision.",
    icon: Zap,
    fits: {
      maturity: ["practicing", "leading"],
      readiness: ["small-team", "organization"],
    },
  },
  {
    id: "ai-leadership",
    offering: "AI Leadership Coaching",
    needMet:
      "Your team is using AI but you lack strategy, governance, and a shared narrative.",
    description:
      "Navigate AI adoption with clear strategy, governance, and human-centered design.",
    startingPoint: "AI Leadership",
    route: "/agentic-ux",
    ctaLabel: "Start AI Leadership",
    ctaHref:
      "mailto:jbelisle@helloarchitekt.com?subject=AI%20Leadership%20Coaching&body=I%20need%20AI%20strategy%20and%20governance%20support.",
    icon: Brain,
    fits: {
      maturity: ["practicing", "leading"],
      readiness: ["small-team", "organization", "enterprise"],
    },
  },
  {
    id: "intention-design",
    offering: "Intention Design Pipeline",
    needMet:
      "You want to build a learning organization instead of automating chaos.",
    description:
      "Transform your organization into a learning system that continuously reconfigures itself.",
    startingPoint: "Intention Design",
    route: "/",
    ctaLabel: "Explore Intention Design",
    ctaHref:
      "mailto:jbelisle@helloarchitekt.com?subject=Intention%20Design%20Pipeline&body=I%20want%20to%20build%20a%20learning%20organization.",
    icon: Building,
    fits: {
      maturity: ["practicing", "leading"],
      readiness: ["organization", "enterprise"],
    },
  },
  {
    id: "strategic-retainer",
    offering: "Strategic Intervention — Retainer",
    needMet:
      "You're driving org-wide AI transformation and need ongoing strategic partnership.",
    description:
      "Full Calm Magic Board access with continuous strategic support at the executive layer.",
    startingPoint: "Spring 2026 Offer",
    route: "/calm-magic-assistant#spring-offer",
    ctaLabel: "Request Retainer",
    ctaHref:
      "mailto:jbelisle@helloarchitekt.com?subject=Strategic%20Intervention%20Retainer&body=I%20want%20to%20discuss%20an%20ongoing%20engagement.",
    icon: Rocket,
    fits: {
      maturity: ["leading"],
      readiness: ["organization", "enterprise"],
    },
  },
  {
    id: "team-coaching",
    offering: "Team Coaching — Relational Intelligence",
    needMet:
      "Your team dynamics are the bottleneck — not the tools or the strategy.",
    description:
      "Develop your team's capacity for authentic relating, creative tension, and co-creation.",
    startingPoint: "Team Coaching",
    route: "/calm-magic-assistant",
    ctaLabel: "Start Team Coaching",
    ctaHref:
      "mailto:jbelisle@helloarchitekt.com?subject=Team%20Coaching%20Inquiry&body=I%20want%20to%20develop%20relational%20intelligence%20in%20my%20team.",
    icon: Users,
    fits: {
      maturity: ["exploring", "practicing", "leading"],
      readiness: ["small-team", "organization"],
    },
  },
];

function getPaths(profile: OnboardingProfile): Path[] {
  if (!profile.maturity || !profile.readiness) return [];
  const matches = PATHS.filter(
    (p) =>
      p.fits.maturity.includes(profile.maturity as MaturityId) &&
      p.fits.readiness.includes(profile.readiness as ReadinessId),
  );
  // Always keep the book as an anchor option, even if filtered out.
  const book = PATHS.find((p) => p.id === "book")!;
  return matches.some((m) => m.id === "book") ? matches : [...matches, book];
}

interface OnboardingGuideProps {
  triggerOpen?: boolean;
  onClose?: () => void;
}

const OnboardingGuide = ({ triggerOpen, onClose }: OnboardingGuideProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>({
    maturity: "",
    readiness: "",
  });
  const { t } = useLanguage();

  const maturities: {
    id: MaturityId;
    label: string;
    description: string;
    icon: typeof Compass;
  }[] = [
    {
      id: "exploring",
      label: "Exploring — Curious observer",
      description:
        "You're learning the terms, watching what others do, and forming a point of view on AI.",
      icon: Compass,
    },
    {
      id: "practicing",
      label: "Practicing — Active experimenter",
      description:
        "You're running AI pilots, prompting daily, and starting to see what generalizes.",
      icon: BookOpen,
    },
    {
      id: "leading",
      label: "Leading — Systems architect",
      description:
        "You're shaping strategy, governance, and org-wide adoption across multiple teams.",
      icon: Sparkles,
    },
  ];

  const readinessLevels: {
    id: ReadinessId;
    label: string;
    description: string;
  }[] = [
    {
      id: "solo",
      label: "Solo — just me right now",
      description: "You're the one making the moves. Low friction, fast decisions.",
    },
    {
      id: "small-team",
      label: "Small team — 2 to 15 people",
      description: "You can align a room. Change moves at conversation speed.",
    },
    {
      id: "organization",
      label: "Organization — 15 to 200 people",
      description:
        "Multiple stakeholders. You need structured process to move together.",
    },
    {
      id: "enterprise",
      label: "Enterprise — 200+ people",
      description:
        "Multiple business units, governance, and compliance are in play.",
    },
  ];

  useEffect(() => {
    if (triggerOpen) {
      setOpen(true);
      setStep(0);
      setProfile({ maturity: "", readiness: "" });
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
    localStorage.setItem(STORAGE_KEY, "true");
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  };

  const paths = step === 2 ? getPaths(profile) : [];

  const stepTitles = [
    "Your AI & Innovation maturity",
    "Your readiness to act",
    "Your matching paths",
  ];
  const stepDescriptions = [
    "Where are you right now on the AI & innovation journey? Pick the description that fits best today.",
    "How much can you move? Readiness sets the pace and shape of what we recommend.",
    "Each path is scoped to the need it meets. Pick the one that matches yours.",
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
        else setOpen(true);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            {step < 2 ? "Find your path" : "Paths matched to your profile"}
          </DialogTitle>
          <DialogDescription>{stepDescriptions[step]}</DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="flex gap-1 mb-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Step {step + 1} of 3 — {stepTitles[step]}
        </p>

        {/* Step 0 — Maturity */}
        {step === 0 && (
          <div className="space-y-2">
            {maturities.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setProfile({ ...profile, maturity: m.id });
                  setStep(1);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all hover:border-primary hover:bg-accent/50 flex items-start gap-3 ${
                  profile.maturity === m.id
                    ? "border-primary bg-accent/50"
                    : "border-border"
                }`}
              >
                <m.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{m.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1 — Readiness */}
        {step === 1 && (
          <div className="space-y-2">
            {readinessLevels.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setProfile({ ...profile, readiness: r.id });
                  setStep(2);
                  handleComplete();
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all hover:border-primary hover:bg-accent/50 ${
                  profile.readiness === r.id
                    ? "border-primary bg-accent/50"
                    : "border-border"
                }`}
              >
                <div className="font-medium text-sm">{r.label}</div>
                <div className="text-xs text-muted-foreground">
                  {r.description}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Matching paths */}
        {step === 2 && (
          <div className="space-y-3">
            {paths.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No exact match — start with the book below.
              </p>
            )}
            {paths.map((p) => (
              <Card key={p.id} className="border-primary/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <p.icon className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Badge variant="secondary" className="text-[10px] mb-1">
                          {p.startingPoint}
                        </Badge>
                        <h3 className="font-bold text-sm leading-tight">
                          {p.offering}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="border-l-2 border-primary/40 pl-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
                      Need met
                    </p>
                    <p className="text-sm font-medium mt-1">{p.needMet}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <a href={p.ctaHref} className="flex-1">
                      <Button size="sm" className="w-full gap-2">
                        <Zap className="w-3.5 h-3.5" />
                        {p.ctaLabel}
                      </Button>
                    </a>
                    <Link
                      to={p.route}
                      onClick={handleClose}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1"
                      >
                        Learn more <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Nav */}
        <div className="flex justify-between pt-2">
          {step > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />{" "}
              {t("landing.onboarding_back")}
            </Button>
          ) : (
            <div />
          )}
          {step === 2 && (
            <Button variant="ghost" size="sm" onClick={handleClose}>
              {t("landing.onboarding_close")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingGuide;
