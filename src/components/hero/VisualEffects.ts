
/**
 * Visual effects classes for the hero canvas animation
 */

export class ExpandingCircle {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  expansionSpeed: number;
  lineWidth: number;
  
  constructor(x: number, y: number, color: string, maxRadius: number = 200) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.maxRadius = maxRadius;
    this.color = color;
    this.alpha = 0.8;
    this.expansionSpeed = 2 + Math.random() * 2;
    this.lineWidth = 2;
  }
  
  update() {
    this.radius += this.expansionSpeed;
    this.alpha = Math.max(0, 0.8 * (1 - this.radius / this.maxRadius));
    this.lineWidth = Math.max(0.5, 2 * (1 - this.radius / this.maxRadius));
    return this.radius < this.maxRadius;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    
    // Main expanding circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner circle for depth
    if (this.radius > 30) {
      ctx.globalAlpha = this.alpha * 0.3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  }
}

export class KeyPhrase {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  fontSize: number;
  velocityY: number;
  
  constructor(x: number, y: number, text: string, color: string) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 0;
    this.life = 180; // 3 seconds at 60fps
    this.maxLife = 180;
    this.fontSize = 14;
    this.velocityY = -0.5;
  }
  
  update() {
    this.life--;
    this.y += this.velocityY;
    
    // Fade in for first third, stay visible for middle third, fade out for last third
    if (this.life > this.maxLife * 2/3) {
      this.alpha = (this.maxLife - this.life) / (this.maxLife / 3);
    } else if (this.life > this.maxLife / 3) {
      this.alpha = 1;
    } else {
      this.alpha = this.life / (this.maxLife / 3);
    }
    
    return this.life > 0;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = `bold ${this.fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    
    ctx.fillText(this.text, this.x, this.y);
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

export class Spark {
  x: number;
  y: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
  velocityX: number;
  velocityY: number;
  
  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 1;
    this.maxLife = 30 + Math.random() * 20;
    this.size = 2 + Math.random() * 3;
    this.velocityX = (Math.random() - 0.5) * 2;
    this.velocityY = (Math.random() - 0.5) * 2;
  }
  
  update() {
    this.life--;
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityX *= 0.98;
    this.velocityY *= 0.98;
    return this.life > 0;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

export class Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  
  constructor(x: number, y: number, color: string, maxRadius: number = 200) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = maxRadius;
    this.color = color;
    this.alpha = 0.8;
  }
  
  update() {
    this.radius += 3;
    this.alpha = Math.max(0, 0.8 * (1 - this.radius / this.maxRadius));
    return this.radius < this.maxRadius;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    
    // Main ripple
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Secondary ripple
    if (this.radius > 20) {
      ctx.globalAlpha = this.alpha * 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius - 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  }
}

export class FlowParticle {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  currentX: number;
  currentY: number;
  progress: number;
  color: string;
  size: number;
  
  constructor(startX: number, startY: number, endX: number, endY: number, color: string) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.currentX = startX;
    this.currentY = startY;
    this.progress = 0;
    this.color = color;
    this.size = 2 + Math.random() * 2;
  }
  
  update() {
    this.progress += 0.02;
    this.currentX = this.startX + (this.endX - this.startX) * this.progress;
    this.currentY = this.startY + (this.endY - this.startY) * this.progress;
    return this.progress < 1;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    const alpha = Math.sin(this.progress * Math.PI);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    ctx.arc(this.currentX, this.currentY, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}
