import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Send, Sparkles, ArrowRight, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { TILE_CONTENTS } from '@/data/tileContents';
import { useAgentTileConversation } from '@/hooks/useAgentTileConversation';
import { cn } from '@/lib/utils';

interface MinimalistTileCardProps {
  selectedTile: { row: number; col: number };
  board: string;
  currentSeason?: string;
  onClose: () => void;
  onSavePolen: (content: string, tileId: number) => Promise<void>;
  onExpandToFull?: () => void;
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

export const MinimalistTileCard: React.FC<MinimalistTileCardProps> = ({
  selectedTile,
  board,
  currentSeason,
  onClose,
  onSavePolen,
  onExpandToFull,
}) => {
  const tileId = selectedTile.row * 8 + selectedTile.col + 1;
  const tileContent = TILE_CONTENTS.find(t => t.id === tileId);
  
  const [response, setResponse] = useState('');
  const [selectedPosture, setSelectedPosture] = useState<string | null>(null);
  const [selectedAttitude, setSelectedAttitude] = useState<string | null>(null);
  const [showActivities, setShowActivities] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { messages, isLoading, sendResponse } = useAgentTileConversation(
    selectedTile,
    currentSeason || 'POLLENS',
    true
  );

  // Get the latest agent question
  const latestQuestion = messages.filter(m => m.role === 'assistant').pop()?.content || 
    tileContent?.glitchQuestion || 
    "What's alive for you here?";

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setIsSaving(true);
    
    // Build rich context
    const context = [
      response,
      selectedPosture && `\n[Posture: ${POSTURES.find(p => p.id === selectedPosture)?.label}]`,
      selectedAttitude && `\n[Attitude: ${ATTITUDES.find(a => a.id === selectedAttitude)?.label}]`,
    ].filter(Boolean).join('');
    
    await sendResponse(response);
    await onSavePolen(context, tileId);
    
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Minimal Header */}
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
              <p className="text-xs text-muted-foreground">{currentSeason} · Focus Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onExpandToFull && (
              <Button variant="ghost" size="sm" onClick={onExpandToFull} className="text-xs">
                Full View
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Core Question */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <Sparkles className="w-5 h-5 mx-auto text-primary/60" />
            <p className="text-lg font-medium leading-relaxed">
              {latestQuestion}
            </p>
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Thinking...
              </div>
            )}
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

          {/* Activities Accordion */}
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowActivities(!showActivities)}
              className="w-full flex items-center justify-between p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <span className="text-muted-foreground">Suggested activities</span>
              {showActivities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showActivities && (
              <div className="px-3 pb-3 space-y-1">
                {suggestedActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                    <ArrowRight className="w-3 h-3 text-primary/50" />
                    {activity}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Response Input */}
          <div className="space-y-3">
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="What emerges for you?"
              className="min-h-[100px] resize-none border-border/50 focus:border-primary/50"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
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
                Capture
              </Button>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="px-6 py-3 bg-muted/30 border-t border-border/50">
          <p className="text-[10px] text-center text-muted-foreground italic">
            Transform wild guesses into statistical success through deliberate dialogue
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinimalistTileCard;
