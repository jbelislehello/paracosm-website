
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmotionalState, JournalEntry, GardenType } from '@/types/journal';
import { useToast } from '@/hooks/use-toast';

export const useJournal = () => {
  const [emotionalStates, setEmotionalStates] = useState<EmotionalState[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveEmotionalState = async (state: Omit<EmotionalState, 'id' | 'user_id' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('emotional_states')
        .insert({
          user_id: user.id,
          ...state
        })
        .select()
        .single();

      if (error) throw error;

      setEmotionalStates(prev => [data, ...prev]);
      toast({
        title: "Emotional state saved",
        description: "Your current state has been captured in the garden.",
      });
      
      return data;
    } catch (error) {
      console.error('Error saving emotional state:', error);
      toast({
        title: "Error",
        description: "Failed to save emotional state. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          ...entry
        })
        .select()
        .single();

      if (error) throw error;

      setJournalEntries(prev => [data, ...prev]);
      toast({
        title: "Journal entry saved",
        description: "Your reflection has been captured.",
      });
      
      return data;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmotionalStates = async () => {
    try {
      const { data, error } = await supabase
        .from('emotional_states')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmotionalStates(data || []);
    } catch (error) {
      console.error('Error fetching emotional states:', error);
    }
  };

  const fetchJournalEntries = async (garden?: GardenType) => {
    try {
      let query = supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (garden) {
        query = query.eq('garden', garden);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJournalEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  return {
    emotionalStates,
    journalEntries,
    loading,
    saveEmotionalState,
    saveJournalEntry,
    fetchEmotionalStates,
    fetchJournalEntries
  };
};
