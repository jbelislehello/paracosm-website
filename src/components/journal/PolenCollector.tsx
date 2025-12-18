import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, Plus, Image, Quote, Link, Mic, Camera, Brain } from 'lucide-react';
import { useExpansionJournal } from '@/hooks/useExpansionJournal';
import { KnowledgeImageExtractor } from '@/components/calm-magic/KnowledgeImageExtractor';
import { KnowledgeExtraction } from '@/types/knowledge';

interface PolenCollectorProps {
  selectedTileId?: number;
  onPolenSaved?: () => void;
}

type FragmentType = 'text' | 'quote' | 'image' | 'voice' | 'screenshot' | 'link' | 'knowledge-image';

const FRAGMENT_ICONS: Record<FragmentType, React.ReactNode> = {
  text: <Zap className="h-4 w-4" />,
  quote: <Quote className="h-4 w-4" />,
  image: <Image className="h-4 w-4" />,
  voice: <Mic className="h-4 w-4" />,
  screenshot: <Camera className="h-4 w-4" />,
  link: <Link className="h-4 w-4" />,
  'knowledge-image': <Brain className="h-4 w-4" />
};

export const PolenCollector: React.FC<PolenCollectorProps> = ({
  selectedTileId,
  onPolenSaved
}) => {
  const { savePolenEntry, polenEntries, loading } = useExpansionJournal();
  const [content, setContent] = useState('');
  const [fragmentType, setFragmentType] = useState<FragmentType>('text');
  const [sourceReference, setSourceReference] = useState('');
  const [tags, setTags] = useState('');
  const [showKnowledgeExtractor, setShowKnowledgeExtractor] = useState(false);

  const handleKnowledgeExtracted = async (
    extractedContent: string, 
    extractedTags: string[],
    extraction: KnowledgeExtraction
  ) => {
    // Auto-fill the form with extracted content
    setContent(extractedContent);
    setTags(extractedTags.join(', '));
    setFragmentType('knowledge-image');
    setSourceReference(`Knowledge extraction: ${extraction.knowledgeType}`);
    setShowKnowledgeExtractor(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    // Map knowledge-image to 'image' for database storage
    const dbFragmentType = fragmentType === 'knowledge-image' ? 'image' : fragmentType;

    await savePolenEntry({
      content: content.trim(),
      fragment_type: dbFragmentType,
      source_reference: sourceReference || undefined,
      tile_id: selectedTileId,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setContent('');
    setSourceReference('');
    setTags('');
    onPolenSaved?.();
  };

  return (
    <div className="space-y-4">
      {/* Input Card */}
      <Card className="bg-gradient-to-br from-yellow-950/30 to-orange-950/30 border-yellow-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-yellow-300">
            <Zap className="h-5 w-5" />
            Capture Polen
          </CardTitle>
          <p className="text-sm text-yellow-200/60">
            What's weird, fascinating, or doesn't quite fit?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fragment Type Selector */}
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(FRAGMENT_ICONS) as FragmentType[]).map((type) => (
              <Button
                key={type}
                variant={fragmentType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFragmentType(type);
                  if (type === 'knowledge-image') {
                    setShowKnowledgeExtractor(true);
                  }
                }}
                className={fragmentType === type ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-500/30'}
              >
                {FRAGMENT_ICONS[type]}
                <span className="ml-1 capitalize">{type === 'knowledge-image' ? 'Knowledge' : type}</span>
              </Button>
            ))}
          </div>

          {/* Knowledge Image Extractor */}
          {showKnowledgeExtractor && (
            <KnowledgeImageExtractor
              onExtracted={handleKnowledgeExtracted}
              onCancel={() => {
                setShowKnowledgeExtractor(false);
                setFragmentType('text');
              }}
            />
          )}

          {/* Content Input */}
          <Textarea
            placeholder="Capture the fragment before you explain it away..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] bg-background/50 border-yellow-500/30 focus:border-yellow-400"
          />

          {/* Source Reference */}
          <Input
            placeholder="Source reference (optional)"
            value={sourceReference}
            onChange={(e) => setSourceReference(e.target.value)}
            className="bg-background/50 border-yellow-500/30"
          />

          {/* Tags */}
          <Input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-background/50 border-yellow-500/30"
          />

          {/* Tile Info */}
          {selectedTileId && (
            <div className="text-sm text-yellow-200/60">
              Linking to Tile #{selectedTileId}
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            disabled={!content.trim() || loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Save Fragment
          </Button>
        </CardContent>
      </Card>

      {/* Recent Polen */}
      <Card className="bg-background/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Recent Fragments</span>
            <Badge variant="outline">{polenEntries.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {polenEntries.slice(0, 10).map((polen) => (
              <div
                key={polen.id}
                className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-yellow-500/30 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className="text-yellow-500 mt-1">
                    {FRAGMENT_ICONS[polen.fragment_type as FragmentType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{polen.content}</p>
                    {polen.tags && polen.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {polen.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {polenEntries.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No fragments captured yet. Start noticing what's weird.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolenCollector;
