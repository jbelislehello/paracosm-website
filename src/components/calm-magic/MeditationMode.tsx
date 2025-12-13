import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, Volume2, Moon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCosmologicalAudio } from '@/hooks/useCosmologicalAudio';

interface MeditationModeProps {
  resonatingTiles: Array<{ tileId: number; score: number; sealName: string }>;
  onTileHighlight: (tileId: number | null) => void;
  onClose: () => void;
}

const MEDITATION_PATTERNS = [
  { name: 'Ascending Spiral', description: 'Rise through the seals', pattern: 'ascending' },
  { name: 'Descending Wave', description: 'Flow downward gently', pattern: 'descending' },
  { name: 'Harmonic Weave', description: 'Alternate high and low', pattern: 'weave' },
  { name: 'Resonance Pulse', description: 'Strongest first, fade out', pattern: 'pulse' },
];

export const MeditationMode: React.FC<MeditationModeProps> = ({
  resonatingTiles,
  onTileHighlight,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tempo, setTempo] = useState([3000]); // ms between tiles
  const [selectedPattern, setSelectedPattern] = useState('ascending');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  
  const { initAudio, playTileSound, playResonanceChord, isInitialized } = useCosmologicalAudio();

  // Arrange tiles based on selected pattern
  const arrangedTiles = useCallback(() => {
    const tiles = [...resonatingTiles];
    switch (selectedPattern) {
      case 'ascending':
        return tiles.sort((a, b) => a.tileId - b.tileId);
      case 'descending':
        return tiles.sort((a, b) => b.tileId - a.tileId);
      case 'weave':
        const sorted = tiles.sort((a, b) => b.score - a.score);
        const woven: typeof tiles = [];
        let left = 0, right = sorted.length - 1;
        while (left <= right) {
          if (left === right) woven.push(sorted[left]);
          else {
            woven.push(sorted[left], sorted[right]);
          }
          left++;
          right--;
        }
        return woven;
      case 'pulse':
        return tiles.sort((a, b) => b.score - a.score);
      default:
        return tiles;
    }
  }, [resonatingTiles, selectedPattern]);

  const tiles = arrangedTiles();

  // Breathing cycle synchronized with tile playback
  useEffect(() => {
    if (!isPlaying) return;
    
    const breathCycle = () => {
      setBreathPhase('inhale');
      setTimeout(() => setBreathPhase('hold'), tempo[0] * 0.4);
      setTimeout(() => setBreathPhase('exhale'), tempo[0] * 0.6);
    };
    
    breathCycle();
    const interval = setInterval(breathCycle, tempo[0]);
    return () => clearInterval(interval);
  }, [isPlaying, tempo]);

  // Auto-play tiles
  useEffect(() => {
    if (!isPlaying || tiles.length === 0) return;

    const playNext = () => {
      const tile = tiles[currentIndex];
      if (tile) {
        onTileHighlight(tile.tileId);
        if (isInitialized) {
          playTileSound(tile.tileId);
        }
      }

      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= tiles.length) {
          setCycleCount((c) => c + 1);
          return 0; // Loop
        }
        return next;
      });
    };

    playNext();
    const interval = setInterval(playNext, tempo[0]);
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, tiles, tempo, isInitialized, onTileHighlight, playTileSound]);

  const handleStart = async () => {
    if (!isInitialized) {
      await initAudio();
    }
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    onTileHighlight(null);
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => (prev + 1) % tiles.length);
  };

  const playChord = () => {
    if (isInitialized && tiles.length > 0) {
      playResonanceChord(tiles.slice(0, 4).map(t => t.tileId));
    }
  };

  const currentTile = tiles[currentIndex];
  const progress = tiles.length > 0 ? ((currentIndex + 1) / tiles.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center">
      {/* Breathing visualization */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className={`rounded-full transition-all duration-1000 ${
            breathPhase === 'inhale' ? 'w-96 h-96 opacity-30' :
            breathPhase === 'hold' ? 'w-80 h-80 opacity-40' :
            'w-64 h-64 opacity-20'
          }`}
          style={{
            background: `radial-gradient(circle, hsl(var(--primary) / 0.3), transparent)`,
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Moon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-light">Meditation Mode</h2>
          <Badge variant="outline" className="ml-2">
            Cycle {cycleCount + 1}
          </Badge>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Exit
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full px-6">
        {/* Current tile display */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
            {breathPhase === 'inhale' ? 'Breathe In' : breathPhase === 'hold' ? 'Hold' : 'Breathe Out'}
          </p>
          {currentTile ? (
            <>
              <h3 className="text-4xl font-light mb-2">{currentTile.sealName}</h3>
              <p className="text-muted-foreground">
                Tile {currentTile.tileId} • Resonance {Math.round(currentTile.score * 100)}%
              </p>
            </>
          ) : (
            <h3 className="text-2xl text-muted-foreground">Select tiles to begin</h3>
          )}
        </div>

        {/* Progress */}
        <div className="w-full space-y-2">
          <Progress value={progress} className="h-1" />
          <p className="text-xs text-center text-muted-foreground">
            {currentIndex + 1} of {tiles.length} tiles
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {isPlaying ? (
            <Button size="lg" variant="outline" onClick={handleStop}>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          ) : (
            <Button size="lg" onClick={handleStart} disabled={tiles.length === 0}>
              <Play className="w-5 h-5 mr-2" />
              Begin
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleSkip} disabled={!isPlaying}>
            <SkipForward className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={playChord} disabled={tiles.length === 0}>
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>

        {/* Pattern selection */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {MEDITATION_PATTERNS.map((pattern) => (
            <button
              key={pattern.pattern}
              onClick={() => setSelectedPattern(pattern.pattern)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedPattern === pattern.pattern
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-sm">{pattern.name}</p>
              <p className="text-xs text-muted-foreground">{pattern.description}</p>
            </button>
          ))}
        </div>

        {/* Tempo control */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tempo</span>
            <span>{(tempo[0] / 1000).toFixed(1)}s per tile</span>
          </div>
          <Slider
            value={tempo}
            onValueChange={setTempo}
            min={1000}
            max={8000}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Faster</span>
            <span>Slower</span>
          </div>
        </div>

        {/* Tile sequence preview */}
        <div className="flex gap-1 flex-wrap justify-center max-h-20 overflow-hidden">
          {tiles.map((tile, idx) => (
            <div
              key={tile.tileId}
              className={`w-8 h-8 rounded flex items-center justify-center text-xs transition-all ${
                idx === currentIndex
                  ? 'bg-primary text-primary-foreground scale-110'
                  : idx < currentIndex
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              {tile.tileId}
            </div>
          ))}
        </div>
      </div>

      {/* Audio indicator */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Volume2 className="w-4 h-4" />
        {isInitialized ? 'Audio enabled' : 'Click Begin to enable audio'}
      </div>
    </div>
  );
};
