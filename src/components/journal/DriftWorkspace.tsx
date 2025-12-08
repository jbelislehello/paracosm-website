import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Waves, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { useExpansionJournal } from '@/hooks/useExpansionJournal';

interface DriftWorkspaceProps {
  onNoemCreated?: () => void;
}

export const DriftWorkspace: React.FC<DriftWorkspaceProps> = ({
  onNoemCreated
}) => {
  const { polenEntries, noems, saveNoem, loading } = useExpansionJournal();
  const [title, setTitle] = useState('');
  const [insight, setInsight] = useState('');
  const [selectedPolen, setSelectedPolen] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!title.trim() || !insight.trim()) return;

    await saveNoem({
      title: title.trim(),
      insight: insight.trim(),
      connected_polen_ids: selectedPolen,
      maturity: 'seed'
    });

    setTitle('');
    setInsight('');
    setSelectedPolen([]);
    onNoemCreated?.();
  };

  const togglePolen = (polenId: string) => {
    setSelectedPolen(prev => 
      prev.includes(polenId) 
        ? prev.filter(id => id !== polenId)
        : [...prev, polenId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Polen Selection */}
      <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-300">
            <Waves className="h-5 w-5" />
            Drift & Connect
          </CardTitle>
          <p className="text-sm text-blue-200/60">
            Select fragments and let patterns emerge into insights.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Polen Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
            {polenEntries.map((polen) => (
              <button
                key={polen.id}
                onClick={() => togglePolen(polen.id)}
                className={`p-2 rounded-lg text-left text-xs transition-all ${
                  selectedPolen.includes(polen.id)
                    ? 'bg-blue-600/30 border-blue-400 border-2'
                    : 'bg-muted/50 border border-border/50 hover:border-blue-500/50'
                }`}
              >
                <p className="line-clamp-2">{polen.content}</p>
              </button>
            ))}
          </div>

          {selectedPolen.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-blue-200/70">
              <span>{selectedPolen.length} fragments selected</span>
              <ArrowRight className="h-4 w-4" />
              <span>Crystallize into Noem</span>
            </div>
          )}

          {/* Noem Creation */}
          <div className="pt-4 border-t border-blue-500/20 space-y-3">
            <Input
              placeholder="Name this insight..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-blue-500/30"
            />

            <Textarea
              placeholder="What pattern or insight emerges from these fragments?"
              value={insight}
              onChange={(e) => setInsight(e.target.value)}
              className="min-h-[80px] bg-background/50 border-blue-500/30"
            />

            <Button 
              onClick={handleSubmit} 
              disabled={!title.trim() || !insight.trim() || loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Crystallize Noem
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Noems Topology */}
      <Card className="bg-background/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Knowledge Topology</span>
            <Badge variant="outline">{noems.length} noems</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {noems.map((noem) => (
              <div
                key={noem.id}
                className="p-3 rounded-lg bg-gradient-to-r from-blue-950/30 to-transparent border border-blue-500/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-blue-200">{noem.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {noem.insight}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      noem.maturity === 'ripe' 
                        ? 'border-green-500 text-green-400'
                        : noem.maturity === 'growing'
                        ? 'border-yellow-500 text-yellow-400'
                        : 'border-blue-500 text-blue-400'
                    }`}
                  >
                    {noem.maturity}
                  </Badge>
                </div>
                {noem.connected_polen_ids?.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {noem.connected_polen_ids.length} connected fragments
                  </div>
                )}
              </div>
            ))}
            {noems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No insights crystallized yet. Let patterns emerge.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriftWorkspace;
