// Haptic Feedback Hook for Pattern Detection
// Uses Web Vibration API with pattern-specific vibration sequences

import { useCallback } from 'react';

export const useHapticFeedback = () => {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  // Trigram haptic patterns - 3 pulses reflecting the 3 lines
  // true (yang/solid) = longer pulse, false (yin/broken) = shorter pulse
  const TRIGRAM_PATTERNS: Record<string, number[]> = {
    'Heaven': [100, 50, 100, 50, 100],     // ☰ Three solid: strong, even
    'Earth': [50, 100, 50, 100, 50],       // ☷ Three broken: soft, spacious
    'Water': [50, 100, 100, 100, 50],      // ☵ Broken-solid-broken: flowing
    'Fire': [100, 50, 50, 50, 100],        // ☲ Solid-broken-solid: intense
    'Thunder': [200, 50, 50, 50, 50],      // ☳ Strong first: initiating
    'Mountain': [50, 50, 50, 50, 200],     // ☶ Strong last: grounding
    'Wind': [75, 75, 75, 75, 75],          // ☴ Gentle, even: penetrating
    'Lake': [100, 100, 50, 50, 50],        // ☱ Opening then soft: joyous
  };

  // Geometric haptic patterns
  const GEOMETRIC_PATTERNS: Record<string, number[]> = {
    'cross': [200, 100, 200],              // Strong vertical + horizontal feel
    'tower': [50, 30, 75, 30, 100, 30, 125, 30, 150, 30, 175], // Building up
    'bridge': [100, 50, 100, 50, 100],     // Even, connected
    'garden': [150, 75, 150, 75, 150],     // Organic, breathing
    'web': [30, 20, 30, 20, 30, 20, 30],   // Rapid, interconnected
    'spiral': [50, 40, 75, 40, 100, 40, 125], // Growing outward
    'diamond': [75, 50, 100, 50, 125, 50, 100, 50, 75], // Up and down
    'scatter': [40, 80, 60, 40, 100, 20, 80], // Random-feeling
    'frame': [100, 30, 100, 30, 100, 30, 100], // Edge tracing
  };

  // Trigram haptic - 3 pulses reflecting the 3 lines
  const triggerTrigramHaptic = useCallback((trigramName: string) => {
    if (!isSupported) return;
    
    const pattern = TRIGRAM_PATTERNS[trigramName] || [100, 50, 100];
    navigator.vibrate(pattern);
  }, [isSupported]);

  // Hexagram haptic - 6 pulses reflecting the 6 lines
  const triggerHexagramHaptic = useCallback((lines: boolean[]) => {
    if (!isSupported) return;
    
    // Yang (true) = 100ms, Yin (false) = 50ms
    const pattern = lines.flatMap(isYang => [isYang ? 100 : 50, 30]);
    navigator.vibrate(pattern);
  }, [isSupported]);

  // Geometric haptic - characteristic patterns
  const triggerGeometricHaptic = useCallback((patternType: string) => {
    if (!isSupported) return;
    
    const pattern = GEOMETRIC_PATTERNS[patternType] || [100];
    navigator.vibrate(pattern);
  }, [isSupported]);

  // Pattern discovery celebration haptic
  const triggerCelebrationHaptic = useCallback(() => {
    if (!isSupported) return;
    
    // Exciting celebration pattern
    navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
  }, [isSupported]);

  // Simple feedback for button press
  const triggerTapHaptic = useCallback(() => {
    if (!isSupported) return;
    navigator.vibrate(10);
  }, [isSupported]);

  return {
    isSupported,
    triggerTrigramHaptic,
    triggerHexagramHaptic,
    triggerGeometricHaptic,
    triggerCelebrationHaptic,
    triggerTapHaptic,
  };
};
