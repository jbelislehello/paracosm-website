import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Heart, Waves, Zap, Sparkles } from 'lucide-react';

export interface LoveScore {
  longevity: number;
  oscillations: number;
  velocity: number;
  elasticity: number;
}

interface LoveScoreAxesProps {
  score: LoveScore;
  onUpdate: (score: LoveScore) => void;
  readOnly?: boolean;
}

const AXES = [
  { 
    key: 'longevity' as const, 
    label: 'Longevity', 
    letter: 'L',
    icon: Heart, 
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    description: 'How long will this resonate?' 
  },
  { 
    key: 'oscillations' as const, 
    label: 'Oscillations', 
    letter: 'O',
    icon: Waves, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    description: 'What rhythms and cycles does it have?' 
  },
  { 
    key: 'velocity' as const, 
    label: 'Velocity', 
    letter: 'V',
    icon: Zap, 
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    description: 'How fast is it moving or growing?' 
  },
  { 
    key: 'elasticity' as const, 
    label: 'Elasticity', 
    letter: 'E',
    icon: Sparkles, 
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    description: 'How adaptable and flexible is it?' 
  },
];

const LoveScoreAxes = ({ score, onUpdate, readOnly = false }: LoveScoreAxesProps) => {
  const totalScore = Math.round((score.longevity + score.oscillations + score.velocity + score.elasticity) / 4);

  const updateAxis = (key: keyof LoveScore, value: number[]) => {
    onUpdate({ ...score, [key]: value[0] });
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-rose-500/5 to-pink-500/5 border-rose-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <h4 className="font-semibold text-sm">L.O.V.E. Score Axes</h4>
        </div>
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600">
          Overall: {totalScore}%
        </Badge>
      </div>

      {/* Visual Diamond/Radar Preview */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Diamond shape background */}
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
            <polygon points="50,10 90,50 50,90 10,50" fill="currentColor" className="text-rose-500" />
          </svg>
          {/* Score overlay */}
          <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
            <polygon 
              points={`50,${50 - score.longevity * 0.4} ${50 + score.oscillations * 0.4},50 50,${50 + score.velocity * 0.4} ${50 - score.elasticity * 0.4},50`}
              fill="currentColor" 
              className="text-rose-500/30"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          {/* Labels */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-bold text-rose-500">L</span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500">O</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-500">V</span>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-bold text-violet-500">E</span>
        </div>
      </div>

      <div className="space-y-4">
        {AXES.map(axis => {
          const Icon = axis.icon;
          const value = score[axis.key];

          return (
            <div key={axis.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${axis.bgColor} ${axis.color} font-bold`}>
                    {axis.letter}
                  </Badge>
                  <Icon className={`w-4 h-4 ${axis.color}`} />
                  <span className="text-sm font-medium">{axis.label}</span>
                </div>
                <span className="text-sm font-mono">{value}%</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{axis.description}</p>
              <Slider
                value={[value]}
                onValueChange={(v) => updateAxis(axis.key, v)}
                max={100}
                step={5}
                disabled={readOnly}
                className="w-full"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default LoveScoreAxes;
