
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface HeroSectionProps {
  onDiscoverFramework?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onDiscoverFramework }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full viewport dimensions with proper scaling
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Garden and force definitions
    const gardens = [
      { 
        key: 'intelligence', 
        name: 'INTELLIGENCE', 
        color: '#2563eb', 
        icon: '🧠',
        x: window.innerWidth * 0.25,
        y: window.innerHeight * 0.35,
        baseRadius: 60,
        currentRadius: 60,
        pulsePhase: 0,
        attractionRadius: 150,
        velocityX: 0.3,
        velocityY: 0.2
      },
      { 
        key: 'systems', 
        name: 'SYSTEMS', 
        color: '#7c3aed', 
        icon: '⚙️',
        x: window.innerWidth * 0.75,
        y: window.innerHeight * 0.35,
        baseRadius: 60,
        currentRadius: 60,
        pulsePhase: Math.PI / 3,
        attractionRadius: 150,
        velocityX: -0.25,
        velocityY: 0.3
      },
      { 
        key: 'prototypes', 
        name: 'PROTOTYPES', 
        color: '#db2777', 
        icon: '🌱',
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.65,
        baseRadius: 60,
        currentRadius: 60,
        pulsePhase: Math.PI * 2 / 3,
        attractionRadius: 150,
        velocityX: 0.2,
        velocityY: -0.25
      }
    ];

    const forces = [
      { key: 'love', name: 'LOVE', color: '#ef4444' },
      { key: 'magic', name: 'MAGIC', color: '#8b5cf6' },
      { key: 'calm', name: 'CALM', color: '#06b6d4' },
      { key: 'open', name: 'OPEN', color: '#10b981' },
      { key: 'free', name: 'FREE', color: '#f59e0b' }
    ];

    // Force nodes array
    const forceNodes: ForceNode[] = [];
    const connectionLines: ConnectionLine[] = [];
    const constellationPatterns: ConstellationPattern[] = [];

    class ForceNode {
      x: number;
      y: number;
      size: number;
      color: string;
      name: string;
      velocityX: number;
      velocityY: number;
      targetGarden: any;
      isAttracted: boolean;
      pulsePhase: number;
      
      constructor(force: any) {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = 4 + Math.random() * 6;
        this.color = force.color;
        this.name = force.name;
        this.velocityX = (Math.random() - 0.5) * 1;
        this.velocityY = (Math.random() - 0.5) * 1;
        this.targetGarden = null;
        this.isAttracted = false;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      
      update() {
        this.pulsePhase += 0.05;
        
        // Find nearest garden for attraction
        let nearestGarden = null;
        let nearestDistance = Infinity;
        
        gardens.forEach(garden => {
          const dx = garden.x - this.x;
          const dy = garden.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < garden.attractionRadius && distance < nearestDistance) {
            nearestGarden = garden;
            nearestDistance = distance;
          }
        });
        
        if (nearestGarden) {
          this.isAttracted = true;
          this.targetGarden = nearestGarden;
          
          // Attraction force
          const dx = nearestGarden.x - this.x;
          const dy = nearestGarden.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force = 0.0008;
          
          this.velocityX += (dx / distance) * force;
          this.velocityY += (dy / distance) * force;
        } else {
          this.isAttracted = false;
          this.targetGarden = null;
        }
        
        // Apply velocity with damping
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityX *= 0.98;
        this.velocityY *= 0.98;
        
        // Boundary wrapping
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
      }
      
      draw() {
        if (!ctx) return;
        
        const pulseSize = this.size + Math.sin(this.pulsePhase) * 2;
        
        // Glow effect if attracted
        if (this.isAttracted) {
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 15;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Label
        if (this.isAttracted) {
          ctx.fillStyle = this.color;
          ctx.font = '8px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(this.name, this.x, this.y - pulseSize - 8);
        }
      }
    }
    
    class ConnectionLine {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
      alpha: number;
      
      constructor(node: ForceNode, garden: any) {
        this.startX = node.x;
        this.startY = node.y;
        this.endX = garden.x;
        this.endY = garden.y;
        this.color = node.color;
        this.alpha = 0.3;
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    class ConstellationPattern {
      garden: any;
      stars: Array<{x: number; y: number; alpha: number; phase: number}>;
      
      constructor(garden: any) {
        this.garden = garden;
        this.stars = [];
        
        // Create star pattern around garden
        const starCount = 8;
        for (let i = 0; i < starCount; i++) {
          const angle = (i / starCount) * Math.PI * 2;
          const radius = garden.baseRadius + 30 + Math.random() * 20;
          this.stars.push({
            x: garden.x + Math.cos(angle) * radius,
            y: garden.y + Math.sin(angle) * radius,
            alpha: 0.5 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
      
      update() {
        this.stars.forEach(star => {
          star.phase += 0.02;
          star.alpha = 0.3 + Math.sin(star.phase) * 0.4;
        });
      }
      
      draw() {
        if (!ctx) return;
        
        // Draw constellation lines
        ctx.strokeStyle = this.garden.color + '30';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.stars.length; i++) {
          const star1 = this.stars[i];
          const star2 = this.stars[(i + 1) % this.stars.length];
          
          ctx.globalAlpha = Math.min(star1.alpha, star2.alpha);
          ctx.beginPath();
          ctx.moveTo(star1.x, star1.y);
          ctx.lineTo(star2.x, star2.y);
          ctx.stroke();
        }
        
        // Draw stars
        this.stars.forEach(star => {
          ctx.globalAlpha = star.alpha;
          ctx.fillStyle = this.garden.color;
          ctx.beginPath();
          ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.globalAlpha = 1;
      }
    }
    
    // Initialize force nodes
    forces.forEach(force => {
      for (let i = 0; i < 6; i++) {
        forceNodes.push(new ForceNode(force));
      }
    });
    
    // Initialize constellation patterns
    gardens.forEach(garden => {
      constellationPatterns.push(new ConstellationPattern(garden));
    });
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Update gardens
      gardens.forEach(garden => {
        garden.pulsePhase += 0.02;
        garden.currentRadius = garden.baseRadius + Math.sin(garden.pulsePhase) * 15;
        
        // Move gardens
        garden.x += garden.velocityX;
        garden.y += garden.velocityY;
        
        // Boundary reflection
        if (garden.x < garden.baseRadius || garden.x > window.innerWidth - garden.baseRadius) {
          garden.velocityX *= -1;
        }
        if (garden.y < garden.baseRadius || garden.y > window.innerHeight - garden.baseRadius) {
          garden.velocityY *= -1;
        }
        
        garden.x = Math.max(garden.baseRadius, Math.min(window.innerWidth - garden.baseRadius, garden.x));
        garden.y = Math.max(garden.baseRadius, Math.min(window.innerHeight - garden.baseRadius, garden.y));
      });
      
      // Update constellation patterns to follow gardens
      constellationPatterns.forEach((pattern, index) => {
        const garden = gardens[index];
        const deltaX = garden.x - pattern.garden.x;
        const deltaY = garden.y - pattern.garden.y;
        
        pattern.garden.x = garden.x;
        pattern.garden.y = garden.y;
        
        pattern.stars.forEach(star => {
          star.x += deltaX;
          star.y += deltaY;
        });
        
        pattern.update();
      });
      
      // Clear old connection lines
      connectionLines.length = 0;
      
      // Update force nodes
      forceNodes.forEach(node => {
        node.update();
        
        // Create connection lines for attracted nodes
        if (node.isAttracted && node.targetGarden) {
          connectionLines.push(new ConnectionLine(node, node.targetGarden));
        }
      });
      
      // Draw constellation patterns
      constellationPatterns.forEach(pattern => {
        pattern.draw();
      });
      
      // Draw connection lines
      connectionLines.forEach(line => {
        line.draw();
      });
      
      // Draw gardens
      gardens.forEach(garden => {
        // Garden glow
        ctx.shadowColor = garden.color;
        ctx.shadowBlur = 20;
        
        // Garden circle
        ctx.beginPath();
        ctx.arc(garden.x, garden.y, garden.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = garden.color + '20';
        ctx.fill();
        
        // Garden center
        ctx.beginPath();
        ctx.arc(garden.x, garden.y, garden.currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = garden.color;
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Garden icon
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(garden.icon, garden.x, garden.y + 7);
        
        // Garden name
        ctx.fillStyle = garden.color;
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(garden.name, garden.x, garden.y - garden.currentRadius - 20);
      });
      
      // Draw force nodes
      forceNodes.forEach(node => {
        node.draw();
      });
      
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* White background canvas with garden dynamics */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ 
          zIndex: 1,
          opacity: 1,
          backgroundColor: '#ffffff'
        }}
        aria-hidden="true"
      ></canvas>
      
      {/* Content with higher z-index */}
      <div className="container relative px-4 py-12 md:py-24" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline with backdrop protection */}
          <div className="backdrop-blur-sm bg-white/10 dark:bg-slate-900/10 rounded-2xl p-8 border border-white/20 relative z-20">
            {/* Product Framework CTA Button - Top Left Corner */}
            <Button 
              onClick={onDiscoverFramework}
              className="absolute -top-2 -left-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 z-30 rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Product Framework</span>
              <span className="sm:hidden">Framework</span>
            </Button>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-agent-blue via-agent-purple to-agent-pink animate-gradient-x mb-6">
              Build Your Agentic Ecosystem
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200">
              Design, deploy, and manage interconnected AI agents that work together to solve complex problems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
