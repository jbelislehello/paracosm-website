
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2, MoreHorizontal } from 'lucide-react';

interface WindowControlsProps {
  isMinimized: boolean;
  isMaximized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

const WindowControls: React.FC<WindowControlsProps> = ({
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose
}) => {
  return (
    <div className="flex gap-1">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onMinimize} 
        className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
      >
        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onMaximize} 
        className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose} 
        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default WindowControls;
