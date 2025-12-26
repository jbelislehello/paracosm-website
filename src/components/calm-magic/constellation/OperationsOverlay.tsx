import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ManifoldEntry } from '@/hooks/useManifoldData';

interface ProjectedEntry extends ManifoldEntry {
  projectedX: number;
  projectedY: number;
  projectedZ: number;
  isOnCriticalPath?: boolean;
  dependencyCount?: number;
}

interface OperationsOverlayProps {
  entries: ProjectedEntry[];
}

export function OperationsOverlay({ entries }: OperationsOverlayProps) {
  // Get critical path entries
  const criticalPathEntries = entries.filter(e => e.isOnCriticalPath);
  const blockedNodes = entries.filter(e => (e.dependencyCount || 0) >= 3);
  
  // Calculate critical path length
  const criticalPathLength = criticalPathEntries.length;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Critical Path Indicator Line */}
      {criticalPathLength > 0 && (
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2">
          {/* Main critical path line */}
          <div className="relative h-1 bg-gradient-to-r from-destructive/20 via-destructive to-destructive/20 rounded-full">
            {/* Animated pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-destructive/50 to-transparent animate-pulse rounded-full" />
            
            {/* Critical path nodes */}
            {criticalPathEntries.slice(0, 5).map((entry, index) => (
              <div
                key={entry.id}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-destructive border-2 border-background shadow-lg shadow-destructive/50"
                style={{ 
                  left: `${(index / Math.max(criticalPathEntries.length - 1, 1)) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
          
          {/* Direction arrows */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2">
            <ArrowRight className="w-4 h-4 text-destructive" />
          </div>
        </div>
      )}

      {/* "Why are we stuck?" indicator */}
      {blockedNodes.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Badge variant="destructive" className="gap-1.5 pointer-events-auto">
            <AlertCircle className="w-3 h-3" />
            {blockedNodes.length} bottleneck{blockedNodes.length > 1 ? 's' : ''} detected
          </Badge>
        </div>
      )}

      {/* Dependency Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 text-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-destructive rounded-full" />
          <span className="text-muted-foreground">Critical Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-px bg-muted-foreground/30" />
          <span className="text-muted-foreground">Dependencies</span>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="absolute bottom-4 right-4 flex items-center gap-3 pointer-events-auto">
        <Badge variant="outline" className="text-[10px] gap-1">
          <Zap className="w-3 h-3 text-destructive" />
          Critical: {criticalPathLength}
        </Badge>
        <Badge variant="outline" className="text-[10px] gap-1">
          Total: {entries.length}
        </Badge>
      </div>

      {/* Grid overlay for dependency visualization */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dep-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="currentColor" className="text-muted-foreground" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dep-grid)" />
      </svg>
    </div>
  );
}
