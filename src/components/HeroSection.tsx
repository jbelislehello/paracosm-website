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

    // Set canvas to full page dimensions
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Gardens, nodes, connections and story text
    const gardens: Garden[] = [];
    const growingNodes: GrowingNode[] = [];
    const connections: Connection[] = [];
    const storyTexts: StoryText[] = [];
    
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
      verticalDirection: number;
      verticalSpeed: number;
      name: string;
      
      constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.baseRadius = 80 + Math.random() * 60; // Much larger gardens
        this.currentRadius = this.baseRadius;
        this.breathingPhase = Math.random() * Math.PI * 2;
        this.breathingSpeed = 0.01 + Math.random() * 0.005;
        this.type = type;
        this.moveSpeed = 0.3 + Math.random() * 0.2;
        this.verticalDirection = Math.random() > 0.5 ? 1 : -1;
        this.verticalSpeed = 0.2 + Math.random() * 0.3;
        
        // Garden colors and names from Calm Magic framework
        switch(type) {
          case 'intelligence':
            this.color = '#2563eb';
            this.name = 'Garden of Intelligence';
            break;
          case 'systems':
            this.color = '#7c3aed';
            this.name = 'Garden of Systems';
            break;
          case 'prototypes':
            this.color = '#db2777';
            this.name = 'Garden of Prototypes';
            break;
          default:
            this.color = '#6b7280';
            this.name = 'Garden of Innovation';
        }
      }
      
      update() {
        // Breathing animation - expand and contract
        this.breathingPhase += this.breathingSpeed;
        const breathingMultiplier = 1 + Math.sin(this.breathingPhase) * 0.4;
        this.currentRadius = this.baseRadius * breathingMultiplier;
        
        // Vertical movement throughout the page
        this.y += this.verticalDirection * this.verticalSpeed;
        
        // Bounce off edges and continue flowing
        if (this.y < -this.currentRadius) {
          this.y = canvas.height + this.currentRadius;
        } else if (this.y > canvas.height + this.currentRadius) {
          this.y = -this.currentRadius;
        }
        
        // Gentle horizontal drift
        this.x += Math.sin(Date.now() * 0.0001 + this.breathingPhase) * 0.3;
        
        // Keep within horizontal bounds
        if (this.x < this.currentRadius) this.x = this.currentRadius;
        if (this.x > canvas.width - this.currentRadius) this.x = canvas.width - this.currentRadius;
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
        gradient.addColorStop(0, `${this.color}20`);
        gradient.addColorStop(0.5, `${this.color}15`);
        gradient.addColorStop(1, `${this.color}05`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw garden border with pulsing effect
        ctx.strokeStyle = `${this.color}60`;
        ctx.lineWidth = 3 + Math.sin(this.breathingPhase) * 1;
        ctx.stroke();
        
        // Add gentle glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20 + Math.sin(this.breathingPhase) * 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw garden name
        ctx.fillStyle = `${this.color}80`;
        ctx.font = `${16 + Math.sin(this.breathingPhase) * 2}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - this.currentRadius - 20);
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
      parentGarden: Garden | null;
      orbitAngle: number;
      orbitRadius: number;
      orbitSpeed: number;
      
      constructor(x: number, y: number, type: string, parentGarden?: Garden) {
        this.x = x;
        this.y = y;
        this.size = 1;
        this.maxSize = 4 + Math.random() * 6;
        this.growthRate = 0.03 + Math.random() * 0.02;
        this.type = type;
        this.maxLife = 400 + Math.random() * 300;
        this.life = this.maxLife;
        this.alpha = 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.parentGarden = parentGarden || null;
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.orbitRadius = 50 + Math.random() * 100;
        this.orbitSpeed = 0.005 + Math.random() * 0.01;
        
        // Node colors from Calm Magic process
        switch(type) {
          case 'love':
            this.color = '#ef4444';
            break;
          case 'magic':
            this.color = '#8b5cf6';
            break;
          case 'calm':
            this.color = '#06b6d4';
            break;
          case 'open':
            this.color = '#10b981';
            break;
          case 'free':
            this.color = '#f59e0b';
            break;
          case 'insight':
            this.color = '#3b82f6';
            break;
          case 'connection':
            this.color = '#8b5cf6';
            break;
          case 'transformation':
            this.color = '#db2777';
            break;
          default:
            this.color = '#6b7280';
        }
      }
      
      update() {
        // Growth phase
        if (this.size < this.maxSize) {
          this.size += this.growthRate;
        }
        
        // Orbit around parent garden if exists
        if (this.parentGarden) {
          this.orbitAngle += this.orbitSpeed;
          this.x = this.parentGarden.x + Math.cos(this.orbitAngle) * this.orbitRadius;
          this.y = this.parentGarden.y + Math.sin(this.orbitAngle) * this.orbitRadius;
        } else {
          // Free movement
          this.x += this.speedX;
          this.y += this.speedY;
          
          // Wrap around screen edges
          if (this.x < 0) this.x = canvas.width;
          if (this.x > canvas.width) this.x = 0;
          if (this.y < 0) this.y = canvas.height;
          if (this.y > canvas.height) this.y = 0;
        }
        
        // Life cycle
        this.life--;
        this.alpha = this.life / this.maxLife;
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.globalAlpha = this.alpha;
        
        // Draw growing node with pulsing effect
        const pulseSize = this.size + Math.sin(Date.now() * 0.005) * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
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
        this.maxLife = 180 + Math.random() * 120;
        this.life = this.maxLife;
        this.color = color;
      }
      
      update() {
        this.life--;
      }
      
      draw() {
        if (!ctx) return;
        const alpha = this.life / this.maxLife;
        
        ctx.globalAlpha = alpha * 0.4;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.moveTo(this.from.x, this.from.y);
        ctx.lineTo(this.to.x, this.to.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    class StoryText {
      x: number;
      y: number;
      text: string;
      life: number;
      maxLife: number;
      alpha: number;
      color: string;
      size: number;
      
      constructor(x: number, y: number, text: string, color: string) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.maxLife = 180 + Math.random() * 120;
        this.life = this.maxLife;
        this.alpha = 0;
        this.color = color;
        this.size = 14 + Math.random() * 6;
      }
      
      update() {
        this.life--;
        
        // Fade in and out
        const fadeInDuration = this.maxLife * 0.2;
        const fadeOutDuration = this.maxLife * 0.3;
        
        if (this.life > this.maxLife - fadeInDuration) {
          this.alpha = (this.maxLife - this.life) / fadeInDuration;
        } else if (this.life < fadeOutDuration) {
          this.alpha = this.life / fadeOutDuration;
        } else {
          this.alpha = 1;
        }
        
        // Gentle upward drift
        this.y -= 0.2;
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.globalAlpha = this.alpha * 0.8;
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
      }
    }
    
    // Story phrases for the Calm Magic process
    const storyPhrases = [
      "Ideas crystallize...",
      "Systems emerge...",
      "Prototypes bloom...",
      "Insights flow...",
      "Connections form...",
      "Innovation grows...",
      "Transformation begins...",
      "Love guides creation...",
      "Magic sparks possibility...",
      "Calm grounds vision...",
      "Openness invites change...",
      "Freedom enables flow...",
      "Gardens of thought...",
      "Seeds of innovation...",
      "Roots of understanding...",
      "Branches of possibility...",
      "Fruits of creation..."
    ];
    
    // Initialize gardens across the full canvas
    const createGardens = () => {
      const gardenTypes = ['intelligence', 'systems', 'prototypes'];
      
      for (let i = 0; i < 4; i++) { // More gardens for full page
        const x = (canvas.width / 5) + (i * canvas.width / 4);
        const y = Math.random() * canvas.height;
        const type = gardenTypes[i % gardenTypes.length];
        gardens.push(new Garden(x, y, type));
      }
    };
    
    // Create growing nodes around gardens and independently
    const spawnGrowingNode = () => {
      if (growingNodes.length > 40) return; // More nodes for richer experience
      
      const nodeTypes = ['love', 'magic', 'calm', 'open', 'free', 'insight', 'connection', 'transformation'];
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      
      let x, y, parentGarden = null;
      
      // 60% chance to spawn near a garden, 40% independent
      if (gardens.length > 0 && Math.random() < 0.6) {
        parentGarden = gardens[Math.floor(Math.random() * gardens.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = parentGarden.currentRadius + 30 + Math.random() * 80;
        x = parentGarden.x + Math.cos(angle) * distance;
        y = parentGarden.y + Math.sin(angle) * distance;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      }
      
      growingNodes.push(new GrowingNode(x, y, type, parentGarden));
    };
    
    // Spawn story text
    const spawnStoryText = () => {
      if (storyTexts.length > 8) return;
      
      const phrase = storyPhrases[Math.floor(Math.random() * storyPhrases.length)];
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const colors = ['#2563eb80', '#7c3aed80', '#db277780', '#ef444480', '#8b5cf680'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      storyTexts.push(new StoryText(x, y, phrase, color));
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
      if (Math.random() < 0.08) {
        spawnGrowingNode();
      }
      
      // Spawn story text occasionally
      if (Math.random() < 0.02) {
        spawnStoryText();
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
      
      // Update and draw story texts
      for (let i = storyTexts.length - 1; i >= 0; i--) {
        storyTexts[i].update();
        storyTexts[i].draw();
        
        if (storyTexts[i].life <= 0) {
          storyTexts.splice(i, 1);
        }
      }
      
      // Create connections between gardens
      if (Math.random() < 0.04) {
        if (gardens.length >= 2) {
          const garden1 = gardens[Math.floor(Math.random() * gardens.length)];
          const garden2 = gardens[Math.floor(Math.random() * gardens.length)];
          if (garden1 !== garden2) {
            connections.push(new Connection(
              { x: garden1.x, y: garden1.y },
              { x: garden2.x, y: garden2.y },
              garden1.color
            ));
          }
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
      {/* Full page canvas background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{ opacity: 0.7 }}
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
