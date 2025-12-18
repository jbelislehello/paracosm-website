import { Button } from '@/components/ui/button';
import { Camera, ShieldCheck, X } from 'lucide-react';
import type { CameraPermission } from '@/types/embodied';

interface PermissionGateProps {
  permission: CameraPermission;
  onRequestPermission: () => void;
  onDismiss: () => void;
}

export function PermissionGate({ permission, onRequestPermission, onDismiss }: PermissionGateProps) {
  if (permission === 'granted') return null;
  
  return (
    <div className="relative bg-muted/50 rounded-lg p-4 border border-border">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={onDismiss}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Camera className="w-6 h-6 text-primary" />
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Body-Aware Mode</h4>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            {permission === 'denied' 
              ? 'Camera access was denied. Please enable it in your browser settings.'
              : 'Enable camera to detect posture and expression for enhanced emotional check-ins.'}
          </p>
        </div>
        
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3 h-3" />
          <span>Processed locally, never stored</span>
        </div>
        
        {permission !== 'denied' && (
          <Button
            size="sm"
            onClick={onRequestPermission}
            className="gap-2"
          >
            <Camera className="w-3 h-3" />
            Enable Camera
          </Button>
        )}
      </div>
    </div>
  );
}
