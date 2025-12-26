import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Link2, 
  ArrowRight, 
  Zap, 
  Repeat, 
  X,
  Loader2
} from 'lucide-react';
import { ManifoldEntry } from '@/hooks/useManifoldData';
import { EdgeType } from '@/hooks/useManifoldEdges';
import { SEASON_HEX_COLORS } from '@/utils/torusManifoldMath';
import { cn } from '@/lib/utils';

interface EdgeCreatorProps {
  sourceEntry: ManifoldEntry | null;
  targetEntry: ManifoldEntry | null;
  isCreating: boolean;
  onCreateEdge: (edgeType: EdgeType) => void;
  onCancel: () => void;
}

const EDGE_TYPES: { type: EdgeType; icon: typeof Link2; label: string; description: string; color: string }[] = [
  { 
    type: 'resonance', 
    icon: Link2, 
    label: 'Resonance', 
    description: 'Same theme or feeling',
    color: 'text-violet-500 border-violet-500/50 hover:bg-violet-500/10'
  },
  { 
    type: 'causality', 
    icon: ArrowRight, 
    label: 'Causality', 
    description: 'One led to another',
    color: 'text-amber-500 border-amber-500/50 hover:bg-amber-500/10'
  },
  { 
    type: 'echo', 
    icon: Repeat, 
    label: 'Echo', 
    description: 'Pattern repeating',
    color: 'text-cyan-500 border-cyan-500/50 hover:bg-cyan-500/10'
  }
];

function EntryPreview({ entry, label }: { entry: ManifoldEntry | null; label: string }) {
  if (!entry) {
    return (
      <div className="flex-1 min-w-0 p-3 border border-dashed border-border/50 rounded-lg">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm text-muted-foreground/60 italic">Click an event to select</p>
      </div>
    );
  }

  const hexColor = `#${SEASON_HEX_COLORS[entry.season].toString(16).padStart(6, '0')}`;

  return (
    <div className="flex-1 min-w-0 p-3 border border-border/50 rounded-lg bg-muted/30">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2 mb-1">
        <span 
          className="w-2 h-2 rounded-full shrink-0" 
          style={{ backgroundColor: hexColor }} 
        />
        <Badge variant="outline" className="text-[10px]" style={{ borderColor: hexColor, color: hexColor }}>
          {entry.season}
        </Badge>
      </div>
      <p className="text-xs line-clamp-2">{entry.content}</p>
    </div>
  );
}

export function EdgeCreator({ 
  sourceEntry, 
  targetEntry, 
  isCreating,
  onCreateEdge, 
  onCancel 
}: EdgeCreatorProps) {
  const canCreate = sourceEntry && targetEntry && sourceEntry.id !== targetEntry.id;

  return (
    <Card className="animate-in slide-in-from-bottom-4 duration-300 border-primary/30 bg-background/95 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Create Connection</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Entry Previews */}
        <div className="flex items-center gap-2">
          <EntryPreview entry={sourceEntry} label="From" />
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
          <EntryPreview entry={targetEntry} label="To" />
        </div>

        {/* Edge Type Buttons */}
        {canCreate && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Choose connection type:</p>
            <div className="grid grid-cols-3 gap-2">
              {EDGE_TYPES.map(({ type, icon: Icon, label, description, color }) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  disabled={isCreating}
                  onClick={() => onCreateEdge(type)}
                  className={cn(
                    "flex-col h-auto py-3 gap-1 transition-all",
                    color
                  )}
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">{label}</span>
                  <span className="text-[10px] opacity-70">{description}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!canCreate && (
          <p className="text-xs text-muted-foreground text-center">
            {!sourceEntry && !targetEntry && "Click two different events to connect them"}
            {sourceEntry && !targetEntry && "Now click a second event to connect"}
            {sourceEntry && targetEntry && sourceEntry.id === targetEntry.id && "Select a different event"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
