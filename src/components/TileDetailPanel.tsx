import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Sparkles, Save, Loader2, LogIn, X, Leaf, Heart, MessageCircle, RefreshCw, Send, Mic, MicOff, Pencil, GitBranch, Wand2, Moon, BookOpen, ScrollText, Focus, Layers } from 'lucide-react';
import { MinimalistTileCard } from '@/components/calm-magic/MinimalistTileCard';
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
import CosmologicalContextTab from '@/components/calm-magic/CosmologicalContextTab';
import TzolkinResonancePanel from '@/components/calm-magic/TzolkinResonancePanel';
import { HexagramOracle } from '@/components/calm-magic/HexagramOracle';
import { MeditationMode } from '@/components/calm-magic/MeditationMode';
import { HexagramJournal } from '@/components/calm-magic/HexagramJournal';
import { useTzolkinResonance } from '@/hooks/useTzolkinResonance';
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
  visitedTiles?: Set<number>;
  onOpenAssistant?: () => void;
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
  visitedTiles = new Set<number>(),
}: TileDetailPanelProps) => {
  const [userInput, setUserInput] = useState('');
  const [conversationSaved, setConversationSaved] = useState(false);
  const [showManifolds, setShowManifolds] = useState(false);
  const [showMeditationMode, setShowMeditationMode] = useState(false);
  const [highlightedTile, setHighlightedTile] = useState<number | null>(null);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Tzolkin resonance for meditation mode
  const { result: resonanceResult } = useTzolkinResonance();

  const {
    messages,
    isLoading,
    isSaving: conversationSaving,
    lastSavedAt,
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
    const success = await saveConversationAsPolen(false);
    if (success) {
      setConversationSaved(true);
      // Prompt user to try Focus Mode
      toast.success('Fragment saved!', {
        description: 'Ready to go deeper? Try Focus Mode for guided exploration.',
        action: {
          label: 'Focus Mode',
          onClick: () => setShowFocusMode(true),
        },
        duration: 5000,
      });
    }
  };

  // Save conversation on panel close if not already saved
  const handleClose = async () => {
    if (messages.length >= 2 && isAuthenticated && !conversationSaved) {
      await saveConversationAsPolen(true);
    }
    onClose();
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
    setShowManifolds(false);
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
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFocusMode(true)}
            className="gap-1"
            title="Focus Mode"
          >
            <Focus className="w-3 h-3" />
            Focus
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Expected Deliverable - Compact */}
      <div className="px-4 py-2 bg-primary/5 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-xs text-muted-foreground">Expected:</span>
          <span className="text-xs font-medium text-primary">{tileContent?.deliverable || 'Tile insight'}</span>
        </div>
      </div>

      {/* Main Chat Area - Default Primary View */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="px-4 py-3 space-y-3">
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
        </ScrollArea>

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

          {/* Save status indicator */}
          {isAuthenticated && (
            <div className="flex items-center justify-between">
              {conversationSaving && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Auto-saving...
                </div>
              )}
              {lastSavedAt && !conversationSaving && (
                <div className="text-xs text-muted-foreground">
                  Saved {lastSavedAt.toLocaleTimeString()}
                </div>
              )}
              {!lastSavedAt && !conversationSaving && messages.length >= 2 && (
                <div className="text-xs text-muted-foreground opacity-50">
                  Unsaved changes
                </div>
              )}
            </div>
          )}

          {/* Save conversation button */}
          {messages.length >= 2 && isAuthenticated && (
            <Button
              variant={conversationSaved ? "secondary" : "outline"}
              size="sm"
              onClick={handleSaveConversation}
              disabled={saving || conversationSaved || conversationSaving}
              className="w-full"
            >
              {saving || conversationSaving ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : conversationSaved || lastSavedAt ? (
                <>✓ Saved as Fragment</>
              ) : (
                <>
                  <Save className="w-3 h-3 mr-1" />
                  Save as Fragment
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Manifolds Accordion - Collapsible Tools Section */}
      <div className="border-t border-border/50 shrink-0">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-3 h-auto"
          onClick={() => setShowManifolds(!showManifolds)}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Manifolds</span>
            <span className="text-xs text-muted-foreground">(Tools & Exploration)</span>
          </div>
          <span className="text-xs text-muted-foreground">{showManifolds ? '▼' : '▶'}</span>
        </Button>
        
        {showManifolds && (
          <div className="px-2 pb-3">
            <ScrollArea className="max-h-[300px]">
              <Accordion type="single" collapsible className="w-full">
                {/* Emotional Check-in */}
                {onEmotionalCheckin && (
                  <AccordionItem value="emotional">
                    <AccordionTrigger className="text-sm py-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500" />
                        Emotional Check-in
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <EmotionalCheckIn
                        tileId={tileId}
                        onCheckin={(feltState, axes, note) => onEmotionalCheckin(tileId, feltState, axes, note)}
                        previousCheckins={emotionalCheckins.filter(c => c.tile_id === tileId)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Wild Guess - Cosmological */}
                <AccordionItem value="wild-guess">
                  <AccordionTrigger className="text-sm py-2">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-purple-500" />
                      Wild Guess (Tzolkin)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {resonanceResult && resonanceResult.topMatches.length > 0 && (
                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          onClick={() => setShowMeditationMode(true)}
                        >
                          <Moon className="w-4 h-4" />
                          Meditation Mode ({resonanceResult.topMatches.length} tiles)
                        </Button>
                      )}
                      <TzolkinResonancePanel 
                        season={currentSeason as 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS'}
                        onTileSelect={(id) => {
                          const row = Math.floor((id - 1) / 8);
                          const col = (id - 1) % 8;
                          onNavigate(row, col);
                        }}
                      />
                      <CosmologicalContextTab 
                        tileId={tileId}
                        season={currentSeason as 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS'}
                        onDiagonalMove={(toRow, toCol) => onNavigate(toRow, toCol)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Oracle - I Ching */}
                <AccordionItem value="oracle">
                  <AccordionTrigger className="text-sm py-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      Oracle (I Ching)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <HexagramOracle
                      currentTileId={tileId}
                      visitedTiles={visitedTiles}
                      emotionalState={emotionalCheckins.length > 0 ? {
                        feltState: emotionalCheckins[emotionalCheckins.length - 1]?.felt_state || 'flowing',
                        vitality: emotionalCheckins[emotionalCheckins.length - 1]?.axes?.love || 50,
                        spaciousness: emotionalCheckins[emotionalCheckins.length - 1]?.axes?.magic || 50,
                        wholeness: emotionalCheckins[emotionalCheckins.length - 1]?.axes?.calm || 50,
                        openness: emotionalCheckins[emotionalCheckins.length - 1]?.axes?.open || 50,
                        expansion: emotionalCheckins[emotionalCheckins.length - 1]?.axes?.free || 50,
                      } : undefined}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Journal - Hexagram History */}
                <AccordionItem value="journal">
                  <AccordionTrigger className="text-sm py-2">
                    <div className="flex items-center gap-2">
                      <ScrollText className="w-4 h-4 text-blue-500" />
                      Journal (Readings)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <HexagramJournal />
                  </AccordionContent>
                </AccordionItem>

                {/* Sketch */}
                <AccordionItem value="sketch">
                  <AccordionTrigger className="text-sm py-2">
                    <div className="flex items-center gap-2">
                      <Pencil className="w-4 h-4 text-green-500" />
                      Sketch
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SketchPad onSave={handleSketchSave} />
                  </AccordionContent>
                </AccordionItem>

                {/* Diagram */}
                <AccordionItem value="diagram">
                  <AccordionTrigger className="text-sm py-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-500" />
                      Diagram
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <DiagramBuilder onSave={handleDiagramSave} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </div>
        )}
      </div>

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

      {/* Meditation Mode Overlay */}
      {showMeditationMode && resonanceResult && (
        <MeditationMode
          resonatingTiles={resonanceResult.topMatches.map(m => ({
            tileId: m.tileId,
            score: m.resonanceScore / 100,
            sealName: m.sealName,
          }))}
          onTileHighlight={(id) => {
            setHighlightedTile(id);
            if (id) {
              const row = Math.floor((id - 1) / 8);
              const col = (id - 1) % 8;
              onNavigate(row, col);
            }
          }}
          onClose={() => setShowMeditationMode(false)}
        />
      )}

      {/* Focus Mode Overlay */}
      {showFocusMode && (
        <MinimalistTileCard
          selectedTile={selectedTile}
          board={board}
          currentSeason={currentSeason}
          onClose={() => setShowFocusMode(false)}
          onSavePolen={onSavePolen}
          onExpandToFull={() => setShowFocusMode(false)}
        />
      )}
    </div>
  );
};

export default TileDetailPanel;
