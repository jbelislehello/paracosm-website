
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Sparkles, Heart, Brain, Settings } from 'lucide-react';
import WindowControls from './WindowControls';
import { useUserPreferences } from '../hooks/useUserPreferences';

interface EnhancedAssistantHeaderProps {
  isMinimized: boolean;
  isMaximized: boolean;
  isFullScreen: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onFullScreen: () => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  emotionalState?: any;
  currentViewMode?: string;
  onOpenSettings?: () => void;
}

const EnhancedAssistantHeader: React.FC<EnhancedAssistantHeaderProps> = ({
  isMinimized,
  isMaximized,
  isFullScreen,
  onMinimize,
  onMaximize,
  onFullScreen,
  onClose,
  onMouseDown,
  emotionalState,
  currentViewMode,
  onOpenSettings
}) => {
  const { preferences } = useUserPreferences();

  const getDominantEmotion = () => {
    if (!emotionalState) return 'balanced';
    const emotions = Object.entries(emotionalState);
    const dominant = emotions.reduce((prev, current) => 
      (typeof current[1] === 'number' && typeof prev[1] === 'number' && current[1] > prev[1]) ? current : prev
    );
    return dominant[0].replace('_level', '');
  };

  const getEmotionalColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      love: 'bg-red-100 text-red-800',
      magic: 'bg-purple-100 text-purple-800',
      calm: 'bg-blue-100 text-blue-800',
      open: 'bg-green-100 text-green-800',
      free: 'bg-yellow-100 text-yellow-800',
      balanced: 'bg-slate-100 text-slate-800'
    };
    return colors[emotion] || 'bg-slate-100 text-slate-800';
  };

  const getVitalityLevel = () => {
    if (!emotionalState) return 0;
    const values = Object.values(emotionalState);
    const numericValues = values.filter((val): val is number => typeof val === 'number');
    
    if (numericValues.length === 0) return 0;
    
    const total = numericValues.reduce((sum, val) => sum + val, 0);
    return Math.round(total / numericValues.length);
  };

  const dominantEmotion = getDominantEmotion();
  const vitalityLevel = getVitalityLevel();

  return (
    <CardHeader 
      className={`pb-3 ${!isFullScreen ? 'cursor-grab active:cursor-grabbing' : ''} bg-gradient-to-r from-purple-50 via-blue-50 to-rose-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-rose-950/30 border-b transition-all duration-300`}
      onMouseDown={!isFullScreen ? onMouseDown : undefined}
    >
      <div className="flex items-center justify-between">
        {!isMinimized && (
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg mb-2">
              <div className="relative">
                <Network className="w-5 h-5 text-purple-600" />
                <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Calm Magic: Expressivity Tool for Poiesis
              </span>
            </CardTitle>
            
            <div className="flex flex-wrap gap-2">
              <Badge className={getEmotionalColor(dominantEmotion)}>
                <Heart className="w-3 h-3 mr-1" />
                {dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)} Dominant
              </Badge>
              
              <Badge variant="outline" className="animate-pulse">
                <Brain className="w-3 h-3 mr-1" />
                Vitalité: {vitalityLevel}%
              </Badge>
              
              {preferences.emotionalProfile.primaryGarden && (
                <Badge variant="secondary">
                  Jardin: {preferences.emotionalProfile.primaryGarden}
                </Badge>
              )}
              
              <Badge variant="outline" className="text-xs">
                Mode: {currentViewMode?.charAt(0).toUpperCase() + currentViewMode?.slice(1)}
              </Badge>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {!isMinimized && onOpenSettings && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenSettings}
              className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
          
          <WindowControls
            isMinimized={isMinimized}
            isMaximized={isMaximized}
            isFullScreen={isFullScreen}
            onMinimize={onMinimize}
            onMaximize={onMaximize}
            onFullScreen={onFullScreen}
            onClose={onClose}
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default EnhancedAssistantHeader;
