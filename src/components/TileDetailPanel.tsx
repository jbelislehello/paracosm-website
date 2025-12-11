import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Sparkles, Save, Loader2, LogIn, X, Leaf, Heart, MessageCircle, RefreshCw, Send, Mic, MicOff, Pencil, GitBranch, Link2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getTileStage, getStageById } from '@/types/journal-expansion';
import { getPrinciplesByStage } from '@/data/femininePrinciples';
import { useAgentTileConversation } from '@/hooks/useAgentTileConversation';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { TILE_CONTENTS } from '@/data/tileContents';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SketchPad } from '@/components/calm-magic/tools/SketchPad';
import { DiagramBuilder } from '@/components/calm-magic/tools/DiagramBuilder';
import { EmotionalCheckIn } from '@/components/calm-magic/tools/EmotionalCheckIn';
import { toast } from 'sonner';
import { FeltState, EmotionalAxes, EmotionalCheckInData } from '@/types/trajectory';

const rowLabels = [
  { letter: 'M', name: 'Mindsets', stage: 'AGENDAS' },
  { letter: 'A', name: 'Agilities', stage: 'AGENDAS' },
  { letter: 'G', name: 'Goals', stage: 'AGENDAS' },
  { letter: 'I', name: 'Intuition', stage: 'LENS' },
  { letter: 'C', name: 'Compasses', stage: 'LENS' },
  { letter: 'N', name: 'Norms', stage: 'ABOVE' },
  { letter: 'S', name: 'Synergies', stage: 'ABOVE' },
  { letter: 'P+A', name: 'Protocols & Architectures', stage: 'ABOVE' },
];

const colLabels = [
  { letter: 'C', name: 'Chances' },
  { letter: 'H', name: 'Heart' },
  { letter: 'O', name: 'Observer' },
  { letter: 'R', name: 'Reversal' },
  { letter: 'D', name: 'Design' },
  { letter: 'S', name: 'Seeds' },
  { letter: 'M', name: 'Methods' },
  { letter: 'S', name: 'Systems' },
];

interface TileDetailPanelProps {
  selectedTile: { row: number; col: number };
  activeCompass: string | null;
  board: string;
  isAuthenticated: boolean;
  saving: boolean;
  onClose: () => void;
  onSavePolen: (content: string, tileId: number) => Promise<void>;
  onNavigate: (row: number, col: number) => void;
  onCompassChange: (compass: any) => void;
  currentSeason?: string;
  onEmotionalCheckin?: (tileId: number, feltState: FeltState, axes: EmotionalAxes, note?: string) => void;
  emotionalCheckins?: EmotionalCheckInData[];
}

