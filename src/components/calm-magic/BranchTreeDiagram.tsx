import React, { useMemo } from 'react';
import { GitBranch, Circle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Branch } from '@/hooks/useAgentTileConversation';

interface TreeNode {
  branch: Branch;
  children: TreeNode[];
  depth: number;
  messageCount?: number;
}

interface BranchTreeDiagramProps {
  branches: Branch[];
  currentBranchId: string;
  onSwitchBranch: (branchId: string) => void;
  messageCountByBranch?: Record<string, number>;
}

export const BranchTreeDiagram: React.FC<BranchTreeDiagramProps> = ({
  branches,
  currentBranchId,
  onSwitchBranch,
  messageCountByBranch = {}
}) => {
  // Build tree structure from flat branches array
  const treeRoot = useMemo(() => {
    const branchMap = new Map<string, TreeNode>();
    
    // Create nodes for all branches
    branches.forEach(branch => {
      branchMap.set(branch.id, {
        branch,
        children: [],
        depth: 0,
        messageCount: messageCountByBranch[branch.id] || 0
      });
    });
    
    // Find root and build tree
    let root: TreeNode | null = null;
    
    branches.forEach(branch => {
      const node = branchMap.get(branch.id)!;
      
      if (!branch.parentBranchId) {
        root = node;
      } else {
        const parent = branchMap.get(branch.parentBranchId);
        if (parent) {
          parent.children.push(node);
        }
      }
    });
    
    // Calculate depths
    const setDepths = (node: TreeNode, depth: number) => {
      node.depth = depth;
      node.children.forEach(child => setDepths(child, depth + 1));
    };
    
    if (root) {
      setDepths(root, 0);
    }
    
    return root;
  }, [branches, messageCountByBranch]);

  const renderNode = (node: TreeNode, isLast: boolean = false, parentPath: boolean[] = []) => {
    const isCurrent = node.branch.id === currentBranchId;
    const hasChildren = node.children.length > 0;
    
    return (
      <div key={node.branch.id} className="relative">
        {/* Connection lines */}
        <div className="flex items-stretch">
          {/* Vertical lines from ancestors */}
          {parentPath.map((showLine, index) => (
            <div key={index} className="w-6 flex-shrink-0 relative">
              {showLine && (
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              )}
            </div>
          ))}
          
          {/* Branch connector */}
          {node.depth > 0 && (
            <div className="w-6 flex-shrink-0 relative">
              <div className="absolute left-3 top-0 h-4 w-px bg-border" />
              <div className="absolute left-3 top-4 w-3 h-px bg-border" />
              {!isLast && (
                <div className="absolute left-3 top-4 bottom-0 w-px bg-border" />
              )}
            </div>
          )}
          
          {/* Node content */}
          <button
            onClick={() => onSwitchBranch(node.branch.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left flex-1 min-w-0",
              "hover:bg-accent/50",
              isCurrent 
                ? "bg-primary/10 border border-primary/30 text-primary" 
                : "bg-muted/30 border border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Branch icon */}
            <div className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
              isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              {node.depth === 0 ? (
                <Circle className="h-3 w-3" />
              ) : (
                <GitBranch className="h-3 w-3" />
              )}
            </div>
            
            {/* Branch info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-medium truncate text-sm",
                  isCurrent && "text-primary"
                )}>
                  {node.branch.name}
                </span>
                {isCurrent && (
                  <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full flex-shrink-0">
                    current
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{node.messageCount || 0} messages</span>
                {hasChildren && (
                  <span className="flex items-center gap-0.5">
                    <ChevronRight className="h-3 w-3" />
                    {node.children.length} branch{node.children.length > 1 ? 'es' : ''}
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>
        
        {/* Render children */}
        {hasChildren && (
          <div className="mt-1">
            {node.children.map((child, index) => 
              renderNode(
                child, 
                index === node.children.length - 1,
                [...parentPath, !isLast && node.depth > 0]
              )
            )}
          </div>
        )}
      </div>
    );
  };

  if (!treeRoot || branches.length <= 1) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No branches yet</p>
        <p className="text-xs mt-1">Create a branch from any assistant message to explore alternative paths</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <GitBranch className="h-4 w-4" />
          <span>Conversation Tree</span>
          <span className="ml-auto">{branches.length} branch{branches.length > 1 ? 'es' : ''}</span>
        </div>
        {renderNode(treeRoot, true)}
      </div>
    </ScrollArea>
  );
};
