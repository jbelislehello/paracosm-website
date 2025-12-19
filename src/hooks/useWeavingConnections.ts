import { useState, useCallback, useMemo, useEffect } from 'react';
import { WeavingThread } from '@/components/calm-magic/WeavingVisualization';
import { supabase } from '@/integrations/supabase/client';

interface PolenEntry {
  id: string;
  tile_id: number | null;
  tags: string[] | null;
  content: string;
  created_at: string;
}

// Calculate tag overlap between two entries
function calculateTagOverlap(tags1: string[], tags2: string[]): number {
  if (tags1.length === 0 || tags2.length === 0) return 0;
  
  const set1 = new Set(tags1.map(t => t.toLowerCase()));
  const set2 = new Set(tags2.map(t => t.toLowerCase()));
  
  let overlap = 0;
  set1.forEach(tag => {
    if (set2.has(tag)) overlap++;
  });
  
  const union = new Set([...set1, ...set2]).size;
  return overlap / union; // Jaccard similarity
}

// Calculate temporal proximity (entries close in time are related)
function calculateTemporalProximity(date1: string, date2: string): number {
  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();
  const diffHours = Math.abs(time1 - time2) / (1000 * 60 * 60);
  
  // Exponential decay: entries within 24 hours are closely related
  return Math.exp(-diffHours / 24);
}

