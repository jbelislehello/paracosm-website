import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, Plus, HardDrive, Network, FileCode, Wrench, 
  Brain, Database, MessageSquare, Shield, ArrowDown, ArrowUp,
  Layers, ChevronRight, Sparkles
} from 'lucide-react';
import { TechStackStructure } from '@/data/prdCompilation';

interface AgenticLayerDiagramProps {
  stack: TechStackStructure;
  onUpdateStack?: (layer: string, components: string[]) => void;
  readOnly?: boolean;
}

type AgenticLayerKey = keyof TechStackStructure['agentic_layers'];

interface LayerDefinition {
  id: AgenticLayerKey;
  name: string;
  shortName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  examples: string[];
  dataFlowUp: string[];
  dataFlowDown: string[];
}

const LAYER_DEFINITIONS: LayerDefinition[] = [
  {
    id: 'governance',
    name: 'L8: Governance',
    shortName: 'Governance',
    description: 'Policies, ethics, auditing, human oversight, and compliance controls',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/40',
    examples: ['Policy Engine', 'Audit Logs', 'RBAC', 'Compliance Framework', 'Human-in-loop'],
    dataFlowUp: [],
    dataFlowDown: ['Policies', 'Constraints', 'Audit Requests']
  },
  {
    id: 'application',
    name: 'L7: Application',
    shortName: 'Application',
    description: 'User-facing interfaces, chat, dashboards, and interaction surfaces',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/40',
    examples: ['Chat UI', 'Dashboard', 'Mobile App', 'Voice Interface', 'API Gateway'],
    dataFlowUp: ['User Actions', 'Feedback'],
    dataFlowDown: ['Responses', 'UI Updates']
  },
  {
    id: 'memory',
    name: 'L6: Memory',
    shortName: 'Memory',
    description: 'Short-term context, long-term knowledge, RAG, and persistent state',
    icon: <Database className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/40',
    examples: ['Vector DB', 'Context Window', 'Long-term Store', 'RAG Pipeline', 'Embeddings'],
    dataFlowUp: ['Retrieved Context', 'History'],
    dataFlowDown: ['Store Requests', 'Queries']
  },
  {
    id: 'cognition',
    name: 'L5: Cognition',
    shortName: 'Cognition',
    description: 'AI models, reasoning engines, multimodal processing, and intelligence',
    icon: <Brain className="h-5 w-5" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/40',
    examples: ['GPT-4', 'Claude', 'Gemini', 'Vision Model', 'Reasoning Engine'],
    dataFlowUp: ['Inferences', 'Decisions'],
    dataFlowDown: ['Prompts', 'Context']
  },
  {
    id: 'tooling',
    name: 'L4: Tooling',
    shortName: 'Tooling',
    description: 'External integrations, APIs, function calling, and capabilities',
    icon: <Wrench className="h-5 w-5" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/40',
    examples: ['Web Search', 'Calendar API', 'Email Integration', 'File I/O', 'Webhooks'],
    dataFlowUp: ['Tool Results', 'External Data'],
    dataFlowDown: ['Tool Calls', 'Queries']
  },
  {
    id: 'protocol',
    name: 'L3: Protocol',
    shortName: 'Protocol',
    description: 'Communication standards, task delegation, and message formats',
    icon: <FileCode className="h-5 w-5" />,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/40',
    examples: ['A2A Protocol', 'Task Delegation', 'Message Format', 'Handoff Patterns'],
    dataFlowUp: ['Structured Messages'],
    dataFlowDown: ['Protocol Specs']
  },
  {
    id: 'agent_internet',
    name: 'L2: Agent Internet',
    shortName: 'Agent Net',
    description: 'Inter-agent discovery, communication, MCP, and capability sharing',
    icon: <Network className="h-5 w-5" />,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/40',
    examples: ['MCP Server', 'Agent Registry', 'Capability Discovery', 'Multi-Agent Mesh'],
    dataFlowUp: ['Agent Responses', 'Capabilities'],
    dataFlowDown: ['Agent Requests', 'Discovery']
  },
  {
    id: 'infrastructure',
    name: 'L1: Infrastructure',
    shortName: 'Infra',
    description: 'Cloud, compute, storage, networking, and foundational services',
    icon: <HardDrive className="h-5 w-5" />,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/40',
    examples: ['Supabase', 'Vercel', 'AWS', 'Cloudflare', 'Docker'],
    dataFlowUp: ['Compute', 'Storage'],
    dataFlowDown: []
  }
];

