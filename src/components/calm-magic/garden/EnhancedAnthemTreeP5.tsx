import { useEffect, useRef, useState, useCallback } from 'react';
import p5 from 'p5';
import { GARDEN_THEMES } from '@/data/gardenConnections';
import { cn } from '@/lib/utils';

interface TreeMetrics {
  polenCount: number;
  noemsCount: number;
  completedSeasons: number;
  tilesVisited: number;
  coherence: number;
  connections: number;
}

interface EnhancedAnthemTreeP5Props {
  garden: 'intelligence' | 'systems' | 'prototypes';
  metrics: TreeMetrics;
  activeConnections: string[];
  onFruitClick?: (seasonIndex: number) => void;
  fullscreen?: boolean;
}

const EnhancedAnthemTreeP5 = ({ 
  garden, 
  metrics, 
  activeConnections, 
  onFruitClick,
  fullscreen = false 
}: EnhancedAnthemTreeP5Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [isGrowing, setIsGrowing] = useState(true);
  const [hoveredFruit, setHoveredFruit] = useState<number | null>(null);
  
  const theme = GARDEN_THEMES[garden];

  const initSketch = useCallback((p: p5) => {
    interface Leaf {
      x: number;
      y: number;
      size: number;
      angle: number;
      noiseOffset: number;
      color: p5.Color;
      fragment?: string;
    }

    interface Fruit {
      x: number;
      y: number;
      size: number;
      color: p5.Color;
      pulsePhase: number;
      seasonIndex: number;
      seasonName: string;
    }

    interface Firefly {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      brightness: number;
      blinkPhase: number;
    }

    interface RootGlow {
      connectionId: string;
      intensity: number;
      targetIntensity: number;
    }
    
    let leaves: Leaf[] = [];
    let fruits: Fruit[] = [];
    let fireflies: Firefly[] = [];
    let rootGlows: RootGlow[] = [];
    let growthProgress = 0;
    let time = 0;
    
    const primaryColor = p.color(theme.primaryColor);
    const secondaryColor = p.color(theme.secondaryColor);
    
    // Dynamic tree parameters based on metrics
    const trunkHeight = Math.min(280, 120 + metrics.tilesVisited * 2.5);
    const trunkWidth = Math.min(50, 18 + metrics.coherence * 0.32);
    const branchDepth = Math.min(6, 2 + Math.floor(metrics.completedSeasons * 0.8));
    const leafCount = Math.min(200, metrics.polenCount * 1.5);
    const fruitCount = metrics.completedSeasons;
    
    const seasonNames = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
    const seasonColors = [
      '#f43f5e', // rose
      '#8b5cf6', // violet
      '#6366f1', // indigo
      '#06b6d4', // cyan
      '#10b981', // emerald
    ];

    // Ground texture patterns by garden type
    const drawGround = () => {
      const groundY = 0;
      
      // Base ground gradient
      for (let i = 0; i < 80; i++) {
        const alpha = p.map(i, 0, 80, 60, 0);
        p.fill(p.red(primaryColor) * 0.3, p.green(primaryColor) * 0.3, p.blue(primaryColor) * 0.3, alpha);
        p.noStroke();
        p.ellipse(0, groundY + i * 0.8, 400 - i * 3, 20);
      }
      
      // Garden-specific ground texture
      if (theme.backgroundType === 'neural') {
        // Neural network nodes
        p.stroke(p.red(primaryColor), p.green(primaryColor), p.blue(primaryColor), 30);
        p.strokeWeight(1);
        for (let i = 0; i < 15; i++) {
          const x1 = p.random(-180, 180);
          const y1 = groundY + p.random(10, 60);
          const x2 = p.random(-180, 180);
          const y2 = groundY + p.random(10, 60);
          p.line(x1, y1, x2, y2);
          p.noStroke();
          p.fill(p.red(primaryColor), p.green(primaryColor), p.blue(primaryColor), 50);
          p.ellipse(x1, y1, 6, 6);
        }
      } else if (theme.backgroundType === 'mechanical') {
        // Circuit traces
        p.stroke(p.red(primaryColor), p.green(primaryColor), p.blue(primaryColor), 25);
        p.strokeWeight(2);
        p.noFill();
        for (let i = 0; i < 8; i++) {
          const startX = p.random(-150, 150);
          p.beginShape();
          p.vertex(startX, groundY + 15);
          p.vertex(startX, groundY + 30);
          p.vertex(startX + p.random(-30, 30), groundY + 30);
          p.vertex(startX + p.random(-30, 30), groundY + 50);
          p.endShape();
        }
      } else {
        // Greenhouse soil/grass
        for (let i = 0; i < 40; i++) {
          const x = p.random(-180, 180);
          const height = p.random(5, 15);
          p.stroke(34, 197, 94, 40);
          p.strokeWeight(1);
          p.line(x, groundY + 5, x + p.random(-3, 3), groundY + 5 - height);
        }
      }
      p.noStroke();
    };

    // Generate leaves with optional fragment text
    const generateLeaves = () => {
      leaves = [];
      for (let i = 0; i < leafCount; i++) {
        const angle = p.random(p.TWO_PI);
        const radius = p.random(60, 150);
        leaves.push({
          x: p.cos(angle) * radius,
          y: -trunkHeight - 60 + p.sin(angle) * radius * 0.5,
          size: p.random(10, 20),
          angle: p.random(p.TWO_PI),
          noiseOffset: p.random(1000),
          color: p.lerpColor(primaryColor, secondaryColor, p.random()),
        });
      }
    };

    // Generate fruits with season data
    const generateFruits = () => {
      fruits = [];
      for (let i = 0; i < fruitCount; i++) {
        const angle = (i / Math.max(fruitCount, 1)) * p.TWO_PI + p.PI / 4;
        const radius = 100;
        fruits.push({
          x: p.cos(angle) * radius,
          y: -trunkHeight - 40 + p.sin(angle) * radius * 0.35,
          size: 22,
          color: p.color(seasonColors[i]),
          pulsePhase: i * p.TWO_PI / 5,
          seasonIndex: i,
          seasonName: seasonNames[i],
        });
      }
    };

    // Initialize fireflies
    const initFireflies = () => {
      fireflies = [];
      const fireflyCount = garden === 'prototypes' ? 25 : garden === 'intelligence' ? 20 : 15;
      for (let i = 0; i < fireflyCount; i++) {
        fireflies.push({
          x: p.random(-200, 200),
          y: p.random(-trunkHeight - 200, 50),
          vx: p.random(-0.5, 0.5),
          vy: p.random(-0.3, 0.3),
          size: p.random(3, 6),
          brightness: p.random(100, 255),
          blinkPhase: p.random(p.TWO_PI),
        });
      }
    };

    // Initialize root glows
    const initRootGlows = () => {
      rootGlows = activeConnections.map(id => ({
        connectionId: id,
        intensity: 0,
        targetIntensity: 1,
      }));
    };

    p.setup = () => {
      const width = fullscreen ? p.windowWidth : Math.min(500, containerRef.current?.clientWidth || 500);
      const height = fullscreen ? p.windowHeight : 600;
      const canvas = p.createCanvas(width, height);
      canvas.parent(containerRef.current!);
      p.noStroke();
      
      generateLeaves();
      generateFruits();
      initFireflies();
      initRootGlows();
    };

    p.draw = () => {
      p.clear();
      time += 0.015;
      
      // Growth animation
      if (isGrowing && growthProgress < 1) {
        growthProgress = p.lerp(growthProgress, 1, 0.015);
      }
      
      const centerX = p.width / 2;
      const bottomY = p.height - 80;
      
      p.push();
      p.translate(centerX, bottomY);
      
      // Draw atmospheric fog at base
      drawAtmosphericFog(p, time);
      
      // Draw ground
      drawGround();
      
      // Draw roots with glow
      drawEnhancedRoots(p, activeConnections, time, trunkWidth, rootGlows);
      
      // Draw trunk with wind sway
      const windSway = p.sin(time * 0.5) * 3;
      drawEnhancedTrunk(p, trunkHeight * growthProgress, trunkWidth, theme, time, windSway);
      
      // Draw branches with wind
      if (growthProgress > 0.3) {
        drawEnhancedBranches(p, branchDepth, trunkHeight * growthProgress, theme, time, windSway);
      }
      
      // Draw leaves with wind flutter
      if (growthProgress > 0.5) {
        drawEnhancedLeaves(p, leaves, time, growthProgress, windSway);
      }
      
      // Draw fruits with hover effect
      if (growthProgress > 0.75) {
        drawEnhancedFruits(p, fruits, time, hoveredFruit);
      }
      
      // Update and draw fireflies
      updateFireflies(p, fireflies, time);
      drawFireflies(p, fireflies, time, primaryColor);
      
      // Draw light rays through canopy
      if (growthProgress > 0.9) {
        drawLightRays(p, time, trunkHeight);
      }
      
      p.pop();
      
      // Growth celebration burst
      if (growthProgress > 0.99 && growthProgress < 1) {
        celebrationBurst(p, centerX, bottomY - trunkHeight);
      }
    };

    p.mouseClicked = () => {
      // Check if clicking on a fruit
      const centerX = p.width / 2;
      const bottomY = p.height - 80;
      
      fruits.forEach(fruit => {
        const fruitX = centerX + fruit.x;
        const fruitY = bottomY + fruit.y;
        const dist = p.dist(p.mouseX, p.mouseY, fruitX, fruitY);
        
        if (dist < fruit.size) {
          onFruitClick?.(fruit.seasonIndex);
        }
      });
    };

    p.mouseMoved = () => {
      // Check hover on fruits
      const centerX = p.width / 2;
      const bottomY = p.height - 80;
      
      let foundHover = false;
      fruits.forEach(fruit => {
        const fruitX = centerX + fruit.x;
        const fruitY = bottomY + fruit.y;
        const dist = p.dist(p.mouseX, p.mouseY, fruitX, fruitY);
        
        if (dist < fruit.size * 1.5) {
          setHoveredFruit(fruit.seasonIndex);
          foundHover = true;
        }
      });
      
      if (!foundHover) {
        setHoveredFruit(null);
      }
    };

    p.windowResized = () => {
      if (containerRef.current) {
        const width = fullscreen ? p.windowWidth : Math.min(500, containerRef.current.clientWidth);
        const height = fullscreen ? p.windowHeight : 600;
        p.resizeCanvas(width, height);
      }
    };
  }, [garden, metrics, activeConnections, theme, isGrowing, hoveredFruit, onFruitClick, fullscreen]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    p5Ref.current = new p5(initSketch);
    
    // Growth animation completes after 4 seconds
    setTimeout(() => setIsGrowing(false), 4000);
    
    return () => {
      p5Ref.current?.remove();
    };
  }, [initSketch]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "flex items-center justify-center",
        fullscreen ? "fixed inset-0 z-50 bg-background" : "w-full h-[600px]"
      )}
      style={{ touchAction: 'none' }}
    />
  );
};

