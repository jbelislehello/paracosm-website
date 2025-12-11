import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Check, Server, Database, Brain, Workflow, Monitor, Layers } from 'lucide-react';
import { TechStackStructure, compileStackImplications, TECH_STACK_TEMPLATE } from '@/data/prdCompilation';
import { toast } from 'sonner';

interface TechStackCompilerProps {
  projectName: string;
  stackImplications: Record<string, string>;
  isComplete: boolean;
}

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
  isComplete
}) => {
  const [copied, setCopied] = useState(false);

  const compiledStack = useMemo(() => {
    return compileStackImplications(stackImplications, projectName);
  }, [stackImplications, projectName]);

  const jsonOutput = useMemo(() => {
    return JSON.stringify(compiledStack, null, 2);
  }, [compiledStack]);

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

  const layerCount = Object.values(compiledStack.layers).reduce((acc, arr) => acc + arr.length, 0);

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
                {layerCount} components
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Stack Overview */}
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(compiledStack.layers).map(([layer, components]) => (
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

        {/* Constraints Summary */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {compiledStack.constraints.hosting}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {compiledStack.constraints.sensitivity} sensitivity
          </Badge>
          {compiledStack.constraints.data_residency && (
            <Badge variant="outline" className="text-xs">
              {compiledStack.constraints.data_residency}
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
