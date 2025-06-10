
/**
 * Force dynamics classes for the hero canvas animation
 */

export interface Garden {
  key: string;
  name: string;
  color: string;
  icon: string;
  x: number;
  y: number;
  baseRadius: number;
  currentRadius: number;
  pulsePhase: number;
  attractionRadius: number;
  velocityX: number;
  velocityY: number;
  connectionCount: number;
  glowIntensity: number;
  state: 'dormant' | 'active' | 'resonating' | 'expanding';
  lastExpansionTime: number;
  activityLevel: number;
}

export class ForceNode {
  x: number;
  y: number;
  size: number;
  color: string;
  name: string;
  velocityX: number;
  velocityY: number;
  targetGarden: Garden | null;
  isAttracted: boolean;
  pulsePhase: number;
  wasAttracted: boolean;
  orbitalAngle: number;
  orbitalRadius: number;
  orbitalSpeed: number;
  
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
    this.wasAttracted = false;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.orbitalAngle = Math.random() * Math.PI * 2;
    this.orbitalRadius = 80 + Math.random() * 50;
    this.orbitalSpeed = 0.01 + Math.random() * 0.02;
  }
  
  update(gardens: Garden[], sparks: any[], ripples: any[], flowParticles: any[]) {
    this.pulsePhase += 0.05;
    this.wasAttracted = this.isAttracted;
    
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
      
      // Generate spark when first attracted
      if (!this.wasAttracted) {
        const { Spark } = require('./VisualEffects');
        sparks.push(new Spark(this.x, this.y, this.color));
        nearestGarden.connectionCount++;
        nearestGarden.activityLevel = Math.min(10, nearestGarden.activityLevel + 1);
        
        // Generate ripple on strong connection
        if (Math.random() < 0.3) {
          const { Ripple } = require('./VisualEffects');
          ripples.push(new Ripple(nearestGarden.x, nearestGarden.y, nearestGarden.color));
        }
      }
      
      // Orbital mechanics around garden
      this.orbitalAngle += this.orbitalSpeed;
      
      // Calculate desired orbital position
      const desiredX = nearestGarden.x + Math.cos(this.orbitalAngle) * this.orbitalRadius;
      const desiredY = nearestGarden.y + Math.sin(this.orbitalAngle) * this.orbitalRadius;
      
      // Apply force towards orbital position
      const dx = desiredX - this.x;
      const dy = desiredY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = 0.003;
      
      if (distance > 0) {
        this.velocityX += (dx / distance) * force;
        this.velocityY += (dy / distance) * force;
      }
      
      // Add flow particles along connection
      if (Math.random() < 0.1) {
        const { FlowParticle } = require('./VisualEffects');
        flowParticles.push(new FlowParticle(this.x, this.y, nearestGarden.x, nearestGarden.y, this.color));
      }
    } else {
      if (this.wasAttracted && this.targetGarden) {
        this.targetGarden.connectionCount = Math.max(0, this.targetGarden.connectionCount - 1);
        this.targetGarden.activityLevel = Math.max(0, this.targetGarden.activityLevel - 0.1);
      }
      this.isAttracted = false;
      this.targetGarden = null;
      
      // Free movement when not attracted
      this.velocityX += (Math.random() - 0.5) * 0.1;
      this.velocityY += (Math.random() - 0.5) * 0.1;
    }
    
    // Apply velocity with damping
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityX *= 0.95;
    this.velocityY *= 0.95;
    
    // Boundary wrapping
    if (this.x < 0) this.x = window.innerWidth;
    if (this.x > window.innerWidth) this.x = 0;
    if (this.y < 0) this.y = window.innerHeight;
    if (this.y > window.innerHeight) this.y = 0;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    const pulseSize = this.size + Math.sin(this.pulsePhase) * 2;
    
    // Enhanced glow effect if attracted
    if (this.isAttracted) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 15 + Math.sin(this.pulsePhase) * 5;
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

export class ConnectionLine {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  alpha: number;
  thickness: number;
  pulsePhase: number;
  
  constructor(node: ForceNode, garden: Garden) {
    this.startX = node.x;
    this.startY = node.y;
    this.endX = garden.x;
    this.endY = garden.y;
    this.color = node.color;
    this.alpha = 0.4;
    this.thickness = 1 + Math.random() * 2;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    this.pulsePhase += 0.1;
    const pulsedAlpha = this.alpha + Math.sin(this.pulsePhase) * 0.2;
    
    ctx.globalAlpha = pulsedAlpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

export class ConstellationPattern {
  garden: Garden;
  stars: Array<{x: number; y: number; alpha: number; phase: number}>;
  
  constructor(garden: Garden) {
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
  
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    // Enhanced constellation lines with garden connection intensity
    const intensity = Math.min(1, this.garden.connectionCount / 3);
    ctx.strokeStyle = this.garden.color + Math.floor(30 + intensity * 40).toString(16);
    ctx.lineWidth = 0.5 + intensity;
    
    for (let i = 0; i < this.stars.length; i++) {
      const star1 = this.stars[i];
      const star2 = this.stars[(i + 1) % this.stars.length];
      
      ctx.globalAlpha = Math.min(star1.alpha, star2.alpha) * intensity;
      ctx.beginPath();
      ctx.moveTo(star1.x, star1.y);
      ctx.lineTo(star2.x, star2.y);
      ctx.stroke();
    }
    
    // Draw stars with enhanced glow
    this.stars.forEach(star => {
      ctx.globalAlpha = star.alpha * intensity;
      ctx.shadowColor = this.garden.color;
      ctx.shadowBlur = 5 + intensity * 10;
      ctx.fillStyle = this.garden.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 1.5 + intensity, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    
    ctx.globalAlpha = 1;
  }
}
