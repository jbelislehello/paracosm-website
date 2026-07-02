import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TILE_CONTENTS, getRowKey, getColKey } from '@/data/tileContents';
import { warnIfMissingProjectId } from '@/utils/devWarnings';

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  branchId: string;
  parentMessageId?: string;
}

export interface Branch {
  id: string;
  name: string;
  parentBranchId?: string;
  branchPointMessageId?: string;
  createdAt: Date;
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

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAgentTileConversation = (
  tile: { row: number; col: number } | null,
  season: string,
  isAuthenticated: boolean,
  projectId?: string | null
) => {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [branches, setBranches] = useState<Branch[]>([{ id: 'main', name: 'Main Path', createdAt: new Date() }]);
  const [currentBranchId, setCurrentBranchId] = useState('main');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTiles, setCompletedTiles] = useState<CompletedTile[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingAutoSave, setPendingAutoSave] = useState(false);
  const autoSaveTriggered = useRef(false);
  const previousTile = useRef<{ row: number; col: number } | null>(null);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get messages for current branch (including parent branches up to branch point)
  const messages = useCallback(() => {
    const currentBranch = branches.find(b => b.id === currentBranchId);
    if (!currentBranch) return allMessages.filter(m => m.branchId === 'main');

    // Get messages from this branch
    const branchMessages = allMessages.filter(m => m.branchId === currentBranchId);
    
    // If this branch has a parent, get messages from parent up to branch point
    if (currentBranch.parentBranchId && currentBranch.branchPointMessageId) {
      const parentMessages = allMessages.filter(m => m.branchId === currentBranch.parentBranchId);
      const branchPointIndex = parentMessages.findIndex(m => m.id === currentBranch.branchPointMessageId);
      const inheritedMessages = parentMessages.slice(0, branchPointIndex + 1);
      return [...inheritedMessages, ...branchMessages];
    }

    return branchMessages;
  }, [allMessages, branches, currentBranchId]);

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

