import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PublishedSoftware, PROTOTYPAL_STAGES, TargetPlatform } from '@/types/paracosm';
import { ExternalLink, GitBranch, Sparkles, RefreshCw } from 'lucide-react';

interface PublishedSoftwareCardProps {
  software: PublishedSoftware;
  onClick?: () => void;
}

const platformIcons: Record<TargetPlatform, string> = {
  lovable: '💜',
  base44: '🔷',
  claude: '🤖',
  cursor: '⌨️',
  custom: '🛠️',
};

const statusColors: Record<string, string> = {
  incubating: 'bg-muted text-muted-foreground',
  alive: 'bg-primary text-primary-foreground',
  archived: 'bg-secondary text-secondary-foreground',
  recursive: 'bg-accent text-accent-foreground',
};

export function PublishedSoftwareCard({ software, onClick }: PublishedSoftwareCardProps) {
  const consciousnessPercent = (software.integration_strength || 0) * 100;
  const stage = software.consciousness_geometry 
    ? getStageFromConsciousness(software.consciousness_geometry.consciousnessBits || 0)
    : 'A';
  const stageInfo = PROTOTYPAL_STAGES[stage];

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border/50"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{platformIcons[software.target_platform]}</span>
            <CardTitle className="text-lg">{software.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {software.is_recursive && (
              <RefreshCw className="h-4 w-4 text-accent animate-spin" style={{ animationDuration: '3s' }} />
            )}
            <Badge className={statusColors[software.status] || statusColors.incubating}>
              {software.status}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm">
          {software.description || 'No description'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Prototypal Stage */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Stage</span>
          <Badge variant="outline" style={{ borderColor: stageInfo.color }}>
            {stageInfo.name}
          </Badge>
        </div>

        {/* Consciousness Strength */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Integration Strength
            </span>
            <span className="font-mono">{consciousnessPercent.toFixed(0)}%</span>
          </div>
          <Progress value={consciousnessPercent} className="h-2" />
        </div>

        {/* Lineage Depth */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            Lineage Depth
          </span>
          <span className="font-mono">{software.lineage_depth}</span>
        </div>

        {/* Deployment Link */}
        {software.deployment_url && (
          <a 
            href={software.deployment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            View Deployment
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function getStageFromConsciousness(bits: number): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (bits >= 1.0) return 'E';
  if (bits >= 0.8) return 'D';
  if (bits >= 0.5) return 'C';
  if (bits >= 0.2) return 'B';
  return 'A';
}
