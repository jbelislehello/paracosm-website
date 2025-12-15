import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TILE_CONTENTS, getRowKey, getColKey } from '@/data/tileContents';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface CompletedTile {
  tileKey: string;
  tileName: string;
  question: string;
  response: string;
}

interface TileContext {
  row: number;
  col: number;
  rowName: string;
  colName: string;
  tileName: string;
  conceptualSpace: string;
  deliverable: string;
}

const ROW_NAMES = ['Mindsets', 'Agilities', 'Goals', 'Landscape', 'Energy', 'Norms', 'Synergies', 'Protocols & Architectures'];
const COL_NAMES = ['Chances', 'Heart', 'Observer', 'Reversal', 'Design', 'Seeds', 'Methods', 'Systems'];

export const useAgentTileConversation = (
  tile: { row: number; col: number } | null,
  season: string,
  isAuthenticated: boolean
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTiles, setCompletedTiles] = useState<CompletedTile[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const autoSaveTriggered = useRef(false);
  const previousTile = useRef<{ row: number; col: number } | null>(null);

  // Get tile content from our data
  const getTileContent = useCallback((row: number, col: number) => {
    const tileId = row * 8 + col + 1;
    return TILE_CONTENTS.find(t => t.id === tileId);
  }, []);

  // Build tile context
  const buildTileContext = useCallback((row: number, col: number): TileContext => {
    const content = getTileContent(row, col);
    return {
      row,
      col,
      rowName: ROW_NAMES[row] || 'Unknown',
      colName: COL_NAMES[col] || 'Unknown',
      tileName: content?.name || `${ROW_NAMES[row]} × ${COL_NAMES[col]}`,
      conceptualSpace: content?.glitchQuestion || '',
      deliverable: content?.deliverable || 'Tile insight'
    };
  }, [getTileContent]);

  // Fetch completed tiles from previous journey
  const fetchCompletedTiles = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get polen entries that have question/response data
      const { data, error } = await supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user.id)
        .contains('tags', [season])
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Parse completed tiles from polen entries
      const completed: CompletedTile[] = (data || [])
        .filter(entry => entry.source_reference?.startsWith('tile-agent:'))
        .map(entry => {
          const [, tileKey] = (entry.source_reference || '').split(':');
          const [row, col] = tileKey.split('-').map(Number);
          const content = getTileContent(row, col);
          
          // Extract question from content if stored
          const parts = entry.content.split('\n---\n');
          return {
            tileKey,
            tileName: content?.name || `Tile ${tileKey}`,
            question: parts[0] || '',
            response: parts[1] || entry.content
          };
        });

      setCompletedTiles(completed);
    } catch (err) {
      console.error('Error fetching completed tiles:', err);
    }
  }, [isAuthenticated, season, getTileContent]);

  // Fetch initial question when tile changes
  const fetchInitialQuestion = useCallback(async () => {
    if (!tile) return;

    setIsLoading(true);
    setError(null);
    setMessages([]);

    try {
      const tileContext = buildTileContext(tile.row, tile.col);
      
      const { data, error: fnError } = await supabase.functions.invoke('tile-agent', {
        body: {
          tile: tileContext,
          season,
          completedTileAnswers: completedTiles,
          conversationHistory: [],
          isInitial: true
        }
      });

      if (fnError) throw fnError;

      const question = data?.question || `What's present for you at ${tileContext.tileName}?`;
      setCurrentQuestion(question);
      setMessages([{
        role: 'assistant',
        content: question,
        timestamp: new Date()
      }]);

    } catch (err) {
      console.error('Error fetching initial question:', err);
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
      
      // Fallback question
      const tileContext = buildTileContext(tile.row, tile.col);
      const fallbackQuestion = `What's alive for you at the intersection of ${tileContext.rowName} and ${tileContext.colName}?`;
      setCurrentQuestion(fallbackQuestion);
      setMessages([{
        role: 'assistant',
        content: fallbackQuestion,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [tile, season, completedTiles, buildTileContext]);

  // Send user response and get follow-up
  const sendResponse = useCallback(async (userResponse: string): Promise<boolean> => {
    if (!tile || !userResponse.trim()) return false;

    const userMessage: Message = {
      role: 'user',
      content: userResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const tileContext = buildTileContext(tile.row, tile.col);
      
      // Build conversation history for context
      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data, error: fnError } = await supabase.functions.invoke('tile-agent', {
        body: {
          tile: tileContext,
          season,
          completedTileAnswers: completedTiles,
          conversationHistory,
          isInitial: false
        }
      });

      if (fnError) throw fnError;

      const followUp = data?.question;
      if (followUp) {
        setCurrentQuestion(followUp);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: followUp,
          timestamp: new Date()
        }]);
      }

      return true;

    } catch (err) {
      console.error('Error sending response:', err);
      setError(err instanceof Error ? err.message : 'Failed to continue conversation');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [tile, season, messages, completedTiles, buildTileContext]);

  // Save conversation as Polen entry
  const saveConversationAsPolen = useCallback(async (): Promise<boolean> => {
    if (!tile || !isAuthenticated || messages.length < 2) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const tileId = tile.row * 8 + tile.col + 1;
      const tileKey = `${tile.row}-${tile.col}`;
      
      // Format conversation content
      const content = messages.map(m => 
        `${m.role === 'assistant' ? '🧭' : '💭'} ${m.content}`
      ).join('\n\n');

      const { error } = await supabase.from('polen_entries').insert({
        user_id: user.id,
        content,
        tile_id: tileId,
        fragment_type: 'text',
        tags: [season, 'tile-conversation'],
        source_reference: `tile-agent:${tileKey}`
      });

      if (error) throw error;

      // Update completed tiles
      const tileContext = buildTileContext(tile.row, tile.col);
      const userResponses = messages
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .join(' ');

      setCompletedTiles(prev => [...prev, {
        tileKey,
        tileName: tileContext.tileName,
        question: currentQuestion,
        response: userResponses
      }]);

      return true;

    } catch (err) {
      console.error('Error saving conversation:', err);
      return false;
    }
  }, [tile, isAuthenticated, messages, season, currentQuestion, buildTileContext]);

  // Reset conversation
  const resetConversation = useCallback(() => {
    setMessages([]);
    setCurrentQuestion('');
    setError(null);
  }, []);

  // Auto-save conversation when tile changes (cleanup effect)
  useEffect(() => {
    // Check if we're changing tiles and have a conversation to save
    const shouldAutoSave = 
      previousTile.current && 
      tile && 
      (previousTile.current.row !== tile.row || previousTile.current.col !== tile.col) &&
      messages.length >= 2 &&
      isAuthenticated &&
      !autoSaveTriggered.current;

    if (shouldAutoSave) {
      autoSaveTriggered.current = true;
      saveConversationAsPolen().then(saved => {
        if (saved) {
          console.log('Auto-saved conversation from tile navigation');
        }
        autoSaveTriggered.current = false;
      });
    }

    previousTile.current = tile;
  }, [tile?.row, tile?.col]);

  // Effects
  useEffect(() => {
    fetchCompletedTiles();
  }, [fetchCompletedTiles]);

  useEffect(() => {
    if (tile) {
      fetchInitialQuestion();
    } else {
      resetConversation();
    }
  }, [tile?.row, tile?.col, season]);

  return {
    messages,
    currentQuestion,
    isLoading,
    error,
    completedTiles,
    sendResponse,
    saveConversationAsPolen,
    resetConversation,
    fetchInitialQuestion
  };
};
