import { useEffect, useState } from "react";
import { ArrowRight, Compass, HeartHandshake, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Lang } from "@/lib/relational/types";

const STORAGE_KEY = "relational-onboarding-seen";

interface Props {
  lang: Lang;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}

export function hasSeenRelationalOnboarding(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markRelationalOnboardingSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    /* ignore */
  }
}

const STEPS = [
  {
    icon: HeartHandshake,
    title: { en: "What this is", fr: "Ce que c'est" },
    body: {
      en: "A 12-minute map of how you and the group you lead handle connection, pressure, and conflict. It is not a performance review, and nothing here is scored against a benchmark or shared with anyone unless you choose to share it.",
      fr: "Une carte de 12 minutes de la façon dont vous et le groupe que vous menez gérez le lien, la pression et le conflit. Ce n'est pas une évaluation de rendement, rien n'est comparé à une norme et rien n'est partagé sans votre choix.",
    },
  },
  {
    icon: ListChecks,
    title: { en: "What you'll get", fr: "Ce que vous obtiendrez" },
    body: {
      en: "Five dimension scores — for you and for your team — plus where the two diverge, your strongest ground, the dimension with the most leverage, and a short set of practices to try next week.",
      fr: "Cinq scores par dimension — pour vous et pour votre équipe — ainsi que les écarts entre les deux, votre terrain le plus solide, la dimension avec le plus de levier, et quelques pratiques à essayer la semaine prochaine.",
    },
  },
  {
    icon: Compass,
    title: { en: "How it works", fr: "Comment ça marche" },
    body: {
      en: "30 statements, two quick answers each: how true it is of you, and how true it is of your team. Everything saves automatically, so you can stop and resume anytime. At the end you can export a PDF or share it privately with named people.",
      fr: "30 énoncés, deux réponses rapides chacun : à quel point c'est vrai pour vous, et pour votre équipe. Tout s'enregistre automatiquement, vous pouvez donc arrêter et reprendre à tout moment. À la fin, exportez un PDF ou partagez-le en privé avec des personnes nommées.",
    },
  },
];

export default function RelationalOnboardingModal({ lang, open, onOpenChange, onDone }: Props) {
  const [step, setStep] = useState(0);
  const fr = lang === "fr";

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Icon className="h-3.5 w-3.5" />
            {fr ? "Étape" : "Step"} {step + 1} / {STEPS.length}
          </div>
          <DialogTitle className="font-serif text-2xl">{current.title[lang]}</DialogTitle>
        </DialogHeader>

        <p className="text-sm leading-relaxed text-muted-foreground">{current.body[lang]}</p>

        <div className="mt-4 flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              markRelationalOnboardingSeen();
              onDone();
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {fr ? "Passer" : "Skip"}
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
                {fr ? "Retour" : "Back"}
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => {
                if (isLast) {
                  markRelationalOnboardingSeen();
                  onDone();
                } else {
                  setStep((s) => s + 1);
                }
              }}
            >
              {isLast
                ? fr
                  ? "Commencer"
                  : "Begin"
                : fr
                  ? "Suivant"
                  : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
