import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface HeroSectionProps {
  onDiscoverFramework?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onDiscoverFramework }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full width/height
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Garden circles and growing nodes
    const gardens: Garden[] = [];
    const growingNodes: GrowingNode[] = [];
    const connections: Connection[] = [];
    
    class Garden {
      x: number;
      y: number;
      baseRadius: number;
      currentRadius: number;
      breathingPhase: number;
      breathingSpeed: number;
      color: string;
      type: string;
      moveSpeed: number;
      targetX: number;
      targetY: number;
      
      constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.baseRadius = 40 + Math.random() * 30;
        this.currentRadius = this.baseRadius;
        this.breathingPhase = Math.random() * Math.PI * 2;
        this.breathingSpeed = 0.02 + Math.random() * 0.01;
        this.type = type;
        this.moveSpeed = 0.5 + Math.random() * 0.3;
        
        // Garden colors from Calm Magic framework
        switch(type) {
          case 'intelligence':
            this.color = '#2563eb'; // blue
            break;
          case 'systems':
            this.color = '#7c3aed'; // purple
            break;
          case 'prototypes':
            this.color = '#db2777'; // pink
            break;
          default:
            this.color = '#6b7280'; // gray
        }
      }
      
      update() {
        // Breathing animation - expand and contract
        this.breathingPhase += this.breathingSpeed;
        const breathingMultiplier = 1 + Math.sin(this.breathingPhase) * 0.3;
        this.currentRadius = this.baseRadius * breathingMultiplier;
        
        // Gentle movement toward target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.x += dx * 0.005;
        this.y += dy * 0.005;
        
        // Occasionally set new target
        if (Math.random() < 0.002) {
          this.targetX = Math.random() * canvas.width;
          this.targetY = Math.random() * canvas.height;
        }
        
        // Keep gardens within bounds
        if (this.x < this.currentRadius) this.targetX = this.currentRadius + 50;
        if (this.x > canvas.width - this.currentRadius) this.targetX = canvas.width - this.currentRadius - 50;
        if (this.y < this.currentRadius) this.targetY = this.currentRadius + 50;
        if (this.y > canvas.height - this.currentRadius) this.targetY = canvas.height - this.currentRadius - 50;
      }
      
      draw() {
        if (!ctx) return;
        
        // Draw garden circle with breathing effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        
        // Create gradient for garden
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.currentRadius
        );
        gradient.addColorStop(0, `${this.color}30`);
        gradient.addColorStop(0.7, `${this.color}20`);
        gradient.addColorStop(1, `${this.color}10`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw garden border
        ctx.strokeStyle = `${this.color}80`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add gentle glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
    
    class GrowingNode {
      x: number;
      y: number;
      size: number;
      maxSize: number;
      growthRate: number;
      color: string;
      type: string;
      life: number;
      maxLife: number;
      alpha: number;
      speedX: number;
      speedY: number;
      
      constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.size = 1;
        this.maxSize = 3 + Math.random() * 4;
        this.growthRate = 0.05 + Math.random() * 0.03;
        this.type = type;
        this.maxLife = 300 + Math.random() * 200;
        this.life = this.maxLife;
        this.alpha = 1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        
        // Node colors from 5-axis compass and process elements
        switch(type) {
          case 'love':
            this.color = '#ef4444'; // red
            break;
          case 'magic':
            this.color = '#8b5cf6'; // violet
            break;
          case 'calm':
            this.color = '#06b6d4'; // cyan
            break;
          case 'open':
            this.color = '#10b981'; // emerald
            break;
          case 'free':
            this.color = '#f59e0b'; // amber
            break;
          case 'insight':
            this.color = '#3b82f6'; // blue
            break;
          case 'connection':
            this.color = '#8b5cf6'; // purple
            break;
          default:
            this.color = '#6b7280'; // gray
        }
      }
      
      update() {
        // Growth phase
        if (this.size < this.maxSize) {
          this.size += this.growthRate;
        }
        
        // Movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Gentle bouncing
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -0.8;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -0.8;
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
        
        // Life cycle
        this.life--;
        this.alpha = this.life / this.maxLife;
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.globalAlpha = this.alpha;
        
        // Draw growing node
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.globalAlpha = 1;
      }
    }
    
    class Connection {
      from: { x: number; y: number };
      to: { x: number; y: number };
      life: number;
      maxLife: number;
      color: string;
      
      constructor(from: { x: number; y: number }, to: { x: number; y: number }, color: string) {
        this.from = { ...from };
        this.to = { ...to };
        this.maxLife = 120 + Math.random() * 100;
        this.life = this.maxLife;
        this.color = color;
      }
      
      update() {
        this.life--;
      }
      
      draw() {
        if (!ctx) return;
        const alpha = this.life / this.maxLife;
        
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.moveTo(this.from.x, this.from.y);
        ctx.lineTo(this.to.x, this.to.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    // Initialize gardens
    const createGardens = () => {
      const gardenTypes = ['intelligence', 'systems', 'prototypes'];
      
      for (let i = 0; i < 3; i++) {
        const x = (canvas.width / 4) + (i * canvas.width / 3);
        const y = canvas.height / 2 + (Math.random() - 0.5) * 200;
        gardens.push(new Garden(x, y, gardenTypes[i]));
      }
    };
    
    // Create growing nodes around gardens
    const spawnGrowingNode = () => {
      if (growingNodes.length > 25) return;
      
      const nodeTypes = ['love', 'magic', 'calm', 'open', 'free', 'insight', 'connection'];
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      
      // Spawn near gardens or randomly
      let x, y;
      if (gardens.length > 0 && Math.random() < 0.7) {
        const garden = gardens[Math.floor(Math.random() * gardens.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = garden.currentRadius + 20 + Math.random() * 50;
        x = garden.x + Math.cos(angle) * distance;
        y = garden.y + Math.sin(angle) * distance;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      }
      
      growingNodes.push(new GrowingNode(x, y, type));
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw gardens
      gardens.forEach(garden => {
        garden.update();
        garden.draw();
      });
      
      // Spawn new growing nodes occasionally
      if (Math.random() < 0.05) {
        spawnGrowingNode();
      }
      
      // Update and draw growing nodes
      for (let i = growingNodes.length - 1; i >= 0; i--) {
        growingNodes[i].update();
        growingNodes[i].draw();
        
        // Remove expired nodes
        if (growingNodes[i].life <= 0) {
          growingNodes.splice(i, 1);
        }
      }
      
      // Create connections between gardens and nodes
      if (Math.random() < 0.03) {
        const garden = gardens[Math.floor(Math.random() * gardens.length)];
        const nearbyNodes = growingNodes.filter(node => {
          const distance = Math.sqrt(
            Math.pow(node.x - garden.x, 2) + Math.pow(node.y - garden.y, 2)
          );
          return distance < garden.currentRadius + 80;
        });
        
        if (nearbyNodes.length > 0) {
          const node = nearbyNodes[Math.floor(Math.random() * nearbyNodes.length)];
          connections.push(new Connection(
            { x: garden.x, y: garden.y },
            { x: node.x, y: node.y },
            garden.color
          ));
        }
      }
      
      // Update and draw connections
      for (let i = connections.length - 1; i >= 0; i--) {
        connections[i].update();
        connections[i].draw();
        
        if (connections[i].life <= 0) {
          connections.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    createGardens();
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Canvas background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
        style={{ opacity: 0.8 }}
      ></canvas>
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Transformation headline */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Get Ready for Transformation
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-6">
              The UX & Product Development Framework for the AI ERA
            </p>
            
            {/* Centered CTA under transformation headline */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={onDiscoverFramework}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Discover Calm Magic
              </Button>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-agent-blue via-agent-purple to-agent-pink animate-gradient-x mb-6">
            Build Your Agentic Ecosystem
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200">
            Design, deploy, and manage interconnected AI agents that work together to solve complex problems
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