// Draw atmospheric fog
function drawAtmosphericFog(p: p5, time: number) {
  for (let i = 0; i < 5; i++) {
    const y = 30 + i * 20;
    const alpha = 15 - i * 2;
    const width = 350 + p.sin(time + i) * 20;
    p.fill(255, 255, 255, alpha);
    p.ellipse(0, y, width, 40);
  }
}

// Enhanced roots with glow
function drawEnhancedRoots(p: p5, connections: string[], time: number, trunkWidth: number, rootGlows: any[]) {
  const rootColors: Record<string, string> = {
    tonalli: '#f59e0b',
    n8n: '#10b981',
    'owl-rdf': '#8b5cf6',
    notion: '#64748b',
    lovable: '#f43f5e',
  };
  
  const rootPositions = [
    { x: -120, y: 70 },
    { x: -70, y: 90 },
    { x: 70, y: 90 },
    { x: 120, y: 70 },
    { x: 0, y: 100 },
  ];
  
  connections.forEach((connId, index) => {
    const pos = rootPositions[index % rootPositions.length];
    const color = p.color(rootColors[connId] || '#888888');
    const glowData = rootGlows.find(r => r.connectionId === connId);
    const glowIntensity = glowData?.intensity || 0;
    
    // Animate glow intensity
    if (glowData) {
      glowData.intensity = p.lerp(glowData.intensity, glowData.targetIntensity, 0.05);
    }
    
    // Root glow
    const glowPulse = 0.5 + p.sin(time * 3 + index) * 0.5;
    for (let g = 4; g > 0; g--) {
      p.stroke(p.red(color), p.green(color), p.blue(color), 20 * glowPulse * glowIntensity);
      p.strokeWeight(3 + g * 2);
      p.noFill();
      
      const wave = p.sin(time * 2 + index) * 5;
      p.bezier(
        0, 0,
        pos.x * 0.3, 25 + wave,
        pos.x * 0.65, 50 + wave,
        pos.x, pos.y
      );
    }
    
    // Main root line
    p.stroke(color);
    p.strokeWeight(3);
    p.noFill();
    
    const wave = p.sin(time * 2 + index) * 5;
    p.bezier(
      0, 0,
      pos.x * 0.3, 25 + wave,
      pos.x * 0.65, 50 + wave,
      pos.x, pos.y
    );
    
    // Root tip with pulsing glow
    p.noStroke();
    p.fill(p.red(color), p.green(color), p.blue(color), 60 + p.sin(time * 4 + index) * 40);
    p.ellipse(pos.x, pos.y, 20, 12);
    p.fill(color);
    p.ellipse(pos.x, pos.y, 10, 6);
  });
  
  p.noStroke();
}

