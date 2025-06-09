
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
    
    // Energetic axes data
    const energeticAxes = [
      { key: 'love', name: 'LOVE', color: '#ef4444', angle: 0 }, // top
      { key: 'magic', name: 'MAGIC', color: '#8b5cf6', angle: Math.PI / 2 }, // right
      { key: 'calm', name: 'CALM', color: '#06b6d4', angle: Math.PI }, // bottom
      { key: 'open', name: 'OPEN', color: '#10b981', angle: (3 * Math.PI) / 2 }, // left
      { key: 'free', name: 'FREE', color: '#f59e0b', angle: 0 } // center, moving
    ];

    // Energy centers, flowing particles, and sacred geometry
    const energyCenters: EnergyCenter[] = [];
    const flowingParticles: FlowingParticle[] = [];
    const sacredPatterns: SacredPattern[] = [];
    const poetryTexts: PoetryText[] = [];
    
    class EnergyCenter {
      x: number;
      y: number;
      baseRadius: number;
      currentRadius: number;
      pulsePhase: number;
      pulseSpeed: number;
      color: string;
      name: string;
      type: string;
      glowIntensity: number;
      orbitAngle: number;
      orbitRadius: number;
      orbitSpeed: number;
      centerX: number;
      centerY: number;
      
      constructor(x: number, y: number, type: string, name: string, color: string, isOrbiting = true) {
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.x = x;
        this.y = y;
        this.baseRadius = isOrbiting ? 30 + Math.random() * 20 : 60;
        this.currentRadius = this.baseRadius;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.015;
        this.color = color;
        this.name = name;
        this.type = type;
        this.glowIntensity = 0.8 + Math.random() * 0.4;
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.orbitRadius = isOrbiting ? 120 + Math.random() * 100 : 0;
        this.orbitSpeed = isOrbiting ? 0.008 + Math.random() * 0.004 : 0;
      }
      
      update() {
        // Pulsing/breathing animation
        this.pulsePhase += this.pulseSpeed;
        const pulseMultiplier = 1 + Math.sin(this.pulsePhase) * 0.3;
        this.currentRadius = this.baseRadius * pulseMultiplier;
        this.glowIntensity = 0.6 + Math.sin(this.pulsePhase) * 0.4;
        
        // Orbital movement for axis centers
        if (this.orbitRadius > 0) {
          this.orbitAngle += this.orbitSpeed;
          this.x = this.centerX + Math.cos(this.orbitAngle) * this.orbitRadius;
          this.y = this.centerY + Math.sin(this.orbitAngle) * this.orbitRadius;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        // Draw energy field with multiple layers
        for (let i = 3; i >= 1; i--) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.currentRadius * i * 0.6, 0, Math.PI * 2);
          
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.currentRadius * i * 0.6
          );
          
          const alpha = (this.glowIntensity / i) * 0.3;
          gradient.addColorStop(0, `${this.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(0.5, `${this.color}${Math.floor(alpha * 0.5 * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${this.color}00`);
          
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        
        // Core energy center
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20 * this.glowIntensity;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Energy name
        if (this.name !== 'FREE') {
          ctx.fillStyle = `${this.color}CC`;
          ctx.font = `${12 + Math.sin(this.pulsePhase) * 2}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(this.name, this.x, this.y - this.currentRadius - 15);
        }
      }
    }
    
    class FlowingParticle {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      life: number;
      maxLife: number;
      alpha: number;
      spiralRadius: number;
      spiralAngle: number;
      spiralSpeed: number;
      centerX: number;
      centerY: number;
      trail: Array<{x: number; y: number; alpha: number}>;
      
      constructor(centerX: number, centerY: number, color: string) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.spiralRadius = 50 + Math.random() * 200;
        this.spiralAngle = Math.random() * Math.PI * 2;
        this.spiralSpeed = 0.02 + Math.random() * 0.02;
        this.x = centerX + Math.cos(this.spiralAngle) * this.spiralRadius;
        this.y = centerY + Math.sin(this.spiralAngle) * this.spiralRadius;
        this.size = 1 + Math.random() * 3;
        this.color = color;
        this.speed = 0.5 + Math.random() * 1;
        this.angle = Math.random() * Math.PI * 2;
        this.maxLife = 300 + Math.random() * 200;
        this.life = this.maxLife;
        this.alpha = 1;
        this.trail = [];
      }
      
      update() {
        // Clockwise spiral movement for FREE energy
        this.spiralAngle += this.spiralSpeed;
        this.spiralRadius += Math.sin(this.spiralAngle * 3) * 0.5;
        
        // Update position
        this.x = this.centerX + Math.cos(this.spiralAngle) * this.spiralRadius;
        this.y = this.centerY + Math.sin(this.spiralAngle) * this.spiralRadius;
        
        // Add to trail
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > 10) {
          this.trail.shift();
        }
        
        // Life cycle
        this.life--;
        this.alpha = this.life / this.maxLife;
        
        // Update trail alpha
        this.trail.forEach((point, index) => {
          point.alpha = (index / this.trail.length) * this.alpha;
        });
      }
      
      draw() {
        if (!ctx) return;
        
        // Draw trail
        this.trail.forEach((point, index) => {
          if (index < this.trail.length - 1) {
            ctx.globalAlpha = point.alpha * 0.6;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.size * (index / this.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
          }
        });
        
        // Draw main particle
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.globalAlpha = 1;
      }
    }
    
    class SacredPattern {
      x: number;
      y: number;
      radius: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      alpha: number;
      type: string;
      pulsePhase: number;
      
      constructor(x: number, y: number, type: string, color: string) {
        this.x = x;
        this.y = y;
        this.radius = 80 + Math.random() * 60;
        this.rotation = 0;
        this.rotationSpeed = 0.005 + Math.random() * 0.01;
        this.color = color;
        this.alpha = 0.2 + Math.random() * 0.3;
        this.type = type;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      
      update() {
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.01;
        this.alpha = 0.2 + Math.sin(this.pulsePhase) * 0.2;
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        
        if (this.type === 'mandala') {
          // Draw mandala pattern
          const points = 8;
          for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * this.radius, Math.sin(angle) * this.radius);
            ctx.stroke();
            
            // Add circles at each point
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * this.radius * 0.7, Math.sin(angle) * this.radius * 0.7, 5, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (this.type === 'spiral') {
          // Draw golden spiral
          ctx.beginPath();
          for (let i = 0; i < 100; i++) {
            const angle = i * 0.3;
            const radius = i * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }
    
    class PoetryText {
      x: number;
      y: number;
      text: string;
      life: number;
      maxLife: number;
      alpha: number;
      color: string;
      size: number;
      driftX: number;
      driftY: number;
      
      constructor(x: number, y: number, text: string, color: string) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.maxLife = 400 + Math.random() * 200;
        this.life = this.maxLife;
        this.alpha = 0;
        this.color = color;
        this.size = 11 + Math.random() * 3;
        this.driftX = (Math.random() - 0.5) * 0.2;
        this.driftY = -0.1 - Math.random() * 0.2;
      }
      
      update() {
        this.life--;
        this.x += this.driftX;
        this.y += this.driftY;
        
        // Fade in and out
        const fadeInDuration = this.maxLife * 0.3;
        const fadeOutDuration = this.maxLife * 0.4;
        
        if (this.life > this.maxLife - fadeInDuration) {
          this.alpha = (this.maxLife - this.life) / fadeInDuration;
        } else if (this.life < fadeOutDuration) {
          this.alpha = this.life / fadeOutDuration;
        } else {
          this.alpha = 1;
        }
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
    
    // Poetry phrases for the energetic axes
    const poetryPhrases = [
      "Love ignites...", "Aliveness flows...", "Hearts connect...",
      "Magic unfolds...", "Spaciousness opens...", "Intuition whispers...",
      "Calm centers...", "Wholeness emerges...", "Ground stabilizes...",
      "Open transforms...", "Change dances...", "Originality blooms...",
      "Freedom spirals...", "Integration weaves...", "Neurogenesis sparks...",
      "Energy moves...", "Consciousness expands...", "Sacred geometry forms...",
      "Wisdom crystallizes...", "Harmony resonates...", "Creation breathes..."
    ];
    
    // Initialize energy centers
    const initializeEnergyCenters = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Central heart center
      energyCenters.push(new EnergyCenter(centerX, centerY, 'heart', 'HEART', '#ffffff', false));
      
      // Four cardinal axes orbiting the center
      energeticAxes.slice(0, 4).forEach((axis, index) => {
        const angle = (index * Math.PI) / 2;
        const x = centerX + Math.cos(angle) * 150;
        const y = centerY + Math.sin(angle) * 150;
        energyCenters.push(new EnergyCenter(x, y, axis.key, axis.name, axis.color));
      });
    };
    
    // Spawn flowing particles (FREE energy)
    const spawnFlowingParticle = () => {
      if (flowingParticles.length > 30) return;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const colors = ['#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      flowingParticles.push(new FlowingParticle(centerX, centerY, color));
    };
    
    // Spawn sacred patterns
    const spawnSacredPattern = () => {
      if (sacredPatterns.length > 8) return;
      
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const types = ['mandala', 'spiral'];
      const type = types[Math.floor(Math.random() * types.length)];
      const colors = ['#ef444420', '#8b5cf620', '#06b6d420', '#10b98120', '#f59e0b20'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      sacredPatterns.push(new SacredPattern(x, y, type, color));
    };
    
    // Spawn poetry text
    const spawnPoetryText = () => {
      if (poetryTexts.length > 8) return;
      
      const phrase = poetryPhrases[Math.floor(Math.random() * poetryPhrases.length)];
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const colors = ['#ef444460', '#8b5cf660', '#06b6d460', '#10b98160', '#f59e0b60'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      poetryTexts.push(new PoetryText(x, y, phrase, color));
    };
    
    // Create energy connections between centers
    const drawEnergyConnections = () => {
      if (!ctx || energyCenters.length < 2) return;
      
      const heartCenter = energyCenters[0];
      
      // Draw connections from heart to all axes
      energyCenters.slice(1).forEach((center, index) => {
        const gradient = ctx.createLinearGradient(
          heartCenter.x, heartCenter.y,
          center.x, center.y
        );
        gradient.addColorStop(0, `${heartCenter.color}40`);
        gradient.addColorStop(1, `${center.color}40`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 + Math.sin(Date.now() * 0.003 + index) * 1;
        ctx.globalAlpha = 0.6;
        
        ctx.beginPath();
        ctx.moveTo(heartCenter.x, heartCenter.y);
        ctx.lineTo(center.x, center.y);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
      });
    };
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Create cosmic background
      const gradient = ctx.createRadialGradient(
        window.innerWidth / 2, window.innerHeight / 2, 0,
        window.innerWidth / 2, window.innerHeight / 2, Math.max(window.innerWidth, window.innerHeight)
      );
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#020617');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Spawn elements
      if (Math.random() < 0.08) spawnFlowingParticle();
      if (Math.random() < 0.02) spawnSacredPattern();
      if (Math.random() < 0.015) spawnPoetryText();
      
      // Update and draw sacred patterns
      for (let i = sacredPatterns.length - 1; i >= 0; i--) {
        sacredPatterns[i].update();
        sacredPatterns[i].draw();
        
        if (sacredPatterns[i].alpha <= 0) {
          sacredPatterns.splice(i, 1);
        }
      }
      
      // Draw energy connections
      drawEnergyConnections();
      
      // Update and draw energy centers
      energyCenters.forEach(center => {
        center.update();
        center.draw();
      });
      
      // Update and draw flowing particles
      for (let i = flowingParticles.length - 1; i >= 0; i--) {
        flowingParticles[i].update();
        flowingParticles[i].draw();
        
        if (flowingParticles[i].life <= 0) {
          flowingParticles.splice(i, 1);
        }
      }
      
      // Update and draw poetry texts
      for (let i = poetryTexts.length - 1; i >= 0; i--) {
        poetryTexts[i].update();
        poetryTexts[i].draw();
        
        if (poetryTexts[i].life <= 0) {
          poetryTexts.splice(i, 1);
        }
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    initializeEnergyCenters();
    spawnSacredPattern();
    spawnSacredPattern();
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
      {/* Energetic background canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ 
          zIndex: 1,
          opacity: 1
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
