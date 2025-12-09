import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PartyPopper, Sparkles, ArrowRight, Flower2, BookOpen, Mountain, Music, Sun, FileText } from 'lucide-react';

type Season = 'POLLEN' | 'POEM' | 'TOTEM' | 'ANTHEM';

interface SeasonCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onGeneratePrdLayer: () => void;
  season: Season;
  tilesVisited: number;
  polenCount: number;
  isGenerating: boolean;
}

const SEASON_CONFIG: Record<Season, {
  label: string;
  description: string;
  icon: typeof Flower2;
  color: string;
  gradient: string;
  nextSeason: Season | 'FREE';
}> = {
  POLLEN: {
    label: 'POLLEN',
    description: 'Signals & Context - raw observations, glitches, tensions, and emotional climate',
    icon: Flower2,
    color: 'text-rose-500',
    gradient: 'from-rose-500 to-pink-500',
    nextSeason: 'POEM',
  },
  POEM: {
    label: 'POEM',
    description: 'Narrative & Meaning - user journeys, hypotheses, and thematic anchors',
    icon: BookOpen,
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-indigo-500',
    nextSeason: 'TOTEM',
  },
  TOTEM: {
    label: 'TOTEM',
    description: 'Form & Interfaces - core flows, ontology, and system boundaries',
    icon: Mountain,
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    nextSeason: 'ANTHEM',
  },
  ANTHEM: {
    label: 'ANTHEM',
    description: 'Alignment & Impact - success metrics, guardrails, and strategic alignment',
    icon: Music,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-green-500',
    nextSeason: 'FREE',
  },
};

const SeasonCompletionModal = ({
  isOpen,
  onClose,
  onContinue,
  onGeneratePrdLayer,
  season,
  tilesVisited,
  polenCount,
  isGenerating
}: SeasonCompletionModalProps) => {
  const config = SEASON_CONFIG[season];
  const Icon = config.icon;
  const isLastSeason = season === 'ANTHEM';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center animate-bounce`}>
              <PartyPopper className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Season Complete!</DialogTitle>
              <DialogDescription>
                You've journeyed through all 64 {config.label} tiles
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Celebration Banner */}
          <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${config.gradient} p-6 text-white`}>
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Icon className="w-6 h-6" />
                <h3 className="text-xl font-bold">{config.label} Season Completed</h3>
              </div>
              <p className="text-sm opacity-90 mt-1">
                Your collected entries form the {config.label} layer of your PRD
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <Sparkles className="absolute top-4 right-4 w-8 h-8 opacity-30" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 text-center bg-muted/50">
              <div className="text-2xl font-bold">{tilesVisited}</div>
              <div className="text-xs text-muted-foreground">Tiles Explored</div>
            </Card>
            <Card className="p-4 text-center bg-muted/50">
              <div className="text-2xl font-bold">{polenCount}</div>
              <div className="text-xs text-muted-foreground">Polen Captured</div>
            </Card>
          </div>

          {/* PRD Layer Preview */}
          <Card className="p-4 border-2 border-primary/30 bg-gradient-to-r from-background to-primary/5">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold">{config.label} Layer</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {config.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <div className="text-sm text-muted-foreground text-center">
            {isLastSeason ? (
              <p>All 4 seasons complete! The FREE tiles will now unlock for final integration.</p>
            ) : (
              <p>Next: <Badge variant="outline">{config.nextSeason}</Badge> season to build the next PRD layer</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onGeneratePrdLayer} 
              className="flex-1"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : `Generate ${config.label}`}
            </Button>
            <Button 
              onClick={onContinue} 
              className={`flex-1 bg-gradient-to-r ${config.nextSeason === 'FREE' ? 'from-amber-500 to-orange-500' : config.gradient}`}
            >
              {isLastSeason ? 'Unlock FREE' : `Continue to ${config.nextSeason}`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeasonCompletionModal;
