import { useEffect, useRef } from 'react';
import { ManifoldSeason, SEASON_COLORS } from '@/utils/torusManifoldMath';

interface InformationFluxDiagramProps {
  season: ManifoldSeason;
  currentPosition?: { theta: number; phi: number };
  journeyPath?: Array<{ theta: number; phi: number }>;
}

export function InformationFluxDiagram({
  season,
  currentPosition,
  journeyPath = []
}: InformationFluxDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get colors from CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const mutedForeground = computedStyle.getPropertyValue('--muted-foreground').trim() || '215 20% 65%';
    const primaryColor = computedStyle.getPropertyValue('--primary').trim() || '262 83% 58%';
    
    // Draw outer torus cross-section (donut shape from side view)
    const outerRadius = Math.min(width, height) * 0.4;
    const innerRadius = outerRadius * 0.35;
    const tubeRadius = (outerRadius - innerRadius) / 2;
    const tubeCenterRadius = innerRadius + tubeRadius;
    
    // Draw the two circles representing torus cross-section
    ctx.strokeStyle = `hsl(${mutedForeground})`;
    ctx.lineWidth = 1.5;
    
    // Left tube circle
    ctx.beginPath();
    ctx.arc(centerX - tubeCenterRadius, centerY, tubeRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Right tube circle  
    ctx.beginPath();
    ctx.arc(centerX + tubeCenterRadius, centerY, tubeRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner core (center hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.3)';
    ctx.fill();
    ctx.strokeStyle = `hsl(${mutedForeground})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Labels
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `hsl(${mutedForeground})`;
    
    // Inner Core label
    ctx.fillText('Inner Core', centerX, centerY + 4);
    
    // Top label - Gravity (GL!TCH convergence)
    ctx.fillStyle = 'hsl(280, 70%, 60%)';
    ctx.fillText('↑ GL!TCH', centerX, 20);
    ctx.fillStyle = `hsl(${mutedForeground})`;
    ctx.fillText('(neg-entropic)', centerX, 32);
    
    // Bottom label - Dark Energy (TUNE divergence)
    ctx.fillStyle = 'hsl(45, 90%, 55%)';
    ctx.fillText('↓ TUNE', centerX, height - 20);
    ctx.fillStyle = `hsl(${mutedForeground})`;
    ctx.fillText('(entropic)', centerX, height - 8);
    
    // Draw flow arrows on tubes
    ctx.strokeStyle = `hsl(${primaryColor})`;
    ctx.lineWidth = 1;
    
    // Left tube - upward flow (neg-entropic)
    const drawFlowArrow = (x: number, y: number, direction: 'up' | 'down') => {
      const arrowSize = 6;
      ctx.beginPath();
      if (direction === 'up') {
        ctx.moveTo(x, y + arrowSize);
        ctx.lineTo(x, y - arrowSize);
        ctx.moveTo(x - 4, y - arrowSize + 4);
        ctx.lineTo(x, y - arrowSize);
        ctx.lineTo(x + 4, y - arrowSize + 4);
      } else {
        ctx.moveTo(x, y - arrowSize);
        ctx.lineTo(x, y + arrowSize);
        ctx.moveTo(x - 4, y + arrowSize - 4);
        ctx.lineTo(x, y + arrowSize);
        ctx.lineTo(x + 4, y + arrowSize - 4);
      }
      ctx.stroke();
    };
    
    // Flow arrows on left tube (going up)
    ctx.strokeStyle = 'hsl(280, 70%, 60%)';
    drawFlowArrow(centerX - tubeCenterRadius, centerY - tubeRadius * 0.5, 'up');
    drawFlowArrow(centerX - tubeCenterRadius, centerY + tubeRadius * 0.5, 'up');
    
    // Flow arrows on right tube (going down)
    ctx.strokeStyle = 'hsl(45, 90%, 55%)';
    drawFlowArrow(centerX + tubeCenterRadius, centerY - tubeRadius * 0.5, 'down');
    drawFlowArrow(centerX + tubeCenterRadius, centerY + tubeRadius * 0.5, 'down');
    
    // Draw current position if provided
    if (currentPosition) {
      const seasonColor = SEASON_COLORS[season];
      
      // Map position to diagram coordinates
      const posAngle = currentPosition.phi;
      const posRadius = tubeCenterRadius;
      const side = currentPosition.theta < Math.PI ? -1 : 1;
      
      const posX = centerX + side * (tubeCenterRadius + Math.cos(posAngle) * tubeRadius * 0.8);
      const posY = centerY + Math.sin(posAngle) * tubeRadius * 0.8;
      
      // Glowing dot
      ctx.beginPath();
      ctx.arc(posX, posY, 6, 0, Math.PI * 2);
      ctx.fillStyle = seasonColor;
      ctx.fill();
      
      // Outer glow
      ctx.beginPath();
      ctx.arc(posX, posY, 10, 0, Math.PI * 2);
      ctx.strokeStyle = seasonColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw spiral trajectory hint
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = `hsla(${primaryColor}, 0.4)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let t = 0; t < Math.PI * 4; t += 0.1) {
      const spiralRadius = innerRadius * 0.5 + t * 3;
      const x = centerX + Math.cos(t * 3) * spiralRadius * 0.3;
      const y = centerY + Math.sin(t) * spiralRadius * 0.2;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
  }, [season, currentPosition, journeyPath]);
  
  return (
    <div className="p-4 rounded-lg bg-card/50 border border-border/50">
      <h4 className="text-sm font-semibold mb-3">Information Flux</h4>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={240} 
          height={200}
          className="w-full h-auto"
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 text-center">
        Toroidal dipole flow showing GL!TCH↔TUNE cycle
      </p>
    </div>
  );
}
