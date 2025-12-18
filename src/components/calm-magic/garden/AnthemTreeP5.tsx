import { useEffect, useRef, useState, useCallback } from 'react';
import p5 from 'p5';
import { GardenTheme, GARDEN_THEMES } from '@/data/gardenConnections';

interface TreeMetrics {
  polenCount: number;
  noemsCount: number;
  completedSeasons: number;
  tilesVisited: number;
  coherence: number;
  connections: number;
}

interface AnthemTreeP5Props {
  garden: 'intelligence' | 'systems' | 'prototypes';
  metrics: TreeMetrics;
  activeConnections: string[];
  onRootExtend?: (connectionId: string) => void;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  angle: number;
  noiseOffset: number;
  color: p5.Color;
}

interface Fruit {
  x: number;
  y: number;
  size: number;
  color: p5.Color;
  pulsePhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: p5.Color;
}

const AnthemTreeP5 = ({ garden, metrics, activeConnections, onRootExtend }: AnthemTreeP5Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [isGrowing, setIsGrowing] = useState(true);
  
  const theme = GARDEN_THEMES[garden] || GARDEN_THEMES.intelligence;

  const initSketch = useCallback((p: p5) => {
    let leaves: Leaf[] = [];
    let fruits: Fruit[] = [];
    let particles: Particle[] = [];
    let growthProgress = 0;
    let targetGrowth = 1;
    let time = 0;
    
    const primaryColor = p.color(theme.primaryColor);
    const secondaryColor = p.color(theme.secondaryColor);
    
    // Tree parameters
    const trunkHeight = Math.min(200, 100 + metrics.tilesVisited * 1.5);
    const trunkWidth = Math.min(40, 15 + metrics.coherence * 0.25);
    const branchDepth = Math.min(5, 2 + Math.floor(metrics.completedSeasons));
    const leafCount = Math.min(150, metrics.polenCount);
    const fruitCount = metrics.completedSeasons;
    
    // Generate leaves
    const generateLeaves = () => {
      leaves = [];
      for (let i = 0; i < leafCount; i++) {
        const angle = p.random(p.TWO_PI);
        const radius = p.random(50, 120);
        leaves.push({
          x: p.cos(angle) * radius,
          y: -trunkHeight - 50 + p.sin(angle) * radius * 0.5,
          size: p.random(8, 16),
          angle: p.random(p.TWO_PI),
          noiseOffset: p.random(1000),
          color: p.lerpColor(primaryColor, secondaryColor, p.random()),
        });
      }
    };
    
    // Generate fruits (completed seasons)
    const generateFruits = () => {
      fruits = [];
      const seasonColors = [
        p.color('#f43f5e'), // POLLENS - rose
        p.color('#8b5cf6'), // NOEMS - violet
        p.color('#6366f1'), // POEMS - indigo
        p.color('#06b6d4'), // TOTEMS - cyan
        p.color('#10b981'), // ANTHEMS - emerald
      ];
      
      for (let i = 0; i < fruitCount; i++) {
        const angle = (i / fruitCount) * p.TWO_PI + p.PI / 4;
        const radius = 80;
        fruits.push({
          x: p.cos(angle) * radius,
          y: -trunkHeight - 30 + p.sin(angle) * radius * 0.3,
          size: 18,
          color: seasonColors[i],
          pulsePhase: i * p.TWO_PI / fruitCount,
        });
      }
    };
    
    // Add ambient particles
    const addParticle = () => {
      if (particles.length < 50) {
        particles.push({
          x: p.random(-150, 150),
          y: p.random(-trunkHeight - 150, 50),
          vx: p.random(-0.5, 0.5),
          vy: p.random(-1, -0.2),
          life: 0,
          maxLife: p.random(60, 120),
          color: p.lerpColor(primaryColor, p.color(255, 255, 255, 100), 0.7),
        });
      }
    };

    p.setup = () => {
      const canvas = p.createCanvas(400, 500);
      canvas.parent(containerRef.current!);
      p.noStroke();
      generateLeaves();
      generateFruits();
    };

    p.draw = () => {
      p.clear();
      time += 0.02;
      
      // Growth animation
      if (isGrowing && growthProgress < targetGrowth) {
        growthProgress = p.lerp(growthProgress, targetGrowth, 0.02);
      }
      
      p.translate(p.width / 2, p.height - 50);
      
      // Draw roots
      drawRoots(p, activeConnections, time, trunkWidth);
      
      // Draw trunk with growth
      drawTrunk(p, trunkHeight * growthProgress, trunkWidth, theme, time);
      
      // Draw branches
      if (growthProgress > 0.3) {
        drawBranches(p, branchDepth, trunkHeight * growthProgress, theme, time);
      }
      
      // Draw leaves with flutter
      if (growthProgress > 0.6) {
        drawLeaves(p, leaves, time, growthProgress);
      }
      
      // Draw fruits with pulse
      if (growthProgress > 0.8) {
        drawFruits(p, fruits, time);
      }
      
      // Update and draw particles
      if (p.frameCount % 10 === 0) addParticle();
      updateParticles(p, particles);
      drawParticles(p, particles);
    };

    p.windowResized = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        p.resizeCanvas(Math.min(400, rect.width), 500);
      }
    };
  }, [garden, metrics, activeConnections, theme, isGrowing]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    p5Ref.current = new p5(initSketch);
    
    // Growth animation completes after 3 seconds
    setTimeout(() => setIsGrowing(false), 3000);
    
    return () => {
      p5Ref.current?.remove();
    };
  }, [initSketch]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[500px] flex items-center justify-center"
      style={{ touchAction: 'none' }}
    />
  );
};

