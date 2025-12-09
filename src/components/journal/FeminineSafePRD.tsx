import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Shield, AlertTriangle, ChevronDown, ChevronUp, Heart, Sparkles } from 'lucide-react';
import { FEMININE_PRINCIPLES, FEMININE_THREATS } from '@/data/femininePrinciples';

interface FeminineSafePRDProps {
  onPrincipleSelect?: (principleId: string) => void;
  activePrinciple?: string;
  showThreats?: boolean;
}

export const FeminineSafePRD: React.FC<FeminineSafePRDProps> = ({
  onPrincipleSelect,
  activePrinciple,
  showThreats = true
}) => {
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);
  const [expandedThreat, setExpandedThreat] = useState<string | null>(null);
  const [showPrinciples, setShowPrinciples] = useState(true);

  return (
    <Card className="bg-background/50 backdrop-blur border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Feminine-Safe Design
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Ontological Safety Engine for PRD Development
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Principles Section */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setShowPrinciples(!showPrinciples)}
          >
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-green-500" />
              <span className="text-xs">9 Design Principles</span>
            </span>
            {showPrinciples ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          {showPrinciples && (
            <div className="mt-2 space-y-1">
              {FEMININE_PRINCIPLES.map((principle) => (
                <Collapsible
                  key={principle.id}
                  open={expandedPrinciple === principle.id}
                  onOpenChange={(open) => setExpandedPrinciple(open ? principle.id : null)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-between text-xs h-7 ${
                        activePrinciple === principle.id ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => onPrincipleSelect?.(principle.id)}
                    >
                      <span className="truncate">{principle.name}</span>
                      {expandedPrinciple === principle.id ? (
                        <ChevronUp className="h-3 w-3 shrink-0" />
                      ) : (
                        <ChevronDown className="h-3 w-3 shrink-0" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-2 pb-2">
                    <p className="text-[10px] text-muted-foreground mb-2">
                      {principle.description}
                    </p>
                    <div className="space-y-1">
                      {principle.practices.map((practice, idx) => (
                        <p key={idx} className="text-[10px] flex items-start gap-1">
                          <Sparkles className="h-2 w-2 mt-0.5 text-primary shrink-0" />
                          {practice}
                        </p>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>

        {/* Threats Section */}
        {showThreats && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <AlertTriangle className="h-3 w-3 text-destructive" />
              <span className="text-xs font-medium">6 Threats to Watch</span>
            </div>
            <div className="space-y-1">
              {FEMININE_THREATS.map((threat) => (
                <Collapsible
                  key={threat.id}
                  open={expandedThreat === threat.id}
                  onOpenChange={(open) => setExpandedThreat(open ? threat.id : null)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs h-7 text-destructive/80 hover:text-destructive"
                    >
                      <span className="truncate">{threat.name}</span>
                      {expandedThreat === threat.id ? (
                        <ChevronUp className="h-3 w-3 shrink-0" />
                      ) : (
                        <ChevronDown className="h-3 w-3 shrink-0" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-2 pb-2">
                    <p className="text-[10px] text-muted-foreground mb-2">
                      {threat.description}
                    </p>
                    <p className="text-[10px] text-destructive/70 font-medium mb-1">Warning signs:</p>
                    <div className="space-y-1">
                      {threat.signs.map((sign, idx) => (
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

        {/* Membrane Architecture Visual */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground mb-2">Membrane Architecture</p>
          <div className="relative h-16 flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full border-2 border-dashed border-primary/20 animate-pulse" />
            <div className="absolute w-12 h-12 rounded-full border-2 border-primary/30" />
            <div className="absolute w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-3 w-3 text-primary" />
            </div>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-1">
            Semi-permeable boundaries that protect while allowing flow
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeminineSafePRD;
