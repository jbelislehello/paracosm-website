import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, Activity, Sparkles } from 'lucide-react';
import { useEmbodiedState } from '@/hooks/useEmbodiedState';
import { PermissionGate } from './PermissionGate';
import type { EmbodiedAxesInference } from '@/types/embodied';
import { cn } from '@/lib/utils';

interface BodyAwareCaptureProps {
  onStateChange?: (axes: EmbodiedAxesInference) => void;
  onActiveChange?: (active: boolean) => void;
  compact?: boolean;
}

export function BodyAwareCapture({ onStateChange, onActiveChange, compact = false }: BodyAwareCaptureProps) {
  const {
    state,
    permission,
    requestPermission,
    initModels,
    startDetection,
    stopDetection,
    inferEmotionalAxes,
    streamRef,
  } = useEmbodiedState();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPermissionGate, setShowPermissionGate] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Initialize video element with stream
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [permission, streamRef.current]);
  
  // Notify parent of state changes
  useEffect(() => {
    if (state.isActive && state.confidence > 0.3) {
      const axes = inferEmotionalAxes();
      onStateChange?.(axes);
    }
  }, [state, inferEmotionalAxes, onStateChange]);
  
  // Notify parent of active state
  useEffect(() => {
    onActiveChange?.(state.isActive);
  }, [state.isActive, onActiveChange]);
  
  const handleEnable = useCallback(async () => {
    setIsInitializing(true);
    const granted = await requestPermission();
    
    if (granted && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      await videoRef.current.play();
      
      const initialized = await initModels(videoRef.current);
      if (initialized) {
        startDetection();
      }
    }
    setIsInitializing(false);
  }, [requestPermission, initModels, startDetection, streamRef]);
  
  const handleDisable = useCallback(() => {
    stopDetection();
  }, [stopDetection]);
  
  // Posture indicator color
  const postureColor = {
    tense: 'text-rose-500',
    neutral: 'text-muted-foreground',
    relaxed: 'text-emerald-500',
    engaged: 'text-violet-500',
  }[state.posture];
  
  // Expression emoji
  const expressionEmoji = {
    neutral: '😐',
    smiling: '😊',
    focused: '🎯',
    stressed: '😰',
    calm: '😌',
  }[state.facialExpression];
  
  if (permission !== 'granted' && showPermissionGate) {
    return (
      <PermissionGate
        permission={permission}
        onRequestPermission={handleEnable}
        onDismiss={() => setShowPermissionGate(false)}
      />
    );
  }
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant={state.isActive ? 'default' : 'outline'}
          size="sm"
          onClick={state.isActive ? handleDisable : handleEnable}
          disabled={isInitializing}
          className="gap-2"
        >
          {state.isActive ? (
            <>
              <CameraOff className="w-3 h-3" />
              <span className="hidden sm:inline">Stop</span>
            </>
          ) : (
            <>
              <Camera className="w-3 h-3" />
              <span className="hidden sm:inline">{isInitializing ? 'Loading...' : 'Body-Aware'}</span>
            </>
          )}
        </Button>
        
        {state.isActive && (
          <div className="flex items-center gap-1">
            <span className="text-sm">{expressionEmoji}</span>
            <Badge variant="outline" className={cn('text-[10px]', postureColor)}>
              {state.posture}
            </Badge>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="relative rounded-lg overflow-hidden bg-background border border-border">
      {/* Video Preview */}
      <div className="relative aspect-video bg-muted">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            'w-full h-full object-cover',
            !state.isActive && 'opacity-0'
          )}
        />
        
        {!state.isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Active indicator */}
        {state.isActive && (
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] text-white bg-black/50 px-1 rounded">LIVE</span>
          </div>
        )}
      </div>
      
      {/* State Display */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Body-Aware Sensing</span>
          </div>
          
          <Button
            variant={state.isActive ? 'destructive' : 'default'}
            size="sm"
            onClick={state.isActive ? handleDisable : handleEnable}
            disabled={isInitializing}
          >
            {state.isActive ? 'Stop' : isInitializing ? 'Loading...' : 'Start'}
          </Button>
        </div>
        
        {state.isActive && state.confidence > 0.2 && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-muted/50">
              <div className="text-lg">{expressionEmoji}</div>
              <div className="text-[10px] text-muted-foreground capitalize">
                {state.facialExpression}
              </div>
            </div>
            
            <div className="p-2 rounded bg-muted/50">
              <div className={cn('text-sm font-medium capitalize', postureColor)}>
                {state.posture}
              </div>
              <div className="text-[10px] text-muted-foreground">Posture</div>
            </div>
            
            <div className="p-2 rounded bg-muted/50">
              <div className="text-sm font-medium">
                {state.gestureDetected === 'none' ? '—' : state.gestureDetected.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-muted-foreground">Gesture</div>
            </div>
          </div>
        )}
        
        {state.isActive && state.confidence > 0.3 && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>Axes suggestion ready • {Math.round(state.confidence * 100)}% confidence</span>
          </div>
        )}
      </div>
    </div>
  );
}
