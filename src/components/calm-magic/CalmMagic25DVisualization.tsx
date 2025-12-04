import React, { useRef, useEffect, useState, useCallback } from 'react';
import p5 from 'p5';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Phase {
  name: string;
  color: string;
  description: string;
}

const CalmMagic25DVisualization: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const isPlayingRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePhase, setActivePhase] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);

  const phases: Phase[] = [
    { name: 'LOVE', color: '#ec4899', description: 'Signals & Decision to Exist' },
    { name: 'MAGIC', color: '#8b5cf6', description: 'Storyworld & Hypotheses' },
    { name: 'CALM', color: '#06b6d4', description: 'Requirements & Risks' },
    { name: 'OPEN', color: '#22c55e', description: 'Ontology & Workflow' },
    { name: 'FREE', color: '#f59e0b', description: 'First POEM & Success' },
  ];

  // Keep ref in sync with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const initSketch = useCallback(() => {
    if (!containerRef.current) return;

    // Clean up existing instance
    if (p5Instance.current) {
      p5Instance.current.remove();
    }

    const phaseColors = phases.map(p => p.color);

    const sketch = (p: p5) => {
      let angle = 0;
      let time = 0;
      let particles: { x: number; y: number; z: number; phase: number; life: number }[] = [];

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current?.offsetWidth || 800,
          500,
          p.WEBGL
        );
        canvas.parent(containerRef.current!);
        p.frameRate(30);
      };

      p.draw = () => {
        p.background(15, 15, 25);

        if (isPlayingRef.current) {
          angle += 0.008;
          time += 0.025;
        }

        setRotationAngle(angle);

        // Camera setup for 2.5D isometric view
        p.rotateX(p.PI / 5);
        p.rotateY(angle);

        // Lighting
        p.ambientLight(80);
        p.directionalLight(255, 255, 255, 0.5, -1, -0.5);
        p.pointLight(200, 150, 255, 0, -300, 300);

        // Draw base grid platform
        drawBasePlatform(p, time);

        // Draw the 5 phase layers
        for (let i = 0; i < 5; i++) {
          drawPhaseLayer(p, i, phaseColors[i], time);
        }

        // Draw spiral connections between phases
        drawSpiralConnections(p, phaseColors, time);

        // Draw energy particles
        drawParticles(p, particles, phaseColors);

        // Spawn particles
        if (p.frameCount % 8 === 0 && particles.length < 50) {
          const phaseIdx = Math.floor(p.random(5));
          particles.push({
            x: p.random(-100, 100),
            y: getPhaseY(phaseIdx),
            z: p.random(-50, 50),
            phase: phaseIdx,
            life: 1,
          });
        }

        // Update particles
        particles = particles.filter((pt) => {
          pt.life -= 0.015;
          pt.y += p.sin(time * 2 + pt.x * 0.05) * 0.8;
          pt.z += 1;
          return pt.life > 0;
        });

        // Update active phase based on rotation
        const normalizedAngle = ((angle % (p.TWO_PI)) + p.TWO_PI) % p.TWO_PI;
        const newActive = Math.floor((normalizedAngle / p.TWO_PI) * 5) % 5;
        setActivePhase(newActive);
      };

      const getPhaseY = (index: number) => p.map(index, 0, 4, -120, 120);

      const drawBasePlatform = (p: p5, time: number) => {
        p.push();
        p.translate(0, 160, 0);
        p.rotateX(p.PI / 2);

        // Grid lines
        p.stroke(100, 100, 150, 40);
        p.strokeWeight(0.5);
        for (let x = -180; x <= 180; x += 30) {
          p.line(x, -180, x, 180);
        }
        for (let y = -180; y <= 180; y += 30) {
          p.line(-180, y, 180, y);
        }

        // Central glow
        p.noStroke();
        for (let i = 5; i > 0; i--) {
          p.fill(139, 92, 246, 8 + i * 5);
          p.ellipse(0, 0, i * 50, i * 50);
        }
        p.pop();
      };

      const drawPhaseLayer = (p: p5, index: number, colorHex: string, time: number) => {
        p.push();
        const yPos = getPhaseY(index);
        p.translate(0, yPos, 0);

        const col = p.color(colorHex);
        const pulse = p.sin(time + index * 0.7) * 8;

        // Hexagonal platform
        p.fill(p.red(col), p.green(col), p.blue(col), 100);
        p.stroke(p.red(col), p.green(col), p.blue(col), 200);
        p.strokeWeight(2);

        p.beginShape();
        for (let i = 0; i < 6; i++) {
          const a = (p.TWO_PI / 6) * i - p.PI / 6;
          const r = 70 + pulse;
          p.vertex(p.cos(a) * r, 0, p.sin(a) * r);
        }
        p.endShape(p.CLOSE);

        // Central glowing orb
        p.push();
        p.translate(0, -25, 0);
        p.noStroke();
        
        // Outer glow
        for (let g = 3; g > 0; g--) {
          p.fill(p.red(col), p.green(col), p.blue(col), 30);
          p.sphere(18 + g * 5 + p.sin(time * 2 + index) * 3);
        }
        
        // Core orb
        p.fill(p.red(col), p.green(col), p.blue(col), 220);
        p.sphere(12 + p.sin(time * 2.5 + index) * 3);

        // Orbital ring
        p.rotateX(time * 0.8 + index);
        p.rotateZ(time * 0.4);
        p.stroke(p.red(col), p.green(col), p.blue(col), 150);
        p.strokeWeight(1.5);
        p.noFill();
        p.ellipse(0, 0, 45, 45);
        p.pop();

        p.pop();
      };

      const drawSpiralConnections = (p: p5, colors: string[], time: number) => {
        p.noFill();
        p.strokeWeight(2);

        for (let phase = 0; phase < 4; phase++) {
          const startY = getPhaseY(phase);
          const endY = getPhaseY(phase + 1);
          const startCol = p.color(colors[phase]);
          const endCol = p.color(colors[phase + 1]);

          p.beginShape();
          for (let t = 0; t <= 1; t += 0.03) {
            const y = p.lerp(startY, endY, t);
            const spiralRadius = 25 * p.sin(t * p.PI);
            const spiralAngle = t * p.TWO_PI * 1.5 + time * 1.5;
            const x = p.cos(spiralAngle) * spiralRadius;
            const z = p.sin(spiralAngle) * spiralRadius;

            const r = p.lerp(p.red(startCol), p.red(endCol), t);
            const g = p.lerp(p.green(startCol), p.green(endCol), t);
            const b = p.lerp(p.blue(startCol), p.blue(endCol), t);
            const alpha = 150 + p.sin(time * 3 + t * p.PI) * 50;
            p.stroke(r, g, b, alpha);

            p.vertex(x, y, z);
          }
          p.endShape();
        }
      };

      const drawParticles = (
        p: p5,
        particles: { x: number; y: number; z: number; phase: number; life: number }[],
        colors: string[]
      ) => {
        particles.forEach((pt) => {
          p.push();
          p.translate(pt.x, pt.y, pt.z);
          const col = p.color(colors[pt.phase]);
          p.noStroke();
          p.fill(p.red(col), p.green(col), p.blue(col), pt.life * 200);
          p.sphere(3 * pt.life + 1);
          p.pop();
        });
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.offsetWidth, 500);
        }
      };
    };

    p5Instance.current = new p5(sketch);
  }, []);

  useEffect(() => {
    initSketch();
    return () => {
      p5Instance.current?.remove();
    };
  }, [initSketch]);

  const handleReset = () => {
    setActivePhase(0);
    initSketch();
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <Card className="p-6 bg-background/80 backdrop-blur-sm border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Calm Magic Process - 2.5D
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualisation interactive du parcours de transformation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="w-full rounded-lg overflow-hidden"
          style={{ minHeight: 500, background: '#0f0f19' }}
        />

        <div className="grid grid-cols-5 gap-2">
          {phases.map((phase, index) => (
            <div
              key={phase.name}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                activePhase === index
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-border/30 bg-background/50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full mb-2"
                style={{ backgroundColor: phase.color }}
              />
              <div className="text-xs font-bold text-foreground">{phase.name}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                {phase.description}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Rotation: {((rotationAngle * 180) / Math.PI % 360).toFixed(0)}° •
          Phase active:{' '}
          <span style={{ color: phases[activePhase].color }}>
            {phases[activePhase].name}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CalmMagic25DVisualization;
