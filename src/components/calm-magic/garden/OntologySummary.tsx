import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Workflow, Database, Megaphone } from 'lucide-react';

interface OntologySummaryProps {
  prdData: any;
  projectName: string;
  className?: string;
}

const LAYER_ICONS = {
  pollens: Sparkles,
  noems: Brain,
  poems: Workflow,
  totems: Database,
  anthems: Megaphone,
};

const LAYER_COLORS = {
  pollens: 'text-rose-500',
  noems: 'text-violet-500',
  poems: 'text-indigo-500',
  totems: 'text-cyan-500',
  anthems: 'text-emerald-500',
};

const OntologySummary = ({ prdData, projectName, className }: OntologySummaryProps) => {
  // Extract key themes from PRD data
  const extractThemes = () => {
    const themes: string[] = [];
    
    if (prdData?.pollens_aspirations) themes.push('Relational Aspirations');
    if (prdData?.pollens_cultural_elements) themes.push('Cultural Elements');
    if (prdData?.noems_concepts) themes.push('Core Concepts');
    if (prdData?.noems_mental_models) themes.push('Mental Models');
    if (prdData?.poems_people) themes.push('User Personas');
    if (prdData?.poems_systems) themes.push('System Design');
    if (prdData?.totems_data_architecture) themes.push('Data Architecture');
    if (prdData?.anthems_brand_narrative) themes.push('Brand Voice');
    if (prdData?.anthems_market_positioning) themes.push('Market Strategy');
    
    return themes.length > 0 ? themes : ['Journey in Progress'];
  };

  const themes = extractThemes();

  // Count filled layers
  const layerStatus = {
    pollens: !!(prdData?.pollens_aspirations || prdData?.pollens_cultural_elements || prdData?.pollens_stakes),
    noems: !!(prdData?.noems_concepts || prdData?.noems_mental_models || prdData?.noems_intuitions),
    poems: !!(prdData?.poems_people || prdData?.poems_objects || prdData?.poems_systems),
    totems: !!(prdData?.totems_data_architecture || prdData?.totems_system_requirements),
    anthems: !!(prdData?.anthems_brand_narrative || prdData?.anthems_market_positioning),
  };

  const filledLayers = Object.values(layerStatus).filter(Boolean).length;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Main Summary */}
      <div className="text-center space-y-4">
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Your journey through the five seasons has crystallized into a living ontology — 
          a unified intelligence ready to guide your AI systems and strategic decisions.
        </p>
      </div>

      {/* Layer Status */}
      <div className="grid grid-cols-5 gap-2 max-w-xl mx-auto">
        {(Object.keys(layerStatus) as Array<keyof typeof layerStatus>).map((layer) => {
          const Icon = LAYER_ICONS[layer];
          const isComplete = layerStatus[layer];
          
          return (
            <div 
              key={layer}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl border transition-all",
                isComplete 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-muted/20 border-border/30 opacity-50"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1",
                isComplete ? LAYER_COLORS[layer] : "text-muted-foreground"
              )} />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {layer}
              </span>
            </div>
          );
        })}
      </div>

      {/* Emerged Themes */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-center text-muted-foreground">
          Emerged Themes
        </h4>
        <div className="flex flex-wrap justify-center gap-2">
          {themes.map((theme, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-3 py-1 bg-background/50 backdrop-blur-sm"
            >
              {theme}
            </Badge>
          ))}
        </div>
      </div>

      {/* Completion Status */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filledLayers}</span> of 5 layers populated
        </p>
      </div>
    </div>
  );
};

export default OntologySummary;
