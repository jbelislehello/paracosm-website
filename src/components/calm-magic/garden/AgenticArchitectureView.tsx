import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Check, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AGENTIC_LAYERS, LAYER_ORDER, AgenticLayerKey } from '@/data/agenticLayers';
import { PrdSeasonData } from './AgenticPrdRenderer';

interface AgenticArchitectureViewProps {
  prdData: PrdSeasonData | null;
}

// Map agentic layers to PRD fields that feed them
const LAYER_PRD_MAPPING: Record<AgenticLayerKey, string[]> = {
  governance: ['totems_security_policies', 'totems_access_controls', 'pollens_constraints', 'anthems_brand_narrative'],
  application: ['poems_prototypes', 'poems_people', 'anthems_market_positioning', 'anthems_audience_segments'],
  memory: ['noems_concepts', 'noems_mental_models', 'poems_messages'],
  cognition: ['noems_intuitions', 'noems_shared_ideas', 'noems_mental_models'],
  tooling: ['poems_systems', 'totems_integration_points', 'poems_objects'],
  protocol: ['totems_data_architecture', 'totems_system_requirements'],
  agent_internet: ['totems_integration_points', 'noems_concepts'],
  infrastructure: ['pollens_aspirations', 'pollens_stakes', 'anthems_success_signals', 'totems_technical_debt']
};

const LAYER_COLORS: Record<AgenticLayerKey, { bg: string; border: string; text: string }> = {
  governance: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-600 dark:text-rose-400' },
  application: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-600 dark:text-violet-400' },
  memory: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600 dark:text-blue-400' },
  cognition: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-600 dark:text-cyan-400' },
  tooling: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400' },
  protocol: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-600 dark:text-amber-400' },
  agent_internet: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-600 dark:text-indigo-400' },
  infrastructure: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-600 dark:text-slate-400' }
};

const AgenticArchitectureView: React.FC<AgenticArchitectureViewProps> = ({ prdData }) => {
  const [expandedLayer, setExpandedLayer] = useState<AgenticLayerKey | null>('governance');

  const getLayerReadiness = (layerKey: AgenticLayerKey): number => {
    if (!prdData) return 0;
    
    const fields = LAYER_PRD_MAPPING[layerKey] || [];
    if (fields.length === 0) return 0;
    
    const filledFields = fields.filter(field => {
      const value = prdData[field as keyof PrdSeasonData];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
    
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const getLayerContent = (layerKey: AgenticLayerKey): Record<string, string> => {
    if (!prdData) return {};
    
    const fields = LAYER_PRD_MAPPING[layerKey] || [];
    const result: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = prdData[field as keyof PrdSeasonData];
      if (value && typeof value === 'string' && value.trim()) {
        result[field] = value;
      }
    });
    
    return result;
  };

  const getOverallReadiness = (): number => {
    const readinessValues = LAYER_ORDER.map(key => getLayerReadiness(key));
    return Math.round(readinessValues.reduce((a, b) => a + b, 0) / readinessValues.length);
  };

  // Render layer number (L8 at top, L1 at bottom)
  const getLayerNumber = (layerKey: AgenticLayerKey): number => {
    return 8 - LAYER_ORDER.indexOf(layerKey);
  };

  const getStatusIcon = (readiness: number) => {
    if (readiness >= 75) return <Check className="w-4 h-4 text-emerald-500" />;
    if (readiness >= 25) return <Circle className="w-4 h-4 text-amber-500" />;
    return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">8-Layer Agentic Architecture</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                PRD content mapped to agentic AI infrastructure
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{getOverallReadiness()}%</div>
              <p className="text-xs text-muted-foreground">Architecture Readiness</p>
            </div>
          </div>
          <Progress value={getOverallReadiness()} className="h-2 mt-4" />
        </CardContent>
      </Card>

      {/* Architecture Stack Visualization */}
      <div className="space-y-2">
        {LAYER_ORDER.map((layerKey) => {
          const layer = AGENTIC_LAYERS[layerKey];
          const readiness = getLayerReadiness(layerKey);
          const colors = LAYER_COLORS[layerKey];
          const layerNumber = getLayerNumber(layerKey);
          const content = getLayerContent(layerKey);
          const isExpanded = expandedLayer === layerKey;
          const hasContent = Object.keys(content).length > 0;

          return (
            <Card 
              key={layerKey}
              className={cn(
                "transition-all duration-200",
                colors.border,
                "border",
                isExpanded && "ring-1 ring-primary/50"
              )}
            >
              <Collapsible 
                open={isExpanded} 
                onOpenChange={(open) => setExpandedLayer(open ? layerKey : null)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className={cn(
                    "cursor-pointer py-3 hover:bg-muted/30 transition-colors",
                    hasContent && colors.bg
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Layer Number Badge */}
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold",
                          colors.bg,
                          colors.text
                        )}>
                          L{layerNumber}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{layer.name}</span>
                            {getStatusIcon(readiness)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {layer.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <Badge 
                            variant={readiness >= 75 ? "default" : readiness >= 25 ? "secondary" : "outline"}
                            className={cn(
                              "text-xs",
                              readiness >= 75 && "bg-emerald-500"
                            )}
                          >
                            {readiness}%
                          </Badge>
                        </div>
                        <Progress value={readiness} className="w-20 h-1.5 hidden md:flex" />
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {/* Layer Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-medium text-muted-foreground mb-2">Purpose</h5>
                        <p className="text-sm">{layer.purpose}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-muted-foreground mb-2">Key Components</h5>
                        <div className="flex flex-wrap gap-1">
                          {layer.stackComponents.map((component, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* PRD Questions */}
                    <div>
                      <h5 className="text-xs font-medium text-muted-foreground mb-2">PRD Questions</h5>
                      <ul className="space-y-1">
                        {layer.prdQuestions.map((question, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Content from PRD */}
                    {hasContent && (
                      <div className="pt-3 border-t border-border/50">
                        <h5 className="text-xs font-medium text-muted-foreground mb-3">
                          PRD Content Feeding This Layer
                        </h5>
                        <div className="space-y-2">
                          {Object.entries(content).map(([field, value]) => (
                            <div key={field} className={cn(
                              "p-3 rounded-lg border",
                              colors.border,
                              colors.bg
                            )}>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {field.replace(/_/g, ' ')}
                              </span>
                              <p className="text-sm mt-1 line-clamp-3">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!hasContent && (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        No PRD content yet feeds this layer. Complete relevant seasons.
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Architecture Legend */}
      <Card className="bg-muted/20">
        <CardContent className="py-4">
          <h5 className="text-xs font-medium text-muted-foreground mb-3">Architecture Overview</h5>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-center">
            {LAYER_ORDER.map((key) => {
              const colors = LAYER_COLORS[key];
              const layerNum = getLayerNumber(key);
              const readiness = getLayerReadiness(key);
              
              return (
                <div 
                  key={key}
                  className={cn(
                    "p-2 rounded-lg border",
                    colors.border,
                    colors.bg
                  )}
                >
                  <div className={cn("font-mono text-xs font-bold", colors.text)}>
                    L{layerNum}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {AGENTIC_LAYERS[key].name.split(' ')[0]}
                  </div>
                  <Progress value={readiness} className="h-1 mt-1" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgenticArchitectureView;
