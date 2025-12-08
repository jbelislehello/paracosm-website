import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Waves, Music } from 'lucide-react';
import { JournalPhase, CycleNumber } from '@/types/journal-expansion';

interface CycleTrackerProps {
  currentCycle: CycleNumber;
  tilesVisited: number;
  totalTiles?: number;
  phase: JournalPhase;
  integratorsUnlocked: number;
  onPhaseClick?: (phase: JournalPhase) => void;
}

export const CycleTracker: React.FC<CycleTrackerProps> = ({
  currentCycle,
  tilesVisited,
  totalTiles = 64,
  phase,
  integratorsUnlocked,
  onPhaseClick
}) => {
  const cycleProgress = (tilesVisited / totalTiles) * 100;
  const totalProgress = ((currentCycle - 1) * 64 + tilesVisited) / 260 * 100;

  const phases: { key: JournalPhase; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'glitch', label: 'GL!TCH', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-500' },
    { key: 'drift', label: 'DRIFT', icon: <Waves className="h-4 w-4" />, color: 'bg-blue-500' },
    { key: 'tune', label: 'TUNE', icon: <Music className="h-4 w-4" />, color: 'bg-purple-500' },
  ];

  return (
    <Card className="bg-background/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Cycle Journey</span>
          <Badge variant="outline" className="font-mono">
            {tilesVisited}/260
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Cycle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cycle {currentCycle} of 4</span>
            <span className="font-mono">{tilesVisited}/{totalTiles}</span>
          </div>
          <Progress value={cycleProgress} className="h-2" />
        </div>

        {/* 4-Cycle Visual */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((cycle) => (
            <div
              key={cycle}
              className={`flex-1 h-3 rounded-full transition-all ${
                cycle < currentCycle
                  ? 'bg-primary'
                  : cycle === currentCycle
                  ? 'bg-primary/60 animate-pulse'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Phase Switcher */}
        <div className="flex gap-2">
          {phases.map(({ key, label, icon, color }) => (
            <button
              key={key}
              onClick={() => onPhaseClick?.(key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                phase === key
                  ? `${color} text-white shadow-lg`
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Integrators */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Integrator Tiles Unlocked</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                  i <= integratorsUnlocked
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Total Progress */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Full Cosmological Cycle</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CycleTracker;
