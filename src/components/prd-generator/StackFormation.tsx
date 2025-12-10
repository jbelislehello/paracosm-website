import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, Server, Layout, GitBranch, Zap, FileText, Bot, Workflow } from 'lucide-react';
import type { PrdLayer } from './PrdStageProgress';

interface StackFormationProps {
  completedLayers: PrdLayer[];
  currentLayer: PrdLayer;
}

// Stack components that emerge through the PRD process
const STACK_COMPONENTS = [
  {
    id: 'ontology',
    name: 'Ontology',
    description: 'Conceptual structure & relationships',
    icon: GitBranch,
    emergencePhase: 'NOEMS' as PrdLayer,
    color: 'text-purple-500'
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Data persistence & storage',
    icon: Database,
    emergencePhase: 'POEMS' as PrdLayer,
    color: 'text-blue-500'
  },
  {
    id: 'api',
    name: 'API',
    description: 'Interface contracts & endpoints',
    icon: Zap,
    emergencePhase: 'TOTEMS' as PrdLayer,
    color: 'text-amber-500'
  },
  {
    id: 'backend',
    name: 'Backend',
    description: 'Business logic & processing',
    icon: Server,
    emergencePhase: 'TOTEMS' as PrdLayer,
    color: 'text-green-500'
  },
  {
    id: 'frontend',
    name: 'Frontend',
    description: 'User interface & experience',
    icon: Layout,
    emergencePhase: 'ANTHEMS' as PrdLayer,
    color: 'text-rose-500'
  }
];

// Maturity metrics for intelligent systems
const MATURITY_METRICS = [
  {
    id: 'documentation',
    name: 'Intelligent Documentation',
    description: 'Self-updating, context-aware docs',
    icon: FileText,
    indicators: ['Auto-generated from code', 'Context-aware help', 'Living documentation'],
    targetLayer: 'POEMS' as PrdLayer
  },
  {
    id: 'automation',
    name: 'Automation Intelligence',
    description: 'Smart workflows & triggers',
    icon: Bot,
    indicators: ['Predictive automation', 'Self-healing systems', 'Adaptive workflows'],
    targetLayer: 'TOTEMS' as PrdLayer
  },
  {
    id: 'orchestration',
    name: 'Orchestration Process Intelligence',
    description: 'Coordinated system behavior',
    icon: Workflow,
    indicators: ['Cross-system coordination', 'Intelligent routing', 'Emergent optimization'],
    targetLayer: 'ANTHEMS' as PrdLayer
  }
];

const LAYER_ORDER: PrdLayer[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const getLayerProgress = (targetLayer: PrdLayer, completedLayers: PrdLayer[], currentLayer: PrdLayer): number => {
  const targetIndex = LAYER_ORDER.indexOf(targetLayer);
  const currentIndex = LAYER_ORDER.indexOf(currentLayer);
  
  if (completedLayers.includes(targetLayer)) return 100;
  if (currentIndex === targetIndex) return 50;
  if (currentIndex > targetIndex) return 100;
  
  // Calculate partial progress
  const progressToTarget = (currentIndex / targetIndex) * 100;
  return Math.min(progressToTarget, 30);
};

const StackFormation = ({ completedLayers, currentLayer }: StackFormationProps) => {
  return (
    <div className="space-y-4">
      {/* Stack Components */}
      <Card className="bg-background/50 backdrop-blur border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
            The Stack Emergence
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Components crystallize through PRD layers
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {STACK_COMPONENTS.map((component) => {
            const progress = getLayerProgress(component.emergencePhase, completedLayers, currentLayer);
            const Icon = component.icon;
            const isEmerging = component.emergencePhase === currentLayer;
            const isComplete = completedLayers.includes(component.emergencePhase);
            
            return (
              <div key={component.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${component.color}`} />
                    <span className="text-sm font-medium">{component.name}</span>
                    {isEmerging && (
                      <Badge variant="outline" className="text-[10px] h-4 animate-pulse">
                        Emerging
                      </Badge>
                    )}
                    {isComplete && (
                      <Badge variant="default" className="text-[10px] h-4 bg-emerald-500">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground">{component.description}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Maturity Metrics */}
      <Card className="bg-background/50 backdrop-blur border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            Intelligence Maturity
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Tracking autonomous capability emergence
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {MATURITY_METRICS.map((metric) => {
            const progress = getLayerProgress(metric.targetLayer, completedLayers, currentLayer);
            const Icon = metric.icon;
            
            return (
              <div key={metric.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary/70" />
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
                <div className="flex flex-wrap gap-1 mt-1">
                  {metric.indicators.map((indicator, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        progress > (idx + 1) * 30 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Three Graph Model hint */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20">
        <p className="text-xs font-medium mb-1">Three Graph Model</p>
        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded bg-rose-500/20">Subject Graph</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20">Lexical Graph</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-500/20">Domain Graph</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          RDF/OWL structures emerge in Understanding stage
        </p>
      </div>
    </div>
  );
};

export default StackFormation;
