// Pattern Detection Badge - Shows pattern detection status and triggers celebrations

import React, { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, Eye, Search } from 'lucide-react';
import { detectPatterns, DetectedPattern, getPatternColor } from '@/utils/patternDetection';
import { useCosmologicalAudio } from '@/hooks/useCosmologicalAudio';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PatternDetectionBadgeProps {
  visitedTiles: Set<string>;
  season: string;
  onPatternDetected?: (patterns: DetectedPattern[]) => void;
  onOpenJournal?: () => void;
}

const PatternDetectionBadge: React.FC<PatternDetectionBadgeProps> = ({
  visitedTiles,
  season,
  onPatternDetected,
  onOpenJournal,
}) => {
  const [patterns, setPatterns] = useState<DetectedPattern[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const previousPatternsRef = useRef<string[]>([]);
  
  const { playTrigramSound, playHexagramSound, playGeometricPatternSound } = useCosmologicalAudio();
  const { triggerTrigramHaptic, triggerHexagramHaptic, triggerGeometricHaptic, triggerCelebrationHaptic } = useHapticFeedback();

  const tilesCount = visitedTiles.size;
  const isUnlocked = tilesCount >= 40;
  const tilesToUnlock = 40 - tilesCount;

  useEffect(() => {
    if (!isUnlocked) {
      setPatterns([]);
      return;
    }

    setIsScanning(true);
    
    // Simulate brief scanning delay for effect
    const timer = setTimeout(() => {
      const detected = detectPatterns(visitedTiles, 40);
      setPatterns(detected);
      setIsScanning(false);

      // Check for new patterns
      const currentPatternIds = detected.map(p => p.id);
      const newPatterns = detected.filter(p => !previousPatternsRef.current.includes(p.id));
      
      if (newPatterns.length > 0) {
        // Trigger celebration for new patterns
        setShowCelebration(true);
        triggerCelebrationHaptic();
        
        // Play sound for the first new pattern
        const firstNew = newPatterns[0];
        if (firstNew.type === 'trigram' && firstNew.trigramData) {
          playTrigramSound(firstNew.trigramData.trigram.name);
          triggerTrigramHaptic(firstNew.trigramData.trigram.name);
        } else if (firstNew.type === 'hexagram' && firstNew.hexagramData) {
          playHexagramSound(firstNew.hexagramData.hexagram);
          triggerHexagramHaptic(firstNew.hexagramData.hexagram.lines);
        } else if (firstNew.type === 'geometric') {
          playGeometricPatternSound(firstNew.id.replace('geometric-', ''));
          triggerGeometricHaptic(firstNew.id.replace('geometric-', ''));
        }

        // Show toast
        toast.success(`${firstNew.icon} ${firstNew.name} Discovered!`, {
          description: firstNew.meaning,
          duration: 5000,
        });

        // Notify parent
        onPatternDetected?.(detected);

        // Reset celebration after animation
        setTimeout(() => setShowCelebration(false), 2000);
      }

      previousPatternsRef.current = currentPatternIds;
    }, 500);

    return () => clearTimeout(timer);
  }, [visitedTiles, isUnlocked]);

  if (!isUnlocked) {
    return (
      <Badge variant="outline" className="opacity-60 gap-1">
        <Lock className="w-3 h-3" />
        <span className="text-xs">{tilesToUnlock} tiles to patterns</span>
      </Badge>
    );
  }

  if (isScanning) {
    return (
      <Badge variant="secondary" className="animate-pulse gap-1">
        <Search className="w-3 h-3 animate-spin" />
        <span className="text-xs">Scanning patterns...</span>
      </Badge>
    );
  }

  if (patterns.length === 0) {
    return (
      <Badge variant="outline" className="gap-1">
        <Eye className="w-3 h-3" />
        <span className="text-xs">No patterns yet</span>
      </Badge>
    );
  }

  const primaryPattern = patterns[0];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onOpenJournal}
      className={cn(
        "gap-1.5 h-8 px-3 transition-all",
        showCelebration && "animate-pulse ring-2 ring-primary/50"
      )}
      style={{
        ...(showCelebration && {
          boxShadow: `0 0 20px ${getPatternColor(primaryPattern.type)}`,
        })
      }}
    >
      <span 
        className="text-lg"
        style={{ color: getPatternColor(primaryPattern.type) }}
      >
        {primaryPattern.icon}
      </span>
      <span className="text-xs font-medium">
        {primaryPattern.name}
      </span>
      {patterns.length > 1 && (
        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
          +{patterns.length - 1}
        </Badge>
      )}
      {showCelebration && (
        <Sparkles className="w-3 h-3 text-yellow-500 animate-bounce" />
      )}
    </Button>
  );
};

export default PatternDetectionBadge;
