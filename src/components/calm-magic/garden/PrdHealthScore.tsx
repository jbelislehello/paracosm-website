import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Layers, FileText, GitBranch, Cpu, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface PrdHealthScoreProps {
  prdData: any;
  className?: string;
}

interface HealthFactor {
  name: string;
  score: number;
  weight: number;
  icon: React.ElementType;
  description: string;
  status: 'excellent' | 'good' | 'needs-attention' | 'missing';
}

interface LayerStatus {
  season: Season;
  label: string;
  icon: string;
  hasContent: boolean;
  fieldCount: number;
  filledFields: number;
}

const SEASON_FIELDS: Record<Season, string[]> = {
  POLLENS: ['pollens_aspirations', 'pollens_team_dynamics', 'pollens_cultural_elements', 'pollens_relational_patterns', 'pollens_constraints', 'pollens_stakes'],
  NOEMS: ['noems_concepts', 'noems_shared_ideas', 'noems_intuitions', 'noems_mental_models'],
  POEMS: ['poems_people', 'poems_objects', 'poems_environments', 'poems_messages', 'poems_systems', 'poems_prototypes'],
  TOTEMS: ['totems_data_architecture', 'totems_security_policies', 'totems_access_controls', 'totems_system_requirements', 'totems_integration_points', 'totems_technical_debt'],
  ANTHEMS: ['anthems_market_positioning', 'anthems_brand_narrative', 'anthems_go_to_market', 'anthems_audience_segments', 'anthems_success_signals', 'anthems_storytelling_assets'],
};

const SEASON_LABELS: Record<Season, { label: string; icon: string }> = {
  POLLENS: { label: 'Pollens', icon: '🌸' },
  NOEMS: { label: 'Noems', icon: '💡' },
  POEMS: { label: 'Poems', icon: '📖' },
  TOTEMS: { label: 'Totems', icon: '💎' },
  ANTHEMS: { label: 'Anthems', icon: '🎵' },
};