export const AgenticLayerDiagram: React.FC<AgenticLayerDiagramProps> = ({
  stack,
  onUpdateStack,
  readOnly = false
}) => {
  const [selectedLayer, setSelectedLayer] = useState<AgenticLayerKey | null>(null);
  const [newComponent, setNewComponent] = useState('');
  const [showDataFlow, setShowDataFlow] = useState(true);

  const handleLayerClick = useCallback((layerId: AgenticLayerKey) => {
    setSelectedLayer(selectedLayer === layerId ? null : layerId);
  }, [selectedLayer]);

  const handleAddComponent = useCallback(() => {
    if (!selectedLayer || !newComponent.trim() || !onUpdateStack) return;
    const currentComponents = stack.agentic_layers[selectedLayer] || [];
    onUpdateStack(selectedLayer, [...currentComponents, newComponent.trim()]);
    setNewComponent('');
  }, [selectedLayer, newComponent, stack, onUpdateStack]);

  const handleRemoveComponent = useCallback((layerId: AgenticLayerKey, index: number) => {
    if (!onUpdateStack) return;
    const currentComponents = [...(stack.agentic_layers[layerId] || [])];
    currentComponents.splice(index, 1);
    onUpdateStack(layerId, currentComponents);
  }, [stack, onUpdateStack]);

  const selectedLayerDef = selectedLayer 
    ? LAYER_DEFINITIONS.find(l => l.id === selectedLayer)
    : null;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            8-Layer Agentic Architecture
          </CardTitle>
          <Button
            size="sm"
            variant={showDataFlow ? "secondary" : "outline"}
            onClick={() => setShowDataFlow(!showDataFlow)}
            className="text-xs h-7"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {showDataFlow ? 'Hide' : 'Show'} Flow
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interactive Layer Stack */}
        <div className="relative">
          {LAYER_DEFINITIONS.map((layer, index) => {
            const components = stack.agentic_layers[layer.id] || [];
            const isSelected = selectedLayer === layer.id;
            const hasComponents = components.length > 0;
            
            return (
              <div key={layer.id} className="relative">
                {/* Data Flow Arrows (between layers) */}
                {showDataFlow && index < LAYER_DEFINITIONS.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 z-10 flex items-center gap-1">
                    <div className="flex flex-col items-center">
                      <ArrowUp className="h-3 w-3 text-muted-foreground opacity-60" />
                      <ArrowDown className="h-3 w-3 text-muted-foreground opacity-60" />
                    </div>
                  </div>
                )}
                
                {/* Layer Card */}
                <button
                  onClick={() => handleLayerClick(layer.id)}
                  className={`
                    w-full p-3 rounded-lg border-2 mb-2 transition-all duration-200 text-left
                    ${layer.bgColor} ${isSelected ? layer.borderColor : 'border-transparent'}
                    hover:${layer.borderColor} hover:shadow-md
                    ${isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary/20' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${layer.color}`}>
                        {layer.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{layer.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {layer.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasComponents && (
                        <Badge variant="secondary" className="text-xs">
                          {components.length}
                        </Badge>
                      )}
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  {/* Component Pills Preview */}
                  {hasComponents && !isSelected && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {components.slice(0, 3).map((comp, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">
                          {comp}
                        </Badge>
                      ))}
                      {components.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{components.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Layer Configuration Panel */}
        {selectedLayerDef && (
          <Card className={`${selectedLayerDef.bgColor} ${selectedLayerDef.borderColor} border-2`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={selectedLayerDef.color}>{selectedLayerDef.icon}</span>
                  <CardTitle className="text-sm">{selectedLayerDef.name}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedLayer(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{selectedLayerDef.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Data Flow Info */}
              {showDataFlow && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedLayerDef.dataFlowUp.length > 0 && (
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">{selectedLayerDef.dataFlowUp.join(', ')}</span>
                    </div>
                  )}
                  {selectedLayerDef.dataFlowDown.length > 0 && (
                    <div className="flex items-center gap-1">
                      <ArrowDown className="h-3 w-3 text-blue-500" />
                      <span className="text-muted-foreground">{selectedLayerDef.dataFlowDown.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Current Components */}
              <div>
                <p className="text-xs font-medium mb-2">Active Components</p>
                <ScrollArea className="max-h-24">
                  <div className="flex flex-wrap gap-1">
                    {(stack.agentic_layers[selectedLayerDef.id] || []).map((comp, i) => (
                      <Badge key={i} className={`${selectedLayerDef.bgColor} ${selectedLayerDef.color} border ${selectedLayerDef.borderColor}`}>
                        {comp}
                        {!readOnly && onUpdateStack && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveComponent(selectedLayerDef.id, i);
                            }}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {(stack.agentic_layers[selectedLayerDef.id] || []).length === 0 && (
                      <span className="text-xs text-muted-foreground italic">No components configured</span>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Add Component Input */}
              {!readOnly && onUpdateStack && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add component..."
                    value={newComponent}
                    onChange={(e) => setNewComponent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComponent()}
                    className="h-8 text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddComponent}
                    disabled={!newComponent.trim()}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Suggested Components */}
              <div>
                <p className="text-xs font-medium mb-2">Suggested</p>
                <div className="flex flex-wrap gap-1">
                  {selectedLayerDef.examples
                    .filter(ex => !(stack.agentic_layers[selectedLayerDef.id] || []).includes(ex))
                    .slice(0, 5)
                    .map((example, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] px-2"
                        onClick={() => {
                          if (onUpdateStack && !readOnly) {
                            const current = stack.agentic_layers[selectedLayerDef.id] || [];
                            onUpdateStack(selectedLayerDef.id, [...current, example]);
                          }
                        }}
                        disabled={readOnly || !onUpdateStack}
                      >
                        <Plus className="h-2 w-2 mr-1" />
                        {example}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Layer Summary Stats */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t">
          {[
            { label: 'Active Layers', value: Object.values(stack.agentic_layers).filter(arr => arr.length > 0).length },
            { label: 'Components', value: Object.values(stack.agentic_layers).reduce((acc, arr) => acc + arr.length, 0) },
            { label: 'Doc Level', value: stack.maturity.documentation },
            { label: 'Automation', value: stack.maturity.automation },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold text-primary">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgenticLayerDiagram;
