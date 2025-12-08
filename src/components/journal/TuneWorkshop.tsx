import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Plus, FileText, Rocket, Megaphone } from 'lucide-react';
import { useExpansionJournal } from '@/hooks/useExpansionJournal';

interface TuneWorkshopProps {
  onPoemCreated?: () => void;
}

type PoemType = 'story' | 'metaphor' | 'anthem' | 'manifold';

const POEM_TYPE_INFO: Record<PoemType, { icon: React.ReactNode; label: string; description: string }> = {
  story: { 
    icon: <FileText className="h-4 w-4" />, 
    label: 'Story', 
    description: 'A narrative frame for your project' 
  },
  metaphor: { 
    icon: <Megaphone className="h-4 w-4" />, 
    label: 'Metaphor', 
    description: 'A symbolic kernel that captures essence' 
  },
  anthem: { 
    icon: <Music className="h-4 w-4" />, 
    label: 'Anthem', 
    description: 'The emotional signature of your work' 
  },
  manifold: { 
    icon: <Rocket className="h-4 w-4" />, 
    label: 'Manifold', 
    description: 'A coherent model ready for PRD' 
  }
};

export const TuneWorkshop: React.FC<TuneWorkshopProps> = ({
  onPoemCreated
}) => {
  const { noems, poems, savePoem, loading } = useExpansionJournal();
  const [title, setTitle] = useState('');
  const [narrative, setNarrative] = useState('');
  const [poemType, setPoemType] = useState<PoemType>('story');
  const [marketFit, setMarketFit] = useState('');
  const [techStackHints, setTechStackHints] = useState('');
  const [selectedNoems, setSelectedNoems] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!title.trim() || !narrative.trim()) return;

    await savePoem({
      title: title.trim(),
      narrative: narrative.trim(),
      connected_noem_ids: selectedNoems,
      poem_type: poemType,
      market_fit: marketFit || undefined,
      tech_stack_hints: techStackHints.split(',').map(t => t.trim()).filter(Boolean)
    });

    setTitle('');
    setNarrative('');
    setMarketFit('');
    setTechStackHints('');
    setSelectedNoems([]);
    onPoemCreated?.();
  };

  const toggleNoem = (noemId: string) => {
    setSelectedNoems(prev => 
      prev.includes(noemId) 
        ? prev.filter(id => id !== noemId)
        : [...prev, noemId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Noem Selection */}
      <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-purple-300">
            <Music className="h-5 w-5" />
            Tune & Compose
          </CardTitle>
          <p className="text-sm text-purple-200/60">
            Shape insights into narratives, anthems, and manifolds.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Noem Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
            {noems.map((noem) => (
              <button
                key={noem.id}
                onClick={() => toggleNoem(noem.id)}
                className={`p-2 rounded-lg text-left text-xs transition-all ${
                  selectedNoems.includes(noem.id)
                    ? 'bg-purple-600/30 border-purple-400 border-2'
                    : 'bg-muted/50 border border-border/50 hover:border-purple-500/50'
                }`}
              >
                <p className="font-medium">{noem.title}</p>
                <p className="text-muted-foreground line-clamp-1">{noem.insight}</p>
              </button>
            ))}
          </div>

          {/* Poem Type */}
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(POEM_TYPE_INFO) as PoemType[]).map((type) => (
              <Button
                key={type}
                variant={poemType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPoemType(type)}
                className={`flex-col h-auto py-2 ${
                  poemType === type ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/30'
                }`}
              >
                {POEM_TYPE_INFO[type].icon}
                <span className="text-xs mt-1">{POEM_TYPE_INFO[type].label}</span>
              </Button>
            ))}
          </div>

          {/* Poem Creation */}
          <div className="space-y-3">
            <Input
              placeholder="Title your narrative..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-purple-500/30"
            />

            <Textarea
              placeholder={POEM_TYPE_INFO[poemType].description}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="min-h-[100px] bg-background/50 border-purple-500/30"
            />

            {poemType === 'manifold' && (
              <>
                <Input
                  placeholder="Market fit description..."
                  value={marketFit}
                  onChange={(e) => setMarketFit(e.target.value)}
                  className="bg-background/50 border-purple-500/30"
                />
                <Input
                  placeholder="Tech stack hints (comma-separated)..."
                  value={techStackHints}
                  onChange={(e) => setTechStackHints(e.target.value)}
                  className="bg-background/50 border-purple-500/30"
                />
              </>
            )}

            <Button 
              onClick={handleSubmit} 
              disabled={!title.trim() || !narrative.trim() || loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Compose {POEM_TYPE_INFO[poemType].label}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Poems Gallery */}
      <Card className="bg-background/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Narrative Artifacts</span>
            <Badge variant="outline">{poems.length} poems</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {poems.map((poem) => (
              <div
                key={poem.id}
                className="p-3 rounded-lg bg-gradient-to-r from-purple-950/30 to-transparent border border-purple-500/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {POEM_TYPE_INFO[poem.poem_type as PoemType]?.icon}
                    <h4 className="font-medium text-sm text-purple-200">{poem.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                    {poem.poem_type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {poem.narrative}
                </p>
                {poem.tech_stack_hints?.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {poem.tech_stack_hints.map((hint: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {hint}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {poems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No narratives composed yet. Tune your insights into stories.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TuneWorkshop;
