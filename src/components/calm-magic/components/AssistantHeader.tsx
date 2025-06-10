
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';
import WindowControls from './WindowControls';

interface AssistantHeaderProps {
  isMinimized: boolean;
  isMaximized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const AssistantHeader: React.FC<AssistantHeaderProps> = ({
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
  onMouseDown
}) => {
  return (
    <CardHeader 
      className="pb-2 cursor-grab active:cursor-grabbing bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-b"
      onMouseDown={onMouseDown}
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
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
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
  );
};

export default AssistantHeader;
