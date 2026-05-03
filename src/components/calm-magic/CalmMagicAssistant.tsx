
import React, { useState, useEffect } from 'react';
import MainWindow from './components/MainWindow';
import { useWindowControls } from './hooks/useWindowControls';
import { ModeProvider } from './context/ModeContext';
import { useUserPreferences } from './hooks/useUserPreferences';
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
  const [showSettings, setShowSettings] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  
  const { preferences, updatePreferences } = useUserPreferences();
  
  const {
    position,
    size,
    isDragging,
    isMaximized,
    isFullScreen,
    handleMouseDown,
    handleResizeStart,
    handleMaximize,
    handleFullScreen
  } = useWindowControls();
  
  // State management
  const [currentLandscape, setCurrentLandscape] = useState(0);
  const [viewMode, setViewMode] = useState<'journey' | 'spiral' | 'tests' | 'learning' | 'overview' | 'tools' | 'dream'>('tools');
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

  // Initialize preferences and check first time
  useEffect(() => {
    if (isOpen) {
      // Set initial view mode from preferences
      setViewMode(preferences.preferredViewMode as any || 'tools');
      
      // Check if this is first time opening
      const hasSeenBefore = localStorage.getItem('calmMagicSeenBefore');
      if (!hasSeenBefore) {
        setIsFirstTime(true);
        localStorage.setItem('calmMagicSeenBefore', 'true');
      }
    }
  }, [isOpen, preferences.preferredViewMode]);

  // Update emotional profile when emotional state changes significantly
  useEffect(() => {
    if (emotionalState && Object.keys(emotionalState).length > 0) {
      const emotions = Object.entries(emotionalState);
      const dominant = emotions.reduce((prev, current) => 
        (current[1] as number) > (prev[1] as number) ? current : prev
      );
      
      const dominantAxis = dominant[0].replace('_level', '');
      
      if (dominantAxis !== preferences.emotionalProfile.dominantAxis) {
        updatePreferences({
          emotionalProfile: {
            ...preferences.emotionalProfile,
            dominantAxis,
            lastAssessmentDate: new Date().toISOString()
          }
        });
      }
    }
  }, [emotionalState, preferences.emotionalProfile.dominantAxis, updatePreferences]);

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

  const handleViewModeChange = (mode: 'journey' | 'spiral' | 'tests' | 'learning' | 'overview' | 'tools' | 'dream') => {
    setViewMode(mode);
    // Update user preferences
    updatePreferences({
      preferredViewMode: mode
    });
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
    zIndex: isFullScreen ? 100 : 50,
    cursor: isDragging ? 'grabbing' : 'default'
  };

  return (
    <ModeProvider>
      <MainWindow
        windowStyle={windowStyle}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        isFullScreen={isFullScreen}
        viewMode={viewMode}
        currentLandscape={currentLandscape}
        emotionalState={emotionalState}
        transformationStages={transformationStages}
        emotionalJourney={emotionalJourney}
        preferences={preferences}
        showSettings={showSettings}
        isFirstTime={isFirstTime}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onMaximize={handleMaximize}
        onFullScreen={handleFullScreen}
        onClose={() => setIsOpen(false)}
        onMouseDown={handleMouseDown}
        onViewModeChange={handleViewModeChange}
        onLandscapeChange={setCurrentLandscape}
        onStateChange={setEmotionalState}
        onStartJourney={onStartJourney}
        onOpenSettings={() => setShowSettings(true)}
        onCloseSettings={() => setShowSettings(false)}
        onFirstTimeComplete={() => setIsFirstTime(false)}
        handleResizeStart={handleResizeStart}
      />
    </ModeProvider>
  );
};

export default CalmMagicAssistant;
