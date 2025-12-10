import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Send, 
  Flame, 
  Waves, 
  Loader2, 
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAssistantChat, ChatMessage, GlitchOutput, DriftOutput, GlitchItem, FutureVignette } from '@/hooks/useAssistantChat';
import { cn } from '@/lib/utils';

interface AssistantChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsPolen: (content: string) => void;
  currentSeason: string;
  selectedTile: { row: number; col: number } | null;
}

// Glitch Card Component
function GlitchCard({ 
  glitch, 
  isAnchor, 
  onSave 
}: { 
  glitch: GlitchItem; 
  isAnchor: boolean;
  onSave: () => void;
}) {
  return (
    <div className={cn(
      "p-3 rounded-lg border text-sm",
      isAnchor 
        ? "bg-destructive/10 border-destructive/30" 
        : "bg-muted/50 border-border"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{glitch.id}: {glitch.title}</span>
            {isAnchor && (
              <Badge variant="destructive" className="text-[10px] px-1 py-0">
                anchor
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs">{glitch.description}</p>
          {glitch.emotions.length > 0 && (
            <div className="flex gap-1 mt-2">
              {glitch.emotions.map(e => (
                <Badge key={e} variant="outline" className="text-[10px]">
                  {e}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onSave}>
          <Save className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Future Vignette Card Component
function FutureCard({ 
  future, 
  isPrimary,
  onSave 
}: { 
  future: FutureVignette; 
  isPrimary: boolean;
  onSave: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "p-3 rounded-lg border text-sm",
      isPrimary 
        ? "bg-primary/10 border-primary/30" 
        : "bg-muted/50 border-border"
    )}>
      <div className="flex items-start justify-between gap-2">
        <button 
          className="flex items-center gap-2 text-left flex-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <div>
            <span className="font-medium">{future.id}: {future.title}</span>
            {isPrimary && (
              <Badge variant="default" className="text-[10px] px-1 py-0 ml-2">
                primary
              </Badge>
            )}
            <p className="text-muted-foreground text-xs">{future.persona}</p>
          </div>
        </button>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onSave}>
          <Save className="h-3 w-3" />
        </Button>
      </div>
      
      {expanded && (
        <div className="mt-3 space-y-2 pl-6">
          <div>
            <span className="text-xs font-medium text-destructive">Before:</span>
            <p className="text-xs text-muted-foreground">{future.scenario.before}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-yellow-600">During:</span>
            <p className="text-xs text-muted-foreground">{future.scenario.during}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-emerald-600">After:</span>
            <p className="text-xs text-muted-foreground">{future.scenario.after}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Cluster Badge Component
function ClusterBadge({ cluster }: { cluster: { label: string; pattern_sentence: string } }) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs">
      <span className="font-medium">{cluster.label}</span>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ 
  message, 
  onSaveGlitch,
  onSaveFuture
}: { 
  message: ChatMessage;
  onSaveGlitch: (glitch: GlitchItem) => void;
  onSaveFuture: (future: FutureVignette) => void;
}) {
  const [showStructured, setShowStructured] = useState(true);
  const isUser = message.role === 'user';
  const parsed = message.parsedOutput;

  return (
    <div className={cn(
      "flex gap-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[90%] rounded-lg p-3",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        {/* Raw text for user messages or if no parsed output */}
        {(isUser || !parsed) && (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}

        {/* Structured output for assistant */}
        {!isUser && parsed && (
          <div className="space-y-3">
            {/* Mode indicator */}
            <div className="flex items-center gap-2">
              {parsed.mode === 'glitch' ? (
                <Badge variant="destructive" className="gap-1">
                  <Flame className="h-3 w-3" />
                  GLITCH
                </Badge>
              ) : (
                <Badge className="gap-1 bg-blue-500">
                  <Waves className="h-3 w-3" />
                  DRIFT
                </Badge>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 text-xs"
                onClick={() => setShowStructured(!showStructured)}
              >
                {showStructured ? 'Show raw' : 'Show structured'}
              </Button>
            </div>

            {showStructured ? (
              <>
                {/* Glitch output */}
                {parsed.mode === 'glitch' && (
                  <div className="space-y-3">
                    {/* Glitches */}
                    <div>
                      <p className="text-xs font-medium mb-2">
                        Glitches ({(parsed as GlitchOutput).pollen.glitches.length})
                      </p>
                      <div className="space-y-2">
                        {(parsed as GlitchOutput).pollen.glitches.map(g => (
                          <GlitchCard 
                            key={g.id} 
                            glitch={g} 
                            isAnchor={(parsed as GlitchOutput).pollen.anchor_glitches.includes(g.id)}
                            onSave={() => onSaveGlitch(g)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Clusters */}
                    {(parsed as GlitchOutput).pollen.clusters.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Patterns</p>
                        <div className="flex flex-wrap gap-1">
                          {(parsed as GlitchOutput).pollen.clusters.map(c => (
                            <ClusterBadge key={c.id} cluster={c} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stakes */}
                    {(parsed as GlitchOutput).pollen.stakes && (
                      <div className="text-xs p-2 bg-destructive/10 rounded border border-destructive/30">
                        <span className="font-medium">Stakes:</span> {(parsed as GlitchOutput).pollen.stakes}
                      </div>
                    )}
                  </div>
                )}

                {/* Drift output */}
                {parsed.mode === 'drift' && (
                  <div className="space-y-3">
                    {/* Futures */}
                    <div>
                      <p className="text-xs font-medium mb-2">
                        Futures ({(parsed as DriftOutput).poem.futures.length})
                      </p>
                      <div className="space-y-2">
                        {(parsed as DriftOutput).poem.futures.map(f => (
                          <FutureCard 
                            key={f.id} 
                            future={f} 
                            isPrimary={f.id === (parsed as DriftOutput).poem.primary_narrative.id}
                            onSave={() => onSaveFuture(f)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Primary Narrative */}
                    {(parsed as DriftOutput).poem.primary_narrative && (
                      <div className="text-xs p-2 bg-primary/10 rounded border border-primary/30">
                        <p className="font-medium mb-1">Primary Narrative</p>
                        <p className="text-muted-foreground">
                          {(parsed as DriftOutput).poem.primary_narrative.summary}
                        </p>
                      </div>
                    )}

                    {/* Candidate Forms */}
                    {(parsed as DriftOutput).totem.candidate_forms.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">Candidate Forms</p>
                        <ul className="text-xs text-muted-foreground list-disc pl-4">
                          {(parsed as DriftOutput).totem.candidate_forms.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssistantChatPanel({
  isOpen,
  onClose,
  onSaveAsPolen,
  currentSeason,
  selectedTile,
}: AssistantChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    mode,
    isProcessing,
    error,
    sendMessage,
    switchMode,
    clearChat,
    saveGlitchAsPolen,
    saveFutureAsPolen,
  } = useAssistantChat({
    currentSeason,
    selectedTile,
    onSaveAsPolen,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-20 right-6 w-[400px] h-[600px] max-h-[80vh] flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold">Calm Magic Assistant</span>
          {mode !== 'idle' && (
            <Badge 
              variant={mode === 'glitch' ? 'destructive' : 'default'}
              className={cn(
                "gap-1 text-[10px]",
                mode === 'drift' && "bg-blue-500"
              )}
            >
              {mode === 'glitch' ? <Flame className="h-2.5 w-2.5" /> : <Waves className="h-2.5 w-2.5" />}
              {mode.toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={clearChat}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Start a conversation</p>
              <p className="text-xs mt-1">
                Share tensions for <span className="text-destructive">Glitch</span> mode,<br />
                or explore futures for <span className="text-blue-500">Drift</span> mode.
              </p>
            </div>
          )}
          
          {messages.map(msg => (
            <MessageBubble 
              key={msg.id} 
              message={msg}
              onSaveGlitch={saveGlitchAsPolen}
              onSaveFuture={saveFutureAsPolen}
            />
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2 mb-2">
          <Button
            size="sm"
            variant={mode === 'glitch' ? 'default' : 'outline'}
            className={cn(
              "gap-1 text-xs h-7",
              mode === 'glitch' && "bg-destructive hover:bg-destructive/90"
            )}
            onClick={() => switchMode('glitch')}
          >
            <Flame className="h-3 w-3" />
            Glitch
          </Button>
          <Button
            size="sm"
            variant={mode === 'drift' ? 'default' : 'outline'}
            className={cn(
              "gap-1 text-xs h-7",
              mode === 'drift' && "bg-blue-500 hover:bg-blue-600"
            )}
            onClick={() => switchMode('drift')}
          >
            <Waves className="h-3 w-3" />
            Drift
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share tensions, ideas, or futures..."
            className="min-h-[60px] max-h-[120px] resize-none text-sm"
          />
          <Button 
            size="icon" 
            className="h-[60px] w-10"
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
