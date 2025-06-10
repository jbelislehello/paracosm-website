
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PulseToPatternVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  const emotions = [
    { name: 'fear', color: '#FF6B6B', pattern: 'chaotic' },
    { name: 'uncertainty', color: '#4ECDC4', pattern: 'flowing' },
    { name: 'hope', color: '#45B7D1', pattern: 'expanding' },
    { name: 'excitement', color: '#FFA07A', pattern: 'pulsing' },
    { name: 'anxiety', color: '#DDA0DD', pattern: 'scattered' }
  ];

  useEffect(() => {
    if (!isAnimating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const progress = (frame / 200) % 1;
      
      // Draw the transformation based on selected emotion
      const emotion = emotions.find(e => e.name === selectedEmotion);
      if (!emotion) return;

      // Phase 1: Initial chaos/pulse
      if (progress < 0.3) {
        drawInitialPulse(ctx, centerX, centerY, progress, emotion);
      }
      // Phase 2: Formation of pathways
      else if (progress < 0.6) {
        drawPathwayFormation(ctx, centerX, centerY, progress - 0.3, emotion);
      }
      // Phase 3: Coherent pattern
      else {
        drawCoherentPattern(ctx, centerX, centerY, progress - 0.6, emotion);
      }

      frame++;
      if (frame < 400) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setAnimationPhase(3);
      }
    };

    animate();
  }, [isAnimating, selectedEmotion]);

  const drawInitialPulse = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, progress: number, emotion: any) => {
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = emotion.color;
    ctx.lineWidth = 2;

    // Chaotic initial state
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 20 + Math.sin(progress * 10 + i) * 15;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 3 + Math.sin(progress * 15) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Center pulse
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10 + progress * 20, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawPathwayFormation = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, progress: number, emotion: any) => {
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = emotion.color;
    ctx.lineWidth = 1;

    // Neural pathway formation
    const pathways = 8;
    for (let i = 0; i < pathways; i++) {
      const angle = (i / pathways) * Math.PI * 2;
      const length = progress * 80;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const endX = centerX + Math.cos(angle) * length;
      const endY = centerY + Math.sin(angle) * length;
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Connection nodes
      if (progress > 0.5) {
        ctx.beginPath();
        ctx.arc(endX, endY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawCoherentPattern = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, progress: number, emotion: any) => {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = emotion.color;
    ctx.lineWidth = 2;

    // Coherent mandala-like pattern
    const rings = 3;
    for (let ring = 0; ring < rings; ring++) {
      const radius = 30 + ring * 25;
      const points = 8 + ring * 4;
      
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2 + progress * Math.PI;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Central harmony point
    ctx.fillStyle = emotion.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const startTransformation = (emotionName: string) => {
    setSelectedEmotion(emotionName);
    setIsAnimating(true);
    setAnimationPhase(1);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>"From Pulse to Pattern" Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Select an emotional pulse to transform:</h4>
              <div className="grid grid-cols-2 gap-2">
                {emotions.map((emotion) => (
                  <Button
                    key={emotion.name}
                    variant={selectedEmotion === emotion.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => startTransformation(emotion.name)}
                    disabled={isAnimating}
                    style={{ borderColor: emotion.color }}
                  >
                    {emotion.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                className="w-full h-64 rounded"
                style={{ background: 'linear-gradient(45deg, #1a1a2e, #16213e)' }}
              />
            </div>

            {animationPhase > 0 && (
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-sm space-y-2">
                  {animationPhase === 1 && (
                    <p>🔄 <strong>Phase 1:</strong> Raw emotional pulse - nervous system activation</p>
                  )}
                  {animationPhase === 2 && (
                    <p>🧠 <strong>Phase 2:</strong> Neural pathways forming - pattern recognition emerging</p>
                  )}
                  {animationPhase === 3 && (
                    <p>✨ <strong>Phase 3:</strong> Coherent awareness pattern - wisdom integration complete</p>
                  )}
                </div>
              </div>
            )}

            {selectedEmotion && !isAnimating && (
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-800 mb-2">Transformation Complete</h4>
                <p className="text-green-700 text-sm">
                  Your {selectedEmotion} has been transformed from chaotic nervous system activation 
                  into patterned awareness. This coherent state enables wise action and creative response.
                </p>
                <Button size="sm" className="mt-2" onClick={() => startTransformation(selectedEmotion)}>
                  Transform Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PulseToPatternVisualizer;
