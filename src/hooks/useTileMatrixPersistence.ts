import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Board = Database['public']['Enums']['board'];
type JournalPhase = Database['public']['Enums']['journal_phase'];
type ToleranceZone = Database['public']['Enums']['tolerance_zone'];

interface JournalCycle {
  id: string;
  user_id: string;
  board: Board;
  cycle_number: number;
  tiles_visited: number[];
  current_tile_id: number | null;
  phase: JournalPhase;
  inner_radius: number;
  stretch_radius: number;
  current_distance: number;
  current_zone: ToleranceZone;
  integrator_tiles_unlocked: number;
  started_at: string;
  completed_at: string | null;
}

interface PolenEntry {
  id: string;
  content: string;
  tile_id: number | null;
  cycle_id: string | null;
  fragment_type: string;
  tags: string[];
  created_at: string;
  season_context: string | null;
}

export const useTileMatrixPersistence = (board: Board = 'LOVE', projectId?: string | null) => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [currentCycle, setCurrentCycle] = useState<JournalCycle | null>(null);
  const [polenEntries, setPolenEntries] = useState<PolenEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recentlySyncedTiles, setRecentlySyncedTiles] = useState<Set<string>>(new Set());
  const [recentlySyncedPolen, setRecentlySyncedPolen] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch current cycle when user is available
  useEffect(() => {
    if (user) {
      fetchCurrentCycle();
      fetchPolenEntries();
    } else {
      setCurrentCycle(null);
      setPolenEntries([]);
      setLoading(false);
    }
  }, [user, board, projectId]);

  // Real-time subscription for POLEN entries
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('polen-entries-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'polen_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newEntry = payload.new as PolenEntry & { user_id: string };
          setPolenEntries(prev => {
            // Avoid duplicates (in case we already added it locally)
            if (prev.some(e => e.id === newEntry.id)) return prev;
            return [{
              ...newEntry,
              tags: newEntry.tags || []
            }, ...prev];
          });
          // Mark as recently synced for visual feedback
          if (newEntry.tile_id) {
            const row = Math.floor((newEntry.tile_id - 1) / 8);
            const col = (newEntry.tile_id - 1) % 8;
            const tileKey = `${row}-${col}`;
            setRecentlySyncedTiles(prev => new Set(prev).add(tileKey));
            setTimeout(() => {
              setRecentlySyncedTiles(prev => {
                const next = new Set(prev);
                next.delete(tileKey);
                return next;
              });
            }, 3000);
          }
          setRecentlySyncedPolen(prev => new Set(prev).add(newEntry.id));
          setTimeout(() => {
            setRecentlySyncedPolen(prev => {
              const next = new Set(prev);
              next.delete(newEntry.id);
              return next;
            });
          }, 3000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'polen_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedEntry = payload.new as PolenEntry & { user_id: string };
          setPolenEntries(prev => 
            prev.map(e => e.id === updatedEntry.id ? {
              ...updatedEntry,
              tags: updatedEntry.tags || []
            } : e)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'polen_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const deletedEntry = payload.old as { id: string };
          setPolenEntries(prev => prev.filter(e => e.id !== deletedEntry.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Real-time subscription for journal_cycles
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('journal-cycles-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'journal_cycles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedCycle = payload.new as JournalCycle & { user_id: string };
          const oldCycle = payload.old as JournalCycle;
          // Only update if it's the current board and cycle
          if (updatedCycle.board === board && !updatedCycle.completed_at) {
            setCurrentCycle(prev => {
              if (prev?.id === updatedCycle.id) {
                // Find newly visited tiles for visual feedback
                const oldVisited = new Set(oldCycle?.tiles_visited || []);
                const newVisited = updatedCycle.tiles_visited || [];
                newVisited.forEach(tileId => {
                  if (!oldVisited.has(tileId)) {
                    const row = Math.floor((tileId - 1) / 8);
                    const col = (tileId - 1) % 8;
                    const tileKey = `${row}-${col}`;
                    setRecentlySyncedTiles(prevTiles => new Set(prevTiles).add(tileKey));
                    setTimeout(() => {
                      setRecentlySyncedTiles(prevTiles => {
                        const next = new Set(prevTiles);
                        next.delete(tileKey);
                        return next;
                      });
                    }, 3000);
                  }
                });
                return {
                  ...updatedCycle,
                  tiles_visited: updatedCycle.tiles_visited || []
                };
              }
              return prev;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'journal_cycles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newCycle = payload.new as JournalCycle & { user_id: string };
          // Set as current if it matches the board and is not completed
          if (newCycle.board === board && !newCycle.completed_at) {
            setCurrentCycle({
              ...newCycle,
              tiles_visited: newCycle.tiles_visited || []
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, board]);

  const fetchCurrentCycle = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_cycles')
        .select('*')
        .eq('user_id', user.id)
        .eq('board', board)
        .is('completed_at', null)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setCurrentCycle({
          ...data,
          tiles_visited: data.tiles_visited || []
        });
      } else {
        setCurrentCycle(null);
      }
    } catch (error) {
      console.error('Error fetching cycle:', error);
      toast({
        title: 'Error loading progress',
        description: 'Could not load your saved progress.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPolenEntries = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Filter by project_id if provided
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPolenEntries(data?.map(entry => ({
        ...entry,
        tags: entry.tags || []
      })) || []);
    } catch (error) {
      console.error('Error fetching polen:', error);
    }
  };

  const startNewCycle = async (cycleNumber: number = 1) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to save your progress.',
        variant: 'destructive'
      });
      return null;
    }

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('journal_cycles')
        .insert({
          user_id: user.id,
          board,
          cycle_number: cycleNumber,
          tiles_visited: [],
          phase: 'glitch' as JournalPhase,
          inner_radius: 1,
          stretch_radius: 2,
          current_distance: 0,
          current_zone: 'inner' as ToleranceZone,
          integrator_tiles_unlocked: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentCycle({
        ...data,
        tiles_visited: data.tiles_visited || []
      });
      
      toast({
        title: 'New cycle started',
        description: `Cycle ${cycleNumber} on ${board} board has begun.`
      });
      
      return data;
    } catch (error) {
      console.error('Error starting cycle:', error);
      toast({
        title: 'Error starting cycle',
        description: 'Could not start a new cycle.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const visitTile = async (row: number, col: number) => {
    if (!user || !currentCycle) return;

    const tileId = row * 8 + col + 1; // 1-indexed tile ID
    const tilesVisited = currentCycle.tiles_visited || [];
    
    if (tilesVisited.includes(tileId)) return; // Already visited

    try {
      setSaving(true);
      const newTilesVisited = [...tilesVisited, tileId];
      
      const { error } = await supabase
        .from('journal_cycles')
        .update({
          tiles_visited: newTilesVisited,
          current_tile_id: tileId,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCycle.id);

      if (error) throw error;

      setCurrentCycle(prev => prev ? {
        ...prev,
        tiles_visited: newTilesVisited,
        current_tile_id: tileId
      } : null);
    } catch (error) {
      console.error('Error visiting tile:', error);
    } finally {
      setSaving(false);
    }
  };

  const updatePhase = async (phase: JournalPhase) => {
    if (!user || !currentCycle) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('journal_cycles')
        .update({
          phase,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCycle.id);

      if (error) throw error;

      setCurrentCycle(prev => prev ? { ...prev, phase } : null);
    } catch (error) {
      console.error('Error updating phase:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateToleranceZone = async (zone: ToleranceZone, innerRadius?: number, stretchRadius?: number) => {
    if (!user || !currentCycle) return;

    try {
      setSaving(true);
      const updateData: Partial<JournalCycle> & { updated_at: string } = {
        current_zone: zone,
        updated_at: new Date().toISOString()
      };
      
      if (innerRadius !== undefined) updateData.inner_radius = innerRadius;
      if (stretchRadius !== undefined) updateData.stretch_radius = stretchRadius;

      const { error } = await supabase
        .from('journal_cycles')
        .update(updateData)
        .eq('id', currentCycle.id);

      if (error) throw error;

      setCurrentCycle(prev => prev ? { 
        ...prev, 
        current_zone: zone,
        ...(innerRadius !== undefined && { inner_radius: innerRadius }),
        ...(stretchRadius !== undefined && { stretch_radius: stretchRadius })
      } : null);
    } catch (error) {
      console.error('Error updating zone:', error);
    } finally {
      setSaving(false);
    }
  };

  const savePolenEntry = async (
    content: string, 
    tileId: number | null, 
    fragmentType: 'text' | 'quote' | 'image' | 'voice' | 'screenshot' | 'link' = 'text',
    tags: string[] = [],
    seasonContext?: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS'
  ) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to save polen entries.',
        variant: 'destructive'
      });
      return null;
    }

    try {
      setSaving(true);
      
      // Auto-detect season from tags if not provided
      const detectedSeason = seasonContext || tags.find(t => 
        ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'].includes(t)
      ) as typeof seasonContext;
      
      const { data, error } = await supabase
        .from('polen_entries')
        .insert({
          user_id: user.id,
          cycle_id: currentCycle?.id || null,
          project_id: projectId || null,
          tile_id: tileId,
          content,
          fragment_type: fragmentType,
          tags,
          season_context: detectedSeason || null
        })
        .select()
        .single();

      if (error) throw error;
      
      setPolenEntries(prev => [{
        ...data,
        tags: data.tags || []
      }, ...prev]);
      
      toast({
        title: 'Fragment saved',
        description: 'Your fragment has been captured.'
      });
      
      return data;
    } catch (error) {
      console.error('Error saving fragment:', error);
      toast({
        title: 'Error saving',
        description: 'Could not save your fragment.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const completeCycle = async () => {
    if (!user || !currentCycle) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('journal_cycles')
        .update({
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCycle.id);

      if (error) throw error;

      toast({
        title: 'Cycle completed!',
        description: `You've completed cycle ${currentCycle.cycle_number} on the ${board} board.`
      });

      setCurrentCycle(null);
    } catch (error) {
      console.error('Error completing cycle:', error);
    } finally {
      setSaving(false);
    }
  };

  const getVisitedTilesSet = useCallback(() => {
    if (!currentCycle?.tiles_visited) return new Set<string>();
    return new Set(currentCycle.tiles_visited.map(tileId => {
      const row = Math.floor((tileId - 1) / 8);
      const col = (tileId - 1) % 8;
      return `${row}-${col}`;
    }));
  }, [currentCycle]);

  return {
    user,
    currentCycle,
    polenEntries,
    loading,
    saving,
    recentlySyncedTiles,
    recentlySyncedPolen,
    startNewCycle,
    visitTile,
    updatePhase,
    updateToleranceZone,
    savePolenEntry,
    completeCycle,
    getVisitedTilesSet,
    isAuthenticated: !!user
  };
};
