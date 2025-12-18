import { useEffect, useRef, useCallback } from 'react';
import p5 from 'p5';
import { GARDEN_THEMES } from '@/data/gardenConnections';

interface GardenAmbientParticlesProps {
  garden: 'intelligence' | 'systems' | 'prototypes';
  intensity?: number;
}

const GardenAmbientParticles = ({ garden, intensity = 1 }: GardenAmbientParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  
  const theme = GARDEN_THEMES[garden];

  const initSketch = useCallback((p: p5) => {
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      type: 'synapse' | 'gear' | 'pollen';
      angle: number;
      rotationSpeed: number;
    }
    
    let particles: Particle[] = [];
    let time = 0;
    
    const primaryColor = p.color(theme.primaryColor);
    const secondaryColor = p.color(theme.secondaryColor);
    
    const particleCount = Math.floor(40 * intensity);
    
    const getParticleType = (): 'synapse' | 'gear' | 'pollen' => {
      if (garden === 'intelligence') return 'synapse';
      if (garden === 'systems') return 'gear';
      return 'pollen';
    };

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent(containerRef.current!);
      canvas.style('position', 'fixed');
      canvas.style('top', '0');
      canvas.style('left', '0');
      canvas.style('pointer-events', 'none');
      canvas.style('z-index', '0');
      
      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-0.3, 0.3),
          vy: p.random(-0.5, -0.1),
          size: p.random(3, 8),
          alpha: p.random(30, 80),
          type: getParticleType(),
          angle: p.random(p.TWO_PI),
          rotationSpeed: p.random(-0.02, 0.02),
        });
      }
    };

    p.draw = () => {
      p.clear();
      time += 0.01;
      
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx + p.sin(time + i) * 0.2;
        particle.y += particle.vy;
        particle.angle += particle.rotationSpeed;
        
        // Wrap around screen
        if (particle.y < -20) particle.y = p.height + 20;
        if (particle.x < -20) particle.x = p.width + 20;
        if (particle.x > p.width + 20) particle.x = -20;
        
        // Pulsing alpha
        const pulsingAlpha = particle.alpha + p.sin(time * 2 + i) * 20;
        
        p.push();
        p.translate(particle.x, particle.y);
        p.rotate(particle.angle);
        
        const col = p.lerpColor(primaryColor, secondaryColor, (i % 3) / 3);
        
        if (particle.type === 'synapse') {
          // Neural synapse - glowing dot with connection lines
          p.noStroke();
          p.fill(p.red(col), p.green(col), p.blue(col), pulsingAlpha * 0.3);
          p.ellipse(0, 0, particle.size * 3, particle.size * 3);
          p.fill(p.red(col), p.green(col), p.blue(col), pulsingAlpha);
          p.ellipse(0, 0, particle.size, particle.size);
          
          // Connection line to nearest particle
          if (i < particles.length - 1) {
            const next = particles[i + 1];
            const dist = p.dist(particle.x, particle.y, next.x, next.y);
            if (dist < 100) {
              p.stroke(p.red(col), p.green(col), p.blue(col), pulsingAlpha * (1 - dist / 100));
              p.strokeWeight(0.5);
              p.line(0, 0, next.x - particle.x, next.y - particle.y);
            }
          }
        } else if (particle.type === 'gear') {
          // Mechanical gear - rotating cog
          p.noFill();
          p.stroke(p.red(col), p.green(col), p.blue(col), pulsingAlpha);
          p.strokeWeight(1);
          
          const teeth = 6;
          p.beginShape();
          for (let t = 0; t < teeth; t++) {
            const angle1 = (t / teeth) * p.TWO_PI;
            const angle2 = ((t + 0.5) / teeth) * p.TWO_PI;
            p.vertex(p.cos(angle1) * particle.size, p.sin(angle1) * particle.size);
            p.vertex(p.cos(angle2) * particle.size * 0.6, p.sin(angle2) * particle.size * 0.6);
          }
          p.endShape(p.CLOSE);
        } else {
          // Pollen - soft floating spore
          p.noStroke();
          p.fill(p.red(col), p.green(col), p.blue(col), pulsingAlpha * 0.4);
          p.ellipse(0, 0, particle.size * 2.5, particle.size * 2.5);
          p.fill(p.red(col), p.green(col), p.blue(col), pulsingAlpha);
          p.ellipse(0, 0, particle.size, particle.size);
          
          // Tiny spines
          p.stroke(p.red(col), p.green(col), p.blue(col), pulsingAlpha * 0.5);
          p.strokeWeight(0.5);
          for (let s = 0; s < 4; s++) {
            const sAngle = s * p.HALF_PI;
            p.line(0, 0, p.cos(sAngle) * particle.size * 1.5, p.sin(sAngle) * particle.size * 1.5);
          }
        }
        
        p.pop();
      });
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  }, [garden, theme, intensity]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    p5Ref.current = new p5(initSketch);
    
    return () => {
      p5Ref.current?.remove();
    };
  }, [initSketch]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default GardenAmbientParticles;