// Draw roots extending to connections
function drawRoots(p: p5, connections: string[], time: number, trunkWidth: number) {
  const rootColors: Record<string, string> = {
    tonalli: '#f59e0b',
    n8n: '#10b981',
    'owl-rdf': '#8b5cf6',
    notion: '#64748b',
    lovable: '#f43f5e',
  };
  
  const rootPositions = [
    { x: -100, y: 60 },
    { x: -60, y: 80 },
    { x: 60, y: 80 },
    { x: 100, y: 60 },
    { x: 0, y: 90 },
  ];
  
  connections.forEach((connId, index) => {
    const pos = rootPositions[index % rootPositions.length];
    const color = p.color(rootColors[connId] || '#888888');
    
    p.stroke(color);
    p.strokeWeight(3);
    p.noFill();
    
    // Bezier curve root with wave
    const wave = p.sin(time * 2 + index) * 5;
    p.bezier(
      0, 0,
      pos.x * 0.3, 20 + wave,
      pos.x * 0.6, 40 + wave,
      pos.x, pos.y
    );
    
    // Root tip glow
    p.noStroke();
    p.fill(p.red(color), p.green(color), p.blue(color), 100 + p.sin(time * 3) * 50);
    p.ellipse(pos.x, pos.y, 12, 8);
  });
  
  p.noStroke();
}

// Draw trunk with organic texture
function drawTrunk(p: p5, height: number, width: number, theme: GardenTheme, time: number) {
  const baseColor = p.color(theme.primaryColor);
  const darkColor = p.lerpColor(baseColor, p.color(0), 0.4);
  
  // Main trunk
  p.fill(darkColor);
  p.beginShape();
  
  for (let y = 0; y >= -height; y -= 5) {
    const widthAtY = width * (1 - Math.abs(y) / height * 0.3);
    const noise = p.noise(y * 0.05 + time * 0.5) * 6;
    p.curveVertex(-widthAtY / 2 + noise, y);
  }
  
  for (let y = -height; y <= 0; y += 5) {
    const widthAtY = width * (1 - Math.abs(y) / height * 0.3);
    const noise = p.noise(y * 0.05 + 100 + time * 0.5) * 6;
    p.curveVertex(widthAtY / 2 + noise, y);
  }
  
  p.endShape(p.CLOSE);
  
  // Bark texture lines
  p.stroke(p.lerpColor(darkColor, p.color(0), 0.2));
  p.strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    const x = p.map(i, 0, 8, -width / 3, width / 3);
    const yStart = -height * 0.1;
    const yEnd = -height * 0.9;
    p.line(x + p.noise(i) * 4, yStart, x + p.noise(i + 100) * 4, yEnd);
  }
  p.noStroke();
}

