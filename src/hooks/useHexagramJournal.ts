import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HexagramReading {
  id: string;
  user_id: string;
  question: string;
  primary_hexagram: number;
  relating_hexagram: number | null;
  changing_lines: number[];
  interpretation: string | null;
  tile_id: number | null;
  cycle_id: string | null;
  emotional_state: Record<string, any> | null;
  tags: string[];
  reflection: string | null;
  created_at: string;
}

export interface HexagramPattern {
  hexagram: number;
  count: number;
  contexts: string[];
  lastAppeared: string;
}

export interface JournalAnalysis {
  totalReadings: number;
  mostFrequentHexagrams: HexagramPattern[];
  changingLinePatterns: { line: number; count: number }[];
  recentThemes: string[];
  hexagramPairs: { primary: number; relating: number; count: number }[];
}

export const useHexagramJournal = () => {
  const [readings, setReadings] = useState<HexagramReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JournalAnalysis | null>(null);
  const { toast } = useToast();

  const fetchReadings = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('hexagram_readings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: HexagramReading[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        question: item.question,
        primary_hexagram: item.primary_hexagram,
        relating_hexagram: item.relating_hexagram,
        changing_lines: item.changing_lines || [],
        interpretation: item.interpretation,
        tile_id: item.tile_id,
        cycle_id: item.cycle_id,
        emotional_state: item.emotional_state as Record<string, any> | null,
        tags: item.tags || [],
        reflection: item.reflection,
        created_at: item.created_at
      }));
      
      setReadings(transformedData);
      analyzePatterns(transformedData);
    } catch (error) {
      console.error('Error fetching readings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveReading = async (reading: Omit<HexagramReading, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save oracle readings.",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('hexagram_readings')
        .insert({
          user_id: user.id,
          ...reading
        })
        .select()
        .single();

      if (error) throw error;

      const newReading: HexagramReading = {
        id: data.id,
        user_id: data.user_id,
        question: data.question,
        primary_hexagram: data.primary_hexagram,
        relating_hexagram: data.relating_hexagram,
        changing_lines: data.changing_lines || [],
        interpretation: data.interpretation,
        tile_id: data.tile_id,
        cycle_id: data.cycle_id,
        emotional_state: data.emotional_state as Record<string, any> | null,
        tags: data.tags || [],
        reflection: data.reflection,
        created_at: data.created_at
      };

      setReadings(prev => [newReading, ...prev]);
      analyzePatterns([newReading, ...readings]);

      toast({
        title: "Reading saved",
        description: "Your oracle reading has been saved to your journal."
      });

      return newReading;
    } catch (error) {
      console.error('Error saving reading:', error);
      toast({
        title: "Error",
        description: "Failed to save reading.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateReflection = async (id: string, reflection: string) => {
    try {
      const { error } = await supabase
        .from('hexagram_readings')
        .update({ reflection })
        .eq('id', id);

      if (error) throw error;

      setReadings(prev => prev.map(r => r.id === id ? { ...r, reflection } : r));
      
      toast({
        title: "Reflection saved",
        description: "Your reflection has been updated."
      });
    } catch (error) {
      console.error('Error updating reflection:', error);
    }
  };

  const deleteReading = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hexagram_readings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updated = readings.filter(r => r.id !== id);
      setReadings(updated);
      analyzePatterns(updated);

      toast({
        title: "Reading deleted",
        description: "The oracle reading has been removed."
      });
    } catch (error) {
      console.error('Error deleting reading:', error);
    }
  };

  const analyzePatterns = (data: HexagramReading[]) => {
    if (data.length === 0) {
      setAnalysis(null);
      return;
    }

    // Count hexagram frequencies
    const hexagramCounts = new Map<number, { count: number; contexts: string[]; lastAppeared: string }>();
    
    data.forEach(reading => {
      const existing = hexagramCounts.get(reading.primary_hexagram);
      if (existing) {
        existing.count++;
        if (reading.question) existing.contexts.push(reading.question.slice(0, 50));
      } else {
        hexagramCounts.set(reading.primary_hexagram, {
          count: 1,
          contexts: reading.question ? [reading.question.slice(0, 50)] : [],
          lastAppeared: reading.created_at
        });
      }
    });

    const mostFrequentHexagrams: HexagramPattern[] = Array.from(hexagramCounts.entries())
      .map(([hexagram, data]) => ({
        hexagram,
        count: data.count,
        contexts: data.contexts.slice(0, 3),
        lastAppeared: data.lastAppeared
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Analyze changing lines
    const lineCounts = new Map<number, number>();
    data.forEach(reading => {
      (reading.changing_lines || []).forEach(line => {
        lineCounts.set(line, (lineCounts.get(line) || 0) + 1);
      });
    });

    const changingLinePatterns = Array.from(lineCounts.entries())
      .map(([line, count]) => ({ line, count }))
      .sort((a, b) => b.count - a.count);

    // Find hexagram pairs
    const pairCounts = new Map<string, { primary: number; relating: number; count: number }>();
    data.forEach(reading => {
      if (reading.relating_hexagram) {
        const key = `${reading.primary_hexagram}-${reading.relating_hexagram}`;
        const existing = pairCounts.get(key);
        if (existing) {
          existing.count++;
        } else {
          pairCounts.set(key, {
            primary: reading.primary_hexagram,
            relating: reading.relating_hexagram,
            count: 1
          });
        }
      }
    });

    const hexagramPairs = Array.from(pairCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Extract recent themes from questions
    const recentThemes = data.slice(0, 10)
      .map(r => r.question)
      .filter(Boolean)
      .slice(0, 5);

    setAnalysis({
      totalReadings: data.length,
      mostFrequentHexagrams,
      changingLinePatterns,
      recentThemes,
      hexagramPairs
    });
  };

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  return {
    readings,
    loading,
    analysis,
    saveReading,
    updateReflection,
    deleteReading,
    fetchReadings
  };
};