const TileDetailPanel = ({
  selectedTile,
  board,
  isAuthenticated,
  saving,
  onClose,
  onSavePolen,
  onNavigate,
  currentSeason = 'POLLENS',
  onEmotionalCheckin,
  emotionalCheckins = [],
}: TileDetailPanelProps) => {
  const [userInput, setUserInput] = useState('');
  const [conversationSaved, setConversationSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    error,
    sendResponse,
    saveConversationAsPolen,
    fetchInitialQuestion
  } = useAgentTileConversation(selectedTile, currentSeason, isAuthenticated);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupported: voiceSupported,
  } = useVoiceInput();

  // Sync voice transcript to input
  useEffect(() => {
    if (transcript) {
      setUserInput(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Edge detection for navigation
  const canGlitch = selectedTile.row < 7;
  const canDriftLeft = selectedTile.col > 0;
  const canDriftRight = selectedTile.col < 7;
  const canTune = selectedTile.row > 0;

  // Get tile's stage and principles
  const tileStage = getTileStage(selectedTile.row);
  const stageDefinition = getStageById(tileStage);
  const stagePrinciples = getPrinciplesByStage(tileStage);

  // Get tile content
  const tileId = selectedTile.row * 8 + selectedTile.col + 1;
  const tileContent = TILE_CONTENTS.find(t => t.id === tileId);

  const getBoardColor = (board: string) => {
    switch (board) {
      case 'LOVE': return 'from-rose-500 to-pink-500';
      case 'MAGIC': return 'from-purple-500 to-indigo-500';
      case 'CALM': return 'from-blue-500 to-cyan-500';
      case 'OPEN': return 'from-green-500 to-emerald-500';
      case 'FREE': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const handleSendResponse = async () => {
    if (!userInput.trim() || isLoading) return;
    
    const success = await sendResponse(userInput);
    if (success) {
      setUserInput('');
      setConversationSaved(false);
    }
  };

  const handleSaveConversation = async () => {
    const success = await saveConversationAsPolen();
    if (success) {
      setConversationSaved(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendResponse();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSketchSave = async (dataUrl: string) => {
    await onSavePolen(`[Sketch]\n${dataUrl}`, tileId);
    toast.success('Sketch saved as Polen');
  };

  const handleDiagramSave = async (svg: string, source: string, type: string) => {
    const content = `[Diagram: ${type}]\n\nSource:\n\`\`\`mermaid\n${source}\n\`\`\``;
    await onSavePolen(content, tileId);
    toast.success('Diagram saved as Polen');
  };

  // Reset saved state when tile changes
  useEffect(() => {
    setConversationSaved(false);
    setUserInput('');
    setActiveTab('chat');
  }, [selectedTile.row, selectedTile.col]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/30">
      {/* Living Organism Header */}
      <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-rose-500/10 border-b border-amber-500/20 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <Leaf className="w-3 h-3 text-amber-500" />
          <span className="text-amber-700 dark:text-amber-300 italic">
            This tile is a living organism — treat your insights as organisms, not artifacts
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-start justify-between bg-background/80 backdrop-blur-sm shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Badge className={`bg-gradient-to-r ${getBoardColor(board)} text-white`}>
              {rowLabels[selectedTile.row].letter}{colLabels[selectedTile.col].letter}
            </Badge>
            <h3 className="font-bold text-lg">
              {tileContent?.name || `${rowLabels[selectedTile.row].name} × ${colLabels[selectedTile.col].name}`}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">
              {rowLabels[selectedTile.row].name} × {colLabels[selectedTile.col].name}
            </p>
            {stageDefinition && (
              <Badge variant="outline" className="text-[10px]">
                {stageDefinition.icon} {stageDefinition.name}
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Stage Context & Principles */}
      {stageDefinition && (
        <div className="px-4 py-2 bg-muted/30 border-b border-border/30 shrink-0">
          <p className="text-[10px] text-muted-foreground mb-1">
            <span className="font-medium">Stage Themes:</span> {stageDefinition.themes.slice(0, 4).join(' • ')}
          </p>
          <div className="flex flex-wrap gap-1">
            {stagePrinciples.slice(0, 2).map(principle => (
              <span 
                key={principle.id}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1"
                title={principle.designCue}
              >
                <span>{principle.icon}</span>
                {principle.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expected Deliverable */}
      <div className="px-4 py-2 bg-primary/5 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-xs text-muted-foreground">Expected:</span>
          <span className="text-xs font-medium text-primary">{tileContent?.deliverable || 'Tile insight'}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
          <Heart className="w-3 h-3" />
          Contributes to: {tileStage === 'real-intelligence' ? 'Ontology & Concepts' : tileStage === 'knowledge-objects' ? 'Data Nodes & API' : 'Graphs & Processes'}
        </p>
      </div>

      {/* Emotional Check-in Section */}
      {onEmotionalCheckin && (
        <div className="border-b border-border/30 shrink-0">
          <EmotionalCheckIn
            tileId={tileId}
            onCheckin={(feltState, axes, note) => onEmotionalCheckin(tileId, feltState, axes, note)}
            previousCheckins={emotionalCheckins.filter(c => c.tile_id === tileId)}
          />
        </div>
      )}

      {/* Add-ons Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-2 pt-2 shrink-0">
          <TabsList className="w-full grid grid-cols-3 h-8">
            <TabsTrigger value="chat" className="text-xs gap-1">
              <MessageCircle className="w-3 h-3" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="sketch" className="text-xs gap-1">
              <Pencil className="w-3 h-3" />
              Sketch
            </TabsTrigger>
            <TabsTrigger value="diagram" className="text-xs gap-1">
              <GitBranch className="w-3 h-3" />
              Diagram
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0 mt-0 overflow-hidden data-[state=inactive]:hidden" forceMount>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Season Context */}
              <div className="text-xs text-muted-foreground text-center py-2 border-b border-dashed border-border/50">
                <span className="font-medium">{currentSeason}</span> season exploration
              </div>

              {/* Messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-border/50'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1 mb-1 text-[10px] text-muted-foreground">
                        <MessageCircle className="w-3 h-3" />
                        Guide
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 border border-border/50">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="text-xs text-destructive text-center py-2">
                  {error}
                  <Button variant="ghost" size="sm" onClick={fetchInitialQuestion} className="ml-2">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                </div>
              )}
              
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-border/50 bg-background/80 space-y-2 shrink-0">
            <div className="flex gap-2">
              {/* Voice button */}
              {voiceSupported && (
                <Button
                  variant={isListening ? "default" : "ghost"}
                  size="icon"
                  onClick={handleVoiceToggle}
                  disabled={!isAuthenticated}
                  className={`shrink-0 h-[60px] w-10 ${isListening ? 'animate-pulse bg-destructive' : ''}`}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <Textarea
                value={userInput + (interimTranscript ? ` ${interimTranscript}` : '')}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Share your thoughts..."}
                className={`min-h-[60px] resize-none text-sm ${isListening ? 'border-destructive' : ''}`}
                disabled={isLoading || !isAuthenticated}
              />
              <Button
                size="icon"
                onClick={handleSendResponse}
                disabled={!userInput.trim() || isLoading || !isAuthenticated}
                className="shrink-0 h-[60px] w-10"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Auth warning */}
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <LogIn className="w-3 h-3" />
                Log in to engage with tiles
              </p>
            )}

            {/* Save conversation button */}
            {messages.length >= 2 && isAuthenticated && (
              <Button
                variant={conversationSaved ? "secondary" : "outline"}
                size="sm"
                onClick={handleSaveConversation}
                disabled={saving || conversationSaved}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : conversationSaved ? (
                  <>✓ Saved as Polen</>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-1" />
                    Save conversation as Polen
                  </>
                )}
              </Button>
            )}
          </div>
        </TabsContent>

        {/* Sketch Tab */}
        <TabsContent value="sketch" className="flex-1 overflow-auto p-2 m-0">
          <SketchPad onSave={handleSketchSave} />
        </TabsContent>

        {/* Diagram Tab */}
        <TabsContent value="diagram" className="flex-1 overflow-auto p-2 m-0">
          <DiagramBuilder onSave={handleDiagramSave} />
        </TabsContent>
      </Tabs>

      {/* Navigation Buttons */}
      <div className="p-3 border-t border-border/50 bg-muted/30 shrink-0">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Navigate</span>
          
          {/* Up */}
          <Button
            variant="ghost"
            size="sm"
            disabled={!canGlitch}
            onClick={() => onNavigate(selectedTile.row + 1, selectedTile.col)}
            className="w-full h-7 text-xs disabled:opacity-30"
          >
            <ArrowUp className="w-3 h-3 mr-1" />
            {canGlitch ? rowLabels[selectedTile.row + 1].name : 'Edge'}
          </Button>
          
          {/* Left/Right */}
          <div className="flex gap-1 w-full">
            <Button
              variant="ghost"
              size="sm"
              disabled={!canDriftLeft}
              onClick={() => onNavigate(selectedTile.row, selectedTile.col - 1)}
              className="flex-1 h-7 text-xs disabled:opacity-30"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              {canDriftLeft ? colLabels[selectedTile.col - 1].name : 'Edge'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!canDriftRight}
              onClick={() => onNavigate(selectedTile.row, selectedTile.col + 1)}
              className="flex-1 h-7 text-xs disabled:opacity-30"
            >
              {canDriftRight ? colLabels[selectedTile.col + 1].name : 'Edge'}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          
          {/* Down */}
          <Button
            variant="ghost"
            size="sm"
            disabled={!canTune}
            onClick={() => onNavigate(selectedTile.row - 1, selectedTile.col)}
            className="w-full h-7 text-xs disabled:opacity-30"
          >
            <ArrowDown className="w-3 h-3 mr-1" />
            {canTune ? rowLabels[selectedTile.row - 1].name : 'Edge'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TileDetailPanel;
