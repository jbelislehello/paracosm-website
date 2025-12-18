import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SeasonHighlightsProps {
  prdData: any;
  className?: string;
}

const SEASONS = [
  {
    key: 'pollens',
    name: 'POLLENS',
    description: 'Raw signals, aspirations, and cultural tensions',
    fields: ['pollens_aspirations', 'pollens_cultural_elements', 'pollens_stakes', 'pollens_team_dynamics', 'pollens_relational_patterns', 'pollens_constraints'],
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
  },
  {
    key: 'noems',
    name: 'NOEMS',
    description: 'Crystallized concepts and mental models',
    fields: ['noems_concepts', 'noems_mental_models', 'noems_intuitions', 'noems_shared_ideas'],
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
  },
  {
    key: 'poems',
    name: 'POEMS',
    description: 'Experiential design via People, Objects, Environments, Messages, Systems',
    fields: ['poems_people', 'poems_objects', 'poems_environments', 'poems_messages', 'poems_systems', 'poems_prototypes'],
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
  },
  {
    key: 'totems',
    name: 'TOTEMS',
    description: 'Technical architecture and data foundations',
    fields: ['totems_data_architecture', 'totems_system_requirements', 'totems_security_policies', 'totems_integration_points', 'totems_access_controls', 'totems_technical_debt'],
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  {
    key: 'anthems',
    name: 'ANTHEMS',
    description: 'Market positioning and living documentation',
    fields: ['anthems_brand_narrative', 'anthems_market_positioning', 'anthems_audience_segments', 'anthems_go_to_market', 'anthems_storytelling_assets', 'anthems_success_signals'],
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
];

const formatFieldName = (field: string): string => {
  return field
    .replace(/^(pollens_|noems_|poems_|totems_|anthems_)/, '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const SeasonHighlights = ({ prdData, className }: SeasonHighlightsProps) => {
  const getSeasonContent = (season: typeof SEASONS[0]) => {
    if (!prdData) return [];
    
    return season.fields
      .filter(field => prdData[field])
      .map(field => ({
        label: formatFieldName(field),
        content: prdData[field],
      }));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Season Highlights</h3>
        <p className="text-sm text-muted-foreground">
          Expand to view crystallized content from each season
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {SEASONS.map((season) => {
          const content = getSeasonContent(season);
          const hasContent = content.length > 0;
          
          return (
            <AccordionItem
              key={season.key}
              value={season.key}
              className={cn(
                "border rounded-xl px-4 overflow-hidden",
                "transition-colors",
                season.borderColor,
                hasContent ? season.bgColor : "bg-muted/20 opacity-50"
              )}
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <span className={cn("font-semibold", season.color)}>
                    {season.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {hasContent ? `${content.length} entries` : 'Not yet populated'}
                  </span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pb-4">
                {hasContent ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {season.description}
                    </p>
                    
                    <div className="space-y-3">
                      {content.map((item, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg bg-background/50 border border-border/30"
                        >
                          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            {item.label}
                          </h5>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {item.content.length > 500 
                              ? item.content.substring(0, 500) + '...' 
                              : item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    This season has not yet been populated. Continue your journey through the Calm Magic Board to fill this layer.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default SeasonHighlights;
