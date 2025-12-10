import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PRD_DIMENSIONS, QUALITY_LENS_CATEGORIES, PrdDimension, QualityLensCategory } from '@/data/prdDimensions';
import { Briefcase, Code, DollarSign, Eye } from 'lucide-react';

interface PrdDimensionalViewProps {
  seasonProgress: Record<string, Set<string>>;
  completedSeasons: string[];
  prdData: Record<string, any> | null;
}

const PHASE_COLORS: Record<string, string> = {
  'LOVE': 'bg-chart-1/20 border-chart-1/40 text-chart-1',
  'MAGIC': 'bg-chart-2/20 border-chart-2/40 text-chart-2',
  'CALM': 'bg-chart-3/20 border-chart-3/40 text-chart-3',
  'OPEN': 'bg-chart-4/20 border-chart-4/40 text-chart-4',
  'FREE': 'bg-chart-5/20 border-chart-5/40 text-chart-5',
};

const calculateDimensionReadiness = (
  dimension: PrdDimension,
  completedSeasons: string[],
  prdData: Record<string, any> | null
): number => {
  // Base readiness from related layer completion
  const layerMap: Record<string, string> = {
    'POLLEN': 'POLLENS',
    'NOEM': 'NOEMS',
    'POEM': 'POEMS',
    'TOTEM': 'TOTEMS',
    'ANTHEM': 'ANTHEMS'
  };
  
  const relatedSeasons = dimension.relatedLayers.map(l => layerMap[l]).filter(Boolean);
  const completedRelated = relatedSeasons.filter(s => completedSeasons.includes(s));
  const seasonScore = relatedSeasons.length > 0 
    ? (completedRelated.length / relatedSeasons.length) * 60 
    : 0;

  // Additional score from PRD content presence
  let contentScore = 0;
  if (prdData) {
    const contentFields = Object.entries(prdData).filter(([k, v]) => 
      typeof v === 'string' && v.trim().length > 0
    );
    contentScore = Math.min(contentFields.length * 5, 40);
  }

  return Math.min(Math.round(seasonScore + contentScore), 100);
};

const DimensionCard: React.FC<{ 
  dimension: PrdDimension; 
  readiness: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ dimension, readiness, isExpanded, onToggle }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${isExpanded ? 'ring-1 ring-primary/30' : ''}`}
      onClick={onToggle}
    >
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{dimension.emoji}</span>
            <div>
              <CardTitle className="text-sm">{dimension.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{dimension.question}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${PHASE_COLORS[dimension.mappedPhase]} text-xs`}
          >
            {dimension.mappedPhase}
          </Badge>
        </div>
        <Progress value={readiness} className="h-1.5 mt-2" />
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 pb-4 px-4 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {dimension.description}
          </p>

          {/* C-Suite Perspectives */}
          <div className="space-y-2">
            <TooltipProvider>
              <div className="flex items-start gap-2 text-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-blue-500">
                      <Code className="h-3 w-3" />
                      <span className="font-medium">CTO:</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Technical/Architecture View</TooltipContent>
                </Tooltip>
                <span className="text-muted-foreground">{dimension.ctoView}</span>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-green-500">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">CFO:</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Financial/Governance View</TooltipContent>
                </Tooltip>
                <span className="text-muted-foreground">{dimension.cfoView}</span>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-purple-500">
                      <Briefcase className="h-3 w-3" />
                      <span className="font-medium">CEO:</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Strategic/Cultural View</TooltipContent>
                </Tooltip>
                <span className="text-muted-foreground">{dimension.ceoView}</span>
              </div>
            </TooltipProvider>
          </div>

          {/* Quality Lenses */}
          <div className="flex flex-wrap gap-1">
            {dimension.qualityLenses.map(lens => (
              <Badge key={lens} variant="secondary" className="text-xs">
                {lens}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const LensCategoryCard: React.FC<{ category: QualityLensCategory }> = ({ category }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category.icon}</span>
          <div>
            <CardTitle className="text-sm">{category.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{category.description}</p>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 pb-4 px-4">
          <div className="flex flex-wrap gap-1.5">
            {category.lenses.map(lens => (
              <Badge key={lens} variant="outline" className="text-xs">
                {lens}
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex gap-1">
            {category.relatedLayers.map(layer => (
              <Badge key={layer} variant="secondary" className="text-xs">
                {layer}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export const PrdDimensionalView: React.FC<PrdDimensionalViewProps> = ({
  seasonProgress,
  completedSeasons,
  prdData
}) => {
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  return (
    <Tabs defaultValue="dimensions" className="w-full">
      <TabsList className="w-full justify-start mb-4">
        <TabsTrigger value="dimensions" className="text-xs">
          <Eye className="h-3.5 w-3.5 mr-1" />
          6 Dimensions
        </TabsTrigger>
        <TabsTrigger value="lenses" className="text-xs">
          Quality Lenses
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dimensions" className="space-y-3">
        <p className="text-xs text-muted-foreground mb-3">
          The Living PRD tracks 6 dimensions — what the system IS, LISTENS to, BECOMES, UNDERSTANDS, REFLECTS, and AFFECTS.
        </p>
        {PRD_DIMENSIONS.map(dimension => (
          <DimensionCard
            key={dimension.id}
            dimension={dimension}
            readiness={calculateDimensionReadiness(dimension, completedSeasons, prdData)}
            isExpanded={expandedDimension === dimension.id}
            onToggle={() => setExpandedDimension(
              expandedDimension === dimension.id ? null : dimension.id
            )}
          />
        ))}
      </TabsContent>

      <TabsContent value="lenses" className="space-y-3">
        <p className="text-xs text-muted-foreground mb-3">
          Quality Lenses help evaluate PRD dimensions across cognitive, somatic, relational, aesthetic, and systems perspectives.
        </p>
        {QUALITY_LENS_CATEGORIES.map(category => (
          <LensCategoryCard key={category.id} category={category} />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default PrdDimensionalView;
