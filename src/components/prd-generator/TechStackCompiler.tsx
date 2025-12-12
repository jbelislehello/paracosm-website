import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, Download, Check, Server, Database, Brain, Workflow, Monitor, Layers, 
  Network, FileCode, Wrench, HardDrive, Shield, Cpu, MessageSquare, GitBranch
} from 'lucide-react';
import { TechStackStructure, compileStackImplications, TECH_STACK_TEMPLATE } from '@/data/prdCompilation';
import { AgenticLayerDiagram } from './AgenticLayerDiagram';
import { toast } from 'sonner';

interface TechStackCompilerProps {
  projectName: string;
  stackImplications: Record<string, string>;
  isComplete: boolean;
  onStackUpdate?: (stack: TechStackStructure) => void;
}

// 8-Layer Agentic Architecture Icons
const AGENTIC_LAYER_ICONS: Record<string, React.ReactNode> = {
  infrastructure: <HardDrive className="h-4 w-4" />,
  agent_internet: <Network className="h-4 w-4" />,
  protocol: <FileCode className="h-4 w-4" />,
  tooling: <Wrench className="h-4 w-4" />,
  cognition: <Brain className="h-4 w-4" />,
  memory: <Database className="h-4 w-4" />,
  application: <MessageSquare className="h-4 w-4" />,
  governance: <Shield className="h-4 w-4" />,
};

const AGENTIC_LAYER_COLORS: Record<string, string> = {
  infrastructure: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
  agent_internet: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  protocol: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30',
  tooling: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  cognition: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  memory: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
  application: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
  governance: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
};

const AGENTIC_LAYER_NAMES: Record<string, string> = {
  infrastructure: 'L1: Infrastructure',
  agent_internet: 'L2: Agent Internet',
  protocol: 'L3: Protocol',
  tooling: 'L4: Tooling',
  cognition: 'L5: Cognition',
  memory: 'L6: Memory',
  application: 'L7: Application',
  governance: 'L8: Governance',
};

// Legacy 5-layer icons
const LAYER_ICONS: Record<string, React.ReactNode> = {
  data: <Database className="h-4 w-4" />,
  ai: <Brain className="h-4 w-4" />,
  orchestration: <Workflow className="h-4 w-4" />,
  ux: <Monitor className="h-4 w-4" />,
  ops: <Server className="h-4 w-4" />,
};

const LAYER_COLORS: Record<string, string> = {
  data: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  ai: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  orchestration: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  ux: 'bg-green-500/10 text-green-500 border-green-500/30',
  ops: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
};

export const TechStackCompiler: React.FC<TechStackCompilerProps> = ({
  projectName,
  stackImplications,
  isComplete,
  onStackUpdate
}) => {
  const [copied, setCopied] = useState(false);
  const [editableStack, setEditableStack] = useState<TechStackStructure | null>(null);
  const compiledStack = useMemo(() => {
    return compileStackImplications(stackImplications, projectName);
  }, [stackImplications, projectName]);

  // Use editable stack for interactive diagram, fall back to compiled
  const activeStack = editableStack || compiledStack;

  const jsonOutput = useMemo(() => {
    return JSON.stringify(activeStack, null, 2);
  }, [activeStack]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    toast.success('Tech Stack JSON copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-tech-stack.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Tech Stack JSON downloaded');
  };

  const handleLayerUpdate = useCallback((layer: string, components: string[]) => {
    const newStack = {
      ...(editableStack || compiledStack),
      agentic_layers: {
        ...(editableStack || compiledStack).agentic_layers,
        [layer]: components
      }
    };
    setEditableStack(newStack);
    onStackUpdate?.(newStack);
  }, [editableStack, compiledStack, onStackUpdate]);

  const agenticLayerCount = Object.values(activeStack.agentic_layers).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Tech Stack Structure Proposal
          </CardTitle>
          <div className="flex items-center gap-2">
            {isComplete ? (
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                Ready
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                {agenticLayerCount} agentic components
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="diagram" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diagram" className="text-xs">
              <GitBranch className="h-3 w-3 mr-1" />
              Diagram
            </TabsTrigger>
            <TabsTrigger value="agentic" className="text-xs">8-Layer Grid</TabsTrigger>
            <TabsTrigger value="legacy" className="text-xs">5-Layer</TabsTrigger>
          </TabsList>
          
          {/* Interactive Diagram Tab */}
          <TabsContent value="diagram" className="mt-3">
            <AgenticLayerDiagram 
              stack={activeStack}
              onUpdateStack={handleLayerUpdate}
              readOnly={false}
            />
          </TabsContent>
          
          <TabsContent value="agentic" className="mt-3 space-y-3">
            {/* 8-Layer Agentic Architecture Grid */}
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(activeStack.agentic_layers).map(([layer, components]) => (
                <div
                  key={layer}
                  className={`p-2 rounded-lg border ${AGENTIC_LAYER_COLORS[layer]} text-center transition-all hover:scale-105`}
                >
                  <div className="flex justify-center mb-1">
                    {AGENTIC_LAYER_ICONS[layer]}
                  </div>
                  <p className="text-[9px] font-medium leading-tight">{AGENTIC_LAYER_NAMES[layer]}</p>
                  <p className="text-xs text-muted-foreground font-semibold">{components.length}</p>
                </div>
              ))}
            </div>
            
            {/* Maturity Indicators */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Badge variant="outline" className="text-[10px]">
                <Cpu className="h-3 w-3 mr-1" />
                Doc: {activeStack.maturity.documentation}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <Workflow className="h-3 w-3 mr-1" />
                Auto: {activeStack.maturity.automation}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <Network className="h-3 w-3 mr-1" />
                Orch: {activeStack.maturity.orchestration}
              </Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="legacy" className="mt-3">
            {/* Legacy 5-Layer Grid */}
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(activeStack.layers).map(([layer, components]) => (
                <div
                  key={layer}
                  className={`p-2 rounded-lg border ${LAYER_COLORS[layer]} text-center`}
                >
                  <div className="flex justify-center mb-1">
                    {LAYER_ICONS[layer]}
                  </div>
                  <p className="text-[10px] font-medium uppercase">{layer}</p>
                  <p className="text-xs text-muted-foreground">{components.length}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Constraints Summary */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {activeStack.constraints.hosting}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {activeStack.constraints.sensitivity} sensitivity
          </Badge>
          {activeStack.constraints.data_residency && (
            <Badge variant="outline" className="text-xs">
              {activeStack.constraints.data_residency}
            </Badge>
          )}
        </div>

        {/* JSON Preview */}
        <ScrollArea className="h-48 rounded-lg border bg-muted/30">
          <pre className="p-3 text-xs font-mono">{jsonOutput}</pre>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="flex-1"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1" />
            )}
            {copied ? 'Copied!' : 'Copy JSON'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechStackCompiler;
