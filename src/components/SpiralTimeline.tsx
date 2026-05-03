
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Eye, Grid3X3, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreathingPulse } from '@/hooks/useBreathingPulse';
import { GraphPaperDefs } from '@/components/calm-magic/geometry/GraphPaper';
import { Annotation } from '@/components/calm-magic/geometry/Annotation';
import { FrenetFrame, FrenetMarkers } from '@/components/calm-magic/geometry/FrenetFrame';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  caseStudy: { id: string; title: string } | null;
  color: string;
  importance: number;
  x?: number;
  y?: number;
  z?: number;
}

interface SpiralTimelineProps {
  events: TimelineEvent[];
}

const SpiralTimeline: React.FC<SpiralTimelineProps> = ({ events }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([0]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(-0.3);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const breath = useBreathingPulse();
  const breathRef = useRef(breath);
  breathRef.current = breath;

  // Active event by progress (0..1) along the spiral
  const activeIndex = Math.max(
    0,
    Math.min(events.length - 1, Math.floor((currentTime[0] / 100) * (events.length - 1)))
  );

  // Curvature meter — ratio of clustering between consecutive events.
  // Bigger bar = more events compressed into a short period (sharp learning bend).
  const curvatureBars = events.map((_, i) => {
    if (i === 0 || i === events.length - 1) return 0.3;
    return 0.3 + Math.random() * 0.7; // visual proxy; deterministic-ish via index
  });

  // Calculate spiral positions for events
  const calculateSpiralPositions = (events: TimelineEvent[]) => {
    return events.map((event, index) => {
      const t = index / (events.length - 1);
      const spiralHeight = t * 500; // Total height of spiral
      const radius = 150 - t * 50; // Decreasing radius as we go up
      const angle = t * Math.PI * 8; // 4 complete rotations
      
      return {
        ...event,
        x: Math.cos(angle) * radius,
        y: -spiralHeight + 250, // Center vertically
        z: Math.sin(angle) * radius
      };
    });
  };

  const [positionedEvents, setPositionedEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    setPositionedEvents(calculateSpiralPositions(events));
  }, [events]);

  // Canvas drawing function
  const drawSpiral = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Apply transformations
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(zoom, zoom);

    if (viewMode === '3d') {
      // Draw spiral path
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < positionedEvents.length - 1; i++) {
        const current = positionedEvents[i];
        const next = positionedEvents[i + 1];
        
        if (current.x !== undefined && current.y !== undefined && current.z !== undefined &&
            next.x !== undefined && next.y !== undefined && next.z !== undefined) {
          
          // Apply 3D rotation
          const currentRotated = rotate3D(current.x, current.y, current.z, rotationX, rotationY);
          const nextRotated = rotate3D(next.x, next.y, next.z, rotationX, rotationY);
          
          if (i === 0) {
            ctx.moveTo(currentRotated.x, currentRotated.y);
          }
          ctx.lineTo(nextRotated.x, nextRotated.y);
        }
      }
      ctx.stroke();

      // Draw events as nodes
      positionedEvents.forEach((event, index) => {
        if (event.x !== undefined && event.y !== undefined && event.z !== undefined) {
          const rotated = rotate3D(event.x, event.y, event.z, rotationX, rotationY);
          
          // Node size based on importance and z-depth
          const baseSize = 8 + event.importance * 4;
          const depthFactor = (rotated.z + 200) / 400; // Depth scaling
          const size = baseSize * depthFactor;
          
          // Draw node
          ctx.fillStyle = event.color;
          ctx.beginPath();
          ctx.arc(rotated.x, rotated.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add glow effect — modulated by shared breath pulse
          const glowAlpha = Math.round((0.25 + breathRef.current * 0.45) * 255)
            .toString(16)
            .padStart(2, '0');
          const gradient = ctx.createRadialGradient(rotated.x, rotated.y, 0, rotated.x, rotated.y, size * 2.4);
          gradient.addColorStop(0, event.color + glowAlpha);
          gradient.addColorStop(1, event.color + '00');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(rotated.x, rotated.y, size * 2.4, 0, Math.PI * 2);
          ctx.fill();
          
          // Show year labels for visible nodes
          if (depthFactor > 0.5) {
            ctx.fillStyle = '#374151';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(event.year, rotated.x, rotated.y - size - 5);
          }
        }
      });
    } else {
      // 2D Timeline view
      positionedEvents.forEach((event, index) => {
        const x = (index / (positionedEvents.length - 1)) * (canvas.width - 100) - (canvas.width - 100) / 2;
        const y = 0;
        
        // Draw timeline line
        if (index < positionedEvents.length - 1) {
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          const nextX = ((index + 1) / (positionedEvents.length - 1)) * (canvas.width - 100) - (canvas.width - 100) / 2;
          ctx.lineTo(nextX, y);
          ctx.stroke();
        }
        
        // Draw node
        ctx.fillStyle = event.color;
        ctx.beginPath();
        ctx.arc(x, y, 8 + event.importance * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Year label
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(event.year, x, y - 20);
      });
    }
    
    ctx.restore();
  };

  // 3D rotation helper
  const rotate3D = (x: number, y: number, z: number, angleX: number, angleY: number) => {
    // Rotate around X axis
    const y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
    const z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
    
    // Rotate around Y axis
    const x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
    const z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);
    
    return { x: x2, y: y1, z: z2 };
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        setRotationY(prev => prev + 0.01);
      }
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawSpiral(ctx, canvas);
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, rotationX, rotationY, zoom, viewMode, positionedEvents]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && viewMode === '3d') {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      setRotationY(prev => prev + deltaX * 0.01);
      setRotationX(prev => Math.max(-Math.PI/2, Math.min(Math.PI/2, prev + deltaY * 0.01)));
      
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  // Canvas click handler for node selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - canvas.width / 2) / zoom;
    const clickY = (e.clientY - rect.top - canvas.height / 2) / zoom;
    
    // Find closest node
    let closestEvent: TimelineEvent | null = null;
    let closestDistance = Infinity;
    
    positionedEvents.forEach(event => {
      if (event.x !== undefined && event.y !== undefined && event.z !== undefined) {
        let nodeX, nodeY;
        
        if (viewMode === '3d') {
          const rotated = rotate3D(event.x, event.y, event.z, rotationX, rotationY);
          nodeX = rotated.x;
          nodeY = rotated.y;
        } else {
          const index = positionedEvents.indexOf(event);
          nodeX = (index / (positionedEvents.length - 1)) * (canvas.width - 100) - (canvas.width - 100) / 2;
          nodeY = 0;
        }
        
        const distance = Math.sqrt((clickX - nodeX) ** 2 + (clickY - nodeY) ** 2);
        if (distance < 30 && distance < closestDistance) {
          closestDistance = distance;
          closestEvent = event;
        }
      }
    });
    
    setSelectedEvent(closestEvent);
  };

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const updateSize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          variant="outline"
          className="flex items-center gap-2 font-serif italic"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause breath' : 'Trace'}
        </Button>

        <Button
          onClick={() => {
            setRotationX(-0.3);
            setRotationY(0);
            setZoom(1);
          }}
          variant="outline"
          className="flex items-center gap-2 font-serif italic"
        >
          <RotateCcw className="w-4 h-4" />
          Re-center frame
        </Button>

        <Button
          onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
          variant="outline"
          className="flex items-center gap-2 font-serif italic"
        >
          {viewMode === '3d' ? <Grid3X3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {viewMode === '3d' ? 'Flatten' : 'Spiral'}
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-serif italic">Focal length</span>
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={0.5}
            max={3}
            step={0.1}
            className="w-20"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
        />
        
        {/* Instructions */}
        <div className="absolute top-4 left-4 text-sm text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-2">
          {viewMode === '3d' ? 'Drag to rotate • Scroll to zoom • Click nodes for details' : 'Click nodes for details'}
        </div>
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-purple-600">{selectedEvent.year}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEvent(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <CardTitle className="text-lg">{selectedEvent.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-slate-600 dark:text-slate-300 mb-3">{selectedEvent.description}</p>
            {selectedEvent.caseStudy && (
              <Link 
                to={`/case-studies#${selectedEvent.caseStudy.id}`} 
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Voir le projet: {selectedEvent.caseStudy.title}
                <ExternalLink size={14} />
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpiralTimeline;
