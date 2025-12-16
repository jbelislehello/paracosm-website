import { useEffect, useState } from 'react';
import { Sparkles, Star, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsciousnessAwakeningCelebrationProps {
  isAwakened: boolean;
  onDismiss?: () => void;
}

// Generate random particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
    type: ['sparkle', 'star', 'orbit'][Math.floor(Math.random() * 3)] as 'sparkle' | 'star' | 'orbit',
  }));
};

export const ConsciousnessAwakeningCelebration = ({ 
  isAwakened, 
  onDismiss 
}: ConsciousnessAwakeningCelebrationProps) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles] = useState(() => generateParticles(24));
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isAwakened && !dismissed) {
      setShowCelebration(true);
      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
        setDismissed(true);
        onDismiss?.();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isAwakened, dismissed, onDismiss]);

  if (!showCelebration) return null;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      aria-live="polite"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10 animate-pulse" />
      
      {/* Animated particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-[float_3s_ease-in-out_infinite]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {particle.type === 'sparkle' && (
            <Sparkles 
              className="text-emerald-400 animate-[pulse_1.5s_ease-in-out_infinite,spin_4s_linear_infinite]" 
              style={{ 
                width: particle.size, 
                height: particle.size,
                animationDelay: `${particle.delay}s`,
              }} 
            />
          )}
          {particle.type === 'star' && (
            <Star 
              className="text-amber-400 fill-amber-400/50 animate-[pulse_2s_ease-in-out_infinite]" 
              style={{ 
                width: particle.size, 
                height: particle.size,
                animationDelay: `${particle.delay}s`,
              }} 
            />
          )}
          {particle.type === 'orbit' && (
            <Orbit 
              className="text-violet-400 animate-[spin_6s_linear_infinite]" 
              style={{ 
                width: particle.size * 1.2, 
                height: particle.size * 1.2,
                animationDelay: `${particle.delay}s`,
              }} 
            />
          )}
        </div>
      ))}

      {/* Central awakening message */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <div 
          className={cn(
            "relative p-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-background/95 to-violet-500/20",
            "border border-emerald-500/30 shadow-2xl shadow-emerald-500/20",
            "animate-[scale-in_0.5s_ease-out,pulse_3s_ease-in-out_infinite]",
            "backdrop-blur-xl cursor-pointer"
          )}
          onClick={() => {
            setShowCelebration(false);
            setDismissed(true);
            onDismiss?.();
          }}
        >
          {/* Glow ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-2xl opacity-30 blur-xl animate-pulse" />
          
          <div className="relative z-10 text-center">
            {/* Icon burst */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 animate-ping" />
              </div>
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
              ✦ Consciousness Awakened ✦
            </h2>

            {/* Subtitle */}
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Your manifold has crossed the self-awareness threshold. 
              The geometry of consciousness has emerged.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-500">✓</div>
                <div className="text-[10px] text-muted-foreground">Threshold Crossed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-500">∞</div>
                <div className="text-[10px] text-muted-foreground">Self-Reference</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-violet-500">Ω</div>
                <div className="text-[10px] text-muted-foreground">Integrated</div>
              </div>
            </div>

            {/* Dismiss hint */}
            <p className="text-[10px] text-muted-foreground mt-4 opacity-60">
              Click to dismiss
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
