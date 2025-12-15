import { useMemo, useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Unlock, FileText, Sparkles } from 'lucide-react';
import { shouldTriggerPrdGeneration } from '@/utils/prdAccessLevel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const CONFETTI_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-sm animate-confetti-fall"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: CONFETTI_COLORS[i % 5],
          width: `${8 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 8}px`,
          animationDelay: `${Math.random() * 0.5}s`,
          animationDuration: `${2 + Math.random()}s`,
        }}
      />
    ))}
  </div>
);

interface PrdUnlockProgressProps {
  tilesVisited: number;
  currentSeason: string;
  userId?: string;
}

const TILES_THRESHOLD = 32;
const FRAGMENTS_THRESHOLD = 5;

export const PrdUnlockProgress = ({ 
  tilesVisited, 
  currentSeason,
  userId 
}: PrdUnlockProgressProps) => {
  const [polenCount, setPolenCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevUnlocked = useRef(false);
  const hasShownCelebration = useRef(false);

  // Fetch polen count for current season
  useEffect(() => {
    const fetchPolenCount = async () => {
      if (!userId) return;
      
      const { count } = await supabase
        .from('polen_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('season_context', currentSeason);
      
      setPolenCount(count || 0);
    };

    fetchPolenCount();
  }, [userId, currentSeason, tilesVisited]);

  const isUnlocked = useMemo(() => 
    shouldTriggerPrdGeneration(currentSeason as any, tilesVisited, polenCount),
    [currentSeason, tilesVisited, polenCount]
  );

  // Celebration effect when unlocked
  useEffect(() => {
    if (isUnlocked && !prevUnlocked.current && !hasShownCelebration.current) {
      toast({
        title: "🎉 PRD Generation Unlocked!",
        description: "You've captured enough insights to generate your first PRD.",
      });
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      hasShownCelebration.current = true;
    }
    prevUnlocked.current = isUnlocked;
  }, [isUnlocked]);

  const tilesProgress = Math.min((tilesVisited / TILES_THRESHOLD) * 100, 100);
  const fragmentsProgress = Math.min((polenCount / FRAGMENTS_THRESHOLD) * 100, 100);
  
  const tilesRemaining = Math.max(TILES_THRESHOLD - tilesVisited, 0);
  const fragmentsRemaining = Math.max(FRAGMENTS_THRESHOLD - polenCount, 0);

  // Both conditions met or full season complete
  const bothConditionsMet = tilesVisited >= TILES_THRESHOLD && polenCount >= FRAGMENTS_THRESHOLD;
  const seasonComplete = tilesVisited >= 64;

  if (isUnlocked || seasonComplete) {
    return (
      <>
        {showConfetti && <Confetti />}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
          <Unlock className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">PRD Generation Ready</span>
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
      
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="w-3 h-3" />
          <span>PRD Unlock Progress</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Tiles progress */}
          <div className="flex-1 space-y-0.5">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Tiles</span>
              <span>{tilesVisited}/{TILES_THRESHOLD}</span>
            </div>
            <Progress value={tilesProgress} className="h-1.5" />
          </div>
          
          {/* Fragments progress */}
          <div className="flex-1 space-y-0.5">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Fragments</span>
              <span>{polenCount}/{FRAGMENTS_THRESHOLD}</span>
            </div>
            <Progress value={fragmentsProgress} className="h-1.5" />
          </div>
        </div>
        
        {/* Remaining message */}
        <p className="text-[10px] text-muted-foreground">
          {tilesRemaining > 0 && fragmentsRemaining > 0 && (
            <>Visit {tilesRemaining} more tile{tilesRemaining !== 1 ? 's' : ''} and capture {fragmentsRemaining} more fragment{fragmentsRemaining !== 1 ? 's' : ''}</>
          )}
          {tilesRemaining > 0 && fragmentsRemaining === 0 && (
            <>Visit {tilesRemaining} more tile{tilesRemaining !== 1 ? 's' : ''} to unlock</>
          )}
          {tilesRemaining === 0 && fragmentsRemaining > 0 && (
            <>Capture {fragmentsRemaining} more fragment{fragmentsRemaining !== 1 ? 's' : ''} to unlock</>
          )}
        </p>
      </div>
    </div>
  );
};

export default PrdUnlockProgress;
