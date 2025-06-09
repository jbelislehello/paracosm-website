
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
    
    // Particle system for Calm Magic process
    const particles: Particle[] = [];
    const connections: Connection[] = [];
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      type: string;
      
      constructor(x: number, y: number, size: number, type: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.type = type;
        
        // Calm Magic process colors
        switch(type) {
          case 'intelligence':
            this.color = '#2563eb'; // blue - Garden of Intelligence
            break;
          case 'systems':
            this.color = '#7c3aed'; // purple - Garden of Systems
            break;
          case 'prototypes':
            this.color = '#db2777'; // pink - Garden of Prototypes
            break;
          case 'love':
            this.color = '#ef4444'; // red - Love axis
            break;
          case 'magic':
            this.color = '#8b5cf6'; // violet - Magic axis
            break;
          case 'calm':
            this.color = '#06b6d4'; // cyan - Calm axis
            break;
          case 'open':
            this.color = '#10b981'; // emerald - Open axis
            break;
          case 'free':
            this.color = '#f59e0b'; // amber - Free axis
            break;
          default:
            this.color = '#6b7280'; // gray - Documentation
        }
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges with slight dampening
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -0.8;
          this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY *= -0.8;
          this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add a gentle glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    
    class Connection {
      from: Particle;
      to: Particle;
      life: number;
      maxLife: number;
      
      constructor(from: Particle, to: Particle) {
        this.from = from;
        this.to = to;
        this.maxLife = 120 + Math.random() * 180;
        this.life = this.maxLife;
      }
      
      update() {
        this.life--;
      }
      
      draw() {
        if (!ctx) return;
        const alpha = this.life / this.maxLife;
        
        // Create flowing gradient for process connections
        const gradient = ctx.createLinearGradient(this.from.x, this.from.y, this.to.x, this.to.y);
        gradient.addColorStop(0, `${this.from.color}${Math.floor(alpha * 80).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${this.to.color}${Math.floor(alpha * 80).toString(16).padStart(2, '0')}`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2 * alpha;
        ctx.moveTo(this.from.x, this.from.y);
        ctx.lineTo(this.to.x, this.to.y);
        ctx.stroke();
      }
    }
    
    // Create Calm Magic process particles
    const createParticles = () => {
      const processTypes = [
        'intelligence', 'systems', 'prototypes', // Garden types
        'love', 'magic', 'calm', 'open', 'free', // 5-axis compass
        'documentation' // Process output
      ];
      
      for (let i = 0; i < 20; i++) {
        const size = 2.5 + Math.random() * 3.5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Distribute particle types to show process flow
        let type;
        const randomValue = Math.random();
        if (randomValue < 0.3) {
          // Garden types (30%)
          const gardenTypes = ['intelligence', 'systems', 'prototypes'];
          type = gardenTypes[Math.floor(Math.random() * gardenTypes.length)];
        } else if (randomValue < 0.8) {
          // Compass axes (50%)
          const axisTypes = ['love', 'magic', 'calm', 'open', 'free'];
          type = axisTypes[Math.floor(Math.random() * axisTypes.length)];
        } else {
          // Documentation/output (20%)
          type = 'documentation';
        }
        
        particles.push(new Particle(x, y, size, type));
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Create meaningful connections based on process flow
      if (Math.random() < 0.03 && particles.length > 1) {
        // Prefer connections that make sense in the Calm Magic process
        const gardenParticles = particles.filter(p => ['intelligence', 'systems', 'prototypes'].includes(p.type));
        const compassParticles = particles.filter(p => ['love', 'magic', 'calm', 'open', 'free'].includes(p.type));
        const docParticles = particles.filter(p => p.type === 'documentation');
        
        let from, to;
        
        if (gardenParticles.length > 0 && compassParticles.length > 0 && Math.random() < 0.6) {
          // Garden to compass connection (process flow)
          from = gardenParticles[Math.floor(Math.random() * gardenParticles.length)];
          to = compassParticles[Math.floor(Math.random() * compassParticles.length)];
        } else if (compassParticles.length > 1 && Math.random() < 0.3) {
          // Compass to compass (emotional state integration)
          from = compassParticles[Math.floor(Math.random() * compassParticles.length)];
          to = compassParticles[Math.floor(Math.random() * compassParticles.length)];
        } else if (compassParticles.length > 0 && docParticles.length > 0) {
          // Compass to documentation (output)
          from = compassParticles[Math.floor(Math.random() * compassParticles.length)];
          to = docParticles[Math.floor(Math.random() * docParticles.length)];
        } else {
          // Random connection as fallback
          from = particles[Math.floor(Math.random() * particles.length)];
          to = particles[Math.floor(Math.random() * particles.length)];
        }
        
        if (from !== to) {
          connections.push(new Connection(from, to));
        }
      }
      
      // Update and draw connections
      for (let i = connections.length - 1; i >= 0; i--) {
        connections[i].update();
        connections[i].draw();
        
        // Remove expired connections
        if (connections[i].life <= 0) {
          connections.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    createParticles();
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
