import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { X, Sparkles, MapPin, Lightbulb, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface JourneySummaryProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeason: string;
}

interface PolenEntry {
  id: string;
  content: string;
  created_at: string;
  tags: string[] | null;
  tile_id: number | null;
}

interface SummaryData {
  themes: string[];
  keyInsights: { text: string; importance: number }[];
  nextAreas: string[];
  connections: { from: string; to: string; relationship: string }[];
}

export const JourneySummary: React.FC<JourneySummaryProps> = ({
  isOpen,
  onClose,
  currentSeason
}) => {
  const [entries, setEntries] = useState<PolenEntry[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEntries();
    }
  }, [isOpen]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      toast.error('Failed to load journey data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = async () => {
    if (entries.length === 0) {
      toast.error('No entries to summarize');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('journey-summary', {
        body: { 
          entries: entries.map(e => ({
            content: e.content,
            tags: e.tags,
            tile_id: e.tile_id,
            created_at: e.created_at
          })),
          currentSeason 
        }
      });

      if (error) throw error;
      setSummary(data);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      toast.error('Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Journey Summary</h2>
            <Badge variant="secondary">{entries.length} entries</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Generate Summary Button */}
              <Button
                onClick={generateSummary}
                disabled={isGenerating || entries.length === 0}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Analyzing...' : 'Generate AI Summary'}
              </Button>

              {/* Summary Results */}
              {summary && (
                <div className="space-y-4">
                  {/* Key Themes */}
                  <Card className="p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Key Themes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {summary.themes.map((theme, i) => (
                        <Badge key={i} variant="outline">{theme}</Badge>
                      ))}
                    </div>
                  </Card>

                  {/* Key Insights */}
                  <Card className="p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Key Insights
                    </h3>
                    <ul className="space-y-2">
                      {summary.keyInsights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-bold">{i + 1}.</span>
                          <span>{insight.text}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Next Areas */}
                  {summary.nextAreas.length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Suggested Exploration</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {summary.nextAreas.map((area, i) => (
                          <li key={i}>• {area}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Connections */}
                  {summary.connections.length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Cross-Tile Connections</h3>
                      <div className="space-y-2 text-sm">
                        {summary.connections.map((conn, i) => (
                          <div key={i} className="flex items-center gap-2 text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">{conn.from}</Badge>
                            <span>→</span>
                            <Badge variant="secondary" className="text-xs">{conn.to}</Badge>
                            <span className="text-xs italic">({conn.relationship})</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Timeline of Entries */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Journey Timeline</h3>
                {entries.map((entry) => (
                  <Card key={entry.id} className="p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{entry.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                          {entry.tile_id && (
                            <Badge variant="outline" className="text-xs">
                              Tile {entry.tile_id}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
