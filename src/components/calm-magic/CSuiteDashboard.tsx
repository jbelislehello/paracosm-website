import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { C_SUITE_ROLES, ROLE_LAYER_INSIGHTS, CSuiteRole } from '@/data/cSuiteRoles';
import { PRD_DIMENSIONS, QUALITY_LENS_CATEGORIES } from '@/data/prdDimensions';
import { calculateRoleHealth, RoleHealthResult } from '@/utils/cSuiteHealth';
import { Target, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { Season } from '@/types/trajectory';
import { useMode } from './context/ModeContext';
import PersonalCSuiteDashboard from './PersonalCSuiteDashboard';

interface CSuiteDashboardProps {
  seasonProgress: Record<string, Set<number>>;
  prdData: Record<string, any> | null;
  currentSeason: Season;
}

const RoleHealthScore: React.FC<{ health: RoleHealthResult; role: CSuiteRole }> = ({ health, role }) => {
  const statusColors = {
    'strong': 'text-green-500',
    'moderate': 'text-amber-500',
    'needs-attention': 'text-red-500'
  };

  return (
    <Card className="border-2" style={{ borderColor: `hsl(var(--chart-${role.id === 'ceo' ? '2' : role.id === 'cfo' ? '4' : '3'}))` }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Role Health Score
          </span>
          <Badge variant={health.overallStatus === 'strong' ? 'default' : health.overallStatus === 'moderate' ? 'secondary' : 'destructive'}>
            {health.overallStatus.replace('-', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold" style={{ color: `hsl(var(--chart-${role.id === 'ceo' ? '2' : role.id === 'cfo' ? '4' : '3'}))` }}>
            {health.overallScore}%
          </div>
          <Progress value={health.overallScore} className="flex-1 h-3" />
        </div>
        
        <div className="space-y-3">
          {health.metrics.map(metric => (
            <div key={metric.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {metric.status === 'strong' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {metric.status === 'moderate' && <TrendingUp className="h-4 w-4 text-amber-500" />}
                  {metric.status === 'needs-attention' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {metric.name}
                </span>
                <span className={statusColors[metric.status]}>{metric.score}%</span>
              </div>
              <Progress value={metric.score} className="h-2" />
              <p className="text-xs text-muted-foreground">{metric.insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const DimensionalInsights: React.FC<{ health: RoleHealthResult; role: CSuiteRole }> = ({ health, role }) => {
  const relevantDimensions = health.dimensionScores.filter(d => d.relevance === 'primary');
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Dimensional Insights for {role.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {relevantDimensions.map(({ dimension, score }) => {
          const roleView = dimension[`${role.id}View` as keyof typeof dimension] as string;
          return (
            <div key={dimension.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span>{dimension.emoji}</span>
                  {dimension.name}
                </span>
                <span className="text-sm text-muted-foreground">{score}%</span>
              </div>
              <Progress value={score} className="h-1.5" />
              <p className="text-xs text-muted-foreground italic">"{roleView}"</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const QualityLensesForRole: React.FC<{ role: CSuiteRole }> = ({ role }) => {
  const relevantCategories = QUALITY_LENS_CATEGORIES.filter(
    cat => role.relevantLensCategories.includes(cat.id)
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quality Lenses for {role.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relevantCategories.map(category => (
            <div key={category.id}>
              <div className="flex items-center gap-2 mb-1">
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {category.lenses.map(lens => (
                  <Badge key={lens} variant="outline" className="text-xs">
                    {lens}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const LayerInsightsForRole: React.FC<{ role: CSuiteRole; prdData: Record<string, any> | null }> = ({ role, prdData }) => {
  const insights = ROLE_LAYER_INSIGHTS[role.id];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">PRD Layers Through {role.title} Lens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {role.relevantLayers.map(layer => (
          <div key={layer} className="p-2 rounded-md bg-muted/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{layer}</span>
              <Badge variant={prdData ? 'default' : 'secondary'} className="text-xs">
                {prdData ? 'Content Available' : 'Pending'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{insights[layer]}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const Recommendations: React.FC<{ health: RoleHealthResult; role: CSuiteRole }> = ({ health, role }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Action Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {health.recommendations.map((rec, i) => (
            <div key={i} className="text-sm p-2 rounded bg-muted/50">
              {rec}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Action verbs for {role.title}:</strong> {role.actionVerbs.join(' • ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const CSuiteDashboard: React.FC<CSuiteDashboardProps> = ({
  seasonProgress,
  prdData,
  currentSeason
}) => {
  const { mode } = useMode();
  const [selectedRole, setSelectedRole] = useState<'ceo' | 'cfo' | 'cto'>('ceo');
  
  const healthResults = useMemo(() => {
    return C_SUITE_ROLES.reduce((acc, role) => {
      acc[role.id] = calculateRoleHealth(role, seasonProgress, prdData);
      return acc;
    }, {} as Record<string, RoleHealthResult>);
  }, [seasonProgress, prdData]);

  const currentRole = C_SUITE_ROLES.find(r => r.id === selectedRole)!;
  const currentHealth = healthResults[selectedRole];

  // Render Personal C-Suite for personal mode
  if (mode === 'personal') {
    return <PersonalCSuiteDashboard />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center pb-2 border-b">
        <h3 className="text-lg font-semibold">C-Suite Dashboard</h3>
        <p className="text-xs text-muted-foreground italic">"Bridge Intelligence with Empathy"</p>
      </div>

      {/* Role Tabs */}
      <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as typeof selectedRole)}>
        <TabsList className="grid w-full grid-cols-3">
          {C_SUITE_ROLES.map(role => (
            <TabsTrigger key={role.id} value={role.id} className="flex items-center gap-1.5">
              <span>{role.emoji}</span>
              <span>{role.title}</span>
              <Badge variant="outline" className="ml-1 text-xs px-1">
                {healthResults[role.id].overallScore}%
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {C_SUITE_ROLES.map(role => (
          <TabsContent key={role.id} value={role.id} className="mt-4 space-y-4">
            {/* Key Question Banner */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium text-center">
                "{role.keyQuestion}"
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {role.focus}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">
              {role.description}
            </p>

            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-4">
                {/* Health Score */}
                <RoleHealthScore health={healthResults[role.id]} role={role} />
                
                {/* Dimensional Insights */}
                <DimensionalInsights health={healthResults[role.id]} role={role} />
                
                {/* Quality Lenses */}
                <QualityLensesForRole role={role} />
                
                {/* Layer Insights */}
                <LayerInsightsForRole role={role} prdData={prdData} />
                
                {/* Recommendations */}
                <Recommendations health={healthResults[role.id]} role={role} />
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CSuiteDashboard;