      let query = supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user.id)
        .contains('tags', [season]);
      
      // Filter by project_id if provided
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const completed: CompletedTile[] = (data || [])
        .filter(entry => entry.source_reference?.startsWith('tile-agent:'))
        .map(entry => {
          const [, tileKey] = (entry.source_reference || '').split(':');
          const [row, col] = tileKey.split('-').map(Number);
          const content = getTileContent(row, col);
          
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
  }, [isAuthenticated, season, projectId, getTileContent]);

  // Fetch initial question when tile changes
  const fetchInitialQuestion = useCallback(async () => {
    if (!tile) return;

    setIsLoading(true);
    setError(null);
    setAllMessages([]);
    setBranches([{ id: 'main', name: 'Main Path', createdAt: new Date() }]);
    setCurrentBranchId('main');

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
      setAllMessages([{
        id: generateId(),
        role: 'assistant',
        content: question,
        timestamp: new Date(),
        branchId: 'main'
      }]);

    } catch (err) {
      console.error('Error fetching initial question:', err);
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
      
      const tileContext = buildTileContext(tile.row, tile.col);
      const fallbackQuestion = `What's alive for you at the intersection of ${tileContext.rowName} and ${tileContext.colName}?`;
      setCurrentQuestion(fallbackQuestion);
      setAllMessages([{
        id: generateId(),
        role: 'assistant',
        content: fallbackQuestion,
        timestamp: new Date(),
        branchId: 'main'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [tile, season, completedTiles, buildTileContext]);

  // Create a new branch from a specific message
  const createBranch = useCallback((fromMessageId: string, branchName?: string) => {
    const fromMessage = allMessages.find(m => m.id === fromMessageId);
    if (!fromMessage) return null;

    const newBranchId = generateId();
    const branchNumber = branches.length;
    
    const newBranch: Branch = {
      id: newBranchId,
      name: branchName || `Branch ${branchNumber}`,
      parentBranchId: fromMessage.branchId,
      branchPointMessageId: fromMessageId,
      createdAt: new Date()
    };

    setBranches(prev => [...prev, newBranch]);
    setCurrentBranchId(newBranchId);
    
    return newBranchId;
  }, [allMessages, branches]);

  // Switch to a different branch
  const switchBranch = useCallback((branchId: string) => {
    if (branches.find(b => b.id === branchId)) {
      setCurrentBranchId(branchId);
    }
  }, [branches]);

  // Send user response and get follow-up
  const sendResponse = useCallback(async (userResponse: string): Promise<boolean> => {
    if (!tile || !userResponse.trim()) return false;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: userResponse,
      timestamp: new Date(),
      branchId: currentBranchId
    };

    setAllMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const tileContext = buildTileContext(tile.row, tile.col);
      const currentMessages = messages();
      
      // Build conversation history for context
      const conversationHistory = [...currentMessages, userMessage].map(m => ({
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
        setAllMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: followUp,
          timestamp: new Date(),
          branchId: currentBranchId
        }]);
      }

      // Signal that auto-save should happen - conversation flows into ontology
      if (isAuthenticated) {
        setPendingAutoSave(true);
      }

      return true;

    } catch (err) {
      console.error('Error sending response:', err);
      setError(err instanceof Error ? err.message : 'Failed to continue conversation');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [tile, season, messages, completedTiles, buildTileContext, currentBranchId, isAuthenticated]);

  // Save conversation as Polen entry (saves current branch)
  const saveConversationAsPolen = useCallback(async (silent: boolean = false): Promise<boolean> => {
    const currentMessages = messages();
    if (!tile || !isAuthenticated || currentMessages.length < 2) return false;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsSaving(false);
        return false;
      }

      // Warn in dev mode if saving without project_id
      warnIfMissingProjectId('polen_entries', projectId, user.id, `tile-agent conversation - tile: ${tile.row}-${tile.col}`);

      const tileId = tile.row * 8 + tile.col + 1;
      const tileKey = `${tile.row}-${tile.col}`;
      const currentBranch = branches.find(b => b.id === currentBranchId);
      
      // Format conversation content with branch info
      const branchLabel = currentBranch?.name || 'Main Path';
      const content = `[${branchLabel}]\n\n` + currentMessages.map(m => 
        `${m.role === 'assistant' ? '🧭' : '💭'} ${m.content}`
      ).join('\n\n');

      const { error } = await supabase.from('polen_entries').insert({
        user_id: user.id,
        project_id: projectId || null,
        content,
        tile_id: tileId,
        fragment_type: 'text',
        tags: [season, 'tile-conversation', `branch:${currentBranchId}`],
        source_reference: `tile-agent:${tileKey}:${currentBranchId}`,
        season_context: season
      });

      if (error) throw error;

      // Update completed tiles
      const tileContext = buildTileContext(tile.row, tile.col);
      const userResponses = currentMessages
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .join(' ');

      setCompletedTiles(prev => [...prev, {
        tileKey,
        tileName: tileContext.tileName,
        question: currentQuestion,
        response: userResponses
      }]);

      setLastSavedAt(new Date());
      if (!silent) {
        console.log('Conversation saved successfully');
      }
      return true;

    } catch (err) {
      console.error('Error saving conversation:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [tile, isAuthenticated, messages, season, currentQuestion, buildTileContext, branches, currentBranchId, projectId]);

  // Auto-save is now immediate - this is kept for edge cases
  const scheduleAutoSave = useCallback(() => {
    // No-op: auto-save is now immediate in sendResponse
  }, []);

  // Reset conversation
  const resetConversation = useCallback(() => {
    setAllMessages([]);
    setBranches([{ id: 'main', name: 'Main Path', createdAt: new Date() }]);
    setCurrentBranchId('main');
    setCurrentQuestion('');
    setError(null);
  }, []);

  // Auto-save conversation when tile changes
  useEffect(() => {
    const shouldAutoSave = 
      previousTile.current && 
      tile && 
      (previousTile.current.row !== tile.row || previousTile.current.col !== tile.col) &&
      messages().length >= 2 &&
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Auto-save immediately when pendingAutoSave is set - conversation flows into ontology
  useEffect(() => {
    if (pendingAutoSave && isAuthenticated) {
      const doSave = async () => {
        const saved = await saveConversationAsPolen(true);
        if (saved) {
          console.log('Conversation woven into memory');
        }
        setPendingAutoSave(false);
      };
      doSave();
    }
  }, [pendingAutoSave, isAuthenticated, saveConversationAsPolen]);

  return {
    messages: messages(),
    allMessages,
    branches,
    currentBranchId,
    currentQuestion,
    isLoading,
    isSaving,
    lastSavedAt,
    error,
    completedTiles,
    sendResponse,
    saveConversationAsPolen,
    resetConversation,
    fetchInitialQuestion,
    createBranch,
    switchBranch
  };
};