// Enhanced trunk with organic texture
function drawEnhancedTrunk(p: p5, height: number, width: number, theme: any, time: number, windSway: number) {
  const baseColor = p.color(theme.primaryColor);
  const darkColor = p.lerpColor(baseColor, p.color(20, 15, 10), 0.6);
  const lightColor = p.lerpColor(baseColor, p.color(60, 50, 40), 0.3);
  
  // Main trunk with taper
  p.fill(darkColor);
  p.beginShape();
  
  for (let y = 0; y >= -height; y -= 4) {
    const progress = Math.abs(y) / height;
    const widthAtY = width * (1 - progress * 0.4) * (1 + p.noise(y * 0.02) * 0.1);
    const sway = windSway * progress * 0.5;
    p.curveVertex(-widthAtY / 2 + sway, y);
  }
  
  for (let y = -height; y <= 0; y += 4) {
    const progress = Math.abs(y) / height;
    const widthAtY = width * (1 - progress * 0.4) * (1 + p.noise(y * 0.02 + 100) * 0.1);
    const sway = windSway * progress * 0.5;
    p.curveVertex(widthAtY / 2 + sway, y);
  }
  
  p.endShape(p.CLOSE);
  
  // Bark texture - vertical lines
  p.stroke(p.lerpColor(darkColor, p.color(0), 0.15));
  p.strokeWeight(1);
  for (let i = 0; i < 12; i++) {
    const x = p.map(i, 0, 11, -width / 2.5, width / 2.5);
    const yStart = -height * 0.05;
    const yEnd = -height * 0.92;
    const sway1 = windSway * 0.2;
    const sway2 = windSway * 0.9;
    p.line(x + sway1, yStart, x + p.noise(i * 10) * 5 + sway2, yEnd);
  }
  
  // Highlight edge
  p.stroke(lightColor);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let y = 0; y >= -height * 0.9; y -= 10) {
    const progress = Math.abs(y) / height;
    const widthAtY = width * (1 - progress * 0.4) * 0.45;
    const sway = windSway * progress * 0.5;
    p.curveVertex(-widthAtY + sway + 2, y);
  }
  p.endShape();
  
  p.noStroke();
}

