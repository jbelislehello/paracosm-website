import React from 'react';
import { Loader2, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface CompilationProgressToastProps {
  layers: Season[];
  currentLayer: Season | null;
  completedLayers: Season[];
  failedLayers: Season[];
  startTime: number;
  onDismiss?: () => void;
}

const SEASON_CONFIG: Record<Season, { label: string; icon: string }> = {
  POLLENS: { label: 'Pollens', icon: '🌸' },
  NOEMS: { label: 'Noems', icon: '💡' },
  POEMS: { label: 'Poems', icon: '📖' },
  TOTEMS: { label: 'Totems', icon: '💎' },
  ANTHEMS: { label: 'Anthems', icon: '🎵' },
};

export const CompilationProgressToast: React.FC<CompilationProgressToastProps> = ({
  layers,
  currentLayer,
  completedLayers,
  failedLayers,
  startTime,
  onDismiss,
}) => {
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const progress = layers.length > 0 
    ? ((completedLayers.length + failedLayers.length) / layers.length) * 100 
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (season: Season) => {
    if (completedLayers.includes(season)) {
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    }
    if (failedLayers.includes(season)) {
      return <XCircle className="h-3.5 w-3.5 text-destructive" />;
    }
    if (currentLayer === season) {
      return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />;
    }
    return <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />;
  };

  return (
    <div className="w-80 bg-background border border-border rounded-lg shadow-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
          <span className="font-medium text-sm">Compiling PRD...</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{formatTime(elapsed)}</span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>
            {currentLayer && `Compiling ${SEASON_CONFIG[currentLayer].label}...`}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Layer Status Grid */}
      <div className="flex items-center justify-between gap-1">
        {(['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'] as Season[]).map(season => {
          const isTarget = layers.includes(season);
          return (
            <div 
              key={season}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1.5 rounded transition-all",
                currentLayer === season && "bg-primary/10 ring-1 ring-primary/30",
                completedLayers.includes(season) && "bg-emerald-500/10",
                failedLayers.includes(season) && "bg-destructive/10",
                !isTarget && "opacity-40"
              )}
            >
              <span className="text-sm">{SEASON_CONFIG[season].icon}</span>
              {getStatusIcon(season)}
            </div>
          );
        })}
      </div>

      {/* Dismiss hint */}
      <p className="text-[10px] text-muted-foreground text-center">
        This will dismiss automatically when complete
      </p>
    </div>
  );
};

export default CompilationProgressToast;