// Calculate simple word overlap for basic semantic similarity
function calculateWordOverlap(content1: string, content2: string): number {
  const words1 = new Set(
    content1.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
  const words2 = new Set(
    content2.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  let overlap = 0;
  words1.forEach(word => {
    if (words2.has(word)) overlap++;
  });
  
  const minSize = Math.min(words1.size, words2.size);
  return overlap / minSize;
}

// Convert tile_id to row/col
function tileIdToRowCol(tileId: number): { row: number; col: number } {
  const row = Math.floor((tileId - 1) / 8);
  const col = (tileId - 1) % 8;
  return { row, col };
}

export function useWeavingConnections(userId: string | null, projectId: string | null = null, minStrength: number = 0.25) {
  const [threads, setThreads] = useState<WeavingThread[]>([]);
  const [newThreads, setNewThreads] = useState<WeavingThread[]>([]);
  const [polenEntries, setPolenEntries] = useState<PolenEntry[]>([]);

  // Fetch all polen entries for this user and project
  const fetchPolenEntries = useCallback(async () => {
    if (!userId) return;
    
    let query = supabase
      .from('polen_entries')
      .select('id, tile_id, tags, content, created_at')
      .eq('user_id', userId)
      .not('tile_id', 'is', null);
    
    // Filter by project_id if provided
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: true });
    
    if (!error && data) {
      setPolenEntries(data);
    }
  }, [userId, projectId]);

  // Calculate all connections between entries
  const calculateConnections = useCallback((entries: PolenEntry[]): WeavingThread[] => {
    const connections: WeavingThread[] = [];
    const tileConnections = new Map<string, WeavingThread>();

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const entry1 = entries[i];
        const entry2 = entries[j];
        
        if (!entry1.tile_id || !entry2.tile_id) continue;
        if (entry1.tile_id === entry2.tile_id) continue; // Same tile
        
        const pos1 = tileIdToRowCol(entry1.tile_id);
        const pos2 = tileIdToRowCol(entry2.tile_id);
        
        // Calculate combined strength
        const tagStrength = calculateTagOverlap(entry1.tags || [], entry2.tags || []);
        const temporalStrength = calculateTemporalProximity(entry1.created_at, entry2.created_at);
        const wordStrength = calculateWordOverlap(entry1.content, entry2.content);
        
        // Weight different factors
        const combinedStrength = Math.max(
          tagStrength * 1.0,
          wordStrength * 0.7,
          temporalStrength * 0.4
        );
        
        if (combinedStrength >= minStrength) {
          // Use a key to deduplicate tile-level connections
          const key = `${Math.min(entry1.tile_id, entry2.tile_id)}-${Math.max(entry1.tile_id, entry2.tile_id)}`;
          const existing = tileConnections.get(key);
          
          if (!existing || existing.strength < combinedStrength) {
            tileConnections.set(key, {
              sourceRow: pos1.row,
              sourceCol: pos1.col,
              targetRow: pos2.row,
              targetCol: pos2.col,
              strength: combinedStrength,
              isNew: false,
            });
          }
        }
      }
    }
    
    return Array.from(tileConnections.values())
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 50); // Limit to top 50 connections
  }, [minStrength]);

  // Recalculate threads when entries change
  useEffect(() => {
    const newConnections = calculateConnections(polenEntries);
    setThreads(newConnections);
  }, [polenEntries, calculateConnections]);

  // Initial fetch
  useEffect(() => {
    fetchPolenEntries();
  }, [fetchPolenEntries]);

  // Subscribe to new polen entries for real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`polen-weaving-${projectId || 'global'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'polen_entries',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newEntry = payload.new as PolenEntry & { project_id?: string };
          // Only process if entry belongs to current project
          if (projectId && newEntry.project_id !== projectId) return;
          
          if (newEntry.tile_id) {
            // Add new entry and recalculate
            setPolenEntries(prev => {
              const updated = [...prev, newEntry];
              
              // Calculate new connections involving this entry
              const newPos = tileIdToRowCol(newEntry.tile_id!);
              const newConns: WeavingThread[] = [];
              
              prev.forEach(existing => {
                if (!existing.tile_id || existing.tile_id === newEntry.tile_id) return;
                
                const existingPos = tileIdToRowCol(existing.tile_id);
                const tagStrength = calculateTagOverlap(existing.tags || [], newEntry.tags || []);
                const wordStrength = calculateWordOverlap(existing.content, newEntry.content);
                const strength = Math.max(tagStrength, wordStrength * 0.7);
                
                if (strength >= minStrength) {
                  newConns.push({
                    sourceRow: newPos.row,
                    sourceCol: newPos.col,
                    targetRow: existingPos.row,
                    targetCol: existingPos.col,
                    strength,
                    isNew: true,
                  });
                }
              });
              
              // Mark new threads for animation
              if (newConns.length > 0) {
                setNewThreads(newConns);
                // Clear animation flag after animation completes
                setTimeout(() => {
                  setNewThreads([]);
                }, 2000);
              }
              
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, projectId, minStrength]);

  // Combine existing and new threads
  const allThreads = useMemo(() => {
    const combined = [...threads];
    
    // Add new threads with animation flag
    newThreads.forEach(newThread => {
      const existingIdx = combined.findIndex(
        t => t.sourceRow === newThread.sourceRow && 
             t.sourceCol === newThread.sourceCol &&
             t.targetRow === newThread.targetRow &&
             t.targetCol === newThread.targetCol
      );
      
      if (existingIdx >= 0) {
        combined[existingIdx] = { ...combined[existingIdx], isNew: true };
      } else {
        combined.push(newThread);
      }
    });
    
    return combined;
  }, [threads, newThreads]);

  // Manually trigger new thread animation (for use after saving)
  const triggerNewConnection = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number, strength: number = 0.5) => {
    const newThread: WeavingThread = {
      sourceRow: fromRow,
      sourceCol: fromCol,
      targetRow: toRow,
      targetCol: toCol,
      strength,
      isNew: true,
    };
    
    setNewThreads(prev => [...prev, newThread]);
    
    // Clear after animation
    setTimeout(() => {
      setNewThreads(prev => prev.filter(t => 
        t.sourceRow !== fromRow || 
        t.sourceCol !== fromCol ||
        t.targetRow !== toRow ||
        t.targetCol !== toCol
      ));
    }, 2000);
  }, []);

  return {
    threads: allThreads,
    refreshConnections: fetchPolenEntries,
    triggerNewConnection,
  };
}
