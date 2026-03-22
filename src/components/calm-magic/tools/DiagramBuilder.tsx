import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, Copy, Trash2, MousePointer, Link2, Undo2, Redo2,
  Square, Diamond, Circle, RectangleHorizontal, Hexagon
} from 'lucide-react';
import { toast } from 'sonner';
import { Canvas as FabricCanvas, Rect, Circle as FabricCircle, Line, IText, Group, Polygon, FabricObject } from 'fabric';

interface DiagramBuilderProps {
  onSave?: (dataUrl: string, jsonState: string, type: string) => void;
}

type ShapeType = 'rectangle' | 'diamond' | 'circle' | 'rounded' | 'parallelogram';
type ToolMode = 'select' | 'connect';
type PortPosition = 'top' | 'right' | 'bottom' | 'left';

interface ShapeData {
  id: string;
  type: ShapeType;
  connectorIds: string[];
}

interface ConnectorData {
  id: string;
  fromShapeId: string;
  fromPort: PortPosition;
  toShapeId: string;
  toPort: PortPosition;
}

const SHAPE_PALETTE: { type: ShapeType; label: string; icon: React.ReactNode }[] = [
  { type: 'rectangle', label: 'Process', icon: <Square className="h-4 w-4" /> },
  { type: 'diamond', label: 'Decision', icon: <Diamond className="h-4 w-4" /> },
  { type: 'rounded', label: 'Terminal', icon: <RectangleHorizontal className="h-4 w-4" /> },
  { type: 'circle', label: 'State', icon: <Circle className="h-4 w-4" /> },
  { type: 'parallelogram', label: 'I/O', icon: <Hexagon className="h-4 w-4" /> },
];

const PORT_RADIUS = 6;
const SHAPE_WIDTH = 120;
const SHAPE_HEIGHT = 60;

const generateId = () => Math.random().toString(36).substr(2, 9);

const getPortPosition = (shape: FabricObject, port: PortPosition): { x: number; y: number } => {
  const left = shape.left || 0;
  const top = shape.top || 0;
  const width = (shape.width || SHAPE_WIDTH) * (shape.scaleX || 1);
  const height = (shape.height || SHAPE_HEIGHT) * (shape.scaleY || 1);

  switch (port) {
    case 'top': return { x: left + width / 2, y: top };
    case 'right': return { x: left + width, y: top + height / 2 };
    case 'bottom': return { x: left + width / 2, y: top + height };
    case 'left': return { x: left, y: top + height / 2 };
  }
};