// Enhanced branches with wind animation
function drawEnhancedBranches(p: p5, depth: number, height: number, theme: any, time: number, windSway: number) {
  const branchColor = p.lerpColor(p.color(theme.primaryColor), p.color(30, 25, 20), 0.4);
  
  function branch(len: number, angle: number, weight: number, level: number, parentSway: number) {
    if (level > depth || len < 12) return;
    
    p.stroke(branchColor);
    p.strokeWeight(weight);
    
    const sway = parentSway + p.sin(time * 0.7 + level * 0.5) * (3 + level);
    const endX = sway * 0.3;
    p.line(0, 0, endX, -len);
    p.translate(endX, -len);
    
    p.push();
    p.rotate(angle + p.sin(time * 0.4 + level) * 0.08);
    branch(len * 0.72, angle * 0.9, weight * 0.7, level + 1, sway);
    p.pop();
    
    p.push();
    p.rotate(-angle + p.sin(time * 0.4 + level + 1) * 0.08);
    branch(len * 0.72, angle * 0.9, weight * 0.7, level + 1, sway);
    p.pop();
  }
  
  p.push();
  p.translate(windSway * 0.3, -height);
  branch(height * 0.35, p.PI / 4.5, 8, 0, windSway);
  p.pop();
  
  p.noStroke();
}

// Enhanced leaves with wind flutter
function drawEnhancedLeaves(p: p5, leaves: any[], time: number, growth: number, windSway: number) {
  leaves.forEach((leaf, i) => {
    const flutter = p.noise(leaf.noiseOffset + time * 0.8) * 15 + windSway * 0.5;
    const x = leaf.x + flutter;
    const y = leaf.y + p.sin(time * 1.5 + leaf.noiseOffset) * 4;
    
    const alpha = p.map(growth, 0.5, 1, 0, 255);
    
    p.push();
    p.translate(x, y);
    p.rotate(leaf.angle + p.sin(time * 0.8 + leaf.noiseOffset) * 0.25);
    
    // Leaf shadow
    p.fill(0, 0, 0, 15);
    p.beginShape();
    p.vertex(2, -leaf.size / 2 + 2);
    p.bezierVertex(leaf.size / 2 + 2, -leaf.size / 4 + 2, leaf.size / 2 + 2, leaf.size / 4 + 2, 2, leaf.size / 2 + 2);
    p.bezierVertex(-leaf.size / 2 + 2, leaf.size / 4 + 2, -leaf.size / 2 + 2, -leaf.size / 4 + 2, 2, -leaf.size / 2 + 2);
    p.endShape(p.CLOSE);
    
    // Main leaf
    p.fill(p.red(leaf.color), p.green(leaf.color), p.blue(leaf.color), alpha);
    p.beginShape();
    p.vertex(0, -leaf.size / 2);
    p.bezierVertex(leaf.size / 2, -leaf.size / 4, leaf.size / 2, leaf.size / 4, 0, leaf.size / 2);
    p.bezierVertex(-leaf.size / 2, leaf.size / 4, -leaf.size / 2, -leaf.size / 4, 0, -leaf.size / 2);
    p.endShape(p.CLOSE);
    
    // Leaf vein
    p.stroke(255, 255, 255, 30);
    p.strokeWeight(0.5);
    p.line(0, -leaf.size / 2 + 2, 0, leaf.size / 2 - 2);
    p.noStroke();
    
    p.pop();
  });
}

