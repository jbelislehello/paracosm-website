import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface PrdCompilationCardProps {
  prdData: any;
  prdId: string | null;
  userId: string;
  onCompilationComplete: () => void;
}

const SEASON_CONFIG: Record<Season, { label: string; icon: string; fields: string[] }> = {
  POLLENS: { 
    label: 'Pollens', 
    icon: '🌸',
    fields: ['pollens_aspirations', 'pollens_team_dynamics', 'pollens_cultural_elements', 'pollens_relational_patterns', 'pollens_constraints', 'pollens_stakes']
  },
  NOEMS: { 
    label: 'Noems', 
    icon: '💡',
    fields: ['noems_concepts', 'noems_shared_ideas', 'noems_intuitions', 'noems_mental_models']
  },
  POEMS: { 
    label: 'Poems', 
    icon: '📖',
    fields: ['poems_people', 'poems_objects', 'poems_environments', 'poems_messages', 'poems_systems', 'poems_prototypes']
  },
  TOTEMS: { 
    label: 'Totems', 
    icon: '💎',
    fields: ['totems_data_architecture', 'totems_security_policies', 'totems_access_controls', 'totems_system_requirements', 'totems_integration_points', 'totems_technical_debt']
  },
  ANTHEMS: { 
    label: 'Anthems', 
    icon: '🎵',
    fields: ['anthems_market_positioning', 'anthems_brand_narrative', 'anthems_go_to_market', 'anthems_audience_segments', 'anthems_success_signals', 'anthems_storytelling_assets']
  },
};

const SEASONS: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

export const PrdCompilationCard: React.FC<PrdCompilationCardProps> = ({
  prdData,
  prdId,
  userId,
  onCompilationComplete
}) => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<Season | null>(null);
  const [completedLayers, setCompletedLayers] = useState<Season[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check if a layer has content
  const hasLayerContent = (season: Season): boolean => {
    if (!prdData) return false;
    const fields = SEASON_CONFIG[season].fields;
    return fields.some(field => {
      const value = prdData[field];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
  };

  // Get empty layers
  const emptyLayers = SEASONS.filter(season => !hasLayerContent(season));
  const filledLayers = SEASONS.filter(season => hasLayerContent(season));

  // Calculate progress
  const totalLayers = emptyLayers.length;
  const progress = totalLayers > 0 
    ? (completedLayers.length / totalLayers) * 100 
    : 100;

  const compileLayer = async (layer: Season): Promise<Record<string, string>> => {
    // Fetch POLEN entries for this layer
    const { data: entries, error: fetchError } = await supabase
      .from('polen_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('season_context', layer)
      .order('created_at', { ascending: true });

    if (fetchError) {
      throw new Error(`Failed to fetch ${layer} entries: ${fetchError.message}`);
    }

    if (!entries || entries.length === 0) {
      console.log(`No entries found for ${layer}, skipping...`);
      return {};
    }

    // Call generate-prd-stage edge function
    const { data, error: genError } = await supabase.functions.invoke('generate-prd-stage', {
      body: {
        layer,
        polenEntries: entries.map(e => ({
          content: e.content,
          tileId: e.tile_id,
          tags: e.tags || []
        })),
        board: layer,
        existingContent: prdData
      }
    });

    if (genError) {
      throw new Error(`Failed to generate ${layer}: ${genError.message}`);
    }

    return data || {};
  };

  const handleCompileMissing = async () => {
    if (!prdId || emptyLayers.length === 0) return;

    setIsCompiling(true);
    setError(null);
    setCompletedLayers([]);

    try {
      for (const layer of emptyLayers) {
        setCurrentLayer(layer);
        
        const generatedContent = await compileLayer(layer);
        
        if (Object.keys(generatedContent).length > 0) {
          // Update PRD with generated content
          const { error: updateError } = await supabase
            .from('prds')
            .update(generatedContent)
            .eq('id', prdId);

          if (updateError) {
            throw new Error(`Failed to save ${layer}: ${updateError.message}`);
          }
        }

        setCompletedLayers(prev => [...prev, layer]);
        toast.success(`${SEASON_CONFIG[layer].label} layer compiled`);
      }

      toast.success('All missing layers compiled successfully!');
      onCompilationComplete();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error(`Compilation failed: ${message}`);
    } finally {
      setIsCompiling(false);
      setCurrentLayer(null);
    }
  };

  if (!prdId) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">No PRD found. Complete at least one season to create a PRD.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          PRD Compilation Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Layer Status Grid */}
        <div className="grid grid-cols-5 gap-2">
          {SEASONS.map(season => {
            const hasContent = hasLayerContent(season);
            const isCurrentlyCompiling = currentLayer === season;
            const justCompleted = completedLayers.includes(season);
            
            return (
              <div 
                key={season}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                  ${hasContent || justCompleted ? 'bg-green-500/10' : 'bg-muted/50'}
                  ${isCurrentlyCompiling ? 'ring-2 ring-primary animate-pulse' : ''}
                `}
              >
                <span className="text-lg">{SEASON_CONFIG[season].icon}</span>
                {isCurrentlyCompiling ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : hasContent || justCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-[10px] text-muted-foreground font-medium">
                  {SEASON_CONFIG[season].label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar (shown during compilation) */}
        {isCompiling && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Compiling {currentLayer && SEASON_CONFIG[currentLayer].label}...</span>
              <span>{completedLayers.length}/{totalLayers}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Status Summary & Action */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            {emptyLayers.length === 0 ? (
              <span className="text-green-600 font-medium">✓ All layers complete</span>
            ) : (
              <span>{filledLayers.length}/5 layers filled • {emptyLayers.length} missing</span>
            )}
          </div>
          
          {emptyLayers.length > 0 && (
            <Button
              onClick={handleCompileMissing}
              disabled={isCompiling}
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isCompiling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Compiling...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Compile {emptyLayers.length} Missing
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
