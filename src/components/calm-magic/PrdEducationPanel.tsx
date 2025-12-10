import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Compass,
  Target,
  Lightbulb
} from 'lucide-react';
import { 
  WHAT_IS_A_PRD, 
  TRADITIONAL_PRD_TEMPLATES, 
  CALM_MAGIC_DIFFERENTIATOR 
} from '@/data/prdEducation';
import { FUTURES_TYPES, VELOCITY_CONCEPT } from '@/data/futuresNavigation';

export const PrdEducationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border border-border/50">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">What is a PRD?</span>
            <Badge variant="outline" className="text-xs">Learn</Badge>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3 space-y-4">
        {/* Definition */}
        <div className="p-4 bg-background rounded-lg border border-border/50">
          <p className="text-sm text-foreground leading-relaxed">
            {WHAT_IS_A_PRD.definition}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {WHAT_IS_A_PRD.purpose.map((p, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {p}
              </Badge>
            ))}
          </div>
        </div>

        {/* Traditional Templates Comparison */}
        <Collapsible open={showTemplates} onOpenChange={setShowTemplates}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted/30 rounded">
              <span className="text-sm text-muted-foreground">Famous PRD Templates</span>
              {showTemplates ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid gap-2">
              {TRADITIONAL_PRD_TEMPLATES.slice(0, 4).map((template) => (
                <div 
                  key={template.name} 
                  className="p-3 bg-muted/20 rounded border border-border/30 text-xs"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{template.name}</span>
                    {template.author && (
                      <span className="text-muted-foreground">by {template.author}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{template.strength}</p>
                  <p className="text-muted-foreground/70 mt-1 italic">
                    Limitation: {template.limitation}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Calm Magic Differentiator */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">
              Why Calm Magic is Different
            </h4>
          </div>
          
          <p className="text-sm text-primary font-medium mb-2">
            "{CALM_MAGIC_DIFFERENTIATOR.philosophy}"
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {CALM_MAGIC_DIFFERENTIATOR.subtitle}
          </p>

          <div className="space-y-2">
            {CALM_MAGIC_DIFFERENTIATOR.principles.slice(0, 3).map((principle, i) => (
              <div key={i} className="flex items-start gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-foreground">
                    {principle.name}:
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    {principle.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Futures Navigation */}
        <div className="p-4 bg-background rounded-lg border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-4 w-4 text-chart-5" />
            <h4 className="text-sm font-semibold text-foreground">
              Futures Navigation
            </h4>
          </div>
          
          <div className="flex items-center gap-2 mb-3 text-xs">
            {FUTURES_TYPES.map((future, i) => (
              <React.Fragment key={future.id}>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50">
                  <span>{future.icon}</span>
                  <span className="text-muted-foreground">{future.name.split(' ')[0]}</span>
                </div>
                {i < FUTURES_TYPES.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-2 p-2 bg-chart-5/10 rounded border border-chart-5/30">
            <Target className="h-4 w-4 text-chart-5" />
            <div className="text-xs">
              <span className="font-medium text-foreground">
                {VELOCITY_CONCEPT.definition}
              </span>
              <span className="text-muted-foreground ml-1">
                — Speed without direction is noise.
              </span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PrdEducationPanel;
