import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Shield, AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Lightbulb } from 'lucide-react';
import { FEMININE_PRINCIPLES, FEMININE_ANTI_PATTERNS, getPrinciplesByStage } from '@/data/femininePrinciples';
import { PRD_STAGES, PrdStage } from '@/types/journal-expansion';

interface FeminineSafePRDProps {
  onPrincipleSelect?: (principleId: string) => void;
  activePrinciple?: string;
  showAntiPatterns?: boolean;
  reviewMode?: boolean;
  currentStage?: PrdStage;
}

export const FeminineSafePRD: React.FC<FeminineSafePRDProps> = ({
  onPrincipleSelect,
  activePrinciple,
  showAntiPatterns = true,
  reviewMode = false,
  currentStage
}) => {
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);
  const [expandedAntiPattern, setExpandedAntiPattern] = useState<string | null>(null);
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());
  const [activeStageFilter, setActiveStageFilter] = useState<PrdStage | 'all'>(currentStage || 'all');

  const toggleQuestion = (id: string) => {
    setCheckedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredPrinciples = activeStageFilter === 'all' 
    ? FEMININE_PRINCIPLES 
    : getPrinciplesByStage(activeStageFilter);

  const completionPercentage = Math.round((checkedQuestions.size / FEMININE_PRINCIPLES.length) * 100);

  return (
    <Card className="bg-background/50 backdrop-blur border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Feminine Design Quality
          </CardTitle>
          {reviewMode && (
            <Badge variant={completionPercentage === 100 ? 'default' : 'outline'} className="text-xs">
              {completionPercentage}% reviewed
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          8 practical UX qualities for safe, generative design
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stage Filter */}
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant={activeStageFilter === 'all' ? 'default' : 'outline'}
            className="h-6 text-[10px]"
            onClick={() => setActiveStageFilter('all')}
          >
            All
          </Button>
          {PRD_STAGES.map(stage => (
            <Button
              key={stage.id}
              size="sm"
              variant={activeStageFilter === stage.id ? 'default' : 'outline'}
              className="h-6 text-[10px]"
              onClick={() => setActiveStageFilter(stage.id)}
            >
              {stage.icon} {stage.name}
            </Button>
          ))}
        </div>

        {/* Principles Section */}
        <div className="space-y-1">
          {filteredPrinciples.map((principle) => (
            <Collapsible
              key={principle.id}
              open={expandedPrinciple === principle.id}
              onOpenChange={(open) => setExpandedPrinciple(open ? principle.id : null)}
            >
              <CollapsibleTrigger asChild>
                <div 
                  className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                    activePrinciple === principle.id ? 'bg-primary/10 border border-primary/30' : ''
                  }`}
                  onClick={() => onPrincipleSelect?.(principle.id)}
                >
                  <div className="flex items-center gap-2">
                    {reviewMode && (
                      <Checkbox 
                        checked={checkedQuestions.has(principle.id)}
                        onCheckedChange={() => toggleQuestion(principle.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <span className="text-lg">{principle.icon}</span>
                    <div>
                      <span className="text-xs font-medium">{principle.name}</span>
                      <p className="text-[10px] text-muted-foreground">{principle.essence}</p>
                    </div>
                  </div>
                  {expandedPrinciple === principle.id ? (
                    <ChevronUp className="h-3 w-3 shrink-0" />
                  ) : (
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-2 pb-2 pt-1">
                <div className="pl-8 space-y-2">
                  <p className="text-[10px] text-muted-foreground">
                    {principle.description}
                  </p>
                  
                  {/* Design Cue */}
                  <div className="flex items-start gap-1.5 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                    <Lightbulb className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-amber-700 dark:text-amber-300">
                      {principle.designCue}
                    </p>
                  </div>
                  
                  {/* Review Question */}
                  {reviewMode && (
                    <div className="flex items-start gap-1.5 p-2 rounded bg-primary/10 border border-primary/20">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <p className="text-[10px] text-primary">
                        {principle.reviewQuestion}
                      </p>
                    </div>
                  )}
                  
                  {/* Practices */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground">Practices:</p>
                    {principle.practices.map((practice, idx) => (
                      <p key={idx} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-primary">•</span>
                        {practice}
                      </p>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Anti-Patterns Section */}
        {showAntiPatterns && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-1 mb-2">
              <AlertTriangle className="h-3 w-3 text-destructive" />
              <span className="text-xs font-medium">Anti-Patterns to Avoid</span>
            </div>
            <div className="space-y-1">
              {FEMININE_ANTI_PATTERNS.slice(0, 4).map((antiPattern) => (
                <Collapsible
                  key={antiPattern.id}
                  open={expandedAntiPattern === antiPattern.id}
                  onOpenChange={(open) => setExpandedAntiPattern(open ? antiPattern.id : null)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs h-7 text-destructive/80 hover:text-destructive"
                    >
                      <span className="truncate">{antiPattern.name}</span>
                      {expandedAntiPattern === antiPattern.id ? (
                        <ChevronUp className="h-3 w-3 shrink-0" />
                      ) : (
                        <ChevronDown className="h-3 w-3 shrink-0" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-2 pb-2">
                    <p className="text-[10px] text-muted-foreground mb-2">
                      {antiPattern.description}
                    </p>
                    <p className="text-[10px] text-destructive/70 font-medium mb-1">Warning signs:</p>
                    <div className="space-y-1">
                      {antiPattern.signs.map((sign, idx) => (
                        <p key={idx} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <span className="text-destructive">•</span>
                          {sign}
                        </p>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        )}

        {/* Quick Summary */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground text-center">
            Design for receptivity, safety, relationships, cycles, bodies, intuition, care, and plurality
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeminineSafePRD;
