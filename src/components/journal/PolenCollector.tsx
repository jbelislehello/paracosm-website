import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Zap, Plus, Image, Quote, Link, Mic, Camera, Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useExpansionJournal } from '@/hooks/useExpansionJournal';
import { KnowledgeImageExtractor } from '@/components/calm-magic/KnowledgeImageExtractor';
import { KnowledgeExtraction } from '@/types/knowledge';

type ChargeType = 'expanding' | 'contracting' | 'neutral';

interface PolenCollectorProps {
  selectedTileId?: number;
  projectId?: string | null;
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
  projectId,
  onPolenSaved
}) => {
  const { savePolenEntry, polenEntries, loading } = useExpansionJournal(projectId);
  const [content, setContent] = useState('');
  const [fragmentType, setFragmentType] = useState<FragmentType>('text');
  const [sourceReference, setSourceReference] = useState('');
  const [tags, setTags] = useState('');
  const [showKnowledgeExtractor, setShowKnowledgeExtractor] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [charge, setCharge] = useState<ChargeType>('neutral');

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
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      intensity,
      charge
    });

    setContent('');
    setSourceReference('');
    setTags('');
    setIntensity(50);
    setCharge('neutral');
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

          {/* Intensity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-200/80">Intensity</span>
              <span className="text-yellow-300 font-medium">{intensity}%</span>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={(value) => setIntensity(value[0])}
              min={0}
              max={100}
              step={5}
              className="[&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtle</span>
              <span>Significant</span>
            </div>
          </div>

          {/* Charge Selector */}
          <div className="space-y-2">
            <span className="text-sm text-yellow-200/80">Charge</span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={charge === 'expanding' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCharge('expanding')}
                className={charge === 'expanding' ? 'bg-green-600 hover:bg-green-700' : 'border-green-500/30 text-green-400 hover:bg-green-950/30'}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Expanding
              </Button>
              <Button
                type="button"
                variant={charge === 'neutral' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCharge('neutral')}
                className={charge === 'neutral' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-500/30'}
              >
                <Minus className="h-4 w-4 mr-1" />
                Neutral
              </Button>
              <Button
                type="button"
                variant={charge === 'contracting' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCharge('contracting')}
                className={charge === 'contracting' ? 'bg-red-600 hover:bg-red-700' : 'border-red-500/30 text-red-400 hover:bg-red-950/30'}
              >
                <TrendingDown className="h-4 w-4 mr-1" />
                Contracting
              </Button>
            </div>
          </div>

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
            {polenEntries.slice(0, 10).map((polen) => {
              const entryIntensity = polen.intensity ?? 50;
              const entryCharge = polen.charge as ChargeType | undefined;
              
              return (
                <div
                  key={polen.id}
                  className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-yellow-500/30 transition-colors relative overflow-hidden"
                >
                  {/* Intensity bar at bottom */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-600/60 to-yellow-400/80 transition-all"
                    style={{ width: `${entryIntensity}%` }}
                  />
                  
                  <div className="flex items-start gap-2">
                    {/* Charge indicator */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-yellow-500">
                        {FRAGMENT_ICONS[polen.fragment_type as FragmentType]}
                      </div>
                      {entryCharge && entryCharge !== 'neutral' && (
                        <div className={`${
                          entryCharge === 'expanding' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {entryCharge === 'expanding' ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm line-clamp-2 flex-1">{polen.content}</p>
                        {/* Intensity badge for high-intensity entries */}
                        {entryIntensity >= 75 && (
                          <Badge 
                            variant="outline" 
                            className="text-[10px] px-1.5 py-0 h-4 border-yellow-500/50 text-yellow-400 shrink-0"
                          >
                            {entryIntensity}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-1 mt-1 flex-wrap items-center">
                        {/* Charge badge */}
                        {entryCharge && (
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] px-1.5 py-0 h-4 ${
                              entryCharge === 'expanding' 
                                ? 'border-green-500/50 text-green-400' 
                                : entryCharge === 'contracting'
                                ? 'border-red-500/50 text-red-400'
                                : 'border-yellow-500/30 text-yellow-400/60'
                            }`}
                          >
                            {entryCharge === 'expanding' ? '↑' : entryCharge === 'contracting' ? '↓' : '○'}
                          </Badge>
                        )}
                        
                        {polen.tags && polen.tags.length > 0 && (
                          <>
                            {polen.tags.map((tag: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
