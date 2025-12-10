import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Sparkles, Sprout, Gem, BookOpen, Landmark, Music } from 'lucide-react';

export type PrdLayer = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface PrdStageProgressProps {
  currentLayer: PrdLayer;
  completedLayers: PrdLayer[];
}

// 3 Meta-stages with revised themes
const STAGES: {
  id: string;
  name: string;
  description: string;
  themes: string[];
  layers: PrdLayer[];
  icon: string;
  color: string;
}[] = [
  {
    id: 'real-intelligence',
    name: 'Real Intelligence',
    description: 'Surfacing what actually matters',
    themes: ['Intuitions', 'Shared Ideas', 'PRD Shadows', 'Cultural Issues', 'RI Feedback', 'Biases'],
    layers: ['POLLENS', 'NOEMS'],
    icon: '🧠',
    color: 'from-rose-500 to-amber-500'
  },
  {
    id: 'knowledge-objects',
    name: 'Knowledge Objects',
    description: 'Crystallizing structured knowledge',
    themes: ['Content Sources', 'Data Nodes', 'API'],
    layers: ['POEMS'],
    icon: '💎',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'understanding',
    name: 'Understanding',
    description: 'Semantic structures & processes',
    themes: ['Processes', 'Maps', 'Three Graph Model', 'Subject Graph', 'Lexical Graph', 'Domain Graph', 'RDF', 'OWL'],
    layers: ['TOTEMS', 'ANTHEMS'],
    icon: '🗺️',
    color: 'from-blue-500 to-emerald-500'
  }
];

// 5 PRD Layers with updated names
const LAYERS: {
  id: PrdLayer;
  name: string;
  purpose: string;
  phase: string;
  question: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}[] = [
  {
    id: 'POLLENS',
    name: 'Raw Signals',
    purpose: 'Gather intuitions, tensions & biases',
    phase: 'Gl!tch',
    question: 'What real intelligence is surfacing from the field?',
    icon: Sprout,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10'
  },
  {
    id: 'NOEMS',
    name: 'Concepts',
    purpose: 'Crystallize shared ideas & shadows',
    phase: 'Drift',
    question: 'What conceptual atoms are emerging from the pollens?',
    icon: Gem,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10'
  },
  {
    id: 'POEMS',
    name: 'Narratives',
    purpose: 'Structure content & data nodes',
    phase: 'Drift → Tune',
    question: 'What stories and knowledge objects crystallize?',
    icon: BookOpen,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 'TOTEMS',
    name: 'Structures',
    purpose: 'Map processes & relationships',
    phase: 'Tune',
    question: 'What semantic structures emerge (graphs, ontologies)?',
    icon: Landmark,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'ANTHEMS',
    name: 'Integration',
    purpose: 'Align purpose, guardrails & roadmap',
    phase: 'Tune → FREE',
    question: 'How do we integrate understanding into action?',
    icon: Music,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10'
  }
];

const getStageForLayer = (layerId: PrdLayer) => {
  return STAGES.find(s => s.layers.includes(layerId));
};

const PrdStageProgress = ({ currentLayer, completedLayers }: PrdStageProgressProps) => {
  const currentIndex = LAYERS.findIndex(l => l.id === currentLayer);
  const CurrentIcon = LAYERS[currentIndex]?.icon || Sprout;
  const currentStage = getStageForLayer(currentLayer);

  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        {/* Stage Headers */}
        <div className="flex items-center justify-between gap-2">
          {STAGES.map((stage, stageIdx) => {
            const stageComplete = stage.layers.every(l => completedLayers.includes(l));
            const stageCurrent = stage.layers.includes(currentLayer);
            
            return (
              <Tooltip key={stage.id}>
                <TooltipTrigger asChild>
                  <div 
                    className={`flex-1 p-2 rounded-lg border transition-all cursor-help ${
                      stageCurrent 
                        ? `bg-gradient-to-r ${stage.color} text-white border-transparent` 
                        : stageComplete
                          ? 'bg-muted/50 border-emerald-500/50'
                          : 'bg-muted/30 border-border/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stage.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{stage.name}</div>
                        <div className="text-[10px] opacity-80">{stage.description}</div>
                      </div>
                      {stageComplete && <Check className="w-4 h-4 ml-auto" />}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-semibold mb-1">{stage.name} Themes:</p>
                  <p className="text-xs text-muted-foreground">{stage.themes.join(' • ')}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Layer Progress */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full" />
          <div 
            className="absolute top-6 left-6 h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / (LAYERS.length - 1)) * (100 - 6)}%` }}
          />

          {/* Layer Circles */}
          <div className="flex justify-between relative">
            {LAYERS.map((layer, index) => {
              const isCompleted = completedLayers.includes(layer.id);
              const isCurrent = layer.id === currentLayer;
              const isPending = index > currentIndex;
              const Icon = layer.icon;
              const stage = getStageForLayer(layer.id);

              return (
                <Tooltip key={layer.id}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center cursor-help">
                      {/* Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-r ' + layer.color + ' text-white shadow-lg'
                            : isCurrent
                              ? 'bg-gradient-to-r ' + layer.color + ' text-white shadow-lg animate-pulse ring-4 ring-white/30'
                              : 'bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : isCurrent ? (
                          <Sparkles className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>

                      {/* Label */}
                      <div className={`mt-3 text-center transition-opacity ${isPending ? 'opacity-50' : ''}`}>
                        <div className={`text-sm font-bold ${isCurrent ? 'text-primary' : ''}`}>
                          {layer.id}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {layer.name}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{layer.purpose}</p>
                    <p className="text-xs text-muted-foreground">Phase: {layer.phase}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Current Layer Details */}
        {currentLayer && (
          <div className={`mt-6 p-4 rounded-xl bg-gradient-to-r ${LAYERS[currentIndex].color} text-white`}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                    {currentStage?.icon} {currentStage?.name}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                    {LAYERS[currentIndex].phase}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold">{LAYERS[currentIndex].id} — {LAYERS[currentIndex].name}</h3>
                <p className="text-sm opacity-90 italic">"{LAYERS[currentIndex].question}"</p>
              </div>
              <CurrentIcon className="w-12 h-12 opacity-30" />
            </div>
          </div>
        )}

        {/* Legend Strip with Stages */}
        <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <span className="text-sm">🧠</span>
            <span>Real Intelligence: POLLENS + NOEMS</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm">💎</span>
            <span>Knowledge Objects: POEMS</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm">🗺️</span>
            <span>Understanding: TOTEMS + ANTHEMS</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PrdStageProgress;
