import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Sprout, BookOpen, Shapes, Flag, Rocket } from 'lucide-react';

export type PrdLayer = 'POLLEN' | 'POEM' | 'TOTEM' | 'ANTHEM' | 'EXECUTION';

interface PrdStageProgressProps {
  currentLayer: PrdLayer;
  completedLayers: PrdLayer[];
}

const LAYERS: {
  id: PrdLayer;
  name: string;
  purpose: string;
  breath: string;
  phase: string;
  question: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}[] = [
  {
    id: 'POLLEN',
    name: 'Signals & Context',
    purpose: 'Gather raw tensions & stakes',
    breath: 'gather',
    phase: 'Gl!tch',
    question: 'What is really happening in the field, and why does it matter now?',
    icon: Sprout,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10'
  },
  {
    id: 'POEM',
    name: 'Narrative & Meaning',
    purpose: 'Expand the story space',
    breath: 'expand',
    phase: 'Drift',
    question: 'What story are we actually telling by solving this?',
    icon: BookOpen,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 'TOTEM',
    name: 'Form & Interfaces',
    purpose: 'Structure what people will touch',
    breath: 'structure',
    phase: 'Tune',
    question: 'What are we actually building that people will touch, see, or feel?',
    icon: Shapes,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'ANTHEM',
    name: 'Alignment & Impact',
    purpose: 'Align on purpose & guardrails',
    breath: 'align',
    phase: 'Tune',
    question: 'Why is this worth our time, and how will we know it\'s working?',
    icon: Flag,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10'
  },
  {
    id: 'EXECUTION',
    name: 'Roadmap & Operations',
    purpose: 'Launch and learn',
    breath: 'launch',
    phase: 'FREE → LOVE',
    question: 'How do we bring this to life over time with real constraints?',
    icon: Rocket,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10'
  }
];

const PrdStageProgress = ({ currentLayer, completedLayers }: PrdStageProgressProps) => {
  const currentIndex = LAYERS.findIndex(l => l.id === currentLayer);
  const CurrentIcon = LAYERS[currentIndex]?.icon || Sprout;

  return (
    <div className="w-full space-y-4">
      {/* Phase Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium">Phase:</span>
        {LAYERS.map((layer, i) => (
          <span 
            key={layer.id}
            className={`px-2 py-0.5 rounded-full transition-all ${
              i === currentIndex 
                ? `bg-gradient-to-r ${layer.color} text-white` 
                : i < currentIndex 
                  ? 'bg-muted text-muted-foreground' 
                  : 'opacity-50'
            }`}
          >
            {layer.phase}
          </span>
        ))}
      </div>

      {/* Main Progress Bar */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full" />
        <div 
          className="absolute top-6 left-6 h-1 bg-gradient-to-r from-amber-500 via-purple-500 via-blue-500 via-emerald-500 to-rose-500 rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (LAYERS.length - 1)) * (100 - 6)}%` }}
        />

        {/* Layer Circles */}
        <div className="flex justify-between relative">
          {LAYERS.map((layer, index) => {
            const isCompleted = completedLayers.includes(layer.id);
            const isCurrent = layer.id === currentLayer;
            const isPending = index > currentIndex;
            const Icon = layer.icon;

            return (
              <div key={layer.id} className="flex flex-col items-center">
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
                  {LAYERS[currentIndex].phase}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                  {LAYERS[currentIndex].purpose}
                </Badge>
              </div>
              <h3 className="text-lg font-bold">{LAYERS[currentIndex].id} — {LAYERS[currentIndex].name}</h3>
              <p className="text-sm opacity-90 italic">"{LAYERS[currentIndex].question}"</p>
            </div>
            <CurrentIcon className="w-12 h-12 opacity-30" />
          </div>
        </div>
      )}

      {/* Legend Strip */}
      <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>POLLEN = Raw tensions, constraints, emotional climate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span>POEM = User journeys, hypotheses, thematic anchors</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>TOTEM = Core flows, ontology, system boundaries</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>ANTHEM = Success metrics, guardrails, strategic alignment</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span>EXECUTION = Milestones, responsibilities, learning cadence</span>
        </div>
      </div>
    </div>
  );
};

export default PrdStageProgress;
