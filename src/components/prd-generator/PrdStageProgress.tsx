import { Badge } from '@/components/ui/badge';
import { Check, Circle, Sparkles } from 'lucide-react';

export type PrdStage = 'A_POIETIC' | 'B_DIEGETIC' | 'C_OPERATIONAL' | 'D_MVP';

interface PrdStageProgressProps {
  currentStage: PrdStage;
  completedStages: PrdStage[];
}

const STAGES: {
  id: PrdStage;
  letter: string;
  name: string;
  phase: string;
  dynamics: string;
  calmMagic: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'A_POIETIC',
    letter: 'A',
    name: 'Poietic Prototype',
    phase: 'GL!TCH + POLEN',
    dynamics: 'GL!TCH',
    calmMagic: 'LOVE',
    description: 'Decide if it\'s worth existing',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'B_DIEGETIC',
    letter: 'B',
    name: 'Diegetic Prototype',
    phase: 'POLEN → pré-POEM',
    dynamics: 'DRIFT',
    calmMagic: 'MAGIC',
    description: 'Story + PRD + Foundational Prompt',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'C_OPERATIONAL',
    letter: 'C',
    name: 'Operational Prototype',
    phase: 'vers POEM',
    dynamics: 'TUNE',
    calmMagic: 'CALM/OPEN',
    description: 'Ontology + Knowledge Graph + Workflow',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'D_MVP',
    letter: 'D',
    name: 'MVP - Production Ready',
    phase: 'POEM → TOTEM → ANTHEM',
    dynamics: 'FREE',
    calmMagic: 'FREE',
    description: 'First POEM in production',
    color: 'from-amber-500 to-orange-500'
  }
];

const PrdStageProgress = ({ currentStage, completedStages }: PrdStageProgressProps) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full space-y-4">
      {/* Main Progress Bar */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-6 left-8 right-8 h-1 bg-muted rounded-full" />
        <div 
          className="absolute top-6 left-8 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * (100 - 8)}%` }}
        />

        {/* Stage Circles */}
        <div className="flex justify-between relative">
          {STAGES.map((stage, index) => {
            const isCompleted = completedStages.includes(stage.id);
            const isCurrent = stage.id === currentStage;
            const isPending = index > currentIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r ' + stage.color + ' text-white shadow-lg'
                      : isCurrent
                        ? 'bg-gradient-to-r ' + stage.color + ' text-white shadow-lg animate-pulse ring-4 ring-white/30'
                        : 'bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : isCurrent ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    stage.letter
                  )}
                </div>

                {/* Label */}
                <div className={`mt-3 text-center transition-opacity ${isPending ? 'opacity-50' : ''}`}>
                  <div className={`text-sm font-bold ${isCurrent ? 'text-primary' : ''}`}>
                    {stage.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground max-w-[100px]">
                    {stage.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Stage Details */}
      {currentStage && (
        <div className={`mt-6 p-4 rounded-xl bg-gradient-to-r ${STAGES[currentIndex].color} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {STAGES[currentIndex].dynamics}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {STAGES[currentIndex].calmMagic}
                </Badge>
              </div>
              <h3 className="text-lg font-bold mt-2">{STAGES[currentIndex].name}</h3>
              <p className="text-sm opacity-90">{STAGES[currentIndex].phase}</p>
            </div>
            <div className="text-4xl font-black opacity-30">
              {STAGES[currentIndex].letter}
            </div>
          </div>
        </div>
      )}

      {/* Legend Strip */}
      <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span>GL!TCH = tension fondatrice</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span>DRIFT = dérive expérimentale</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>TUNE = accordage continu</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>FREE = apprentissage</span>
        </div>
      </div>
    </div>
  );
};

export default PrdStageProgress;