export const DiagramBuilder: React.FC<DiagramBuilderProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [shapes, setShapes] = useState<Map<string, FabricObject>>(new Map());
  const [connectors, setConnectors] = useState<Map<string, { line: FabricObject; data: ConnectorData }>>(new Map());
  const [connectingFrom, setConnectingFrom] = useState<{ shapeId: string; port: PortPosition } | null>(null);
  const [tempLine, setTempLine] = useState<Line | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: 'hsl(var(--background))',
      selection: true,
    });

    setCanvas(fabricCanvas);
    saveToHistory(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const saveToHistory = useCallback((c: FabricCanvas) => {
    const json = JSON.stringify(c.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const createShape = useCallback((type: ShapeType, x: number, y: number): FabricObject => {
    const shapeId = generateId();
    const fill = 'hsl(var(--card))';
    const stroke = 'hsl(var(--border))';
    
    let mainShape: FabricObject;
    
    switch (type) {
      case 'diamond': {
        const points = [
          { x: SHAPE_WIDTH / 2, y: 0 },
          { x: SHAPE_WIDTH, y: SHAPE_HEIGHT / 2 },
          { x: SHAPE_WIDTH / 2, y: SHAPE_HEIGHT },
          { x: 0, y: SHAPE_HEIGHT / 2 },
        ];
        mainShape = new Polygon(points, {
          fill,
          stroke,
          strokeWidth: 2,
          originX: 'center',
          originY: 'center',
        });
        break;
      }
      case 'circle':
        mainShape = new FabricCircle({
          radius: Math.min(SHAPE_WIDTH, SHAPE_HEIGHT) / 2,
          fill,
          stroke,
          strokeWidth: 2,
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'rounded':
        mainShape = new Rect({
          width: SHAPE_WIDTH,
          height: SHAPE_HEIGHT,
          rx: 20,
          ry: 20,
          fill,
          stroke,
          strokeWidth: 2,
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'parallelogram': {
        const skew = 15;
        const points = [
          { x: skew, y: 0 },
          { x: SHAPE_WIDTH, y: 0 },
          { x: SHAPE_WIDTH - skew, y: SHAPE_HEIGHT },
          { x: 0, y: SHAPE_HEIGHT },
        ];
        mainShape = new Polygon(points, {
          fill,
          stroke,
          strokeWidth: 2,
          originX: 'center',
          originY: 'center',
        });
        break;
      }
      default:
        mainShape = new Rect({
          width: SHAPE_WIDTH,
          height: SHAPE_HEIGHT,
          fill,
          stroke,
          strokeWidth: 2,
          originX: 'center',
          originY: 'center',
        });
    }

    const label = new IText('Label', {
      fontSize: 14,
      fill: 'hsl(var(--foreground))',
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
    });

    const group = new Group([mainShape, label], {
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
      subTargetCheck: true,
      hasControls: true,
      hasBorders: true,
    });

    const shapeData: ShapeData = { id: shapeId, type, connectorIds: [] };
    group.set('shapeData', shapeData);

    return group;
  }, []);

  const createConnector = useCallback((
    fromShape: FabricObject,
    fromPort: PortPosition,
    toShape: FabricObject,
    toPort: PortPosition
  ): { line: Line; data: ConnectorData } => {
    const fromPos = getPortPosition(fromShape, fromPort);
    const toPos = getPortPosition(toShape, toPort);
    const connectorId = generateId();

    const line = new Line([fromPos.x, fromPos.y, toPos.x, toPos.y], {
      stroke: 'hsl(var(--primary))',
      strokeWidth: 2,
      selectable: true,
      evented: true,
      hasControls: false,
      hasBorders: false,
      perPixelTargetFind: true,
    });

    // Add arrow head
    const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
    const arrowSize = 10;

    const fromShapeData = fromShape.get('shapeData') as ShapeData;
    const toShapeData = toShape.get('shapeData') as ShapeData;

    const data: ConnectorData = {
      id: connectorId,
      fromShapeId: fromShapeData.id,
      fromPort,
      toShapeId: toShapeData.id,
      toPort,
    };

    line.set('connectorData', data);

    // Update shape connector references
    fromShapeData.connectorIds.push(connectorId);
    toShapeData.connectorIds.push(connectorId);

    return { line, data };
  }, []);

  const updateConnectors = useCallback((movedShape: FabricObject) => {
    if (!canvas) return;
    
    const shapeData = movedShape.get('shapeData') as ShapeData;
    if (!shapeData) return;

    connectors.forEach(({ line, data }) => {
      if (data.fromShapeId === shapeData.id || data.toShapeId === shapeData.id) {
        const fromShape = Array.from(shapes.values()).find(
          s => (s.get('shapeData') as ShapeData)?.id === data.fromShapeId
        );
        const toShape = Array.from(shapes.values()).find(
          s => (s.get('shapeData') as ShapeData)?.id === data.toShapeId
        );

        if (fromShape && toShape) {
          const fromPos = getPortPosition(fromShape, data.fromPort);
          const toPos = getPortPosition(toShape, data.toPort);
          
          line.set({
            x1: fromPos.x,
            y1: fromPos.y,
            x2: toPos.x,
            y2: toPos.y,
          });
        }
      }
    });

    canvas.renderAll();
  }, [canvas, shapes, connectors]);

  const findNearestPort = useCallback((shape: FabricObject, mouseX: number, mouseY: number): PortPosition => {
    const ports: PortPosition[] = ['top', 'right', 'bottom', 'left'];
    let nearest: PortPosition = 'top';
    let minDist = Infinity;

    ports.forEach(port => {
      const pos = getPortPosition(shape, port);
      const dist = Math.sqrt(Math.pow(pos.x - mouseX, 2) + Math.pow(pos.y - mouseY, 2));
      if (dist < minDist) {
        minDist = dist;
        nearest = port;
      }
    });

    return nearest;
  }, []);

  // Canvas event handlers
  useEffect(() => {
    if (!canvas) return;

    const handleObjectMoving = (e: any) => {
      const obj = e.target;
      if (obj.get('shapeData')) {
        updateConnectors(obj);
      }
    };

    const handleMouseDown = (e: any) => {
      if (toolMode !== 'connect' || !e.target) return;
      
      const target = e.target;
      const shapeData = target.get('shapeData') as ShapeData;
      
      if (shapeData) {
        const pointer = canvas.getViewportPoint(e.e);
        const port = findNearestPort(target, pointer.x, pointer.y);
        const portPos = getPortPosition(target, port);
        
        setConnectingFrom({ shapeId: shapeData.id, port });
        
        const line = new Line([portPos.x, portPos.y, pointer.x, pointer.y], {
          stroke: 'hsl(var(--primary))',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
        });
        
        canvas.add(line);
        setTempLine(line);
      }
    };

    const handleMouseMove = (e: any) => {
      if (!connectingFrom || !tempLine) return;
      
      const pointer = canvas.getPointer(e.e);
      tempLine.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    };

    const handleMouseUp = (e: any) => {
      if (!connectingFrom || !tempLine || !canvas) {
        setConnectingFrom(null);
        setTempLine(null);
        return;
      }

      canvas.remove(tempLine);
      setTempLine(null);

      if (e.target) {
        const targetData = e.target.get('shapeData') as ShapeData;
        
        if (targetData && targetData.id !== connectingFrom.shapeId) {
          const pointer = canvas.getPointer(e.e);
          const toPort = findNearestPort(e.target, pointer.x, pointer.y);
          
          const fromShape = Array.from(shapes.values()).find(
            s => (s.get('shapeData') as ShapeData)?.id === connectingFrom.shapeId
          );
          
          if (fromShape) {
            const { line, data } = createConnector(fromShape, connectingFrom.port, e.target, toPort);
            canvas.add(line);
            canvas.sendObjectToBack(line);
            
            setConnectors(prev => new Map(prev).set(data.id, { line, data }));
            saveToHistory(canvas);
            toast.success('Connected shapes');
          }
        }
      }

      setConnectingFrom(null);
    };

    const handleObjectModified = () => {
      saveToHistory(canvas);
    };

    canvas.on('object:moving', handleObjectMoving);
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('object:modified', handleObjectModified);

    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas, toolMode, connectingFrom, tempLine, shapes, connectors, updateConnectors, findNearestPort, createConnector, saveToHistory]);

  const handleAddShape = (type: ShapeType) => {
    if (!canvas) return;
    
    const shape = createShape(type, canvas.width! / 2, canvas.height! / 2);
    canvas.add(shape);
    canvas.setActiveObject(shape);
    
    const shapeData = shape.get('shapeData') as ShapeData;
    setShapes(prev => new Map(prev).set(shapeData.id, shape));
    saveToHistory(canvas);
    
    toast.success(`Added ${type} shape`);
  };

  const handleDelete = () => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(obj => {
      const shapeData = obj.get('shapeData') as ShapeData;
      const connectorData = obj.get('connectorData') as ConnectorData;
      
      if (shapeData) {
        // Remove associated connectors
        shapeData.connectorIds.forEach(connId => {
          const conn = connectors.get(connId);
          if (conn) {
            canvas.remove(conn.line);
            setConnectors(prev => {
              const next = new Map(prev);
              next.delete(connId);
              return next;
            });
          }
        });
        
        setShapes(prev => {
          const next = new Map(prev);
          next.delete(shapeData.id);
          return next;
        });
      }
      
      if (connectorData) {
        setConnectors(prev => {
          const next = new Map(prev);
          next.delete(connectorData.id);
          return next;
        });
      }
      
      canvas.remove(obj);
    });
    
    canvas.discardActiveObject();
    canvas.renderAll();
    saveToHistory(canvas);
    toast.success('Deleted selected objects');
  };

  const handleUndo = () => {
    if (historyIndex <= 0 || !canvas) return;
    
    const prevIndex = historyIndex - 1;
    const prevState = history[prevIndex];
    
    canvas.loadFromJSON(prevState, () => {
      canvas.renderAll();
      rebuildStateFromCanvas(canvas);
    });
    
    setHistoryIndex(prevIndex);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1 || !canvas) return;
    
    const nextIndex = historyIndex + 1;
    const nextState = history[nextIndex];
    
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      rebuildStateFromCanvas(canvas);
    });
    
    setHistoryIndex(nextIndex);
  };

  const rebuildStateFromCanvas = (c: FabricCanvas) => {
    const newShapes = new Map<string, FabricObject>();
    const newConnectors = new Map<string, { line: FabricObject; data: ConnectorData }>();
    
    c.getObjects().forEach(obj => {
      const shapeData = obj.get('shapeData') as ShapeData;
      const connectorData = obj.get('connectorData') as ConnectorData;
      
      if (shapeData) {
        newShapes.set(shapeData.id, obj);
      }
      if (connectorData) {
        newConnectors.set(connectorData.id, { line: obj, data: connectorData });
      }
    });
    
    setShapes(newShapes);
    setConnectors(newConnectors);
  };

  const handleCopy = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 });
    
    // Copy to clipboard as image
    canvas.toCanvasElement().toBlob(blob => {
      if (blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);
        toast.success('Diagram copied to clipboard');
      }
    });
  };

  const handleExport = () => {
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 });
    const jsonState = JSON.stringify(canvas.toJSON());
    
    onSave?.(dataUrl, jsonState, 'diagram');
    toast.success('Diagram saved as POLEN entry');
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 border-r border-border/50 pr-2">
          <Button
            variant={toolMode === 'select' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setToolMode('select')}
            title="Select & Move"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button
            variant={toolMode === 'connect' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setToolMode('connect')}
            title="Connect Shapes"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDelete}
            title="Delete Selected"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1 border-r border-border/50 pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} title="Copy to Clipboard">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport} title="Save as POLEN">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-3">
        {/* Shape Palette */}
        <div className="flex flex-col gap-2 p-2 bg-background rounded-md border border-border/50 min-w-[100px]">
          <span className="text-xs font-medium text-muted-foreground px-1">Shapes</span>
          {SHAPE_PALETTE.map(({ type, label, icon }) => (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              className="justify-start gap-2 h-8"
              onClick={() => handleAddShape(type)}
            >
              {icon}
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 rounded-md border border-border overflow-hidden bg-background">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Instructions */}
      <div className="text-[10px] text-muted-foreground space-y-1">
        <div><strong>Select mode:</strong> Click shapes to select, drag to move. Double-click label to edit.</div>
        <div><strong>Connect mode:</strong> Click a shape, then click another to connect them.</div>
      </div>
    </div>
  );
};
