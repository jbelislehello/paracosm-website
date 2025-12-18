import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Flower2, 
  Lightbulb, 
  PenTool, 
  Gem, 
  Music, 
  Copy, 
  Check,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PrdData {
  id?: string;
  title?: string;
  // POLLENS
  love_signals_summary?: string | null;
  love_decision_to_exist?: string | null;
  prompt_hooks_pollens?: string | null;
  // NOEMS
  magic_patterns?: string | null;
  magic_hypotheses?: string | null;
  magic_storyworld?: string | null;
  prompt_hooks_noems?: string | null;
  // POEMS
  magic_prd_outline?: string | null;
  prompt_hooks_poems?: string | null;
  // TOTEMS
  calm_requirements?: string | null;
  calm_risks_and_limits?: string | null;
  prompt_hooks_totems?: string | null;
  // ANTHEMS
  free_first_poem_description?: string | null;
  free_success_criteria?: string | null;
  free_totem_anthem?: string | null;
  free_next_cycle_hooks?: string | null;
  prompt_hooks_anthems?: string | null;
  // Compiled
  compiled_prompt?: string | null;
  compiled_tech_stack?: any;
}

interface GardenPrdPreviewProps {
  prdData: PrdData | null;
  isLoading?: boolean;
  onExport?: () => void;
}

const LAYER_CONFIG = [
  {
    key: 'POLLENS',
    label: 'Pollens',
    icon: Flower2,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    fields: ['love_signals_summary', 'love_decision_to_exist', 'prompt_hooks_pollens'],
    fieldLabels: {
      love_signals_summary: 'Signals Summary',
      love_decision_to_exist: 'Decision to Exist',
      prompt_hooks_pollens: 'Prompt Hooks'
    }
  },
  {
    key: 'NOEMS',
    label: 'Noems',
    icon: Lightbulb,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    fields: ['magic_patterns', 'magic_hypotheses', 'magic_storyworld', 'prompt_hooks_noems'],
    fieldLabels: {
      magic_patterns: 'Patterns',
      magic_hypotheses: 'Hypotheses',
      magic_storyworld: 'Storyworld',
      prompt_hooks_noems: 'Prompt Hooks'
    }
  },
  {
    key: 'POEMS',
    label: 'Poems',
    icon: PenTool,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    fields: ['magic_prd_outline', 'prompt_hooks_poems'],
    fieldLabels: {
      magic_prd_outline: 'PRD Outline',
      prompt_hooks_poems: 'Prompt Hooks'
    }
  },
  {
    key: 'TOTEMS',
    label: 'Totems',
    icon: Gem,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    fields: ['calm_requirements', 'calm_risks_and_limits', 'prompt_hooks_totems'],
    fieldLabels: {
      calm_requirements: 'Requirements',
      calm_risks_and_limits: 'Risks & Limits',
      prompt_hooks_totems: 'Prompt Hooks'
    }
  },
  {
    key: 'ANTHEMS',
    label: 'Anthems',
    icon: Music,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    fields: ['free_first_poem_description', 'free_success_criteria', 'free_totem_anthem', 'free_next_cycle_hooks', 'prompt_hooks_anthems'],
    fieldLabels: {
      free_first_poem_description: 'First Poem Description',
      free_success_criteria: 'Success Criteria',
      free_totem_anthem: 'Totem Anthem',
      free_next_cycle_hooks: 'Next Cycle Hooks',
      prompt_hooks_anthems: 'Prompt Hooks'
    }
  }
];

const GardenPrdPreview: React.FC<GardenPrdPreviewProps> = ({ 
  prdData, 
  isLoading = false,
  onExport 
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const hasContent = (fields: string[]): boolean => {
    if (!prdData) return false;
    return fields.some(field => {
      const value = prdData[field as keyof PrdData];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
  };

  const getLayerProgress = (fields: string[]): number => {
    if (!prdData) return 0;
    const filledFields = fields.filter(field => {
      const value = prdData[field as keyof PrdData];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const copyToClipboard = async (text: string, sectionKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionKey);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const totalLayers = LAYER_CONFIG.length;
  const completedLayers = LAYER_CONFIG.filter(layer => hasContent(layer.fields)).length;

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading PRD content...</p>
        </CardContent>
      </Card>
    );
  }

  if (!prdData || completedLayers === 0) {
    return (
      <Card className="border-dashed border-amber-500/50 bg-amber-500/5">
        <CardContent className="py-8 text-center">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="font-medium mb-1">No PRD Content Generated Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete your journey through the seasons to generate your Living PRD.
          </p>
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            Return to Board
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Living PRD Preview
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {completedLayers}/{totalLayers} Layers
            </Badge>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Export
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <Accordion type="multiple" defaultValue={['POLLENS']} className="w-full">
            {LAYER_CONFIG.map((layer) => {
              const Icon = layer.icon;
              const hasLayerContent = hasContent(layer.fields);
              const progress = getLayerProgress(layer.fields);

              return (
                <AccordionItem 
                  key={layer.key} 
                  value={layer.key}
                  className="border-b border-border/50"
                >
                  <AccordionTrigger 
                    className={cn(
                      "px-4 py-3 hover:no-underline",
                      hasLayerContent ? layer.bgColor : "opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        layer.bgColor
                      )}>
                        <Icon className={cn("w-4 h-4", layer.color)} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{layer.label}</span>
                          {hasLayerContent ? (
                            <Badge variant="secondary" className="text-xs">
                              {progress}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              Empty
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4">
                    {hasLayerContent ? (
                      <div className="space-y-3">
                        {layer.fields.map((field) => {
                          const value = prdData[field as keyof PrdData];
                          if (!value || typeof value !== 'string' || !value.trim()) return null;
                          
                          const fieldLabel = layer.fieldLabels[field as keyof typeof layer.fieldLabels] || field;

                          return (
                            <div 
                              key={field}
                              className={cn(
                                "p-3 rounded-lg border",
                                layer.borderColor,
                                layer.bgColor
                              )}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  {fieldLabel}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(value, `${layer.key}-${field}`)}
                                >
                                  {copiedSection === `${layer.key}-${field}` ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {value}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        No content generated for this layer yet.
                        <br />
                        Complete the {layer.label} season to populate.
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GardenPrdPreview;
