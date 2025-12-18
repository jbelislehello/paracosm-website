import { useEffect, useRef, useCallback, useState } from 'react';
import p5 from 'p5';
import { cn } from '@/lib/utils';

interface GardenCelebrationProps {
  isActive?: boolean;
  onComplete?: () => void;
}

const GardenCelebration = ({ isActive = true, onComplete }: GardenCelebrationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [showLightRays, setShowLightRays] = useState(true);

  const initSketch = useCallback((p: p5) => {
    interface Confetti {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: p5.Color;
      rotation: number;
      rotationSpeed: number;
      type: 'rect' | 'circle' | 'star';
      gravity: number;
    }
    
    let confetti: Confetti[] = [];
    let time = 0;
    let celebrationComplete = false;
    
    const colors = [
      '#f43f5e', // rose
      '#8b5cf6', // violet
      '#06b6d4', // cyan
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ec4899', // pink
    ];

    const createConfetti = (count: number) => {
      for (let i = 0; i < count; i++) {
        confetti.push({
          x: p.random(p.width),
          y: p.random(-200, -50),
          vx: p.random(-3, 3),
          vy: p.random(2, 6),
          size: p.random(6, 14),
          color: p.color(colors[Math.floor(p.random(colors.length))]),
          rotation: p.random(p.TWO_PI),
          rotationSpeed: p.random(-0.15, 0.15),
          type: ['rect', 'circle', 'star'][Math.floor(p.random(3))] as 'rect' | 'circle' | 'star',
          gravity: p.random(0.05, 0.15),
        });
      }
    };

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent(containerRef.current!);
      canvas.style('position', 'fixed');
      canvas.style('top', '0');
      canvas.style('left', '0');
      canvas.style('pointer-events', 'none');
      canvas.style('z-index', '100');
      
      // Initial burst
      createConfetti(80);
    };

    p.draw = () => {
      p.clear();
      time += 0.02;
      
      // Add more confetti periodically for first 3 seconds
      if (time < 3 && p.frameCount % 15 === 0) {
        createConfetti(10);
      }
      
      // Update and draw confetti
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        
        // Physics
        c.vy += c.gravity;
        c.x += c.vx + p.sin(time * 2 + i) * 0.5;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;
        
        // Air resistance
        c.vx *= 0.99;
        
        // Remove if off screen
        if (c.y > p.height + 50) {
          confetti.splice(i, 1);
          continue;
        }
        
        p.push();
        p.translate(c.x, c.y);
        p.rotate(c.rotation);
        
        p.fill(c.color);
        p.noStroke();
        
        if (c.type === 'rect') {
          p.rect(-c.size / 2, -c.size / 4, c.size, c.size / 2, 1);
        } else if (c.type === 'circle') {
          p.ellipse(0, 0, c.size, c.size);
        } else {
          // Star shape
          p.beginShape();
          for (let j = 0; j < 5; j++) {
            const angle = (j / 5) * p.TWO_PI - p.HALF_PI;
            const outerX = p.cos(angle) * c.size / 2;
            const outerY = p.sin(angle) * c.size / 2;
            p.vertex(outerX, outerY);
            
            const innerAngle = angle + p.PI / 5;
            const innerX = p.cos(innerAngle) * c.size / 4;
            const innerY = p.sin(innerAngle) * c.size / 4;
            p.vertex(innerX, innerY);
          }
          p.endShape(p.CLOSE);
        }
        
        p.pop();
      }
      
      // Check if celebration is complete
      if (!celebrationComplete && confetti.length === 0 && time > 3) {
        celebrationComplete = true;
        onComplete?.();
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  }, [onComplete]);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    
    p5Ref.current = new p5(initSketch);
    
    // Hide light rays after a few seconds
    const timer = setTimeout(() => setShowLightRays(false), 5000);
    
    return () => {
      p5Ref.current?.remove();
      clearTimeout(timer);
    };
  }, [initSketch, isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Light rays from center */}
      {showLightRays && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div 
            className={cn(
              "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[200vmax] h-[200vmax]",
              "animate-[spin_20s_linear_infinite]",
              "opacity-30"
            )}
            style={{
              background: `conic-gradient(
                from 0deg,
                transparent 0deg,
                hsl(var(--primary) / 0.3) 10deg,
                transparent 20deg,
                transparent 30deg,
                hsl(var(--primary) / 0.2) 40deg,
                transparent 50deg,
                transparent 60deg,
                hsl(var(--primary) / 0.3) 70deg,
                transparent 80deg,
                transparent 90deg
              )`,
            }}
          />
        </div>
      )}
      
      {/* Confetti canvas */}
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[100]" />
    </>
  );
};

export default GardenCelebration;
