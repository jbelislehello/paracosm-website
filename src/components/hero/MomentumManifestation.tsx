
import React, { useEffect, useRef, useState } from 'react';

interface Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
  energy: number;
}

interface Totem {
  x: number;
  y: number;
  size: number;
  energy: number;
  type: string;
}

const MomentumManifestation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [userInfluence, setUserInfluence] = useState(50);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [totems, setTotems] = useState<Totem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize circles and totems
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Initialize circles
    const initialCircles: Circle[] = [
      {
        x: width * 0.2,
        y: height * 0.3,
        radius: 30,
        color: 'rgba(219, 39, 119, 0.3)',
        dx: 1,
        dy: 0.5,
        energy: 60
      },
      {
        x: width * 0.8,
        y: height * 0.7,
        radius: 25,
        color: 'rgba(124, 58, 237, 0.3)',
        dx: -0.5,
        dy: -1,
        energy: 80
      },
      {
        x: width * 0.5,
        y: height * 0.5,
        radius: 35,
        color: 'rgba(59, 130, 246, 0.3)',
        dx: 0.8,
        dy: 0.3,
        energy: 70
      }
    ];

    // Initialize totems
    const initialTotems: Totem[] = [
      {
        x: width * 0.1,
        y: height * 0.2,
        size: 8,
        energy: 40,
        type: 'love'
      },
      {
        x: width * 0.9,
        y: height * 0.8,
        size: 10,
        energy: 60,
        type: 'magic'
      },
      {
        x: width * 0.3,
        y: height * 0.9,
        size: 6,
        energy: 30,
        type: 'calm'
      },
      {
        x: width * 0.7,
        y: height * 0.1,
        size: 12,
        energy: 80,
        type: 'open'
      }
    ];

    setCircles(initialCircles);
    setTotems(initialTotems);
    setIsInitialized(true);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isInitialized || circles.length === 0 || totems.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const updateAnimation = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update totem positions (attraction to circles)
      setTotems(prevTotems => 
        prevTotems.map(totem => {
          if (circles.length === 0) return totem;
          
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
      setUserInfluence(30 + mouseInfluence * 40);

      // Update circles
      setCircles(prevCircles => 
        prevCircles.map(circle => {
          let newX = circle.x + circle.dx;
          let newY = circle.y + circle.dy;
          
          // Bounce off edges
          if (newX <= circle.radius || newX >= canvas.offsetWidth - circle.radius) {
            circle.dx = -circle.dx;
            newX = circle.x + circle.dx;
          }
          if (newY <= circle.radius || newY >= canvas.offsetHeight - circle.radius) {
            circle.dy = -circle.dy;
            newY = circle.y + circle.dy;
          }
          
          return {
            ...circle,
            x: newX,
            y: newY,
            energy: Math.min(100, circle.energy + (userInfluence * 0.05))
          };
        })
      );

      // Draw circles
      circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.strokeStyle = circle.color.replace('0.3', '0.8');
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw totems
      totems.forEach(totem => {
        ctx.beginPath();
        ctx.arc(totem.x, totem.y, totem.size, 0, Math.PI * 2);
        
        const colors = {
          love: 'rgba(219, 39, 119, 0.8)',
          magic: 'rgba(124, 58, 237, 0.8)', 
          calm: 'rgba(59, 130, 246, 0.8)',
          open: 'rgba(34, 197, 94, 0.8)'
        };
        
        ctx.fillStyle = colors[totem.type as keyof typeof colors] || 'rgba(100, 100, 100, 0.8)';
        ctx.fill();
        
        // Energy glow effect
        const glowRadius = totem.size + (totem.energy / 100) * 10;
        const gradient = ctx.createRadialGradient(totem.x, totem.y, totem.size, totem.x, totem.y, glowRadius);
        gradient.addColorStop(0, colors[totem.type as keyof typeof colors]?.replace('0.8', '0.1') || 'rgba(100, 100, 100, 0.1)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(totem.x, totem.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(updateAnimation);
    };

    updateAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [circles, totems, userInfluence, isInitialized]);

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          Emotional Momentum: {Math.round(userInfluence)}%
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-slate-500 dark:text-slate-400">
          Love → Magic → Calm → Open
        </div>
      </div>
    </div>
  );
};

export default MomentumManifestation;
