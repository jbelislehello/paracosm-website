import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Download, Check, Bot, Sparkles, Heart, Hexagon, Code, MessageSquare, Smartphone } from 'lucide-react';
import { compileFoundationalPrompt, formatForLovable, formatForBase44, formatForEdgeFunction, formatForClaude, formatForTonalli } from '@/data/prdCompilation';
import { toast } from 'sonner';

interface FoundationalPromptCompilerProps {
  projectName: string;
  promptHooks: Record<string, string>;
  isComplete: boolean;
}

export const FoundationalPromptCompiler: React.FC<FoundationalPromptCompilerProps> = ({
  projectName,
  promptHooks,
  isComplete
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedLovable, setCopiedLovable] = useState(false);
  const [copiedBase44, setCopiedBase44] = useState(false);
  const [copiedEdgeFunction, setCopiedEdgeFunction] = useState(false);
  const [copiedClaude, setCopiedClaude] = useState(false);
  const [copiedTonalli, setCopiedTonalli] = useState(false);

  const compiledPrompt = useMemo(() => {
    return compileFoundationalPrompt(promptHooks, projectName);
  }, [promptHooks, projectName]);

  const sectionCount = useMemo(() => {
    return (compiledPrompt.match(/^#/gm) || []).length;
  }, [compiledPrompt]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    toast.success('Foundational Prompt copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyToLovable = async () => {
    const lovableFormatted = formatForLovable(compiledPrompt, projectName);
    await navigator.clipboard.writeText(lovableFormatted);
    setCopiedLovable(true);
    toast.success('Copied for Lovable! Paste into Project Settings → Manage Knowledge');
    setTimeout(() => setCopiedLovable(false), 2000);
  };

  const handleCopyToBase44 = async () => {
    const base44Formatted = formatForBase44(compiledPrompt, projectName);
    await navigator.clipboard.writeText(base44Formatted);
    setCopiedBase44(true);
    toast.success('Copied for Base44! Paste into AI Agent Settings');
    setTimeout(() => setCopiedBase44(false), 2000);
  };

  const handleCopyToEdgeFunction = async () => {
    const edgeFunctionCode = formatForEdgeFunction(compiledPrompt, projectName);
    await navigator.clipboard.writeText(edgeFunctionCode);
    setCopiedEdgeFunction(true);
    toast.success('Edge Function copied! Create new function file and paste');
    setTimeout(() => setCopiedEdgeFunction(false), 2000);
  };

  const handleCopyToClaude = async () => {
    const claudeFormatted = formatForClaude(compiledPrompt, projectName);
    await navigator.clipboard.writeText(claudeFormatted);
    setCopiedClaude(true);
    toast.success('Copied for Claude! XML-formatted for optimal context parsing');
    setTimeout(() => setCopiedClaude(false), 2000);
  };

  const handleCopyToTonalli = async () => {
    const tonalliFormatted = formatForTonalli(compiledPrompt, projectName);
    await navigator.clipboard.writeText(tonalliFormatted);
    setCopiedTonalli(true);
    toast.success('🦊 Copied for Tonalli! Wuxia awaits your story.', {
      description: 'Paste into Tonalli companion-io app configuration'
    });
    setTimeout(() => setCopiedTonalli(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([compiledPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-foundational-prompt.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Foundational Prompt downloaded');
  };

  // Parse sections for visual display
  const sections = useMemo(() => {
    const parts = compiledPrompt.split(/^# /m).filter(Boolean);
    return parts.map(part => {
      const [title, ...content] = part.split('\n');
      return {
        title: title.trim(),
        hasContent: content.join('\n').trim().length > 50
      };
    });
  }, [compiledPrompt]);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            Foundational Vibing Prompt
          </CardTitle>
          <div className="flex items-center gap-2">
            {isComplete ? (
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                Ready
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                {sectionCount} sections
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Section Status */}
        <div className="flex flex-wrap gap-1.5">
          {sections.map((section, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className={`text-[10px] ${
                section.hasContent 
                  ? 'bg-primary/10 text-primary border-primary/30' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {section.hasContent && <Sparkles className="h-2.5 w-2.5 mr-1" />}
              {section.title}
            </Badge>
          ))}
        </div>

        {/* Prompt Preview */}
        <ScrollArea className="h-48 rounded-lg border bg-muted/30">
          <pre className="p-3 text-xs font-mono whitespace-pre-wrap">{compiledPrompt}</pre>
        </ScrollArea>

        {/* Platform Compatibility */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span>Compatible with:</span>
          <Badge variant="secondary" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/30">Lovable</Badge>
          <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/30">Base44</Badge>
          <Badge variant="secondary" className="text-[10px] bg-violet-500/10 text-violet-500 border-violet-500/30">Claude</Badge>
          <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Edge Functions</Badge>
          <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/30">Tonalli</Badge>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Primary Platform Actions */}
          <TooltipProvider>
            <div className="grid grid-cols-4 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleCopyToLovable}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                  >
                    {copiedLovable ? (
                      <Check className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <Heart className="h-3.5 w-3.5 mr-1" />
                    )}
                    {copiedLovable ? 'Copied!' : 'Lovable'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Copy for Lovable's Project Knowledge settings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleCopyToBase44}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  >
                    {copiedBase44 ? (
                      <Check className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <Hexagon className="h-3.5 w-3.5 mr-1" />
                    )}
                    {copiedBase44 ? 'Copied!' : 'Base44'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Copy for Base44's AI Agent settings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleCopyToClaude}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                  >
                    {copiedClaude ? (
                      <Check className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    )}
                    {copiedClaude ? 'Copied!' : 'Claude'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">XML-formatted for Claude's optimal context parsing</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleCopyToTonalli}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    {copiedTonalli ? (
                      <Check className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <Smartphone className="h-3.5 w-3.5 mr-1" />
                    )}
                    {copiedTonalli ? 'Copied!' : 'Tonalli'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">🦊 Export for Tonalli companion-io with Wuxia the Fox integration</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Edge Function Export */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleCopyToEdgeFunction}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  {copiedEdgeFunction ? (
                    <Check className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Code className="h-3.5 w-3.5 mr-1" />
                  )}
                  {copiedEdgeFunction ? 'Copied!' : 'Copy as Edge Function'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Generate complete Supabase Edge Function with Lovable AI integration</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Secondary Actions */}
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
              {copied ? 'Copied!' : 'Raw'}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default FoundationalPromptCompiler;
