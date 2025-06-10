import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, X, Minimize2, Maximize2, Brain, Network, TestTube, BarChart3, Move, MoreHorizontal } from 'lucide-react';
import OOOGardenInterface from './OOOGardenInterface';
import ExpansiveLeadershipLab from './ExpansiveLeadershipLab';
import CulturalUnitTests from './CulturalUnitTests';
import LearningOrganizationDashboard from './LearningOrganizationDashboard';
import OverviewTab from '@/components/product-development/OverviewTab';
import { EmotionalState } from '@/types/journal';

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
  const [size, setSize] = useState({ width: 500, height: 600 });
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<string>('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // OOO State Management
  const [emotionalState, setEmotionalState] = useState<Partial<EmotionalState>>({
    love_level: 50,
    magic_level: 50,
    calm_level: 50,
    open_level: 50,
    free_level: 50
  });
  
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
        newWidth = Math.max(400, Math.min(1000, resizeStart.width + deltaX));
      }
      if (resizeType.includes('left')) {
        newWidth = Math.max(400, Math.min(1000, resizeStart.width - deltaX));
        newX = position.x + (resizeStart.width - newWidth);
      }
      if (resizeType.includes('bottom')) {
        newHeight = Math.max(500, Math.min(800, resizeStart.height + deltaY));
      }
      if (resizeType.includes('top')) {
        newHeight = Math.max(500, Math.min(800, resizeStart.height - deltaY));
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
      setSize({ width: 500, height: 600 });
      setPosition({ x: 100, y: 100 });
    } else {
      setIsMaximized(true);
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setPosition({ x: 20, y: 20 });
    }
  };

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
      <Card className="h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-gradient-to-b from-purple-500 to-blue-500 shadow-2xl rounded-xl overflow-hidden flex flex-col">
        {/* Window Header */}
        <CardHeader 
          className="pb-2 cursor-grab active:cursor-grabbing bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-b"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            {!isMinimized && (
              <CardTitle className="flex items-center gap-2 text-lg">
                <Network className="w-5 h-5 text-purple-600" />
                Object-Oriented Transformation Lab
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
              Object-Oriented Ontology Interface
            </Badge>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 overflow-y-auto flex-1">
            <Tabs defaultValue="gardens" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="gardens" className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  Gardens
                </TabsTrigger>
                <TabsTrigger value="compass" className="flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Compass
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center gap-1">
                  <TestTube className="w-3 h-3" />
                  Tests
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Learning
                </TabsTrigger>
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Move className="w-3 h-3" />
                  Overview
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="gardens" className="space-y-4 mt-0">
                  <OOOGardenInterface />
                </TabsContent>

                <TabsContent value="compass" className="space-y-4 mt-0">
                  <ExpansiveLeadershipLab 
                    emotionalState={emotionalState}
                    onStateChange={setEmotionalState}
                  />
                </TabsContent>

                <TabsContent value="tests" className="space-y-4 mt-0">
                  <CulturalUnitTests />
                </TabsContent>

                <TabsContent value="learning" className="space-y-4 mt-0">
                  <LearningOrganizationDashboard />
                </TabsContent>

                <TabsContent value="overview" className="space-y-4 mt-0">
                  <OverviewTab onStartJourney={onStartJourney} />
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