const PrdHealthScore: React.FC<PrdHealthScoreProps> = ({ prdData, className }) => {
  const [fragmentCount, setFragmentCount] = useState(0);
  const [uniqueTiles, setUniqueTiles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch fragment stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        const { data: entries } = await supabase
          .from('polen_entries')
          .select('id, tile_id')
          .eq('user_id', userData.user.id);

        if (entries) {
          setFragmentCount(entries.length);
          const tiles = new Set(entries.map(e => e.tile_id).filter(Boolean));
          setUniqueTiles(tiles.size);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Calculate layer statuses
  const layerStatuses = useMemo((): LayerStatus[] => {
    const seasons: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
    
    return seasons.map(season => {
      const fields = SEASON_FIELDS[season];
      const filledFields = fields.filter(field => {
        const value = prdData?.[field];
        return value && typeof value === 'string' && value.trim().length > 0;
      }).length;

      return {
        season,
        label: SEASON_LABELS[season].label,
        icon: SEASON_LABELS[season].icon,
        hasContent: filledFields > 0,
        fieldCount: fields.length,
        filledFields,
      };
    });
  }, [prdData]);

  // Calculate health factors
  const healthFactors = useMemo((): HealthFactor[] => {
    // Layer completeness (40% weight)
    const totalFields = Object.values(SEASON_FIELDS).flat().length;
    const filledFields = layerStatuses.reduce((sum, l) => sum + l.filledFields, 0);
    const layerScore = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
    
    // Fragment density (30% weight)
    const targetFragments = 100; // Ideal fragment count
    const densityScore = Math.min((fragmentCount / targetFragments) * 100, 100);
    
    // Coverage/coherence (20% weight) - unique tiles visited
    const targetTiles = 64; // Full board
    const coverageScore = Math.min((uniqueTiles / targetTiles) * 100, 100);
    
    // Agentic readiness (10% weight) - has prompt hooks and stack implications
    const agenticFields = [
      'prompt_hooks_pollens', 'prompt_hooks_noems', 'prompt_hooks_poems', 
      'prompt_hooks_totems', 'prompt_hooks_anthems',
      'stack_implications_pollens', 'stack_implications_noems', 
      'stack_implications_poems', 'stack_implications_totems', 'stack_implications_anthems'
    ];
    const filledAgenticFields = agenticFields.filter(f => 
      prdData?.[f] && typeof prdData[f] === 'string' && prdData[f].trim().length > 0
    ).length;
    const agenticScore = (filledAgenticFields / agenticFields.length) * 100;

    const getStatus = (score: number): HealthFactor['status'] => {
      if (score >= 80) return 'excellent';
      if (score >= 50) return 'good';
      if (score > 0) return 'needs-attention';
      return 'missing';
    };

    return [
      {
        name: 'Layer Completeness',
        score: layerScore,
        weight: 40,
        icon: Layers,
        description: `${filledFields}/${totalFields} fields populated across 5 layers`,
        status: getStatus(layerScore),
      },
      {
        name: 'Fragment Density',
        score: densityScore,
        weight: 30,
        icon: FileText,
        description: `${fragmentCount} fragments captured (target: ${targetFragments}+)`,
        status: getStatus(densityScore),
      },
      {
        name: 'Coverage',
        score: coverageScore,
        weight: 20,
        icon: GitBranch,
        description: `${uniqueTiles}/${targetTiles} unique tiles explored`,
        status: getStatus(coverageScore),
      },
      {
        name: 'Agentic Readiness',
        score: agenticScore,
        weight: 10,
        icon: Cpu,
        description: `${filledAgenticFields}/${agenticFields.length} agentic fields compiled`,
        status: getStatus(agenticScore),
      },
    ];
  }, [prdData, fragmentCount, uniqueTiles, layerStatuses]);

  // Calculate overall score
  const overallScore = useMemo(() => {
    return healthFactors.reduce((sum, factor) => {
      return sum + (factor.score * factor.weight / 100);
    }, 0);
  }, [healthFactors]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs: string[] = [];
    
    healthFactors.forEach(factor => {
      if (factor.status === 'missing' || factor.status === 'needs-attention') {
        switch (factor.name) {
          case 'Layer Completeness':
            const emptyLayers = layerStatuses.filter(l => !l.hasContent);
            if (emptyLayers.length > 0) {
              recs.push(`Compile missing layers: ${emptyLayers.map(l => l.label).join(', ')}`);
            }
            break;
          case 'Fragment Density':
            recs.push(`Add more fragments - ${100 - fragmentCount} more to reach target`);
            break;
          case 'Coverage':
            recs.push(`Explore more tiles - ${64 - uniqueTiles} tiles remain unvisited`);
            break;
          case 'Agentic Readiness':
            recs.push('Generate prompt hooks and stack implications for agentic export');
            break;
        }
      }
    });
    
    return recs;
  }, [healthFactors, layerStatuses, fragmentCount, uniqueTiles]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getStatusBadge = (status: HealthFactor['status']) => {
    switch (status) {
      case 'excellent':
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-[10px]">Excellent</Badge>;
      case 'good':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 text-[10px]">Good</Badge>;
      case 'needs-attention':
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 text-[10px]">Needs Work</Badge>;
      default:
        return <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px]">Missing</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("border-border/50", className)}>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-muted/30 rounded w-1/3" />
            <div className="h-4 bg-muted/30 rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/50 bg-gradient-to-br from-background to-primary/5", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            PRD Health Score
          </div>
          <div className={cn("text-3xl font-bold", getScoreColor(overallScore))}>
            {Math.round(overallScore)}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Layer Status Pills */}
        <div className="flex flex-wrap gap-2">
          {layerStatuses.map(layer => (
            <div
              key={layer.season}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
                layer.hasContent 
                  ? "bg-emerald-500/10 text-emerald-600" 
                  : "bg-muted/50 text-muted-foreground"
              )}
            >
              <span>{layer.icon}</span>
              <span>{layer.label}</span>
              {layer.hasContent && <CheckCircle2 className="h-3 w-3" />}
            </div>
          ))}
        </div>

        {/* Health Factors */}
        <div className="grid gap-3">
          {healthFactors.map(factor => (
            <div key={factor.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <factor.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-muted-foreground text-xs">({factor.weight}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(factor.status)}
                  <span className={cn("font-medium", getScoreColor(factor.score))}>
                    {Math.round(factor.score)}%
                  </span>
                </div>
              </div>
              <Progress value={factor.score} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{factor.description}</p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Recommendations
            </div>
            <ul className="space-y-1">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrdHealthScore;
