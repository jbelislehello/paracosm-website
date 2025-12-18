import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PRD_DIMENSIONS, QUALITY_LENS_CATEGORIES, PrdDimension } from '@/data/prdDimensions';
import { PrdSeasonData } from './AgenticPrdRenderer';

interface DimensionalAnalysisPanelProps {
  prdData: PrdSeasonData | null;
}

// Map dimensions to PRD data fields
const DIMENSION_FIELD_MAPPING: Record<string, string[]> = {
  ontological: ['pollens_aspirations', 'pollens_stakes', 'totems_data_architecture', 'noems_concepts'],
  relational: ['pollens_team_dynamics', 'pollens_relational_patterns', 'pollens_cultural_elements', 'noems_shared_ideas'],
  temporal: ['poems_prototypes', 'anthems_go_to_market', 'totems_technical_debt', 'anthems_success_signals'],
  semantic: ['totems_data_architecture', 'totems_integration_points', 'noems_mental_models'],
  ethical: ['totems_security_policies', 'totems_access_controls', 'anthems_brand_narrative'],
  ecological: ['anthems_market_positioning', 'anthems_audience_segments', 'poems_environments', 'anthems_storytelling_assets']
};

const DimensionalAnalysisPanel: React.FC<DimensionalAnalysisPanelProps> = ({ prdData }) => {
  const [activeDimension, setActiveDimension] = useState<string>('ontological');

  const getDimensionReadiness = (dimensionId: string): number => {
    if (!prdData) return 0;
    
    const fields = DIMENSION_FIELD_MAPPING[dimensionId] || [];
    if (fields.length === 0) return 0;
    
    const filledFields = fields.filter(field => {
      const value = prdData[field as keyof PrdSeasonData];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
    
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const getDimensionContent = (dimensionId: string): Record<string, string> => {
    if (!prdData) return {};
    
    const fields = DIMENSION_FIELD_MAPPING[dimensionId] || [];
    const result: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = prdData[field as keyof PrdSeasonData];
      if (value && typeof value === 'string' && value.trim()) {
        result[field] = value;
      }
    });
    
    return result;
  };

  const selectedDimension = PRD_DIMENSIONS.find(d => d.id === activeDimension);

  return (
    <div className="space-y-6">
      {/* Dimension Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PRD_DIMENSIONS.map((dimension) => {
          const readiness = getDimensionReadiness(dimension.id);
          const isActive = activeDimension === dimension.id;
          
          return (
            <Card 
              key={dimension.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isActive && "ring-2 ring-primary border-primary"
              )}
              onClick={() => setActiveDimension(dimension.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{dimension.emoji}</span>
                  <Badge 
                    variant={readiness >= 75 ? "default" : readiness >= 50 ? "secondary" : "outline"}
                    className={cn(
                      "text-xs",
                      readiness >= 75 && "bg-emerald-500"
                    )}
                  >
                    {readiness}%
                  </Badge>
                </div>
                <h4 className="font-medium text-sm mb-1">{dimension.nameEn}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {dimension.question}
                </p>
                <Progress value={readiness} className="h-1 mt-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Dimension Detail */}
      {selectedDimension && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedDimension.emoji}</span>
              <div>
                <CardTitle className="text-lg">
                  {selectedDimension.nameEn} Dimension
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selectedDimension.question}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Description */}
            <p className="text-sm leading-relaxed text-foreground/80">
              {selectedDimension.description}
            </p>

            {/* C-Suite Perspectives */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30">
                    CTO
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedDimension.ctoView}
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/30">
                    CFO
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedDimension.cfoView}
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
                    CEO
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedDimension.ceoView}
                </p>
              </div>
            </div>

            {/* Quality Lenses */}
            <div className="pt-3 border-t border-border/50">
              <h5 className="text-xs font-medium text-muted-foreground mb-2">Quality Lenses</h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedDimension.qualityLenses.map((lens, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {lens}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Related Content */}
            <div className="pt-3 border-t border-border/50">
              <h5 className="text-xs font-medium text-muted-foreground mb-3">
                PRD Content for this Dimension
              </h5>
              
              {Object.entries(getDimensionContent(selectedDimension.id)).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(getDimensionContent(selectedDimension.id)).map(([field, value]) => (
                    <div key={field} className="p-3 rounded-lg bg-muted/30">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {field.replace(/_/g, ' ')}
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No content yet for this dimension. Complete relevant seasons to populate.
                </p>
              )}
            </div>

            {/* Mapped Phase & Layers */}
            <div className="pt-3 border-t border-border/50 flex items-center gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Phase</span>
                <Badge variant="outline" className="ml-2">{selectedDimension.mappedPhase}</Badge>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Layers</span>
                {selectedDimension.relatedLayers.map((layer, i) => (
                  <Badge key={i} variant="secondary" className="ml-1 text-xs">
                    {layer}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Lens Categories Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-lg">🔍</span>
            Quality Lens Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {QUALITY_LENS_CATEGORIES.map((category) => (
              <div 
                key={category.id}
                className="p-3 rounded-lg border bg-muted/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-xs font-medium">{category.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {category.lenses.slice(0, 3).map((lens, i) => (
                    <Badge key={i} variant="outline" className="text-[9px] px-1 py-0">
                      {lens}
                    </Badge>
                  ))}
                  {category.lenses.length > 3 && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      +{category.lenses.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DimensionalAnalysisPanel;
