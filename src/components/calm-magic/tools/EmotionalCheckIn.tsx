import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Heart, Sparkles, Brain, Leaf, Wind, ChevronDown, ChevronUp, Activity, Camera, Wand2 } from 'lucide-react';
import { FeltState, EmotionalAxes, EmotionalCheckInData } from '@/types/trajectory';
import { BodyAwareCapture } from '../embodied/BodyAwareCapture';
import type { EmbodiedAxesInference } from '@/types/embodied';

interface EmotionalCheckInProps {
  tileId: number;
  onCheckin: (feltState: FeltState, axes: EmotionalAxes, note?: string) => void;
  previousCheckins?: EmotionalCheckInData[];
}

const FELT_STATES: { value: FeltState; label: string; icon: string; color: string }[] = [
  { value: 'stuck', label: 'Stuck', icon: '🪨', color: 'bg-muted text-muted-foreground hover:bg-muted/80' },
  { value: 'flowing', label: 'Flowing', icon: '🌊', color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/30' },
  { value: 'breakthrough', label: 'Breakthrough', icon: '✨', color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/30' },
];

const AXES_CONFIG: { key: keyof EmotionalAxes; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'love', label: 'Love', icon: <Heart className="w-3 h-3" />, color: 'text-rose-500' },
  { key: 'magic', label: 'Magic', icon: <Sparkles className="w-3 h-3" />, color: 'text-purple-500' },
  { key: 'calm', label: 'Calm', icon: <Brain className="w-3 h-3" />, color: 'text-blue-500' },
  { key: 'open', label: 'Open', icon: <Leaf className="w-3 h-3" />, color: 'text-green-500' },
  { key: 'free', label: 'Free', icon: <Wind className="w-3 h-3" />, color: 'text-amber-500' },
];

export const EmotionalCheckIn = ({ tileId, onCheckin, previousCheckins = [] }: EmotionalCheckInProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feltState, setFeltState] = useState<FeltState>(null);
  const [axes, setAxes] = useState<EmotionalAxes>({
    love: 50,
    magic: 50,
    calm: 50,
    open: 50,
    free: 50,
  });
  const [note, setNote] = useState('');
  
  // Body-aware mode state
  const [bodyAwareEnabled, setBodyAwareEnabled] = useState(false);
  const [embodiedSuggestion, setEmbodiedSuggestion] = useState<EmbodiedAxesInference | null>(null);
  const [isBodyActive, setIsBodyActive] = useState(false);

  const handleAxisChange = (key: keyof EmotionalAxes, value: number[]) => {
    setAxes(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSubmit = () => {
    onCheckin(feltState, axes, note.trim() || undefined);
    // Reset form
    setFeltState(null);
    setAxes({ love: 50, magic: 50, calm: 50, open: 50, free: 50 });
    setNote('');
    setIsExpanded(false);
    setEmbodiedSuggestion(null);
  };
  
  // Handle embodied state changes
  const handleEmbodiedStateChange = useCallback((inferredAxes: EmbodiedAxesInference) => {
    setEmbodiedSuggestion(inferredAxes);
  }, []);
  
  // Apply embodied suggestion to sliders
  const applyEmbodiedSuggestion = useCallback(() => {
    if (embodiedSuggestion) {
      setAxes(embodiedSuggestion);
    }
  }, [embodiedSuggestion]);

  const checkinCount = previousCheckins.length;
  const lastCheckin = previousCheckins[previousCheckins.length - 1];

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between h-auto py-2 px-3 hover:bg-primary/5"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Emotional Check-in</span>
            {checkinCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5">
                {checkinCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {lastCheckin?.felt_state && (
              <span className="text-xs text-muted-foreground">
                {FELT_STATES.find(s => s.value === lastCheckin.felt_state)?.icon}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-3 pb-3 space-y-3">
        {/* Body-Aware Mode Toggle */}
        <div className="flex items-center justify-between py-2 px-2 rounded-md bg-muted/30">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium">Body-Aware Mode</span>
            {isBodyActive && (
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                Active
              </Badge>
            )}
          </div>
          <Switch
            checked={bodyAwareEnabled}
            onCheckedChange={setBodyAwareEnabled}
            className="scale-75"
          />
        </div>
        
        {/* Body-Aware Capture */}
        {bodyAwareEnabled && (
          <BodyAwareCapture
            compact
            onStateChange={handleEmbodiedStateChange}
            onActiveChange={setIsBodyActive}
          />
        )}
        
        {/* Embodied Suggestion Banner */}
        {embodiedSuggestion && isBodyActive && (
          <div className="flex items-center justify-between p-2 rounded-md bg-violet-500/10 border border-violet-500/20">
            <div className="flex items-center gap-2">
              <Wand2 className="w-3 h-3 text-violet-500" />
              <span className="text-xs text-violet-600">Body-inferred axes ready</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-500/20"
              onClick={applyEmbodiedSuggestion}
            >
              Apply
            </Button>
          </div>
        )}
        
        {/* Felt State Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">How are you feeling?</label>
          <div className="flex gap-2">
            {FELT_STATES.map(state => (
              <Button
                key={state.value}
                variant="outline"
                size="sm"
                className={`flex-1 text-xs ${
                  feltState === state.value 
                    ? state.color + ' border' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setFeltState(state.value)}
              >
                <span className="mr-1">{state.icon}</span>
                {state.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 5-Axis Mini Compass */}
        <div className="space-y-2 pt-1">
          <label className="text-xs text-muted-foreground font-medium">Energy Levels</label>
          <div className="grid gap-2">
            {AXES_CONFIG.map(axis => (
              <div key={axis.key} className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 w-16 ${axis.color}`}>
                  {axis.icon}
                  <span className="text-[10px] font-medium">{axis.label}</span>
                </div>
                <Slider
                  value={[axes[axis.key]]}
                  onValueChange={(v) => handleAxisChange(axis.key, v)}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-[10px] text-muted-foreground w-6 text-right">
                  {axes[axis.key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">Quick note (optional)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's alive for you right now?"
            className="min-h-[60px] text-sm resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          size="sm"
          className="w-full"
          disabled={feltState === null}
        >
          <Activity className="w-3 h-3 mr-1" />
          Record Check-in
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};
