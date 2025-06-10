import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';
import SpiralNavigator from './navigation/SpiralNavigator';
import CulturalUnitTests from './CulturalUnitTests';
import LearningOrganizationDashboard from './LearningOrganizationDashboard';
import OverviewTab from '@/components/product-development/OverviewTab';
import WindowControls from './components/WindowControls';
import ViewModeNavigation from './components/ViewModeNavigation';
import LandscapeJourney from './components/LandscapeJourney';
import PoiesisIndicator from './components/PoiesisIndicator';
import InteractiveToolsPanel from './tools/InteractiveToolsPanel';
import { useWindowControls } from './hooks/useWindowControls';
import { ModeProvider } from './context/ModeContext';
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
  
  const {
    position,
    size,
    isDragging,
    isMaximized,
    handleMouseDown,
    handleResizeStart,
    handleMaximize
  } = useWindowControls();
  
  // Living Landscape Journey State
  const [currentLandscape, setCurrentLandscape] = useState(0);
  const [viewMode, setViewMode] = useState<'journey' | 'spiral' | 'tests' | 'learning' | 'overview' | 'tools'>('journey');
  const [emotionalState, setEmotionalState] = useState<Partial<EmotionalState>>({
    love_level: 50,
    magic_level: 50,
    calm_level: 50,
    open_level: 50,
    free_level: 50
  });
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

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

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'journey':
        return (
          <LandscapeJourney
            currentLandscape={currentLandscape}
            emotionalState={emotionalState}
            onLandscapeChange={setCurrentLandscape}
            onStateChange={setEmotionalState}
          />
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

      case 'tools':
        return (
          <InteractiveToolsPanel
            emotionalState={emotionalState}
            onStateChange={setEmotionalState}
          />
        );

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
    <ModeProvider>
      <div style={windowStyle} className="select-none">
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
              <WindowControls
                isMinimized={isMinimized}
                isMaximized={isMaximized}
                onMinimize={() => setIsMinimized(!isMinimized)}
                onMaximize={handleMaximize}
                onClose={() => setIsOpen(false)}
              />
            </div>
            {!isMinimized && (
              <div className="flex gap-2">
                <Badge variant="outline">
                  Personal & Professional Integration
                </Badge>
                <Badge variant="outline">
                  Innovation Leadership
                </Badge>
              </div>
            )}
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-4 overflow-y-auto flex-1">
              {/* View Mode Navigation */}
              <ViewModeNavigation
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              {/* Current View */}
              <div className="flex-1">
                {renderCurrentView()}
              </div>

              {/* Poiesis Indicator */}
              <PoiesisIndicator emotionalState={emotionalState} />
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
    </ModeProvider>
  );
};

export default CalmMagicAssistant;
