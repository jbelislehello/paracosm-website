import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Minimize2, Maximize2, Network, MoreHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import TreeLandscape from './landscapes/TreeLandscape';
import RiverLandscape from './landscapes/RiverLandscape';
import LakeLandscape from './landscapes/LakeLandscape';
import ForestLandscape from './landscapes/ForestLandscape';
import MountainLandscape from './landscapes/MountainLandscape';
import SpiralNavigator from './navigation/SpiralNavigator';
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
  const [size, setSize] = useState({ width: 600, height: 700 });
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<string>('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Living Landscape Journey State
  const [currentLandscape, setCurrentLandscape] = useState(0);
  const [viewMode, setViewMode] = useState<'journey' | 'spiral' | 'tests' | 'learning' | 'overview'>('journey');
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

  // Landscape definitions for expressivity tool
  const landscapes = [
    { name: 'Tree', component: TreeLandscape, key: 'love', emoji: '🌳' },
    { name: 'River', component: RiverLandscape, key: 'magic', emoji: '🌊' },
    { name: 'Lake', component: LakeLandscape, key: 'calm', emoji: '🏞️' },
    { name: 'Forest', component: ForestLandscape, key: 'open', emoji: '🌳' },
    { name: 'Mountain', component: MountainLandscape, key: 'free', emoji: '⛰️' }
  ];

  const transformationStages = [
    'Aliveness Anchoring',
    'Spaciousness Opening', 
    'Wholeness Reflecting',
    'Poiesis Co-creating',
    'Integration Transcending'
  ];

  const emotionalJourney = [
    'Grounding in authentic values',
    'Opening to flow and emergence',
    'Finding center and coherence', 
    'Engaging in creative collaboration',
    'Achieving sovereign integration'
  ];

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
        newWidth = Math.max(500, Math.min(1200, resizeStart.width + deltaX));
      }
      if (resizeType.includes('left')) {
        newWidth = Math.max(500, Math.min(1200, resizeStart.width - deltaX));
        newX = position.x + (resizeStart.width - newWidth);
      }
      if (resizeType.includes('bottom')) {
        newHeight = Math.max(600, Math.min(900, resizeStart.height + deltaY));
      }
      if (resizeType.includes('top')) {
        newHeight = Math.max(600, Math.min(900, resizeStart.height - deltaY));
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
      setSize({ width: 600, height: 700 });
      setPosition({ x: 100, y: 100 });
    } else {
      setIsMaximized(true);
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setPosition({ x: 20, y: 20 });
    }
  };

  const handleLandscapeNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentLandscape < landscapes.length - 1) {
      setCurrentLandscape(currentLandscape + 1);
    } else if (direction === 'prev' && currentLandscape > 0) {
      setCurrentLandscape(currentLandscape - 1);
    }
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'journey':
        const CurrentLandscapeComponent = landscapes[currentLandscape]?.component;
        return (
          <div className="space-y-4">
            {/* Landscape Journey */}
            <div className="relative">
              {CurrentLandscapeComponent && (
                <CurrentLandscapeComponent
                  emotionalState={emotionalState}
                  onStateChange={setEmotionalState}
                  isActive={true}
                />
              )}
              
              {/* Navigation Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  onClick={() => handleLandscapeNavigation('prev')}
                  disabled={currentLandscape === 0}
                  size="sm"
                  variant="outline"
                >
                  <ArrowLeft className="w-3 h-3" />
                </Button>
                <Badge variant="outline" className="px-3">
                  {landscapes[currentLandscape]?.emoji} {landscapes[currentLandscape]?.name}
                </Badge>
                <Button
                  onClick={() => handleLandscapeNavigation('next')}
                  disabled={currentLandscape === landscapes.length - 1}
                  size="sm"
                  variant="outline"
                >
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 'spiral':
        return (
          <div className="space-y-4">
            <SpiralNavigator
              currentLandscape={currentLandscape}
              onLandscapeChange={setCurrentLandscape}
              transformationStages={transformationStages}
              emotionalJourney={emotionalJourney}
            />
            <div className="text-center">
              <Button onClick={() => setViewMode('journey')} variant="outline" size="sm">
                Enter Landscape Journey
              </Button>
            </div>
          </div>
        );

      case 'tests':
        return <CulturalUnitTests />;

      case 'learning':
        return <LearningOrganizationDashboard />;

      case 'overview':
        return <OverviewTab onStartJourney={onStartJourney} />;

      default:
        return null;
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
                Calm Magic: Expressivity Tool for Poiesis
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
            <div className="flex gap-2">
              <Badge variant="outline">
                Trajectories & Territories
              </Badge>
              <Badge variant="outline">
                Natural Transformation
              </Badge>
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 overflow-y-auto flex-1">
            {/* View Mode Navigation */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {[
                { key: 'journey', label: '🌊 Journey', desc: 'Living Landscapes' },
                { key: 'spiral', label: '🌀 Spiral', desc: 'Navigation' },
                { key: 'tests', label: '🧪 Tests', desc: 'Cultural' },
                { key: 'learning', label: '📊 Learning', desc: 'Organization' },
                { key: 'overview', label: '🎯 Overview', desc: 'Framework' }
              ].map(({ key, label, desc }) => (
                <Button
                  key={key}
                  onClick={() => setViewMode(key as any)}
                  variant={viewMode === key ? 'default' : 'outline'}
                  size="sm"
                  className="flex flex-col h-auto py-2"
                >
                  <div className="text-xs">{label}</div>
                  <div className="text-xs opacity-70">{desc}</div>
                </Button>
              ))}
            </div>

            {/* Current View */}
            <div className="flex-1">
              {renderCurrentView()}
            </div>

            {/* Poiesis Indicator */}
            {Object.values(emotionalState).some(level => (level || 0) > 75) && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                  🌟 Poiesis Active
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  Natural transformation emerging through expressivity
                </div>
              </div>
            )}
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

</edits_to_apply>
