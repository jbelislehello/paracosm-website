
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, X, Minimize2, Maximize2, Brain, Compass, BookOpen, ArrowRight, ChevronLeft, ChevronRight, Heart, Search, Lightbulb, Users, Code, Handshake, Move, MoreHorizontal } from 'lucide-react';

interface CalmMagicAssistantProps {
  onStartJourney?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CalmMagicAssistant: React.FC<CalmMagicAssistantProps> = ({
  onStartJourney,
  isOpen: controlledIsOpen,
  onOpenChange
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Window position and size state
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 400, height: 400 });
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<string>('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position, isMaximized]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;
      
      if (resizeType.includes('right')) {
        newWidth = Math.max(300, Math.min(800, resizeStart.width + deltaX));
      }
      if (resizeType.includes('left')) {
        newWidth = Math.max(300, Math.min(800, resizeStart.width - deltaX));
        newX = position.x + (resizeStart.width - newWidth);
      }
      if (resizeType.includes('bottom')) {
        newHeight = Math.max(300, Math.min(600, resizeStart.height + deltaY));
      }
      if (resizeType.includes('top')) {
        newHeight = Math.max(300, Math.min(600, resizeStart.height - deltaY));
        newY = position.y + (resizeStart.height - newHeight);
      }
      
      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeType, position, size, isMaximized]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeType('');
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
      setSize({ width: 400, height: 400 });
      setPosition({ x: 100, y: 100 });
    } else {
      setIsMaximized(true);
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setPosition({ x: 20, y: 20 });
    }
  };

  const healingSteps = [
    {
      icon: <Heart className="w-4 h-4" />,
      name: 'Inner Landscape Exploration',
      phase: 'Awareness'
    },
    {
      icon: <Search className="w-4 h-4" />,
      name: 'Relational Pattern Mapping',
      phase: 'Awareness'
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      name: 'Healing Story Creation',
      phase: 'Awareness'
    },
    {
      icon: <Users className="w-4 h-4" />,
      name: 'Integration Practices',
      phase: 'Transformation'
    },
    {
      icon: <Handshake className="w-4 h-4" />,
      name: 'Transformation Anchoring',
      phase: 'Transformation'
    }
  ];

  const bridgeElements = [
    {
      name: 'Inner-Outer Integration',
      description: 'Bridge your inner work with relational transformation that feels authentic'
    },
    {
      name: 'Relational Intelligence',
      description: 'Healing practices that preserve your emotional truth while creating safety'
    },
    {
      name: 'Transformation Anchoring',
      description: 'Integration that helps you embody change, not just understand it intellectually'
    }
  ];

  if (!isOpen) {
    return null;
  }

  const windowStyle = {
    position: 'fixed' as const,
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    zIndex: 50,
    cursor: isDragging ? 'grabbing' : 'default'
  };

  return (
    <div
      ref={windowRef}
      style={windowStyle}
      className="select-none"
    >
      <Card className="h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-gradient-to-b from-rose-500 to-purple-500 shadow-2xl rounded-xl overflow-hidden flex flex-col">
        {/* Window Header */}
        <CardHeader 
          className="pb-2 cursor-grab active:cursor-grabbing bg-gradient-to-r from-rose-50 to-purple-50 dark:from-rose-950/30 dark:to-purple-950/30 border-b"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            {!isMinimized && (
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Calm Magic Healing Framework
              </CardTitle>
            )}
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMaximize} 
                className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)} 
                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {!isMinimized && (
            <Badge variant="outline" className="w-fit">
              Expansive Leadership Framework
            </Badge>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 overflow-y-auto flex-1">
            <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="process">Journey</TabsTrigger>
                <TabsTrigger value="bridge">Bridge</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="space-y-4 mt-0">
                  <div className="text-center space-y-3">
                    <div className="text-2xl">💫</div>
                    <h3 className="font-semibold">Bridge Inner Work to Outer Relationships</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      A structured approach to move from "I want to heal" 
                      to "here's exactly how I'm growing and why it creates lasting freedom."
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-rose-600" />
                      <span>Explore your emotional landscape and patterns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Search className="w-4 h-4 text-purple-600" />
                      <span>Map relational dynamics and healing opportunities</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-green-600" />
                      <span>Create transformational healing stories</span>
                    </div>
                  </div>

                  <Button onClick={onStartJourney} className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600">
                    Begin Healing Journey
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="border-t pt-3 space-y-2">
                    <h4 className="font-medium text-sm">Why Healing Often Stagnates</h4>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <li>• Gap between "healing insight" and "integrated transformation"</li>
                      <li>• Surface-level changes that don't address core patterns</li>
                      <li>• Healing work stays intellectual without relational integration</li>
                      <li>• Original healing vision gets lost in overwhelming emotions</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="process" className="space-y-3 mt-0">
                  <h3 className="font-semibold text-center">7-Step Healing Journey</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg">
                      <h4 className="font-medium text-rose-800 dark:text-rose-200 text-sm mb-2">
                        Phase 1: Building Awareness (Steps 1-3)
                      </h4>
                      {healingSteps.slice(0, 3).map((step, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                          {step.icon}
                          <span>{index + 1}. {step.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                      <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-2">
                        Phase 2: Creating Transformation (Steps 4-7)
                      </h4>
                      {healingSteps.slice(3, 5).map((step, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
                          {step.icon}
                          <span>{index + 4}. {step.name}</span>
                        </div>
                      ))}
                      <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        + Shadow Integration & Freedom Compass Tracking
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">Outcome</h4>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Embodied transformation that creates authentic relational freedom, 
                      preventing the "healing but not changing" pattern.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="bridge" className="space-y-3 mt-0">
                  <h3 className="font-semibold text-center">The Healing Bridge Elements</h3>
                  
                  {bridgeElements.map((element, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
                      <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                        {element.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {element.description}
                      </p>
                    </div>
                  ))}

                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                      Freedom Movement
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      This framework tracks your movement through Love→Magic→Calm→Open, 
                      ensuring healing creates expanding freedom rather than spiritual bypassing 
                      or emotional overwhelm.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        )}

        {/* Resize Handles */}
        {!isMinimized && !isMaximized && (
          <>
            {/* Corner handles */}
            <div 
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'top-left')}
            />
            <div 
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
              onMouseDown={(e) => handleResizeStart(e, 'top-right')}
            />
            <div 
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
            />
            <div 
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
              onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
            />
            
            {/* Edge handles */}
            <div 
              className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
              onMouseDown={(e) => handleResizeStart(e, 'top')}
            />
            <div 
              className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            />
            <div 
              className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
              onMouseDown={(e) => handleResizeStart(e, 'left')}
            />
            <div 
              className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
              onMouseDown={(e) => handleResizeStart(e, 'right')}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default CalmMagicAssistant;
