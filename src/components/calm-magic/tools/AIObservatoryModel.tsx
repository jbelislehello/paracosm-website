
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Telescope, Eye, Cpu, ArrowDown, Orbit, 
  Sparkles, Users, Server, FileText, Layout 
} from 'lucide-react';

// --- Data ---

const layers = [
  {
    id: 'magic',
    title: 'Layer 1 — Strategic Intelligence',
    tag: 'MAGIC',
    icon: Sparkles,
    nodes: [
      'Vision & Intent', 'Cultural Maturity Assessment', 'Organizational Alignment',
      'AI Literacy & Learning', 'Capability Readiness', 'Ethical & Governance Principles',
    ],
    telemetry: [
      { label: 'Strategic Alignment', base: 72 },
      { label: 'Experimentation Velocity', base: 58 },
      { label: 'AI Adoption Rate', base: 45 },
      { label: 'Knowledge Diffusion', base: 63 },
    ],
    gradient: 'from-purple-600/20 to-indigo-600/20 dark:from-purple-900/30 dark:to-indigo-900/30',
    border: 'border-purple-400/30',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    barClass: '[&>div]:bg-purple-500',
    dotColor: 'bg-purple-500',
  },
  {
    id: 'calm',
    title: 'Layer 2 — Human Experience Intelligence',
    tag: 'CALM',
    icon: Users,
    nodes: [
      'Customer Journey Mapping', 'Mental Models', 'UX / IXD Design Systems',
      'Interface Patterns', 'Trust & Explainability', 'Behavioral Feedback Loops',
    ],
    telemetry: [
      { label: 'User Trust Score', base: 68 },
      { label: 'Cognitive Load Index', base: 42 },
      { label: 'Correction Rate', base: 31 },
      { label: 'Adoption & Engagement', base: 76 },
    ],
    gradient: 'from-teal-600/20 to-emerald-600/20 dark:from-teal-900/30 dark:to-emerald-900/30',
    border: 'border-teal-400/30',
    badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    barClass: '[&>div]:bg-teal-500',
    dotColor: 'bg-teal-500',
  },
  {
    id: 'free',
    title: 'Layer 3 — Technical Infrastructure Intelligence',
    tag: 'FREE',
    icon: Server,
    nodes: [
      'Data Pipelines', 'Model Training', 'Model Evaluation',
      'Deployment Infrastructure', 'Release Roadmap', 'Monitoring & Observability',
    ],
    telemetry: [
      { label: 'Latency', base: 88 },
      { label: 'Model Drift', base: 22 },
      { label: 'Hallucination Rate', base: 15 },
      { label: 'Uptime', base: 97 },
      { label: 'Deployment Frequency', base: 64 },
    ],
    gradient: 'from-slate-600/20 to-blue-600/20 dark:from-slate-900/30 dark:to-blue-900/30',
    border: 'border-slate-400/30',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300',
    barClass: '[&>div]:bg-slate-500',
    dotColor: 'bg-slate-500',
  },
];

const crossLayerConnections = [
  { from: 'Strategic Vision', to: 'Product Experience', colors: 'from-purple-400 to-teal-400' },
  { from: 'Cultural Readiness', to: 'Adoption Rate', colors: 'from-purple-400 to-emerald-400' },
  { from: 'Infrastructure Reliability', to: 'User Trust', colors: 'from-slate-400 to-teal-400' },
];

const prdModules = [
  { name: 'PRD-Alpha', layers: ['magic', 'calm', 'free'] },
  { name: 'PRD-Beta', layers: ['magic', 'calm'] },
  { name: 'PRD-Gamma', layers: ['calm', 'free'] },
];

// --- Component ---

interface AIObservatoryModelProps {
  onNavigateToBlueprint?: () => void;
}

const AIObservatoryModel: React.FC<AIObservatoryModelProps> = ({ onNavigateToBlueprint }) => {
  const [telemetryValues, setTelemetryValues] = useState<Record<string, number>>({});

  // Initialize and animate telemetry
  useEffect(() => {
    const init: Record<string, number> = {};
    layers.forEach(l => l.telemetry.forEach(t => {
      init[`${l.id}-${t.label}`] = t.base;
    }));
    setTelemetryValues(init);

    const interval = setInterval(() => {
      setTelemetryValues(prev => {
        const next = { ...prev };
        const keys = Object.keys(next);
        // Jitter 2-3 random signals
        for (let i = 0; i < 3; i++) {
          const key = keys[Math.floor(Math.random() * keys.length)];
          const base = next[key];
          next[key] = Math.max(5, Math.min(99, base + (Math.random() - 0.5) * 8));
        }
        return next;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-teal-500 to-slate-500 flex items-center justify-center">
          <Telescope className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Observatory Model</h2>
          <p className="text-sm text-muted-foreground">
            Cybernetic observatory monitoring an evolving AI civilization
          </p>
        </div>
      </div>

      {/* Layers */}
      {layers.map((layer, idx) => {
        const Icon = layer.icon;
        return (
          <div key={layer.id}>
            <Card className={`bg-gradient-to-br ${layer.gradient} ${layer.border} overflow-hidden`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="w-5 h-5" />
                  {layer.title}
                  <Badge variant="outline" className="ml-auto text-xs">{layer.tag}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nodes */}
                <div className="flex flex-wrap gap-2">
                  {layer.nodes.map(node => (
                    <Badge key={node} className={layer.badgeClass}>{node}</Badge>
                  ))}
                </div>

                {/* Telemetry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {layer.telemetry.map(t => {
                    const val = telemetryValues[`${layer.id}-${t.label}`] ?? t.base;
                    return (
                      <div key={t.label} className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{t.label}</span>
                          <span className="font-mono">{Math.round(val)}%</span>
                        </div>
                        <Progress value={val} className={`h-2 ${layer.barClass}`} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Cross-layer connector after first two layers */}
            {idx < 2 && (
              <div className="flex items-center justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-6 w-px bg-gradient-to-b ${crossLayerConnections[idx].colors} opacity-60`} />
                  <ArrowDown className="w-4 h-4 text-muted-foreground animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">
                    {crossLayerConnections[idx].from} → {crossLayerConnections[idx].to}
                  </span>
                  <div className={`h-6 w-px bg-gradient-to-b ${crossLayerConnections[idx].colors} opacity-60`} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Cross-Layer Dynamics Summary */}
      <Card className="border-dashed border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Cross-Layer Telemetry Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {crossLayerConnections.map(c => (
              <div key={c.from} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-md bg-muted/50">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${c.colors} animate-pulse`} />
                <span>{c.from}</span>
                <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
                <span>{c.to}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PRD Integration */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Orbit className="w-4 h-4" />
            PRD Integration Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {prdModules.map(prd => (
              <div key={prd.name} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{prd.name}</p>
                  <div className="flex gap-1 mt-1">
                    {prd.layers.map(lid => {
                      const l = layers.find(x => x.id === lid)!;
                      return <div key={lid} className={`w-2.5 h-2.5 rounded-full ${l.dotColor}`} title={l.tag} />;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIObservatoryModel;
