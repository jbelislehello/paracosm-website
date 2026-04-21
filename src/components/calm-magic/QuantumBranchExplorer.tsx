import React, { useMemo } from 'react';
import { GitBranch, Eye, EyeOff } from 'lucide-react';
import type { QuadrantPosition } from '@/types/trajectory';

export interface QuantumBranch {
  id: string;
  label: string;
  position: QuadrantPosition;
  amplitude: number; // 0-1, probability weight
  observed: boolean;
  parentId: string | null;
  tileId: number;
  timestamp: string;
}

interface QuantumBranchExplorerProps {
  branches: QuantumBranch[];
  currentBranchId?: string;
  onBranchSelect?: (branch: QuantumBranch) => void;
}

const QuantumBranchExplorer: React.FC<QuantumBranchExplorerProps> = ({
  branches,
  currentBranchId,
  onBranchSelect,
}) => {
  const sortedBranches = useMemo(() => 
    [...branches].sort((a, b) => b.amplitude - a.amplitude),
    [branches]
  );

  const observedCount = branches.filter(b => b.observed).length;
  const superpositionCount = branches.filter(b => !b.observed).length;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Quantum Branch Explorer</h3>
        </div>
        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {observedCount} observed
          </span>
          <span className="flex items-center gap-1">
            <EyeOff className="w-3 h-3" /> {superpositionCount} superposed
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Each decision creates parallel possibility branches. Observed branches solidify; 
        others remain in superposition until collapsed by action.
      </p>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sortedBranches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => onBranchSelect?.(branch)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
              branch.id === currentBranchId
                ? 'border-primary bg-primary/5'
                : branch.observed
                ? 'border-border bg-card hover:bg-accent/50'
                : 'border-dashed border-muted bg-muted/20 hover:bg-muted/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium truncate flex-1">
                {branch.label}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                branch.observed 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {branch.observed ? 'Observed' : 'Superposed'}
              </span>
            </div>

            {/* Amplitude bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${branch.amplitude * 100}%`,
                    backgroundColor: branch.observed 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--muted-foreground))',
                    opacity: branch.observed ? 1 : 0.5,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-8 text-right">
                {Math.round(branch.amplitude * 100)}%
              </span>
            </div>

            {/* Position indicator */}
            <div className="text-[10px] text-muted-foreground mt-1">
              Tile {branch.tileId} · ({branch.position.x.toFixed(2)}, {branch.position.y.toFixed(2)})
            </div>
          </button>
        ))}
      </div>

      {branches.length === 0 && (
        <p className="text-center text-xs text-muted-foreground py-6">
          No branches yet. Start exploring tiles to create quantum possibilities.
        </p>
      )}
    </div>
  );
};

export default QuantumBranchExplorer;