// Enhanced fruits with hover and click
function drawEnhancedFruits(p: p5, fruits: any[], time: number, hoveredIndex: number | null) {
  fruits.forEach((fruit, i) => {
    const isHovered = hoveredIndex === fruit.seasonIndex;
    const pulse = 1 + p.sin(time * 2.5 + fruit.pulsePhase) * 0.12;
    const hoverScale = isHovered ? 1.3 : 1;
    const size = fruit.size * pulse * hoverScale;
    
    // Outer glow
    for (let g = 4; g > 0; g--) {
      const glowAlpha = isHovered ? 40 : 25;
      p.fill(p.red(fruit.color), p.green(fruit.color), p.blue(fruit.color), glowAlpha - g * 5);
      p.ellipse(fruit.x, fruit.y, size + g * 8, size + g * 8);
    }
    
    // Main fruit
    p.fill(fruit.color);
    p.ellipse(fruit.x, fruit.y, size, size);
    
    // Highlight
    p.fill(255, 255, 255, 120);
    p.ellipse(fruit.x - size * 0.2, fruit.y - size * 0.2, size * 0.35, size * 0.35);
    
    // Season label on hover
    if (isHovered) {
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(10);
      p.text(fruit.seasonName, fruit.x, fruit.y + size + 12);
    }
  });
}

// Update fireflies
function updateFireflies(p: p5, fireflies: any[], time: number) {
  fireflies.forEach(ff => {
    ff.x += ff.vx + p.sin(time * 2 + ff.blinkPhase) * 0.3;
    ff.y += ff.vy + p.cos(time * 1.5 + ff.blinkPhase) * 0.2;
    
    // Bounce off edges
    if (ff.x < -220 || ff.x > 220) ff.vx *= -1;
    if (ff.y < -350 || ff.y > 80) ff.vy *= -1;
    
    // Blink
    ff.brightness = 100 + p.sin(time * 3 + ff.blinkPhase) * 155;
  });
}

// Draw fireflies
function drawFireflies(p: p5, fireflies: any[], time: number, baseColor: p5.Color) {
  fireflies.forEach(ff => {
    // Glow
    p.fill(p.red(baseColor), p.green(baseColor), p.blue(baseColor), ff.brightness * 0.3);
    p.ellipse(ff.x, ff.y, ff.size * 4, ff.size * 4);
    
    // Core
    p.fill(255, 255, 200, ff.brightness);
    p.ellipse(ff.x, ff.y, ff.size, ff.size);
  });
}

// Light rays through canopy
function drawLightRays(p: p5, time: number, height: number) {
  const rayCount = 5;
  for (let i = 0; i < rayCount; i++) {
    const x = p.map(i, 0, rayCount - 1, -80, 80);
    const alpha = 15 + p.sin(time + i) * 10;
    
    p.fill(255, 255, 200, alpha);
    p.beginShape();
    p.vertex(x - 5, -height - 100);
    p.vertex(x + 5, -height - 100);
    p.vertex(x + 30 + p.sin(time + i) * 10, 50);
    p.vertex(x - 30 + p.sin(time + i) * 10, 50);
    p.endShape(p.CLOSE);
  }
}

// Celebration burst
function celebrationBurst(p: p5, centerX: number, centerY: number) {
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * p.TWO_PI;
    const dist = 50 + p.random(30);
    const x = p.cos(angle) * dist;
    const y = p.sin(angle) * dist;
    
    p.fill(255, 215, 0, 150);
    p.ellipse(centerX + x, centerY + y, 8, 8);
  }
}

export default EnhancedAnthemTreeP5;
