
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2, MoreHorizontal, Expand } from 'lucide-react';

interface WindowControlsProps {
  isMinimized: boolean;
  isMaximized: boolean;
  isFullScreen: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onFullScreen: () => void;
  onClose: () => void;
}

const WindowControls: React.FC<WindowControlsProps> = ({
  isMinimized,
  isMaximized,
  isFullScreen,
  onMinimize,
  onMaximize,
  onFullScreen,
  onClose
}) => {
  return (
    <div className="flex gap-1">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onMinimize} 
        className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
        title={isMinimized ? "Restore" : "Minimize"}
      >
        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onMaximize} 
        className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
        title={isMaximized ? "Restore" : "Maximize"}
      >
        {isMaximized ? <MoreHorizontal className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onFullScreen} 
        className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
        title={isFullScreen ? "Exit Full Screen (Esc)" : "Full Screen (F11)"}
      >
        <Expand className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose} 
        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
        title="Close"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default WindowControls;
