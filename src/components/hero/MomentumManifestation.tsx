
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Totem {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  type: 'love' | 'magic' | 'calm' | 'open';
  congruent: boolean;
  inLight: boolean;
  connected: boolean;
  energy: number;
}

interface Circle {
  x: number;
  y: number;
  radius: number;
  force: string;
  congruent: boolean;
  inLight: boolean;
  totems: Totem[];
}

interface Anthem {
  id: number;
  x: number;
  y: number;
  active: boolean;
  energy: number;
  noems: Poem[];
}

interface Poem {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
  vortexRadius: number;
}

const MomentumManifestation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [totems, setTotems] = useState<Totem[]>([]);
  const [anthems, setAnthems] = useState<Anthem[]>([]);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [userInfluence, setUserInfluence] = useState(0);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initialize concentric circles
    const newCircles: Circle[] = [
      {
        x: canvas.offsetWidth * 0.3,
        y: canvas.offsetHeight * 0.4,
        radius: 80,
        force: 'love',
        congruent: true,
        inLight: true,
        totems: []
      },
      {
        x: canvas.offsetWidth * 0.7,
        y: canvas.offsetHeight * 0.3,
        radius: 100,
        force: 'magic',
        congruent: false,
        inLight: false,
        totems: []
      },
      {
        x: canvas.offsetWidth * 0.5,
        y: canvas.offsetHeight * 0.7,
        radius: 90,
        force: 'calm',
        congruent: true,
        inLight: true,
        totems: []
      },
      {
        x: canvas.offsetWidth * 0.2,
        y: canvas.offsetHeight * 0.8,
        radius: 70,
        force: 'open',
        congruent: false,
        inLight: true,
        totems: []
      }
    ];

    setCircles(newCircles);

    // Initialize totems
    const newTotems: Totem[] = [];
    for (let i = 0; i < 20; i++) {
      newTotems.push({
        id: i,
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        targetX: Math.random() * canvas.offsetWidth,
        targetY: Math.random() * canvas.offsetHeight,
        type: ['love', 'magic', 'calm', 'open'][Math.floor(Math.random() * 4)] as any,
        congruent: Math.random() > 0.5,
        inLight: Math.random() > 0.3,
        connected: false,
        energy: Math.random() * 100
      });
    }

    setTotems(newTotems);
  }, []);

  const drawCircle = (ctx: CanvasRenderingContext2D, circle: Circle) => {
    const { x, y, radius, congruent, inLight } = circle;
    
    // Determine colors based on state
    const baseColor = congruent ? (inLight ? '#4ade80' : '#22c55e') : (inLight ? '#f59e0b' : '#d97706');
    const shadowColor = inLight ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)';
    
    // Draw main circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = inLight ? 3 : 1.5;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = inLight ? 20 : 10;
    ctx.stroke();
    
    // Draw inner rings for depth
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(x, y, radius - (i * 15), 0, Math.PI * 2);
      ctx.strokeStyle = baseColor;
      ctx.globalAlpha = 0.3 - (i * 0.1);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawTotem = (ctx: CanvasRenderingContext2D, totem: Totem) => {
    const { x, y, type, congruent, inLight, energy } = totem;
    
    const colors = {
      love: inLight ? '#ef4444' : '#dc2626',
      magic: inLight ? '#8b5cf6' : '#7c3aed',
      calm: inLight ? '#06b6d4' : '#0891b2',
      open: inLight ? '#f59e0b' : '#d97706'
    };
    
    const size = congruent ? 6 + (energy / 20) : 4 + (energy / 30);
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = colors[type];
    ctx.shadowColor = inLight ? colors[type] : 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = inLight ? 15 : 8;
    ctx.fill();
    
    // Draw energy aura if highly energetic
    if (energy > 70) {
      ctx.beginPath();
      ctx.arc(x, y, size + 4, 0, Math.PI * 2);
      ctx.strokeStyle = colors[type];
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    
    ctx.shadowBlur = 0;
  };

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    totems.forEach((totem1, i) => {
      totems.slice(i + 1).forEach(totem2 => {
        const distance = Math.sqrt(
          Math.pow(totem1.x - totem2.x, 2) + Math.pow(totem1.y - totem2.y, 2)
        );
        
        if (distance < 100 && totem1.energy > 50 && totem2.energy > 50) {
          ctx.beginPath();
          ctx.moveTo(totem1.x, totem1.y);
          ctx.lineTo(totem2.x, totem2.y);
          ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
  };

  const drawAnthems = (ctx: CanvasRenderingContext2D) => {
    anthems.forEach(anthem => {
      if (anthem.active) {
        ctx.beginPath();
        ctx.arc(anthem.x, anthem.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${anthem.energy / 100})`;
        ctx.fill();
        
        // Pulsing effect
        const pulse = Math.sin(Date.now() * 0.01) * 5;
        ctx.beginPath();
        ctx.arc(anthem.x, anthem.y, 25 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  const drawPoems = (ctx: CanvasRenderingContext2D) => {
    poems.forEach(poem => {
      ctx.save();
      ctx.globalAlpha = poem.alpha;
      ctx.fillStyle = '#e879f9';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(poem.text, poem.x, poem.y);
      
      // Vortex effect around poem
      const vortexRadius = poem.vortexRadius;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + Date.now() * 0.001;
        const vx = poem.x + Math.cos(angle) * vortexRadius;
        const vy = poem.y + Math.sin(angle) * vortexRadius;
        
        ctx.beginPath();
        ctx.arc(vx, vy, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 121, 249, 0.5)';
        ctx.fill();
      }
      
      ctx.restore();
    });
  };

  const updateAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Update totem positions (attraction to circles)
    setTotems(prevTotems => 
      prevTotems.map(totem => {
        let closestCircle = circles[0];
        let minDistance = Infinity;
        
        circles.forEach(circle => {
          const distance = Math.sqrt(
            Math.pow(totem.x - circle.x, 2) + Math.pow(totem.y - circle.y, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestCircle = circle;
          }
        });
        
        // Apply attraction force
        const attractionForce = 0.02;
        const dx = closestCircle.x - totem.x;
        const dy = closestCircle.y - totem.y;
        
        return {
          ...totem,
          x: totem.x + dx * attractionForce,
          y: totem.y + dy * attractionForce,
          energy: Math.min(100, totem.energy + (userInfluence * 0.1))
        };
      })
    );

    // Update user influence based on mouse position
    const mouseInfluence = Math.sin(Date.now() * 0.003) * 0.5 + 0.5;
    setUserInfluence(mouseInfluence * 100);

    // Draw everything
    circles.forEach(circle => drawCircle(ctx, circle));
    drawConnections(ctx);
    totems.forEach(totem => drawTotem(ctx, totem));
    drawAnthems(ctx);
    drawPoems(ctx);

    animationRef.current = requestAnimationFrame(updateAnimation);
  }, [circles, totems, anthems, poems, userInfluence]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Influence nearby circles to become more congruent
    setCircles(prevCircles =>
      prevCircles.map(circle => {
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - circle.x, 2) + Math.pow(mousePosition.y - circle.y, 2)
        );
        
        if (distance < 150) {
          return {
            ...circle,
            congruent: true,
            inLight: true
          };
        }
        return circle;
      })
    );
  };

  useEffect(() => {
    initializeCanvas();
    
    const handleResize = () => {
      initializeCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeCanvas]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateAnimation);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateAnimation]);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        style={{ width: '100%', height: '100%' }}
      />
      
      <div className="absolute top-4 left-4 text-white/80 text-sm">
        <p>Hover to influence momentum manifestations</p>
        <p className="text-xs mt-1">
          Light circles: In congruence | Dark circles: Shadow work
        </p>
      </div>
      
      <div className="absolute bottom-4 right-4 text-white/60 text-xs">
        User Influence: {Math.round(userInfluence)}%
      </div>
    </div>
  );
};

export default MomentumManifestation;
