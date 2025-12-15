import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GitBranch, ChevronDown, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Branch } from '@/hooks/useAgentTileConversation';

interface BranchNavigatorProps {
  branches: Branch[];
  currentBranchId: string;
  onSwitchBranch: (branchId: string) => void;
  onCreateBranch?: () => void;
  className?: string;
}

export const BranchNavigator: React.FC<BranchNavigatorProps> = ({
  branches,
  currentBranchId,
  onSwitchBranch,
  onCreateBranch,
  className
}) => {
  const currentBranch = branches.find(b => b.id === currentBranchId);
  
  if (branches.length <= 1 && !onCreateBranch) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("gap-2 h-7 text-xs", className)}
        >
          <GitBranch className="w-3 h-3" />
          <span className="max-w-[100px] truncate">{currentBranch?.name || 'Main Path'}</span>
          {branches.length > 1 && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
              {branches.length}
            </Badge>
          )}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <ScrollArea className="max-h-[200px]">
          {branches.map((branch) => (
            <DropdownMenuItem
              key={branch.id}
              onClick={() => onSwitchBranch(branch.id)}
              className="gap-2"
            >
              {branch.id === currentBranchId ? (
                <Check className="w-3 h-3 text-primary" />
              ) : (
                <div className="w-3 h-3" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{branch.name}</p>
                {branch.parentBranchId && (
                  <p className="text-[10px] text-muted-foreground">
                    branched from {branches.find(b => b.id === branch.parentBranchId)?.name || 'unknown'}
                  </p>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        
        {onCreateBranch && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCreateBranch} className="gap-2 text-primary">
              <Plus className="w-3 h-3" />
              Create new branch here
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BranchNavigator;
