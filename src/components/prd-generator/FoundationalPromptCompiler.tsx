import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Download, Check, Bot, Sparkles, Heart } from 'lucide-react';
import { compileFoundationalPrompt, formatForLovable } from '@/data/prdCompilation';
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Compatible with:</span>
          <Badge variant="secondary" className="text-[10px]">Lovable</Badge>
          <Badge variant="secondary" className="text-[10px]">Base44</Badge>
          <Badge variant="secondary" className="text-[10px]">Custom Agents</Badge>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Primary Lovable Action */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleCopyToLovable}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                >
                  {copiedLovable ? (
                    <Check className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Heart className="h-3.5 w-3.5 mr-1" />
                  )}
                  {copiedLovable ? 'Copied for Lovable!' : 'Copy to Lovable'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Formats with proper escaping for Lovable's Knowledge settings</p>
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
              {copied ? 'Copied!' : 'Copy Raw'}
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
