import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, Send, Sparkles, ArrowRight, Loader2, Check, ArrowLeft, Maximize2, Minimize2, Save, MessageSquare, GitBranch, Network, GitMerge, ChevronDown, MapPin } from 'lucide-react';
import { TILE_CONTENTS, ROW_LABELS, COLUMN_LABELS } from '@/data/tileContents';
import { useAgentTileConversation } from '@/hooks/useAgentTileConversation';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { BranchNavigator } from './BranchNavigator';
import { BranchTreeDiagram } from './BranchTreeDiagram';
import { BranchMergeDialog } from './BranchMergeDialog';
import { getSemanticMeaning, ROW_MEANINGS, COL_MEANINGS, SEASON_MEANINGS } from '@/utils/tileSemanticMeaning';

// Poetic greeting component for tile intersections
const PoeticTileGreeting: React.FC<{ row: number; col: number; season?: string }> = ({ row, col, season }) => {
  const semanticMeaning = getSemanticMeaning(row, col);
  const rowDeep = ROW_MEANINGS[row]?.deep || 'the unknown';
  const colDeep = COL_MEANINGS[col]?.deep || 'mystery';
  const seasonEssence = season ? SEASON_MEANINGS[season]?.essence : null;
  
  return (
    <div className="text-center py-4 px-6 bg-gradient-to-b from-primary/5 to-transparent rounded-xl mb-4 animate-fade-in">
      <p className="text-xs uppercase tracking-widest text-muted-foreground/70 mb-2">
        You have arrived at
      </p>
      <p className="text-sm italic text-foreground/80 leading-relaxed">
        {semanticMeaning}
      </p>
      {seasonEssence && (
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">
          In this season of <span className="text-primary/80">{seasonEssence}</span>
        </p>
      )}
    </div>
  );
};

interface MinimalistTileCardProps {
  selectedTile: { row: number; col: number };
  board: string;
  currentSeason?: string;
  projectId?: string | null;
  onClose: () => void;
  onSavePolen: (content: string, tileId: number) => Promise<void>;
  onExpandToFull?: () => void;
  embedded?: boolean;
}

const POSTURES = [
  { id: 'receptive', label: 'Receptive', desc: 'Listen before acting' },
  { id: 'curious', label: 'Curious', desc: 'Wonder without judgment' },
  { id: 'experimental', label: 'Experimental', desc: 'Try small, learn fast' },
  { id: 'patient', label: 'Patient', desc: 'Let emergence unfold' },
];

const ATTITUDES = [
  { id: 'beginner', label: "Beginner's Mind", icon: '🌱' },
  { id: 'play', label: 'Playful Inquiry', icon: '✨' },
  { id: 'care', label: 'Careful Attention', icon: '💫' },
  { id: 'trust', label: 'Trust the Process', icon: '🌀' },
];

const STEPS = [
  { id: 1, name: 'Ground', instruction: 'How will you approach this?' },
  { id: 2, name: 'Orient', instruction: 'What perspective will you hold?' },
  { id: 3, name: 'Explore', instruction: 'What might help you here?' },
  { id: 4, name: 'Respond', instruction: 'What emerges for you?' },
];

