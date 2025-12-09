import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Music, Dice1, Heart, Eye, RotateCcw, Palette, Sprout } from 'lucide-react';
import { ChordsEvaluation } from './MasterLensEvaluator';

interface ChordsQualifierProps {
  chords: ChordsEvaluation;
  onUpdate: (chords: ChordsEvaluation) => void;
  readOnly?: boolean;
}

const CHORD_ITEMS = [
  { key: 'chances' as const, label: 'C', fullLabel: 'Chances', icon: Dice1, color: 'text-sky-500', bgColor: 'bg-sky-500/10', desc: 'Opportunities to explore' },
  { key: 'heart' as const, label: 'H', fullLabel: 'Heart', icon: Heart, color: 'text-rose-500', bgColor: 'bg-rose-500/10', desc: 'Heart-centeredness' },
  { key: 'observer' as const, label: 'O', fullLabel: 'Observer', icon: Eye, color: 'text-amber-500', bgColor: 'bg-amber-500/10', desc: 'Consciousness perspective' },
  { key: 'reversal' as const, label: 'R', fullLabel: 'Reversal', icon: RotateCcw, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', desc: 'Renewal through inversion' },
  { key: 'design' as const, label: 'D', fullLabel: 'Design', icon: Palette, color: 'text-violet-500', bgColor: 'bg-violet-500/10', desc: 'Intentional shaping' },
  { key: 'seeds' as const, label: 'S', fullLabel: 'Seeds', icon: Sprout, color: 'text-lime-500', bgColor: 'bg-lime-500/10', desc: 'Early manifestations' },
];

const ChordsQualifier = ({ chords, onUpdate, readOnly = false }: ChordsQualifierProps) => {
  const updateChord = (key: keyof ChordsEvaluation, value: string) => {
    onUpdate({ ...chords, [key]: value });
  };

  const filledCount = Object.values(chords).filter(v => v && v.trim()).length;

  return (
    <Card className="p-4 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-indigo-500" />
          <h4 className="font-semibold text-sm">C.H.O.R.D.S. Qualifier</h4>
        </div>
        <Badge variant="outline" className="bg-indigo-500/10">
          {filledCount}/6 defined
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Qualify through: Chances, Heart, Observer, Reversal, Design, Seeds
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CHORD_ITEMS.map(item => {
          const Icon = item.icon;
          const value = chords[item.key] || '';

          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className={`${item.bgColor} ${item.color} text-xs font-bold px-1.5`}>
                  {item.label}
                </Badge>
                <Icon className={`w-3 h-3 ${item.color}`} />
                <span className="text-xs font-medium">{item.fullLabel}</span>
              </div>
              <Textarea
                value={value}
                onChange={(e) => updateChord(item.key, e.target.value)}
                placeholder={item.desc}
                className="min-h-[60px] text-xs resize-none"
                disabled={readOnly}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ChordsQualifier;