// Draw fractal branches
function drawBranches(p: p5, depth: number, height: number, theme: GardenTheme, time: number) {
  const branchColor = p.lerpColor(p.color(theme.primaryColor), p.color(0), 0.3);
  
  function branch(len: number, angle: number, weight: number, level: number) {
    if (level > depth || len < 10) return;
    
    p.stroke(branchColor);
    p.strokeWeight(weight);
    
    const wave = p.sin(time + level) * 2;
    p.line(0, 0, wave, -len);
    p.translate(wave, -len);
    
    p.push();
    p.rotate(angle + p.sin(time * 0.5 + level) * 0.1);
    branch(len * 0.7, angle, weight * 0.7, level + 1);
    p.pop();
    
    p.push();
    p.rotate(-angle + p.sin(time * 0.5 + level) * 0.1);
    branch(len * 0.7, angle, weight * 0.7, level + 1);
    p.pop();
  }
  
  p.push();
  p.translate(0, -height);
  branch(height * 0.3, p.PI / 5, 6, 0);
  p.pop();
  
  p.noStroke();
}

// Draw leaves with flutter animation
function drawLeaves(p: p5, leaves: Leaf[], time: number, growth: number) {
  leaves.forEach(leaf => {
    const flutter = p.noise(leaf.noiseOffset + time) * 10;
    const x = leaf.x + flutter;
    const y = leaf.y + p.sin(time * 2 + leaf.noiseOffset) * 3;
    
    p.push();
    p.translate(x, y);
    p.rotate(leaf.angle + p.sin(time + leaf.noiseOffset) * 0.2);
    
    // Leaf shape
    p.fill(leaf.color);
    p.beginShape();
    p.vertex(0, -leaf.size / 2);
    p.bezierVertex(leaf.size / 2, -leaf.size / 4, leaf.size / 2, leaf.size / 4, 0, leaf.size / 2);
    p.bezierVertex(-leaf.size / 2, leaf.size / 4, -leaf.size / 2, -leaf.size / 4, 0, -leaf.size / 2);
    p.endShape(p.CLOSE);
    
    p.pop();
  });
}

// Draw fruits with pulsing glow
function drawFruits(p: p5, fruits: Fruit[], time: number) {
  fruits.forEach(fruit => {
    const pulse = 1 + p.sin(time * 3 + fruit.pulsePhase) * 0.1;
    const size = fruit.size * pulse;
    
    // Glow
    const glowColor = p.color(p.red(fruit.color), p.green(fruit.color), p.blue(fruit.color), 50);
    p.fill(glowColor);
    p.ellipse(fruit.x, fruit.y, size * 2, size * 2);
    
    // Fruit
    p.fill(fruit.color);
    p.ellipse(fruit.x, fruit.y, size, size);
    
    // Highlight
    p.fill(255, 255, 255, 100);
    p.ellipse(fruit.x - size * 0.2, fruit.y - size * 0.2, size * 0.3, size * 0.3);
  });
}

// Update particle positions
function updateParticles(p: p5, particles: Particle[]) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;
    
    if (particle.life > particle.maxLife) {
      particles.splice(i, 1);
    }
  }
}

// Draw particles
function drawParticles(p: p5, particles: Particle[]) {
  particles.forEach(particle => {
    const alpha = p.map(particle.life, 0, particle.maxLife, 255, 0);
    p.fill(p.red(particle.color), p.green(particle.color), p.blue(particle.color), alpha);
    p.ellipse(particle.x, particle.y, 4, 4);
  });
}

export default AnthemTreeP5;
