// Voice Mode Panel - Voice interaction UI for Calm Magic Board

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Send, 
  Shield, 
  Volume2, 
  VolumeX,
  Sparkles,
  FileDown,
  Trash2,
  Navigation
} from 'lucide-react';
import { useVoiceComputing } from '@/hooks/useVoiceComputing';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { TotemSelectionModal } from './TotemSelectionModal';
import type { TotemType, TileContext, WuxiaResponse, TraceEntry } from '@/services/voice-computing';

interface VoiceModePanelProps {
  projectId: string;
  foundationalPrompt?: string;
  currentTile?: TileContext;
  onNavigate?: (direction: 'glitch' | 'drift' | 'tune') => void;
  onResponseReceived?: (response: WuxiaResponse) => void;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'wuxia';
  content: string;
  timestamp: Date;
}

export const VoiceModePanel: React.FC<VoiceModePanelProps> = ({
  projectId,
  foundationalPrompt = '',
  currentTile,
  onNavigate,
  onResponseReceived
}) => {
  // State
  const [showTotemModal, setShowTotemModal] = useState(false);
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [showTraces, setShowTraces] = useState(false);

  // Voice computing hook
  const {
    selectTotem,
    totemSelected,
    currentTotem,
    processInput,
    isProcessing,
    startSession,
    endSession,
    purgeSession,
    sessionActive,
    lastResponse,
    consentState,
    navigateTile,
    narrateTile,
    exportSession,
    traceLog,
    error,
    clearError
  } = useVoiceComputing({
    projectId,
    foundationalPrompt,
    onWuxiaResponse: (response) => {
      addMessage('wuxia', response.text);
      onResponseReceived?.(response);
    }
  });

  // Browser voice input hook
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupported
  } = useVoiceInput();

  // Add message to conversation
  const addMessage = useCallback((role: 'user' | 'wuxia', content: string) => {
    setConversation(prev => [...prev, {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date()
    }]);
  }, []);

  // Handle TOTEM selection
  const handleTotemSelect = async (totem: TotemType) => {
    selectTotem(totem);
    const greeting = await startSession();
    if (greeting) {
      addMessage('wuxia', greeting);
    }
  };

  // Handle text submission
  const handleSubmit = async () => {
    const text = inputText.trim() || transcript;
    if (!text) return;

    addMessage('user', text);
    setInputText('');
    resetTranscript();

    await processInput(text, currentTile);
  };

  // Handle voice input
  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Handle navigation
  const handleNavigate = async (direction: 'glitch' | 'drift' | 'tune') => {
    const response = await navigateTile(direction);
    if (response) {
      onNavigate?.(direction);
    }
  };

  // Handle export
  const handleExport = async () => {
    const data = await exportSession();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wuxia-session-${Date.now()}.json`;
      a.click();
    }
  };

  // Render TOTEM badge
  const getTotemBadge = () => {
    if (!currentTotem) return null;
    
    const badges: Record<TotemType, { icon: React.ReactNode; label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      free: { icon: <Sparkles className="w-3 h-3" />, label: 'Performance', variant: 'default' },
      p1_dignity: { icon: <Shield className="w-3 h-3" />, label: 'Dignity', variant: 'secondary' },
      p2_anticoercion: { icon: <Shield className="w-3 h-3" />, label: 'Anti-coercion', variant: 'outline' }
    };
    
    const { icon, label, variant } = badges[currentTotem];
    return (
      <Badge variant={variant} className="gap-1">
        {icon} {label}
      </Badge>
    );
  };

  // Not yet started - show TOTEM selection prompt
  if (!totemSelected) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <span className="text-4xl">🦊</span>
          </div>
          <h3 className="text-lg font-semibold">Voice Mode</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Begin a voice journey with Wuxia the Fox. First, select your TOTEM to determine how your voice data is handled.
          </p>
          <Button onClick={() => setShowTotemModal(true)}>
            Choose TOTEM
          </Button>
        </div>

        <TotemSelectionModal
          open={showTotemModal}
          onOpenChange={setShowTotemModal}
          onSelectTotem={handleTotemSelect}
        />
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>🦊</span> Wuxia
            {getTotemBadge()}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setShowTraces(!showTraces)}
              title="Show trace log"
            >
              <Shield className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleExport}
              title="Export session"
            >
              <FileDown className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={purgeSession}
              title="Clear session"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {error && (
          <div className="text-xs text-destructive mt-1" onClick={clearError}>
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Conversation */}
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {conversation.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <span className="animate-pulse">🦊 thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Trace log (collapsible) */}
        {showTraces && traceLog.length > 0 && (
          <>
            <Separator />
            <div className="text-xs">
              <div className="font-medium mb-1">Trace Log</div>
              <ScrollArea className="h-20">
                {traceLog.map((trace, idx) => (
                  <div key={idx} className="text-muted-foreground">
                    [{trace.stage}] {trace.details}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleNavigate('glitch')}
            className="text-xs"
          >
            ↑ GL!TCH
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleNavigate('drift')}
            className="text-xs"
          >
            → DRIFT
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleNavigate('tune')}
            className="text-xs"
          >
            ↓ TUNE
          </Button>
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <Textarea
            value={inputText || interimTranscript}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type or speak..."}
            className="min-h-[60px] text-sm resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex flex-col gap-1">
            {browserSupported && (
              <Button
                variant={isListening ? 'destructive' : 'outline'}
                size="icon"
                onClick={handleVoiceToggle}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={isProcessing || (!inputText.trim() && !transcript)}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceModePanel;
