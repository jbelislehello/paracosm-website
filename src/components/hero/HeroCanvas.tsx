
import React, { useEffect, useRef } from "react";
import { createInitialGardens, forces, gardenPhrases, multiGardenPhrases, createNewGarden, drawGardenInternalLogic } from './AgentGardens';
import { ForceNode, ConnectionLine, ConstellationPattern, Garden } from './ForceDynamics';
import { ExpandingCircle, KeyPhrase, Spark, Ripple, FlowParticle } from './VisualEffects';

const HeroCanvas: React.FC = () => {
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

    // Triple-click detection
    let clickCount = 0;
    let clickTimer: number | null = null;
    let gardenCounter = 0;

    const handleTripleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      
      clickCount++;
      
      if (clickCount === 1) {
        clickTimer = window.setTimeout(() => {
          clickCount = 0;
        }, 600); // Reset after 600ms
      } else if (clickCount === 3) {
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        clickCount = 0;
        
        // Create new garden at click position
        const newGarden = createNewGarden(clickX, clickY, gardenCounter);
        gardens.push(newGarden);
        constellationPatterns.push(new ConstellationPattern(newGarden));
        gardenCounter++;
        
        // Visual feedback
        expandingCircles.push(new ExpandingCircle(clickX, clickY, '#10b981', 200));
        keyPhrases.push(new KeyPhrase(clickX, clickY - 50, 'NEW AGENT CREATED', '#10b981'));
      }
    };

    canvas.addEventListener('click', handleTripleClick);

    // Set canvas to full viewport dimensions with proper scaling
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Initialize gardens and arrays
    const gardens = createInitialGardens();
    const forceNodes: ForceNode[] = [];
    const connectionLines: ConnectionLine[] = [];
    const constellationPatterns: ConstellationPattern[] = [];
    const sparks: Spark[] = [];
    const ripples: Ripple[] = [];
    const flowParticles: FlowParticle[] = [];
    const expandingCircles: ExpandingCircle[] = [];
    const keyPhrases: KeyPhrase[] = [];

    // Initialize force nodes
    forces.forEach(force => {
      for (let i = 0; i < 6; i++) {
        forceNodes.push(new ForceNode(force));
      }
    });
    
    // Initialize constellation patterns
    gardens.forEach(garden => {
      constellationPatterns.push(new ConstellationPattern(garden));
    });
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Update gardens with enhanced states and expansion logic
      gardens.forEach(garden => {
        garden.pulsePhase += 0.02;
        garden.currentRadius = garden.baseRadius + Math.sin(garden.pulsePhase) * 15;
        garden.glowIntensity = 1 + garden.connectionCount * 0.3;
        
        // Update garden state based on activity
        const currentTime = Date.now();
        if (garden.connectionCount > 0) {
          if (garden.state === 'dormant') garden.state = 'active';
          if (garden.connectionCount >= 3 && garden.state === 'active') garden.state = 'resonating';
        } else {
          if (garden.state !== 'dormant') {
            garden.activityLevel = Math.max(0, garden.activityLevel - 0.05);
            if (garden.activityLevel < 1) garden.state = 'dormant';
          }
        }
        
        // Trigger expanding circles based on garden state and activity
        if (garden.state === 'active' && currentTime - garden.lastExpansionTime > 2000) {
          expandingCircles.push(new ExpandingCircle(garden.x, garden.y, garden.color, 150));
          const phrases = gardenPhrases[garden.key as keyof typeof gardenPhrases] || ['AGENT ACTIVITY', 'NETWORK FORMING', 'CONNECTIONS ACTIVE'];
          const phrase = phrases[Math.floor(Math.random() * phrases.length)];
          keyPhrases.push(new KeyPhrase(garden.x, garden.y - 100, phrase, garden.color));
          garden.lastExpansionTime = currentTime;
        }
        
        if (garden.state === 'resonating' && currentTime - garden.lastExpansionTime > 1500) {
          expandingCircles.push(new ExpandingCircle(garden.x, garden.y, garden.color, 250));
          expandingCircles.push(new ExpandingCircle(garden.x, garden.y, garden.color, 180));
          garden.lastExpansionTime = currentTime;
        }
        
        // Move gardens
        garden.x += garden.velocityX;
        garden.y += garden.velocityY;
        
        // Boundary reflection
        if (garden.x < garden.baseRadius || garden.x > window.innerWidth - garden.baseRadius) {
          garden.velocityX *= -1;
        }
        if (garden.y < garden.baseRadius || garden.y > window.innerHeight - garden.baseRadius) {
          garden.velocityY *= -1;
        }
        
        garden.x = Math.max(garden.baseRadius, Math.min(window.innerWidth - garden.baseRadius, garden.x));
        garden.y = Math.max(garden.baseRadius, Math.min(window.innerHeight - garden.baseRadius, garden.y));
        
        // Reset connection count for this frame
        garden.connectionCount = 0;
      });
      
      // Check for inter-garden resonance with enhanced effects
      let activeGardens = 0;
      gardens.forEach(garden => {
        if (garden.state !== 'dormant') activeGardens++;
      });
      
      for (let i = 0; i < gardens.length; i++) {
        for (let j = i + 1; j < gardens.length; j++) {
          const garden1 = gardens[i];
          const garden2 = gardens[j];
          const dx = garden1.x - garden2.x;
          const dy = garden1.y - garden2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200 && garden1.state !== 'dormant' && garden2.state !== 'dormant') {
            if (Math.random() < 0.02) {
              // Create resonance sparks and expanding circles
              const midX = (garden1.x + garden2.x) / 2;
              const midY = (garden1.y + garden2.y) / 2;
              sparks.push(new Spark(midX, midY, garden1.color));
              sparks.push(new Spark(midX, midY, garden2.color));
              expandingCircles.push(new ExpandingCircle(midX, midY, garden1.color, 300));
              
              // Multi-agent phrases
              if (activeGardens >= 2) {
                const phrase = multiGardenPhrases[Math.floor(Math.random() * multiGardenPhrases.length)];
                keyPhrases.push(new KeyPhrase(midX, midY - 50, phrase, '#ffffff'));
              }
            }
          }
        }
      }
      
      // Update constellation patterns to follow gardens
      constellationPatterns.forEach((pattern, index) => {
        if (index < gardens.length) {
          const garden = gardens[index];
          const deltaX = garden.x - pattern.garden.x;
          const deltaY = garden.y - pattern.garden.y;
          
          pattern.garden.x = garden.x;
          pattern.garden.y = garden.y;
          pattern.garden.connectionCount = garden.connectionCount;
          
          pattern.stars.forEach(star => {
            star.x += deltaX;
            star.y += deltaY;
          });
          
          pattern.update();
        }
      });
      
      // Clear old connection lines
      connectionLines.length = 0;
      
      // Update force nodes
      forceNodes.forEach(node => {
        node.update(gardens, sparks, ripples, flowParticles);
        
        // Create connection lines for attracted nodes
        if (node.isAttracted && node.targetGarden) {
          connectionLines.push(new ConnectionLine(node, node.targetGarden));
        }
      });
      
      // Update and filter all effect arrays
      for (let i = sparks.length - 1; i >= 0; i--) {
        if (!sparks[i].update()) {
          sparks.splice(i, 1);
        }
      }
      
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (!ripples[i].update()) {
          ripples.splice(i, 1);
        }
      }
      
      for (let i = flowParticles.length - 1; i >= 0; i--) {
        if (!flowParticles[i].update()) {
          flowParticles.splice(i, 1);
        }
      }
      
      for (let i = expandingCircles.length - 1; i >= 0; i--) {
        if (!expandingCircles[i].update()) {
          expandingCircles.splice(i, 1);
        }
      }
      
      for (let i = keyPhrases.length - 1; i >= 0; i--) {
        if (!keyPhrases[i].update()) {
          keyPhrases.splice(i, 1);
        }
      }
      
      // Draw all elements in proper order
      constellationPatterns.forEach(pattern => {
        pattern.draw(ctx);
      });
      
      expandingCircles.forEach(circle => {
        circle.draw(ctx);
      });
      
      ripples.forEach(ripple => {
        ripple.draw(ctx);
      });
      
      connectionLines.forEach(line => {
        line.draw(ctx);
      });
      
      flowParticles.forEach(particle => {
        particle.draw(ctx);
      });
      
      // Draw gardens with enhanced effects and internal logic visualization
      gardens.forEach(garden => {
        // Enhanced garden glow based on connections
        ctx.shadowColor = garden.color;
        ctx.shadowBlur = 20 * garden.glowIntensity;
        
        // Magnetic field visualization (subtle)
        if (garden.connectionCount > 0) {
          ctx.globalAlpha = 0.1;
          ctx.strokeStyle = garden.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(garden.x, garden.y, garden.attractionRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        
        // Internal logic visualization based on garden type
        drawGardenInternalLogic(ctx, garden);
        
        // Garden circle
        ctx.beginPath();
        ctx.arc(garden.x, garden.y, garden.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = garden.color + '20';
        ctx.fill();
        
        // Garden center with dynamic intensity
        ctx.beginPath();
        ctx.arc(garden.x, garden.y, garden.currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = garden.color;
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Garden icon
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(garden.icon, garden.x, garden.y + 7);
        
        // Garden name with enhanced visibility during connections
        ctx.fillStyle = garden.color;
        ctx.font = `bold ${12 + garden.connectionCount}px Inter, sans-serif`;
        ctx.fillText(garden.name, garden.x, garden.y - garden.currentRadius - 20);
      });
      
      sparks.forEach(spark => {
        spark.draw(ctx);
      });
      
      forceNodes.forEach(node => {
        node.draw(ctx);
      });
      
      keyPhrases.forEach(phrase => {
        phrase.draw(ctx);
      });
      
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      canvas.removeEventListener('click', handleTripleClick);
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair"
      style={{ 
        zIndex: 1,
        opacity: 1,
        backgroundColor: '#ffffff'
      }}
      aria-hidden="true"
    />
  );
};

export default HeroCanvas;
