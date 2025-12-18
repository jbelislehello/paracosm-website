import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PartyPopper, Sparkles, ArrowRight, Flower2, BookOpen, Mountain, Music, FileText, Lightbulb, Bot, Smartphone, Crown, TreeDeciduous } from 'lucide-react';
import { SEASON_DEFINITIONS, POEMS_ACRONYM } from '@/data/seasonDefinitions';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface SeasonCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onGeneratePrdLayer: () => void;
  onGenerateFoundationalPrompt?: () => void;
  onEnterGarden?: () => void;
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
  nextSeason: Season | null;
}> = {
  POLLENS: {
    label: 'Pollens',
    description: SEASON_DEFINITIONS.POLLENS.fullDescription,
    icon: Flower2,
    color: 'text-rose-500',
    gradient: 'from-rose-500 to-pink-500',
    nextSeason: 'NOEMS',
  },
  NOEMS: {
    label: 'Noems',
    description: SEASON_DEFINITIONS.NOEMS.fullDescription,
    icon: Lightbulb,
    color: 'text-violet-500',
    gradient: 'from-violet-500 to-purple-500',
    nextSeason: 'POEMS',
  },
  POEMS: {
    label: 'Poems',
    description: SEASON_DEFINITIONS.POEMS.fullDescription,
    icon: BookOpen,
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-indigo-500',
    nextSeason: 'TOTEMS',
  },
  TOTEMS: {
    label: 'Totems',
    description: SEASON_DEFINITIONS.TOTEMS.fullDescription,
    icon: Mountain,
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    nextSeason: 'ANTHEMS',
  },
  ANTHEMS: {
    label: 'Anthems',
    description: SEASON_DEFINITIONS.ANTHEMS.fullDescription,
    icon: Music,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-teal-500',
    nextSeason: null,
  },
};

const SeasonCompletionModal = ({
  isOpen,
  onClose,
  onContinue,
  onGeneratePrdLayer,
  onGenerateFoundationalPrompt,
  onEnterGarden,
  season,
  tilesVisited,
  polenCount,
  isGenerating
}: SeasonCompletionModalProps) => {
  const config = SEASON_CONFIG[season];
  const Icon = config.icon;
  const isLastSeason = season === 'ANTHEMS';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center animate-bounce`}>
              {isLastSeason ? (
                <Crown className="w-6 h-6 text-white" />
              ) : (
                <PartyPopper className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl">
                {isLastSeason ? '🎉 All Seasons Complete!' : 'Season Complete!'}
              </DialogTitle>
              <DialogDescription>
                {isLastSeason 
                  ? 'Your complete journey is ready for compilation'
                  : `You've journeyed through all 64 ${config.label} tiles`
                }
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
                {isLastSeason 
                  ? 'All 5 PRD layers are now complete and ready for export'
                  : `Your collected entries form the ${config.label} layer of your PRD`
                }
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

          {/* Foundational Prompt Ready - Only for ANTHEMS */}
          {isLastSeason && (
            <Card className="p-4 border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center animate-pulse">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-emerald-600 dark:text-emerald-400">
                    🎉 Foundational Prompt Ready!
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your complete journey through all 5 seasons has been compiled into an agentic Foundational Prompt.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30">Lovable</Badge>
                    <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">Base44</Badge>
                    <Badge className="bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30">Claude</Badge>
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">Tonalli</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* PRD Layer Preview - Show for non-last seasons */}
          {!isLastSeason && (
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
                  {/* P.O.E.M.S. Acronym Display */}
                  {season === 'POEMS' && (
                    <div className="mt-3 grid grid-cols-5 gap-1 text-xs text-center border-t pt-3">
                      {Object.entries(POEMS_ACRONYM).map(([letter, word]) => (
                        <div key={letter} className="flex flex-col items-center">
                          <span className="font-bold text-primary text-sm">{letter}</span>
                          <span className="text-muted-foreground">{word}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Next Steps */}
          <div className="text-sm text-muted-foreground text-center">
            {isLastSeason ? (
              <p>Export your Foundational Prompt to any AI platform or companion device.</p>
            ) : (
              <p>Next: <Badge variant="outline">{config.nextSeason}</Badge> season to build the next PRD layer</p>
            )}
          </div>

          {/* Actions - Different for ANTHEMS */}
          {isLastSeason ? (
            <div className="space-y-3">
              {/* Primary Action: Enter Garden */}
              <Button 
                onClick={onEnterGarden}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-lg py-6"
              >
                <TreeDeciduous className="w-5 h-5 mr-2" />
                Enter Your Garden 🌳
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onGenerateFoundationalPrompt} className="flex-1">
                  <Bot className="w-4 h-4 mr-1" />
                  Foundational Prompt
                </Button>
                <Button variant="outline" onClick={onContinue} className="flex-1">
                  <FileText className="w-4 h-4 mr-1" />
                  View Full PRD
                </Button>
              </div>
            </div>
          ) : (
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
                className={`flex-1 bg-gradient-to-r ${config.gradient}`}
              >
                Continue to {config.nextSeason}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeasonCompletionModal;
