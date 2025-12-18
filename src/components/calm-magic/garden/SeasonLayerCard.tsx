import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check,
  Sparkles,
  Layers,
  Bot,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Season } from './AgenticPrdRenderer';

interface SeasonLayerCardProps {
  season: Season;
  content: Record<string, string>;
  config: {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
    fields: string[];
    qualityLenses: string[];
    agenticLayers: string[];
  };
}

const FIELD_LABELS: Record<string, { label: string; description: string }> = {
  // POLLENS
  pollens_aspirations: { label: 'Aspirations', description: 'Individual, team, and organizational aspirations' },
  pollens_team_dynamics: { label: 'Team Dynamics', description: 'Patterns in collaboration and communication' },
  pollens_cultural_elements: { label: 'Cultural Elements', description: 'Values, norms, and rituals' },
  pollens_relational_patterns: { label: 'Relational Patterns', description: 'Key relationships and dynamics' },
  pollens_constraints: { label: 'Constraints', description: 'Cultural and organizational barriers' },
  pollens_stakes: { label: 'Stakes', description: 'What happens if nothing changes' },
  // NOEMS
  noems_concepts: { label: 'Crystallized Concepts', description: 'Emerging concepts with maturity levels' },
  noems_shared_ideas: { label: 'Shared Ideas', description: 'Ideas emerging from multiple tensions' },
  noems_intuitions: { label: 'Intuitions', description: 'Gut feelings worth tracking' },
  noems_mental_models: { label: 'Mental Models', description: 'Assumptions and frameworks' },
  // POEMS
  poems_people: { label: '👤 People', description: 'Users, stakeholders, personas, needs' },
  poems_objects: { label: '📦 Objects', description: 'Artifacts, products, tools, interfaces' },
  poems_environments: { label: '🌍 Environments', description: 'Physical and digital contexts' },
  poems_messages: { label: '💬 Messages', description: 'Information flows and communications' },
  poems_systems: { label: '⚙️ Systems', description: 'Processes, services, components' },
  poems_prototypes: { label: '🎨 Prototypes', description: 'UI mockups and interaction flows' },
  // TOTEMS
  totems_data_architecture: { label: 'Data Architecture', description: 'Data models and storage' },
  totems_security_policies: { label: 'Security Policies', description: 'Security and compliance' },
  totems_access_controls: { label: 'Access Controls', description: 'Authentication and authorization' },
  totems_system_requirements: { label: 'System Requirements', description: 'Performance and scalability' },
  totems_integration_points: { label: 'Integration Points', description: 'APIs and third-party services' },
  totems_technical_debt: { label: 'Technical Debt', description: 'Legacy systems and risks' },
  // ANTHEMS
  anthems_market_positioning: { label: 'Market Positioning', description: 'Competitive landscape and UVP' },
  anthems_brand_narrative: { label: 'Brand Narrative', description: 'Story and brand voice' },
  anthems_go_to_market: { label: 'Go-to-Market', description: 'Channels and launch strategy' },
  anthems_audience_segments: { label: 'Audience Segments', description: 'Target personas' },
  anthems_success_signals: { label: 'Success Signals', description: 'Qualitative and quantitative indicators' },
  anthems_storytelling_assets: { label: 'Storytelling Assets', description: 'Taglines and manifesto' },
  // Stack & Prompt
  stack_implications_pollens: { label: '🔧 Stack Implications', description: 'Technical requirements from this layer' },
  stack_implications_noems: { label: '🔧 Stack Implications', description: 'Technical requirements from this layer' },
  stack_implications_poems: { label: '🔧 Stack Implications', description: 'Technical requirements from this layer' },
  stack_implications_totems: { label: '🔧 Stack Implications', description: 'Technical requirements from this layer' },
  stack_implications_anthems: { label: '🔧 Stack Implications', description: 'Technical requirements from this layer' },
  prompt_hooks_pollens: { label: '🤖 Prompt Hooks', description: 'Agentic configuration for AI' },
  prompt_hooks_noems: { label: '🤖 Prompt Hooks', description: 'Agentic configuration for AI' },
  prompt_hooks_poems: { label: '🤖 Prompt Hooks', description: 'Agentic configuration for AI' },
  prompt_hooks_totems: { label: '🤖 Prompt Hooks', description: 'Agentic configuration for AI' },
  prompt_hooks_anthems: { label: '🤖 Prompt Hooks', description: 'Agentic configuration for AI' },
};

const SeasonLayerCard: React.FC<SeasonLayerCardProps> = ({ season, content, config }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const Icon = config.icon;
  const filledFields = Object.keys(content).filter(k => content[k]?.trim());
  const totalFields = config.fields.length;
  const progress = Math.round((filledFields.length / totalFields) * 100);
  const hasContent = filledFields.length > 0;

  const copyFieldContent = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      hasContent ? config.borderColor : "border-dashed opacity-60",
      "border"
    )}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className={cn(
            "cursor-pointer transition-colors hover:bg-muted/30",
            hasContent && config.bgColor
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  config.bgColor
                )}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {config.label}
                    <Badge 
                      variant={hasContent ? "default" : "outline"}
                      className={cn(
                        "text-xs",
                        hasContent && progress === 100 && "bg-emerald-500"
                      )}
                    >
                      {progress}%
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {config.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Quality Lenses Preview */}
                <div className="hidden md:flex items-center gap-1">
                  {config.qualityLenses.slice(0, 3).map((lens, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                      {lens}
                    </Badge>
                  ))}
                  {config.qualityLenses.length > 3 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      +{config.qualityLenses.length - 3}
                    </Badge>
                  )}
                </div>
                
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
            {hasContent ? (
              <>
                {/* Main Fields */}
                <div className="space-y-3">
                  {Object.entries(content).map(([field, value]) => {
                    if (!value?.trim() || field.startsWith('stack_') || field.startsWith('prompt_')) return null;
                    
                    const fieldConfig = FIELD_LABELS[field] || { label: field, description: '' };
                    
                    return (
                      <div 
                        key={field}
                        className={cn(
                          "p-3 rounded-lg border",
                          config.borderColor,
                          "bg-background/50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-sm font-medium">{fieldConfig.label}</span>
                            {fieldConfig.description && (
                              <p className="text-xs text-muted-foreground">{fieldConfig.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyFieldContent(field, value);
                            }}
                          >
                            {copiedField === field ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                          {value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Stack Implications */}
                {content[`stack_implications_${season.toLowerCase()}`] && (
                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Stack Implications
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {content[`stack_implications_${season.toLowerCase()}`]}
                    </p>
                  </div>
                )}

                {/* Prompt Hooks */}
                {content[`prompt_hooks_${season.toLowerCase()}`] && (
                  <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        Prompt Hooks
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                      {content[`prompt_hooks_${season.toLowerCase()}`]}
                    </p>
                  </div>
                )}

                {/* Quality Lenses */}
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-muted-foreground">Quality Lenses Applied</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {config.qualityLenses.map((lens, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {lens}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Agentic Layers Mapping */}
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs font-medium text-muted-foreground">Maps to Agentic Layers</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {config.agenticLayers.map((layer, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-cyan-500/5">
                        L{8 - ['GOVERNANCE', 'APPLICATION', 'MEMORY', 'COGNITION', 'TOOLING', 'PROTOCOL', 'AGENT_INTERNET', 'INFRASTRUCTURE'].indexOf(layer)} {layer}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No content generated for {config.label} yet.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete the {config.label} season to populate this layer.
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SeasonLayerCard;
