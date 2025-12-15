import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, GitMerge, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Branch, Message } from '@/hooks/useAgentTileConversation';

interface BranchMergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: Branch[];
  allMessages: Message[];
  tileId: number;
  tileName: string;
  season: string;
  onMergeComplete: () => void;
}

export const BranchMergeDialog: React.FC<BranchMergeDialogProps> = ({
  open,
  onOpenChange,
  branches,
  allMessages,
  tileId,
  tileName,
  season,
  onMergeComplete
}) => {
  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [mergedSummary, setMergedSummary] = useState('');
  const [useAI, setUseAI] = useState(true);

  // Get messages for each branch
  const branchMessages = useMemo(() => {
    const result: Record<string, Message[]> = {};
    branches.forEach(branch => {
      result[branch.id] = allMessages.filter(m => m.branchId === branch.id);
    });
    return result;
  }, [branches, allMessages]);

  // Get selected branch contents
  const selectedContent = useMemo(() => {
    const contents: { branchName: string; messages: Message[] }[] = [];
    selectedBranches.forEach(branchId => {
      const branch = branches.find(b => b.id === branchId);
      if (branch) {
        contents.push({
          branchName: branch.name,
          messages: branchMessages[branchId] || []
        });
      }
    });
    return contents;
  }, [selectedBranches, branches, branchMessages]);

  const toggleBranch = (branchId: string) => {
    const newSelected = new Set(selectedBranches);
    if (newSelected.has(branchId)) {
      newSelected.delete(branchId);
    } else {
      newSelected.add(branchId);
    }
    setSelectedBranches(newSelected);
    setMergedSummary(''); // Reset summary when selection changes
  };

  const generateManualMerge = () => {
    // Simple concatenation of branch contents
    const merged = selectedContent.map(({ branchName, messages }) => {
      const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
      return `## ${branchName}\n${userMessages.join('\n\n')}`;
    }).join('\n\n---\n\n');
    
    setMergedSummary(merged);
  };

  const generateAIMerge = async () => {
    if (selectedContent.length === 0) return;

    setIsGenerating(true);
    try {
      // Prepare conversation content for AI
      const branchContents = selectedContent.map(({ branchName, messages }) => {
        const conversation = messages.map(m => 
          `${m.role === 'assistant' ? 'Guide' : 'User'}: ${m.content}`
        ).join('\n');
        return `### Branch: ${branchName}\n${conversation}`;
      }).join('\n\n');

      const { data, error } = await supabase.functions.invoke('calm-magic-assistant', {
        body: {
          message: `Please synthesize and merge the following conversation branches into a cohesive summary that captures the key insights, themes, and discoveries from all paths explored. Identify connections, tensions, and emergent patterns across the branches.\n\n${branchContents}`,
          mode: 'glitch',
          context: {
            tile: tileName,
            season,
            action: 'merge_branches'
          }
        }
      });

      if (error) throw error;

      const summary = data?.content || data?.response || 'Unable to generate summary';
      setMergedSummary(summary);
    } catch (err) {
      console.error('AI merge error:', err);
      toast({
        variant: 'destructive',
        title: 'Merge failed',
        description: 'Could not generate AI summary. Try manual merge instead.'
      });
      // Fallback to manual merge
      generateManualMerge();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (useAI) {
      generateAIMerge();
    } else {
      generateManualMerge();
    }
  };

  const handleSave = async () => {
    if (!mergedSummary.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ variant: 'destructive', description: 'Please sign in to save.' });
        return;
      }

      const branchNames = Array.from(selectedBranches).map(id => 
        branches.find(b => b.id === id)?.name || id
      );

      const { error } = await supabase.from('polen_entries').insert({
        user_id: user.id,
        tile_id: tileId,
        content: mergedSummary,
        fragment_type: 'text',
        tags: ['merged-insights', ...branchNames],
        season_context: season,
        source_reference: `Merged from branches: ${branchNames.join(', ')}`
      });

      if (error) throw error;

      toast({
        title: '🌟 Insights merged',
        description: `Combined ${selectedBranches.size} branches into a unified fragment.`
      });

      onMergeComplete();
      onOpenChange(false);
      setSelectedBranches(new Set());
      setMergedSummary('');
    } catch (err) {
      console.error('Save error:', err);
      toast({
        variant: 'destructive',
        description: 'Failed to save merged insights.'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-primary" />
            Merge Branch Insights
          </DialogTitle>
          <DialogDescription>
            Select branches to merge their insights into a unified summary fragment.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Branch Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select branches to merge</label>
            <ScrollArea className="h-[140px] border rounded-lg p-3">
              <div className="space-y-2">
                {branches.map(branch => {
                  const msgCount = branchMessages[branch.id]?.length || 0;
                  const userMsgCount = branchMessages[branch.id]?.filter(m => m.role === 'user').length || 0;
                  
                  return (
                    <div 
                      key={branch.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                        selectedBranches.has(branch.id) 
                          ? "bg-primary/10 border border-primary/30" 
                          : "hover:bg-muted"
                      )}
                      onClick={() => toggleBranch(branch.id)}
                    >
                      <Checkbox 
                        checked={selectedBranches.has(branch.id)}
                        onCheckedChange={() => toggleBranch(branch.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{branch.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {userMsgCount} response{userMsgCount !== 1 ? 's' : ''} · {msgCount} total messages
                        </p>
                      </div>
                      {branch.parentBranchId && (
                        <Badge variant="outline" className="text-[10px]">branched</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* AI Toggle & Generate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="use-ai"
                checked={useAI} 
                onCheckedChange={(checked) => setUseAI(!!checked)}
              />
              <label htmlFor="use-ai" className="text-sm flex items-center gap-1 cursor-pointer">
                <Sparkles className="w-3 h-3 text-primary" />
                Use AI to synthesize
              </label>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerate}
              disabled={selectedBranches.size < 2 || isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <GitMerge className="w-3 h-3" />
                  Generate Merge
                </>
              )}
            </Button>
          </div>

          {/* Preview / Edit Merged Content */}
          {mergedSummary && (
            <div className="space-y-2 flex-1 min-h-0">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Merged Summary
                <Badge variant="secondary" className="text-[10px]">editable</Badge>
              </label>
              <Textarea
                value={mergedSummary}
                onChange={(e) => setMergedSummary(e.target.value)}
                className="h-[180px] resize-none text-sm"
                placeholder="Merged insights will appear here..."
              />
            </div>
          )}

          {/* Selection hint */}
          {selectedBranches.size < 2 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Select at least 2 branches to merge their insights
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!mergedSummary.trim()}
            className="gap-2"
          >
            <GitMerge className="w-4 h-4" />
            Save Merged Fragment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
