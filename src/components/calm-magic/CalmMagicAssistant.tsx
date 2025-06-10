
import React, { useState } from 'react';
import MainWindow from './components/MainWindow';
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
  
  // State management
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
      <MainWindow
        windowStyle={windowStyle}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        viewMode={viewMode}
        currentLandscape={currentLandscape}
        emotionalState={emotionalState}
        transformationStages={transformationStages}
        emotionalJourney={emotionalJourney}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onMaximize={handleMaximize}
        onClose={() => setIsOpen(false)}
        onMouseDown={handleMouseDown}
        onViewModeChange={setViewMode}
        onLandscapeChange={setCurrentLandscape}
        onStateChange={setEmotionalState}
        onStartJourney={onStartJourney}
        handleResizeStart={handleResizeStart}
      />
    </ModeProvider>
  );
};

export default CalmMagicAssistant;
