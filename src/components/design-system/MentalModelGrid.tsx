import { offeringModels } from "@/data/offeringModels";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const dimensions = ['Strategic', 'Emotional', 'Relational', 'System'];
const dimColors = [
  'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
  'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800',
  'bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800',
  'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
];

const phaseColors = [
  'bg-red-500/10 text-red-700 dark:text-red-300',
  'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  'bg-teal-500/10 text-teal-700 dark:text-teal-300',
];

// Map each offering's mental model stages to a grid with dimensions
function getGridData(stages: string[]) {
  const activities: Record<string, string[]> = {
    'Strategic': stages.map((s) => {
      if (s.toLowerCase().includes('confusion')) return 'Map tensions';
      if (s.toLowerCase().includes('ai')) return 'AI analysis';
      if (s.toLowerCase().includes('fact')) return 'Separate truth';
      if (s.toLowerCase().includes('decision')) return 'Choose path';
      if (s.toLowerCase().includes('account')) return 'Track progress';
      if (s.toLowerCase().includes('system')) return 'System audit';
      if (s.toLowerCase().includes('prd')) return 'Build PRD';
      if (s.toLowerCase().includes('narrative')) return 'Reframe story';
      if (s.toLowerCase().includes('continuous')) return 'Iterate';
      if (s.toLowerCase().includes('self')) return 'Self-assess';
      if (s.toLowerCase().includes('shadow')) return 'Shadow work';
      if (s.toLowerCase().includes('align')) return 'Align action';
      if (s.toLowerCase().includes('team')) return 'Team dynamics';
      if (s.toLowerCase().includes('creative')) return 'Creative flow';
      if (s.toLowerCase().includes('shared')) return 'Co-create vision';
      if (s.toLowerCase().includes('co-creation')) return 'Co-design';
      return 'Analyze';
    }),
    'Emotional': stages.map((s) => {
      if (s.toLowerCase().includes('confusion')) return 'Name feelings';
      if (s.toLowerCase().includes('emotion')) return 'Process grief';
      if (s.toLowerCase().includes('decision')) return 'Build courage';
      if (s.toLowerCase().includes('shadow')) return 'Integrate shadow';
      if (s.toLowerCase().includes('self')) return 'Build awareness';
      return 'Hold space';
    }),
    'Relational': stages.map((s) => {
      if (s.toLowerCase().includes('confusion')) return 'Identify patterns';
      if (s.toLowerCase().includes('fact')) return 'Test assumptions';
      if (s.toLowerCase().includes('decision')) return 'Communicate';
      if (s.toLowerCase().includes('relational')) return 'Map dynamics';
      if (s.toLowerCase().includes('team')) return 'Team mapping';
      if (s.toLowerCase().includes('shared')) return 'Shared vision';
      return 'Connect';
    }),
    'System': stages.map((s) => {
      if (s.toLowerCase().includes('confusion')) return 'See structure';
      if (s.toLowerCase().includes('system')) return 'Map systems';
      if (s.toLowerCase().includes('ai')) return 'AI patterns';
      if (s.toLowerCase().includes('prd')) return 'Build specs';
      if (s.toLowerCase().includes('decision')) return 'Execute';
      return 'Monitor';
    }),
  };
  return activities;
}

const MentalModelGrid = () => {
  return (
    <div className="space-y-8">
      {offeringModels.map((offering) => {
        const gridData = getGridData(offering.mentalModel.stages);

        return (
          <Card key={offering.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant={offering.tier === 'spring' ? 'default' : 'secondary'} className="text-xs">
                  {offering.tier === 'spring' ? 'Spring 2026' : 'Deep Program'}
                </Badge>
                {offering.price && <span className="text-xs font-semibold text-muted-foreground">{offering.price}</span>}
              </div>
              <CardTitle className="text-base">{offering.name}</CardTitle>
              <CardDescription className="text-xs">{offering.tagline}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mental Model Matrix */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">Mental Model Matrix</p>
                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    {/* Phase headers */}
                    <div className="grid gap-px" style={{ gridTemplateColumns: `100px repeat(${offering.mentalModel.stages.length}, 1fr)` }}>
                      <div className="p-2 text-xs font-semibold text-muted-foreground">Dimension</div>
                      {offering.mentalModel.stages.map((stage, i) => (
                        <div key={i} className="flex items-center gap-1 p-2">
                          <Badge variant="outline" className={`text-[10px] whitespace-nowrap ${phaseColors[i % phaseColors.length]}`}>{stage}</Badge>
                          {i < offering.mentalModel.stages.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                        </div>
                      ))}
                    </div>
                    {/* Dimension rows */}
                    {dimensions.map((dim, dIdx) => (
                      <div key={dim} className="grid gap-px" style={{ gridTemplateColumns: `100px repeat(${offering.mentalModel.stages.length}, 1fr)` }}>
                        <div className={`p-2 text-xs font-semibold rounded-l border ${dimColors[dIdx]}`}>{dim}</div>
                        {offering.mentalModel.stages.map((_, sIdx) => (
                          <div key={sIdx} className={`p-2 border text-[11px] text-muted-foreground ${dimColors[dIdx]}`}>
                            {gridData[dim]?.[sIdx] || '—'}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task Model Tree */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">Task Model</p>
                <div className="space-y-2">
                  {offering.taskModel.map((task, i) => {
                    const tierColor = i === 0 ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20' :
                      i === offering.taskModel.length - 1 ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' :
                      'border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20';
                    return (
                      <div key={task.id} className={`border-l-4 rounded-r-lg p-3 ${tierColor}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{task.label}</span>
                          {task.duration && <Badge variant="outline" className="text-[10px]">{task.duration}</Badge>}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{task.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Observatory Alignment */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">Observatory Alignment</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['magic', 'calm', 'free'] as const).map((tier) => {
                    const tc = tier === 'magic' ? 'border-purple-300 bg-purple-50/50 dark:bg-purple-950/20' :
                      tier === 'calm' ? 'border-teal-300 bg-teal-50/50 dark:bg-teal-950/20' :
                      'border-slate-300 bg-slate-50/50 dark:bg-slate-950/20';
                    return (
                      <div key={tier} className={`text-xs p-2 rounded border ${tc}`}>
                        <span className="font-bold">{tier.toUpperCase()}</span>
                        <p className="text-muted-foreground mt-0.5">{offering.observatoryTiers[tier]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MentalModelGrid;
