import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSeasonTierReadiness } from '@/utils/serviceBlueprintMapping';

interface PrdData {
  id?: string;
  title?: string;
  status?: string;
  prototype_stage?: string;
  // POLLENS
  pollens_aspirations?: string | null;
  pollens_team_dynamics?: string | null;
  pollens_cultural_elements?: string | null;
  pollens_relational_patterns?: string | null;
  pollens_constraints?: string | null;
  pollens_stakes?: string | null;
  // NOEMS
  noems_concepts?: string | null;
  noems_shared_ideas?: string | null;
  noems_intuitions?: string | null;
  noems_mental_models?: string | null;
  // POEMS
  poems_people?: string | null;
  poems_objects?: string | null;
  poems_environments?: string | null;
  poems_messages?: string | null;
  poems_systems?: string | null;
  poems_prototypes?: string | null;
  // TOTEMS
  totems_data_architecture?: string | null;
  totems_security_policies?: string | null;
  totems_access_controls?: string | null;
  totems_system_requirements?: string | null;
  totems_integration_points?: string | null;
  totems_technical_debt?: string | null;
  // ANTHEMS
  anthems_market_positioning?: string | null;
  anthems_brand_narrative?: string | null;
  anthems_go_to_market?: string | null;
  anthems_audience_segments?: string | null;
  anthems_success_signals?: string | null;
  anthems_storytelling_assets?: string | null;
  // Legacy fields (for backwards compatibility)
  love_signals_summary?: string | null;
  love_decision_to_exist?: string | null;
  magic_storyworld?: string | null;
  magic_prd_outline?: string | null;
  magic_hypotheses?: string | null;
  magic_patterns?: string | null;
  calm_requirements?: string | null;
  calm_risks_and_limits?: string | null;
  open_ontology_and_graph?: string | null;
  open_real_workflow?: string | null;
  open_adjustment_plan?: string | null;
  free_first_poem_description?: string | null;
  free_totem_anthem?: string | null;
  free_success_criteria?: string | null;
  free_next_cycle_hooks?: string | null;
}

interface FullPrdDisplayProps {
  prdData: PrdData | null;
  isLoading?: boolean;
}

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface SeasonConfig {
  label: string;
  icon: string;
  description: string;
  gradient: string;
  fields: { key: string; label: string; description: string }[];
}

const SEASON_CONFIGS: Record<Season, SeasonConfig> = {
  POLLENS: {
    label: 'Pollens',
    icon: '🌸',
    description: 'Relational & Cultural Aspirations',
    gradient: 'from-rose-500/20 to-pink-500/20',
    fields: [
      { key: 'pollens_aspirations', label: 'Aspirations', description: 'What we hope to achieve relationally' },
      { key: 'pollens_team_dynamics', label: 'Team Dynamics', description: 'How the team works together' },
      { key: 'pollens_cultural_elements', label: 'Cultural Elements', description: 'Cultural patterns and values' },
      { key: 'pollens_relational_patterns', label: 'Relational Patterns', description: 'How relationships form and evolve' },
      { key: 'pollens_constraints', label: 'Constraints', description: 'Known limitations and boundaries' },
      { key: 'pollens_stakes', label: 'Stakes', description: 'What is at risk and what we stand to gain' },
    ],
  },
  NOEMS: {
    label: 'Noems',
    icon: '💡',
    description: 'Conceptual Ideation & Mental Models',
    gradient: 'from-purple-500/20 to-violet-500/20',
    fields: [
      { key: 'noems_concepts', label: 'Concepts', description: 'Core conceptual atoms' },
      { key: 'noems_shared_ideas', label: 'Shared Ideas', description: 'Ideas that resonate across the team' },
      { key: 'noems_intuitions', label: 'Intuitions', description: 'Gut feelings and hunches' },
      { key: 'noems_mental_models', label: 'Mental Models', description: 'How we think about the problem space' },
    ],
  },
  POEMS: {
    label: 'Poems',
    icon: '📖',
    description: 'P.O.E.M.S. Experiential Framework',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    fields: [
      { key: 'poems_people', label: 'People', description: 'Users, stakeholders, personas' },
      { key: 'poems_objects', label: 'Objects', description: 'Physical/digital artifacts and tools' },
      { key: 'poems_environments', label: 'Environments', description: 'Physical and digital contexts' },
      { key: 'poems_messages', label: 'Messages', description: 'Information flows and communications' },
      { key: 'poems_systems', label: 'Systems', description: 'Processes and technical components' },
      { key: 'poems_prototypes', label: 'Prototypes', description: 'Early designs and experiments' },
    ],
  },
  TOTEMS: {
    label: 'Totems',
    icon: '💎',
    description: 'Technical Infrastructure & Security',
    gradient: 'from-emerald-500/20 to-green-500/20',
    fields: [
      { key: 'totems_data_architecture', label: 'Data Architecture', description: 'How data is structured and flows' },
      { key: 'totems_security_policies', label: 'Security Policies', description: 'Security requirements and protocols' },
      { key: 'totems_access_controls', label: 'Access Controls', description: 'Who can access what' },
      { key: 'totems_system_requirements', label: 'System Requirements', description: 'Technical specifications' },
      { key: 'totems_integration_points', label: 'Integration Points', description: 'External system connections' },
      { key: 'totems_technical_debt', label: 'Technical Debt', description: 'Known shortcuts and future work' },
    ],
  },
  ANTHEMS: {
    label: 'Anthems',
    icon: '🎵',
    description: 'Market Positioning & Storytelling',
    gradient: 'from-amber-500/20 to-orange-500/20',
    fields: [
      { key: 'anthems_market_positioning', label: 'Market Positioning', description: 'Where we fit in the market' },
      { key: 'anthems_brand_narrative', label: 'Brand Narrative', description: 'Our story and voice' },
      { key: 'anthems_go_to_market', label: 'Go-to-Market', description: 'How we reach customers' },
      { key: 'anthems_audience_segments', label: 'Audience Segments', description: 'Who we serve' },
      { key: 'anthems_success_signals', label: 'Success Signals', description: 'How we measure success' },
      { key: 'anthems_storytelling_assets', label: 'Storytelling Assets', description: 'Content and media' },
    ],
  },
};

