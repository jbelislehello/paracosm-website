
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import EnhancedAssistantHeader from './EnhancedAssistantHeader';
import ViewModeNavigation from './ViewModeNavigation';
import ViewRenderer from './ViewRenderer';
import PoiesisIndicator from './PoiesisIndicator';
import SettingsPanel from './SettingsPanel';
import ContextualGuide from './ContextualGuide';
import { EmotionalState } from '@/types/journal';

type ViewMode = 'journey' | 'spiral' | 'tests' | 'learning' | 'overview' | 'tools' | 'dream';

interface MainWindowProps {
  windowStyle: React.CSSProperties;
  isMinimized: boolean;
  isMaximized: boolean;
  isFullScreen: boolean;
  viewMode: ViewMode;
  currentLandscape: number;
  emotionalState: Partial<EmotionalState>;
  transformationStages: string[];
  emotionalJourney: string[];
  preferences: any;
  showSettings: boolean;
  isFirstTime: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onFullScreen: () => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onLandscapeChange: (landscape: number) => void;
  onStateChange: (state: Partial<EmotionalState>) => void;
  onStartJourney?: () => void;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
  onFirstTimeComplete: () => void;
  handleResizeStart: (e: React.MouseEvent, direction: string) => void;
}

const MainWindow: React.FC<MainWindowProps> = ({
  windowStyle,
  isMinimized,
  isMaximized,
  isFullScreen,
  viewMode,
  currentLandscape,
  emotionalState,
  transformationStages,
  emotionalJourney,
  preferences,
  showSettings,
  isFirstTime,
  onMinimize,
  onMaximize,
  onFullScreen,
  onClose,
  onMouseDown,
  onViewModeChange,
  onLandscapeChange,
  onStateChange,
  onStartJourney,
  onOpenSettings,
  onCloseSettings,
  onFirstTimeComplete,
  handleResizeStart
}) => {
  const cardClassName = isFullScreen 
    ? "h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-0 shadow-none rounded-none overflow-hidden flex flex-col"
    : "h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-gradient-to-b from-purple-500 to-blue-500 shadow-2xl rounded-xl overflow-hidden flex flex-col";

  const animationClass = preferences?.interfaceSettings?.animationsEnabled 
    ? "transition-all duration-300" 
    : "";

  return (
    <div style={windowStyle} className={`select-none ${animationClass}`}>
      <Card className={cardClassName}>
        <EnhancedAssistantHeader
          isMinimized={isMinimized}
          isMaximized={isMaximized}
          isFullScreen={isFullScreen}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onFullScreen={onFullScreen}
          onClose={onClose}
          onMouseDown={onMouseDown}
          emotionalState={emotionalState}
          currentViewMode={viewMode}
          onOpenSettings={onOpenSettings}
        />

        {!isMinimized && (
          <CardContent className={`p-2 overflow-y-auto flex-1 ${preferences?.interfaceSettings?.compactMode ? 'p-1' : 'p-2'}`}>
            <ViewModeNavigation
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />

            <div className="flex-1">
              <ViewRenderer
                viewMode={viewMode}
                setViewMode={onViewModeChange}
                currentLandscape={currentLandscape}
                emotionalState={emotionalState}
                onLandscapeChange={onLandscapeChange}
                onStateChange={onStateChange}
                onStartJourney={onStartJourney}
                transformationStages={transformationStages}
                emotionalJourney={emotionalJourney}
              />
            </div>

            <PoiesisIndicator emotionalState={emotionalState} />
          </CardContent>
        )}

        {/* Settings Panel Overlay */}
        {showSettings && (
          <SettingsPanel onClose={onCloseSettings} />
        )}

        {/* Contextual Guide */}
        <ContextualGuide
          viewMode={viewMode}
          isFirstTime={isFirstTime}
          onGuideComplete={onFirstTimeComplete}
        />

        {/* Resize Handles - Hidden in full screen */}
        {!isMinimized && !isMaximized && !isFullScreen && (
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

export default MainWindow;
