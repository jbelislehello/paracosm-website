import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Line, PencilBrush, IText } from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Pencil, Square, Circle as CircleIcon, Type, Eraser, 
  Undo2, Redo2, Download, Trash2, Minus
} from 'lucide-react';

interface SketchPadProps {
  onSave?: (dataUrl: string) => void;
  initialData?: string;
}

type Tool = 'pencil' | 'rectangle' | 'circle' | 'line' | 'text' | 'eraser';

const COLORS = [
  'hsl(var(--foreground))',
  'hsl(var(--primary))',
  'hsl(var(--destructive))',
  'hsl(346, 77%, 50%)',
  'hsl(142, 71%, 45%)',
  'hsl(217, 91%, 60%)',
  'hsl(280, 67%, 60%)',
  'hsl(39, 100%, 50%)',
];

export const SketchPad: React.FC<SketchPadProps> = ({ onSave, initialData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('pencil');
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 500,
      height: 300,
      backgroundColor: 'hsl(var(--background))',
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = strokeWidth;

    setFabricCanvas(canvas);
    saveToHistory(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'pencil' || activeTool === 'eraser';
    
    if (activeTool === 'pencil') {
      fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = strokeWidth;
    } else if (activeTool === 'eraser') {
      fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = 'hsl(var(--background))';
      fabricCanvas.freeDrawingBrush.width = strokeWidth * 3;
    }
  }, [activeTool, activeColor, strokeWidth, fabricCanvas]);

  const saveToHistory = (canvas: FabricCanvas) => {
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => [...prev.slice(0, historyIndex + 1), json]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        originX: 'left',
        originY: 'top',
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: strokeWidth,
        width: 80,
        height: 60,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
      saveToHistory(fabricCanvas);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 100,
        top: 100,
        originX: 'left',
        originY: 'top',
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: strokeWidth,
        radius: 40,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
      saveToHistory(fabricCanvas);
    } else if (tool === 'line') {
      const line = new Line([50, 50, 200, 50], {
        stroke: activeColor,
        strokeWidth: strokeWidth,
      });
      fabricCanvas.add(line);
      fabricCanvas.setActiveObject(line);
      saveToHistory(fabricCanvas);
    } else if (tool === 'text') {
      const text = new IText('Type here...', {
        left: 100,
        top: 100,
        fill: activeColor,
        fontSize: 16,
        fontFamily: 'system-ui',
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      saveToHistory(fabricCanvas);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0 && fabricCanvas) {
      const newIndex = historyIndex - 1;
      fabricCanvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
        fabricCanvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && fabricCanvas) {
      const newIndex = historyIndex + 1;
      fabricCanvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
        fabricCanvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const handleClear = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = 'hsl(var(--background))';
      fabricCanvas.renderAll();
      saveToHistory(fabricCanvas);
    }
  };

  const handleExport = () => {
    if (fabricCanvas) {
      const dataUrl = fabricCanvas.toDataURL({ format: 'png', multiplier: 2 });
      onSave?.(dataUrl);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 border-r border-border/50 pr-2">
          <Button
            variant={activeTool === 'pencil' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleToolClick('pencil')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === 'line' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleToolClick('line')}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === 'rectangle' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleToolClick('rectangle')}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === 'circle' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleToolClick('circle')}
          >
            <CircleIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === 'text' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleToolClick('text')}
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === 'eraser' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleToolClick('eraser')}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        {/* Colors */}
        <div className="flex gap-1 border-r border-border/50 pr-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                activeColor === color ? 'scale-125 border-primary' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setActiveColor(color)}
            />
          ))}
        </div>

        {/* Stroke width */}
        <div className="flex items-center gap-2 w-24">
          <Slider
            value={[strokeWidth]}
            onValueChange={([val]) => setStrokeWidth(val)}
            min={1}
            max={10}
            step={1}
            className="flex-1"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUndo} disabled={historyIndex <= 0}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="border border-border rounded-md overflow-hidden">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
    </div>
  );
};