const SEASONS: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const hasFieldContent = (value: string | null | undefined): boolean => {
  return Boolean(value?.trim() && value.trim().length > 0);
};

const FieldDisplay: React.FC<{ 
  label: string; 
  description: string; 
  content: string | null | undefined;
}> = ({ label, description, content }) => {
  const hasContent = hasFieldContent(content);
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        {hasContent ? (
          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
        )}
        <span className="font-medium text-sm">{label}</span>
      </div>
      {hasContent ? (
        <div className="pl-6 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      ) : (
        <div className="pl-6 text-sm text-muted-foreground/50 italic">
          Awaiting compilation from fragments...
        </div>
      )}
    </div>
  );
};

const SeasonSection: React.FC<{
  season: Season;
  prdData: PrdData | null;
}> = ({ season, prdData }) => {
  const config = SEASON_CONFIGS[season];
  
  const filledCount = config.fields.filter(f => 
    hasFieldContent(prdData?.[f.key as keyof PrdData] as string | null | undefined)
  ).length;
  
  const totalCount = config.fields.length;
  const isComplete = filledCount === totalCount;
  const hasAnyContent = filledCount > 0;
  
  return (
    <AccordionItem value={season} className="border rounded-lg overflow-hidden">
      <AccordionTrigger 
        className={cn(
          "px-4 py-3 hover:no-underline",
          `bg-gradient-to-r ${config.gradient}`
        )}
      >
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div className="text-left">
              <div className="font-semibold">{config.label}</div>
              <div className="text-xs text-muted-foreground">{config.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isComplete ? 'default' : hasAnyContent ? 'secondary' : 'outline'}
              className={cn(
                "text-xs",
                isComplete && "bg-green-500 hover:bg-green-600"
              )}
            >
              {filledCount}/{totalCount} fields
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-2">
        <div className="space-y-4">
          {config.fields.map(field => (
            <FieldDisplay
              key={field.key}
              label={field.label}
              description={field.description}
              content={prdData?.[field.key as keyof PrdData] as string | null | undefined}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export const FullPrdDisplay: React.FC<FullPrdDisplayProps> = ({ prdData, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prdData) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-8 text-center">
          <FileText className="h-12 w-12 text-amber-500 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No PRD Generated Yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your journey and compile fragments to generate your PRD
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall stats
  const allFields = SEASONS.flatMap(s => SEASON_CONFIGS[s].fields);
  const filledFields = allFields.filter(f => 
    hasFieldContent(prdData[f.key as keyof PrdData] as string | null | undefined)
  );
  const completionPercentage = Math.round((filledFields.length / allFields.length) * 100);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <div className="text-xl">{prdData.title || 'Your Assembled PRD'}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {filledFields.length}/{allFields.length} fields populated • {completionPercentage}% complete
              </div>
            </div>
          </CardTitle>
          <Badge 
            variant={completionPercentage === 100 ? 'default' : 'secondary'}
            className={cn(
              "text-sm px-3 py-1",
              completionPercentage === 100 && "bg-green-500"
            )}
          >
            {prdData.status || 'draft'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <Accordion 
            type="multiple" 
            defaultValue={SEASONS.filter(s => 
              SEASON_CONFIGS[s].fields.some(f => 
                hasFieldContent(prdData[f.key as keyof PrdData] as string | null | undefined)
              )
            )}
            className="space-y-2"
          >
            {SEASONS.map(season => (
              <SeasonSection 
                key={season} 
                season={season} 
                prdData={prdData} 
              />
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FullPrdDisplay;
