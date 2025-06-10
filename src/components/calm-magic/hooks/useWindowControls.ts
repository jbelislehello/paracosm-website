
import { useState, useRef, useCallback, useEffect } from 'react';

export const useWindowControls = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 600, height: 700 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<string>('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previousState, setPreviousState] = useState({ x: 100, y: 100, width: 600, height: 700 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized || isFullScreen) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position, isMaximized, isFullScreen]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !isMaximized && !isFullScreen) {
      const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
    
    if (isResizing && !isFullScreen) {
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
  }, [isDragging, isResizing, dragStart, resizeStart, resizeType, position, size, isMaximized, isFullScreen]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeType('');
  }, []);

  const handleResizeStart = (e: React.MouseEvent, type: string) => {
    if (isFullScreen) return;
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
    if (isFullScreen) {
      // Exit full screen first
      handleFullScreen();
      return;
    }

    if (isMaximized) {
      setIsMaximized(false);
      setSize({ width: previousState.width, height: previousState.height });
      setPosition({ x: previousState.x, y: previousState.y });
    } else {
      setPreviousState({ x: position.x, y: position.y, width: size.width, height: size.height });
      setIsMaximized(true);
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setPosition({ x: 20, y: 20 });
    }
  };

  const handleFullScreen = () => {
    if (isFullScreen) {
      // Exit full screen
      setIsFullScreen(false);
      if (isMaximized) {
        setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
        setPosition({ x: 20, y: 20 });
      } else {
        setSize({ width: previousState.width, height: previousState.height });
        setPosition({ x: previousState.x, y: previousState.y });
      }
    } else {
      // Enter full screen
      if (!isMaximized) {
        setPreviousState({ x: position.x, y: position.y, width: size.width, height: size.height });
      }
      setIsFullScreen(true);
      setIsMaximized(false);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }
  };

  // Keyboard shortcuts for full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        handleFullScreen();
      } else if (e.key === 'Escape' && isFullScreen) {
        handleFullScreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

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

  return {
    position,
    size,
    isDragging,
    isMaximized,
    isFullScreen,
    handleMouseDown,
    handleResizeStart,
    handleMaximize,
    handleFullScreen
  };
};
