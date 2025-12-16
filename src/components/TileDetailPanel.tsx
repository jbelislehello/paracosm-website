import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight, Sparkles, Save, Loader2, LogIn, X, Leaf, Heart, MessageCircle, RefreshCw, Send, Mic, MicOff, Pencil, GitBranch, Wand2, Moon, BookOpen, ScrollText, Focus, Layers, Hexagon } from 'lucide-react';
import { canMoveDiagonally, isPortalDay, getKinForTile } from '@/data/cosmologicalMapping';
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
  const [showMeditationMode, setShowMeditationMode] = useState(false);
  const [highlightedTile, setHighlightedTile] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'focus' | 'manifolds'>('chat');
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
  const canTune = selectedTile.row > 0;
  
  // Get tile ID first (needed for cosmological calculations)
  const tileId = selectedTile.row * 8 + selectedTile.col + 1;
  
  // Navigation law: GL!TCH up, DRIFT right only, TUNE down. Diagonals only on 52 Portal Days.
  const canDriftLeft = false;  // DRIFT LEFT is NEVER allowed per navigation law
  const canDriftRight = selectedTile.col < 7; // DRIFT RIGHT is always allowed (edge check only)
  
  // Diagonal movement - only on Portal Days or high resonance (52 magic days per 260-day cycle)
  const seasonMapping: Record<string, 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS'> = {
    'POLLENS': 'POLLENS', 'NOEMS': 'NOEMS', 'POEMS': 'POEMS', 'TOTEMS': 'TOTEMS', 'ANTHEMS': 'ANTHEMS'
  };
  const mappedSeason = seasonMapping[currentSeason] || 'POLLENS';
  const resonanceScore = resonanceResult?.topMatches?.[0]?.resonanceScore ? resonanceResult.topMatches[0].resonanceScore / 100 : 0;
  const canDiagonal = canMoveDiagonally(tileId, mappedSeason, resonanceScore);
  const currentKin = getKinForTile(tileId, mappedSeason);
  const isCurrentPortalDay = isPortalDay(currentKin);

  // Get tile's stage and principles
  const tileStage = getTileStage(selectedTile.row);
  const stageDefinition = getStageById(tileStage);
  const stagePrinciples = getPrinciplesByStage(tileStage);

  // Get tile content
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
          onClick: () => setActiveTab('focus'),
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
    setActiveTab('chat');
  }, [selectedTile.row, selectedTile.col]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/30">
      {/* Prominent Simple Title */}
      <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between shrink-0">
        <h2 className="text-lg font-semibold">
          {rowLabels[selectedTile.row].name} × {colLabels[selectedTile.col].name}
        </h2>
        <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0 h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Context Accordion - closed by default, contains all contextual info */}
      <Accordion type="single" collapsible className="border-b border-border/30 shrink-0">
        <AccordionItem value="context" className="border-none">
          <AccordionTrigger className="px-5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:no-underline">
            <span className="flex items-center gap-2">
              <BookOpen className="w-3 h-3" />
              Tile {tileId} = {rowLabels[selectedTile.row].letter} × {colLabels[selectedTile.col].letter} • {currentSeason}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-4">
            <div className="space-y-3 text-xs">
              {/* Stage Info */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-[10px] bg-gradient-to-r ${getBoardColor(board)} text-white border-0`}>
                  {stageDefinition?.name || 'Stage'}
                </Badge>
                <span className="text-muted-foreground">{rowLabels[selectedTile.row].stage}</span>
              </div>
              
              {/* Tile Deliverable */}
              {tileContent?.deliverable && (
                <p className="text-muted-foreground leading-relaxed">{tileContent.deliverable}</p>
              )}
              
              {/* Principles */}
              {stagePrinciples && stagePrinciples.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {stagePrinciples.slice(0, 3).map((principle, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px]">{principle.name}</Badge>
                  ))}
                </div>
              )}
              
              {/* Portal Day */}
              {isCurrentPortalDay && (
                <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                  <Hexagon className="w-3 h-3" />
                  Portal Day — Diagonals Active
                </Badge>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-auto p-0 shrink-0">
          <TabsTrigger 
            value="chat" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-1.5 text-xs font-semibold uppercase tracking-wider"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="focus" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-1.5 text-xs font-semibold uppercase tracking-wider"
          >
            <Focus className="w-3 h-3 mr-1" />
            Focus
          </TabsTrigger>
          <TabsTrigger 
            value="manifolds" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-1.5 text-xs font-semibold uppercase tracking-wider"
          >
            <Layers className="w-3 h-3 mr-1" />
            Manifolds
          </TabsTrigger>
        </TabsList>

        {/* CHAT Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col m-0 min-h-0">

          <ScrollArea className="flex-1">
            <div className="p-5 space-y-3">
              {/* All messages including first question as bubble */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                      message.role === 'assistant' && index === 0
                        ? 'bg-muted/60 rounded-tl-sm shadow-sm border border-border/30'
                        : message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted border border-border/50 rounded-tl-sm'
                    }`}
                  >
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                      message.role === 'assistant' && index === 0 ? 'font-medium' : ''
                    }`}>{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3 border border-border/30">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-xs text-destructive text-center py-2">
                  {error}
                  <Button variant="ghost" size="sm" onClick={fetchInitialQuestion} className="ml-2">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-5 border-t border-border/50 bg-background/80 shrink-0">
            <div className="flex gap-2">
              {voiceSupported && (
                <Button
                  variant={isListening ? "default" : "ghost"}
                  size="icon"
                  onClick={handleVoiceToggle}
                  disabled={!isAuthenticated}
                  className={`shrink-0 h-10 w-10 ${isListening ? 'animate-pulse bg-destructive' : ''}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
              
              <Textarea
                value={userInput + (interimTranscript ? ` ${interimTranscript}` : '')}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Share your thoughts..."}
                className={`min-h-[40px] max-h-[80px] resize-none text-sm ${isListening ? 'border-destructive' : ''}`}
                disabled={isLoading || !isAuthenticated}
              />
              <Button
                size="icon"
                onClick={handleSendResponse}
                disabled={!userInput.trim() || isLoading || !isAuthenticated}
                className="shrink-0 h-10 w-10"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>

            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <LogIn className="w-3 h-3" />
                Log in to engage
              </p>
            )}

            {/* Save status */}
            {isAuthenticated && messages.length >= 2 && (
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  {conversationSaving ? (
                    <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Saving...</span>
                  ) : lastSavedAt ? (
                    <span>✓ Saved</span>
                  ) : (
                    <span className="opacity-50">Unsaved</span>
                  )}
                </div>
                {!conversationSaved && !lastSavedAt && (
                  <Button variant="ghost" size="sm" onClick={handleSaveConversation} disabled={conversationSaving} className="h-6 text-xs">
                    <Save className="w-3 h-3 mr-1" />Save
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* FOCUS Tab */}
        <TabsContent value="focus" className="flex-1 m-0 min-h-0 p-5">
          <MinimalistTileCard
            selectedTile={selectedTile}
            board={board}
            currentSeason={currentSeason}
            onClose={() => setActiveTab('chat')}
            onSavePolen={onSavePolen}
            onExpandToFull={() => setActiveTab('chat')}
            embedded={true}
          />
        </TabsContent>

        {/* MANIFOLDS Tab */}
        <TabsContent value="manifolds" className="flex-1 m-0 min-h-0 overflow-y-auto">
          <Accordion type="single" collapsible className="w-full p-5">
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

            {/* Journal */}
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
        </TabsContent>
      </Tabs>

      {/* 8-Directional Navigation */}
      <div className="p-2 border-t border-border/50 bg-muted/30 shrink-0">
        {/* Portal Day Indicator */}
        {canDiagonal && (
          <div className="flex justify-center mb-2">
            <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
              <Hexagon className="w-3 h-3" />
              {isCurrentPortalDay ? 'Portal Day' : 'High Resonance'} — Diagonals Active
            </Badge>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-1 max-w-[140px] mx-auto">
          {/* Top row: ↖ ↑ ↗ */}
          <Button
            variant="ghost"
            size="icon"
            disabled={!canGlitch || selectedTile.col <= 0 || !canDiagonal}
            onClick={() => onNavigate(selectedTile.row + 1, selectedTile.col - 1)}
            className={`h-8 w-8 disabled:opacity-20 ${canDiagonal && canGlitch && selectedTile.col > 0 ? 'text-amber-500 hover:text-amber-400' : ''}`}
            title={canDiagonal ? 'GL!TCH + DRIFT (diagonal)' : 'Diagonals only on Portal Days or high resonance'}
          >
            <ArrowUpLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canGlitch}
            onClick={() => onNavigate(selectedTile.row + 1, selectedTile.col)}
            className="h-8 w-8 disabled:opacity-20"
            title="GL!TCH (up)"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canGlitch || selectedTile.col >= 7 || !canDiagonal}
            onClick={() => onNavigate(selectedTile.row + 1, selectedTile.col + 1)}
            className={`h-8 w-8 disabled:opacity-20 ${canDiagonal && canGlitch && selectedTile.col < 7 ? 'text-amber-500 hover:text-amber-400' : ''}`}
            title={canDiagonal ? 'GL!TCH + DRIFT (diagonal)' : 'Diagonals only on Portal Days or high resonance'}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Button>

          {/* Middle row: ← · → (DISABLED - pure horizontal) */}
          <Button
            variant="ghost"
            size="icon"
            disabled={true}
            className="h-8 w-8 opacity-20 cursor-not-allowed"
            title="DRIFT only moves RIGHT per navigation law"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-8 w-8 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary/50" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canDriftRight}
            onClick={() => onNavigate(selectedTile.row, selectedTile.col + 1)}
            className="h-8 w-8 disabled:opacity-20"
            title="DRIFT (right)"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Bottom row: ↙ ↓ ↘ */}
          <Button
            variant="ghost"
            size="icon"
            disabled={!canTune || selectedTile.col <= 0 || !canDiagonal}
            onClick={() => onNavigate(selectedTile.row - 1, selectedTile.col - 1)}
            className={`h-8 w-8 disabled:opacity-20 ${canDiagonal && canTune && selectedTile.col > 0 ? 'text-amber-500 hover:text-amber-400' : ''}`}
            title={canDiagonal ? 'TUNE + DRIFT (diagonal)' : 'Diagonals only on Portal Days or high resonance'}
          >
            <ArrowDownLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canTune}
            onClick={() => onNavigate(selectedTile.row - 1, selectedTile.col)}
            className="h-8 w-8 disabled:opacity-20"
            title="TUNE (down)"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canTune || selectedTile.col >= 7 || !canDiagonal}
            onClick={() => onNavigate(selectedTile.row - 1, selectedTile.col + 1)}
            className={`h-8 w-8 disabled:opacity-20 ${canDiagonal && canTune && selectedTile.col < 7 ? 'text-amber-500 hover:text-amber-400' : ''}`}
            title={canDiagonal ? 'TUNE + DRIFT (diagonal)' : 'Diagonals only on Portal Days or high resonance'}
          >
            <ArrowDownRight className="w-4 h-4" />
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
    </div>
  );
};

export default TileDetailPanel;