export const MinimalistTileCard: React.FC<MinimalistTileCardProps> = ({
  selectedTile,
  board,
  currentSeason,
  projectId,
  onClose,
  onSavePolen,
  onExpandToFull,
  embedded = false,
}) => {
  const tileId = selectedTile.row * 8 + selectedTile.col + 1;
  const tileContent = TILE_CONTENTS.find(t => t.id === tileId);
  
  const [response, setResponse] = useState('');
  const [selectedPosture, setSelectedPosture] = useState<string | null>(null);
  const [selectedAttitude, setSelectedAttitude] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [quickMode, setQuickMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  const [showBranchTree, setShowBranchTree] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [branchFromMessageId, setBranchFromMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { 
    messages, 
    allMessages,
    branches,
    currentBranchId,
    isLoading,
    isSaving: conversationSaving,
    lastSavedAt,
    sendResponse, 
    saveConversationAsPolen,
    createBranch,
    switchBranch
  } = useAgentTileConversation(
    selectedTile,
    currentSeason || 'POLLENS',
    true,
    projectId
  );

  const latestQuestion = messages.filter(m => m.role === 'assistant').pop()?.content || 
    tileContent?.glitchQuestion || 
    "What's alive for you here?";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle saving entire conversation
  const handleSaveConversation = async () => {
    if (messages.length < 2) {
      toast({ description: "Have a conversation first before saving." });
      return;
    }
    const saved = await saveConversationAsPolen(false);
    if (saved) {
      toast({ 
        title: "💾 Conversation saved",
        description: "Your dialogue has been captured as a fragment." 
      });
    } else {
      toast({ 
        variant: "destructive",
        description: "Failed to save conversation." 
      });
    }
  };

  // Save conversation on close if not already saved
  const handleClose = async () => {
    if (messages.length >= 2) {
      await saveConversationAsPolen(true);
    }
    onClose();
  };

  // Handle creating a branch from a specific message
  const handleCreateBranch = (messageId: string) => {
    const branchId = createBranch(messageId);
    if (branchId) {
      toast({ 
        title: "🌿 Branch created",
        description: "Explore a new path from this point." 
      });
      setBranchFromMessageId(null);
    }
  };

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setIsSaving(true);
    
    // Conversation flows naturally into the ontology - no separate save needed
    await sendResponse(response);
    
    setResponse('');
    setIsSaving(false);
  };

  const suggestedActivities = [
    'Pause and notice what arises',
    'Sketch a rough diagram',
    'Speak your thoughts aloud',
    'Write 3 wild possibilities',
    'Ask "what if the opposite?"',
  ];

  const canProceed = (step: number) => {
    if (step === 1) return !!selectedPosture;
    if (step === 2) return !!selectedAttitude;
    if (step === 3) return true; // Activities are optional
    return false;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-3 border-b border-border/50 bg-muted/20">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step.id}>
          <button
            onClick={() => {
              // Allow clicking back to previous steps
              if (step.id < currentStep) setCurrentStep(step.id);
            }}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full transition-all",
              currentStep > step.id && "cursor-pointer hover:bg-primary/10",
              currentStep < step.id && "opacity-50 cursor-not-allowed"
            )}
            disabled={currentStep < step.id}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              currentStep > step.id 
                ? "bg-primary text-primary-foreground" 
                : currentStep === step.id 
                  ? "bg-primary/20 text-primary ring-2 ring-primary" 
                  : "bg-muted text-muted-foreground"
            )}>
              {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
            </div>
            <span className={cn(
              "text-xs hidden sm:block",
              currentStep === step.id ? "font-medium text-foreground" : "text-muted-foreground"
            )}>
              {step.name}
            </span>
          </button>
          {idx < STEPS.length - 1 && (
            <ArrowRight className={cn(
              "w-3 h-3 flex-shrink-0",
              currentStep > step.id ? "text-primary" : "text-muted-foreground/50"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStepContent = () => {
    const currentStepData = STEPS.find(s => s.id === currentStep);
    
    return (
      <div className="space-y-4">
        {/* Poetic Greeting on first step */}
        {currentStep === 1 && (
          <PoeticTileGreeting row={selectedTile.row} col={selectedTile.col} season={currentSeason} />
        )}
        
        {/* Step instruction */}
        <div className="text-center">
          <p className="text-sm font-medium text-primary">{currentStepData?.instruction}</p>
        </div>

        {/* Step 1: Ground (Posture) */}
        {currentStep === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {POSTURES.map((posture) => (
              <button
                key={posture.id}
                onClick={() => setSelectedPosture(selectedPosture === posture.id ? null : posture.id)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  selectedPosture === posture.id
                    ? "bg-primary/10 border-primary ring-1 ring-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <p className="font-medium text-sm">{posture.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{posture.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Orient (Attitude) */}
        {currentStep === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {ATTITUDES.map((attitude) => (
              <button
                key={attitude.id}
                onClick={() => setSelectedAttitude(selectedAttitude === attitude.id ? null : attitude.id)}
                className={cn(
                  "p-4 rounded-xl border text-center transition-all",
                  selectedAttitude === attitude.id
                    ? "bg-primary/10 border-primary ring-1 ring-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <span className="text-3xl block mb-2">{attitude.icon}</span>
                <p className="text-sm font-medium">{attitude.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Explore (Activities) */}
        {currentStep === 3 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center italic">(Optional — choose any that resonate)</p>
            <div className="grid gap-2">
              {suggestedActivities.map((activity, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-primary/60 flex-shrink-0" />
                  <span className="text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Respond */}
        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Recap question */}
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <Sparkles className="w-5 h-5 mx-auto text-primary/60 mb-2" />
              <p className="text-base font-medium">{latestQuestion}</p>
            </div>
            
            {/* Selected context badges */}
            <div className="flex justify-center gap-2 flex-wrap">
              {selectedPosture && (
                <Badge variant="secondary" className="text-xs">
                  {POSTURES.find(p => p.id === selectedPosture)?.label}
                </Badge>
              )}
              {selectedAttitude && (
                <Badge variant="secondary" className="text-xs">
                  {ATTITUDES.find(a => a.id === selectedAttitude)?.icon} {ATTITUDES.find(a => a.id === selectedAttitude)?.label}
                </Badge>
              )}
            </div>
            
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="What emerges for you?"
              className="min-h-[120px] resize-none border-border/50 focus:border-primary/50"
              autoFocus
            />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < 4 ? (
            <div className="flex gap-2">
              {currentStep === 3 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentStep(4)}
                >
                  Skip
                </Button>
              )}
              <Button 
                size="sm"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed(currentStep) && currentStep !== 3}
                className="gap-1"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!response.trim() || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Speak
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderQuickMode = () => (
    <div className="space-y-6">
      {/* Poetic Greeting */}
      <PoeticTileGreeting row={selectedTile.row} col={selectedTile.col} season={currentSeason} />
      
      {/* Core Question as conversational bubble */}
      <div className="flex justify-start">
        <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%] shadow-sm">
          <p className="font-bold text-base leading-relaxed">{latestQuestion}</p>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Thinking...
            </div>
          )}
        </div>
      </div>

      {/* Posture Selection */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Choose your posture</p>
        <div className="flex flex-wrap justify-center gap-2">
          {POSTURES.map((posture) => (
            <button
              key={posture.id}
              onClick={() => setSelectedPosture(selectedPosture === posture.id ? null : posture.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs transition-all",
                selectedPosture === posture.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {posture.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attitude Selection */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Adopt an attitude</p>
        <div className="flex justify-center gap-3">
          {ATTITUDES.map((attitude) => (
            <button
              key={attitude.id}
              onClick={() => setSelectedAttitude(selectedAttitude === attitude.id ? null : attitude.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                selectedAttitude === attitude.id
                  ? "bg-primary/10 ring-1 ring-primary"
                  : "hover:bg-muted"
              )}
            >
              <span className="text-xl">{attitude.icon}</span>
              <span className="text-[10px] text-muted-foreground">{attitude.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Branch Navigator & Conversation History Toggle */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {branches.length > 1 && (
          <BranchNavigator 
            branches={branches}
            currentBranchId={currentBranchId}
            onSwitchBranch={switchBranch}
          />
        )}
        <div className="flex gap-2 ml-auto">
          {branches.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMergeDialog(true)}
                className="gap-2 text-xs text-muted-foreground"
              >
                <GitMerge className="w-3 h-3" />
                Merge
              </Button>
              <Button
                variant={showBranchTree ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowBranchTree(!showBranchTree);
                  if (!showBranchTree) setShowConversationHistory(false);
                }}
                className="gap-2 text-xs text-muted-foreground"
              >
                <Network className="w-3 h-3" />
                Tree
              </Button>
            </>
          )}
          {messages.length > 1 && (
            <Button
              variant={showConversationHistory ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setShowConversationHistory(!showConversationHistory);
                if (!showConversationHistory) setShowBranchTree(false);
              }}
              className="gap-2 text-xs text-muted-foreground"
            >
              <MessageSquare className="w-3 h-3" />
              Chat ({messages.length})
            </Button>
          )}
        </div>
      </div>

      {/* Branch Merge Dialog */}
      <BranchMergeDialog
        open={showMergeDialog}
        onOpenChange={setShowMergeDialog}
        branches={branches}
        allMessages={allMessages}
        tileId={tileId}
        tileName={tileContent?.name || 'Unknown Tile'}
        season={currentSeason || 'POLLENS'}
        projectId={projectId}
        onMergeComplete={() => {
          toast({
            title: "✨ Merge complete",
            description: "Your unified insights have been saved."
          });
        }}
      />

      {/* Branch Tree Diagram */}
      {showBranchTree && branches.length > 1 && (
        <div className={cn(
          "border rounded-lg bg-muted/20",
          isExpanded ? "h-[250px]" : "h-[180px]"
        )}>
          <BranchTreeDiagram
            branches={branches}
            currentBranchId={currentBranchId}
            onSwitchBranch={(branchId) => {
              switchBranch(branchId);
              setShowBranchTree(false);
            }}
            messageCountByBranch={branches.reduce((acc, branch) => {
              // Count messages per branch - simplified count
              acc[branch.id] = messages.filter(m => m.branchId === branch.id).length || 
                (branch.id === currentBranchId ? messages.length : 0);
              return acc;
            }, {} as Record<string, number>)}
          />
        </div>
      )}

      {/* Expandable Conversation History with Branch Points */}
      {showConversationHistory && messages.length > 0 && (
        <ScrollArea className={cn(
          "border rounded-lg bg-muted/20",
          isExpanded ? "h-[300px]" : "h-[150px]"
        )} ref={scrollRef}>
          <div className="p-3 space-y-3">
            {messages.map((msg, idx) => (
              <div 
                key={msg.id || idx}
                className={cn(
                  "group flex gap-2 text-sm",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 relative",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs opacity-70">
                      {msg.role === 'assistant' ? '🧭 Guide' : '💭 You'}
                    </span>
                    {/* Branch button on assistant messages */}
                    {msg.role === 'assistant' && msg.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleCreateBranch(msg.id)}
                        title="Create branch from here"
                      >
                        <GitBranch className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Response Input */}
      <div className="space-y-3">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="What emerges for you?"
          className={cn(
            "resize-y border-border/50 focus:border-primary/50",
            isExpanded ? "min-h-[150px] max-h-[300px]" : "min-h-[100px] max-h-[200px]"
          )}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {selectedPosture && (
              <Badge variant="secondary" className="text-xs">
                {POSTURES.find(p => p.id === selectedPosture)?.label}
              </Badge>
            )}
            {selectedAttitude && (
              <Badge variant="secondary" className="text-xs">
                {ATTITUDES.find(a => a.id === selectedAttitude)?.icon}
              </Badge>
             )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Woven into memory indicator */}
            {lastSavedAt && (
              <span className="text-xs text-muted-foreground/70 italic animate-in fade-in slide-in-from-right-2 duration-500">
                woven into memory
              </span>
            )}
            <Button 
              onClick={handleSubmit} 
              disabled={!response.trim() || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Speak
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(
      embedded 
        ? "h-full flex flex-col"
        : "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    )}>
      <div className={cn(
        "bg-background overflow-hidden transition-all duration-300 flex flex-col",
        embedded 
          ? "h-full border-0 rounded-none shadow-none"
          : cn(
            "border border-border rounded-2xl shadow-2xl",
            isExpanded ? "w-full max-w-4xl h-[90vh]" : "w-full max-w-2xl"
          )
      )}>
        {/* Header - only show when not embedded */}
        {!embedded && (
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold",
                "bg-gradient-to-br from-primary/20 to-primary/5 text-primary"
              )}>
                {tileId}
              </div>
              <div>
                <h2 className="font-semibold text-sm">{tileContent?.name || 'Dialogical Cue'}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{currentSeason} · Focus Mode</span>
                  {conversationSaving && (
                    <span className="flex items-center gap-1 text-primary">
                      <Loader2 className="w-2 h-2 animate-spin" />
                      saving
                    </span>
                  )}
                  {lastSavedAt && !conversationSaving && (
                    <span className="text-green-600 dark:text-green-400">✓ saved</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Expand/Collapse Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              {/* Quick Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Quick</span>
                <Switch 
                  checked={quickMode} 
                  onCheckedChange={setQuickMode}
                  className="scale-75"
                />
              </div>
              {onExpandToFull && (
                <Button variant="ghost" size="sm" onClick={onExpandToFull} className="text-xs">
                  Full View
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Quick mode toggle for embedded view */}
        {embedded && (
          <div className="flex items-center justify-end gap-2 px-3 pb-2">
            <span className="text-xs text-muted-foreground">Quick</span>
            <Switch 
              checked={quickMode} 
              onCheckedChange={setQuickMode}
              className="scale-75"
            />
          </div>
        )}

        {/* Step Indicator (only in guided mode) */}
        {!quickMode && renderStepIndicator()}

        {/* Content */}
        <div className={cn(
          "overflow-y-auto flex-1",
          embedded ? "p-3" : "p-6",
          isExpanded ? "max-h-[calc(90vh-140px)]" : ""
        )}>
          {quickMode ? renderQuickMode() : renderStepContent()}
        </div>

        {/* Footer - hide when embedded */}
        {!embedded && (
          <div className="px-6 py-3 bg-muted/30 border-t border-border/50">
            <p className="text-[10px] text-center text-muted-foreground italic">
              Transform wild guesses into statistical success through deliberate dialogue
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalistTileCard;
