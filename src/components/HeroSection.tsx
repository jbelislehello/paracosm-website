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
    
    // Particle system
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
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.type = type;
        
        // Different colors for different agent types
        switch(type) {
          case 'processor':
            this.color = '#2563eb'; // blue
            break;
          case 'knowledge':
            this.color = '#7c3aed'; // purple
            break;
          case 'action':
            this.color = '#16a34a'; // green
            break;
          default:
            this.color = '#db2777'; // pink
        }
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add a glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
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
        this.maxLife = 100 + Math.random() * 150;
        this.life = this.maxLife;
      }
      
      update() {
        this.life--;
      }
      
      draw() {
        if (!ctx) return;
        const alpha = this.life / this.maxLife;
        
        // Calculate color gradient based on particle types
        const gradient = ctx.createLinearGradient(this.from.x, this.from.y, this.to.x, this.to.y);
        gradient.addColorStop(0, `${this.from.color}${Math.floor(alpha * 99).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${this.to.color}${Math.floor(alpha * 99).toString(16).padStart(2, '0')}`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5 * alpha;
        ctx.moveTo(this.from.x, this.from.y);
        ctx.lineTo(this.to.x, this.to.y);
        ctx.stroke();
      }
    }
    
    // Create initial particles
    const createParticles = () => {
      for (let i = 0; i < 25; i++) {
        const size = 2 + Math.random() * 4;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Create different types of agents
        let type;
        const randomValue = Math.random();
        if (randomValue < 0.3) type = 'processor';
        else if (randomValue < 0.6) type = 'knowledge';
        else if (randomValue < 0.9) type = 'action';
        else type = 'utility';
        
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
      
      // Create new connections occasionally
      if (Math.random() < 0.05 && particles.length > 1) {
        const from = particles[Math.floor(Math.random() * particles.length)];
        const to = particles[Math.floor(Math.random() * particles.length)];
        if (from !== to) {
          connections.push(new Connection(from, to));
        }
      }
      
      // Update and draw connections
      for (let i = connections.length - 1; i >= 0; i--) {
        connections[i].update();
        connections[i].draw();
        
        // Remove dead connections
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
